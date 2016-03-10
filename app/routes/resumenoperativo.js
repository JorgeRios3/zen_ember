import Ember from 'ember';
//import ajax from "ember-ajax";
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";
const info = Ember.Logger.info;
const {
	get,
	set
} = Ember;

const etapas = [53,54,55,57]; // actualice aqui cuando hay nuevos fraccionamientos, poniendo el nuevo a la derecha y suprimiendo el de mas izquierda
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , 
{
	ajax:Ember.inject.service(),
	beforeModel(){
		this._super(...arguments);
		info("voy en beforemodel de resumenoperativo");
	},
	setupController(controller, model){
		controller.setProperties({
			data: Ember.ArrayProxy.create({ content: []}),
			showComponent:false,
			fecha: get(model,"fecha")
		});
		var indice = 0;
		for ( var etapa of etapas ){
			indice++;			
			set(controller, "nombre" + indice, get(model,"nombres_etapas")[etapa][0]);
		}
		try{
			get(model,"kvalores").forEach(function(kvalor){
				let linea = get(model,"valores")[kvalor];
				var t = 0;
				for ( let etapa of etapas){
					t = t + linea[etapa];
				}
				var objeto = Ember.Object.create({
						titulo: linea[-1],
						tipo: linea[0] === "GCMEX" ? "CONSTRUCTOR" : linea[0],
						total: t
				});
				var indice = 0;
				for ( var etapa of etapas ){
					indice++;
					set(objeto, "etapa" + indice, linea[etapa]);
				}
				get(controller,"data.content").pushObject(
					objeto
				);
			});
		} catch(err){
			info("trono", err.message);
		}
    },
	model(){
		return get(this, "ajax").request("/api/ropiclar");
	},
	actions: {
    	error(error, transition){
    		info("valor de error", error);
      		//this.transitionTo("index");
    	}
	}
});
