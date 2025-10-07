interface ErrorViewProps {
  error: string;
  onReload: () => void;
}

export default function ErrorView({ error, onReload }: ErrorViewProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
        <p className="mb-4 text-base font-semibold text-slate-800">{error}</p>
        <p className="mb-6 text-sm text-slate-500">
          Coba segarkan halaman atau tekan tombol di bawah untuk memuat ulang.
        </p>
        <button
          onClick={onReload}
          className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          Muat ulang informasi
        </button>
      </div>
    </div>
  );
}
