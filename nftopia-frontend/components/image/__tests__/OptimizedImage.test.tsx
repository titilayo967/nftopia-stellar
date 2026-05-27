import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/image to render a plain img for the test environment
jest.mock('next/image', () => ({
  __esModule: true,
  // render as a plain 'img' element in tests
  default: 'img',
}));

import OptimizedImage from '../OptimizedImage';

describe('OptimizedImage', () => {
  it('renders fallback when src is empty', () => {
    render(<OptimizedImage src={''} alt={'test alt'} fallbackSrc={'/images/fallbacks/avatar-fallback.svg'} width={40} height={40} />);
    const img = screen.getByAltText('Fallback for test alt');
    expect(img).toBeInTheDocument();
  });

  it('renders provided src when given', () => {
    render(<OptimizedImage src={'/images/fallbacks/avatar-fallback.svg'} alt={'avatar'} width={40} height={40} />);
    const img = screen.getByAltText('avatar');
    expect(img).toBeInTheDocument();
  });
});
