const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Bağlantısı Başarılı!'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/participants', require('./routes/participantRoutes'));
app.use('/api/raffles', require('./routes/raffleRoutes'));

// Sunucu
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu çalışıyor: http://localhost:${PORT}`));