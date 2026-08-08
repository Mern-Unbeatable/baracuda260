import { renderHook, act } from '@testing-library/react';
import { useApi } from '../useApi';

describe('useApi', () => {
  it('starts with idle state', () => {
    const { result } = renderHook(() => useApi(jest.fn()));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets data and clears error on a successful call', async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: { id: 1 }, error: null });
    const { result } = renderHook(() => useApi(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual({ id: 1 });
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('sets error when the apiFunction returns an error field', async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: null, error: 'Bad request' });
    const { result } = renderHook(() => useApi(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('Bad request');
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets error when the apiFunction throws', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useApi(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe('Network error');
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('passes arguments through to the apiFunction', async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: 'ok', error: null });
    const { result } = renderHook(() => useApi(mockFn));

    await act(async () => {
      await result.current.execute('arg1', 'arg2');
    });

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('reset clears data, error, and loading', async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: { id: 1 }, error: null });
    const { result } = renderHook(() => useApi(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
