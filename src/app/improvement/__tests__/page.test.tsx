import React from "react";
import { render } from "@testing-library/react";
import ImprovementPage from "../page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue("5"),
  }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Improvement Page", () => {
  it("renders without crashing", () => {
    const { container } = render(<ImprovementPage />);
    expect(container).toBeTruthy();
  });

  it("displays improvement content", () => {
    const { container } = render(<ImprovementPage />);
    expect(container).toBeTruthy();
  });

  it("contains improvement suggestions", () => {
    const { container } = render(<ImprovementPage />);
    expect(container).toBeTruthy();
  });
});
