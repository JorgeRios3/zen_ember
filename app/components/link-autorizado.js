import Ember from 'ember';
const {
	get,
	set,
	Logger: { info }
} = Ember;

export default Ember.Component.extend({
  valido: false,
  tramites: null,
  tramite: null,
  didInsertElement() {
    let that = this;
    let trams = get(this, 'tramites');
    let mySet = new Set();
    let tramite = parseInt(get(this, 'tramite'));
    trams.forEach((item) => {
      if (tramite === get(item, 'tramite')) {
        set(that, 'valido', true);
      }
    });
  },
  actions: {
    seleccionar(tramite) {
      this.sendAction('hacer', get(this, 'idtramite'));
    }
  }
});
