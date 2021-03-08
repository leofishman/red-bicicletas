var Bicicleta = require('../../models/bicicleta');
var mongoose = require('mongoose');
let server = require('../../bin/www');


beforeAll( async (done) => {

    await mongoose.connection.close();
    await mongoose.disconnect();

    var mongoDB = 'mongodb://localhost/bicicletasTest';

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error'));

    db.once('open', () => {

        console.log('We are connected to test database!');

    });

    mongoose.set('useFindAndModify', false);

    await mongoose.connect(mongoDB, {

        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true

    });

    done();

});


//El siguiente afterEach elimina todos los documentos de cada modelo.

afterEach( async (done) => {

    try{

        await Usuario.deleteMany({});

        await Bicicleta.deleteMany({});

        await Reserva.deleteMany({});

        done();

    }catch(error){console.error(error)}

});



afterAll( async (done) => {

    try{

        await mongoose.connection.close();

        await mongoose.disconnect();

        done();

    }catch(error){console.error(error)}

});

describe('Bicicleta.createInstance', () => {
    it('Crea instancia de bicicleta', () => {
        var bici = Bicicleta.createInstance(1, "amarillo", "urbana", [-34.1,-54.5]);
console.log(bici)
        expect(bici.code).toBe(1);

    });
});

/*
describe('Testing Bicicletas', () => {

    beforeEach(function(done) {
        var mongoDb = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDb, {useNewUrlParser: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'db connection error'));
        db.once('open', function () {
            console.log('We are connected to the database');
            done();
        });
    });

    afterEach(function (done) {
        Bicicleta.deleteMany({}, function (err, success){
            if (err) console.log(err);
            done();
        });
    });
});

describe('Bicicleta.createInstance', () => {
    it('Crea instancia de bicicleta', () => {
        var bici = Bicicleta.createInstance(1, "amarillo", "urbana", [-34.1,-54.5]);
console.log(bici)
        expect(bici.code).toBe(1);

    });
});

describe('Bicicleta.allBicis', () => {
    it('Comienza vacia', (done) => {
        Bicicleta.allBicis(function(err, bicis) {
            expect(bicis.length).toBe(0);
            done();
        })
    })
})

/*
beforeEach( () => {Bicicleta.allBicis = []});

describe('Bicicleta.allBicis', () => {
    it('comienza vacio', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('Agregamos una', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        
        var a = new Bicicleta(1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);

    });
});

describe('Bicicle.findById', () => {
    it('debe devolver la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        
        var a = new Bicicleta(1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
        var b = new Bicicleta(2, 'blanca', 'montaña', [-34.596932, -58.3808287]);
        
        Bicicleta.add(a);
        Bicicleta.add(b);

        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe('rojo');
        expect(targetBici.modelo).toBe('urbana');
    });
});

describe('Bicicle.removeById', () => {
    it('debe devolver la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        
        var a = new Bicicleta(1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
        var b = new Bicicleta(2, 'blanca', 'montaña', [-34.596932, -58.3808287]);
        
        Bicicleta.add(a);
        Bicicleta.add(b);

        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe('rojo');
        expect(targetBici.modelo).toBe('urbana');

        Bicicleta.removeById(1);
    
        expect( function(){ Bicicleta.findById(1);  } ).toThrow(new Error("No existe una bicicleta con el id 1"));

    });
});

*/