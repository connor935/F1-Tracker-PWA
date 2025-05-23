import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';

import { customFetcher } from '../utils/fetcher';

export function SessionData({
  sessionKey = 'latest',
  meetingKey = 'latest',
  updateInterval = 30000,
}) {
  const [eventData, setEventData] = useState(null);
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
    data: meetingData,
    isLoading: meetingLoading,
    trigger: loadMeeting,
  } = useSWRMutation(
    `https://api.openf1.org/v1/meetings?meeting_key=${meetingKey}`,
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
      loadMeeting();
    }

    fetchSessionData();

    const sessionInterval = setInterval(() => {
      loadSession();
      loadWeather();
      loadMeeting();
    }, updateInterval);

    return () => clearInterval(sessionInterval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (sessionData && weatherData) {
      //console.log('Event data:', sessionData[0]);
      //   console.log('Weather data:', weatherData[weatherData.length - 1]);
      setEventData({
        ...sessionData[0],
        date_start: new Date(sessionData[0].date_start).toLocaleString(),
        meeting_name: meetingData[0]?.meeting_name,
        weatherData: { ...weatherData[weatherData.length - 1] },
      });
    }
  }, [sessionData, weatherData]);

  return (
    <>
      {eventData ? (
        <div className="w-full flex justify-between font-semibold bg-indigo-950 text-white p-4 rounded-xl">
          <div className="flex space-x-4">
            <p>{eventData?.meeting_name}</p>
            <p>{eventData?.date_start}</p>
            <p>{eventData?.session_name}</p>
          </div>
          <div className="flex space-x-4">
            <div className="flex space-x-2">
              <p>Temp</p>
              <p>{`${eventData?.weatherData?.air_temperature}°C`}</p>
            </div>
            <div className="flex space-x-2">
              <p>Track Temp</p>
              <p>{`${eventData?.weatherData?.track_temperature}°C`}</p>
            </div>
            <div className="flex space-x-2">
              <p>Downfall</p>
              <p>{`${eventData?.weatherData?.rainfall}%`}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
