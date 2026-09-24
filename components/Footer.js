import Link from "next/link";

export default function Footer({
  variant = "app",
  copyright = "© 2026 PEPAC. All rights reserved.",
  links = [
    { label: "Panduan", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Bantuan", href: "#" },
  ],
}) {
  if (variant === "auth") {
    return (
      <footer className="w-full max-w-5xl mx-auto py-4 text-center text-[11px] text-slate-600 font-sans relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span>{copyright}</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <div className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-amber-700 hover:underline transition-colors"
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
    <footer className="w-full bg-amber-400 border-t border-amber-500/30 py-8 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-900/80 mt-0.5">
             {copyright}
          </p>
        </div>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-slate-900 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}