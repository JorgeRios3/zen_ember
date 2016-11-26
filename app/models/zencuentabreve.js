import DS from 'ember-data';

export default DS.Model.extend({
  nombre: DS.attr('string'),
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  inmueble: DS.attr('string'),
  etapa: DS.attr('string'),
  telefonocasa: DS.attr('string'),
  telefonotrabajo: DS.attr('string'),
  imss: DS.attr('string'),
  domicilio: DS.attr('string'),
  colonia: DS.attr('string'),
  ciudad: DS.attr('string'),
  estado: DS.attr('string'),
  cp: DS.attr('string'),
  rfc: DS.attr('string')
});

