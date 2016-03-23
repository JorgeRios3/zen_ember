import Ember from 'ember';

const{
  inject: { service },
  Logger: { info },
  RSVP: { hash, Promise },
  get,
  set
} = Ember;

export default Ember.Route.extend({
  ajax: service(),
  setupController(ctrlr, model) {
    ctrlr.set('model', model.printer);
    ctrlr.set('email', model.email.email);
  },
  model() {
    let { store } = this;
    return hash({
      printer: store.findAll('printer'),
      email: get(this, 'ajax').post('/api/useremail?query=1')
    });
  },
  actions: {
    refrescar(callback) {
      info('refrescando la ruta printers');
      let printers = this.controllerFor('printers.index');
      info('El valor de refreshing es ', printers.get('refreshing'), printers.get('dummy'));
      printers.set('refreshing', true);
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        that.refresh();
        resolve();
      });
      printers.set('refreshing', false);
      callback(promise);
    },
    releer() {
      info('voy en releer');
      this.refresh();
    },
    error(error, transition) {
      info('error ruta printers.index', error);
    }
  }
});
