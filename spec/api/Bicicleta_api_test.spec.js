var mongoose = require('mongoose');
var axios = require('axios');
var Bicicleta = require("../../models/bicicleta");
var server = require('../../bin/www')
var URL = 'http://localhost:3000/api/bicicletas';


describe('Test Bicicleta', () => {


    let db;
    conectar = (done) => {
      var mongoDB = 'mongodb://localhost/bicicletasTest';
      console.log("mongoDB: ", mongoDB)
      mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
  
      db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error'));
      db.once('open', function () {
        console.log('We are connected to test database!');
        done();
      });
    ;}

    beforeAll(function (done) {
      if(mongoose.connection.readyState){
        db = mongoose.connection;
        done();
      } else {
        conectar(done);
      }
    });

  afterEach((done) => {
    Bicicleta.deleteMany({}, (err, success) => {
      if (err) console.log(err);
      done();
    });
  });


  describe('GET BICICLETAS / ', () => {
    it('Status 200', async (done) => {
        console.log('rrrr', URL);
      axios.get(URL, function (error, response, body) {

      }).then(response => {
         let data = response.data;
        expect(response.status).toBe(200);
        expect(data.bicicletas.length).toBe(0);
        done();
      });
    });
  });

  describe('POST BICICLETAS /create', () => {
    it('STATUS 200', (done) => {
      var headersR = {
        'Content-Type': 'application/json'
      };
      var aBici = {
        "code": 10,
        "color": "rojo",
        "modelo": "urbana",
        "lat": "-54.36",
        "lng": "-74.35"
      };
      axios.post(URL + '/create', aBici, {
        headers: headersR
      })
        .then(response => {
          expect(response.status).toBe(200);
          let bici = response.data.bicicleta
          expect(bici.code).toBe(aBici.code)
          expect(bici.color).toBe(aBici.color)
          expect(bici.modelo).toBe(aBici.modelo)
          expect(bici.ubicacion[0]).toBe(Number(aBici.lat))
          expect(bici.ubicacion[1]).toBe(Number(aBici.lng))

          done();
        });
    });
  });

  describe('PUT BICICLETAS /update', () => {
    it('STATUS 200', (done) => {
      var headersR = {
        'content-type': 'application/json'
      };
      var bici = new Bicicleta({
        code: 10,
        color: "azul",
        modelo: "urbana",
        ubicacion: [-54.36, -74.35]
      });
      bici.save();
      const id = bici.id;
      let update = {
        color: "azul",
        modelo: "Deportiva"
      }
      axios.put(`${URL}/${id}/update`, update, {
        headers: headersR
      })
        .then(response => {
          expect(response.status).toBe(200);
           const id = response.data.bicicleta._id
          Bicicleta.findById(id).exec((err, biciBD) => {
            expect(biciBD.modelo).toBe(update.modelo)
            expect(biciBD.color).toBe(update.color)
            done();
          });
        });
    });
  });

  describe('DELETE BICICLETAS /delete', () => {
    it('STATUS 204', (done) => {
      var headersR = {
        'content-type': 'application/json'
      };
      var aBici = {
        "code": 10,
        "color": "rojo",
        "modelo": "urbana"
      }
      Bicicleta.add(aBici, (err, data) => {
        axios.delete(`http://localhost:3000/api/bicicletas/${data._id}/delete`, {
          headers: headersR
        })
          .then(response => {
            expect(response.status).toBe(204);
            Bicicleta.findById(data._id).exec((err, biciBD) => {
              expect(biciBD).toBeNull();
              done();
            }); 
          });
      });
    });
  });
});
