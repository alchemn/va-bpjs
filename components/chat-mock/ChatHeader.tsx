export default function ChatHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md p-4 rounded-3xl ring-1 ring-sky-100">
      <div>
        <h1 className="text-xl font-bold text-slate-900">BPJS Virtual Assistant</h1>
        <p className="text-sm text-slate-600">Selamat datang di layanan bantuan digital BPJS Kesehatan</p>
      </div>
    </header>
  );
}
