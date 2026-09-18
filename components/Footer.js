import Link from "next/link";

export default function Footer({
  variant = "app",
  copyright = "© 2026 RentWear. All rights reserved.",
  subtitle = "Sistem Informasi Penyewaan Perlengkapan Acara",
  links = [
    { label: "Panduan Layanan", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Pusat Bantuan", href: "#" },
  ],
}) {
  // Tampilan khusus Auth (Login/Register)
  if (variant === "auth") {
    return (
      <footer className="w-full max-w-5xl mx-auto py-2 text-center text-[11px] text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4">
          <span>{copyright}</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-slate-900 hover:underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  // Tampilan umum Aplikasi / Beranda
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span className="text-xs leading-relaxed text-slate-600">
            {copyright}
          </span>
          <span className="hidden sm:inline text-slate-400 text-xs">•</span>
          <span className="text-xs leading-relaxed text-slate-600">
            {subtitle}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}