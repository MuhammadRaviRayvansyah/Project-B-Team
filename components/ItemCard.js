import Link from "next/link";

export default function ItemCard({
  id,
  nama,
  kategori,
  ukuran,
  stok,
  hargaPerHari,
  img,
}) {
  const tersedia = Number(stok) > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative w-full aspect-[4/3] bg-[#ebeef3] overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={img}
          alt={nama}
        />
        <div className="absolute top-[0.5rem] right-[0.5rem]">
          <span className="bg-white/95 text-[#181c20] px-[0.5rem] py-[0.25rem] rounded text-[11px] leading-[14px] tracking-[0.02em] font-semibold flex items-center gap-1 shadow-sm">
            <span
              className={
                tersedia
                  ? "w-2 h-2 rounded-full bg-[#16A34A]"
                  : "w-2 h-2 rounded-full bg-[#DC2626]"
              }
            />
            {tersedia ? "Tersedia" : "Tidak Tersedia"}
          </span>
        </div>
      </div>
      <div className="p-[1rem] flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-[0.5rem] mb-[0.25rem]">
            <div>
              <h3 className="text-[16px] leading-[24px] font-semibold text-[#181c20]">
                {nama}
              </h3>
              <span className="inline-block mt-1 text-[12px] leading-[16px] text-[#575f67]">
                {kategori}
              </span>
            </div>
            <span className="shrink-0 text-[15px] leading-[22px] font-semibold text-[#2f3a4a]">
              Rp{hargaPerHari.toLocaleString("id-ID")}
              <span className="text-[11px] font-medium text-[#575f67]">
                /hari
              </span>
            </span>
          </div>
          <div className="flex items-center gap-[1rem] py-[0.5rem] text-[#575f67] text-[13px] leading-[18px] tracking-[0.01em] mb-[0.75rem]">
            <div className="flex items-center gap-[0.25rem]">
              <span className="text-[12px] leading-[16px] font-medium text-[#181c20]">
                Ukuran:
              </span>
              <span>{ukuran}</span>
            </div>
            <span className="text-[#d7dadf]">•</span>
            <div className="flex items-center gap-[0.25rem]">
              <span className="text-[12px] leading-[16px] font-medium text-[#181c20]">
                Stok:
              </span>
              <span>{stok}</span>
            </div>
          </div>
        </div>
        <div className="pt-[0.5rem]">
          {tersedia ? (
            <Link href={`/barang/${id}`} className="block w-full">
              <button
                type="button"
                className="w-full bg-[#2f3a4a] text-white hover:opacity-90 text-[14px] font-medium py-[0.5rem] rounded-lg transition-colors flex items-center justify-center gap-[0.5rem] h-10"
              >
                <span>Lihat Detail</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="w-full bg-[#e0e3e8] text-[#9aa0a6] cursor-not-allowed text-[14px] font-medium py-[0.5rem] rounded-lg flex items-center justify-center gap-[0.5rem] h-10"
            >
              <span>Lihat Detail</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}