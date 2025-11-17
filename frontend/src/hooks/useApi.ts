import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

type ApiFunction<T, P extends any[]> = (...args: P) => Promise<T>;

export function useApi<T, P extends any[]>(apiFunc: ApiFunction<T, P>) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: P) => {
      setState({ data: null, isLoading: true, error: null });
      try {
        const data = await apiFunc(...args);
        setState({ data, isLoading: false, error: null });
        return { data, error: null };
      } catch (error) {
        setState({ data: null, isLoading: false, error: error as Error });
        return { data: null, error: error as Error };
      }
    },
    [apiFunc]
  );

  return {
    ...state,
    execute,
  };
}
