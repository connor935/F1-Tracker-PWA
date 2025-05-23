import { DriverTable } from '../components/driver-table';
import { Section } from '../components/layout';
import { SessionData } from '../components/session-data';

export function Home() {
  return (
    <Section>
      <title>Home</title>
      <SessionData />
      <DriverTable />
    </Section>
  );
}

export default Home;
