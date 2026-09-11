import Link from "next/link";

export default function CategoryCard({ icon, nama, jumlah }) {
  return (
    <Link
      href="#"
      className="bg-white p-[1rem] rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
    >
      <div className="w-12 h-12 rounded-lg bg-[#ebeef3] flex items-center justify-center text-[#181c20] mb-[0.75rem] group-hover:bg-[#2f3a4a] group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <span className="text-[15px] leading-[22px] font-semibold text-[#181c20]">{nama}</span>
      <span className="text-[11px] leading-[14px] tracking-[0.02em] font-semibold text-[#575f67] mt-[0.25rem]">{jumlah}</span>
    </Link>
  );
}