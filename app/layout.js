import { UserProvider } from "@/components/UserContexts";
import AuthGuard from "@/components/AuthGuard";
import "./globals.css";

export const metadata = {
  title: "RentWear - Portal Peminjaman Mahasiswa",
  description: "Sistem manajemen peminjaman barang dan perlengkapan inventaris kampus secara dinamis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col">
        <UserProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </UserProvider>
      </body>
    </html>
  );
}