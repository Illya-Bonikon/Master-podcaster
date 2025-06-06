import { render, screen } from '@testing-library/react';
import LoadingOverlay from '../components/LoadingOverlay';

describe('LoadingOverlay Component', () => {
  test('renders loading overlay when isLoading is true', () => {
    render(<LoadingOverlay isLoading={true} />);
    const overlay = screen.getByTestId('loading-overlay');
    expect(overlay).toBeInTheDocument();
  });

  test('does not render loading overlay when isLoading is false', () => {
    render(<LoadingOverlay isLoading={false} />);
    const overlay = screen.queryByTestId('loading-overlay');
    expect(overlay).not.toBeInTheDocument();
  });
}); 