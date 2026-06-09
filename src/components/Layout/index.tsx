import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 min-h-[calc(100vh-64px)] page-fade-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { Sidebar } from './Sidebar';
export { Header } from './Header';
export default MainLayout;
