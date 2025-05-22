import { Outlet } from 'react-router';

import { DataProvider } from '../utils/data-context';

export function BaseLayout({}) {
  return (
    <div className="flex flex-col w-dvw h-dvh">
      <DataProvider>
        <Outlet />
      </DataProvider>
    </div>
  );
}

export default BaseLayout;

export function Section({ children }) {
  return (
    <div className="flex flex-col w-full h-full p-4 mx-auto max-w-7xl">
      {children}
    </div>
  );
}
