"use client";

import { useState } from "react";
import RatingStars from "@/components/RatingStars";
import ReviewForm from "@/components/ReviewForm";

export default function ReviewList({ ulasan = [], onAddUlasan }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-xs font-semibold text-slate-700 hover:underline flex items-center gap-1"
      >
        {ulasan.length > 0 ? `Ulasan (${ulasan.length})` : "Tulis Ulasan"}
        <span className="material-symbols-outlined text-base">{open ? "expand_less" : "expand_more"}</span>
      </button>

      {open && (
        <div className="mt-2">
          {ulasan.length === 0 ? (
            <p className="text-xs text-slate-500">Belum ada ulasan. Jadi yang pertama!</p>
          ) : (
            <div className="space-y-3">
              {ulasan.map((u, i) => (
                <div key={i} className="text-xs border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{u.nama}</span>
                    <RatingStars rating={u.rating} size={14} />
                  </div>
                  <p className="text-slate-500 mt-0.5">{u.komentar}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{u.tanggal_review}</p>
                </div>
              ))}
            </div>
          )}

          <ReviewForm onSubmit={onAddUlasan} />
        </div>
      )}
    </div>
  );
}