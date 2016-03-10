import Ember from 'ember';
import ajax from "ember-ajax";
import moment from 'moment';
import EmberValidations from 'ember-validations';
import config from '../config/environment';

const {
	get,
	set,
	computed,
	observer,
	isEmpty
}= Ember;

const info=Ember.Logger.info;

var etapa = Ember.Object.extend({
	id: "",
	departamento: "",
	nombre: ""
});


var lote = Ember.Object.extend({
	manzana : "",
  	lote : "",
});




export default Ember.Controller.extend(EmberValidations,{
	session:Ember.inject.service(),
	todosSortingDesc: ['loteSort:asc'],
	habilitarInmueble: false,
	currentEtapa:"0",
	currentManzana:"0",
	currentNumeroExterior:"0",
	currentNumeroInterior:"0",
	currentLoteElegido:"0",
	departamento: false,
	inmueblesdisponibles:"",
	cuantosInmueblesDisponibles:"",
	seGrabo:false,
	selectedEtapa: null,
	etapas:"",
	idPrecioCatalogo:"",
	manzanasTramite: "",
 	mostrarForma:false,
	bprecioCatalogo: true,
	precioCatalogo: "",
	currentValue:"",
	candadoPrecio: true,
	selectedManzana: null,
	selectedInmueble: 0,
	numerointerior : "",
	numeroexterior : "",
	numerosExteriores: null,
	numerosInteriores: null,
	inmuebleBien: "",
	domicilio: "",
	inmueble: "",
	loteOficial: "",
	precioNumero:null,
	listaderecho: [1,2,30],
	tramites: null,
	record: null,
	huboErrorAlGrabar: false,
	error:"",
	siExiste: false,
	selectedTramite: null,
	valorManzanaFiltrado: "",
	valorTramiteFiltrado: "",
	isManzanaFiltrado: false,
	otro: "",
	inmuebleSorteado: null,
	selectedPrecios: null,	
	hayCaracteristicas:false,
	ap2 : Ember.inject.controller("application"),
	puedeCambiarPrecio: computed.alias("ap2.perfilParaCambiarPrecio"), 
	init(){
		this._super(...arguments);
		this.setProperties({
			etapas: Ember.ArrayProxy.create({content: []}),
			lotesArray: Ember.ArrayProxy.create({content: []}),
			precios: Ember.ArrayProxy.create({content: []})
		});
		
	},
	validanumero: observer("precioCatalogo", function(){
		var that = this;
		["precioCatalogo"].forEach(function(item){
			if(isEmpty(get(that,item))){
				set(that,"b"+item, true);
			} else{
             	set(that,"b"+item, Ember.$.isNumeric(get(that,item))) ;
            }
		});
	}),
	precioCantidad : computed("precioNumero",{
		get(){
				var sabono = get(this, "precioNumero").replace(",","");
				return parseFloat(sabono);
		}
	}),


	/*observaManzana: observer("selectedManzana", function(){
			set(this, "selectedInmueble",null);
			set(this, "mostrarForma", false);
			Ember.$('#x-numero-exterior option[value=0]').prop('selected',true);
			Ember.$('#x-numero-interior option[value=0]').prop('selected',true);
	}),*/

	ponerInmueble(loteoficial){
		info("loteoficial", loteoficial);
		var cual = get(this, "lotesArray").findBy("lote", loteoficial );
		if(isEmpty(cual)){
			return;
		}
		const inmueble = cual.get("inmueble");
		set(this, "loteOficial", loteoficial);
		set(this, "selectedInmueble", inmueble);
	},


	observaSelectedInmueble: observer("selectedInmueble", function(){ 
		var inmueble = get(this, "selectedInmueble");
		this.store.unloadAll("inmuebleindividual");
		this.store.unloadAll("caracteristicasinmueble");
		this.store.unloadAll("catalogoprecio");
		var precioOtro="";
		if ( isEmpty(inmueble)){
			return;
		}
		var that = this;
		var p = this.store.find("inmuebleindividual", inmueble);
		p.then((dato)=>{

			set(that, "domicilio", dato.get("domicilio"));
			set(that, "inmueble", inmueble);
			precioOtro= get(dato, "precioRaw");

			return this.store.find("catalogoprecio", inmueble).
			then((dato)=>{
				that.setProperties({
					mostrarForma:true,
					record: dato,
					inmueble: get(dato, "id"),
					vendido: get(dato, "vendido"),
					precioCatalogo: get(dato, "precioCatalogo"),
					candadoPrecio: get(dato, "candadoPrecio"),
					habilitarInmueble: get(dato, "habilitarInmueble")
				});
			
				var idPrecioCatalogo=get(dato, "idPrecioCatalogo");
				if(idPrecioCatalogo !==0){
					var precios=get(that, "precios.content");
					var elegido= precios.findBy("id", 	`${idPrecioCatalogo}` );
					set(that, "currentValue", elegido);
					set(that, "idPrecioCatalogo", get(dato,"idPrecioCatalogo"));
				}else{
					info("se fue por el else");
					set(that, "idPrecioCatalogo", 0);
				}
				set(that, "caracteristicasLista", null);
				return that.store.query("caracteristicasinmueble",
				{
					inmueble: get(that, "inmueble"),
					precio: 0,
					precioCatalogo: parseInt(get(that, "precioCatalogo")),
					etapa: get(that, "selectedEtapa")
				}).then((dato)=>{
						if(get(dato,"length")>0){
							set(that, "hayCaracteristicas", true);
							set(that, "carateristicasLista", dato);
							info(get(that, "hayCaracteristicas"));
						}else{
							set(that, "hayCaracteristicas", false);
						}
				});
						
			});
		});
	}),

	validations: {
		inmueble: {
			numericality: { greaterThan: 0, messages : { greatherThan : "Debe ser mayor a 0"}} 

		},
		precioCatalogo: {
			numericality: { greaterThan: 0, messages : { greatherThan : "Debe ser mayor a 0"}}
		}
	},

	actions: {
		enteradoHuboErrorAlGrabar: function(){
			set(this, "huboErrorAlGrabar", false);
		},
		cancelar:function(){
			set(this, "muestraZonaCaptura", false);
		},
		grabar(){
			var that=this;
			var record= get(this, "record");
			info("valor de record id", get(record, "id"));
			record.setProperties({
				idPrecioCatalogo: get(this, "precioCatalogo"),
				candadoPrecio: get(this, "candadoPrecio"),
				precioCatalogo: get(this, "precioCantidad"),
				habilitarInmueble: get(this, "habilitarInmueble")

			});
			record.save().then((dato)=>{
				that.setProperties({
					selectedInmueble: null,
					mostrarForma: false,
					inmueble: null,
					seGrabo: true
				});
				set(that, "currentEtapa", "0");
				//Ember.$('#x-etapa option[value=0]').prop('selected',true);
				Ember.$('#x-manzana option[value=0]').prop('selected',true);
				Ember.$('#x-numero-interior option[value=0]').prop('selected',true);
				Ember.$('#x-numero-exterior option[value=0]').prop('selected',true);


			},(error)=>{
				that.setProperties({
					precioCatalogo: "",
					mostrarForma: false,
					huboErrorAlGrabar: true,
					error: error.errors.resultado[0]
				});
				
			});
			
			Ember.$('#x-lote-Precios option[value=0]').prop('selected',true);
		},

		seleccionaEtapa(item){
			if(typeof(item)==="string"){
				return;
			}
			set(this, "currentManzana", "0");
			set(this, "inmueble", "");
			set(this, "caracteristicasLista", null);
			set(this, "hayCaracteristicas", false);
			set(this, "muestraZonaCaptura", false);
			set(this, "mostrarForma", false);
			set(this, "selectedEtapa", item.id); 
			var _this = this;
	
			set(_this, "cuantosInmueblesDisponibles",0);
			set(this, "manzanasTramite", this.store.query("manzanastramite", { etapa : item.id}));
			this.store.find("etapastramite", item.id).
			then((data)=>{
				set(_this, "departamento", get(data,"departamento"));
			});
			this.store.query("inmueblestramite", 
				{ 
					etapa : get(this, "selectedEtapa")
				}).
			then( (data)=> {
				set(_this, "cuantosInmueblesDisponibles", get(data,"length"));
				set(_this, "inmueblesdisponibles", data);
			});
			get(this,"precios.content").clear();
			var c = this.store.findAll("preciosinmueble");
			var that = this;
			var etapa = get(this,"selectedEtapa");
			c.then((data)=>{
				data.forEach(function(item){
					var e = get(item, "etapa");
					if( e === parseInt(etapa) ){
						get(that,"precios.content").pushObject(item);
					}
				});
			});
			
			//set(this, "selectedManzana", null);
		},
		

		manzanaElegida(item){
			if(typeof(item)==="string"){
				return;
			}
			var manzana=get(item, "manzana");
			set(this, "currentLoteElegido", "0");
			set(this, "currentNumeroInterior", "0");
			set(this, "inmueble", "");
			set(this, "caracteristicasLista", null);
			set(this, "hayCaracteristicas", false);
			set(this, "muestraZonaCaptura", false);
			set(this, "mostrarForma", false);
			//Ember.$('#x-numero-exterior option[value=0]').prop('selected',true);
			//Ember.$('#x-numero-interior option[value=0]').prop('selected',true);
			var that = this;
			var numerosExteriores = get(this, "numerosExteriores");
			var c=get(this, "inmueblesdisponibles");
			var l = get(this, "lotesArray");
			var mySet = new Set([]);
			l.clear();
			set(this, "numerosExteriores", mySet );
			info("paso el crear set y limpiar lotes array");
			c.forEach(function(item){
				if(manzana === item.get("manzana")){
					lote = get(item,"lote");
					l.pushObject(Ember.Object.create({ manzana: get(item,"manzana"), lote: lote, loteSort:parseInt(lote), inmueble: get(item,"id") }));
					get(that, "numerosExteriores").add(lote.substring(0,2));
				}			
			});
  			set(this,"sortedTodosDesc", Ember.computed.sort("lotesArray", "todosSortingDesc"));
		},


		loteElegido(item){
			if(typeof(item)==="string"){
				info("entro aqui en lote elegido", item);
				return;
			}
			var cual=get(item, "lote");
			//var that = this; 
			this.ponerInmueble(cual);
		},
		
		numeroExteriorElegido(edificio){
			//Ember.$('#x-numero-interior option[value=0]').prop('selected',true);
			set(this, "currentNumeroInterior", "0");
			set(this, "currentLoteElegido", "0");
			set(this, "numeroexterior", edificio);
			set(this, "inmueble", "");
			set(this, "caracteristicasLista", null);
			set(this, "hayCaracteristicas", false);
			set(this, "muestraZonaCaptura", false);
			set(this, "mostrarForma", false);
			var that=this;
			var c=get(this, "inmueblesdisponibles");
			var mySet2 = new Set([]);
			set(this, "numerosInteriores", mySet2 );
			return c.filter(function(item) {
				var lote = get(item,"lote");
				if ( edificio === lote.substring(0,2) ){
					get(that, "numerosInteriores").add(lote.substring(2,5));
					return true;
				} else {
					return false;
				}
			});
		},

		numeroInteriorElegido(depa){
			if(parseInt(depa)===0){
				return ;
			}
			info("valor de depa", depa, typeof(depa));
			const ne = get(this, "numeroexterior");
			const loteoficial = `${ne}${depa}`;
			this.ponerInmueble(loteoficial);
		},

		precioElegido(precio){
			set(this, "precioCatalogo",get(precio, "id"));
			set(this, "precioNumero", get(precio, "precio"));
		},
		/*buscar(){
			set( this, "etapas", 
				this.store.findAll("etapastramite", {reload: true})
			);
			
		},*/
	}
});
