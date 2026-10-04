import Link from "next/link";
import Image from "next/image";

export default function Footer({
  variant = "app",
  copyright = "© 2026 PEPAC. All rights reserved.",
  links = [
    { label: "-", href: "/barang" },
    { label: "-", href: "/peminjaman" },
    { label: "-", href: "/#keunggulan" },
    { label: "-", href: "/#about" },
    { label: "-", href: "/#kontak" },
  ],
}) {
  if (variant === "auth") {
    return (
      <footer className="w-full max-w-5xl mx-auto py-4 text-center text-[11px] text-slate-400 font-sans relative z-10"> 
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span>{copyright}</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <div className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-amber-400 hover:underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#091823] border-t border-white/15 shadow-2xl shadow-black/40 mt-auto relative overflow-hidden font-sans pt-12 px-6 sm:px-8 lg:px-12 text-slate-300">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Grid Utam multi-kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-16">
          
          {/* Kolom 1: Brand & Description (Span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full  flex items-center justify-center p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Logo PEPAC"
                  width={63}
                  height={63}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h2 className="text-xl font-black tracking-wider text-white flex items-center gap-1.5 leading-none">
                PEPAC
              </h2>
            </Link>

            <h3 className="text-lg font-bold text-white tracking-tight">
              -
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              -
            </p>
          </div>

          {/* Kolom 2: EKSPLORASI (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Eksplorasi
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: TERHUBUNG (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Terhubung
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="mailto:halo@pepac.id"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  -
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  -
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  -
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  -
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: LAYANAN / LOKASI (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Layanan
            </h4>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-white">-</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                -
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}