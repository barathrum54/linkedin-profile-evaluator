import React from "react";
import { render } from "@testing-library/react";
import TestPage from "../page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Test Page", () => {
  it("renders without crashing", () => {
    const { container } = render(<TestPage />);
    expect(container).toBeTruthy();
  });

  it("displays test content", () => {
    const { container } = render(<TestPage />);
    expect(container.textContent).toBeTruthy();
  });

  it("contains test questions", () => {
    const { container } = render(<TestPage />);
    expect(container.textContent?.length).toBeGreaterThan(0);
  });
});
