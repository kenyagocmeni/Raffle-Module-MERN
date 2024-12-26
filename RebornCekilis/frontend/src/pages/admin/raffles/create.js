import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRaffle, clearMessages } from "../../../redux/slices/raffleSlice";

export default function AdminCreateRafflePage() {
  const dispatch = useDispatch();
  const { successMessage, error } = useSelector((state) => state.raffle);

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    categories: [{ name: "", prizes: [{ name: "", quantity: 1 }] }],
  });

  const handleCategoryChange = (index, e) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[index][e.target.name] = e.target.value;
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handlePrizeChange = (categoryIndex, prizeIndex, e) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex].prizes[prizeIndex][e.target.name] =
      e.target.value;
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleAddCategory = () => {
    setFormData({
      ...formData,
      categories: [
        ...formData.categories,
        { name: "", prizes: [{ name: "", quantity: 1 }] },
      ],
    });
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = formData.categories.filter((_, i) => i !== index);
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleAddPrize = (categoryIndex) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex].prizes.push({ name: "", quantity: 1 });
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleRemovePrize = (categoryIndex, prizeIndex) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex].prizes = updatedCategories[
      categoryIndex
    ].prizes.filter((_, i) => i !== prizeIndex);
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createRaffle(formData));
  };

  return (
    <div className="min-h-screen bg-[#313030] text-[#FFCC00] px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Çekiliş Oluştur</h1>
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-6 bg-[#1D1D1D] p-6 rounded-lg shadow-lg border border-[#FFCC00]"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Çekiliş Başlığı"
          required
          className="w-full px-4 py-2 bg-[#444] border border-[#FFCC00] rounded-lg text-[#FFCC00]"
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          required
          className="w-full px-4 py-2 bg-[#444] border border-[#FFCC00] rounded-lg text-[#FFCC00]"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
          required
          className="w-full px-4 py-2 bg-[#444] border border-[#FFCC00] rounded-lg text-[#FFCC00]"
        />
        <h2 className="text-xl font-semibold">Kategoriler</h2>
        {formData.categories.map((category, index) => (
          <div
            key={index}
            className="p-4 bg-[#1D1D1D] border border-[#FFCC00] rounded-lg space-y-4"
          >
            <input
              type="text"
              name="name"
              value={category.name}
              onChange={(e) => handleCategoryChange(index, e)}
              placeholder="Kategori Adı"
              className="w-full px-4 py-2 bg-[#444] border border-[#FFCC00] rounded-lg text-[#FFCC00]"
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
                  className="w-full px-4 py-2 bg-[#444] border border-[#FFCC00] rounded-lg text-[#FFCC00]"
                />
                <input
                  type="number"
                  name="quantity"
                  value={prize.quantity}
                  onChange={(e) => handlePrizeChange(index, prizeIndex, e)}
                  placeholder="Miktar"
                  min="1"
                  className="w-full px-4 py-2 bg-[#444] border border-[#FFCC00] rounded-lg text-[#FFCC00]"
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
              className="px-4 py-2 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
            >
              Ödül Ekle
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCategory}
          className="px-4 py-2 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#FFD633] transition duration-300"
        >
          Kategori Ekle
        </button>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-[#FFCC00] text-[#131313] font-bold rounded-lg hover:bg-[#4CBFFF] transition duration-300"
        >
          Oluştur
        </button>
      </form>
    </div>
  );
}