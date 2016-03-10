import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';

const {
	get,
	set,
	observer,
	computed,
	isEmpty
} = Ember;
var info = Ember.Logger.info;

var documentoSelec = Ember.Object.extend(  {
	idDoc : "",
	abono : "",
	abononum : computed("abono",{
		get: function(){
			var sabono = get(this, "abono").replace(",","");
			return parseFloat(sabono);
		}
	})
});

//info para impresora
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

var ErrorValidacion = Ember.Object.extend({
  variable : "",
  mensaje : "",
  campo : ""
});

export default Ember.Controller.extend( Ember.Evented,EmberValidations,
 {
  session:Ember.inject.service(),
  ajax:Ember.inject.service(),
	selectedNombre: "",
	selectedEtapa: null, 
	selectedDoc: null,
	catalogoNombres: "",
	docsCliente: "",
  error:"",
	nombre: "",
	idDocumento: "",
	conDevolucion: false,
	genSolicitudChq: false,
	reactivable: false,
	manzana: "",
	lote: "",
	cuenta: "",
  cliente: "",
  saldo: "",
  isCancelarOk: false,
  maximo:Ember.computed.lt("cuantos", 101),
  cuantos:"",

	//vara para imprimir
	muestraOpcionesImpresion: false,
  copiasDocsCliente: 1,
	copiasCancelacion: 1,
	enviarEmail: false,
  soloEmail: false,
  huboErrorAlImprimir: false,
  huboErrorAlImprimir1: false,

  //manejo de error al grabar
  huboErrorAlGrabar: false,
  muestroErrores: false,


	abonos: computed("documentosSelec.content.@each.abononum", {
		get: function(){
			var suma = 0;

			get(this, "documentosSelec.content").forEach((item)=>{
				suma = suma + get(item,"abononum");
			});
			return suma;
		}
	}),

	validations:{
		nombre: {
			length: {minimum: 3, message:"el nombre es mal "}
		},

    isCancelarOk: {
      inclusion:{in :[true], message:"La cuenta ya esta en escrituras"},
    },
	},

	init:function(){
    this._super.apply(this, arguments);
		set(this, "documentosSelec", Ember.ArrayProxy.create({content: []}));
    set(this,"erroresHabidos", Ember.ArrayProxy.create({ content : []}));

		set(this,"impresoras", Ember.ArrayProxy.create({content: []}));
	},
	
	observaCatNombre: observer ("selectedNombre", function(){
    var that=this;
    get(this, "documentosSelec.content").clear();
    var cual = get(this, "catalogoNombres").findBy("cuenta", get(this, "selectedNombre"));
    var e=this.store.find("cuentaescritura", get(this, "selectedNombre"));

		var p= this.store.query("documentoscliente", {cuenta: get(this, "selectedNombre") });
		set(this, "docsCliente", p);

    //llena info
		set(this, "cuenta", cual.get("cuenta"));
		set(this, "manzana", cual.get("manzana"));
		set(this, "lote", cual.get("lote"));
    set(this, "saldo", cual.get("saldo"));
    e.then(function(data){
      const viable = get(data, "viable");
      set(that, "isCancelarOk", viable);
    });
    
    //Para impresion
    set(this, "cliente", cual.get("cliente"));
  }),

	actions: {
    buscaImpresora(){
      var that=this;
      this.store.findAll("printer").then((data)=>{
        data.forEach((imp)=>{
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
      },error=>{
       info("hubo error"); 
      });
    },

		cancelar:function(){
      var docs=get(this, "documentosSelec"); 
			var that=this;
      var documentosConRecibosADevolver="";
      var record = this.store.createRecord("cancelacion", {});

      docs.forEach(function(item){
        if(item.get("abononum")>0){
          documentosConRecibosADevolver = documentosConRecibosADevolver + item.get("id")+",";
        }
      });


			record.setProperties({
	            cuenta: get(that,"cuenta"),
    	        total: get(that,"abonos"),
        	    conDevolucion: get(that,"conDevolucion"),
            	generarSolicitudCheque: get(that,"genSolicitudChq"),
            	reactivable: get(that, "reactivable"),
              documentosConRecibosADevolver: documentosConRecibosADevolver
			});

			record.save().then(function(){

				//Impresora
        get(that,"impresoras.content").clear();
				that.store.findAll("printer", {reload: true}).then(function(data){
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

        get(that,"ajax").post("/api/useremail?query=1")
        .then(function(data){
                      if ( data.success === "1"){
                          set(that,"emailaddress", data.email);
                      } 
                    }
        );

        //Variables para la impresion
        that.setProperties({
                muestraOpcionesImpresion: true,
                copiasCanc: 3,
                enviarEmail: false,
                soloEmail: false,
        });


				set(that,"catalogoNombres", null);
				set(that, "docsCliente", "");

			},function(error){
        set(that, "huboErrorAlGrabar", true);
        set(that, "error", error);
			});

		},

    enteradoHuboErrorAlGrabar: function(){
      this.transitionToRoute("index");
    },

    enteradoHuboErrorAlImprimir: function(){
      this.transitionToRoute("index");
    },

    enteradoHuboErrorAlImprimir1: function(){
      this.transitionToRoute("index");
    },


    enteradoInspeccionarErrores(){
      this.toggleProperty("muestroErrores");
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
      
    },

    elegirImpresora(cual){
      get(this,"impresoras.content").objectAt(cual).toggleProperty("chosen");
    },


		procesaDocumento(idDocumento, abono){
			var docs = get(this, "documentosSelec");
			var cual = docs.findBy("id", idDocumento);
			var indice = docs.indexOf(cual);

      if(indice !== -1){
      	docs.removeAt(indice);
      }else{        
      	docs.pushObject(documentoSelec.create({id: idDocumento, abono: abono }));
      }
    
      cual = get(this, "docsCliente").findBy("id", idDocumento);
      cual.toggleProperty("elegido");
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
  			var email = "webmaster@grupoiclar.com";
        var docsClientePdf = "";
        var cancelacionPdf = "";
        var cliente = get(this, "cliente");
        var cuenta = get(this, "cuenta");
        var abonos = get(this, "abonos");
        var etapa = get(this, "selectedEtapa");
	   		var that = this;
			
		  	if ( true ) {
				  get(this, "ajax").request("/api/otro?printer=null&tipo=docscliente&cliente="+cliente+"&cuenta="+cuenta+"&etapa="+etapa).
          then(
                  		function(data){
              			    if (data.error){
              				    return;
              			     }
                  			docsClientePdf = data.name;
                  			set(that,"docsClientePdf", docsClientePdf);
                  		}, 

                  		function(error){
                        set(that, "huboErrorAlImprimir", true);
                  		}
          );
          
          get(this, "ajax").request("/api/otro?printer=null&tipo=cancelacion&cliente="+cliente+"&devolucion="+abonos+"&cuenta="+cuenta+"&etapa="+etapa).
          then(
    		      function(data){
    			       if (data.error){
    				        return;
    			       }
    			       cancelacionPdf = data.name;
    			       set(that,"cancelacionPdf", cancelacionPdf);
      			
    		      }, 
    		      function(error){
                set(that, "huboErrorAlImprimir1", true);
    		      }
          );
          		
          Ember.run.later(function(){
          	var cancelacionPdf = get(that,"cancelacionPdf");
            var docsClientePdf = get(that,"docsClientePdf");
          	var emailAddress = get(that,"emailaddress");

          	var request = function( tipo_destino, destino, lista_de_archivos){
          	    lista_de_archivos.forEach(
                  function(archivo){
          				  get(that, "ajax").request("/api/otro?"+tipo_destino+"="+destino+"&pdf="+archivo);
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
          			
          	var archivos = [ docsClientePdf, cancelacionPdf ];
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
          					request_for_printing( get(impresora,"impresora"), cancelacionPdf, get(that,"copiasCancelacion") );
          				  request_for_printing( get(impresora,"impresora"), docsClientePdf, get(that,"copiasDocsCliente") );
                  }
          			});
          			}
          	},5000);
   			}

			this.setProperties({
				muestraOpcionesImpresion: false
			});

			Ember.run.later(function(){
        that.transitionToRoute("index");
			}, 7000);
		},
	}
});
