const mongoose = require('mongoose');
const Reserva = require('./reserva');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 10;

const Schema = mongoose.Schema;
const Token = require('../models/token');
const mailer = require('../mailer/mailer');

const validateEmail = function(email){
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
};


const usuarioSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
      type: String,
      trim: true,
      required: [true, 'El email es obligatorio'],
      lowercase: true,
      unique: true,
      validate:[validateEmail, 'Por favor, ingrese un email válido'],
      match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/]
  },
  password: {
      type: String,
      required: [true, 'El password es obligatorio']
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  verificado: {
    type: Boolean,
    default: false
  },
});

usuarioSchema.plugin(uniqueValidator, {message : 'El {PATH} ya existe con otro usuario'});

usuarioSchema.pre('save', function(next){
  if (this.isModified('password')){
      this.password = bcrypt.hashSync(this.password, saltRounds);
  }
  next();
});

usuarioSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
    var reserva = new Reserva({
      usuario: this._id,
      bicicleta: biciId,
      desde,
      hasta
    })
    console.log(reserva)
    reserva.save(cb);
  }  

usuarioSchema.methods.enviar_email_bienvenida = function(cb){
  const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
  const email_destination = this.email;

  token.save(function(err){
      if(err)
          return console.log(err.message);

      const mailOptions = {
          from: 'no-reply@redbicicletas.com',
          to: email_destination,
          subject: 'Verificación de cuenta',
          text: 'Hola,\n\n Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
      };

      mailer.sendMail(mailOptions, function(err){
          if(err)
              return console.log(err.message);

          console.log('Se ha enviado un email de bienvenida a: ' + email_destination + '.');
      });
  });
}

usuarioSchema.methods.resetPassword = function(cb){
    const token = new Token({userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err){
        if(err)
            return cb(err);
        
        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text: 'Hola,\n\n Por favor, para resetear el password de su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function(err){
            if(err)
                return cb(err);
            
            console.log('Se envio un mail para resetear el password a: ' + email_destination + '.');
        });

        cb(null);
    });
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log(condition);
    self.findOne({
        $or: [
            {'googleId': condition.id}, {'email': condition.emails[0].value}
    ]}, (err, result) => {
        if(result)
            callback(err, result);
        else {
            console.log('------------ Condition ------------');
            console.log(condition);
            let values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'Sin Nombre';
            values.verificado = true;
            values.password = condition._json.sub;
            console.log('------------ Values ------------');
            console.log(values);
            self.create(values, (err, result) => {
                if(err)
                    console.log(err);
                return callback(err, result);
            })
        }
    })
};

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log(condition);
    self.findOne({
        $or: [
            {'facebookId': condition.id}, {'email': condition.emails[0].value}
    ]}, (err, result) => {
        if(result)
            callback(err, result);
        else {
            console.log('------------ Condition ------------');
            console.log(condition);
            let values = {};
            values.facebookId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'Sin Nombre';
            values.verificado = true;
            values.password = crypto.randomBytes(16).toString('hex');
            console.log('------------ Values ------------');
            console.log(values);
            self.create(values, (err, result) => {
                if(err)
                    console.log(err);
                return callback(err, result);
            })
        }
    })
};

module.exports = mongoose.model('Usuario', usuarioSchema)