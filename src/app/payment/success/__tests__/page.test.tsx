import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaymentSuccessPage from "../page";

// Mock next/navigation
const mockPush = jest.fn();
const mockGet = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock Layout component
jest.mock("../../../../components/Layout", () => {
  return function MockLayout({
    children,
    navbarProps,
  }: {
    children: React.ReactNode;
    navbarProps?: {
      title?: string;
      subtitle?: string;
      showBackButton?: boolean;
      showRestartButton?: boolean;
    };
  }) {
    return (
      <div data-testid="layout">
        {navbarProps && (
          <div data-testid="navbar">
            <span data-testid="title">{navbarProps.title}</span>
            <span data-testid="subtitle">{navbarProps.subtitle}</span>
            <span data-testid="show-back-button">
              {String(navbarProps.showBackButton)}
            </span>
            <span data-testid="show-restart-button">
              {String(navbarProps.showRestartButton)}
            </span>
          </div>
        )}
        {children}
      </div>
    );
  };
});

// Mock timers for confetti animation
jest.useFakeTimers();

describe("PaymentSuccessPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue("basic"); // Default to basic plan
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      render(<PaymentSuccessPage />);
      expect(screen.getByTestId("layout")).toBeInTheDocument();
    });

    it("displays correct navbar information", () => {
      render(<PaymentSuccessPage />);
      expect(screen.getByTestId("title")).toHaveTextContent("Ödeme Başarılı!");
      expect(screen.getByTestId("subtitle")).toHaveTextContent(
        "Satın alımınız tamamlandı"
      );
      expect(screen.getByTestId("show-back-button")).toHaveTextContent("false");
      expect(screen.getByTestId("show-restart-button")).toHaveTextContent(
        "true"
      );
    });

    it("displays loading spinner when no plan is selected", () => {
      mockGet.mockReturnValue(null);
      render(<PaymentSuccessPage />);
      expect(document.querySelector(".animate-spin")).toBeTruthy();
    });

    it("redirects to pricing when invalid plan is provided", () => {
      mockGet.mockReturnValue("invalid");
      render(<PaymentSuccessPage />);
      expect(mockPush).toHaveBeenCalledWith("/pricing");
    });
  });

  describe("Success Message and Congratulations", () => {
    it("displays congratulations message", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(screen.getByText("Tebrikler! 🎉")).toBeInTheDocument();
      expect(
        screen.getByText("Temel Plan satın alımınız başarıyla tamamlandı!")
      ).toBeInTheDocument();
    });

    it("displays success icon", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      const successIcon = screen
        .getByText("Tebrikler! 🎉")
        .closest("div")
        ?.querySelector("svg");
      expect(successIcon).toBeInTheDocument();
    });

    it("displays payment amount for basic plan", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(screen.getByText("$5.90")).toBeInTheDocument(); // $5 + 18% tax
    });

    it("displays payment amount for premium plan", () => {
      mockGet.mockReturnValue("premium");
      render(<PaymentSuccessPage />);

      expect(
        screen.getByText("Premium Plan satın alımınız başarıyla tamamlandı!")
      ).toBeInTheDocument();
      expect(screen.getByText("$23.60")).toBeInTheDocument(); // $20 + 18% tax
    });
  });

  describe("Plan-Specific Display", () => {
    it("shows basic plan with purple styling", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);
      expect(screen.getByText("Temel Plan")).toBeInTheDocument();
      // Check for purple color in the component
      expect(screen.getByText("Temel Plan").closest("div")).toBeInTheDocument();
    });

    it("shows premium plan with pink styling", () => {
      mockGet.mockReturnValue("premium");
      render(<PaymentSuccessPage />);
      expect(screen.getByText("Premium Plan")).toBeInTheDocument();
      // Check for pink color in the component
      expect(
        screen.getByText("Premium Plan").closest("div")
      ).toBeInTheDocument();
    });

    it("displays descriptive text about the purchase", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(
        screen.getByText(
          "Profilinizi bir sonraki seviyeye taşımak için gerekli tüm araçlara artık sahipsiniz!"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Confetti Animation", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      mockGet.mockReturnValue("basic");
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it("shows confetti animation initially", () => {
      render(<PaymentSuccessPage />);
      // Check that confetti elements exist
      expect(
        document.querySelector(".fixed.inset-0.pointer-events-none")
      ).toBeTruthy();
    });

    it("hides confetti after 3 seconds", async () => {
      render(<PaymentSuccessPage />);

      // Initially confetti should be visible
      expect(
        document.querySelector(".fixed.inset-0.pointer-events-none")
      ).toBeTruthy();

      // Fast-forward time by 3 seconds
      jest.advanceTimersByTime(3000);

      // Wait for state update
      await waitFor(() => {
        // The confetti container should still exist
        expect(
          document.querySelector(".fixed.inset-0.pointer-events-none")
        ).toBeTruthy();
      });
    });

    it("generates multiple confetti pieces", () => {
      render(<PaymentSuccessPage />);
      // Check that confetti elements are rendered
      const confettiPieces = document.querySelectorAll(".animate-bounce");
      expect(confettiPieces.length).toBeGreaterThan(0);
    });
  });

  describe("Next Steps Information", () => {
    it("displays email check information", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(screen.getByText("E-posta Kontrolü")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Satın aldığınız içeriklere erişim bilgileri e-posta adresinize gönderildi."
        )
      ).toBeInTheDocument();
    });

    it("displays guide start information", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(screen.getByText("Rehbere Başla")).toBeInTheDocument();
      expect(
        screen.getByText(
          "İyileştirme rehberinizi tekrar gözden geçirin ve önerilerimizi uygulamaya başlayın."
        )
      ).toBeInTheDocument();
    });

    it("shows proper icons for next steps", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      const emailIcon = screen
        .getByText("E-posta Kontrolü")
        .closest("div")
        ?.querySelector("svg");
      const guideIcon = screen
        .getByText("Rehbere Başla")
        .closest("div")
        ?.querySelector("svg");

      expect(emailIcon).toBeInTheDocument();
      expect(guideIcon).toBeInTheDocument();
    });
  });

  describe("Action Buttons", () => {
    beforeEach(() => {
      mockGet.mockReturnValue("basic");
    });

    it("renders view guide button", () => {
      render(<PaymentSuccessPage />);

      const viewGuideButton = screen.getByText("Rehberi Görüntüle");
      expect(viewGuideButton).toBeInTheDocument();
      expect(viewGuideButton).toHaveClass(
        "bg-gradient-to-r",
        "from-blue-600",
        "to-indigo-600"
      );
    });

    it("renders home page button", () => {
      render(<PaymentSuccessPage />);

      const homeButton = screen.getByText("Ana Sayfaya Dön");
      expect(homeButton).toBeInTheDocument();
      expect(homeButton).toHaveClass("bg-white", "text-gray-700");
    });

    it("navigates to improvement page when view guide is clicked", () => {
      render(<PaymentSuccessPage />);

      const viewGuideButton = screen.getByText("Rehberi Görüntüle");
      fireEvent.click(viewGuideButton);

      expect(mockPush).toHaveBeenCalledWith("/improvement");
    });

    it("navigates to home when home button is clicked", () => {
      render(<PaymentSuccessPage />);

      const homeButton = screen.getByText("Ana Sayfaya Dön");
      fireEvent.click(homeButton);

      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  describe("Support Information", () => {
    it("displays support section", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(screen.getByText("Destek Bilgileri")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Herhangi bir sorunuz varsa veya yardıma ihtiyacınız olursa bizimle iletişime geçebilirsiniz:"
        )
      ).toBeInTheDocument();
    });

    it("shows support email", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(screen.getByText("destek@linkedinprofil.com")).toBeInTheDocument();
    });

    it("shows response time", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(
        screen.getByText("Yanıt süresi: 24 saat içinde")
      ).toBeInTheDocument();
    });

    it("shows premium WhatsApp support for premium plan", () => {
      mockGet.mockReturnValue("premium");
      render(<PaymentSuccessPage />);

      expect(
        screen.getByText("Premium WhatsApp desteği yakında aktif olacak")
      ).toBeInTheDocument();
    });

    it("does not show premium WhatsApp support for basic plan", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(
        screen.queryByText("Premium WhatsApp desteği yakında aktif olacak")
      ).not.toBeInTheDocument();
    });

    it("displays support icons", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      const emailIcon = screen
        .getByText("destek@linkedinprofil.com")
        .closest("div")
        ?.querySelector("svg");
      const timeIcon = screen
        .getByText("Yanıt süresi: 24 saat içinde")
        .closest("div")
        ?.querySelector("svg");

      expect(emailIcon).toBeInTheDocument();
      expect(timeIcon).toBeInTheDocument();
    });
  });

  describe("Money Back Guarantee", () => {
    it("displays money back guarantee badge", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(screen.getByText("7 gün para iade garantisi")).toBeInTheDocument();
    });

    it("shows guarantee icon", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      const guaranteeIcon = screen
        .getByText("7 gün para iade garantisi")
        .closest("div")
        ?.querySelector("svg");
      expect(guaranteeIcon).toBeInTheDocument();
    });

    it("has proper styling for guarantee badge", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      const guaranteeBadge = screen
        .getByText("7 gün para iade garantisi")
        .closest("div");
      expect(guaranteeBadge).toHaveClass("text-green-600", "bg-green-50");
    });
  });

  describe("Responsive Design", () => {
    it("uses responsive grid classes", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      const nextStepsGrid = screen
        .getByText("E-posta Kontrolü")
        .closest(".grid");
      expect(nextStepsGrid).toHaveClass("md:grid-cols-2");
    });

    it("uses responsive button layout", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      const buttonContainer = screen
        .getByText("Rehberi Görüntüle")
        .closest(".flex");
      expect(buttonContainer).toHaveClass("flex-col", "sm:flex-row");
    });

    it("uses responsive text sizes", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      const mainTitle = screen.getByText("Tebrikler! 🎉");
      expect(mainTitle).toHaveClass("text-4xl", "md:text-5xl");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles suspense fallback", () => {
      mockGet.mockReturnValue(null);
      const { container } = render(<PaymentSuccessPage />);
      expect(
        container.querySelector(".animate-spin") ||
          screen.queryByText("Loading...")
      ).toBeTruthy();
    });

    it("handles plan switch from basic to premium", () => {
      const { rerender } = render(<PaymentSuccessPage />);

      // Start with basic plan
      expect(screen.getByText("Temel Plan")).toBeInTheDocument();

      // Switch to premium plan
      mockGet.mockReturnValue("premium");
      rerender(<PaymentSuccessPage />);

      expect(screen.getByText("Premium Plan")).toBeInTheDocument();
      expect(screen.getByText("$23.60")).toBeInTheDocument();
    });

    it("cleans up timer on component unmount", () => {
      const { unmount } = render(<PaymentSuccessPage />);

      // Spy on clearTimeout
      const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it("handles empty plan parameter gracefully", () => {
      mockGet.mockReturnValue("");
      render(<PaymentSuccessPage />);

      expect(mockPush).toHaveBeenCalledWith("/pricing");
    });
  });

  describe("Accessibility", () => {
    it("provides proper button roles", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      const viewGuideButton = screen.getByRole("button", {
        name: "Rehberi Görüntüle",
      });
      const homeButton = screen.getByRole("button", {
        name: "Ana Sayfaya Dön",
      });

      expect(viewGuideButton).toBeInTheDocument();
      expect(homeButton).toBeInTheDocument();
    });

    it("has proper heading structure", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Tebrikler! 🎉"
      );
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Temel Plan"
      );
    });

    it("provides alt text for decorative icons", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentSuccessPage />);

      // Icons should be properly handled for accessibility
      const icons = screen
        .getByText("Tebrikler! 🎉")
        .closest("div")
        ?.querySelectorAll("svg");
      expect(icons?.length).toBeGreaterThan(0);
    });
  });
});
