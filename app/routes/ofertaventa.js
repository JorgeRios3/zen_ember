import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";
var log = Ember.Logger.info;

const {
	set,
	get,
	computed,
	observer,
	isEmpty
} =Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin,{
  beforeModel(){
    let controller = this.controllerFor('ofertaventa');
    controller.setProperties({
      catalogo:null
    });
  },
  	setupController(ctrl, model) {
	    set(ctrl, 'etapas', model.etapas);
	    set(ctrl, 'gerentes', model.gerentes);
    },

  	model() {
    	var store = this.store;
    
    	return Ember.RSVP.hash({
    		etapas: store.findAll('etapastramite', {reload: true}),
    		gerentes:store.findAll("gerentesventa")
    	});
  	},

});
