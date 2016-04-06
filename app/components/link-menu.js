import Ember from 'ember';

const {
  computed,
  get,
  Logger: { info }
} = Ember;
export default Ember.Component.extend({
  opcion: null,
  consulta: false,
  isOferta: computed.equal('opcion', 'oferta'),
  isCliente: computed.equal('opcion', 'cliente'),
  bsClass: computed('opcion', {
    get() {
      let clase = get(this, 'opcion').includes('arcadia') ? 'info' : 'primary';
      return `btn btn-${clase}`;
    }
  })
});
