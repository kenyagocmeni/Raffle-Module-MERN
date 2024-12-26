import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRaffleDetails, endRaffle, fetchRaffles } from "../../../redux/slices/raffleSlice";

export default function RaffleDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { raffleDetails, loading, error, successMessage } = useSelector((state) => state.raffle);

  useEffect(() => {
    if (id) {
      dispatch(fetchRaffleDetails(id));
    }
  }, [dispatch, id]);

  const handleEndRaffle = () => {
    dispatch(endRaffle(id)).then(() => {
      dispatch(fetchRaffleDetails(id));
    });
  };

  const handleEditRaffle = () => {
    router.push(`/admin/raffles/edit/${id}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#313030] text-[#FFCC00]">
        <p className="text-xl font-semibold">Yükleniyor...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#313030] text-red-500">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  if (!raffleDetails)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#313030] text-gray-400">
        <p className="text-xl font-semibold">Çekiliş bulunamadı.</p>
      </div>
    );

  const isRaffleCompleted = raffleDetails.categories.some((category) =>
    category.prizes.some((prize) => prize.winners.length > 0)
  );

  return (
    <div className="min-h-screen bg-[#313030] text-[#FFCC00] px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">{raffleDetails.title}</h1>
      <p className="text-center mb-6">
        Başlangıç: {new Date(raffleDetails.startDate).toLocaleDateString()} - Bitiş:{" "}
        {new Date(raffleDetails.endDate).toLocaleDateString()}
      </p>

      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}

      <h2 className="text-2xl font-semibold mb-4">Katılımcılar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {raffleDetails.categories.flatMap((category) =>
          category.participants.map((participant) => (
            <div
              key={participant._id}
              className="p-4 bg-[#1D1D1D] border border-[#FFCC00] rounded-lg shadow-lg"
            >
              <p>
                <span className="font-bold">Adı:</span> {participant.name}
              </p>
              <p>
                <span className="font-bold">Email:</span> {participant.email}
              </p>
              <p>
                <span className="font-bold">Telefon:</span> {participant.phone}
              </p>
              <p>
                <span className="font-bold">Instagram:</span> {participant.instagram}
              </p>
            </div>
          ))
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Ödüller</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {raffleDetails.categories.flatMap((category) =>
          category.prizes.map((prize) => (
            <div
              key={prize._id}
              className="p-4 bg-[#1D1D1D] border border-[#FFCC00] rounded-lg shadow-lg"
            >
              <p>
                <span className="font-bold">Ödül:</span> {prize.name}
              </p>
              <p>
                <span className="font-bold">Miktar:</span> {prize.quantity}
              </p>
              <h3 className="mt-4 font-semibold">Kazananlar:</h3>
              <ul className="mt-2 space-y-2">
                {prize.winners.map((winner) => (
                  <li
                    key={winner._id}
                    className="text-sm text-gray-300 border-b border-gray-500 pb-2"
                  >
                    {winner.name} - {winner.email}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center">
        {!isRaffleCompleted && (
          <>
            <button
              onClick={handleEndRaffle}
              className="px-6 py-3 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
            >
              Çekilişi Gerçekleştir
            </button>
            <button
              onClick={handleEditRaffle}
              className="px-6 py-3 bg-[#00A2FF] text-white font-bold rounded-lg hover:bg-[#4CBFFF] transition duration-300"
            >
              Çekilişi Düzenle
            </button>
          </>
        )}
      </div>
    </div>
  );
}