"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTable } from "@/store/table-store";

export default function TableEntry() {
  const [tableNo, setTableNo] = useState("");
  const router = useRouter();
  const setTable = useTable((s) => s.setTable);

  const handleEnter = () => {
    if (!tableNo) return;

    setTable(tableNo);
    router.push(`/table/${tableNo}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-80 rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-bold">Enter Table</h1>

        <input
          type="number"
          className="mt-4 w-full border p-2"
          value={tableNo}
          onChange={(e) => setTableNo(e.target.value)}
        />

        <button
          onClick={handleEnter}
          className="mt-4 w-full bg-black p-2 text-white"
        >
          Enter
        </button>
      </div>
    </div>
  );
}