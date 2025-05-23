import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';

export function BaseLayout({}) {
  return (
    <div className="flex flex-col max-w-dvw h-dvh">
      <Toaster />
      <Outlet />
    </div>
  );
}

export default BaseLayout;

export function Section({ children }) {
  return (
    <div className="flex flex-col w-full h-full p-4 mx-auto">{children}</div>
  );
}
