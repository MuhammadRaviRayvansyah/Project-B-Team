import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 px-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#2F3A4A] flex items-center justify-center text-white overflow-hidden relative">
          <Image
            src="/logo.jpeg"
            alt="RentWear Logo"
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
        <span className="font-semibold text-base tracking-tight text-[#212529]">
          RentWear
        </span>
      </div>
      <div className="text-xs text-[#6C757D] font-semibold hidden sm:block">
        Sistem Informasi Penyewaan Perlengkapan Acara
      </div>
    </header>
  );
}