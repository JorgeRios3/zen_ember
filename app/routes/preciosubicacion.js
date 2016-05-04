import Ember from 'ember';
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";
const {
	get,
	set,
	getProperties,
	Logger: { info }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin,{
	
  setupController(ctrl, model) {
  	let lista = Ember.A();
    set(ctrl, 'titleCols', ['Desarrollo', 'Etapa', 'Tipo de Precio', 'Precio', 'Totales']);
    model.forEach((item)=> {
    	let { desarrollo, etapa, tipoprecio, precio, total } = item.getProperties('desarrollo', 'etapa', 'tipoprecio', 'precio', 'total');
    	lista.pushObject({ desarrollo, etapa, tipoprecio, precio, total });
    });
    set(ctrl, 'datos', lista);
  },

  model() {
    let { store } = this;
    return store.findAll('preciosubicacion');
  }
});
