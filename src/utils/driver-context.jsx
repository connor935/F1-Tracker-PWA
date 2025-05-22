import useSWR from "swr";
import { createContext, useContext } from "react";

import { customFetcher } from "./fetcher";

export const DriversContext = createContext(null);

export function DriversProvider({ children }) {
  const { data, error, isLoading } = useSWR(
    "https://api.openf1.org/v1/drivers?session_key=latest", // Replace with your actual API endpoint
    customFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  const contextValue = {
    drivers: data || [],
    isLoading,
    error,
  };

  return (
    <DriversContext.Provider value={contextValue}>
      {children}
    </DriversContext.Provider>
  );
}

export function useDrivers() {
  const context = useContext(DriversContext);
  if (!context) {
    throw new Error("useDrivers must be used within a DriversProvider");
  }
  return context;
}
