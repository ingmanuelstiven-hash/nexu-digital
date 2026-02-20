import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import useFetch from '../hooks/useFetch';

// Mock global fetch para simular una respuesta exitosa

describe('useFetch hook', () => {
  
  it('debe cambiar estado a loading y luego a data', async () => {
    const mockData = { message: 'ok' };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const { result } = renderHook(() => useFetch('https://api.mock'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    global.fetch.mockRestore();
  });
});