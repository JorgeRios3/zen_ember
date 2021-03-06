import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  get,
  set,
  Logger: { info }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin, {
  setupController(ctrl, model) {
    let features = get(this, 'features');
    // info("features vale",features);
    set(ctrl, 'features', features);
    let a = get(model, 'promesa');
    let lista = [];
    set(ctrl, 'fechaInicialActual', get(a, 'meta.fechainicialactual'));
    set(ctrl, 'fechaFinalActual', get(a, 'meta.fechafinalactual'));
    lista.push(['Medios Publicitarios', 'Semana']);
    let contador = 1;
    a.forEach((item)=> {
      let descripcion = get(item, 'descripcion');
      let actual = get(item, 'actual');
      lista.push([descripcion, actual]);
    });
    set(ctrl, 'datos',  lista);
    set(ctrl, 'options', get(model, 'options'));
  },
  model() {
    return Ember.RSVP.hash({
      promesa: this.store.query('mediopublicitario', {fecha: ''}),
      options: {
        bars: 'horizontal',
        title: '',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Medios Publicitarios',
          minValue: 0
        },
        vAxis: {
          title: 'Medio'
        }
      }
    });
  }
});
