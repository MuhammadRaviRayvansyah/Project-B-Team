import Link from "next/link";

export default function Hero({
  category = "PEMINJAMAN PAKAIAN ACARA",
  title = "Pakaian Terbaik untuk Acara Spesial Anda",
  description = "Sewa batik, jas, sepatu, dan perlengkapan acara kampus secara cepat, mudah, dan terintegrasi.",
}) {
  return (
    <section className="bg-[#8eb0c7] rounded-[32px] p-8 sm:p-12 md:p-14 text-white overflow-hidden my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Text Content */}
        <div className="lg:col-span-7 space-y-6">
          <p className="text-xs tracking-wider uppercase font-medium text-white/80">
            {category}
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed">
            {description}
          </p>
          <div className="pt-2">
            <Link
              href="/barang"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95"
            >
              Mulai Peminjaman
            </Link>
          </div>
        </div>

        {/* Hero Image Block */}
        <div className="lg:col-span-5 relative">
          <div className="w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg bg-slate-200">
            <img
              src="/images/hero-banner.jpg" 
              alt="Perlengkapan PEPAC"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}