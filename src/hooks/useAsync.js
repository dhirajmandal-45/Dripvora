import { useCallback, useEffect, useRef, useState } from "react";

// Runs an async loader on mount and exposes { data, error, loading, reload, setData }.
export default function useAsync(loader) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const [state, setState] = useState({ data: null, error: "", loading: true });

  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    return loaderRef.current()
      .then((data) => setState({ data, error: "", loading: false }))
      .catch((e) => setState((s) => ({ ...s, error: e.message, loading: false })));
  }, []);

  useEffect(() => { run(); }, [run]);

  const setData = useCallback((updater) =>
    setState((s) => ({ ...s, data: typeof updater === "function" ? updater(s.data) : updater })), []);

  return { ...state, reload: run, setData };
}
