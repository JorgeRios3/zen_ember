import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';

var InmuebleReservado = Ember.Object.extend({
	inmueble: "",
	timestamp: "",
	me: false
});
var ProspectoReservado = Ember.Object.extend({
	prospecto: "",
	timestamp: "",
	me: false
});
var ErrorValidacion = Ember.Object.extend({
	variable : "",
	mensaje : "",
	campo : ""
});

var prospectoArray = Ember.Object.extend({
	id : "",
	nombre : "",
	nombrevendedor : "",
	gerente: "",
	nombregerente: ""
});

var Impresora = Ember.Object.extend({
	impresora: "",
	nombre: "",
	online: false,
	copies: 0,
	chosen: false,
	elegible: function(){
		return  this.get("copies") && this.get("online");
	}.property("copies", "online")
});

var miPrecio =Ember.Object.extend({
	descripcion:"",
	etapa:"",
	id:"",
	precio:"",
	precioraw:"",
	sustentable:"",
	precioDescripcion:""

});



const {
	get,
	set,
	computed,
	observer,
	isEmpty,
	getOwner
}= Ember;



const info = Ember.Logger.info;

export default Ember.Controller.extend( Ember.Evented, EmberValidations, {
	//"preciosinmuebles", "etapasofertas","clientessinofertas"needs: ["clientesofertas"],
	session: Ember.inject.service(),
	ajax: Ember.inject.service(),
	queryParams: ["origenCliente", "cliente", "afiliacion", "prospecto"],
	etapasofertas: "",
	tieneComision: true,
	manzanasdisponibles: "",
	isProspecto: false,
	comision: false,
    tieneCuenta: false,
    errorMessage: "",
    isCaracteristicas:false,
	origenCliente: false,
	labelProspecto: 'Prospecto',
	hayCaracteristicas:computed.gt("carateristicasLista.length", 0),
	carateristicasLista:null,
	labelCliente: 'Cliente',
	labelAfiliacion: 'Afiliación de Prospecto',
	labelReferencia: 'Referencia RAP',
	labelMontocredito: 'Monto de Crédito',
	labelSelectedEtapa: 'Etapa',
	labelSelectedManzana: 'Manzana',
	labelSelectedInmueble: 'Lote',
	labelSelectedPrecio: 'Precio del Inmueble',
	labelSumaCheca: 'Sumas',
	domicilio: "",
	precioUnico:[{id:0, precio:0}],
	precioCatalogo: "",
	candadoPrecio: false,
	caracteristicasPdf: "",
	anexoPdf: "",
	ofertaPdf: "",
	rapPdf: "",
	ofertaGenerada: '',
	soloEmail: false,
	emailaddress: "",
	processingGrabar: false,
	featureControl: false,
	selectedEtapa : null,
	etapaTemporal : null,
	selectedPrecio : null,
	selectedManzana : null,
	selectedLote: null,
	selectedInmueble : null,
	hayClientesSinOfertas : false,
	numerointerior : "",
	numeroexterior : "",
	numerosExteriores: null,
	numerosInteriores: null,
	proxyNumerosExteriores : null,
	afiliacion : '',
	cliente : '',
	montocredito : '',
	precio : '',
	precioRaw: null,
	inmueble : '',
	afiliacionOk: false,
	afiliacionNoChecar : false,
	prospectoNoChecar : false,
	manzana : '',
	lote : '',
	errorMessageComision:"El asesor no tiene comision",
	sumaCheca: false,
	apartado : '',
	anticipocomision: '',
	prospecto : '',
	cuantosprecios : 0,
	gastosadministrativos: '',
	precioseguro: '',
	precalificacion: '',
	prerecibo: '',
	prereciboadicional: '',
	avaluo: '',
	subsidio: '',
	pagare: '',
	cuantosInmueblesDisponibles: 0,
	flagLista : false,
	muestraCamposCapturaAdicionales: false,
	muestraOpcionesImpresion: false,
	copiasOferta: 1,
	copiasAnexo: 1,
	copiasCaracteristicas: 1,
	copiasRap: 1,
	clientessinofertas:null,
	clientesofertas:null,
	enviarEmail: false,
	tiposcuentas : [ {id: "infonavit" , tipo: "Infonavit"},
					{id: "contado", tipo: "Contado" },
					{id: "hipotecaria", tipo: "Hipotecaria"},
					{id: "fovisste", tipo: "Fovisste"},
					{id : "pensiones", tipo: "Pensiones del Estado"}
	],
	tipoCuenta : "infonavit",
	huboErrorAlGrabar: false,
	muestroErrores: false,
	errorAlGrabar: "",
	socketU: "ws://10.0.1.124:8888/zen",
	socketService: Ember.inject.service("websockets"),
	comodin: Ember.inject.service("comodin"),
	inmueblesdisponibles:"",
	socket: computed("socketService","socketU", {
		get: function(){
			return get(this,"socketService").socketFor(config.WSOCKETS_URL);
		}
	}),
	
	init: function(){
		this._super(...arguments);
		set(this,"precios", Ember.ArrayProxy.create({content: []}));
		for (let cual of "inmueblesReservados impresoras prospectosReservados erroresHabidos prospectosofertas".w()){
			set(this, cual, Ember.ArrayProxy.create({content: []}));
		}
		var socket = this.get("socket");
		socket.on('open', this.openHandler, this);
		socket.on('message', this.messageHandler, this);
		socket.on('close', this.closeHandler, this);
	},
	openHandler: function(event){
		var token = get(this, "session.session.content.authenticated.access_token");
      	//var token = sess.authenticated.access_token;
		//var token = get(this,"session.content").secure.access_token;
		get(this,"socket").send( { topic : "token", data : { token : token }}, true);
		if ( !get(this,"reservados") ){
			this.requestList();
		}
	},
	requestList: function(){
		get(this,"socket").send( { topic : "list_oferta_home", data : "" }, true);
		get(this,"socket").send( { topic : "list_prospecto", data : "" }, true);
		get(this,"socket").send( { topic : "list_feature", data : "" }, true);

	},
	messageHandler: function(event){
		var payload = JSON.parse(event.data);
		var ir, cual, indice;
		var that = this;
		if ( payload.topic === "lock_oferta_home"){
			get(this,"inmueblesReservados.content").pushObject(InmuebleReservado.create({
				inmueble: payload.data.inmueble,
				timestamp: payload.data.timestamp
			}));
		}
		if ( payload.topic === "free_oferta_home"){
				ir = get(this,"inmueblesReservados");
				cual = ir.findBy("timestamp", payload.data.timestamp );
				indice = ir.indexOf( cual );
				ir.removeAt(indice);
		}
		if ( payload.topic === "list_oferta_home"){
			payload.data.forEach( function( que ) {
				get(that,"inmueblesReservados.content").pushObject(InmuebleReservado.create({
				inmueble: que.inmueble,
				timestamp: que.timestamp
				}));
			});
		}
		if ( payload.topic === "lock_prospecto"){
			this.get("prospectosReservados.content").pushObject(ProspectoReservado.create({
				prospecto: payload.data.prospecto,
				timestamp: payload.data.timestamp
				
			}));
		}
		if ( payload.topic === "free_prospecto"){
				ir = get(this,"prospectosReservados");
				cual = ir.findBy("timestamp", payload.data.timestamp );
				indice = ir.indexOf( cual );
				ir.removeAt(indice);
		}
		if ( payload.topic === "list_prospecto"){
			payload.data.forEach( function( que ) {
				get(that,"prospectosReservados.content").pushObject(ProspectoReservado.create({
				prospecto: que.prospecto,
				timestamp: que.timestamp
				}));
			});
		}
		if ( payload.topic === "list_feature"){
			if (payload.data.feature === "oferta.save"){
				set(this, "featureControl", true);
			}

		}
		if ( payload.topic === "lock_feature"){
			if (payload.data.feature === "oferta.save"){
				set(this, "featureControl", true);
			}

		}
		if ( payload.topic === "free_feature"){
			if (payload.data.feature === "oferta.save"){
				set(this, "featureControl", false);
			}

		}

	},
	closeHandler: function(valor){
		info("se fue por aqui");
		this.get('session').invalidate();
	},
	
	montoCreditoCorrecto: computed("montocredito", "afiliacionOk", "tipoCuenta", {
		get:function(){
			var verdad= get(this, "tipoCuentaEsContado");
			if(!verdad){
				if(get(this, "afiliacionOk") && isEmpty(get(this, "montocredito"))){
					return false;
				} else{
					return true;
				}
			} else{
				return true;
			}
		}
	}),
	reservados: computed.alias("inmueblesReservados.content.length"),
	reservadosProspectos: computed.alias("prospectosReservados.content.length"),
	tipoCuentaEsInfonavit: computed.equal("tipoCuenta", "infonavit"),
	tipoCuentaEsHipotecaria: computed.equal("tipoCuenta","hipotecaria"),
	tipoCuentaEsContado: computed.equal("tipoCuenta", "contado"),
	tipoCuentaEsPensiones: computed.equal("tipoCuenta","pensiones"),
	tipoCuentaEsFovisste: computed.equal("tipoCuenta","fovisste"),
	estaEnInmueblesReservados: computed("inmueble",{
		get(){
			var inmueble = get(this,"inmueble");
			if (isEmpty(inmueble)){
				return false;
			}
			inmueble = parseInt(inmueble);
			var indice = -1;
			var ir = get(this,"inmueblesReservados");
			var cual = ir.findBy("inmueble", inmueble );
			indice = ir.indexOf( cual );
			return indice !== -1;
		}
	}),
	estaEnProspectosReservados: computed("prospecto",{
		get(){
			var prospecto = get(this,"prospecto");
			if (isEmpty(prospecto)){
				return false;
			}
			prospecto = parseInt(prospecto);
			var indice = -1;
			var ir = this.get("prospectosReservados");
			var cual = ir.findBy("prospecto", prospecto );
			indice = ir.indexOf( cual );
			return indice !== -1;
		}
	}),
	observaFlagLista: observer("flagLista", function(){
		if ( get(this,"flagLista")){
			this.requestList();
			this.toggleProperty("flagLista");
		}
	}),
	observandoTipoCuenta : observer("tipoCuenta", function(){
		if ( computed.or("tipoCuentaEsContado","tipoCuentaEsHipotecaria", "tipoCuentaEsFovisste", "tipoCuentaEsPensiones")){
			set(this,"afiliacionOk", true);

		} else {
			set(this,"afiliacion", "");
			set(this,"afiliacionOk", false);
		}
	}),

	observaSelectedInmueble: observer("selectedInmueble", function(){
		var that = this;
		var antes = get(this,"selectedInmueblePrevio");
		var despues = get(this,"selectedInmueble");
		set(this, "selectedInmueblePrevio", despues);

		set(this,"inmueble", despues );
		if (isEmpty(antes) && isEmpty(despues)){
		} else {
			if ( isEmpty(despues)){
				set(this,"domicilio", "");
				this.send("freeInmueble", antes);
			} else {
				this.send("submitInmueble");
				this.store.unloadAll("caracteristicasinmueble");
				this.store.unloadAll("inmuebleindividual");
				this.store.unloadAll("catalogoprecio");
				this.store.find("inmuebleindividual", despues).
				then((dato)=>{
					const candadoPrecio = get(dato,"candadoPrecio");
			 		set(that,"domicilio", get(dato,"domicilio"));
			 		set(that,"candadoPrecio", candadoPrecio);
			 		set(that,"precioCatalogo", get(dato,"precioCatalogo"));
			 		if ( candadoPrecio ){
			 			set(that,"selectedPrecio",0);
			 		}
			 		set(that, "sumaCheca", get(that, "PrecioRaw")=== get(that, "precioCatalogo") ? true:false );
			 		return that.store.find("catalogoprecio",despues);
			 	}).then((dato)=>{
			 		//that.store.find("catalogoprecio", despues).
					//then((dato) =>{
						const idPrecioCatalogo=get(dato, "idPrecioCatalogo");
						if(idPrecioCatalogo !== 0){
							info("paso la prueba", get(dato, "idPrecioCatalogo"));
						}else{
							info("se fue por el else no hay idPrecioCatalogo");
							
						}
					return that.store.query("caracteristicasinmueble", {
			 			inmueble: despues,
			 			precio: isEmpty(get(that,"selectedPrecio")) ? 0: get(that,"selectedPrecio"),
			 			precioCatalogo: get(that, "precioCatalogo"),
			 			etapa: get(that, "selectedEtapa")
			 		});

				}).then( (data)=>{
			 		
						if(get(data,"length")>0){
							set(that, "carateristicasLista", data);
						} else{
							set(that, "carateristicasLista", null);

						}
				});
					if (!isEmpty(get(that,"prospecto"))){
						that.store.query("comisionventa", {
							inmueble: despues,
							prospecto: get(that,"prospecto")
							}
						).
						then((data)=>{
							set(that,"comision", false);
							data.forEach((item)=>{
								const comision=get(item, "comision")
								set(that,"comision", comision);
								const error= comision===true ? "": "El asesor no tiene comision";
								set(that, "errorMessageComision", error);
							});	
						});
					}
					
				
			}
		}
	}),
	/*observaSelectInmuebleAntesDeCambiar: function(){
		var that = this;
		Ember.run(function(){
			set(that,"selectedInmueblePrevio", get(that,"selectedInmueble"));
		});
	}.observesBefore("selectedInmueble"),*/

	observaProspecto: observer("prospecto", function(){
		info("si esta observando el prospecto");
		var l=get(this, "prospectosofertas");
		    set(l, "content", []);
		var prospecto = get(this,"prospecto");
		var that = this;
		    set(this,"isProspecto", false);
		if(prospecto.length > 5 ){
		    this.store.find("prospectoconcliente", prospecto).then(
	          	function(item){
	          		const cuenta= get(item, "cuenta");
	          		info("valor de cuenta", cuenta);
	          		if(parseInt(get(item, "cuenta"))>0){
	          			info("si entro en condifico de error");
	          			set(that, "tieneCuenta", true);
	          			set(that, "afiliacionOk", false);
	          			set(that, "errorMessage", "La cuenta-oferta ya tiene inmueble asignado");
	          			set(that, "prospecto", "");
	          		} else{
	          			set(that, "errorMessage", "");
		          		set(that, "afiliacionOk", true);
	    			}
         	 	}
        	);
        }
                
		if (!get(this,"prospectoNoChecar")){					
				this.store.query("prospectosoferta", { prospecto: prospecto }).then((data)=>{
					data.forEach((item)=>{
						set(that,"afiliacionNoChecar",true);
						set(that,"prospectoNoChecar",true);
						set(that,"prospecto", get(item,"id"));
						set(that,"afiliacion",get(item,"afiliacion"));
						l.pushObject(prospectoArray.create({
					    	id : item.get("id"),
							nombre : item.get("nombre"),
							nombrevendedor : item.get("nombrevendedor"),
							gerente: item.get("gerente"),
							nombregerente: item.get("nombregerente") 
						}));
						set(that, "isProspecto", !isEmpty(get(that, "prospecto")));

					},(error)=>{

					});
				});
		} else {
			this.toggleProperty("prospectoNoChecar");
		}
		var antes = get(this,"prospectoPrevio");
		var despues = get(this,"prospecto");
		set(this, "prospectoPrevio", despues);
		if (isEmpty(antes) && isEmpty(despues)){

		} else {
			if ( isEmpty(despues)){
				this.send("freeProspecto", antes);
			} else {
				this.send("submitProspecto");
			}
		}
	}),
	/*observaProspectoAntesDeCambiar: function(){
		var that = this;
		Ember.run(function(){
			set(that,"prospectoPrevio", get(that,"prospecto"));
		});
	}.observesBefore("prospecto"),*/
	highLightAndTrue: function(key){
		if ( !isEmpty(key) ) {
			set(this,key,true);
		}
	}.on("highlightandtrue"),
	validaAfiliacion: observer("afiliacion", function(){
		if ( computed.or("tipoCuentaEsContado","tipoCuentaEsHipotecaria") ){
			set(this,"afiliacionOk", true);
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
				set(this,"afiliacionOk", true);
			} else {
				set(this,"afiliacionOk", false);
			}
		} else {
			set(this,"afiliacionOk", false);
		}
		if( get(this,"afiliacionOk") ) {
			this.trigger("highlightandtrue");
		}
	}),
	mislotes: computed("selectedManzana", { 
		get: function(){
			var that = this;
			var manzana = get(this,"selectedManzana");

			//var v = get(this,'controllers.inmueblesdisponibles');

			var c = get(this, "inmueblesdisponibles");
			var isDepto = get(this,"departamento");
			if (get(this,"departamento")){
				var mySet = new Set([]);
				set(this,"numerosExteriores", mySet );
			}
			return c.filter(function(item) {
				var m = get(item,"manzana");
				var lote = get(item,"lote");
				if ( m === manzana ){
					if (isDepto){	
					  get(that,"numerosExteriores").add(lote.substring(0,2));
					}
					return true;
				} else {
					return false;
				}
			});

		}
	}),
	misprecios: computed("selectedEtapa", {
		get(){
			var etapa = parseInt(get(this,"selectedEtapa"));
			info("valor de tapa", etapa);
			//
			var v = get(this,'precios').clear();
			var c = get(v,"content");
			var c = this.store.findAll("preciosinmueble");
			var that = this;
			set(this,"cuantosprecios", 0);
			c.then((data)=>{
				data.forEach((item)=> {
					var e = get(item,"etapa");
					if ( e === etapa ){	
						get(this,"precios.content").pushObject(
							miPrecio.create({
	                			descripcion: get(item,"descripcion"),
								etapa: get(item,"etapa"),
								id: get(item,"id"),
								precio: get(item,"precio"),
								precioraw: get(item,"precioraw"),
								sustentable: get(item,"sustentable"),
								precioDescripcion: `${get(item,"precio")} ${get(item, "descripcion")}`
			              	})
						);
					}
				});
			});
			return get(this, "precios");
		}
		
	}),
	observaEtapa: observer("selectedEtapa", function() {
		
		set(this, "sumaCheca", false);
		const selectedEtapa = this.getWithDefault("selectedEtapa", "");
		if ( selectedEtapa === ""){
			return;
		}
		var _this = this;
		set(_this,"cuantosInmueblesDisponibles",0);

		set(this,"manzanasdisponibles", this.store.query("manzanasdisponible", { etapa : selectedEtapa}));
		var etapaPromesa =  this.store.find("etapasoferta",selectedEtapa);
		etapaPromesa.then(function(data){
			set(_this,"departamento", get(data,"departamento"));
		});
		var idisp = this.store.query("inmueblesdisponible", { etapa : selectedEtapa});
		idisp.then(function(data){
			set(_this,"cuantosInmueblesDisponibles", get(data,"length"));
		});
		var params = this.store.find("parametrosetapa", get(this,"selectedEtapa"));
		params.then(function(data){
			"anticipocomision apartado gastosadministrativos precioseguro".w().forEach(function(key){
				set(_this,key, get(data,key));
			});
		});
		
		//set(get(this,"controllers.inmueblesdisponibles"),"model", idisp);
		set(this, "inmueblesdisponibles", idisp);

		//set(this,"selectedManzana", null);
	}),
	observarCliente : observer("cliente", function(){
		var cliente = get(this,"cliente");
		
		//aqui va
		//var token = get(this, "session.session.content.authenticated.access_token");
		set(this, "clientesofertas", this.store.query("clientesoferta", { cliente : cliente}));
		var _this = this;
		if(cliente){
			const url = `/api/referenciasrapconclientesincuentas/${cliente}`;
			this.get('ajax').request(url).then(
            			function(data){
                		
                			const ref = data.referenciasrapconclientesincuenta.referencia;
                			set(_this,"referencia", ref);
            			}
          		);
			
          	/*var a =get(this, "ajax").request(url).then((data)=>{
          		set(_this,"referencia",data.referenciasrapconclientesincuenta.referencia);

          	});*/
		}
	}),
	
	observaAfiliacion: observer("afiliacion", function(){
		var afiliacion = get(this,"afiliacion");
		var _this=this;
		if (!get(this,"afiliacionNoChecar")){
				this.store.query("prospectosoferta", { afiliacion: afiliacion }).then(
					(data)=>{
						var l=get(_this, "prospectosofertas");
						data.forEach((item)=>{
							set(_this,"afiliacionNoChecar",true);
							set(_this,"prospectoNoChecar",true);
							set(_this,"prospecto", get(item,"id"));
							set(_this,"isProspecto", !isEmpty(get(_this, "prospecto")));
							l.pushObject(prospectoArray.create({
						    	id : item.get("id"),
								nombre : item.get("nombre"),
								nombrevendedor : item.get("nombrevendedor"),
								gerente: item.get("gerente"),
								nombregerente: item.get("nombregerente") 
							}));
							
						});
				});
		} else {
			this.toggleProperty("afiliacionNoChecar");
		}
	}),
	
	observaManzana: observer("selectedManzana", function(){
			set(this,"selectedInmueble",null);
	}),
	observaPrecios: observer("selectedPrecio", function(){
		this.store.unloadAll("caracteristicasinmueble");
		info("a que hora entro a qui ");
		if ( isEmpty(get(this,"selectedEtapa"))) {
			return;
		}
		var precioid=0;
		try{
			precioid = parseInt(get(this,"selectedPrecio"));
			Ember.assert("el precio deberia ser mayor de cero", precioid>0);
		}catch(error){
			set(this,"precioRaw", 0);
			set(this, "nuevoPrecioRaw", 0);
			return ;
		}
		var that = this;
		var listaPrecios= get(this, "misprecios")
		get(that, "misprecios").forEach(item=>{
			if(get(that, "selectedPrecio")===get(item, "id")){
				set(that, "precioCatalogo", get(item, "precio"));
				set(that, "nuevoPrecioRaw", get(item, "precio"));
				if (!get(that,"candadoPrecio")){
					set(that,"precioRaw", get(item,"precioraw"));
					set(that, "nuevoPrecioRaw", get(item, "precioraw"));
				}
			}
		});
		that.store.query("caracteristicasinmueble", {
			 			precio: isEmpty(get(that,"selectedPrecio")) ? 0: get(that,"selectedPrecio")
			 			
						}
		).
		then( (data)=>{
			 		
						if(get(data,"length")>0){
							set(that, "carateristicasLista", data);
						} else{
							set(that, "carateristicasLista", null);

						}
		});
	
	}),

	hayCamposObligatorios: computed("inmueble","cliente",{
		get: function(){
			if ( isEmpty(get(this,"inmueble")) || 
				isEmpty(get(this,"cliente")) ){
				return false;
			}
			return true;
		}

	}),
	
	//clientesofertas : computed.alias("controllers.clientesofertas"),
	//clientessinofertas : computed.alias("controllers.clientessinofertas"),
	checaSuma: Ember.observer("nuevoPrecioRaw","precalificacion", "avaluo", "subsidio" , "pagare" , "prerecibo" , "prereciboadicional", function(){
		var _this = this;
		var total = 0;
		"precalificacion avaluo subsidio pagare prerecibo prereciboadicional".w().forEach(function(key){
			try{
			var n = Number(_this.getWithDefault(key, 0));
			total = total + n;
			} catch(err) { 
				//info(err.message);
			}
		});
		var pr = get(this,"precioRaw");
		if ( get(this,"candadoPrecio")){
			pr = get(this, "precioCatalogo");
		}
		info("valor de pr", pr);
		set(this,"sumaCheca", total === pr && pr>0 );
	}),
	
	validations:{
        comision:{
        	inclusion:{in :[true], message:"no tiene comision"},
        },
		montoCreditoCorrecto:{
			inclusion:{in :[true], message:"monto de credito debe contener cantidad"}
		},
		precalificacion: {
			numericality: { allowBlank: true}
		},
		avaluo: {
			numericality: { allowBlank: true}
		},
		subsidio: {
			numericality: { allowBlank: true}
		},
		pagare: {
			numericality: { allowBlank: true}
		},
		prerecibo: {
			numericality: { allowBlank: true}
		},
		prereciboadicional: {
			numericality: { allowBlank: true}
		},
		referencia: {
			numericality: { onlyInteger: true, greaterThan: 0, messages : { onlyInteger : "Solo digitos deben ser", greaterThan : "Debe tener valor"}}
		},
		afiliacion: {
			length: {is: 11, allowBlank: true},
			numericality: { onlyInteger: true, allowBlank: true, messages : { onlyInteger : "Solo digitos deben ser"}  }
		},
		
		cliente: {
			numericality: { onlyInteger: true, messages : { onlyInteger: "Solo digitos deben ser"} }
		},
		prospecto: {
			numericality: { onlyInteger: true, messages : { onlyInteger: "Solo digitos deben ser"} }
		},
		montocredito: {
			numericality: { allowBlank:true, greaterThan: 0, messages : { greatherThan : "Debe ser mayor a 0"}} 
		},
		gastosadministrativos: {
			numericality: { allowBlank: true}
		},
		precioseguro: {
			numericality: { allowBlank: true}
		},
		selectedEtapa : { 
			exclusion : { in: [null] , message: "Debe seleccionar etapa" }
		},
		selectedPrecio : {
			exclusion : { in: [null], message: "Debe seleccionar precio" }
		},
		selectedManzana : { 
			exclusion : { in: [null], message: "Debe seleccionar manzana" }
		},
		selectedInmueble : { 
			exclusion : { in: [null] , message: "Debe seleccionar inmueble" }
		},
		tipoCuenta : { 
			exclusion : { in: [null], message: "Debe seleccionar tipo cuenta" }
		},
		sumaCheca : {
			exclusion : { in: [false], message: "No checa total con precio"}
		}
	},
	actions : {
		checarComision(){
			var that=this;
			const inmueble= get(this, "selectedInmueble");
			const prospecto= get(this, "prospecto");
			info(`valor de prospecto ${prospecto} valor de inmueble ${inmueble}`);
			this.store.unloadAll("prospectosoferta");
			this.store.query("prospectosoferta", { prospecto: prospecto, inmueble:inmueble }).then((data)=>{
					data.forEach((item)=>{
						set(that, "comision", get(item, "tieneComision"));
					});
			});

		},	
		pegarAfiliacion(){
			set(this,"afiliacion", get(this,"comodin.afiliacion"));
		},
		mostrarCamposCapturaAdicionales(){

			this.toggleProperty("muestraCamposCapturaAdicionales");
		},
		descartaInmueble(){
			set(this,"selectedInmueble", null);
		}, 
		descartaProspecto(){
			set(this,"prospecto", null);
		},
		requestListAgain(){
			this.requestList();
		},
		traerEmail(){
			var that = this;
			get(this, "ajax").post("/api/useremail?query=1").then((data)=>{
				if(data.success==="1"){
					set(that, "emailaddress", data.email);
				}
			});

			/*ajax( { type: "POST" , 
           					async : false,
            				url: "/api/useremail?query=1" }
          			).then(
            			function(data){
                			if ( data.success === "1"){
                  				set(that,"emailaddress", data.email);
                			}
            			}
          	);*/
		},
		
		grabar:function(){
			var cambiar = function(valor){
				if (isEmpty(valor) ){
					return valor=0;
				}
				return valor;

			};
			set(this,"processingGrabar", true);
			get(this,"socket").send( { topic : "lock_feature", data: { feature : "oferta.save" }}, true);
			var model = this.store.createRecord("oferta", 
				{
					afiliacion : get(this,"afiliacion"),
  					inmueble : get(this,"inmueble"),
  					cliente : get(this,"cliente"),
  					prospecto : get(this,"prospecto"),
  					precio : get(this,"selectedPrecio"),
  					montocredito : cambiar(get(this,"montocredito")),
  					apartado : cambiar(get(this,"apartado")),
  					gastosadministrativos: cambiar(get(this,"gastosadministrativos")),
  					precioseguro: cambiar(get(this,"precioseguro")),
  					anticipocomision: cambiar(get(this,"anticipocomision")),
  					precalificacion: cambiar(get(this,"precalificacion")),
  					avaluo: cambiar(get(this,"avaluo")),
  					subsidio: cambiar(get(this,"subsidio")),
  					pagare: cambiar(get(this,"pagare")),
  					referencia: get(this,"referencia"),
  					tipocuenta: get(this,"tipoCuenta"),
  					prerecibo: cambiar(get(this,"prerecibo")),
  					prereciboadicional: cambiar(get(this,"prereciboadicional"))
				}
			);

			var that = this;
			model.save().then(
				function(data){
					set(that, "ofertaGenerada", get(data, "id"));
					that.store.findAll("printer").then(function(data){
						get(that,"impresoras.content").clear();
						data.forEach(function(imp){
							get(that,"impresoras.content").pushObject(
								Impresora.create({
									nombre : get(imp,"displayname"),
									impresora: get(imp,"printerid"),
									online: get(imp,"online"),
									copies: get(imp,"copies"),
									chosen: false
								})
							);
						});
				
					});

					get(that, "ajax").post("/api/useremail?query=1")
					.then(
            			function(data){
                			if ( data.success === "1"){
                  				set(that,"emailaddress", data.email);                  
                			} 
            			}
          			);
					that.setProperties({
					muestraOpcionesImpresion: true,
					muestraCamposCapturaAdicionales: false,
					copiasCaracteristicas: 2,
					copiasAnexo: 2,
					copiasOferta: 3,
					enviarEmail: false,
					soloEmail: false,
					processingGrabar: false,
					ofertaGenerada: get(data,"id")
					});
					get(that,"socket").send( { topic : "free_feature", data: { feature : "oferta.save" }}, true);
					info("termino el socket de oferta.save")

				},
				function(error){
					info("error del save");
					set(that,"errorAlGrabar", "");
					that.toggleProperty("huboErrorAlGrabar");
					set(that,"processingGrabar", false);
					var errorGenerado = "";
					try{
						errorGenerado = error.errors.resultado[0];
					} catch ( er ){
						info("error en obtencion de error", er.message);
					}
					set(that,"errorAlGrabar", errorGenerado);
					get(this,"socket").send( { topic : "free_feature", data: { feature : "oferta.save" }}, true);
				}
			);
			
		},
		submitInmueble(){
			var inmueble = parseInt(get(this,"inmueble"));
			get(this,"socket").send( { topic : "lock_oferta_home", data: { inmueble : inmueble }}, true);
			info("paso topic  lock_oferta_home")
		},
		freeInmueble(x){
			var inmueble = parseInt(x);
			get(this,"socket").send( { topic : "free_oferta_home", data: { inmueble : inmueble }}, true);
			info("paso free_oferta_home");
		},
		submitProspecto(){
			var prospecto = parseInt(get(this,"prospecto"));
			get(this,"socket").send({ topic : "lock_prospecto", data: { prospecto : prospecto }}, true);
			info("paso lock_prospecto");
		},
		freeProspecto(x){
			var prospecto = parseInt(x);
			get(this,"socket").send( { topic : "free_prospecto", data: { prospecto : prospecto }}, true);
			info("paso free_prospecto");
		},
		buscarClientesSinOfertas(){
			var _this = this;
			var cso = this.store.findAll("clientessinoferta");
			cso.then(function(data){
				set(_this,"hayClientesSinOfertas", get(data,"length") > 0 ? true : false ); 
			});
			set(this,"clientessinofertas",cso);
		},
		cerrarBusquedaCliente(){
			this.toggleProperty("hayClientesSinOfertas");
		},
		savemessage( what ){
			info("estoy en savemessage", what);
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
		imprimir(){
			set(this, "processingGrabar", true);
			var email = "webmaster@grupoiclar.com";
			var oferta = parseInt(get(this,"ofertaGenerada"));
			var etapa = get(this,"selectedEtapa");
			var precalificacion = this.getWithDefault("precalificacion",0) || 0;
			var avaluo = this.getWithDefault("avaluo",0) || 0; 
			var subsidio = this.getWithDefault("subsidio",0) || 0;
			var pagare = this.getWithDefault("pagare", 0) || 0;
			var cliente = this.get("cliente") || 0;
			var ofertaPdf = "";
			var anexoPdf = "";
			var caracteristicasPdf = "";
			var rapPdf = "";
			var that = this;
			
			if ( true ) {
				get(this, "ajax").request("/api/otro?printer=null&tipo=oferta&etapa="+etapa+"&oferta="+oferta )
				.then(
            		function(data){
            			if (data.error){
            				return;
            			}
            			ofertaPdf = data.name;
            			set(that,"ofertaPdf", ofertaPdf);
                	} 
            		
          		);
        
          		get(this, "ajax").request("/api/otro?printer=null&tipo=caracteristicas&etapa="+etapa+"&oferta="+oferta )
          		.then(
            		function(data){
            			if (data.error){
            				return;
            			}
            			caracteristicasPdf = data.name;
            			set(that,"caracteristicasPdf", caracteristicasPdf);
              			
            		} 
          		);
          		var url = "/api/otro?printer=null&tipo=anexo&etapa="+etapa+"&oferta="+oferta+"&precalificacion="+precalificacion+"&avaluo="+avaluo+"&subsidio="+subsidio+"&pagare="+pagare;
          		get(this, "ajax").request(url)
          		.then(
            		function(data){
            			if (data.error){
            				return;
            			}
            			anexoPdf = data.name;
            			set(that,"anexoPdf", anexoPdf);
              			
            		}
          		);

          		get(this, "ajax").request("/api/otro?printer=null&tipo=rap&cliente="+cliente )
          		.then(
            		function(data){
            			if (data.error){
            			  return;
            			}
            			rapPdf = data.name;
            			set(that,"rapPdf", rapPdf);
            		}
          		);
          		Ember.run.later(function(){
          			var caracteristicasPdf = get(that,"caracteristicasPdf");
          			var anexoPdf = get(that,"anexoPdf");
          			var ofertaPdf = get(that,"ofertaPdf");
          			var emailAddress = get(that,"emailaddress");

          			var request = function( tipo_destino, destino, lista_de_archivos){
          				lista_de_archivos.forEach(

          					function(archivo){
          						get(that, "ajax").request("/api/otro?"+tipo_destino+"="+destino+"&pdf="+archivo );
          					}
          				);
          			};

          			var request_for_printing = function( destino , archivo, copies ){
          				var promesa = null;
          				promesa = get(that, "ajax").request("/api/otro?printer="+destino+"&pdf="+archivo+"&copies="+copies);
          				return promesa;
          			};

          			var tieneValor = function( que ){
          				return !isEmpty(que);
          			};
          			
          			var archivos = [ ofertaPdf, caracteristicasPdf, anexoPdf, rapPdf ];

          			var archivos_validos = true;
          			archivos.forEach(function(archivo){
          				if (isEmpty(archivo)){
          					archivos_validos = false;
          				}
          			});
          			
          			if (that.get("enviarEmail") && tieneValor(email) && archivos_validos){
          				request( "email", email, archivos );
          			}
          			
          			if (that.get("enviarEmail") && tieneValor(emailAddress) && archivos_validos ){
          				request( "email", emailAddress, archivos );
          			}
          			var impresoras = get(that,"impresoras.content");
					if (!get(that,"soloEmail") &&  archivos_validos && impresoras.length > 0 ){
          				impresoras.forEach(function( impresora ){
          				if ( get(impresora,"chosen")){
          					request_for_printing( get(impresora,"impresora"), ofertaPdf, get(that,"copiasOferta") );
          					request_for_printing( get(impresora,"impresora"), caracteristicasPdf, get(that,"copiasCaracteristicas") );
          					request_for_printing( get(impresora,"impresora"), anexoPdf, get(that,"copiasAnexo") );
          					request_for_printing( get(impresora,"impresora"), rapPdf, get(that,"copiasRap") );
          				}
          			});
          			}

          		},5000);
          		
			}
			
			this.setProperties({
				muestraOpcionesImpresion: false
			});

			Ember.run.later(function(){
			get(that, 'session').invalidate();
			}, 7000);
		},

		seleccionarCliente(cliente){
			set(this, "cliente", cliente);
			this.send("cerrarBusquedaCliente");
		},
		enteradoHuboErrorAlGrabar(){
			this.toggleProperty("huboErrorAlGrabar");
		},
		enteradoInspeccionarErrores(){
			this.toggleProperty("muestroErrores");
		},
		elegirImpresora(cual){
			get(this,"impresoras.content").objectAt(cual).toggleProperty("chosen");
		},
		numeroExteriorElegido(edificio){
			set(this,"numeroexterior", edificio);
			var that = this;

			//var v = get(this,'controllers.inmueblesdisponibles');
			info("paso por numeroexterio elegido");
			var c = get(this, "inmueblesdisponibles");
			var mySet2 = new Set([]);
			set(this,"numerosInteriores", mySet2 );
			return c.filter(function(item) {
				var lote = get(item,"lote");
				if ( edificio === lote.substring(0,2) ){
					get(that,"numerosInteriores").add(lote.substring(2,5));
					return true;
				} else {
					return false;
				}
			});
		},
		numeroInteriorElegido(depa){
			const ne = get(this,"numeroexterior");
			const loteoficial = `${ne}${depa}`;
			var misLotes = get(this,"mislotes");
			var cual = misLotes.findBy("lote", loteoficial );
			const inmueble = get(cual,"id");
			set(this,"selectedInmueble", inmueble);
		},

		probar(){
			get(this,"socket").send( { topic : "lock_feature", data: { feature : "oferta.save" }}, true);
			var p= new Ember.RSVP.Promise(function(resolve, reject){
				Ember.run.later(function(){
					resolve(1);
				},5000);

			});
			p.then((data)=>{
				info("regresando promesa", data);
				get(this,"socket").send( { topic : "free_feature", data: { feature : "oferta.save" }}, true);
			});
		}
	}
});
