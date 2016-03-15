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
	isEmpty,
	Logger:{info},
	getOwner
}= Ember;


var etapa = Ember.Object.extend({
	id: "",
	departamento: "",
	nombre: ""
});

var lote = Ember.Object.extend({
	manzana : "",
  	lote : "",	
});

var inmuebleFiltrado = Ember.Object.extend({
	id: "", 
	manzana: "", 
	tramite: "", 
	etapa: "", 
	lote: "",
	entero: computed("lote", {
				get:function(){
					return parseInt(get(this,"lote"));
				}
			})
});

var fechaAntes="";

export default Ember.Controller.extend({
	session:Ember.inject.service(),
	tramiteNuevoInmueble: "",
	todosSortingDesc: ['loteSort:asc'],
	agregarTramite:false,
	siHayInmuebleFiltrado:true,
	sortedTodosDesc:"",
	catalogoTramites: null,
	error:"",
	tramiteValor: false,
	muestraZonaCaptura: false,
	departamento: false,
	anticipocomision: "",
	apartado: "",
	gastosadministrativos: "",
	precioseguro: "",
	inmueblesdisponibles:"",
	cuantosInmueblesDisponibles:"",
	tramiteConsiderado: 0,
	selectedEtapa: null,
	etapas:"",
	manzanasTramite: "",
	bnumeroCredito: true, 
	bmontoCredito: true,
	bmontoSubsidio: true,
	numeroCredito: "",
	montoCredito: "",
	montoSubsidio: "",
	comentario: "",
	selectedManzana: null,
	selectedInmueble: 0,
	numerointerior : "",
	numeroexterior : "",
	numerosExteriores: null,
	numerosInteriores: null,
	inmuebleBien: "",
	domicilio: "",
	inmueble: "",
	listaderecho: [1,2,30],
	isGestion: false,
	fechaInicial: "",
	nullfechaInicial:"",
	fechaEstEntrega: "",
	nullfechaEstEntrega:"",
	fechaRealEntrega: "",
	nullfechaRealEntrega:"",
	fechaVencimiento: "",
	nullfechaVencimiento:"",
	fechaInicio: "",
	nullFechaInicio:"",
	limpiarFecha: false,
	esGrabable: false,
	fechaValor: false,
	tramitesLista: "",
	tramites: null,

	huboErrorAlGrabar: false,
	fechaInicialAnterior: "",
	siExiste: false,
	selectedTramite: null,
	valorManzanaFiltrado: "",
	valorTramiteFiltrado: "",
	isManzanaFiltrado: false,
	otro: "",
	inmuebleSorteado: null,
	record: null,
	mostrarTabla:true,
	descripcionTramite:"",

	init:function(){
		this._super(...arguments);
		this.set("etapas", Ember.ArrayProxy.create({content: []}));
		this.set("lotesArray", Ember.ArrayProxy.create({content: []}));
		this.set("inmueblesFiltrados", Ember.ArrayProxy.create({content: []}));
	},

	limpiaValores(){
		var that=this;
		"fechaEstEntrega fechaRealEntrega fechaVencimiento fechaInicio record".w().forEach((item)=>{
			set(that, item, "");
		});
		this.transitionToRoute("index");
	},

	catalogoTramitePorAgregarFiltrado: computed("catalogoTramitePorAgregar", "tramiteNuevoInmueble",{
		get: function(){
			var cat=get(this,"catalogoTramitePorAgregar");
			var tra=get(this,"tramites");
			return cat.filter(function(item){
				var cual = tra.findBy("id", get(item,"id"));
				var indice = tra.indexOf(cual);
				return indice !== -1;
			});
		}
	}),

	validanumero: observer("numeroCredito", "montoCredito", "montoSubsidio", function(){
		var that = this;
		["numeroCredito","montoCredito","montoSubsidio"].forEach(function(item){
			if(isEmpty(get(that,item))){
				set(that,"b"+item, true);
			} else{
             	set(that,"b"+item, Ember.$.isNumeric(get(that,item))) ;
            }
		});
	}),

	observaTramite: observer("selectedTramite", function(){
			
			set(this, "tramitesLista", "");
			const a = !isEmpty(get(this, "selectedTramite"));
			info("valor de a", a);
			set(this, "isManzanaFiltrado", a);
			Ember.$('#x-manzana-filtrado option[value=0]').prop('selected',true);
			Ember.$('#x-lote-filtrado option[value=0]').prop('selected',true);
	}),

	observaManzana: observer("selectedManzana", function(){
			
			set(this, "selectedInmueble",null);
	}),

	ponerInmueble(loteoficial){
		info("lote oficial este es lote filtrado", loteoficial);

		var cual = get(this, "lotesArray").findBy("lote", loteoficial );
		const inmueble = cual.get("inmueble");
		info("probando");
		info("valor de inmueble", inmueble);
		this.send("llenarTramites", inmueble);
		info("paso");
		set(this, "inmueble", inmueble);

		set(this, "selectedInmueble", inmueble);
	},

	observaSelectedInmueble: observer("selectedInmueble", function(){ 
		var inmueble = get(this, "selectedInmueble");
		info("valor de inmueble en observar selectedInmuebke", inmueble);
		var that = this;
		var p = this.store.find("inmuebleindividual", inmueble);
		p.then(function(dato){
			info("entro en la promesa si encontra algo");
		set(that, "domicilio", dato.get("domicilio"));
			});
		set(this, "mostrarTabla", true);
		this.store.unloadAll("tramite");
		set(this, "tramitesLista", this.store.query("tramite",{inmueble: inmueble}));
		}),

	observaFecha: observer("fechaInicial", function(){
		var that = this;
		var valor = get(this, "fechaInicial");
		var a= !Ember.isEmpty(valor);
		set(this, "esGrabable", a);
	}),

	observaFechaInicio: observer("fechaInicio", function(){
		var valor = get(this, "fechaInicio");
    	if (valor !== "") {
    		set(this, "esGrabable", true);
    	} else {
    		set(this, "esGrabable", false);
    	} 
	}),
	
	observaLimpiar: observer("limpiarFecha", function(){
		if(this.get("limpiarFecha")){
			this.toggleProperty("limpiarFecha");
			this.set("fechaInicial", "");
		}
		this.set("fechaInicial", fechaAntes);
	}),

	actions: {
		abreCatalogoTramite(){
			var that = this;
			set(this, "catalogoTramitePorAgregar", this.store.query("catalogotramiteporagregar",{inmueble: get(this, "tramiteNuevoInmueble")}));
			get(this, "catalogoTramitePorAgregar").then(
				function(data){
					that.toggleProperty("agregarTramite");
				},
				function(error){}
			);
		},

		agregaTramiteSelect(tram){
			var that=this;
            var tramite=tram.id;
            var inmueble = get(this, "tramiteNuevoInmueble");
            var date = new Date();
            var fecha= moment(date).format("YYYY/MM/DD");
            var model = this.store.createRecord("tramite", {
            		inmueble: inmueble,
					tramite : tramite,
					numeroCredito: "",
					montoCredito: "",
					montoSubsidio: "",
					comentario: "",
					fechaInicial: fecha,
					fechaInicio: "",
				    fechaEstEntrega: "",
				    fechaRealEntrega: "",
				    fechaVencimiento: "",
				    descripcion: "",
				    origen: "",
				    isGestion: ""
				});
            model.save().then(function(){
            	that.send("llenarTramites", inmueble);
            	that.toggleProperty("agregarTramite");
            },function(error){
            	
            });
		},

		enteradoHuboErrorAlGrabar: function(){
			set(this, "huboErrorAlGrabar", false);
		},

		cancelar:function(){
			set(this,"muestraZonaCaptura", false);
			set(this, "mostrarTabla", true);
		},

		grabar : function(){
			var record= get(this, "record");
			var valorFecha="";
			var that = this;
			//var origen=get(this, "isGestion");

			"fechaInicial fechaEstEntrega fechaRealEntrega fechaVencimiento fechaInicio".w().forEach(function(item){
				var valor = get(that, item);
				set(that, item, valor);
				if(valor){
					valorFecha=moment(valor).format("YYYY/MM/DD");
				}else{
					valorFecha="";
				}
				set(record, item, valorFecha);
			});

			"numeroCredito montoCredito montoSubsidio comentario".w().forEach(function(item){
					record.set(item, get(that, item));
			});
			
			record.save().then(()=>{
				set(that,"muestraZonaCaptura", false);
				set(that, "mostrarTabla", true);
			},(error)=>{
				set(that, "huboErrorAlGrabar", true);
				set(that, "mostrarTabla", true);
				set(that, "tramitesLista", "");
				set(that, "error", error.errors.resultado[0]);
				set(that,"muestraZonaCaptura", false);
			});

		},

		eliminar(){
			var that=this;
			var record= get(this, "record");
			var id= get(record, "id");
			info("eliminar tramite", id);
			this.store.find('tramite', id).then(function (tramite) {
				tramite.deleteRecord();
			  	tramite.get('isDeleted'); // => true
			  	tramite.save(); // => DELETE to /posts/1
			  	set(that, "muestraZonaCaptura", false);
			  	set(that, "mostrarTabla", true);
			},(error)=>{
				set(that, "huboErrorAlGrabar", true);
				set(that, "mostrarTabla", true);
			});

		},

		selectedEtapaAction(item){
			set(this, "tramitesLista", "");
			set(this, "inmueble", "");
			set(this, "selectedEtapa", item.id);
			
			var _this = this;
			set(_this, "cuantosInmueblesDisponibles",0);
			set(this, "manzanasTramite", this.store.query("manzanastramite", { etapa : item.id}));
			var etapaPromesa =  this.store.find("etapastramite", item.id);
			etapaPromesa.then(function(data){
				set(_this, "departamento", data.get("departamento"));
			});
			var idisp = this.store.query("inmueblestramite", { etapa : get(this, "selectedEtapa")});
			idisp.then(function(data){
				set(_this, "cuantosInmueblesDisponibles", data.get("length"));
				
			});
			var params = this.store.find("parametrosetapa", get(this, "selectedEtapa"));
			params.then(function(data){
			
				"anticipocomision apartado gastosadministrativos precioseguro".w().forEach(function(key){
					set(_this, key, data.get(key));
				});
			});
			set(this, "inmueblesdisponibles", idisp);
			set(this, "selectedManzana", null);
			Ember.$('#x-manzana-filtrado option[value=0]').prop('selected',true);
			set(this, "selectedTramite", null);
			set(this, "muestraZonaCaptura", false);
			
		},

		seleccionar(tramite){ 
			var that = this;
			set(this, "tramiteConsiderado", tramite);
			set(this, "muestraZonaCaptura", true);
			set(this, "siExiste", true);
			var p = this.store.findRecord("tramite", tramite);
			p.then((data)=>{
				set(that, "mostrarTabla", false);
				set(that, "descripcionTramite", get(data, "descripcion"));
				set(that, "record", data);
            	set(that, "isGestion", get(data,"isGestion"));
            	set(that, "esGrabable", get(data,"isGestion"));
				set(that, "fechaInicial", get(data,"fechaInicial"));
				//fechaAntes= data.get("fechaInicial");
				fechaAntes=get(data, "fechaInicial");
				set(that, "fechaInicio", get(data,"fechaInicio"));
				set(that, "fechaEstEntrega", get(data,"fechaEstEntrega"));
				set(that, "fechaRealEntrega", get(data,"fechaRealEntrega"));
				set(that, "fechaVencimiento", get(data,"fechaVencimiento"));
				set(that, "numeroCredito", get(data,"numeroCredito"));
				set(that, "montoCredito", get(data,"montoCredito"));
				set(that, "montoSubsidio", get(data,"montoSubsidio"));
			});
		},

		selectedManzana(manzana){
			info("entro");
			Ember.$('#X-inmueble option[value=0]').prop('selected',true);
  			Ember.$('#x-exterior option[value=0]').prop('selected',true);
  			Ember.$('#x-interior option[value=0]').prop('selected',true);
			var that = this;
			set(this, "tramitesLista", "");
			set(this, "inmueble", "");
			set(this, "muestraZonaCaptura", false);
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

		selectedManzanaFiltrado:function(manzana){
			var that= this;
			this.store.unloadAll("inmueblesfiltrado");
			set(this, "tramitesLita", "");
			set(this, "inmueble", "");	
			set(this, "muestraZonaCaptura", false);
			var numerosExteriores = get(this, "numerosExteriores");
			try{
				var l = get(this, "lotesArray");
				l.clear(); 
				info("entro valor de manzana filtrado", manzana);
				var tramite= get(this, "selectedTramite");
				var etapa= get(this, "selectedEtapa");
				var origen= "";
				var catalogo= get (this, "catalogoTramites");
				catalogo.forEach(function(item){
					if(item.get("id") === tramite){
						origen=get(item,"origen");
					}
				});
				//var l= get(this, "inmueblesFiltrados");
				this.store.unloadAll("inmueblesfiltrado");
				var p=this.store.query("inmueblesfiltrado", {etapa:etapa, origen:origen, tramite:tramite, manzana:manzana});
				p.then(function(data){
					if(get(data, "length")){
						set(that, "siHayInmuebleFiltrado", true);
					}else{
						set(that, "siHayInmuebleFiltrado", false);
					}
					data.forEach((item)=>{
						l.pushObject(inmuebleFiltrado.create({
							    manzana: get(item,"manzana"), 
						        tramite: get(item,"tramite"), 
						        etapa: get(item,"etapa"), 
						       lote: get(item,"lote"),
						       inmueble:get(item, "id"),
						      loteSort:parseInt(get(item, "lote"))
						}));
					});
					info("aqui llego manzana filtrado");

					//set(that, "sortedTodosDesc", l.sortBy("entero"));
					//set(that,"inmueblesFiltrados", Ember.computed.sort("lotesArray", "entero"));
					//set(that,"sortedTodosDesc", computed.sort("lotesArray", "todosSortingDesc"));
					set(that,"sortedTodosDesc", Ember.computed.sort("lotesArray", "todosSortingDesc"));
					Ember.$('#x-lote-filtrado option[value=0]').prop('selected',true);

				});
			}catch(e){
				//info("error en el try");
			}

		},

		loteElegido(cual){
			info("valor de lote", cual);
			this.ponerInmueble(cual);
		},

		numeroExteriorElegido(edificio){
			set(this, "numeroexterior", edificio);
			set(this, "inmueble", "");
			set(this, "tramitesLista", "");
			var that = this;
			var v = get(this, 'inmueblesdisponibles');
			var c = v.get("content");
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
			Ember.$('#X-inmueble option[value=0]').prop('selected',true);
  			Ember.$('#x-interior option[value=0]').prop('selected',true);
  			set(this, "otro", "");
  			set(this, "inmueble", "");
		},
		
		numeroInteriorElegido(depa){
			var that=this;
			const ne = get(this, "numeroexterior");
			const loteoficial = `${ne}${depa}`;
			var l= get(this, "inmueblesdisponibles");
			var cual=l.findBy("lote", loteoficial);
			var p = this.store.find("inmuebleindividual", cual.id);
			p.then(function(dato){
				set(that, "domicilio", get(dato,"domicilio"));
			});
			set(this, "inmueble", loteoficial);

			this.send("llenarTramites", cual.id);
		},

		llenarTramites(lote){
			set(this, "tramitesLista", null);
			set(this, "tramitesLista", this.store.query("tramite",{inmueble: lote}));
			set(this, "tramiteNuevoInmueble", lote);
			set(this, "catalogoTramitePorAgregar", this.store.query("catalogotramiteporagregar",{inmueble: lote}));
		},


		buscar(){
			var that=this;
			this.store.findAll("etapastramite").then(function(etapa){
				set(that,"etapas", etapa);
			});
		},

		
	}
});
