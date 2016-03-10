import Ember from 'ember';
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const{
	set,
	computed,
	get
}=Ember;


export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , {
	etapas:"",

	setupController(ctrl,model){
			set(ctrl, "etapas", model.etapas);
	},

	beforeModel(transition){
		this._super(...arguments);
		var controller = this.controllerFor(this.routeName);
	    controller.setProperties({
		  	selectedEtapa:"",
		  	nombre:"",
		  	cuantos:"",
		  	maximo:Ember.computed.lt("cuantos", 101),
		  	manzana:"",
		  	lote:"",
		  	cuenta:"",
		  	saldo:"",
		  	saldoPagaresFormateado:"",
		  	catalogoNombres: null,
		  	documentosPagares:null,
		  	docsCliente: null,
		  	movimientosdocumento:null
	    });
	},

	model() {
    var store = this.store;
      
    return Ember.RSVP.hash({
    	etapas: store.findAll('etapastramite', {reload: true})
    });
  },
});
