import Ember from 'ember';
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const {
	get,
	set,
	computed,
	observer,
	isEmpty
}= Ember;


export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin ,  
{
  etapas:"",

  beforeModel(transition){
    this._super(...arguments);
    
    var controller = this.controllerFor(this.routeName);

    controller.setProperties({
      //selectedNombre: "",
      selectedEtapa: "", 
      catalogoNombres: "",
      nombre: "",
      manzana: "",
      lote: "",
      cuenta: "",
      cliente: "",
      oferta: "",
      errorAlGrabar: "",
      huboErrorAlGrabar: false,
      processingGrabar: false,
      muestroErrores: false,
      cuantos:"",
      maximo:Ember.computed.lt("cuantos", 101),
      erroresHabidos:"",
    });
  },

  setupController(ctrl, model) {
	    set(ctrl, 'etapas', model.etapas);
    },

  model() {
    var store = this.store;
    
    return Ember.RSVP.hash({
    	etapas: store.findAll('etapastramite', {reload: true})
    });
  },

});
