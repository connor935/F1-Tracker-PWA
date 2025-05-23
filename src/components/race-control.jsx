import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';

import { customFetcher } from '../utils/fetcher';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export function RaceControl({ sessionKey = 'latest', updateInterval = 30000 }) {
  const [flagStatus, setFlagStatus] = useState(null);

  const {
    data: raceControlData,
    isLoading: raceControlLoading,
    trigger: loadRaceControl,
  } = useSWRMutation(
    `https://api.openf1.org/v1/race_control?session_key=${sessionKey}`,
    customFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    loadRaceControl();

    const raceControlInterval = setInterval(() => {
      loadRaceControl();
    }, updateInterval);

    return () => clearInterval(raceControlInterval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (raceControlData) {
      //console.log('Race Control data:', raceControlData);
      if (raceControlData[raceControlData.length - 1].category === 'Flag') {
        const flag = raceControlData[raceControlData.length - 1];
        if (flag?.date == flagStatus?.date) return;
        toast(`FLAG STATUS: ${flag?.flag}`, {
          icon: '🚩',
          style: {
            background: '#333',
            color: '#fff',
          },
        });

        if (flag?.flag !== 'GREEN' && flag?.flag !== 'CLEAR') {
          setFlagStatus(flag);
        } else {
          setFlagStatus(null);
        }
      }
    }
  }, [raceControlData]);

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      {flagStatus?.flag ? (
        <div className="relative w-full max-h-44 flex space-x-2 items-center overflow-y-auto bg-indigo-950 text-white p-4 rounded-xl">
          <div
            className={clsx('w-12 h-8', {
              'bg-green-500': flagStatus?.flag === 'GREEN',
              'bg-yellow-500': flagStatus?.flag === 'YELLOW',
              'bg-red-500': flagStatus?.flag === 'RED',
            })}
          />
          <p className="text-xl">{flagStatus?.message}</p>
        </div>
      ) : null}
      <div className="relative w-full max-h-72 flex flex-col overflow-y-auto bg-indigo-950 text-white p-4 rounded-xl">
        <p className="font-semibold text-2xl bg-indigo-950">
          Race Control Data
        </p>
        {raceControlData
          ?.slice(0)
          .reverse()
          .map((item, index) => (
            <div
              key={index}
              className="flex flex-col w-full border-b border-white py-2"
            >
              <div className="flex w-full space-x-2 justify-between">
                <span className="font-semibold">{item.message}</span>
                <span className="text-sm">
                  {new Date(item.date).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
