/**
 * Utility functions for processing pending test data during authentication flows
 */

export interface PendingTestData {
  answers: (number | null)[];
  score: number;
}

/**
 * Gets pending test data from localStorage if it exists
 */
export const getPendingTestData = (): PendingTestData | null => {
  if (typeof window === 'undefined') return null;

  const storedAnswers = localStorage.getItem('testAnswers');
  const storedScore = localStorage.getItem('testScore');

  if (!storedAnswers || !storedScore) {
    return null;
  }

  try {
    const answers = JSON.parse(storedAnswers);
    const score = parseInt(storedScore);

    // Validate data
    if (!Array.isArray(answers) || isNaN(score) || score < 0 || score > 100) {
      console.error('Invalid stored test data format');
      clearPendingTestData();
      return null;
    }

    return { answers, score };
  } catch (error) {
    console.error('Error parsing stored test data:', error);
    clearPendingTestData();
    return null;
  }
};

/**
 * Clears pending test data from localStorage
 */
export const clearPendingTestData = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('testAnswers');
  localStorage.removeItem('testScore');
};

/**
 * Processes pending test data by saving it to the database
 */
export const processPendingTestData = async (): Promise<boolean> => {
  const pendingData = getPendingTestData();

  if (!pendingData) {
    return false;
  }

  try {
    const response = await fetch('/api/test-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score: pendingData.score,
        answers: pendingData.answers,
      }),
    });

    if (response.ok) {
      console.log('Successfully processed pending test data');
      clearPendingTestData();
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to process pending test data:', errorData);
      return false;
    }
  } catch (error) {
    console.error('Error processing pending test data:', error);
    return false;
  }
};

/**
 * Shows a loading state while processing pending data
 */
export const showProcessingState = (show: boolean): void => {
  const existingIndicator = document.getElementById('test-data-processing');

  if (show && !existingIndicator) {
    const indicator = document.createElement('div');
    indicator.id = 'test-data-processing';
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        background: #2563eb;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
      ">
        <div style="
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        Test sonuçlarınız kaydediliyor...
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(indicator);
  } else if (!show && existingIndicator) {
    existingIndicator.remove();
  }
};
