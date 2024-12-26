import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  participateInRaffle,
  clearMessages,
  fetchRaffleDetails,
} from "../../../redux/slices/raffleSlice";
import { useRouter } from "next/router";

export default function RaffleParticipatePage({ query }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { raffleDetails, successMessage, error } = useSelector(
    (state) => state.raffle
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    category: "",
  });
  const [instagramError, setInstagramError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    switch (name) {
      case "name":
        sanitizedValue = value.trim();
        break;
      case "email":
        sanitizedValue = value.trim();
        break;
      case "phone":
        sanitizedValue = value.replace(/[^0-9]/g, "");
        break;
      case "instagram":
        sanitizedValue = value;
        if (/\s/.test(value)) {
          setInstagramError("Instagram kullanıcı adı boşluk içeremez.");
        } else {
          setInstagramError("");
        }
        break;
      default:
        sanitizedValue = value;
        break;
    }

    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Geçerli bir e-posta adresi girin.");
      return;
    }

    if (instagramError) {
      return;
    }

    dispatch(participateInRaffle({ ...formData, id: query.id }));
  };

  useEffect(() => {
    if (query.id) {
      dispatch(fetchRaffleDetails(query.id));
    }
  }, [dispatch, query.id]);

  useEffect(() => {
    if (successMessage) {
      // Başarılı mesaj alınırsa kullanıcıyı yönlendir
      router.push("/raffle/participate/congrats");
    } else if (error) {
      const timeout = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, error, dispatch, router]);

  return (
    <div className="min-h-screen bg-[#313030] text-[#FFCC00] flex flex-col items-center justify-center px-4 py-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 px-6 py-3 my-3 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD999] transition duration-300"
      >
        Çekiliş Detayları
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#313030] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#131313] text-[#FFCC00] p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Çekiliş Detayları</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#FFCC00] text-xl font-bold"
              >
                ×
              </button>
            </div>
            {raffleDetails ? (
              <>
                <p className="mt-4">
                  Başlangıç:{" "}
                  {new Date(raffleDetails.startDate).toLocaleDateString()} - Bitiş:{" "}
                  {new Date(raffleDetails.endDate).toLocaleDateString()}
                </p>
                <h3 className="mt-6 text-xl font-semibold">Ödüller</h3>
                <ul className="mt-4 space-y-4">
                  {raffleDetails.categories.map((category, index) => (
                    <li key={index} className="border p-4 rounded">
                      <h4 className="text-lg font-bold">{category.name}</h4>
                      <ul className="mt-2 space-y-2">
                        {category.prizes.map((prize, idx) => (
                          <li key={idx}>
                            <p>
                              {prize.quantity} kişiye {prize.name} ödülü
                            </p>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Yükleniyor...</p>
            )}
          </div>
        </div>
      )}

      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#131313] p-6 rounded-lg shadow-lg border border-[#FFCC00] space-y-4"
      >
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#1D1D1D] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
        >
          <option value="">Kategori Seçin</option>
          {raffleDetails?.categories?.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Ad Soyad"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#1D1D1D] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#1D1D1D] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#1D1D1D] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
        />
        <input
          type="text"
          name="instagram"
          placeholder="Instagram"
          value={formData.instagram}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#1D1D1D] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
        />
        {instagramError && (
          <p className="text-red-500 text-sm">{instagramError}</p>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
        >
          Katıl
        </button>
      </form>
    </div>
  );
}

RaffleParticipatePage.getInitialProps = ({ query }) => {
  return { query };
};