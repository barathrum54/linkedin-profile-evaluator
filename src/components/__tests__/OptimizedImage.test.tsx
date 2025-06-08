import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OptimizedImage from '../OptimizedImage';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(
    props: React.ComponentProps<'img'> & { priority?: boolean; fill?: boolean }
  ) {
    const { priority, fill, ...restProps } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...restProps}
        data-priority={priority}
        data-fill={fill}
        onLoad={props.onLoad}
        onError={props.onError}
        data-testid="next-image"
        alt={props.alt || ''}
      />
    );
  },
}));

describe('OptimizedImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 100,
    height: 100,
  };

  it('should render with required props', () => {
    render(<OptimizedImage {...defaultProps} />);

    const image = screen.getByTestId('next-image');
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBe('/test-image.jpg');
    expect(image.getAttribute('alt')).toBe('Test image');
  });

  it('should show error fallback when image fails to load', async () => {
    render(<OptimizedImage {...defaultProps} />);

    const image = screen.getByTestId('next-image');
    fireEvent.error(image);

    await waitFor(() => {
      // Check for the SVG icon in error state using a more reliable selector
      const svg = document.querySelector('svg');
      expect(svg).toBeDefined();
      expect(svg?.classList.contains('w-8')).toBe(true);
      expect(svg?.classList.contains('h-8')).toBe(true);
    });
  });

  it('should apply custom className', () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />);

    const image = screen.getByTestId('next-image');
    expect(image.className).toContain('custom-class');
  });

  it('should handle click events', () => {
    const onClickMock = jest.fn();
    render(<OptimizedImage {...defaultProps} onClick={onClickMock} />);

    const image = screen.getByTestId('next-image');
    fireEvent.click(image);

    expect(onClickMock).toHaveBeenCalled();
  });

  it('should apply priority prop', () => {
    render(<OptimizedImage {...defaultProps} priority />);

    const image = screen.getByTestId('next-image');
    expect(image.getAttribute('data-priority')).toBe('true');
  });

  it('should handle fill prop', () => {
    render(<OptimizedImage {...defaultProps} fill />);

    const image = screen.getByTestId('next-image');
    expect(image.getAttribute('data-fill')).toBe('true');
  });

  it('should apply cursor-pointer class when onClick is provided', () => {
    const onClickMock = jest.fn();
    render(<OptimizedImage {...defaultProps} onClick={onClickMock} />);

    const image = screen.getByTestId('next-image');
    expect(image.className).toContain('cursor-pointer');
  });

  it('should handle responsive sizes', () => {
    render(
      <OptimizedImage
        {...defaultProps}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image.getAttribute('sizes')).toBe('(max-width: 768px) 100vw, 50vw');
  });

  it('should use default sizes when not provided', () => {
    render(<OptimizedImage {...defaultProps} />);

    const image = screen.getByTestId('next-image');
    expect(image.getAttribute('sizes')).toBe(
      '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    );
  });

  it('should set default width and height when not provided', () => {
    render(<OptimizedImage src="/test.jpg" alt="test" />);

    const image = screen.getByTestId('next-image');
    expect(image.getAttribute('width')).toBe('500');
    expect(image.getAttribute('height')).toBe('300');
  });

  it('should show error fallback UI with correct styling', async () => {
    render(<OptimizedImage {...defaultProps} />);

    const image = screen.getByTestId('next-image');
    fireEvent.error(image);

    await waitFor(() => {
      const svg = document.querySelector('svg');
      const errorDiv = svg?.parentElement;
      expect(errorDiv?.className).toContain('bg-gray-200');
      expect(errorDiv?.className).toContain('flex');
      expect(errorDiv?.className).toContain('items-center');
      expect(errorDiv?.className).toContain('justify-center');
    });
  });
});
