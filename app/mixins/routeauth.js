import Ember from 'ember';
const {
  set,
  Logger: { info },
  getOwner
} = Ember;

export default Ember.Mixin.create({
  beforeModel(transition) {
    this._super(transition);
    info('esperando a routeauth');
    let ruta = this.routeName;
    let ajax = getOwner(this).lookup('service:ajax');
    ajax.post(`/api/routeauth?route=${ruta}`)
    .then((data)=> {
      if (data.access === '1') {
        info('ruta aceptada');
        set(this, 'features', data.features);
        try {
          if (ruta ==="oferta" || ruta ==="cliente") {
            info('con transition en routeauth');
            this.beforeModel2(transition);
          } else {
            this.beforeModel2();
            info('termino model2');
          }
        }
        catch(e){
          info('no hay beforeModel2');
        }
      } else {
        info('ruta rechazada');
        this.transitionTo('index');
      }
    }, (error)=> {
      info('ruta rechazada por error', error);
    });
  }
});

