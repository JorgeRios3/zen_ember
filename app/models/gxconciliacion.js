import DS from 'ember-data';

export default DS.Model.extend({
  solicitudes: DS.attr('string'),
  idreferenciamovto: DS.attr('number')
});
