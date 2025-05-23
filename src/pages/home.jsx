import { DriverTable } from '../components/driver-table';
import { Section } from '../components/layout';
import { RaceControl } from '../components/race-control';
import { SessionData } from '../components/session-data';

export function Home() {
  return (
    <Section>
      <title>Live Data</title>
      <div className="flex space-x-6">
        <div className="flex flex-col w-2/3 h-full">
          <SessionData />
          <DriverTable />
        </div>
        <div className="flex flex-col w-1/3 h-full">
          <RaceControl />
        </div>
      </div>
    </Section>
  );
}

export default Home;
