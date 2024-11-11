const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//const Usuario = require('./models/Usuario');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/feic', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api', usuarioRoutes);

// app.post('/api/register', async (req, res) => {
//   try {
//     const nuevoUsuario = new Usuario(req.body);
//     await nuevoUsuario.save();
//     res.status(201).send(nuevoUsuario);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Endpoint to verify reCAPTCHA token
// app.post('/verify-recaptcha', async (req, res) => {
//   const token = req.body.token;
//   if (!token) {
//     return res.status(400).json({ success: false, message: 'Token is missing' });
//   }

//   try {
//     const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
//       params: {
//         secret: RECAPTCHA_SECRET_KEY,
//         response: token,
//       },
//     });

//     const { success, score } = response.data;
//     if (success && score >= 0.5) {
//       res.json({ success: true, message: 'Human verified' });
//     } else {
//       res.status(400).json({ success: false, message: 'Verification failed, score too low' });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
