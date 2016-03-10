import Ember from 'ember';
const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  getOwner,
  inject: { controller, service },
  Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  session: service(),
  //needs: ['prospectosbusquedas','application'],
  ci : controller('index'),
  comodin: service(),
  resultPage : '',
  resultPages : '',
  resultRowCountFormatted : '',
  requestedPage : 0,
  huboEnBusqueda:true,

	hayPagPrevias : computed("resultPage", {
		get(){
			if ( get(this, "resultPage") === ""){
				return false;
			}
			if ( parseInt(get(this, "resultPage")) === 1){
				return false;
			} else {
				return true;
			}
		}
	}),

	hayPagSiguientes : computed("resultPage", {
		get(){
			if ( get(this, "resultPage") === ""){
				return false;
			}
			if ( parseInt(get(this, "resultPage")) < parseInt(get(this, "resultPages"))){
				return true;
			} else {
				return false;
			}
		}
	}),

	criterioindividual : false,
	tipoFecha : null,
	tipoCuenta : null,
	nullFechaInicial: '',
	fechaInicial : "",
	nullFechaFinal: '',
	fechaFinal : "",
	sincierre : false,
	selectedGerente: null,
	deboFiltrar: false,
	afiliacionOk: false,
	numeroprospecto: "",
	nombreprospecto: "",
	afiliacion: "",
	cuantosBusqueda : 0,
	fini: "",
	ffin: "",
	criterioFiltro: "numero",
	apGerentesventas:null,
	apVendedors:null,
  	apMediospublicitarios:null,
  	apProspectosrecientes:null,

	criterios : [
		{ id: "numero", criterio: "N&uacute;mero de Prospecto".htmlSafe()},
		{ id: "afiliacion", criterio: "Afiliaci&oacute;n al IMSS".htmlSafe()},
		{ id: "nombre", criterio: "Nombre del Prospecto"}
	],
	criterioEsNombre: Ember.computed.equal("criterioFiltro","nombre"),
	criterioEsNumero: Ember.computed.equal("criterioFiltro","numero"),
	criterioEsAfiliacion: Ember.computed.equal("criterioFiltro","afiliacion"),

	muestraNavegacion : computed("resultPage", {
		get(){
			var cuantos = get(this, "resultPages");
			if (Ember.isEmpty( cuantos )){
				return false;
			}		
			return parseInt(cuantos) > 1;
		}
	}),

	copiable : computed("ci.perfil" ,{
		get(){
			var perfil = get(this, "ci.perfil");
			var valido=false;
			"admin subdireccioncomercial comercial".w().forEach((item)=>{
				if(perfil=== item){
					valido=true;
				} 	
			});
			return valido;
		}
	}),

	tiposresultados : [
		{ id : 1, tipo : "Solo cuantos"},
		{ id : 2, tipo : "Contenido"}
	],
	tipoResultado : null,
	
	tipoContenido : computed("tipoResultado","criterioindividual", {
		get(){
			return get(this, "tipoResultado") === 2 || get(this,"criterioindividual");	
		}
	}),

	selectedVendedor: null,
	selectedMedio: null,
	recientes: computed.alias('apProspectosrecientes'),
	//buscados: Ember.computed.alias("controllers.prospectosbusquedas"),
	buscados : null,
	searchStyle : "position: fixed; left : 120px; top : 40px; background : rgb(158,159,182); padding: 4.5px; border-radius: 6px",
	tiposfechas : [ {id: "alta", tipo: "Alta" },
					{id: "cierre", tipo: "Cierre"}
	],
	tiposcuentas : [ {id: "infonavit" , tipo: "Infonavit"},
					{id: "contado", tipo: "Contado" },
					{id: "hipotecaria", tipo: "Hipotecaria"},
					{id: "pensiones", tipo:"Pensiones del Estado"},
					{id: "fovisste", tipo: "Fovisste"}
	],
	tipoFechaEsAlta : computed.equal("tipoFecha", "alta"),

	misvendedores: computed("selectedGerente", {
		get(){
			var gte = parseInt(get(this, "selectedGerente"));
			var c = get(this, 'apVendedors');
			
			var that = this;
			set(this, "cuantosvendedores", 0);
			return c.filter(function(item) {
				var g = get(item, "gerente");
					if ( g === gte ){
						that.incrementProperty("cuantosvendedores");
						return true;
					} else {
						return false;
					}
			});
		}
	}),

	validaAfiliacion: observer( "afiliacion", function(){
		var afi = get(this, "afiliacion");
		var digits = afi.split("");
		var acumula = 0;
		if (afi.length === 11) { 
			for ( var i = 0; i < 10; i++){
				var digito = parseInt(digits[i]);
				var factor = 2;
				if ( (i % 2) === 0){
					factor = 1;
				}
				var prod = factor * digito;
				if ( prod > 10){
					prod = prod - 9;
				}
				acumula = acumula + prod;
				
			}
			var resultado = 10 - ( acumula % 10 );
			if ( resultado === 10){
				resultado = 0;
			}
			if ( parseInt(digits[10])  === resultado ){
				set(this, "afiliacionOk", true);
			} else {
				set(this, "afiliacionOk", false);
			}
		} else {
			set(this, "afiliacionOk", false);
		}
	}),
	
	actions: {
		copiarAfiliacion(afiliacion, prospecto){
			set(this, "prospecto", "");
			get(this, "comodin").setProperties({
				afiliacion : afiliacion,
				prospecto : prospecto
			});
			this.transitionToRoute("oferta", {queryParams:{afiliacion:"", prospecto:"", origenOferta:""}});
		},
		recargarRecientes( tipo ){
			var recientes = get(this, "recientes");
			set(recientes, "model", this.store.query("prospectosreciente", { afiliacionvalida: tipo }));
		},
		filtrar(){
			set(this, "deboFiltrar", true);
			set(this, "requestedPage", 0);
		},
		todos(){
			set(this, "deboFiltrar", false);
		},
		mostrarPagPrevia(){
			var nextPage = parseInt(get(this, "resultPage"));
			nextPage = nextPage - 1;
			set(this, "requestedPage", nextPage);
			this.send(get(this, "criterioindividual") ? "mostrarCriterioIndividual" :"mostrar");
		},
		mostrarPagSiguiente(){
			var nextPage = parseInt(get(this, "resultPage"));
			nextPage = nextPage + 1;
			set(this, "requestedPage", nextPage);
			this.send(get(this, "criterioindividual") ? "mostrarCriterioIndividual" :"mostrar");
		},
		mostrarCriterioIndividual(){
			var requestedPage = get(this, "requestedPage") || "1";
			var criterio = {
				numeroprospecto : get(this, "numeroprospecto") || "0",
				nombreprospecto : get(this, "nombreprospecto") || "",
				afiliacion : get(this, "afiliacion") || "",
				criterio : get(this, "criterioFiltro")  || "numero",
				page : requestedPage
			};
			set(this, "deboFiltrar", false);
			var that = this;
			var que = "prospectosbusqueda";
			this.store.unloadAll(que);
			set(this,"huboEnBusqueda", true);
			set(this, "buscados", null);
			this.store.query(que, criterio).then(
				(data) =>{
						set(that, "huboEnBusqueda", data.length!==0);
						set(that, "cuantosBusqueda", "");
						set(that, "buscados", data);
						set(that, "resultPage", get(data, "meta.page"));
						set(that, "resultPages", get(data, "meta.pages"));
						set(that, "resultRowCountFormatted", get(data, "meta.rowcountformatted"));
				},
				() =>{
					set(that, "cuantosBusqueda", "");
				}
			);
		},
		mostrar(){
			var tipo = get(this, "tipoResultado");
			if (tipo  !== 1 && tipo !==2 ){
				tipo = 1;
			}
			var that = this;
			var vendedor = get(this, "selectedVendedor") || 0;
			var gerente = get(this, "selectedGerente") || 0;
			var mediopublicitario = get(this, "selectedMedio") || 0;
			var fInicial = get(this, "fechaInicial");
			var fechainicial = !isEmpty(fInicial) ? fInicial.format("DD/MM/YYYY") : "";
			var fFinal = get(this, "fechaFinal");
			//info('FECHA FINAL', fFinal.format("DD/MM/YYYY"));
			var fechafinal = !isEmpty(fFinal) ? fFinal.format("DD/MM/YYYY") : "";
			var tipofecha = get(this, "tipoFecha") || "";
			var tipocuenta = get(this, "tipoCuenta") || "";
			var sincierre = get(this, "sincierre");
			var requestedPage = get(this, "requestedPage") || "1";
			var criterio = {
				vendedor : vendedor,
				gerente : gerente,
				mediopublicitario : mediopublicitario,
				fechainicial : fechainicial,
				fechafinal : fechafinal,
				tipofecha : tipofecha,
				tipocuenta : tipocuenta,
				sincierre : sincierre ? "1": "0",
				page : requestedPage
			};
			var que = tipo === 1? "cuantosprospecto": "prospectosbusqueda";
			if ( tipo === 2){
				set(that, "deboFiltrar", false);
			}
			this.store.query(que, criterio).then(
				(data) => {
					if ( tipo ===1){
						var cuantos=0;
						data.forEach((item)=>{
							cuantos = get(item, "cuantosformateado");
						});
						set(that, "cuantosBusqueda", cuantos);

					} else {
						set(that, "cuantosBusqueda", "");
						set(that, "buscados", data);
						set(that, "resultPage", get(data, "meta.page"));
						set(that, "resultPages", get(data, "meta.pages"));
						set(that, "resultRowCountFormatted", get(data, "meta.rowcountformatted"));
					}
				},
				() => {
					set(that, "cuantosBusqueda", "");
				}
			);
		},
		getDateValue( result ){
			set(this, result.tag, result.value);
		}
	}
});

