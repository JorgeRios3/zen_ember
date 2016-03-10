import Ember from 'ember';


const {
	get,
	set,
	observer,
	computed,
	isEmpty
} = Ember;

var info=Ember.Logger.info;
export default Ember.Controller.extend({
	session:Ember.inject.service(),
	disponible:false,
	selectedEtapa:"",
	listaInmuebles:"",
	desplegarResultado:false,

	buscarActivado:computed("selectedEtapa",{
		get(){
			return parseInt(get(this, "selectedEtapa"))>0;
		}
	}),


	actions:{
		selectedEtapaAction(item){
			
			set(this, "selectedEtapa", get(item, "id"));
		},
		buscar(){
			set(this, "desplegarResultado", true);
			var that=this;
			var hash={etapa:get(this, "selectedEtapa")};
			if(get(this, "disponible")){
				hash.disponible=1;
			}
			set(this, "listaInmuebles",this.store.query("inmuebledetalle", hash));


		}
	}
});
