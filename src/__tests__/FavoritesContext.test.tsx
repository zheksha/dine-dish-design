
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FavoritesProvider, useFavorites } from '../context/FavoritesContext';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test component to access favorites context
const TestComponent = () => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  return (
    <div>
      <div data-testid="favorites-count">{favorites.length}</div>
      <ul>
        {favorites.map(item => (
          <li key={item} data-testid="favorite-item">{item}</li>
        ))}
      </ul>
      <button 
        data-testid="add-favorite" 
        onClick={() => addFavorite('test-item-1')}
      >
        Add Favorite
      </button>
      <button 
        data-testid="remove-favorite" 
        onClick={() => removeFavorite('test-item-1')}
      >
        Remove Favorite
      </button>
      <div data-testid="is-favorite">
        {isFavorite('test-item-1') ? 'Yes' : 'No'}
      </div>
    </div>
  );
};

describe('FavoritesContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });
  
  test('provides empty favorites array by default', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );
    
    expect(screen.getByTestId('favorites-count').textContent).toBe('0');
    expect(screen.queryAllByTestId('favorite-item')).toHaveLength(0);
  });
  
  test('loads favorites from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(['test-item-1', 'test-item-2']));
    
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );
    
    expect(screen.getByTestId('favorites-count').textContent).toBe('2');
    expect(screen.getAllByTestId('favorite-item')).toHaveLength(2);
  });
  
  test('adds a favorite item', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-favorite'));
    
    expect(screen.getByTestId('favorites-count').textContent).toBe('1');
    expect(screen.getByTestId('favorite-item').textContent).toBe('test-item-1');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify(['test-item-1']));
  });
  
  test('removes a favorite item', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(['test-item-1']));
    
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );
    
    fireEvent.click(screen.getByTestId('remove-favorite'));
    
    expect(screen.getByTestId('favorites-count').textContent).toBe('0');
    expect(screen.queryByTestId('favorite-item')).not.toBeInTheDocument();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify([]));
  });
  
  test('checks if item is a favorite', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(['test-item-1']));
    
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );
    
    expect(screen.getByTestId('is-favorite').textContent).toBe('Yes');
    
    fireEvent.click(screen.getByTestId('remove-favorite'));
    
    expect(screen.getByTestId('is-favorite').textContent).toBe('No');
  });
});
