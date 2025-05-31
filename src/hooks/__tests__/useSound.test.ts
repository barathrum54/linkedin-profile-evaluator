import { renderHook } from "@testing-library/react";
import { useSound } from "../useSound";

// Mock Audio API
const mockPlay = jest.fn();
const mockPause = jest.fn();

// Mock Audio constructor
global.Audio = jest.fn().mockImplementation(() => ({
  play: mockPlay,
  pause: mockPause,
  currentTime: 0,
  volume: 1,
}));

describe("useSound", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPlay.mockResolvedValue(undefined);

    // Reset Audio mock
    global.Audio = jest.fn().mockImplementation(() => ({
      play: mockPlay,
      pause: mockPause,
      currentTime: 0,
      volume: 1,
    }));
  });

  it("should provide playClickSound function", () => {
    const { result } = renderHook(() => useSound());

    expect(typeof result.current.playClickSound).toBe("function");
  });

  it("should provide playHoverSound function", () => {
    const { result } = renderHook(() => useSound());

    expect(typeof result.current.playHoverSound).toBe("function");
  });

  it("should call play on click sound", () => {
    const { result } = renderHook(() => useSound());

    result.current.playClickSound();

    expect(mockPlay).toHaveBeenCalled();
  });

  it("should call play on hover sound", () => {
    const { result } = renderHook(() => useSound());

    result.current.playHoverSound();

    expect(mockPlay).toHaveBeenCalled();
  });

  it("should create separate audio instances for different sounds", () => {
    renderHook(() => useSound());

    // Audio constructor should be called for different sound files
    expect(global.Audio).toHaveBeenCalledTimes(2);
  });

  it("should reset currentTime before playing", () => {
    const mockAudio = {
      play: mockPlay,
      pause: mockPause,
      currentTime: 5,
      volume: 1,
    };

    global.Audio = jest.fn().mockImplementation(() => mockAudio);

    const { result } = renderHook(() => useSound());

    result.current.playClickSound();

    expect(mockAudio.currentTime).toBe(0);
  });

  it("should handle multiple rapid clicks", () => {
    const { result } = renderHook(() => useSound());

    result.current.playClickSound();
    result.current.playClickSound();
    result.current.playClickSound();

    expect(mockPlay).toHaveBeenCalledTimes(3);
  });

  it("should handle multiple rapid hovers", () => {
    const { result } = renderHook(() => useSound());

    result.current.playHoverSound();
    result.current.playHoverSound();
    result.current.playHoverSound();

    expect(mockPlay).toHaveBeenCalledTimes(3);
  });
});
