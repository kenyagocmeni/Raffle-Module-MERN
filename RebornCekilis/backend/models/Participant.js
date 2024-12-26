const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  instagram: { type: String, required: true },
  participations: [
    {
      raffleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Raffle' },
      category: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Participant', ParticipantSchema);