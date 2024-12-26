import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWinners, clearMessages, reassignWinner } from "../../../../redux/slices/raffleSlice";
import { useRouter } from "next/router";

export default function RaffleWinnersPage() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { winners, loading, error, successMessage } = useSelector((state) => state.raffle);

  useEffect(() => {
    if (id) {
      dispatch(fetchWinners(id));
    }
  }, [dispatch, id]);

  const handleReassignWinner = async (categoryName, prizeId) => {
    if (window.confirm("Bu ödül için talihliyi değiştirmek istediğinize emin misiniz?")) {
      await dispatch(reassignWinner({ id, categoryName, prizeId }));
      dispatch(fetchWinners(id));
    }
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

  return (
    <div className="min-h-screen bg-[#313030] text-[#FFCC00] px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Kazananlar</h1>
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}
      {winners.length === 0 ? (
        <p className="text-center text-gray-400">Henüz kazananlar belirlenmemiş.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map((category, index) => (
            <div
              key={index}
              className="p-4 bg-[#1D1D1D] border border-[#FFCC00] rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4 text-center">{category.category}</h2>
              <div className="space-y-4">
                {category.prizes.map((prize, idx) => {
                  console.log("Prize data:", prize);
                  return (
                    <div key={idx} className="p-4 bg-[#131313] border border-[#FFCC00] rounded-lg">
                      <p className="font-semibold text-[#FFCC00]">
                        Ödül: <span className="font-bold">{prize.prizeName}</span>
                      </p>
                      <ul className="ml-4 mt-2 space-y-2">
                        {prize.winners.map((winner, i) => (
                          <li key={i} className="text-sm text-gray-300">
                            <span className="font-medium">{winner.name}</span> -{" "}
                            <span>{winner.email}</span> -{" "}
                            <span>{winner.instagram}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() =>
                          handleReassignWinner(category.category, prize._id)
                        }
                        className="mt-4 w-full py-2 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
                      >
                        Yeniden Sahiplendir
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}