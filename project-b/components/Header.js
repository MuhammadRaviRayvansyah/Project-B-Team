export default function Header({ subtitle = "Sistem Informasi Penyewaan Perlengkapan Acara" }) {
  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#2F3A4A] flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4a2 2 0 0 1 2 2c0 1.05-.7 1.94-1.68 2.16L20 13a1 1 0 0 1-.5 1.87H4.5A1 1 0 0 1 4 13l7.68-4.84A2.002 2.002 0 0 1 12 4z" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>
        <span className="font-semibold text-base tracking-tight text-[#212529]">RentWear</span>
      </div>
      <div className="text-xs text-[#6C757D] font-medium hidden sm:block">{subtitle}</div>
    </header>
  );
}