import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#313030] text-[#FFCC00] flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-5xl font-bold mb-6">Hoş Geldiniz!</h1>
      <p className="text-lg text-center text-[#FFD633] mb-8 max-w-md">
        Çekilişlerimize katılmak ve harika ödüller kazanmak için doğru yerdesiniz.
      </p>
      <div className="space-y-6">
        <Link href="/raffle">
          <div className="block w-full max-w-md px-6 py-3 bg-[#FFCC00] text-[#131313] font-bold text-center rounded-lg shadow hover:bg-[#FFD633] transition duration-300">
            Mevcut Çekilişleri Gör
          </div>
        </Link>
      </div>
    </div>
  );
}