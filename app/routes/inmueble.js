import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel(transition){
    	this._super(...arguments);
    	var controller = this.controllerFor(this.routeName);
    	controller.setProperties({
    		disponible:false,
			selectedEtapa:"",
			listaInmuebles:"",
			desplegarResultado:false,
    	});
	},
	model(){  
		this.store.unloadAll("inmuebledetalle");
    	return  this.store.findAll('etapastramite', {reload : true});
	}
	
});
