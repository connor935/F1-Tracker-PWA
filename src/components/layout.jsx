import { Outlet } from "react-router";

import { DriversProvider } from "../utils/driver-context";

export function BaseLayout({}) {
  return (
    <div className="flex flex-col w-dvw h-dvh">
      <DriversProvider>
        <Outlet />
      </DriversProvider>
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
