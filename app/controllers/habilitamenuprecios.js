import Ember from 'ember';
const {
  get,
  set,
  Logger: { info },
  getProperties,
  isEmpty,
  computed,
  observer,
  setProperties
  } = Ember;

export default Ember.Controller.extend({
  actions: {
    cambiarEstado() {
      let suspendido = get(this, 'model.suspendido');
      info('probando el boton', suspendido);
      let model = get(this, 'model');
      model.toggleProperty('suspendido');
      model.save().then((dato)=> {
        info(get(dato, 'suspendido'));
      }, (error)=> {
      	info('fallo');
      });
    }
  }
});
