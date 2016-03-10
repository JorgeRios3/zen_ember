import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';
import moment from 'moment';
const log = Ember.Logger.info;

const {
	get,
	set,
	inject:{service},
	Logger:{info},
	observer,
	computed,
	isEmpty
} = Ember;

var Hijo = Ember.Object.extend({
	sexo: "M",
	anos: "",
	meses: "",
	timestamp: "",
	descripcion: computed("sexo","anos","meses",{
		get(){
			const sexo =  get(this,"sexo") === "M" ? "Hombre" : "Mujer";
			const meses = isEmpty(get(this,"meses")) ? "" : ", " + get(this,"meses") + " meses";
			return sexo + ', ' + get(this,"anos") + ' años' +  meses;
		}
	})
	
});

var ErrorValidacion = Ember.Object.extend({
	variable : "",
	mensaje : "",
	campo : ""
});

export default Ember.Controller.extend( EmberValidations, {
	session:Ember.inject.service(),
	init: function(){
		this._super(...arguments);
		set(this, "etapas", this.store.findAll('etapastramite', {reload: true}));
		set(this,"hijos", Ember.ArrayProxy.create({content: []}));
		set(this,"erroresHabidos", Ember.ArrayProxy.create({ content : []}));
	},
	queryParams: ["afiliacion", "origenOferta", "prospecto"],
	origenOferta: false,
	partiendoDeOferta: computed("origenOferta", function(){
		return get(this,"origenOferta") ? " ( proviniendo de Oferta de Compra )": "";
	}),
	//losHijos: computed.alias("hijos"),
	tieneCuenta: false,
	muestroErrores: false,
	huboErrorAlGrabar: false,
	errorMessage: "",
	errorAlGrabar: '',
	prospecto: '',
	clienteValorSelect:"",
	prospectoCliente: "",
	rfc: "",
	clienteGrabado : 0,
	conyugerfc: "",
	nombre: "",
	conyugenombre: "",
	curp: "",
	conyugecurp: "",
	telefonocasa: "",
	telefonotrabajo: "",
	fechanacimiento: "",
	nullfechanacimiento:"",
	nullconyugefechanacimiento:"",
	conyugefechanacimiento:"",
	//conyugefechanacimiento: "",
	lugarnacimiento: "",
	conyugelugarnacimiento: "",
	nacionalidad: "",
	conyugenacionalidad : "",
	afiliacionOk: false,
	afiliacion: "",
	estadocivil: null,
	situacion: null,
	regimen: null,
	ocupacion: null,
	conyugeocupacion: null,
	domicilio: '',
	colonia: '',
	ciudad: '',
	estado: '',
	codigopostal: '',
	email: '',
	agregarHijo : false,
	tipoTramite: null,
	titularIfe: false,
	titularCopiasIfe: false,
	titularCartaEmpresa: false,
	titularCopiaAfore: false,
	titularActaNacimiento: false,
	titularCopiasActaNacimiento: false,
	conyugeIfe: false,
	conyugeCopiasIfe: false,
	conyugeCartaEmpresa: false,
	conyugeCopiaAfore: false,
	conyugeActaNacimiento: false,
	conyugeCopiasActaNacimiento: false,
	actaMatrimonio: false,
	copiasActaMatrimonio: false,
	processingGrabar: false,
	estadosciviles : [ {id: "S" , tipo: "Soltero"},
					{id: "C", tipo: "Casado" },
					{id: "V", tipo: "Viudo"},
					{id: "D", tipo: "Divorciado"}
	],
	situaciones : [ {id: "U", tipo: "Unión Libre"},
					{id: "S", tipo: "Separado"}
	],
	regimenes : [ {id: "L", tipo: "Sociedad Legal" },
				{id: "C", tipo: "Sociedad Conyugal"},
				{id: "S", tipo: "Separación de Bienes"}
	],
	ocupaciones : [ {id: "E", tipo: "Empleado" },
				{id: "P", tipo: "Profesionista"},
				{id: "O", tipo: "Otro"}
	],
	sexos: [ { id: "M", tipo: "Masculino"},
			{ id: "F", tipo: "Femenino"}
	],
	tipostramites: [
		{id: "IS", tipo: "Individual Soltero"},
		{id: "IC", tipo: "Individual Casado"},
		{id: "C", tipo: "Conyugal"}
	],
	conyugehijossexo: null,
	conyugehijosanos: null,
	conyugehijosmeses: null,
	hayHijos: false,
	validations:{
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
		curp:{format: { with: /^([a-z]{4})([0-9]{6})([a-z]{6})([0-9A]{1})([0-9]{1})$/i,  message: 'el curp es incorrecto'  }},

		nombre: {
			length: {minimum: 3}
		},
		afiliacion: {
			length: {is: 11, allowBlank: true},
			numericality: { onlyInteger: true, allowBlank: true }
		},
		estadocivil: {
			inclusion: { in: ['S','C','V','D']}
		},
		ocupacion: {
			inclusion: { in: ['E','P','O'] }
		},
		conyugeocupacion: {
			inclusion: {allowBlank: true, in: ['E','P','O'] }
		}

	},
	observaProspectoAcarreo: observer("prospecto", function(){
		set(this, "prospectoCliente", get(this, "prospecto"));
	}),
	isDev: computed({
		get(){
			return config.AUTOMATIC_LOGIN;
		}
	}),

	isCasado: computed.equal("estadocivil", "C"),

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

	observaClienteGrabado: observer('clienteGrabado', function(){
		if ( get(this,"clienteGrabado") ){
			this.setProperties({
				muestroErrores: false,
				huboErrorAlGrabar: false,
				errorAlGrabar: '',
				rfc: "",
				conyugerfc: "",
				nombre: "",
				conyugenombre: "",
				curp: "",
				conyugecurp: "",
				telefonocasa: "",
				telefonotrabajo: "",
				fechanacimiento: "",
				conyugefechanacimiento: "",
				lugarnacimiento: "",
				conyugelugarnacimiento: "",
				nacionalidad: "",
				conyugenacionalidad : "",
				afiliacionOk: false,
				afiliacion: "",
				estadocivil: null,
				situacion: null,
				regimen: null,
				ocupacion: null,
				conyugeocupacion: null,
				domicilio: '',
				colonia: '',
				ciudad: '',
				estado: '',
				codigopostal: '',
				email: '',
				agregarHijo : false,
				tipoTramite: null,
				titularIfe: false,
				titularCopiasIfe: false,
				titularCartaEmpresa: false,
				titularCopiaAfore: false,
				titularActaNacimiento: false,
				titularCopiasActaNacimiento: false,
				conyugeIfe: false,
				conyugeCopiasIfe: false,
				conyugeCartaEmpresa: false,
				conyugeCopiaAfore: false,
				conyugeActaNacimiento: false,
				conyugeCopiasActaNacimiento: false,
				actaMatrimonio: false,
				copiasActaMatrimonio: false,
				processingGrabar: false,
			});
	
			try{
				get(this, "hijos").clear();
				get(this, "erroresHabidos.content").clear();			
			} catch(err){
				log("error al limpiar proxy", err.message);
			}

			if (get( this,"origenOferta") ){
				this.transitionToRoute("oferta", {queryParams : { 
					origenCliente : true,
					cliente: get(this,"clienteGrabado"),
					afiliacion : get(this,"afiliacion"),
					prospecto: get(this, "prospecto") }
				});

			} else {
				this.transitionToRoute("index");
			}
		}
	}),
	observaProspecto: observer("prospecto", function(){
		var that=this;
		var fecha=function(fecha){
			var a=fecha.substring(0,4);
			var m=fecha.substring(4,6);
			var d=fecha.substring(6,8);
			var valor=`${a}/${m}/${d}`;
			return valor;
		};
		var p= get(this, "prospecto");
		if(p){
			info("aqui es la que truena");
			var pro= this.store.queryRecord("prospecto", {prospecto:p});
			pro.then((data)=>{
				info("valor de data", data);
				info(Object.keys(data));
				info(get(data, "apellidopaterno"));
				var ap=get(data, "apellidopaterno");
				var am=get(data, "apellidomaterno");
				var n=get(data, "nombre");
				set(that, "nombre", `${n} ${ap} ${am}`);
				set(that, "fechanacimiento",get(data,"fechadenacimiento"));
				set(that, "rfc", get(data, "rfc"));
				set(that, "curp", get(data,"curp"));
				set(that, "telefonocasa", get(data,"telefonocasa"));
				set(that, "telefonotrabajo", get(data,"telefonooficina"));
					/*data.forEach((item)=>{
					var ap=get(item, "apellidopaterno");
					var am=get(item, "apellidomaterno");
					var n=get(item, "nombre");
					set(that, "nombre", `${n} ${ap} ${am}`);
					set(that, "fechanacimiento", fecha(get(item,"fechadenacimiento")));
					set(that, "rfc", get(item, "rfc"));
					set(that, "curp", get(item,"curp"));
					set(that, "telefonocasa", get(item,"telefonocasa"));
					set(that, "telefonotrabajo", get(item,"telefonooficina"));
					});*/
			});
		}
	}),
	observaProspectoCliente: observer("prospectoCliente", function(){
		var that = this;
		if(get(this,"prospectoCliente").length > 5){
          this.store.find("prospectoconcliente", get(this,"prospectoCliente")).then(
          	function(item){
          		if(parseInt(item.get("cuenta"))>0){
          			set(that, "tieneCuenta", true);
          			set(that, "afiliacionOk", false);
          			set(that, "errorMessage", "La cuenta-oferta ya tiene inmueble asignado");
          		} else{
          			set(that, "errorMessage", "");
	          		that.set("afiliacionOk", true);
    			}
          	});          
		} 
	}),
	validaAfiliacion: observer('afiliacion', function(){
		info("probando info ");
		var afi = get(this,"afiliacion");
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
				set(this,"afiliacionOk", true);
			} else {
				set(this,"afiliacionOk", false);
			}
		} else {
			set(this,"afiliacionOk", false);
		}
	}),
	esBool( value ){
		var valores = {
				titularIfe: true,
				titularCopiasIfe: true,
				titularCartaEmpresa: true,
				titularCopiaAfore: true,
				titularActaNacimiento: true,
				titularCopiasActaNacimiento: true,
				conyugeIfe: true,
				conyugeCopiasIfe: true,
				conyugeCartaEmpresa: true,
				conyugeCopiaAfore: true,
				conyugeActaNacimiento: true,
				conyugeCopiasActaNacimiento: true,
				actaMatrimonio: true,
				copiasActaMatrimonio: true
		};
		Object.keys(valores).forEach(function(key){
			if ( key === value){
				return true;
			}
		});
		return false;
	},

	actions: {
		seleccionar(cliente){
			var cliente= parseInt(get(cliente, "id"));
			set(this, "clienteValorSelect", cliente);
		},
		llenarCliente(){
			this.set("nombre", "otro");
			this.set("rfc", "ribj910106lsk");
			this.set("curp", "ribj910106hjcled00");
			this.set("fechanacimiento", "1991/01/06");
			this.set("lugarnacimiento", "tlaquepulque");
			this.set("nacionalidad", "mexicana");
			this.set("telefonocasa", "3338255454");
			this.set("telefonotrabajo", "3338255454");
			this.set("estadocivil", "C");
			this.set("situacion", "U");
			this.set("regimen", "L");
			this.set("ocupacion", "E");
			this.set("domicilio", "loma indaparapeo #8879");
			this.set("colonia", "golden hill");
			this.set("ciudad", "tonala");
			this.set("estado", "Jalisco");
			this.set("codigopostal", "44140");
			this.set("email", "jrios@grupoiclar.com");
			this.set("conyugenombre", "mariana");
			this.set("conyugerfc", "ribj910106jjj");
			this.set("conyugecurp", "ribj910106hjcled01");
			this.set("conyugelugarnacimiento", "morels");
			this.set("conyugenacionalidad", "mexicana");
			this.set("conyugeocupacion", "E");
			this.set("fechanacimientoConyuge", "1980/01/20");
		},

		imprimeFicha(){
			this.transitionToRoute("index");
		},
		agregandoHijo(){
			set(this,"agregarHijo", true);
		},
		aceptandoHijo(){
			var ts = new Date().getTime();
			get(this,"hijos").pushObject(Hijo.create({
				sexo: this.get("conyugehijossexo"),
				anos: this.get("conyugehijosanos"),
				meses: this.get("conyugehijosmeses"),
				timestamp: ts
			}));
			this.setProperties({
				hayHijos: true,
				conyugehijossexo: null,
				conyugehijosanos: "",
				conyugehijosmeses: "",
				agregarHijo: false
			});	
		},
		cancelandoAgregarHijo(){
			this.setProperties({
				conyugehijossexo: null,
				conyugehijosanos: "",
				conyugehijosmeses: "",
				agregarHijo: false
			});
		},
		removiendoHijo( ts ){
			var hijos = get(this,"hijos");
			var cual = hijos.findBy("timestamp", ts );
			var indice = hijos.indexOf( cual );
			hijos.removeAt(indice);
		},
		revisarErrores2(){
			var _this = this;
			Object.keys(get(this,"errors")).forEach(function(que){
				if ( typeof que === "string" || que instanceof String ){
					var error = get(_this,"errors."+ que);
					if ( typeof error[0] === "string" || error[0] instanceof String ){
					    log("Errores - ", que, error[0]);
					}
				}
			});
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
					    log("Errores - ", que, errmsg);
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
		enteradoHuboErrorAlGrabar(){
			this.toggleProperty("huboErrorAlGrabar");
		},
		
		grabar(){
			const modelo = "cliente";
			var llave="";
			var m = this.store.modelFor(modelo);
			var that = this;
			var record = this.store.createRecord(modelo, {});
			var fecha = "fecha";
			m.eachAttribute(function(key,meta){
				var newVal;
				llave=key;
				if (llave.indexOf(fecha)>-1 ){
					var f = that.get(llave);
					newVal = !isEmpty(f) ? moment(f).format("YYYY MM DD"): "";
					if(newVal){
						newVal=newVal.w().join("/");
					}
					set(record, key, newVal);
				} else {
					newVal = get(that,key);
					
					if ( !that.esBool(key) && isEmpty(newVal)){
						newVal = "";
					}
					set( record, key, newVal );
				}
			});
			set(this,"processingGrabar", true);
			record.save().then((cliente)=>{
				info("ya grabo al cliente");
				var hijosAplicados = 0;
				var c = cliente.get("id");
				info("valor de hijos", get(that, "hijos.length"));
				info("valor de hijos", get(that, "hijos"));
				if ( get(that,"hijos.length") === 0){
					info("se fue  sin hijos", c)
					that.setProperties({ 
						processingGrabar : false,
						clienteGrabado: c
					});
					return;
				}
				get(that,"hijos").forEach(function(hijo){
					info("se fue con hijos valor de c", c);
					
					var h = that.store.createRecord("chilpayate", {});
					h.setProperties({
						cliente : c,
						sexo: get(hijo,"sexo"),
						anos: get(hijo,"anos"),
						meses: get(hijo,"meses")
					});
					h.save().then(()=>{
						hijosAplicados++;
						if ( get(that,"hijos.length") === hijosAplicados){
							that.setProperties({ 
								processingGrabar : false,
								clienteGrabado: c
							});
						}
					});
				});
				
			} , (error)=> {				
					set(that,"errorAlGrabar", "");
					that.toggleProperty("huboErrorAlGrabar");
					set(that,"processingGrabar", false);
					var errorGenerado = "";
					try{
						errorGenerado = error.errors.resultado[0];
						log("el error es", errorGenerado);
					} catch ( er ){
						log("error en obtencion de error", er.message);
					}
					set( that, "errorAlGrabar", errorGenerado);
			});			
		}
	}
});
