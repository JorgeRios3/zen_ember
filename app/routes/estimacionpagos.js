import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Logger: { info },
  set,
  get,
  observer
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  beforeModel2() {
    // this._super(...arguments);
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      datosTabla: null,
      cuantos: '',
      contrato: '',
      resultRowCountFormatted: ''
    });
  }
});
