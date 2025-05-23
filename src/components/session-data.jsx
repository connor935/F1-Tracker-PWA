import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';

import { customFetcher } from '../utils/fetcher';

export function SessionData({ sessionKey = 'latest', updateInterval = 30000 }) {
  const [sessionEventData, setSessionEventData] = useState(null);
  const {
    data: sessionData,
    isMutating: sessionLoading,
    trigger: loadSession,
  } = useSWRMutation(
    `https://api.openf1.org/v1/sessions?session_key=${sessionKey}`,
    customFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const {
    data: weatherData,
    isLoading: weatherLoading,
    trigger: loadWeather,
  } = useSWRMutation(
    `https://api.openf1.org/v1/weather?session_key=${sessionKey}`,
    customFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    function fetchSessionData() {
      loadSession();
      loadWeather();
    }

    fetchSessionData();

    const sessionInterval = setInterval(() => {
      loadSession();
      loadWeather();
    }, updateInterval);

    return () => clearInterval(sessionInterval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (sessionData && weatherData) {
      //   console.log('Event data:', sessionData);
      //   console.log('Weather data:', weatherData[weatherData.length - 1]);
      setSessionEventData({
        ...sessionData[0],
        date_start: new Date(sessionData[0].date_start).toLocaleString(),
        weatherData: { ...weatherData[weatherData.length - 1] },
      });
    }
  }, [sessionData, weatherData]);

  return (
    <>
      {sessionEventData ? (
        <div className="w-full flex justify-between font-semibold bg-indigo-950 text-white p-4 rounded-lg">
          <div className="flex space-x-4">
            <p>{sessionEventData?.location}</p>
            <p>{sessionEventData?.date_start}</p>
            <p>{sessionEventData?.session_name}</p>
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
    </>
  );
}
