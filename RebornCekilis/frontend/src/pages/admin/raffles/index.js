import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRaffles,
  deleteRaffle,
  endRaffle,
  resetRaffle,
  clearMessages,
} from "../../../redux/slices/raffleSlice";
import { useRouter } from "next/router";

export default function AdminRaffleListPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { raffles, loading, error, successMessage } = useSelector((state) => state.raffle);

  useEffect(() => {
    dispatch(fetchRaffles());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      dispatch(fetchRaffles());
      setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
    }
  }, [successMessage, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Bu çekilişi silmek istediğinize emin misiniz?")) {
      dispatch(deleteRaffle(id));
    }
  };

  const handleEndRaffle = (id) => {
    if (window.confirm("Bu çekilişi sonlandırmak istediğinize emin misiniz?")) {
      dispatch(endRaffle(id)).then(() => {
        dispatch(fetchRaffles());
      });
    }
  };

  const handleResetRaffle = (id) => {
    if (window.confirm("Bu çekilişi sıfırlamak istediğinize emin misiniz? Tüm katılımcılar silinecek!")) {
      dispatch(resetRaffle(id));
    }
  };

  const handleViewWinners = (id) => {
    router.push(`/admin/raffles/winners/${id}`);
  };

  const handleViewDetails = (id) => {
    router.push(`/admin/raffles/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#313030] text-[#FFCC00] px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Çekiliş Listesi</h1>
      {loading && <p className="text-center text-xl font-semibold">Yükleniyor...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {successMessage && (
        <p className="text-center text-green-500 mb-4">{successMessage}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {raffles.map((raffle) => {
          const isRaffleCompleted = raffle.categories.some((category) =>
            category.prizes.some((prize) => prize.winners.length > 0)
          );

          return (
            <div
              key={raffle._id}
              className="p-6 bg-[#1D1D1D] rounded-lg border border-[#FFCC00] shadow-lg"
            >
              <h2 className="text-xl font-bold mb-2">{raffle.title}</h2>
              <p className="text-sm">
                <span className="font-semibold">Başlangıç:</span>{" "}
                {new Date(raffle.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm mb-4">
                <span className="font-semibold">Bitiş:</span>{" "}
                {new Date(raffle.endDate).toLocaleDateString()}
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleViewDetails(raffle._id)}
                  className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-300"
                >
                  Detayına Git
                </button>
                {!isRaffleCompleted && (
                  <button
                    onClick={() => router.push(`/admin/raffles/edit/${raffle._id}`)}
                    className="w-full px-4 py-2 bg-[#FFCC00] text-black rounded-lg hover:bg-[#FFD633] transition duration-300"
                  >
                    Düzenle
                  </button>
                )}
                {!isRaffleCompleted ? (
                  <button
                    onClick={() => handleEndRaffle(raffle._id)}
                    className="w-full px-4 py-2 bg-[#FFCC00] text-black rounded-lg hover:bg-[#FFD633] transition duration-300"
                  >
                    Çekilişi Gerçekleştir
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleViewWinners(raffle._id)}
                      className="w-full px-4 py-2 bg-[#FFCC00] text-black rounded-lg hover:bg-[#FFD633] transition duration-300"
                    >
                      Kazananları Gör
                    </button>
                    <button
                      onClick={() => handleResetRaffle(raffle._id)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Çekilişi Sıfırla
                    </button>
                  </>
                )}
                                <button
                  onClick={() => handleDelete(raffle._id)}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Sil
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}