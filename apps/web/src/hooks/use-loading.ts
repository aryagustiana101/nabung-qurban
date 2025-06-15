"use client";

import * as React from "react";

export const LoadingContext = React.createContext<
  | {
      isLoading: boolean;
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export function useLoading() {
  const context = React.useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within an LoadingProvider");
  }

  return context;
}
