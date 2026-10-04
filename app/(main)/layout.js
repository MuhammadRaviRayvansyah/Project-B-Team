import Navbar from "@/components/share-main/navbar";
import Footer from "@/components/share-main/footer";

export default function MainLayout({ children }) {
  return (
    <div className="m-0 p-0 bg-[#06131a] text-slate-100 min-h-screen antialiased overflow-x-hidden selection:bg-amber-400 selection:text-slate-950 flex flex-col relative">
      
      {/* Background Grid Kotak-Kotak */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      <Navbar />

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}