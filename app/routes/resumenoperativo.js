import Ember from 'ember';
// import ajax from 'ember-ajax';
import RouteAuthMixin from '../mixins/routeauth';
import FormatterMixin from '../mixins/formatter';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
	get,
	set,
	Logger: { info },
  RSVP: { hash }
} = Ember;

// const etapas = [53,54,55,57];
// actualice aqui cuando hay nuevos fraccionamientos, poniendo el nuevo a la derecha y suprimiendo el de mas izquierda
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin, FormatterMixin,
{
  ajax: Ember.inject.service(),
  beforeModel() {
    this._super(...arguments);
    info('voy en beforemodel de resumenoperativo');
  },
  setupController(controller, model) {
    let etapas = [];
    for (let i = 0; i < 4; i++) {
      let val = model.etapas.objectAt(i);
      etapas.push(parseInt((get(val, 'id'))));
    }
    etapas = etapas.reverse();
    controller.setProperties({
      data: Ember.ArrayProxy.create({ content: [] }),
      showComponent: false,
      fecha: get(model.resumen, 'fecha')
    });
    let indice = 0;
    for (let etapa of etapas) {
      indice++;
      info('valor de nombres etapas', get(model.resumen, 'nombres_etapas')[etapa][0]);
      set(controller, `nombre${indice}`, get(model.resumen, 'nombres_etapas')[etapa][0]);
      info(`nombre + ${indice}`);
    }
    try {
      get(model.resumen, 'kvalores').forEach((kvalor)=> {
        let linea = get(model.resumen, 'valores')[kvalor];
        let t = 0;
        for (let etapa of etapas) {
          t = t + linea[etapa];
        }
        let objeto = Ember.Object.create({
          titulo: linea[-1],
          tipo: linea[0] === 'GCMEX' ? 'CONSTRUCTOR' : linea[0],
          total: this.formatter(t, 2, '.', ',', true)
        });
        let indice = 0;
        for (let etapa of etapas) {
          indice++;
          set(objeto, `etapa${indice}`, this.formatter(linea[etapa], 2, '.', ',', true));
        }
        get(controller, 'data.content').pushObject(
          objeto
        );
      });
    }
    catch(err) {
      info('trono', err.message);
    }
  },
  model() {
    return hash({
      etapas: this.store.findAll('etapastramite'),
      resumen: get(this, 'ajax').request('/api/ropiclar')
    });
    // return get(this, 'ajax').request('/api/ropiclar');
  },
  actions: {
    error(error, transition) {
      info('valor de error', error);
      // this.transitionTo('index');
    }
  }
});
