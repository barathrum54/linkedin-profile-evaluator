/* eslint-disable @typescript-eslint/no-explicit-any */

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);

interface DebugData {
  currentSession: any;
  environment: {
    nodeEnv: string | undefined;
    mongoUri: string;
    nextAuthUrl: string;
    nextAuthSecret: string;
  };
  mongodb: {
    connected: boolean;
    database: string;
  };
  collections: Record<
    string,
    {
      totalDocuments: number;
      userRelatedDocuments: number;
      documents: any[];
      error?: string;
    }
  >;
}

export async function GET() {
  try {
    // Check if we're in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Debug API only available in development' },
        { status: 403 }
      );
    }

    // Get current session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No authenticated user' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db();

    const userEmail = session.user.email;
    const userId = session.user.id;

    console.log(
      'Debug API - Fetching data for user:',
      userEmail,
      'ID:',
      userId
    );

    // Fetch all user-related data from different collections
    const debugData: DebugData = {
      currentSession: session,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongoUri: process.env.MONGODB_URI ? '***CONFIGURED***' : 'NOT SET',
        nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
        nextAuthSecret: process.env.NEXTAUTH_SECRET
          ? '***CONFIGURED***'
          : 'NOT SET',
      },
      mongodb: {
        connected: true,
        database: db.databaseName,
      },
      collections: {},
    };

    // Get all collections in the database
    const collections = await db.listCollections().toArray();
    console.log(
      'Available collections:',
      collections.map(c => c.name)
    );

    // Search for user data in each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      const coll = db.collection(collectionName);

      try {
        let userData: any[] = [];

        // Try different search strategies for each collection
        if (collectionName === 'users') {
          // Search by email and by ObjectId
          const userByEmail = await coll.findOne({ email: userEmail });
          const userById = userId
            ? await coll.findOne({ _id: new ObjectId(userId) })
            : null;

          if (userByEmail)
            userData.push({ searchType: 'email', data: userByEmail });
          if (
            userById &&
            userById._id.toString() !== userByEmail?._id.toString()
          ) {
            userData.push({ searchType: 'objectId', data: userById });
          }
        } else if (collectionName === 'accounts') {
          // Search for OAuth accounts linked to this user
          const accounts = await coll
            .find({
              $or: [
                { userId: userId },
                { userId: new ObjectId(userId) },
                { userEmail: userEmail },
              ],
            })
            .toArray();
          userData = accounts.map(acc => ({
            searchType: 'userId',
            data: acc,
          }));
        } else if (collectionName === 'sessions') {
          // Search for sessions
          const sessions = await coll
            .find({
              $or: [
                { userId: userId },
                { userId: new ObjectId(userId) },
                { userEmail: userEmail },
              ],
            })
            .toArray();
          userData = sessions.map(sess => ({
            searchType: 'userId',
            data: sess,
          }));
        } else {
          // For other collections, search by common fields
          const searchQueries: any[] = [
            { email: userEmail },
            { userEmail: userEmail },
            { userId: userId },
            { user: userEmail },
          ];

          if (userId) {
            searchQueries.push({ _id: new ObjectId(userId) });
          }

          for (const query of searchQueries) {
            const results = await coll.find(query).limit(10).toArray();
            if (results.length > 0) {
              userData.push(
                ...results.map(result => ({
                  searchType: Object.keys(query)[0],
                  data: result,
                }))
              );
            }
          }
        }

        if (userData.length > 0) {
          debugData.collections[collectionName] = {
            totalDocuments: await coll.countDocuments(),
            userRelatedDocuments: userData.length,
            documents: userData,
          };
        } else {
          // Even if no user data, show collection exists
          debugData.collections[collectionName] = {
            totalDocuments: await coll.countDocuments(),
            userRelatedDocuments: 0,
            documents: [],
          };
        }
      } catch (error) {
        debugData.collections[collectionName] = {
          error: error instanceof Error ? error.message : String(error),
          totalDocuments: 0,
          userRelatedDocuments: 0,
          documents: [],
        };
      }
    }

    await client.close();

    console.log(
      'Debug API - Returning data for collections:',
      Object.keys(debugData.collections)
    );

    return NextResponse.json(debugData, { status: 200 });
  } catch (error) {
    console.error('Debug API Error:', error);
    try {
      await client.close();
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch debug data',
        details: error instanceof Error ? error.message : String(error),
        stack:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
