import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-2">
          <Link className="block p-2 rounded hover:bg-gray-100" href="/admin">
            Dashboard
          </Link>

          <Link className="block p-2 rounded hover:bg-gray-100" href="/admin/menu">
            Menu
          </Link>

          <Link className="block p-2 rounded hover:bg-gray-100" href="/admin/orders">
            Orders
          </Link>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}