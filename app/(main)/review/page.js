import { getBarang, getReview } from "@/lib/api";
import Hero from "@/components/Hero";
import ReviewClient from "./ReviewClient";

export default async function ReviewPage() {
  const [barRes, revRes] = await Promise.all([getBarang(), getReview()]);
  const barangList = Array.isArray(barRes) ? barRes : barRes.data || [];
  const reviewList = Array.isArray(revRes) ? revRes : revRes.data || [];

  return (
    <div className="min-h-screen bg-[#f7f9ff] pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-6">
        <Hero
          category="PENILAIAN"
          title="Review Barang"
          description="Pilih barang yang pernah Anda pinjam dan berikan penilaian serta ulasan Anda."
        />
        <ReviewClient barangList={barangList} reviewList={reviewList} />
      </div>
    </div>
  );
}