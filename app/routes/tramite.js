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
                    RouteAuthMixin, {

	setupController(ctrl, model) {
        set(ctrl, 'etapas', model.etapas);
        set(ctrl, "tramites", model.tramites);
        set(ctrl, "catalogoTramites", model.catalogoTramites);
    },

    beforeModel(transition){
    var controller = this.controllerFor(this.routeName);

    controller.setProperties({
        descripcionTramite:"",
        tramitesLista:null,
        nullfechaInicial:"",
        nullfechaEstEntrega:"",
        nullfechaRealEntrega:"",
        nullfechaVencimiento:"",
        nullFechaInicio:"",
        selectedEtapa:"",
        muestraZonaCaptura:false,
        inmueble:"",
    });
  },

    model() {
        var store = this.store;

        store.unloadAll("etapastramite");
        store.unloadAll("tramitesderecho");
        store.unloadAll("catalogotramite");

        return Ember.RSVP.hash({
            catalogoTramites: store.findAll("catalogotramite"),
            etapas: store.findAll('etapastramite'),
            tramites: store.findAll('tramitesderecho'),
        });
    },
	
	/*actions: {
		tramite: observer("tramiteValor", function(){
			var c= get(this, "c");
			c.toggleProperty("tramiteValor");
		})
	}*/
});
