"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [profit, setProfit] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [range, setRange] = useState("7d");
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/analytics");
    const json = await res.json();
    setData(json);
  };

  const fetchProfit = async () => {
    const res = await fetch("/api/analytics/profit");
    const json = await res.json();
    setProfit(json);
  };

  const fetchCustomers = async () => {
    const res = await fetch("/api/analytics/customers");
    const json = await res.json();
    setCustomers(json);
  };

  useEffect(() => {
    fetchData();
    fetchProfit();
    fetchCustomers();

    const interval = setInterval(() => {
      fetchData();
      fetchProfit();
      fetchCustomers();
    }, 5000);

    socket.on("new-order", () => {
      const audio = new Audio("/notify.mp3");
      audio.play();

      fetchData();
      fetchProfit();
      fetchCustomers();
    });

    return () => {
      clearInterval(interval);
      socket.off("new-order");
    };
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  const getChartData = () => {
    const source =
      range === "7d"
        ? data.last7Days
        : range === "30d"
        ? data.last30Days
        : data.last365Days;

    return Object.entries(source).map(
      ([name, value]: any) => ({
        name: name.slice(5),
        value,
      })
    );
  };

  const chartData = getChartData();

  const exportExcel = async () => {
    setExporting(true);

    const XLSX = await import("xlsx");

    const ws1 = XLSX.utils.json_to_sheet(data.topMenu);
    const ws2 = XLSX.utils.json_to_sheet(profit);
    const ws3 = XLSX.utils.json_to_sheet(customers);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws1, "Top Menu");
    XLSX.utils.book_append_sheet(wb, ws2, "Profit");
    XLSX.utils.book_append_sheet(wb, ws3, "Customers");

    XLSX.writeFile(wb, "restaurant-report.xlsx");

    setTimeout(() => setExporting(false), 800);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: `Rp ${data.totalRevenue.toLocaleString()}`,
    },
    {
      title: "Predicted Tomorrow",
      value: `Rp ${data.prediction.nextDay.toLocaleString()}`,
    },
    {
      title: "Predicted Week",
      value: `Rp ${data.prediction.nextWeek.toLocaleString()}`,
    },
  ];

  return (
    <div className="p-6 space-y-10">

      <div>
        <h1 className="text-4xl font-black">
          Dashboard
        </h1>
        <p className="text-gray-500">
          Real-time restaurant intelligence system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.title}
            className="bg-white p-4 rounded-xl"
          >
            <p>{s.title}</p>
            <h2 className="text-2xl font-bold">
              {s.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {["7d", "30d", "365d"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded ${
              range === r
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl">
        <h2 className="font-bold mb-2">
          Revenue Chart
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#000"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-xl">
        <h2 className="font-bold mb-2">
          Profit per Menu Item
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profit}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profit" fill="#00C853" />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid gap-2 mt-4">
          {profit.map((p) => (
            <div key={p.name} className="p-3 bg-gray-50 rounded-xl">
              <p className="font-bold">{p.name}</p>
              <p>Revenue: Rp {p.revenue}</p>
              <p>Cost: Rp {p.cost}</p>
              <p className="text-green-600 font-bold">
                Profit: Rp {p.profit}
              </p>
              <p>
                Margin: {p.margin?.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl">
        <h2 className="font-bold mb-2">
          Customer Behavior
        </h2>

        <div className="grid gap-3">
          {customers.map((c) => (
            <div
              key={c.customerId}
              className="p-3 bg-gray-50 rounded-xl"
            >
              <p className="font-bold">
                {c.customerId}
              </p>
              <p>Total Spent: Rp {c.totalSpent}</p>
              <p>Orders: {c.orders}</p>
              <p>Favorite: {c.favoriteItem}</p>
              <p>
                Last Visit:{" "}
                {new Date(
                  c.lastVisit
                ).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl">
        <h2 className="font-bold mb-2">
          Top Selling Menu
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.topMenu}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="qty" fill="#000" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={exportExcel}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        {exporting
          ? "Exporting..."
          : "Download Full Report"}
      </button>
    </div>
  );
}