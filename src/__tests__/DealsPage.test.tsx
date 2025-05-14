
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DealsPage from '../pages/DealsPage';
import { useDeals } from '../hooks/useDeals';

// Mock the useDeals hook
jest.mock('../hooks/useDeals');

const mockUseDeals = useDeals as jest.MockedFunction<typeof useDeals>;

// Current date for testing
const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(nextWeek.getDate() + 7);

// Mock deals
const mockDeals = [
  {
    id: '1',
    name: 'Active Deal',
    description: 'This is an active deal',
    validFrom: yesterday,
    validTo: tomorrow,
    discountType: 'percentage' as 'percentage',
    discountValue: 20
  },
  {
    id: '2',
    name: 'Future Deal',
    description: 'This is a future deal',
    validFrom: tomorrow,
    validTo: nextWeek,
    discountType: 'flat' as 'flat',
    discountValue: 5
  }
];

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('DealsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('displays loading state', () => {
    mockUseDeals.mockReturnValue({
      deals: [],
      isLoading: true,
      error: null,
      addDeal: jest.fn(),
      updateDeal: jest.fn(),
      deleteDeal: jest.fn(),
      getActiveDeals: jest.fn().mockReturnValue([])
    });
    
    renderWithProviders(<DealsPage />);
    
    expect(screen.getByText(/loading deals/i)).toBeInTheDocument();
  });
  
  test('displays active and inactive deals correctly', async () => {
    mockUseDeals.mockReturnValue({
      deals: mockDeals,
      isLoading: false,
      error: null,
      addDeal: jest.fn(),
      updateDeal: jest.fn(),
      deleteDeal: jest.fn(),
      getActiveDeals: jest.fn().mockReturnValue([mockDeals[0]])
    });
    
    renderWithProviders(<DealsPage />);
    
    // Check if both deals are rendered
    expect(screen.getByText('Active Deal')).toBeInTheDocument();
    expect(screen.getByText('Future Deal')).toBeInTheDocument();
    
    // Check section headings
    expect(screen.getByText('Active Deals')).toBeInTheDocument();
    expect(screen.getByText('Other Deals')).toBeInTheDocument();
  });
  
  test('displays "no deals available" message when there are no deals', () => {
    mockUseDeals.mockReturnValue({
      deals: [],
      isLoading: false,
      error: null,
      addDeal: jest.fn(),
      updateDeal: jest.fn(),
      deleteDeal: jest.fn(),
      getActiveDeals: jest.fn().mockReturnValue([])
    });
    
    renderWithProviders(<DealsPage />);
    
    expect(screen.getByText('No deals available')).toBeInTheDocument();
    expect(screen.getByText('Check back later for special offers.')).toBeInTheDocument();
  });
});
