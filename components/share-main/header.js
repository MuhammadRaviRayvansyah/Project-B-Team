
export default function Header({
  category,
  title,
  description,
}) {
  return (
    <section className="pt-10 pb-8 border-b border-slate-200">
      <div className="max-w-3xl">
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-900 text-[11px] font-extrabold uppercase tracking-widest">
          {category}
        </span>

        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
