import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';
import ModalDispatchMixin from "../mixins/modaldispatch";
import moment from 'moment';
const info = Ember.Logger.info;

const {
	get,
	set,
	computed,
	observer,
	isEmpty
}= Ember;

var ErrorValidacion = Ember.Object.extend({
	variable : "",
	mensaje : "",
	campo : ""
});


export default Ember.Controller.extend( ModalDispatchMixin, EmberValidations, {
	session:Ember.inject.service(),
	needs: ["gerentesventas", "vendedors", "mediospublicitarios"],
	rfc: "",
	apellidopaterno: "",
	apellidomaterno: "",
	gerenteVendedor: "",
	gtevdor:"",
	nombre: "",
	curp: "",
	prospecto:"",
	curpValido: false,
	telefonocasa: "",
	telefonotrabajo: "",
	telefonotrabajoextension: "",
	telefonocelular: "",
	fechanacimiento: "",
	nullfechadenacimiento:"",
	afiliacionOk: false,
	afiliacion: "",
	rfcValido: false,
	muestroErrores: false,
	tiposcuentas : [ {id: "infonavit" , tipo: "Infonavit"},
					{id: "contado", tipo: "Contado" },
					{id: "hipotecaria", tipo: "Hipotecaria"},
					{id: "pensiones", tipo: "Pensiones Del Estado"},
					{id: "fovisste", tipo: "Fovisste"}
	],
	tipoCuenta : "infonavit",
	cuantosvendedores : 0,
	selectedMedio: null,
	selectedGerente: null,
	selectedVendedor: null,
	tipoCuentaEsInfonavit: computed.equal("tipoCuenta", "infonavit"),
	tipoCuentaEsHipotecaria: computed.equal( "tipoCuenta", "hipotecaria"),
	tipoCuentaEsContado: computed.equal("tipoCuenta", "contado"),
	tipoCuentaEsFovisste: computed.equal("tipoCuenta", "fovisste"),
	tipoCuentaEsPensiones: computed.equal("tipoCuenta", "pensiones"),

	isDev: computed({
		get(){
			return config.AUTOMATIC_LOGIN;
		}
	}),

	observaIsGerenteVendedor:observer("gerenteVendedor", function(){
		set(this,"selectedGerente", "");
		set(this,"selectedVendedor", "");
		if(get(get(this, "gerenteVendedor"), "gerente")!==0 && get(get(this, "gerenteVendedor"), "vendedor")!==0){
			set(this, "selectedGerente",  get(get(this, "gerenteVendedor"), "gerente"));
			set(this, "selectedVendedor", get(get(this, "gerenteVendedor"), "vendedor"));
			
		}
	}),
	
	init: function(){
		this._super.apply(this, arguments);
		set(this,"erroresHabidos", Ember.ArrayProxy.create({ content : []}));
	},

	cuantos: computed("apGerentesventas", {
		get(){
			return get(get(this, "apGerentesventas"), "cuantos");
		}
	}),

	nombrevendedor: computed("gtevdor",{
		get(){
			var nombre, que = get(this, "gtevdor");
			if ( que !== undefined ) {
				nombre = get(que, "nombrevendedor");
			}
			return nombre || "FOOBAR";		}
	}),
		
	
	cuantosgerentes: computed({ 
		get(){
			var gv = get(this,'apGerentesventas');
			var content = get(gv, "content");
			return content.length;
		}
	}),
	misvendedores:computed("selectedGerente",{
		get(){
			var gte = parseInt(get(this, "selectedGerente"));
			//var v = get(this,'apVendedors');
			var c = get(this ,"apVendedors");
			var that = this;
			set(this, "cuantosvendedores", 0);
			return c.filter(function(item) {			
				var g = get(item ,"gerente");
				if ( g === gte ){
					that.incrementProperty("cuantosvendedores");
					return true;
				} else {
					return false;
				}
			
			});
		}
	}),
	
	validaAfiliacion:observer("afiliacion", function(){
		info("aqui es el pedo");
		if ( get(this, "tipoCuentaEsContado") || get(this, "tipoCuentaEsHipotecaria") || get(this, "tipoCuentaEsPensiones") || get(this, "tipoCuentaEsFovisste")){
			set(this, "afiliacionOk", true);
			return;
		}
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
				info("aqui trono");
			} else {
				set(this, "afiliacionOk", false);
			}
		} else {
			set(this, "afiliacionOk", false);
		}
	}),

    observaCurp :observer("curp", function(){
    	var fecha = get(this, "curp");
    	if(isEmpty(get(this, "curp"))){
    		set(this, "curpValido", true);
    	} else{
    		fecha = fecha.substring(4,10);
    		var fecha2= fecha.substring(0,2)+"-"+fecha.substring(2,4)+"-"+fecha.substring(4,6);
    		set(this, "curpValido", moment(fecha2, "YY-MM-DD").isValid());
    	}
	}),

    observaRfc :observer("rfc", function(){
    	var fecha = get(this, "rfc");
    	if(isEmpty(get(this, "rfc"))){
    		set(this, "rfcValido", true);
    	} else{
    		fecha = fecha.substring(4,10);
    		var fecha2= fecha.substring(0,2)+"-"+fecha.substring(2,4)+"-"+fecha.substring(4,6);
    		set(this, "rfcValido", moment(fecha2, "YY-MM-DD").isValid());
    	}
	}),

	observandoTipoCuenta :observer("tipoCuenta", function(){
		if ( get(this, "tipoCuentaEsContado") || get(this, "tipoCuentaEsHipotecaria") || get(this, "tipoCuentaEsFovisste") || get(this, "tipoCuentaEsPensiones")){
			set(this, "afiliacionOk", true);
		} else {
			set(this, "afiliacion", "");
			set(this, "afiliacionOk", false);
		}
	}),
	
	verFechaNac : observer("fechanacimiento", function(){
		var fecha = get(this, "fechanacimiento");
		
	}),

	validations:{
		apellidopaterno: {
			length: {minimum: 3}
		},
		curpValido:{
			inclusion:{in :[true], message:"debe tener fecha valida"},
		},

		rfcValido:{
			inclusion:{in :[true], message:"debe tener fecha valida"},
		},
		rfc:{
			length: {minimum: 0, allowBlank: true },
			format: {allowBlank: true,  with: /^([a-z]{4})([0-9]{6})([A-Za-z0-9]{3})$/i,  message: 'el rfc es incorrecto'  }, 
		},
		nombre: {
			length: {minimum: 3}
		},
		afiliacion: {
			length: {is: 11, allowBlank: true},
			numericality: { onlyInteger: true, allowBlank: true }
		},
		curp:{format: { with: /^([a-z]{4})([0-9]{6})([a-z]{6})([0-9A]{1})([0-9]{1})$/i,  message: 'el curp es incorrecto'  }},

		selectedMedio:{
			exclusion : { in: [null], message: "Debe seleccionar medio publicitario" }
		},
		selectedVendedor:{
			exclusion : { in: [null], message: "Debe seleccionar un vendedor" }
		},
		selectedGerente:{
			exclusion : { in: [null], message: "Debe seleccionar un gerente" }
		}
	},

	actions: {

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

		enteradoInspeccionarErrores(){
			this.toggleProperty("muestroErrores");
		},

		llenar(){
			set(this, "fechadenacimiento", "1991/01/06");
			set( this, "apellidopaterno", "rios");
			set(this, "apellidomaterno", "beltran");
			set(this, "nombre", "jorge carlos");
			set(this, "rfc", "rib060191991");
			set(this, "curp", "111112345678909876");
			set(this, "telefonocasa", "37925738");
  			set(this, "telefonooficina", "984894984");
  			set(this, "extensionoficina", "");
  			set(this, "telefonocelular", "33349128474");
  			set(this, "mediopublicitario", "");
  			set(this, "mediopublicitariosugerido", "");
		},
		probarConfirmacion: function(){
			this.launchModal("confirmacion", "que onda", "que pasa", "si","no");
		},
		grabar(){
			
			var that = this;
			var record =  this.store.createRecord("prospecto");
			var fechadenacimiento = !isEmpty(get(this,"fechadenacimiento")) ? moment(get(this, "fechadenacimiento")).format("YYYY/MM/DD"): "";
			var props = {
				apellidopaterno : get( this, "apellidopaterno"),
				apellidomaterno : get(this, "apellidomaterno"),
				nombre : get(this, "nombre"),
				afiliacion : get(this, "afiliacion"),
				fechadenacimiento: fechadenacimiento,
				rfc : get(this, "rfc"),
				curp : get(this, "curp"),
				telefonocasa : get(this, "telefonocasa"),
  				telefonooficina : get(this, "telefonooficina"),
  				extensionoficina : get(this, "extensionoficina"),
  				telefonocelular : get(this, "telefonocelular"),
  				idmediopublicitario : get(this, "selectedMedio"),
  				mediopublicitariosugerido : get(this, "mediopublicitariosugerido"),
  				contado : get(this, "tipoCuentaEsContado"),
  				hipotecaria : get(this, "tipoCuentaEsHipotecaria"),
  				pensiones : get(this, "tipoCuentaEsPensiones"),
  				fovisste : get(this, "tipoCuentaEsFovisste"),
  				gerente : get(this, "selectedGerente"),
  				vendedor : get(this, "selectedVendedor")
			};
			record.setProperties(props);
			record.save().then(function(){ 
				set(that, "apellidopaterno", "");
				set(that, "apellidomaterno", "");
				set(that, "nombre", "");
				set(that, "afiliacion", "");
				set(that, "fechadenacimiento", "");
				set(that, "rfc", "");
				set(that, "curp", "");
				set(that, "telefonocasa", "");
  				set(that, "telefonooficina", "");
  				set(that, "extensionoficina", "");
  				set(that, "telefonocelular", "");
  				set(that, "mediopublicitario", null);
  				set(that, "mediopublicitariosugerido", "");
  				set(that, "tipoCuenta", "infonavit");
  				set(that, "selectedGerente", null);
  				set(that, "selectedVendedor", null);
				that.transitionToRoute("buscarprospecto");
			}, Ember.K);

			
		},
		
		getDateValue( result ){
			set(this, result.tag, result.value);
		}
	},
	hazConfirmacion: function(){
	}.on("confirmacion")
	
});

