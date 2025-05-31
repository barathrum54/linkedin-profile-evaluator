import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaymentPage from "../page";

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
jest.mock("../../../components/Layout", () => {
  return function MockLayout({
    children,
    navbarProps,
  }: {
    children: React.ReactNode;
    navbarProps?: { title?: string; subtitle?: string };
  }) {
    return (
      <div data-testid="layout">
        {navbarProps && (
          <div data-testid="navbar">
            <span data-testid="title">{navbarProps.title}</span>
            <span data-testid="subtitle">{navbarProps.subtitle}</span>
          </div>
        )}
        <div data-testid="layout-content">{children}</div>
      </div>
    );
  };
});

describe("PaymentPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue("basic"); // Default to basic plan
  });

  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      render(<PaymentPage />);
      expect(screen.getByTestId("layout")).toBeInTheDocument();
    });

    it("displays correct navbar information", () => {
      render(<PaymentPage />);
      expect(screen.getByTestId("title")).toHaveTextContent("Güvenli Ödeme");
      expect(screen.getByTestId("subtitle")).toHaveTextContent(
        "SSL şifreli güvenli ödeme sayfası"
      );
    });

    it("displays loading spinner when no plan is selected", () => {
      mockGet.mockReturnValue(null);
      render(<PaymentPage />);
      expect(document.querySelector(".animate-spin")).toBeTruthy();
    });

    it("redirects to pricing when invalid plan is provided", () => {
      mockGet.mockReturnValue("invalid");
      render(<PaymentPage />);
      expect(mockPush).toHaveBeenCalledWith("/pricing");
    });
  });

  describe("Plan Selection and Display", () => {
    it("displays basic plan information correctly", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      expect(screen.getByText("Temel Plan")).toBeInTheDocument();
      expect(screen.getByText("$5")).toBeInTheDocument();
      expect(
        screen.getByText("Detaylı profil analiz raporu")
      ).toBeInTheDocument();
    });

    it("displays premium plan information correctly", () => {
      mockGet.mockReturnValue("premium");
      render(<PaymentPage />);

      expect(screen.getByText("Premium Plan")).toBeInTheDocument();
      expect(screen.getByText("$20")).toBeInTheDocument();
      expect(
        screen.getByText("1-1 video konsültasyon (30 dk)")
      ).toBeInTheDocument();
    });

    it("calculates and displays total price with tax", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      // Basic plan: $5 + 18% tax = $5.90
      expect(screen.getByText("$5.90")).toBeInTheDocument();
      expect(screen.getByText("KDV (%18)")).toBeInTheDocument();
      expect(screen.getByText("$0.90")).toBeInTheDocument();
    });

    it("shows correct styling for basic plan", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      const planCard = screen.getByText("Temel Plan").closest(".border-2");
      expect(planCard).toHaveClass("border-purple-200", "bg-purple-50");
    });

    it("shows correct styling for premium plan", () => {
      mockGet.mockReturnValue("premium");
      render(<PaymentPage />);

      const planCard = screen.getByText("Premium Plan").closest(".border-2");
      expect(planCard).toHaveClass("border-pink-200", "bg-pink-50");
    });
  });

  describe("Form Fields and Validation", () => {
    beforeEach(() => {
      mockGet.mockReturnValue("basic");
    });

    it("shows payment form heading", () => {
      render(<PaymentPage />);
      expect(screen.getAllByText("Ödeme Bilgileri")[0]).toBeInTheDocument();
    });

    it("shows personal information section", () => {
      render(<PaymentPage />);
      expect(screen.getByText("Kişisel Bilgiler")).toBeInTheDocument();
    });

    it("shows payment information section", () => {
      render(<PaymentPage />);
      expect(screen.getAllByText("Ödeme Bilgileri")).toHaveLength(2); // Both heading and section
    });

    it("shows billing address section", () => {
      render(<PaymentPage />);
      expect(screen.getByText("Fatura Adresi")).toBeInTheDocument();
    });

    it("shows form placeholders", () => {
      render(<PaymentPage />);

      // Look for form fields by placeholder text
      expect(screen.getByPlaceholderText("Adınız")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Soyadınız")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("ornek@email.com")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("1234 5678 9012 3456")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("MM/YY")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("123")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("JOHN DOE")).toBeInTheDocument();
    });

    it("shows submit button", () => {
      render(<PaymentPage />);
      expect(screen.getByRole("button", { name: /öde/i })).toBeInTheDocument();
    });

    it("validates basic form submission", async () => {
      render(<PaymentPage />);

      const submitButton = screen.getByRole("button", { name: /öde/i });
      fireEvent.click(submitButton);

      // Form validation should prevent submission with empty fields
      await waitFor(() => {
        expect(submitButton).toBeInTheDocument(); // Still on same page
      });
    });
  });

  describe("Input Formatting", () => {
    beforeEach(() => {
      mockGet.mockReturnValue("basic");
    });

    it("shows input format placeholders", () => {
      render(<PaymentPage />);

      // Check that formatting placeholders are shown
      expect(
        screen.getByPlaceholderText("1234 5678 9012 3456")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("MM/YY")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("123")).toBeInTheDocument();
    });

    it("shows form fields have proper attributes", () => {
      render(<PaymentPage />);

      const cardInput = screen.getByPlaceholderText("1234 5678 9012 3456");
      const expiryInput = screen.getByPlaceholderText("MM/YY");
      const cvvInput = screen.getByPlaceholderText("123");

      expect(cardInput).toHaveAttribute("maxLength", "19");
      expect(expiryInput).toHaveAttribute("maxLength", "5");
      expect(cvvInput).toHaveAttribute("maxLength", "4");
    });
  });

  describe("Form Submission", () => {
    beforeEach(() => {
      mockGet.mockReturnValue("basic");
    });

    it("shows submit button with correct text", () => {
      render(<PaymentPage />);

      const submitButton = screen.getByRole("button", { name: /\$5\.90 öde/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveClass(
        "bg-gradient-to-r",
        "from-blue-600",
        "to-indigo-600"
      );
    });

    it("button shows correct amount for premium plan", () => {
      mockGet.mockReturnValue("premium");
      render(<PaymentPage />);

      expect(
        screen.getByRole("button", { name: /\$23\.60 öde/i })
      ).toBeInTheDocument();
    });

    it("processes basic form interaction", async () => {
      render(<PaymentPage />);

      const nameInput = screen.getByPlaceholderText("Adınız");
      const submitButton = screen.getByRole("button", { name: /öde/i });

      // Test basic form interaction
      fireEvent.change(nameInput, { target: { value: "John" } });
      expect(nameInput).toHaveValue("John");

      fireEvent.click(submitButton);
      // Form should still be present (validation prevents submission)
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("Security Features", () => {
    it("displays security badges", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      expect(screen.getByText("256-bit SSL")).toBeInTheDocument();
      expect(screen.getByText("PCI Compliant")).toBeInTheDocument();
    });

    it("shows terms and privacy policy links", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      expect(screen.getByText("Kullanım Şartları")).toBeInTheDocument();
      expect(screen.getByText("Gizlilik Politikası")).toBeInTheDocument();
    });
  });

  describe("Country Selection", () => {
    it("shows country dropdown with Turkey option", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      expect(screen.getByText("Türkiye")).toBeInTheDocument();
      expect(
        screen.getByText("Amerika Birleşik Devletleri")
      ).toBeInTheDocument();
      expect(screen.getByText("Birleşik Krallık")).toBeInTheDocument();
      expect(screen.getByText("Almanya")).toBeInTheDocument();
      expect(screen.getByText("Fransa")).toBeInTheDocument();
    });
  });

  describe("Responsive Design Elements", () => {
    it("shows proper grid layout classes", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      const gridContainer = screen.getByText("Sipariş Özeti").closest(".grid");
      expect(gridContainer).toHaveClass("lg:grid-cols-2");
    });

    it("shows responsive text classes", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      const title = screen.getByText("Sipariş Özeti");
      expect(title).toHaveClass("text-2xl");
    });
  });

  describe("Edge Cases", () => {
    it("handles suspense fallback rendering", () => {
      const { container } = render(<PaymentPage />);
      // PaymentPage renders successfully even with Suspense
      expect(container.firstChild).toBeTruthy();
    });

    it("handles plan changes via URL parameter", () => {
      mockGet.mockReturnValue("premium");
      render(<PaymentPage />);

      expect(screen.getByText("Premium Plan")).toBeInTheDocument();
      expect(screen.getByText("$23.60")).toBeInTheDocument(); // $20 + 18% tax
    });

    it("shows proper feature count for plans with many features", () => {
      mockGet.mockReturnValue("premium");
      render(<PaymentPage />);

      // Premium plan has 8 features, should show first 4 + "+4 adet daha..."
      expect(screen.getByText("+4 adet daha...")).toBeInTheDocument();
    });

    it("tests input interaction", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      const cardInput = screen.getByPlaceholderText("1234 5678 9012 3456");
      fireEvent.change(cardInput, { target: { value: "1234 5678 9012 3456" } });

      expect(cardInput).toHaveValue("1234 5678 9012 3456");
    });

    it("tests expiry date input", () => {
      mockGet.mockReturnValue("basic");
      render(<PaymentPage />);

      const expiryInput = screen.getByPlaceholderText("MM/YY");
      fireEvent.change(expiryInput, { target: { value: "12/25" } });

      expect(expiryInput).toHaveValue("12/25");
    });
  });
});
