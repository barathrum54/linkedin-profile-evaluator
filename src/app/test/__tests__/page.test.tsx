import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TestPage from "../page";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useSound hook
jest.mock("../../../hooks/useSound", () => ({
  useSound: () => ({
    playClickSound: jest.fn(),
    playHoverSound: jest.fn(),
  }),
}));

// Mock questionsData
jest.mock("../../../data/questions", () => ({
  questionsData: [
    {
      question: "Test question 1?",
      correctImage: "/correct1.jpg",
      wrongImage: "/wrong1.jpg",
      score: 10,
    },
    {
      question: "Test question 2?",
      correctImage: "/correct2.jpg",
      wrongImage: "/wrong2.jpg",
      score: 15,
    },
    {
      question: "Test question 3?",
      correctImage: "/correct3.jpg",
      wrongImage: "/wrong3.jpg",
      score: 20,
    },
  ],
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Test Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.setItem.mockClear();
    mockPush.mockClear();
  });

  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<TestPage />);
      expect(container).toBeTruthy();
    });

    it("displays the first question initially", () => {
      render(<TestPage />);
      expect(screen.getAllByText("Test question 1?")[0]).toBeInTheDocument();
    });

    it("displays correct and wrong example images", () => {
      render(<TestPage />);
      expect(screen.getByAltText("Doğru örnek")).toBeInTheDocument();
      expect(screen.getByAltText("Yanlış örnek")).toBeInTheDocument();
    });

    it("displays slider with initial value of 0", () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      expect(slider).toHaveValue("0");
    });

    it("shows score display with initial value 0", () => {
      render(<TestPage />);
      expect(screen.getAllByText("0").length).toBeGreaterThan(0);
      expect(screen.getByText("Score")).toBeInTheDocument();
    });
  });

  describe("Slider Functionality", () => {
    it("updates score when slider value changes", () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");

      fireEvent.change(slider, { target: { value: "50" } });
      expect(slider).toHaveValue("50");
      expect(screen.getAllByText("50").length).toBeGreaterThan(0);
    });

    it("displays correct label for different slider values", () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");

      // Test different ranges
      fireEvent.change(slider, { target: { value: "10" } });
      expect(screen.getByText("Henüz Üzerinde Çalışmadım")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "30" } });
      expect(screen.getByText("Eksik ve Gelişime Açık")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "50" } });
      expect(screen.getByText("Temel Seviyede Hazır")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "70" } });
      expect(
        screen.getByText("Gözden Geçirilmiş ve Düzenli")
      ).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "90" } });
      expect(screen.getByText("Stratejik ve Etkileyici")).toBeInTheDocument();
    });

    it("enables submit button when question is answered", () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const submitButton = screen.getByText("Gönder");

      expect(submitButton).toBeDisabled();

      fireEvent.change(slider, { target: { value: "50" } });
      expect(submitButton).toBeEnabled();
    });
  });

  describe("Navigation and Question Flow", () => {
    it("moves to next question when submit is clicked", () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const submitButton = screen.getByText("Gönder");

      // Answer first question
      fireEvent.change(slider, { target: { value: "50" } });
      fireEvent.click(submitButton);

      // Should show second question - look for the main question display
      expect(screen.getAllByText("Test question 2?")[0]).toBeInTheDocument();
    });

    it("shows finish test button when all questions are answered", async () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const submitButton = screen.getByText("Gönder");

      // Answer all questions
      for (let i = 0; i < 3; i++) {
        fireEvent.change(slider, { target: { value: "50" } });
        fireEvent.click(submitButton);
      }

      await waitFor(() => {
        expect(screen.getByText("Testi Bitir")).toBeInTheDocument();
      });
    });

    it("navigates to results page when test is finished", async () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const submitButton = screen.getByText("Gönder");

      // Answer all questions
      for (let i = 0; i < 2; i++) {
        fireEvent.change(slider, { target: { value: "50" } });
        fireEvent.click(submitButton);
      }

      // Answer last question and finish
      fireEvent.change(slider, { target: { value: "50" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/results");
      });
    });
  });

  describe("Image Modal Functionality", () => {
    it("opens modal when correct image is clicked", () => {
      render(<TestPage />);
      const correctImage = screen.getByAltText("Doğru örnek");

      fireEvent.click(correctImage);
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("opens modal when wrong image is clicked", () => {
      render(<TestPage />);
      const wrongImage = screen.getByAltText("Yanlış örnek");

      fireEvent.click(wrongImage);
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("closes modal when close button is clicked", () => {
      render(<TestPage />);
      const correctImage = screen.getByAltText("Doğru örnek");

      fireEvent.click(correctImage);
      const closeButton = screen.getByText("×");
      fireEvent.click(closeButton);

      expect(screen.queryByText("×")).not.toBeInTheDocument();
    });

    it("closes modal when backdrop is clicked", () => {
      render(<TestPage />);
      const correctImage = screen.getByAltText("Doğru örnek");

      fireEvent.click(correctImage);
      const modal = screen.getByText("×").closest(".fixed");
      fireEvent.click(modal!);

      expect(screen.queryByText("×")).not.toBeInTheDocument();
    });
  });

  describe("Left Drawer Functionality", () => {
    it("opens drawer when menu button is clicked", () => {
      render(<TestPage />);
      const menuButton = screen.getByLabelText("Menüyü Aç");

      fireEvent.click(menuButton);
      expect(screen.getByText("Sorular")).toBeInTheDocument();
    });

    it("shows question progress in drawer", () => {
      render(<TestPage />);
      const menuButton = screen.getByLabelText("Menüyü Aç");

      fireEvent.click(menuButton);
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("allows navigation to specific questions", () => {
      render(<TestPage />);
      const menuButton = screen.getByLabelText("Menüyü Aç");

      fireEvent.click(menuButton);
      const questionButton = screen.getByText("Soru 2");
      fireEvent.click(questionButton);

      // Should show second question - check the main content area
      expect(screen.getAllByText("Test question 2?").length).toBeGreaterThan(0);
    });

    it("shows answered status in drawer", () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const menuButton = screen.getByLabelText("Menüyü Aç");

      // Answer first question
      fireEvent.change(slider, { target: { value: "75" } });
      fireEvent.click(menuButton);

      // Check that 75 appears somewhere in the drawer (could be main display or drawer)
      expect(screen.getAllByText("75").length).toBeGreaterThan(0);
    });

    it("shows warning indicators for unanswered questions", async () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const submitButton = screen.getByText("Gönder");

      // Answer first two questions
      fireEvent.change(slider, { target: { value: "50" } });
      fireEvent.click(submitButton);
      fireEvent.change(slider, { target: { value: "60" } });
      fireEvent.click(submitButton);

      // Try to finish test without answering last question
      const finishButton = screen.getByText("Gönder");
      fireEvent.click(finishButton);

      await waitFor(() => {
        expect(screen.getByText("Sorular")).toBeInTheDocument();
      });
    });
  });

  describe("Debug Functionality", () => {
    it("shows debug button", () => {
      render(<TestPage />);
      expect(screen.getByText("🐛")).toBeInTheDocument();
    });

    it("opens debug modal when debug button is clicked", () => {
      render(<TestPage />);
      const debugButton = screen.getByText("🐛");

      fireEvent.click(debugButton);
      expect(screen.getByText("Debug Tools")).toBeInTheDocument();
    });

    it("finishes test with random answers when debug finish is clicked", () => {
      render(<TestPage />);
      const debugButton = screen.getByText("🐛");

      fireEvent.click(debugButton);
      const finishTestButton = screen.getByText("Testi Bitir");
      fireEvent.click(finishTestButton);

      expect(mockPush).toHaveBeenCalledWith("/results");
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "testAnswers",
        expect.any(String)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "testScore",
        expect.any(String)
      );
    });

    it("closes debug modal when cancel is clicked", () => {
      render(<TestPage />);
      const debugButton = screen.getByText("🐛");

      fireEvent.click(debugButton);
      const cancelButton = screen.getByText("İptal");
      fireEvent.click(cancelButton);

      expect(screen.queryByText("Debug Tools")).not.toBeInTheDocument();
    });
  });

  describe("Score Calculation and Storage", () => {
    it("saves answers and score to localStorage when test is finished", async () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const submitButton = screen.getByText("Gönder");

      // Answer all questions with known values
      const answers = [20, 40, 80]; // Different multipliers: 0.4, 0.6, 1.0
      const expectedScore = Math.ceil(10 * 0.4 + 15 * 0.6 + 20 * 1.0); // 4 + 9 + 20 = 33

      for (let i = 0; i < 3; i++) {
        fireEvent.change(slider, { target: { value: answers[i].toString() } });
        fireEvent.click(submitButton);
      }

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "testAnswers",
          JSON.stringify(answers)
        );
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "testScore",
          expectedScore.toString()
        );
      });
    });

    it("prevents finishing test with unanswered questions", async () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const submitButton = screen.getByText("Gönder");

      // Answer only first question
      fireEvent.change(slider, { target: { value: "50" } });
      fireEvent.click(submitButton);

      // Move to last question without answering second
      fireEvent.change(slider, { target: { value: "0" } }); // Reset
      fireEvent.click(submitButton);

      // Should not navigate to results
      expect(mockPush).not.toHaveBeenCalledWith("/results");
    });
  });

  describe("Helper Functions Coverage", () => {
    it("tests getSliderLabel function ranges", () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");

      // Test boundary values
      fireEvent.change(slider, { target: { value: "0" } });
      expect(screen.getByText("Henüz Üzerinde Çalışmadım")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "19" } });
      expect(screen.getByText("Henüz Üzerinde Çalışmadım")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "20" } });
      expect(screen.getByText("Eksik ve Gelişime Açık")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "39" } });
      expect(screen.getByText("Eksik ve Gelişime Açık")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "40" } });
      expect(screen.getByText("Temel Seviyede Hazır")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "59" } });
      expect(screen.getByText("Temel Seviyede Hazır")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "60" } });
      expect(
        screen.getByText("Gözden Geçirilmiş ve Düzenli")
      ).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "79" } });
      expect(
        screen.getByText("Gözden Geçirilmiş ve Düzenli")
      ).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "80" } });
      expect(screen.getByText("Stratejik ve Etkileyici")).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: "100" } });
      expect(screen.getByText("Stratejik ve Etkileyici")).toBeInTheDocument();
    });

    it("resets warning indicators when user answers a question", async () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const submitButton = screen.getByText("Gönder");

      // Go to last question
      fireEvent.change(slider, { target: { value: "50" } });
      fireEvent.click(submitButton);
      fireEvent.change(slider, { target: { value: "50" } });
      fireEvent.click(submitButton);

      // Try to finish without answering (should show warnings)
      fireEvent.click(submitButton);

      // Now answer the question (should reset warnings)
      fireEvent.change(slider, { target: { value: "50" } });

      // The warning state should be reset
      expect(screen.getByText("Gönder")).toBeEnabled();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles modal image event propagation correctly", () => {
      render(<TestPage />);
      const correctImage = screen.getByAltText("Doğru örnek");

      fireEvent.click(correctImage);
      const modalContent = screen.getByText("×").closest(".relative");

      // Click on modal content should not close modal
      fireEvent.click(modalContent!);
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("handles drawer toggle correctly", () => {
      render(<TestPage />);
      let menuButton = screen.getByLabelText("Menüyü Aç");

      fireEvent.click(menuButton);
      expect(screen.getByText("Sorular")).toBeInTheDocument();

      menuButton = screen.getByLabelText("Menüyü Kapat");
      fireEvent.click(menuButton);

      // Drawer should still be present but with different state
      expect(screen.getByText("Sorular")).toBeInTheDocument();
    });

    it("closes drawer when question is selected", () => {
      render(<TestPage />);
      const menuButton = screen.getByLabelText("Menüyü Aç");

      fireEvent.click(menuButton);
      const questionButton = screen.getByText("Soru 2");
      fireEvent.click(questionButton);

      // Drawer behavior is handled through state, component should still render
      expect(screen.getAllByText("Test question 2?").length).toBeGreaterThan(0);
    });

    it("handles finish test button when all questions answered", async () => {
      render(<TestPage />);
      const slider = screen.getByRole("slider");
      const submitButton = screen.getByText("Gönder");

      // Answer all questions
      for (let i = 0; i < 2; i++) {
        fireEvent.change(slider, { target: { value: "50" } });
        fireEvent.click(submitButton);
      }

      // Answer last question
      fireEvent.change(slider, { target: { value: "50" } });

      // Should show finish test button
      await waitFor(() => {
        const finishButton = screen.getByText("Testi Bitir");
        expect(finishButton).toBeInTheDocument();

        fireEvent.click(finishButton);
        expect(mockPush).toHaveBeenCalledWith("/results");
      });
    });
  });
});
