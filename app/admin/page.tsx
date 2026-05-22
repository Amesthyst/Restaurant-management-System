export default function Admin() {
    return (
      <div className="flex min-h-screen">
        {/* MAIN */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
  
          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="card">
              <p>Total Orders</p>
              <h2 className="text-2xl font-bold">120</h2>
            </div>
  
            <div className="card">
              <p>Revenue</p>
              <h2 className="text-2xl font-bold">Rp 2.5M</h2>
            </div>
  
            <div className="card">
              <p>Menu Items</p>
              <h2 className="text-2xl font-bold">35</h2>
            </div>
          </div>
        </main>
      </div>
    );
  }