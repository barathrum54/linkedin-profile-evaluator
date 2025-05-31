import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../page";

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

describe("HomePage", () => {
  it("renders the main heading", () => {
    render(<HomePage />);

    // Look for key elements that should be on the home page
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("renders without crashing", () => {
    const { container } = render(<HomePage />);
    expect(container).toBeTruthy();
  });

  it("contains main content", () => {
    const { container } = render(<HomePage />);
    expect(container.firstChild).toBeTruthy();
  });
});
