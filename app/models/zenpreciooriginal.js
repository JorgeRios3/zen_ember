import DS from 'ember-data';

export default DS.Model.extend({
  cuenta: DS.attr('number'),
  inmueble: DS.attr('number'),
  idprecio: DS.attr('number'),
  precio: DS.attr('number'),
  preciodocumentos: DS.attr('number'),
  precioactual: DS.attr('number')
});
