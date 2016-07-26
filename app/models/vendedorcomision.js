import DS from 'ember-data';

export default DS.Model.extend({
  nombre: DS.attr('string'),
  esinterno: DS.attr('boolean'),
  gerente: DS.attr('number'),
  vendedor: DS.attr('number'),
  esgerente: DS.attr('boolean')
});