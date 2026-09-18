"use client";
import { useState } from "react";

export default function Hero() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Cari:", query);
  };

  return (
    <section className="py-[2rem] md:py-[3rem] bg-[#f1f4f9] rounded-xl px-[1rem] md:px-[2rem] mb-[2rem]">
      <div className="max-w-2xl">
        <span className="text-[11px] leading-[14px] tracking-[0.02em] font-semibold uppercase tracking-wider text-[#575f67] mb-[0.5rem] block">
          Sistem Informasi Penyewaan Perlengkapan Acara
        </span>
        <h1 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] tracking-[-0.02em] font-bold text-[#181c20] mb-[0.5rem]">Selamat Datang</h1>
        <p className="text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#44474c] mb-[1.5rem]">
          Temukan barang untuk kebutuhan acara Anda.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-[0.5rem] bg-white p-[0.25rem] rounded-lg shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="flex-1 flex items-center px-[0.75rem] gap-[0.5rem]">
            <span className="material-symbols-outlined text-[#575f67] text-[20px]">search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-[#181c20] placeholder:text-[#575f67] text-[14px] focus:outline-none py-[0.5rem]"
              placeholder="Cari barang..."
              type="text"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="w-full sm:w-auto bg-[#2f3a4a] text-white hover:opacity-90 text-[14px] font-medium px-[1.5rem] py-[0.5rem] rounded-lg transition-colors flex items-center justify-center gap-[0.5rem] h-10"
          >
            <span>Cari</span>
          </button>
        </form>
      </div>
    </section>
  );
}