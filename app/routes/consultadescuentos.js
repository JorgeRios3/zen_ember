import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  get,
  set,
  RSVP: { hash },
  Logger: { info },
  computed
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin, {
  beforeModel() {
    let controller = this.controllerFor('consultadescuentos');
    controller.setProperties({
      selectedEtapa: '',
      comentario: '',
      listaCodigos: '',
      todos: false,
      concuenta: false
    });
  },
  setupController(ctrl, model) {
  	let lista = Ember.A();
    let etapas = get(model, 'etapas');
    let etapas2 = get(model, 'etapasautorizacion');
    etapas2.forEach((item)=> {
      let etapa = get(item, 'etapa');
      info('valor de etapa', etapa);
      etapas.forEach((item2)=> {
        let evalua = get(item2, 'id');
        if (parseInt(etapa) === parseInt(evalua)) {
        	info('pushObject')
        	lista.pushObject(item2);
        }
      })
    });
    set(ctrl, 'etapas', lista);
    set(ctrl, 'codigos', get(model, 'codigos'));
  },
  model() {
  	return hash({
  	  etapasautorizacion: this.store.findAll('etapaenautorizacion'),
  	  etapas: this.store.findAll('etapastramite')
  	});
  }
});
