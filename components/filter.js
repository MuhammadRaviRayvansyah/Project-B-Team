export default function ItemFilter({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  selectedSize, 
  onSizeChange,
  categoryOptions = ["Semua", "Jas Almamater", "Toga Wisuda", "Perlengkapan", "Atribut"],
  sizeOptions = ["Semua", "S", "M", "L", "XL", "XXL"]
}) {
  return (
    <div className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
      <div className="relative flex-1 w-full">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#575f67] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama barang atau nomor katalog..."
          className="w-full bg-[#f1f5f9] text-[#181c20] placeholder-[#575f67] pl-10 pr-4 py-2.5 rounded-lg text-[14px] leading-relaxed border-none focus:outline-none focus:ring-2 focus:ring-[#2f3a4a] transition-all"
        />
      </div>

      <div className="w-full md:w-auto min-w-[200px]">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-[#f1f5f9] text-[#181c20] px-4 py-2.5 rounded-lg text-[14px] leading-relaxed cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-[#2f3a4a] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23575f67%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_1rem_center] bg-no-repeat pr-8"
        >
          {categoryOptions.map((cat, idx) => (
            <option key={idx} value={cat}>
              Kategori: {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-auto min-w-[180px]">
        <select
          value={selectedSize}
          onChange={(e) => onSizeChange(e.target.value)}
          className="w-full bg-[#f1f5f9] text-[#181c20] px-4 py-2.5 rounded-lg text-[14px] leading-relaxed cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-[#2f3a4a] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23575f67%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_1rem_center] bg-no-repeat pr-8"
        >
          {sizeOptions.map((sz, idx) => (
            <option key={idx} value={sz}>
              Ukuran: {sz}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}