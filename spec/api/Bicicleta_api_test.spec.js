var Bicicleta = require("../../models/bicicleta");
var request = require('request');
var server = require('../../bin/www');

//beforeEach( () => {Bicicleta.allBicis = []});

describe('Api Bicicleta', () => {
    describe('Get Bicicletas /', () => {
        it('status 200', () => {
  //          expect(Bicicleta.allBicis.length).toBe(0);

            request.get('http://localhost:3000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });          
        })
    });

    describe('Post Bicicletas ', () => {
        it(' /create', (done) => {
   //         expect(Bicicleta.allBicis.length).toBe(0);

            var headers = {'content-type': 'application/json'};
            var aBici = '{"id": 11, "color": "rojo", "modelo": "urbana", "ubicacion": [-34.6012424, -58.3861497]}';

            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
              },  function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(11).color).toBe('rojo');
                done();
            });          
        });

        it('delete bicicleta', (done) => {

            var headers = {'content-type': 'application/json'};
            var bici = new Bicicleta(12, 'blanca', 'montaña', [-34.596932, -58.3808287]);
            Bicicleta.add(bici);

            expect(Bicicleta.findById(12).color).toBe('blanca');
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/delete',
                body: '{"id": 12}'
              },  function(error, response, body){
                expect(response.statusCode).toBe(204);
                expect( function(){ Bicicleta.findById(12);  } ).toThrow(new Error("No existe una bicicleta con el id 12"));
                done();
            });   
            
        });
    });
    
});
