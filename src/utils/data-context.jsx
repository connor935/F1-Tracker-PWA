import { createContext, useContext, useEffect, useMemo } from 'react';
import { customFetcher } from './fetcher';
import useSWRMutation from 'swr/mutation';

export const DataContext = createContext(null);

export function DataProvider({ children }) {
  const {
    data: drivers,
    isMutating: isLoadingDrivers,
    trigger: loadDrivers,
  } = useSWRMutation(
    'https://api.openf1.org/v1/drivers?session_key=latest',
    customFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  const {
    data: positions,
    isMutating: isLoadingPositions,
    trigger: loadPositions,
  } = useSWRMutation(
    'https://api.openf1.org/v1/position?session_key=latest',
    customFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  useEffect(() => {
    function fetchData() {
      loadDrivers();
      loadPositions();
    }

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Combine drivers and positions data
  const enhancedDrivers = useMemo(() => {
    if (!drivers || !positions) return drivers || [];

    // Group positions by driver_number and find the latest position
    const latestPositions = positions.reduce((acc, pos) => {
      const driverNum = pos.driver_number;
      if (
        !acc[driverNum] ||
        new Date(pos.date) > new Date(acc[driverNum].date)
      ) {
        acc[driverNum] = pos;
      }
      return acc;
    }, {});

    // Map drivers to include their latest position
    return drivers.map(driver => ({
      ...driver,
      position: latestPositions[driver.driver_number]?.position || null,
    }));
  }, [drivers, positions]);

  const contextValue = {
    drivers: enhancedDrivers,
    isLoading: isLoadingDrivers || isLoadingPositions,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
