import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';

import { Section } from '../components/layout';
import { useData } from '../utils/data-context';
import { Table } from '../components/table';

export function Home() {
  const { drivers, isLoading } = useData();
  const {
    data: sessionData,
    isMutating: sessionLoading,
    trigger: loadSession,
  } = useSWRMutation(
    'https://api.openf1.org/v1/sessions?session_key=latest',
    (url, { arg }) =>
      fetch(url, { method: 'GET', body: JSON.stringify(arg) }).then(res =>
        res.json()
      ),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );
  const {
    data: weatherData,
    isLoading: weatherLoading,
    trigger: loadWeather,
  } = useSWRMutation(
    'https://api.openf1.org/v1/weather?session_key=latest',
    (url, { arg }) =>
      fetch(url, { method: 'GET', body: JSON.stringify(arg) }).then(res =>
        res.json()
      ),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );

  const [sessionEventData, setSessionEventData] = useState(null);

  useEffect(() => {
    function fetchSessionData() {
      loadSession();
      loadWeather();
    }

    fetchSessionData();

    const interval = setInterval(() => {
      loadSession();
      loadWeather();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sessionData && weatherData) {
      // console.log('Event data:', eventData);
      //console.log('Weather data:', weatherData[weatherData.length - 1]);
      setSessionEventData({
        ...sessionData[0],
        date_start: new Date(sessionData[0].date_start).toLocaleString(),
        weatherData: { ...weatherData[weatherData.length - 1] },
      });
    }
  }, [sessionData, weatherData]);

  useEffect(() => {
    //console.log('Session data:', sessionEventData);
  }, [sessionEventData]);

  // if (isLoading) return <div>Loading...</div>;

  return (
    <Section>
      <title>Home</title>
      {sessionEventData ? (
        <div className="w-full flex justify-between font-semibold bg-indigo-950 text-white p-4 rounded-lg">
          <div className="flex space-x-4">
            <p>{sessionEventData?.location}</p>
            <p>{sessionEventData?.date_start}</p>
            <p>{sessionEventData?.session_type}</p>
          </div>
          <div className="flex space-x-4">
            <div className="flex space-x-2">
              <p>Temp</p>
              <p>{`${sessionEventData?.weatherData?.air_temperature}°C`}</p>
            </div>
            <div className="flex space-x-2">
              <p>Track Temp</p>
              <p>{`${sessionEventData?.weatherData?.track_temperature}°C`}</p>
            </div>
            <div className="flex space-x-2">
              <p>Downfall</p>
              <p>{`${sessionEventData?.weatherData?.rainfall}%`}</p>
            </div>
          </div>
        </div>
      ) : null}
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
          {drivers
            .slice()
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
    </Section>
  );
}

export default Home;
