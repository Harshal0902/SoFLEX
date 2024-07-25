import Navbar from "@/components/Navbar";

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div>
      <Navbar />
      <main className='flex-grow flex-1 pt-16'>
        {children}
      </main>
    </div>
  );
}
