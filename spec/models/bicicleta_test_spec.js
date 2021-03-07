const { allBicis } = require('../../models/Bicicleta');
var Bicicleta = require('../../models/Bicicleta');

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