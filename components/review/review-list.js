"use client";
import { useState } from "react";
import RatingStars from "@/components/review/rating-stars";
import ReviewForm from "@/components/review/review-form";

export default function ReviewList({ id_barang, ulasan = [], onAddUlasan }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-xs font-semibold text-slate-300 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
      >
        {ulasan.length > 0 ? `Ulasan (${ulasan.length})` : "Tulis Ulasan"}
        <span className="material-symbols-outlined text-base">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-4">
          {ulasan.length === 0 ? (
            <p className="text-xs text-slate-500">
              Belum ada ulasan. Jadi yang pertama!
            </p>
          ) : (
            <div className="space-y-3">
              {ulasan.map((u, i) => (
                <div
                  key={u.id_review || i}
                  className="text-xs border-b border-slate-800/80 pb-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">
                      {u.nama_user || u.nama || `User #${u.id_user}`}
                    </span>
                    <RatingStars rating={u.rating} size={14} />
                  </div>
                  <p className="text-slate-400 leading-relaxed font-normal">
                    {u.komentar}
                  </p>
                </div>
              ))}
            </div>
          )}
          <ReviewForm id_barang={id_barang} onSubmit={onAddUlasan} />
        </div>
      )}
    </div>
  );
}