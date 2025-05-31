import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StarRating from "../StarRating";

// Mock the useSound hook
jest.mock("@/hooks/useSound", () => ({
  useSound: () => ({
    playClickSound: jest.fn(),
    playHoverSound: jest.fn(),
  }),
}));

const defaultProps = {
  value: null,
  onRatingChange: jest.fn(),
  labels: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
};

describe("StarRating", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<StarRating {...defaultProps} />);

    const stars = screen.getAllByRole("button");
    expect(stars).toHaveLength(5);

    // Check that no stars are filled by default
    stars.forEach((star) => {
      expect(star.querySelector("svg")).toHaveClass("text-gray-400");
    });
  });

  it("displays the correct rating value", () => {
    render(<StarRating {...defaultProps} value={3} />);

    const stars = screen.getAllByRole("button");

    // Check star colors - first 3 should be yellow, last 2 should be gray
    expect(stars[0].querySelector("svg")).toHaveClass("text-yellow-400");
    expect(stars[1].querySelector("svg")).toHaveClass("text-yellow-400");
    expect(stars[2].querySelector("svg")).toHaveClass("text-yellow-400");
    expect(stars[3].querySelector("svg")).toHaveClass("text-gray-400");
    expect(stars[4].querySelector("svg")).toHaveClass("text-gray-400");
  });

  it("handles click events", () => {
    const onRatingChange = jest.fn();
    render(<StarRating {...defaultProps} onRatingChange={onRatingChange} />);

    const stars = screen.getAllByRole("button");
    fireEvent.click(stars[2]); // Click third star

    expect(onRatingChange).toHaveBeenCalledWith(3);
  });

  it("handles hover events", () => {
    render(<StarRating {...defaultProps} />);

    const stars = screen.getAllByRole("button");
    fireEvent.mouseEnter(stars[3]); // Hover fourth star

    // First 4 stars should be highlighted during hover
    expect(stars[0].querySelector("svg")).toHaveClass("text-yellow-400");
    expect(stars[1].querySelector("svg")).toHaveClass("text-yellow-400");
    expect(stars[2].querySelector("svg")).toHaveClass("text-yellow-400");
    expect(stars[3].querySelector("svg")).toHaveClass("text-yellow-400");
    expect(stars[4].querySelector("svg")).toHaveClass("text-gray-400");
  });

  it("resets to original rating on mouse leave", () => {
    render(<StarRating {...defaultProps} value={2} />);

    const stars = screen.getAllByRole("button");

    // Hover and then leave
    fireEvent.mouseEnter(stars[3]);
    fireEvent.mouseLeave(stars[3]);

    // Should return to original rating (2 stars)
    expect(stars[0].querySelector("svg")).toHaveClass("text-yellow-400");
    expect(stars[1].querySelector("svg")).toHaveClass("text-yellow-400");
    expect(stars[2].querySelector("svg")).toHaveClass("text-gray-400");
    expect(stars[3].querySelector("svg")).toHaveClass("text-gray-400");
    expect(stars[4].querySelector("svg")).toHaveClass("text-gray-400");
  });

  it("displays labels on hover", () => {
    render(<StarRating {...defaultProps} />);

    const stars = screen.getAllByRole("button");
    fireEvent.mouseEnter(stars[2]); // Hover third star

    // Should display the label for index 2 (Good)
    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  it("displays labels on click", () => {
    const onRatingChange = jest.fn();
    render(<StarRating {...defaultProps} onRatingChange={onRatingChange} />);

    const stars = screen.getAllByRole("button");
    fireEvent.click(stars[4]); // Click fifth star

    // Should display the label for index 4 (Excellent)
    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<StarRating {...defaultProps} />);

    const stars = screen.getAllByRole("button");
    stars.forEach((star, index) => {
      expect(star).toHaveAttribute("aria-label", `Rate ${index + 1} out of 5`);
      expect(star).toHaveAttribute("type", "button");
    });
  });

  it("handles edge case with 0 rating", () => {
    render(<StarRating {...defaultProps} value={0} />);

    const stars = screen.getAllByRole("button");
    stars.forEach((star) => {
      expect(star.querySelector("svg")).toHaveClass("text-gray-400");
    });
  });

  it("handles edge case with 5 rating", () => {
    render(<StarRating {...defaultProps} value={5} />);

    const stars = screen.getAllByRole("button");
    stars.forEach((star) => {
      expect(star.querySelector("svg")).toHaveClass("text-yellow-400");
    });
  });

  it("handles null value", () => {
    render(<StarRating {...defaultProps} value={null} />);

    const stars = screen.getAllByRole("button");
    stars.forEach((star) => {
      expect(star.querySelector("svg")).toHaveClass("text-gray-400");
    });
  });

  it("uses custom labels", () => {
    const customLabels = ["Bad", "Okay", "Good", "Great", "Amazing"];
    render(<StarRating {...defaultProps} labels={customLabels} />);

    const stars = screen.getAllByRole("button");
    fireEvent.mouseEnter(stars[1]); // Hover second star

    expect(screen.getByText("Okay")).toBeInTheDocument();
  });

  it("applies hover effects", () => {
    render(<StarRating {...defaultProps} />);

    const stars = screen.getAllByRole("button");
    const star = stars[0];

    fireEvent.mouseEnter(star);

    // Check if hover class is applied to the SVG
    expect(star.querySelector("svg")).toHaveClass("group-hover:scale-110");
  });

  it("handles multiple interactions", () => {
    const onRatingChange = jest.fn();
    render(<StarRating {...defaultProps} onRatingChange={onRatingChange} />);

    const stars = screen.getAllByRole("button");

    // Hover first star
    fireEvent.mouseEnter(stars[0]);
    expect(screen.getByText("Poor")).toBeInTheDocument();

    // Move to second star
    fireEvent.mouseEnter(stars[1]);
    expect(screen.getByText("Fair")).toBeInTheDocument();

    // Click third star
    fireEvent.click(stars[2]);
    expect(onRatingChange).toHaveBeenCalledWith(3);
    expect(screen.getByText("Good")).toBeInTheDocument();
  });
});
