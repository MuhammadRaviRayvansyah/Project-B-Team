import Navbar from "@/components/share-main/navbar";
import Footer from "@/components/share-main/footer";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}