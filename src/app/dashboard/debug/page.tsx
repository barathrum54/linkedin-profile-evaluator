/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Only show in development
const isDevelopment = process.env.NODE_ENV === 'development';

interface DebugData {
  currentSession: any;
  environment: {
    nodeEnv: string;
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

export default function DebugPage() {
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(
    new Set()
  );
  const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(
    new Set()
  );
  const { data: session, status } = useSession();

  // Redirect if not in development
  useEffect(() => {
    if (!isDevelopment) {
      window.location.href = '/dashboard';
      return;
    }
  }, []);

  const fetchDebugData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/debug/user-data');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch debug data');
      }

      setDebugData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleCollection = (collectionName: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionName)) {
      newExpanded.delete(collectionName);
    } else {
      newExpanded.add(collectionName);
    }
    setExpandedCollections(newExpanded);
  };

  const toggleDocument = (docId: string) => {
    const newExpanded = new Set(expandedDocuments);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedDocuments(newExpanded);
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  // Don't render anything if not in development
  if (!isDevelopment) {
    return null;
  }

  if (status === 'loading') {
    return (
      <DashboardLayout title="Debug">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Debug">
      <div className="p-6 space-y-6" data-testid="debug-content-area">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="debug-title">
                🐛 Debug Panel
              </h1>
              <p className="text-red-100">
                Development-only database inspection tool
              </p>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-lg">
              <span className="text-sm font-semibold">DEV ONLY</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Database Inspector
            </h2>
            <button
              onClick={fetchDebugData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch User Data'}
            </button>
          </div>

          {/* Current Session Info */}
          <div className="mb-6" data-testid="current-session-section">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Current Session
            </h3>
            <div className="bg-gray-100 rounded-lg p-4">
              <pre
                className="text-sm text-gray-700 whitespace-pre-wrap"
                data-testid="session-data"
              >
                {formatJson({
                  status,
                  session: session || null,
                })}
              </pre>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error:
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Debug Data Display */}
        {debugData && (
          <div className="space-y-6">
            {/* Environment Info */}
            <div
              className="bg-white rounded-xl shadow-lg p-6"
              data-testid="environment-section"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Environment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Node Environment
                  </h3>
                  <p className="text-gray-600">
                    {debugData.environment.nodeEnv}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">MongoDB</h3>
                  <p className="text-gray-600">
                    {debugData.environment.mongoUri}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">NextAuth URL</h3>
                  <p className="text-gray-600">
                    {debugData.environment.nextAuthUrl}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">
                    NextAuth Secret
                  </h3>
                  <p className="text-gray-600">
                    {debugData.environment.nextAuthSecret}
                  </p>
                </div>
              </div>
            </div>

            {/* Server Session */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Server Session Data
              </h2>
              <div className="bg-green-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {formatJson(debugData.currentSession)}
                </pre>
              </div>
            </div>

            {/* MongoDB Collections */}
            <div
              className="bg-white rounded-xl shadow-lg p-6"
              data-testid="mongodb-section"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">MongoDB</h2>

              <div className="space-y-4">
                {Object.entries(debugData.collections).map(
                  ([collectionName, collectionData]) => (
                    <div
                      key={collectionName}
                      className="border border-gray-200 rounded-lg"
                    >
                      <button
                        onClick={() => toggleCollection(collectionName)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg flex items-center justify-between text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900">
                            {collectionName}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {collectionData.totalDocuments} total
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {collectionData.userRelatedDocuments} user-related
                          </span>
                          {collectionData.error && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                              Error
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500">
                          {expandedCollections.has(collectionName) ? '▼' : '▶'}
                        </span>
                      </button>

                      {expandedCollections.has(collectionName) && (
                        <div className="p-4 space-y-3">
                          {collectionData.error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-red-700 font-semibold">
                                Error:
                              </p>
                              <p className="text-red-600">
                                {collectionData.error}
                              </p>
                            </div>
                          ) : collectionData.documents.length > 0 ? (
                            collectionData.documents.map((doc, index) => {
                              const docId = `${collectionName}-${index}`;
                              const docTitle =
                                doc.data._id ||
                                doc.data.email ||
                                doc.data.name ||
                                `Document ${index + 1}`;

                              return (
                                <div
                                  key={docId}
                                  className="border border-gray-200 rounded-lg"
                                >
                                  <button
                                    onClick={() => toggleDocument(docId)}
                                    className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-t-lg flex items-center justify-between text-left"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-gray-800">
                                        {docTitle}
                                      </span>
                                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                        {doc.searchType}
                                      </span>
                                    </div>
                                    <span className="text-gray-500">
                                      {expandedDocuments.has(docId)
                                        ? '▼'
                                        : '▶'}
                                    </span>
                                  </button>

                                  {expandedDocuments.has(docId) && (
                                    <div className="p-3 bg-gray-50 rounded-b-lg">
                                      <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                                        {formatJson(doc.data)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-gray-500 italic">
                              No user-related documents found
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
