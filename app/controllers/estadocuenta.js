import Ember from 'ember';
import ajax from "ember-ajax";
import EmberValidations from 'ember-validations';
import config from '../config/environment';


const {
	get,
	set,
	observer,
	computed,
	isEmpty
} = Ember;

var info= Ember.Logger.info;

export default Ember.Controller.extend({
	session:Ember.inject.service(),
	selectedNombre: "",
	selectedEtapa: null, 
	selectedDoc: null,
	cuantos:"",
	catalogoNombres: null,
	docsCliente: null,
  	error:"",
	nombre: "",
	idDocumento: "",
	manzana: "",
	lote: "",
	cuenta: "",
	cliente: "",
	saldo: "",
	movimientosdocumento:null,
	maximo:Ember.computed.lt("cuantos", 101),
	conPagares:null,
	saldoPagares:"",
	saldoFormateado:"",
	saldoPagaresFormateado:"",
	documentosPagares:null,
	saldoCuenta:"",
  	//movimientosdocumento:"",
  	//documentosPagares:"",

	observaSelectedNombre:observer("selectedNombre", function(){

		var that=this;
		this.store.unloadAll("documentoscliente");
	    //get(this, "documentosSelec.content").clear();
	    var cuenta=get(this, "selectedNombre");
	    info(`valor de cuenta ${cuenta}`);
	    var cual = get(this, "catalogoNombres").findBy("cuenta", cuenta);
	    info(`valor de cual ${cual}`);
		var p= this.store.query("documentoscliente", {cuenta: cuenta });
		set(this, "docsCliente", p);
		set(this, "cuenta", cual.get("cuenta"));
		set(this, "manzana", cual.get("manzana"));
		set(this, "lote", cual.get("lote"));
	    set(this, "saldo", cual.get("saldo"));
	    set(this,"conPagares", get(cual, "conpagares"));
	    set(this, "saldoPagaresFormateado", get(cual, "saldopagaresformateado"));
	    if(get(this, "conPagares")===true){
	    	set(this, "documentosPagares", this.store.query("documentopagare", {cuenta: cuenta}));
	    }else{

	    }
    
    //Para impresion
    set(this, "cliente", cual.get("cliente"));

	}),

	actions:{
		procesaDocumento(idDocumento, abono){
			this.store.unloadAll("movimientosdocumento");
			info(`valor de id documento ${idDocumento} valor de abono ${abono}`);
			set(this, "movimientosdocumento", this.store.query("movimientosdocumento", {documento: idDocumento}));

		},

		selectedNombre(item){
				set(this, "selectedNombre", item.cuenta);
			},

		selectedEtapa(item){
			set(this, "selectedEtapa", item.id);
		},


		buscar(){
			var that=this;
	      	const nombre = get(this, "nombre");
	      	const etapa=get(this, "selectedEtapa");
	      	info(`valor de selectedEtapa ${etapa}`);
	      	set(this, "catalogoNombres", null);
	      	var p2=this.store.query("clientescuantosconcuentanosaldada" , {etapa: etapa, nombre: nombre, estadocuenta:1 });
	      	p2.then((data)=>{
				if(get(data, "length")){
					data.forEach((item)=>{
						set(that, "cuantos", get(item, "cuantos"));
					});

				}
				if(parseInt(get(this, "cuantos"))<=100){	
					return this.store.query("clientesconcuentanosaldada", {etapa: etapa, nombre: nombre, estadocuenta:1 }).
					then((data)=>{
						set(that, "catalogoNombres", data);
					});
	  			}
			});
			
		}
	}
});

