import Ember from 'ember';

const {
  setProperties,
  Logger: { info },
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend({
  setupController(controller, model) {
    let { inmueblesdisponibles } = model;
    setProperties(controller, {
      titleCols: ['Etapa', 'Ocurrencias', 'Valuacion'],
      alignments: ['left', 'right', 'right'],
      inmueblesdisponibles
    });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return hash({
      inmueblesdisponibles: store.findAll('inmueblesdisponiblesarcadia', reload)
    });
  }
});
