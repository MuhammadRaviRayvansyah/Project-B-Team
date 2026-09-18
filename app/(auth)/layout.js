import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AuthLayout({ children }) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col justify-between bg-slate-100 antialiased select-none">
      {/* Header terkunci di atas */}
      <div className="shrink-0 px-4 pt-2 bg-white">
        <Header />
      </div>

      {/* Main Content (Card Login) otomatis presisi di tengah */}
      <main className="flex-1 flex items-center justify-center p-4 my-auto overflow-hidden">
        {children}
      </main>

      {/* Footer terkunci di bawah */}
      <div className="shrink-0 px-4 pb-2">
        <Footer variant="auth" />
      </div>
    </div>
  );
}