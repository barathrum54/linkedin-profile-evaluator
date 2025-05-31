import React from "react";
import { render } from "@testing-library/react";
import Intro from "../Intro";

describe("Intro", () => {
  it("renders without crashing", () => {
    const { container } = render(<Intro />);
    expect(container).toBeTruthy();
  });

  it("displays intro content", () => {
    const { container } = render(<Intro />);
    expect(container.textContent).toBeTruthy();
  });

  it("contains intro information", () => {
    const { container } = render(<Intro />);
    expect(container.textContent?.length).toBeGreaterThan(0);
  });
});
