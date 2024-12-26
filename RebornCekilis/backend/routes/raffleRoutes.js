const express = require('express');
const asyncHandler = require('express-async-handler');
const Raffle = require('../models/Raffle');
const Participant = require("../models/Participant");

const raffleRouter = express.Router();

// Çekiliş Oluşturma
raffleRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, categories, startDate, endDate } = req.body;

    const updatedCategories = categories.map((category) => ({
      ...category,
      participants: [],
      prizes: category.prizes.map((prize) => ({
        ...prize,
        winners: []
      }))
    }));

    const raffle = new Raffle({
      title,
      categories: updatedCategories,
      startDate,
      endDate
    });

    await raffle.save();
    res.status(201).json({ message: 'Çekiliş başarıyla oluşturuldu!', raffle });
  })
);

// Çekilişi Düzenleme
raffleRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, startDate, endDate, categories } = req.body;

    const raffle = await Raffle.findById(id);
    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı.' });
    }

    raffle.title = title || raffle.title;
    raffle.startDate = startDate || raffle.startDate;
    raffle.endDate = endDate || raffle.endDate;
    raffle.categories = categories || raffle.categories;

    await raffle.save();

    res.status(200).json({ message: 'Çekiliş başarıyla güncellendi.', raffle });
  })
);

// Çekilişi Silme
raffleRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const raffle = await Raffle.findById(id);
      if (!raffle) {
        return res.status(404).json({ message: 'Çekiliş bulunamadı.' });
      }

      for (const category of raffle.categories) {
        await Participant.deleteMany({ _id: { $in: category.participants } });
      }

      await Raffle.deleteOne({ _id: id });

      res.status(200).json({ message: 'Çekiliş ve tüm ilişkili katılımcılar başarıyla silindi!' });
    } catch (error) {
      console.error('Hata:', error);
      res.status(500).json({ message: 'Çekiliş silinirken bir hata oluştu.' });
    }
  })
);

// Çekilişin Detaylarını Getirme
raffleRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const raffle = await Raffle.findById(id)
      .populate('categories.participants')
      .populate('categories.prizes.winners');

    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı.' });
    }

    res.status(200).json(raffle);
  })
);

// Çekiliş sonuçlarını belirleme:
raffleRouter.post(
  '/:id/draw',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const raffle = await Raffle.findById(id).populate('categories.participants');
    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı.' });
    }

    const alreadyCompleted = raffle.categories.some((category) =>
      category.prizes.some((prize) => prize.winners.length > 0)
    );
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Bu çekiliş zaten sonlandırılmış.' });
    }

    raffle.categories.forEach((category) => {
      const usedWinners = new Set();

      category.prizes.forEach((prize) => {
        let availableParticipants = category.participants.filter(
          (participant) => !usedWinners.has(participant._id.toString())
        );

        if (availableParticipants.length === 0) {
          prize.winners = []; // Hiç katılımcı yoksa ödül kazananı yok
          return;
        }

        // Eğer ödül sayısı katılımcı sayısından fazla ise, tüm katılımcılar ödül kazanır
        if (availableParticipants.length < prize.quantity) {
          prize.winners = availableParticipants.map((participant) => {
            usedWinners.add(participant._id.toString());
            return participant._id;
          });
        } else {
          // Ödül sayısı katılımcı sayısına eşit veya daha azsa rastgele kazananları seç
          const shuffledParticipants = availableParticipants.sort(() => Math.random() - 0.5);
          const winners = shuffledParticipants.slice(0, prize.quantity);

          prize.winners = winners.map((winner) => {
            usedWinners.add(winner._id.toString());
            return winner._id;
          });
        }
      });
    });

    await raffle.save();

    res.status(200).json({ message: 'Kazananlar belirlendi!', raffle });
  })
);

// Çekilişi Geri Alma
raffleRouter.post(
  '/:id/reset',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const raffle = await Raffle.findById(id).populate('categories.participants');
    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı.' });
    }

    for (const category of raffle.categories) {
      await Participant.deleteMany({ _id: { $in: category.participants } });
    }

    raffle.categories.forEach((category) => {
      category.participants = [];
      category.prizes.forEach((prize) => {
        prize.winners = [];
      });
    });

    await raffle.save();

    res.status(200).json({ message: 'Çekiliş sıfırlandı.', raffle });
  })
);

// Çekilişin kazananlarını görme:
raffleRouter.get(
  '/:id/winners',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const raffle = await Raffle.findById(id)
      .populate('categories.participants')
      .populate('categories.prizes.winners');

    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı.' });
    }

    const winners = raffle.categories.map((category) => ({
      category: category.name,
      prizes: category.prizes.map((prize) => ({
        _id: prize._id, // _id bilgisini prize nesnesine ekliyoruz
        prizeName: prize.name,
        winners: prize.winners.map((winner) => ({
          name: winner.name,
          email: winner.email,
          phone: winner.phone,
          instagram: winner.instagram
        }))
      }))
    }));

    res.status(200).json({ message: 'Kazananlar başarıyla getirildi!', winners });
  })
);

// Tüm Çekilişleri Getirme
raffleRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const raffles = await Raffle.find({});
    res.status(200).json(raffles);
  })
);

//Vazgeçilen ödülü sahiplendirme:
raffleRouter.post(
  '/:id/categories/:categoryName/prizes/:prizeId/reassign',
  asyncHandler(async (req, res) => {
    const { id, categoryName, prizeId } = req.params;

    const raffle = await Raffle.findById(id).populate('categories.participants');
    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı.' });
    }

    const category = raffle.categories.find((cat) => cat.name === categoryName);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    const prize = category.prizes.find((pr) => pr._id.toString() === prizeId);
    if (!prize) {
      return res.status(404).json({ message: 'Ödül bulunamadı.' });
    }

    if (prize.winners.length === 0) {
      return res.status(400).json({ message: 'Bu ödül için zaten kazanan yok.' });
    }

    // Ödülden mevcut kazananı kaldır
    const removedWinnerId = prize.winners.pop();

    // Hiç ödül kazanmamış katılımcıları filtrele
    const unawardedParticipants = category.participants.filter((participant) => {
      return !category.prizes.some((p) =>
        p.winners.some((winnerId) => winnerId.toString() === participant._id.toString())
      );
    });

    if (unawardedParticipants.length === 0) {
      await raffle.save();
      return res.status(200).json({
        message: 'Ödülden kazanan kaldırıldı, ancak yedek katılımcı bulunamadı.',
        prize,
      });
    }

    // Rastgele bir yeni kazanan seç
    const newWinner =
      unawardedParticipants[Math.floor(Math.random() * unawardedParticipants.length)];
    prize.winners.push(newWinner._id);

    await raffle.save();

    res.status(200).json({
      message: 'Kazanan başarıyla değiştirildi.',
      removedWinnerId,
      newWinner,
      raffle
    });
  })
);

module.exports = raffleRouter;
