export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Orders",
      value: "120",
    },
    {
      title: "Revenue",
      value: "Rp 2.5M",
    },
    {
      title: "Menu Items",
      value: "35",
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-4xl font-black text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Monitor restaurant performance and operations.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.title}</p>

            <h2 className="mt-3 text-4xl font-black text-gray-900">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}