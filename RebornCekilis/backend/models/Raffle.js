const mongoose = require('mongoose');

const RaffleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  categories: [
    {
      name: { type: String, required: true },
      participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }
      ],
      prizes: [
        {
          name: { type: String },
          quantity: { type: Number },
          winners: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }
          ]
        }
      ]
    }
  ],
  startDate: { type: Date },
  endDate: { type: Date }
});

module.exports = mongoose.model('Raffle', RaffleSchema);