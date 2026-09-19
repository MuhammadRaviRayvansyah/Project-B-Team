import { getReview, getBarang } from "@/lib/api";
import RatingStars from "@/components/RatingStars";
import Hero from "@/components/Hero";

export default async function ManajemenReviewPage() {
  const [revRes, barRes] = await Promise.all([getReview(), getBarang()]);
  const reviewList = Array.isArray(revRes) ? revRes : revRes.data || [];
  const barangList = Array.isArray(barRes) ? barRes : barRes.data || [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <Hero category="ADMIN • REVIEW" title="Manajemen Ulasan" description="Pantau ulasan dan rating yang diberikan pengguna." />
      <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-xs sm:text-sm font-semibold text-slate-500 uppercase border-b">
                <th className="py-4 px-4 sm:px-6">User</th><th className="py-4 px-4 sm:px-6">Barang</th>
                <th className="py-4 px-4 sm:px-6">Rating</th><th className="py-4 px-4 sm:px-6 w-1/2">Komentar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {reviewList.map((review) => {
                const brg = barangList.find(b => (b.id_barang || b.id) === (review.id_barang || review.barang_id)) || {};
                return (
                  <tr key={review.id_review || review.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-bold">{review.nama_user || `User #${review.id_user}`}</td>
                    <td className="py-3 px-4 sm:px-6 font-semibold text-slate-700">{brg.nama_barang || "Barang"}</td>
                    <td className="py-3 px-4 sm:px-6"><RatingStars rating={review.rating} size={16} /></td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">{review.komentar}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}