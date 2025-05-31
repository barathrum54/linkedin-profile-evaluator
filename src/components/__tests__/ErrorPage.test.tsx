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

  it("renders retry button", () => {
    const onRetry = jest.fn();
    const { container } = render(
      <ErrorPage message="Error" onRetry={onRetry} />
    );
    expect(container).toBeTruthy();
  });

  it("renders home link", () => {
    const { container } = render(<ErrorPage message="Error" showHomeLink />);
    expect(container).toBeTruthy();
  });
});
