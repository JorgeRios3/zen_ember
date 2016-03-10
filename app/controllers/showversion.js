import Ember from 'ember';
import config from '../config/environment';
const {
	computed,
	get
	
} = Ember;
//import Bootstrap from 'bootstrap';

export default Ember.Controller.extend( {
	session:Ember.inject.service(),
	//needs: ["application", "usuarios"],
	/*ap: Ember.inject.controller("application"),
	usuarios: Ember.inject.controller("usuarios"),
	admin: Ember.computed.equal("ap.perfil", "admin"),
	perPage: Ember.computed.alias("usuarios.perPage"),
	verUsuarios: false,
	modalFunction: "",
	mydate: null,
	evento: "",
	firma: ["Grupo","Iclar","2016"],
	isDev: computed({
		get: function(){
			return config.AUTOMATIC_LOGIN;
		}
	}),
	actions: {
		cargaUsuarios: function() {
			this.set("evento", "confirmacion");
			this.trigger(this.get("evento"));
		},
		haciendoLogging: function(){
			this.launchModal("logging", "Pélame", "Le sigo wey?", "Afirmativo", "Negativo");
			
		},
		escondeUsuarios: function(){
			this.toggleProperty("verUsuarios");
		},
		modalConfirmed: function(){
			this.trigger(this.get("evento"));
		},

		modalCanceled: function(){
			Ember.Logger.info("modal canceled");
		},

	},
	hazConfirmacion: function(){
		Ember.Logger.info("modal confirmed");
		if(!get(this,"isDev")){
			return;
		}
			var that = this;
			this.store.findAll("usuario").then(
				function(data){
					that.toggleProperty("verUsuarios");
					Ember.Logger.info("Cargue la promesa usuarios ", data.get("length"));
					that.get("usuarios").set("model", data );
				}
			);
			//this.get("usuarios").set("model", p );
	}.on("confirmacion"),
	hazLogging: function(){
		Ember.Logger.info("perdiendo el tiempo");
	}.on("logging"),
	launchModal: function( event, title, message, confirmButtonTitle, cancelButtonTitle){
		this.set("evento", event);
		//Bootstrap.ModalManager.confirm(this, title, message, confirmButtonTitle, cancelButtonTitle);
	}*/
});
