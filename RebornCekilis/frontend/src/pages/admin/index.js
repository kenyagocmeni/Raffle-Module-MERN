import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-[#313030] text-[#FFCC00] flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-8">Admin Paneli</h1>
      <div className="space-y-6 w-full max-w-md">
        <Link
          href="/admin/raffles"
          className="block w-full px-6 py-4 bg-[#FFCC00] text-[#131313] text-center font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
        >
          Çekilişleri Listele
        </Link>
        <Link
          href="/admin/raffles/create"
          className="block w-full px-6 py-4 bg-white text-[#131313] text-center font-bold rounded-lg hover:bg-gray-200 transition duration-300"
        >
          Çekiliş Oluştur
        </Link>
      </div>
    </div>
  );
}