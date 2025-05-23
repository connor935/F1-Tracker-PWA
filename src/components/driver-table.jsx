import { useEffect, useState, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';

import { Table } from './table';
import { customFetcher } from '../utils/fetcher';

export function DriverTable({ sessionKey = 'latest', updateInterval = 5000 }) {
  const [driverData, setDriverData] = useState(null);
  const {
    data: drivers,
    isMutating: isLoadingDrivers,
    trigger: loadDrivers,
  } = useSWRMutation(
    `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`,
    customFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const {
    data: positions,
    isMutating: isLoadingPositions,
    trigger: loadPositions,
  } = useSWRMutation(
    `https://api.openf1.org/v1/position?session_key=${sessionKey}`,
    customFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

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

  useEffect(() => {
    function fetchDriverData() {
      loadDrivers();
      loadPositions();
    }

    const driverInterval = setInterval(() => {
      fetchDriverData();
    }, updateInterval);

    fetchDriverData();

    return () => clearInterval(driverInterval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (drivers) {
      //console.log('Drivers data:', drivers);
      setDriverData(enhancedDrivers);
    }
  }, [drivers]);

  return (
    <Table.Wrapper className="mt-4" shadow={false}>
      <Table.Head>
        <Table.HeadCell>Pos</Table.HeadCell>
        <Table.HeadCell>No.</Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
        <Table.HeadCell>Driver</Table.HeadCell>
        <Table.HeadCell>Team</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {driverData &&
          driverData
            ?.slice()
            .sort((a, b) => {
              if (a.position === null && b.position === null) return 0;
              if (a.position === null) return 1;
              if (b.position === null) return -1;
              return a.position - b.position;
            })
            .map(driver => (
              <Table.Row key={driver.driver_number}>
                <Table.Cell className="w-8">{driver.position}</Table.Cell>
                <Table.Cell className="w-8">{driver.driver_number}</Table.Cell>
                <Table.Cell className="w-12">
                  <img
                    src={driver?.headshot_url}
                    alt={driver.full_name}
                    className="size-12 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell className="w-8">{driver?.name_acronym}</Table.Cell>
                <Table.Cell>{driver?.full_name}</Table.Cell>
                <Table.Cell>{driver?.team_name}</Table.Cell>
              </Table.Row>
            ))}
      </Table.Body>
    </Table.Wrapper>
  );
}

export default DriverTable;
