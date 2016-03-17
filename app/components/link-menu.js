import Ember from 'ember';

const {
  computed,
  Logger: { info }
} = Ember;
export default Ember.Component.extend({
  opcion: null,
  consulta: false,
  isOferta: computed.equal('opcion', 'oferta'),
  isCliente: computed.equal('opcion', 'cliente')
});
