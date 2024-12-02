const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//const Usuario = require('./models/Usuario');
const usuarioRoutes = require('./routes/usuarioRoutes');
const intelisisRoutes = require('./routes/intelisisRoutes');
const consecutivo = require('./routes/consecutivo.router');
const feicCat = require('./routes/feic/feicCat.router');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

mongoose.connect('mongodb://localhost:27017/feic', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api', usuarioRoutes);
app.use('/api', intelisisRoutes);
app.use('/api', consecutivo);
app.use('/api', feicCat);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
