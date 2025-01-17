"use client";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null);

  const queryClient = new QueryClient();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={storeRef.current}>{children}</Provider>
    </QueryClientProvider>
  );
};

export default StoreProvider;
