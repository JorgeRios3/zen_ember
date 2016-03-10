import Ember from 'ember';

const{
	inject:{service},
	Logger:{info},
	get,
	set
}=Ember;

export default Ember.Route.extend({
	ajax:service(),

	//model : function(){
	//	return this.store.find("printer");
  setupController: function(ctrlr, model) {

    ctrlr.set("model", model.printer);
    ctrlr.set("email", model.email.email);
    //Ember.Logger.info(model.email); 
    
  },
	model: function() {
       var store = this.store;
       return Ember.RSVP.hash({
      
       printer: store.findAll('printer'),
       email: get(this, "ajax").post("/api/useremail?query=1")

       });
      
  },

	
	actions: {
		refrescar : function(callback){
			Ember.Logger.info("refrescando la ruta printers");
			var printers = this.controllerFor('printers.index');
			Ember.Logger.info("El valor de refreshing es ", printers.get("refreshing"), printers.get("dummy"));
			printers.set("refreshing", true);
			var that = this;
			var promise = new Ember.RSVP.Promise(function(resolve, reject){
				that.refresh();
				resolve();
			});
			//this.refresh();
			printers.set("refreshing", false);
			callback(promise);
		},
		releer: function(){
			Ember.Logger.info("voy en releer");
			this.refresh();
		},
		error(error, transition){
      		info("paso por aqui error hahaha", error);
    	},
	}
});
