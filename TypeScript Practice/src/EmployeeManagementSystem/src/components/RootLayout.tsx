import { Outlet, Link } from "@tanstack/react-router";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold">User Manager</h1>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/create" className="hover:underline">
              Add User
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
