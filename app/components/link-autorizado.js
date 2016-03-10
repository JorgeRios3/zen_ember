import Ember from 'ember';
const info = Ember.Logger.info;
const {
	get,
	set
} = Ember;

export default Ember.Component.extend({
	valido: false,
	tramites: null,
	tramite: null,
	didInsertElement(){
		var that= this;
		var trams = get(this,"tramites");
		var mySet= new Set();
		var tramite = parseInt(get(this,"tramite"));
		trams.forEach((item) =>{
			
			if(tramite=== get(item,"tramite")){
				set(that,"valido", true);
				
			}
			
		});

	},

	actions:{
		seleccionar(tramite){
			this.sendAction('hacer', get(this,"idtramite"));
		}

	

}});
