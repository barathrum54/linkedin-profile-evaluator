import {
  questionsData,
  ratingScale,
  Question,
  RatingScale,
} from "../questions";

describe("Questions Data", () => {
  describe("questionsData", () => {
    it("should have the correct number of questions", () => {
      expect(questionsData).toHaveLength(12);
    });

    it("should have all questions with required properties", () => {
      questionsData.forEach((question: Question) => {
        expect(question).toHaveProperty("question");
        expect(question).toHaveProperty("score");
        expect(question).toHaveProperty("correctImage");
        expect(question).toHaveProperty("wrongImage");

        expect(typeof question.question).toBe("string");
        expect(typeof question.score).toBe("number");
        expect(typeof question.correctImage).toBe("string");
        expect(typeof question.wrongImage).toBe("string");
      });
    });

    it("should have non-empty question texts", () => {
      questionsData.forEach((question: Question) => {
        expect(question.question.length).toBeGreaterThan(0);
      });
    });

    it("should have positive scores", () => {
      questionsData.forEach((question: Question) => {
        expect(question.score).toBeGreaterThan(0);
      });
    });

    it("should have valid image paths", () => {
      questionsData.forEach((question: Question) => {
        expect(question.correctImage).toMatch(/^\/images\/\d+\.jpg$/);
        expect(question.wrongImage).toMatch(/^\/images\/\d+-w\.jpg$/);
      });
    });

    it("should have total score of 100", () => {
      const totalScore = questionsData.reduce(
        (sum, question) => sum + question.score,
        0
      );
      expect(totalScore).toBe(100);
    });

    it("should have unique questions", () => {
      const questionTexts = questionsData.map((q) => q.question);
      const uniqueQuestions = new Set(questionTexts);
      expect(uniqueQuestions.size).toBe(questionsData.length);
    });

    it("should have unique image paths", () => {
      const correctImages = questionsData.map((q) => q.correctImage);
      const wrongImages = questionsData.map((q) => q.wrongImage);

      const uniqueCorrectImages = new Set(correctImages);
      const uniqueWrongImages = new Set(wrongImages);

      expect(uniqueCorrectImages.size).toBe(questionsData.length);
      expect(uniqueWrongImages.size).toBe(questionsData.length);
    });

    it("should have questions with Turkish content", () => {
      questionsData.forEach((question: Question) => {
        // Check for Turkish characters or common Turkish words
        const hasTurkishContent = /[çğıöşüÇĞIİÖŞÜ]|mi\?|mu\?|mı\?|mü\?/.test(
          question.question
        );
        expect(hasTurkishContent).toBe(true);
      });
    });

    it("should have reasonable score distribution", () => {
      const scores = questionsData.map((q) => q.score);
      const minScore = Math.min(...scores);
      const maxScore = Math.max(...scores);

      expect(minScore).toBeGreaterThanOrEqual(5);
      expect(maxScore).toBeLessThanOrEqual(15);
    });
  });

  describe("ratingScale", () => {
    it("should have 5 rating levels", () => {
      expect(ratingScale).toHaveLength(5);
    });

    it("should have all rating levels with required properties", () => {
      ratingScale.forEach((rating: RatingScale) => {
        expect(rating).toHaveProperty("value");
        expect(rating).toHaveProperty("label");
        expect(rating).toHaveProperty("multiplier");

        expect(typeof rating.value).toBe("number");
        expect(typeof rating.label).toBe("string");
        expect(typeof rating.multiplier).toBe("number");
      });
    });

    it("should have sequential values from 1 to 5", () => {
      const values = ratingScale.map((r) => r.value);
      expect(values).toEqual([1, 2, 3, 4, 5]);
    });

    it("should have increasing multipliers", () => {
      const multipliers = ratingScale.map((r) => r.multiplier);
      for (let i = 1; i < multipliers.length; i++) {
        expect(multipliers[i]).toBeGreaterThan(multipliers[i - 1]);
      }
    });

    it("should have multipliers between 0 and 1", () => {
      ratingScale.forEach((rating: RatingScale) => {
        expect(rating.multiplier).toBeGreaterThanOrEqual(0);
        expect(rating.multiplier).toBeLessThanOrEqual(1);
      });
    });

    it("should have non-empty labels", () => {
      ratingScale.forEach((rating: RatingScale) => {
        expect(rating.label.length).toBeGreaterThan(0);
      });
    });

    it("should have Turkish labels", () => {
      ratingScale.forEach((rating: RatingScale) => {
        // Check for Turkish characters or common Turkish words
        const hasTurkishContent = /[çğıöşüÇĞIİÖŞÜ]|ve|ile|açık|hazır/.test(
          rating.label
        );
        expect(hasTurkishContent).toBe(true);
      });
    });

    it("should have correct multiplier values", () => {
      const expectedMultipliers = [0.2, 0.4, 0.6, 0.8, 1.0];
      const actualMultipliers = ratingScale.map((r) => r.multiplier);
      expect(actualMultipliers).toEqual(expectedMultipliers);
    });

    it("should have descriptive labels that reflect progression", () => {
      const labels = ratingScale.map((r) => r.label);

      // First should indicate not started
      expect(labels[0]).toContain("Henüz");

      // Last should indicate best/strategic
      expect(labels[4]).toContain("Stratejik");
    });
  });

  describe("Data consistency", () => {
    it("should have consistent data types", () => {
      // Check Question interface consistency
      expect(questionsData[0]).toMatchObject({
        question: expect.any(String),
        score: expect.any(Number),
        correctImage: expect.any(String),
        wrongImage: expect.any(String),
      });

      // Check RatingScale interface consistency
      expect(ratingScale[0]).toMatchObject({
        value: expect.any(Number),
        label: expect.any(String),
        multiplier: expect.any(Number),
      });
    });

    it("should be exportable as modules", () => {
      expect(questionsData).toBeDefined();
      expect(ratingScale).toBeDefined();
      expect(Array.isArray(questionsData)).toBe(true);
      expect(Array.isArray(ratingScale)).toBe(true);
    });
  });
});
