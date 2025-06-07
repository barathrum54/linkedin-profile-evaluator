import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook that automatically processes pending test data from localStorage when a user authenticates.
 *
 * This solves the problem where unauthenticated users complete tests, store results in localStorage,
 * then later sign up or log in. Without this hook, their test results would be lost.
 *
 * Flow:
 * 1. User takes test without being authenticated
 * 2. Test results are stored in localStorage (testAnswers, testScore)
 * 3. User navigates to results page to see their score
 * 4. User decides to sign up/login to save results permanently
 * 5. Upon authentication, this hook automatically detects localStorage data
 * 6. Hook saves the data to database via API
 * 7. Hook clears localStorage data after successful save
 * 8. User can now access their results in dashboard
 *
 * @returns {Object} Object containing isProcessing and hasProcessed states
 */
export const usePendingTestData = () => {
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const processPendingTestData = async () => {
      // Only process if user just authenticated and we haven't processed yet
      if (
        status !== 'authenticated' ||
        !session?.user ||
        hasProcessed ||
        isProcessing
      ) {
        return;
      }

      // Check for pending test data in localStorage
      const storedAnswers = localStorage.getItem('testAnswers');
      const storedScore = localStorage.getItem('testScore');

      if (!storedAnswers || !storedScore) {
        return;
      }

      console.log('Found pending test data, saving to database...');
      setIsProcessing(true);

      try {
        // Validate and parse the stored data
        const answers = JSON.parse(storedAnswers);
        const score = parseInt(storedScore);

        // Validate that answers is an array and score is a valid number
        if (
          !Array.isArray(answers) ||
          isNaN(score) ||
          score < 0 ||
          score > 100
        ) {
          console.error('Invalid stored test data format');
          // Clear invalid data
          localStorage.removeItem('testAnswers');
          localStorage.removeItem('testScore');
          setHasProcessed(true);
          return;
        }

        const response = await fetch('/api/test-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score,
            answers,
          }),
        });

        if (response.ok) {
          console.log('Successfully saved pending test data to database');
          // Clear localStorage after successful save
          localStorage.removeItem('testAnswers');
          localStorage.removeItem('testScore');
          setHasProcessed(true);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Failed to save pending test data:', errorData);
        }
      } catch (error) {
        console.error('Error processing pending test data:', error);
        // If the stored data is malformed, clear it
        if (error instanceof SyntaxError) {
          localStorage.removeItem('testAnswers');
          localStorage.removeItem('testScore');
          setHasProcessed(true);
        }
      } finally {
        setIsProcessing(false);
      }
    };

    processPendingTestData();
  }, [session, status, hasProcessed, isProcessing]);

  return {
    isProcessing,
    hasProcessed,
  };
};
