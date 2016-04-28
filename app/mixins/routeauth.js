import Ember from 'ember';
const {
  set,
  Logger: { info },
  getOwner
} = Ember;

export default Ember.Mixin.create({
  beforeModel(transition) {
    this._super(transition);
    let ruta = this.routeName;
    let ajax = getOwner(this).lookup('service:ajax');
    ajax.post(`/api/routeauth?route=${ruta}`)
    .then((data)=> {
      if (data.access === '1') {
        info('ruta aceptada');
        set(this, 'features', data.features);
      } else {
        info('ruta rechazada');
        this.transitionTo('index');
      }
    }, (error)=> {
      info('ruta rechazada por error', error);
    });
  }
});

