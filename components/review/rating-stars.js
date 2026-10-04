export default function RatingStars({ rating = 0, size = 16 }) {
  const bintang = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-[2px]">
      {bintang.map((b) => {
        const filled = b <= Math.round(rating);
        return (
          <span
            key={b}
            className={`material-symbols-outlined ${
              filled ? "text-amber-400" : "text-slate-700"
            }`}
            style={{
              fontSize: size,
              fontVariationSettings: `"FILL" ${filled ? 1 : 0}`,
            }}
          >
            star
          </span>
        );
      })}
    </div>
  );
}