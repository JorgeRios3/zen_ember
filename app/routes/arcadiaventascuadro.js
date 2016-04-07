import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import moment from 'moment';
const {
  setProperties,
  getProperties,
  get,
  Logger: { info },
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(
{
  beforeModel() {
    this._super(...arguments);
  },
  setupController(controller, model) {
    let ventascuadro = Ember.A();
    let llaves = ['mes'];
    let titleCols = ['Mes'];
    let alignments = ['left'];
    let a = moment();

    for (let i = 2000; i<=a.year(); i++){
      llaves.push(`a${i}`);
      titleCols.push(i);
      alignments.push('right');
    }
    model.ventascuadro.forEach((item)=> {
      //ventascuadro.pushObject(objeto);
      ventascuadro.pushObject(getProperties(item, llaves));

    });
    setProperties(controller, {
      titleCols,
      alignments,
      ventascuadro
    });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return hash({
      ventascuadro: store.findAll('ventascuadroarcadia', reload)
    });
  },
  actions: {
    error(error) {
      info('error', error);
    }
  }
});
