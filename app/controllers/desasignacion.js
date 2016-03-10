import Ember from 'ember';
//import ajax from "ember-ajax";
import EmberValidations from 'ember-validations';
//import config from '../config/environment';

const info = Ember.Logger.info;
const {
	get,
	set,
	observer,
	//computed,
	//isEmpty
} = Ember;

var ErrorValidacion = Ember.Object.extend({
	variable : "",
	mensaje : "",
	campo : ""
});


export default Ember.Controller.extend(Ember.Evented,EmberValidations,
{
	session:Ember.inject.service(),
	selectedNombre: "",
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

	validations:{
		nombre: {
			length: {minimum: 3}
		},
		oferta:{
			numericality: { greaterThan: 0, messages : { greatherThan : "Debe ser mayor a 0"}} 

		}
	},

	init:function(){
		this._super.apply(this, arguments);
		set(this, "erroresHabidos", Ember.ArrayProxy.create({content: []}));
		//set(this, "cancelacion", Ember.ArrayProxy.create({content: []}));
	},
	
	observaCatNombre: observer ("selectedNombre", function(){        
    	var that = this;
    	var cual = get(this, "catalogoNombres").findBy("cuenta", get(this, "selectedNombre"));
    	"cuenta manzana lote oferta cliente".w().forEach((key)=>{
    		set(that,key, get(cual,key));
    	});
  	}),

	actions: {
		desasignar:function(){
			var that=this;
            var record = this.store.createRecord("desasignacion", {oferta: get(this,"oferta"), cuenta: get(this,"cuenta")});
            set(this,"processingGrabar", true);
			
			record.save().then(function(){
				set(that,"catalogoNombres", null);
				set(that,"processingGrabar", false);
				that.transitionToRoute("index");
				
		
			}, function(error){
				set(that,"errorAlGrabar", "");
				set(that,"processingGrabar", false);
					that.toggleProperty("huboErrorAlGrabar");
					
					var errorGenerado = "";
					try{
						errorGenerado = error.errors.resultado[0];
					} catch ( er ){
						info("error en obtencion de error", er.message);
					}
					set(that,"errorAlGrabar", errorGenerado);
			});
		},

		selectedEtapa(item){
			set(this, "selectedEtapa", item.id);
		},

		selectedNombre(item){
			set(this, "selectedNombre", item.cuenta);
		},

		buscar(){
			var that=this;
	      	const nombre = get(this, "nombre");
	      	const etapa=get(this, "selectedEtapa");
	      	info(`valor de selectedEtapa ${etapa}`);
	      	set(this, "catalogoNombres", null);
	      	var p2=this.store.query("clientescuantosconcuentanosaldada" , {etapa: etapa, nombre: nombre});
	      	p2.then((data)=>{
				if(get(data, "length")){
					data.forEach((item)=>{
						set(that, "cuantos", get(item, "cuantos"));
					});

				}
				if(parseInt(get(this, "cuantos"))<=100){	
					return this.store.query("clientesconcuentanosaldada", {etapa: etapa, nombre: nombre}).
					then((data)=>{
						set(that, "catalogoNombres", data);
						set(this,"oferta","");
					});
	  			}
			});
			/*var p= this.store.query("clientesconcuentanosaldada", {etapa: get(this, "selectedEtapa"), nombre: get(this, "nombre") });
			set(this, "catalogoNombres", p);
			set(this,"oferta","");*/
		},

		revisarErrores(){
			var _this = this;
			get(this,"erroresHabidos.content").clear();
			Object.keys(get(this,"errors")).forEach(function(que){
				if ( typeof que === "string" || que instanceof String ){
					var error = get(_this,"errors."+ que);
					if ( typeof error[0] === "string" || error[0] instanceof String ){
						var errmsg = error[0];
						if ( errmsg === "is not a number") { errmsg = "no es numérico";}
					    get(_this,"erroresHabidos.content").pushObject(ErrorValidacion.create({
							variable: que,
							mensaje : errmsg,
							campo : _this.getWithDefault("label"+que.capitalize(), '')
						}));
						
					}
				}
			});
			this.toggleProperty("muestroErrores");
			
		},
	},

});
