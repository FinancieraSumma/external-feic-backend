const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  nit: {
    type: String,
    required: true,
    unique: true
  },
  correoElectronico: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} no es un correo electrónico válido!`
    }
  },
  password: {
    type: String,
    required: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number,
    default: 0
  },
});

const Usuario = mongoose.model('Usuario', esquemaUsuario);

module.exports = Usuario;

// Después de definir este esquema, ahora puedes usarlo para crear, leer, actualizar y eliminar datos de registro de usuarios.

// Ejemplo para agregar un nuevo usuario:

// const nuevoUsuario = new Usuario({
//   correoElectronico: 'usuario@ejemplo.com',
//   tipoUsuario: 'Individual',
//   nombre: 'Juan',
//   apellido: 'Pérez',
//   contraseña: 'contraseñaSegura123',
//   numerosTelefono: ['+123456789']
// });

// nuevoUsuario.save()
//   .then(() => console.log('Usuario registrado exitosamente'))
//   .catch(err => console.error('Error al registrar usuario:', err));
