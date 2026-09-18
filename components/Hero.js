import React from 'react';

export default function Hero({
  category = "KATALOG INVENTARIS",
  title = "Daftar Barang",
  description = "Pilih perlengkapan resmi, busana seremonial, dan atribut kampus yang tersedia untuk dipinjam secara terpusat dan terverifikasi."
}) {
  return (
    <div className="w-full bg-[#ffffff] p-6 sm:p-8 rounded-2xl shadow-sm mb-6">
      <span className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">
        {category}
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h1>

      <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
  );
}