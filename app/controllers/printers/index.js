import Ember from 'ember';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  inject:{service}
}= Ember;

export default Ember.Controller.extend({
  session:service(),
  ajax:service(),
	mostrarConfiguracion: false,
	refreshing: false,
	selectedPrinter : null,
	btnRefreshDefault : 'Refrescar',
	btnRefreshPending : 'Recargando...',
	btnRefreshFulfilled : 'Refrescado',
	btnRefreshRejected : 'Error al recargar',
	ap: Ember.inject.controller("application"),
	admin: Ember.computed.equal("ap.perfil", "admin"),
  email: '',
	dummy : 5,
  reloadmodel: function(data){
    //this.store.unloadAll("printer");
    var that = this;          
    this.store.findAll("printer", {reload: true}).then(function(xdata){
      var _this = that;
      set(that,"model",xdata);
      Ember.Logger.info("voy a llamar useremail");
      get(that,"ajax").post("/api/useremail?query=1")
      .then(
            (data)=>{
                if ( data.success === "1"){
                  set(_this,"email", data.email);
                  
                  
                }
            }
          );
    });
  },
	actions: {
    limpiarEmail(){
      set(this,"email", "");
    },
    actualizarEmail(){
          var that = this;
          var email = get(this,"email");
          get(this, "ajax").post("/api/useremail?email="+email).then(
            (data)=>{
                if ( data.success === "1"){
                  that.reloadmodel(data);
                } 
            }
          );
    },

		configurarImpresora(idprinter){
			set(this,"selectedPrinter", idprinter);
			set(this,"mostrarConfiguracion", true);

		},
		configura( copies){
			var badge = '<span class="badge badge-info">' + copies + '</span>';
			var empty = '';
			var printer = get(this,"selectedPrinter");
			
      		var that = this;
      		get(this, "ajax").post("/api/userprinter?printerid="+printer+"&copies="+copies)
          .then(
        		(data)=>{
          			if ( data.success === "1"){
          				Ember.$("#"+ printer).html(copies ? badge : empty);
          	      that.reloadmodel(data);
          			} 
        		}
      		);
			this.toggleProperty("mostrarConfiguracion");
		},
    probarEmail(){
      var that = this;
      var email = get(this,"email");
      get(this, "ajax").request( "/api/otro?email="+email+"&tipo=otro" )
      .then(
            (data)=>{
              that.reloadmodel(data);
            }
          );
    },
		probar(){
			
			var printer = get(this,"selectedPrinter");
			var that = this;
			get(this, "ajax").request("/api/otro?printer="+printer+"&copies=1&tipo=otro")
      .then(
        	 (data)=>{
        			that.reloadmodel(data);
        			     			
        		}
      		);
      		this.toggleProperty("mostrarConfiguracion");
		},
		eliminar(printer){
			
			var that = this;
			get(this, "ajax").post("/api/deleteprinter?printerid="+printer)
      .then(
        	 (data)=>{
        		  that.reloadmodel(data);
        		}
      		);	
		},
		agregar(){
			var that = this;
			get(this, "ajax").request("/api/listprinters")
      .then(
        		(data)=>{
        			
              that.reloadmodel(data);
                    			
        		}
      		);
		}
		
	}
});
