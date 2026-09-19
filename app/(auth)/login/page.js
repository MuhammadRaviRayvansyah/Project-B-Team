import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9ff] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Masuk Akun</h1>
        <p className="text-xs text-slate-500 mb-6">Silakan masuk menggunakan akun terdaftar.</p>

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Kampus</label>
            <input
              type="email"
              name="email"
              required
              placeholder="nama@student.unram.ac.id"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-3 rounded-xl transition-colors shadow-sm"
          >
            Masuk Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}