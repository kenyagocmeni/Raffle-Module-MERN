import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchRaffles, updateRaffle, clearMessages } from '../../../../redux/slices/raffleSlice';

export default function AdminEditRafflePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query; // Çekiliş ID'si
  const { raffles, successMessage, error } = useSelector((state) => state.raffle);

  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    categories: [{ name: '', prizes: [{ name: '', quantity: 1 }] }],
  });

  useEffect(() => {
    if (!raffles.length) {
      dispatch(fetchRaffles());
    }
  }, [dispatch, raffles]);

  useEffect(() => {
    const raffle = raffles.find((raffle) => raffle._id === id);
    if (raffle) {
      setFormData({
        title: raffle.title,
        startDate: raffle.startDate.split('T')[0],
        endDate: raffle.endDate.split('T')[0],
        categories: raffle.categories.map((category) => ({
          name: category.name,
          prizes: category.prizes.map((prize) => ({ name: prize.name, quantity: prize.quantity })),
        })),
      });
    }
  }, [raffles, id]);

  const handleCategoryChange = (index, e) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[index][e.target.name] = e.target.value;
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handlePrizeChange = (categoryIndex, prizeIndex, e) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex].prizes[prizeIndex][e.target.name] = e.target.value;
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleAddCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, { name: '', prizes: [{ name: '', quantity: 1 }] }],
    });
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = formData.categories.filter((_, i) => i !== index);
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleAddPrize = (categoryIndex) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex].prizes.push({ name: '', quantity: 1 });
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleRemovePrize = (categoryIndex, prizeIndex) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex].prizes = updatedCategories[categoryIndex].prizes.filter(
      (_, i) => i !== prizeIndex
    );
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateRaffle({ id, ...formData }));
  };

  return (
    <div className="min-h-screen bg-[#313030] text-[#FFCC00] px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Çekilişi Düzenle</h1>
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Çekiliş Başlığı"
          required
          className="w-full px-4 py-2 bg-[#444] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#444] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#444] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
        />
        <h2 className="text-xl font-semibold">Kategoriler</h2>
        {formData.categories.map((category, index) => (
          <div key={index} className="border border-[#FFCC00] p-4 rounded-lg space-y-4">
            <input
              type="text"
              name="name"
              value={category.name}
              onChange={(e) => handleCategoryChange(index, e)}
              placeholder="Kategori Adı"
              className="w-full px-4 py-2 bg-[#444] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleRemoveCategory(index)}
              className="text-red-500 text-sm"
            >
              Kategoriyi Kaldır
            </button>
            <h3 className="text-lg font-semibold">Ödüller</h3>
            {category.prizes.map((prize, prizeIndex) => (
              <div key={prizeIndex} className="space-y-2">
                <input
                  type="text"
                  name="name"
                  value={prize.name}
                  onChange={(e) => handlePrizeChange(index, prizeIndex, e)}
                  placeholder="Ödül Adı"
                  className="w-full px-4 py-2 bg-[#444] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
                />
                <input
                  type="number"
                  name="quantity"
                  value={prize.quantity}
                  onChange={(e) => handlePrizeChange(index, prizeIndex, e)}
                  placeholder="Miktar"
                  min="1"
                  className="w-full px-4 py-2 bg-[#444] text-[#FFCC00] border border-[#FFCC00] rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePrize(index, prizeIndex)}
                  className="text-red-500 text-sm"
                >
                  Ödülü Kaldır
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddPrize(index)}
              className="w-full py-2 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
            >
              Ödül Ekle
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCategory}
          className="w-full py-2 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
        >
          Kategori Ekle
        </button>
        <button
          type="submit"
          className="w-full py-3 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}