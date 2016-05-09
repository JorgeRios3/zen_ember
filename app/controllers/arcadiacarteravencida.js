import Ember from 'ember';

const {
  get,
  set,
  Logger: { info },
  inject: { service }
} = Ember;
export default Ember.Controller.extend({
  comodin: service(),
  actions: {
  	buscarCuenta(cuenta) {
  	  set(this, 'comodin.cuenta', cuenta);
  	  this.transitionToRoute('estadocuenta');
  	}
  }
});
