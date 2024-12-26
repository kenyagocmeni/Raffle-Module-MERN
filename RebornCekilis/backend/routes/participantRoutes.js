const express = require('express');
const asyncHandler = require('express-async-handler');
const Participant = require('../models/Participant');
const Raffle = require('../models/Raffle');

const participantRouter = express.Router();

// Kullanıcı Kaydı ve Çekilişe Katılım
participantRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, phone, instagram, id, category } = req.body;

    // Çekilişi bulun ve kategori kontrolü yap
    const raffle = await Raffle.findById(id).populate('categories.participants');
    if (!raffle) {
      return res.status(404).json({ message: 'Geçersiz çekiliş ID: Çekiliş bulunamadı.' });
    }

    // Çekilişin sonlandırılıp sonlandırılmadığını kontrol et
    const isRaffleCompleted = raffle.categories.some((category) =>
      category.prizes.some((prize) => prize.winners && prize.winners.length > 0)
    );
    if (isRaffleCompleted) {
      return res.status(400).json({ message: 'Bu çekiliş sonlandırılmış, katılım yapılamaz.' });
    }

    // Çekilişin bitiş tarihini kontrol et
    const now = new Date();
    if (new Date(raffle.endDate) < now) {
      return res.status(400).json({ message: 'Bu çekilişin süresi dolmuş, katılım yapılamaz.' });
    }

    const categoryIndex = raffle.categories.findIndex((cat) => cat.name === category);
    if (categoryIndex === -1) {
      return res.status(400).json({ message: 'Geçersiz kategori: Çekilişte böyle bir kategori yok.' });
    }

    // Email, Telefon ve Instagram için tekrar kontrolü
    const existingParticipants = raffle.categories[categoryIndex].participants.map((participantId) =>
      Participant.findById(participantId)
    );

    const participantsData = await Promise.all(existingParticipants);

    // Email kontrolü
    if (participantsData.some((p) => p.email === email)) {
      return res.status(400).json({ message: 'Bu e-posta ile bu kategoride zaten çekilişe katılınmış.' });
    }

    // Telefon kontrolü
    if (participantsData.some((p) => p.phone === phone)) {
      return res.status(400).json({ message: 'Bu telefon numarası ile bu kategoride zaten çekilişe katılınmış.' });
    }

    // Instagram kontrolü
    if (participantsData.some((p) => p.instagram === instagram)) {
      return res.status(400).json({ message: 'Bu Instagram kullanıcı adı ile bu kategoride zaten çekilişe katılınmış.' });
    }

    // Katılımcının varlığını kontrol et
    let participant = await Participant.findOne({ email });
    if (participant) {
      const alreadyParticipated = participant.participations.some(
        (p) => p.raffleId.toString() === id && p.category === category
      );
      if (alreadyParticipated) {
        return res.status(400).json({ message: 'Bu kategoride zaten çekilişe katıldınız.' });
      }
    } else {
      // Yeni katılımcı oluştur
      participant = new Participant({ name, email, phone, instagram });
    }

    // Yeni katılım ekle
    participant.participations.push({ raffleId: id, category });
    await participant.save();

    // Katılımcıyı kategoriye ekle
    raffle.categories[categoryIndex].participants.push(participant._id);
    await raffle.save();

    // Katılımcı bilgileriyle birlikte geri dön
    const updatedParticipant = await Participant.findById(participant._id);
    res.status(201).json({ message: 'Katılım başarılı!', participant: updatedParticipant });
  })
);

module.exports = participantRouter;