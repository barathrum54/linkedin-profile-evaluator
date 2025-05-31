import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPasswordPage from "../page";

// Mock fetch
global.fetch = jest.fn();

// Mock router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the forgot password form", () => {
      render(<ForgotPasswordPage />);

      expect(screen.getByText(/şifremi unuttum/i)).toBeTruthy();
    });

    it("should render email input field", () => {
      render(<ForgotPasswordPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      expect(emailInput).toBeTruthy();
    });

    it("should render submit button", () => {
      render(<ForgotPasswordPage />);

      const submitButton = screen.getByRole("button", { name: /gönder/i });
      expect(submitButton).toBeTruthy();
    });

    it("should render back to login link", () => {
      render(<ForgotPasswordPage />);

      expect(screen.getByText(/giriş sayfasına dön/i)).toBeTruthy();
    });
  });

  describe("Form validation", () => {
    it("should accept valid email format", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: "Email sent successfully",
        }),
      });

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const submitButton = screen.getByRole("button", { name: /gönder/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      expect(global.fetch).toHaveBeenCalledWith("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      });
    });

    it("should show loading state during submission", async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                }),
              100
            )
          )
      );

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const submitButton = screen.getByRole("button", { name: /gönder/i });

      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.click(submitButton);

      expect(screen.getByText(/gönderiliyor/i)).toBeTruthy();
      expect(submitButton).toBeDisabled();
    });
  });

  describe("API interactions", () => {
    it("should call forgot password API on form submission", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const submitButton = screen.getByRole("button", { name: /gönder/i });

      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "user@example.com" }),
        });
      });
    });

    it("should handle API success response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: "Reset link sent" }),
      });

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const submitButton = screen.getByRole("button", { name: /gönder/i });

      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email gönderildi/i)).toBeTruthy();
      });
    });

    it("should handle API error response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, message: "User not found" }),
      });

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const submitButton = screen.getByRole("button", { name: /gönder/i });

      fireEvent.change(emailInput, {
        target: { value: "notfound@example.com" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("User not found")).toBeTruthy();
      });
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const submitButton = screen.getByRole("button", { name: /gönder/i });

      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/bir hata oluştu.*tekrar deneyin/i)
        ).toBeTruthy();
      });
    });
  });

  describe("Component behavior", () => {
    it("should reset form state on successful submission", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: "Reset link sent" }),
      });

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const submitButton = screen.getByRole("button", { name: /gönder/i });

      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email gönderildi/i)).toBeTruthy();
      });

      // Should show success view, not form
      expect(screen.queryByRole("textbox")).toBeNull();
      expect(screen.queryByRole("button", { name: /gönder/i })).toBeNull();
    });

    it("should clear error state on new submission", async () => {
      // First, trigger an error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, message: "User not found" }),
      });

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const submitButton = screen.getByRole("button", { name: /gönder/i });

      fireEvent.change(emailInput, { target: { value: "bad@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("User not found")).toBeTruthy();
      });

      // Now submit again with success
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: "Reset link sent" }),
      });

      fireEvent.change(emailInput, { target: { value: "good@example.com" } });
      fireEvent.click(submitButton);

      // Error should be cleared before API call
      expect(screen.queryByText("User not found")).toBeNull();
    });
  });
});
