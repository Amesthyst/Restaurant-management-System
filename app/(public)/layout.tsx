export default function PublicLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="border-b bg-white p-4">
          <h1 className="font-bold">🍽 Restaurant</h1>
        </header>
  
        <main className="flex-1 max-w-6xl mx-auto w-full p-4">
          {children}
        </main>
      </div>
    );
  }