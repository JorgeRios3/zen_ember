import DS from 'ember-data';

export default DS.Model.extend({
    nombre: DS.attr('string'),
    codigo: DS.attr('number'),
    domicilio: DS.attr('string'),
    colonia: DS.attr('string'),
    cp: DS.attr('string'),
    ciudad: DS.attr('string'),
    estado: DS.attr('string'),
    telefono: DS.attr('string'),
    rfc: DS.attr('string'),
    email: DS.attr('string'),
});