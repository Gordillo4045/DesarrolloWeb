export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      {/* <Navbar /> */}
      <main className="container mx-auto max-w-7xl px-2 md:px-6 flex-grow pt-2">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <span className="text-default-600">Hecha por&nbsp;</span>
        <p className="text-primary">Andre Vizuet</p>
      </footer>
    </div>
  );
}
