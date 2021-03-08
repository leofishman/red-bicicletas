var Bicicleta = require('../../models/bicicleta');
var mongoose = require('mongoose');
let server = require('../../bin/www');

describe('Testing Bicicletas', function () {

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
    }
    beforeAll(function (done) {
      if(mongoose.connection.readyState){
        db = mongoose.connection;
        done();
      } else {
        conectar(done);
      }
    });
  
    afterEach(function (done) {
      Bicicleta.deleteMany({}, function (err, success) {
        done();
        if (err) console.log(err);
      })
    });
  
    describe('Bicicleta.createInstance', () => {
      it('crea una instancia de Bicicleta', () => {
        var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);
  
        expect(bici.code).toBe(1);
        expect(bici.color).toBe("verde");
        expect(bici.modelo).toBe("urbana");
        expect(bici.ubicacion[0]).toEqual(-34.5);
        expect(bici.ubicacion[1]).toEqual(-54.1);
      });
    });
  
  
    describe('Bicicleta.allBicis', () => {
      it('comienza vacia', (done) => {
        Bicicleta.allBicis(function (err, bicis) {
          expect(bicis.length).toBe(0);
          done();
        });
      });
    });
  
    describe('Bicicleta.add', () => {
      it('agrega solo una bici', (done) => {
        var aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
        Bicicleta.add(aBici, function (err, newBici) {
          if (err) console.log(err);
          Bicicleta.allBicis(function (err, bicis) {
            expect(bicis.length).toEqual(1);
            expect(bicis[0].code).toEqual(aBici.code);
            done();
          });
        });
      });
    });
  
    describe('Bicicleta.findByCode', () => {
      it('debe de devolver la bici con code 1', (done) => {
        Bicicleta.allBicis(function (err, bicis) {
          expect(bicis.length).toBe(0);
  
          var aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
          Bicicleta.add(aBici, function (err, newBici) {
            if (err) console.log(err);
            var aBici2 = new Bicicleta({ code: 2, color: "roja", modelo: "deportiva" });
            Bicicleta.add(aBici2, function (err, newBici) {
              if (err) console.log(err);
              Bicicleta.findByCode(1, function (error, targetBici) {
                expect(targetBici.code).toBe(aBici.code);
                expect(targetBici.color).toBe(aBici.color);
                expect(targetBici.modelo).toBe(aBici.modelo);
                done();
              });
            });
          });
        });
      });
    });

    describe('Bicicleta.remove', () => {
        it('agrega solo una bici y la borra', (done) => {
          var aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
          Bicicleta.add(aBici, function (err, newBici) {
            if (err) console.log(err);
            Bicicleta.allBicis(function async (err, bicis) {
              expect(bicis.length).toEqual(1);
              expect(bicis[0].code).toEqual(aBici.code);
              // Remove bici and test!
              var a = Bicicleta.removeByCode(bicis[0].code, function async (error, targetBici) {
                if (error) console.log('error: ', err);
                    var a =  Bicicleta.findById(bicis[0]);
                    Bicicleta.allBicis(function (err, bicis) {
                        expect(bicis.length).toBe(0);
                        done();
                    });
            });
          });
        });
      });
    }); 
  
  });
