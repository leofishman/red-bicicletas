const mongoose = require('mongoose');
const Reserva = require('./reserva')

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre: {
    type: String,
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema)