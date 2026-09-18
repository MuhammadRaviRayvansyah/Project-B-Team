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
  if (variant === "auth") {
    return (
      <footer className="w-full max-w-6xl mx-auto py-3 text-center text-xs text-[#6C757D]">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
          <span>{copyright}</span>
          <span className="hidden sm:inline text-[#CBD5E1]">•</span>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[#212529] hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-white border-t border-[#e0e3e8] mt-auto">
      <div className="max-w-[1200px] mx-auto px-[1rem] md:px-[2rem] py-[2rem] flex flex-col md:flex-row items-center justify-between gap-[1rem]">
        <div className="flex flex-col sm:flex-row items-center gap-[0.5rem] sm:gap-[0.75rem] text-center sm:text-left">
          <span className="text-[13px] leading-[18px] tracking-[0.01em] text-[#44474c]">{copyright}</span>
          <span className="hidden sm:inline text-[#44474c] text-[13px]">•</span>
          <span className="text-[13px] leading-[18px] tracking-[0.01em] text-[#44474c]">{subtitle}</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-[1.5rem]">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[12px] leading-[16px] tracking-[0.01em] font-medium text-[#44474c] hover:text-[#181c20] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}