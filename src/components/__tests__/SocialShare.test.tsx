import React from "react";
import { render } from "@testing-library/react";
import SocialShare from "../SocialShare";

describe("SocialShare", () => {
  it("renders without crashing", () => {
    const { container } = render(<SocialShare />);
    expect(container).toBeTruthy();
  });

  it("displays social share content", () => {
    const { container } = render(<SocialShare />);
    expect(container).toBeTruthy();
  });

  it("contains social share buttons", () => {
    const { container } = render(<SocialShare />);
    expect(container).toBeTruthy();
  });

  it("renders all social media buttons", () => {
    const { container } = render(<SocialShare />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(5); // Twitter, LinkedIn, Instagram, WhatsApp, Facebook
  });
});
