import { useEffect } from 'react';
import { Section } from '../components/layout';
import { useDrivers } from '../utils/driver-context';
import { Table } from '../components/table';

export function Home() {
  const { drivers, isLoading, error } = useDrivers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  useEffect(() => {
    console.log(drivers);
  }, [drivers]);

  return (
    <Section>
      <title>Home</title>

      <Table.Wrapper className="mt-4" shadow={false}>
        <Table.Head>
          <Table.HeadCell>No.</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>Driver</Table.HeadCell>
          <Table.HeadCell>Team</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {drivers.map(driver => (
            <Table.Row key={driver.driver_number}>
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
