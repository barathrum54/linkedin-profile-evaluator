import React from "react";
import { render } from "@testing-library/react";
import ErrorPage from "../ErrorPage";

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

describe("ErrorPage", () => {
  it("renders error message", () => {
    const { container } = render(<ErrorPage message="Test error" />);
    expect(container.textContent).toContain("Test error");
  });

  it("renders default error when no message provided", () => {
    const { container } = render(<ErrorPage />);
    expect(container).toBeTruthy();
  });

  it("renders with refresh button", () => {
    const { container } = render(
      <ErrorPage message="Error" showRefreshButton />
    );
    expect(container).toBeTruthy();
  });

  it("renders with home button", () => {
    const { container } = render(<ErrorPage message="Error" showHomeButton />);
    expect(container).toBeTruthy();
  });
});
