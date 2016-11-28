import DS from 'ember-data';

export default DS.Model.extend({
  nombre: DS.attr('string'),
  banco: DS.attr('string', { default: '' }),
  plaza: DS.attr('string', { default: '' }),
  sucursal: DS.attr('string', { default: '' }),
  clavecuenta: DS.attr('string', { default: '' }),
  bancocheque: DS.attr('string', { default: '' }),
  plazacheque: DS.attr('string', { default: '' }),
  sucursalcheque: DS.attr('string', { default: '' }),
  clavecuentacheque: DS.attr('string', { default: '' })
});