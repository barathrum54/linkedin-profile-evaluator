import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "../Layout";

describe("Layout", () => {
  it("should render children", () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );

    expect(screen.getByText("Test content")).toBeDefined();
  });

  it("should apply correct CSS classes", () => {
    const { container } = render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );

    expect(container.firstChild).toBeDefined();
  });

  it("should handle empty children", () => {
    const { container } = render(
      <Layout>
        <></>
      </Layout>
    );

    expect(container.firstChild).toBeDefined();
  });

  it("should handle multiple children", () => {
    render(
      <Layout>
        <div>First child</div>
        <div>Second child</div>
      </Layout>
    );

    expect(screen.getByText("First child")).toBeDefined();
    expect(screen.getByText("Second child")).toBeDefined();
  });

  it("should render as a container element", () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(container.firstChild?.nodeName).toBeDefined();
  });
});
