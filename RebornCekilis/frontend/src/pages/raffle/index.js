import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRaffles } from "../../redux/slices/raffleSlice";
import Link from "next/link";

export default function RaffleListPage() {
  const dispatch = useDispatch();
  const { raffles, loading, error } = useSelector((state) => state.raffle);

  useEffect(() => {
    dispatch(fetchRaffles());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#131313] text-[#FFCC00]">
        <p className="text-xl font-semibold">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#131313] text-[#FFCC00]">
        <p className="text-xl font-semibold">Hata: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#313030] text-[#FFCC00] flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Mevcut Çekilişler</h1>
      {raffles.length === 0 ? (
        <p className="text-center mt-4 text-gray-400">Henüz çekiliş yok.</p>
      ) : (
        <ul className="w-full max-w-md space-y-4">
          {raffles.map((raffle) => (
            <li
              key={raffle._id}
              className="p-6 bg-[#131313] border border-[#FFCC00] rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2">{raffle.title}</h2>
              <p className="text-sm">
                <span className="font-medium">Başlangıç:</span>{" "}
                {new Date(raffle.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Bitiş:</span>{" "}
                {new Date(raffle.endDate).toLocaleDateString()}
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href={`/raffle/participate/${raffle._id}`}
                  className="w-full max-w-[200px] text-center px-6 py-3 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
                >
                  Çekilişe Katıl
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}