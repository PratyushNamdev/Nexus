"use client";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider } from "react-query";
import { getQueryClient } from "@/constants/react-query";
import { useMemo } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useMemo(getQueryClient, []);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};
