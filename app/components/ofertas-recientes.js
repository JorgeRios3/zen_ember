import Ember from 'ember';
const log = Ember.Logger.info;

const {
	get,
	set,
	computed,
	observer,
	isEmpty
}= Ember;

export default Ember.Component.extend({
	attributeBindings: [ 'cuantos', 'dameTodos'],
	datos: null,
	hayError: false,
	mostrarDatos: false,
	dameTodos: false,
	cuantos: 5,
	sinInmueble: false,
	xetapa: null,
	etapa: null,
	asignacion:false,
	observaEtapa: function(){
		var etapa = this.get("etapa");
		this.set("mostrarDatos", false);
		Ember.Logger.info("entrando a observar etapa",etapa );
		if (!etapa ){
			Ember.Logger.info("etapa es nulo");
			return;
		}
		var that = this;
		var hashOfe;
		var cuantos = this.get("cuantos");
		log("cuantos es ", cuantos);
		try {
			if ( this.get("dameTodos") ){
				hashOfe = {cuantos: cuantos};

			} else {
				hashOfe = {etapa: etapa, cuantos: cuantos};
			}
			if ( this.get("sinInmueble")){
				hashOfe['sininmueble'] = true;
			}
			log("hashOfe", hashOfe);
			this.get("store").query("ofertasreciente", hashOfe).then(function(data){
				that.set("datos", data);
			}, 
			function(error){
				Ember.Logger.info("error al cargar promesa");
				that.set("hayError", true);
			});
		} catch(err){
			log( "hubo error en observaEtapa de componente ofertas-recientes ",err.message);
		}
	}.observes("etapa", "cuantos"),
	xdidUpdateAttrs(){
		//var etapa = this.attrs.etapa;

		var etapa =  this.attrs.etapa.value ;
		//log("keys", Object.keys(this));
		log("attrs", this.attrs);
		this.set("mostrarDatos", false);
		Ember.Logger.info("entrando a observar etapa",etapa );
		if (!etapa ){
			Ember.Logger.info("etapa es nulo");
			return;
		}
		var that = this;
		var hashOfe;
		var cuantos = this.get("cuantos");
		log("cuantos es ", cuantos);
		try {
			if ( this.get("dameTodos") ){
				hashOfe = {cuantos: cuantos};

			} else {
				hashOfe = {etapa: etapa, cuantos: 5};
			}
			log("hashOfe", hashOfe);
			this.get("store").find("ofertasreciente", hashOfe).then(function(data){
				that.set("datos", data);
			}, 
			function(error){
				Ember.Logger.info("error al cargar promesa");
				that.set("hayError", true);
			});
		} catch(err){
			log( "hubo error en observaEtapa de componente ofertas-recientes ",err.message);
		}
	},
	
	xdidReceiveAttrs(){
		this.set("dameTodos", false);
		try{
			var co = this.attrs.cuantasOfertas || 5;
			log("cuantos valdra", co);
			this.set("cuantos", co);
		} catch (err) {
			log("oops");
			log("no jalo cuantos en componente ofertas-recientes", err.message);
		}
		try{
			log("entrando a intentar modificar dameTodos");
			var todos = this.attrs.todos;
			if ( todos ){
				log("modificando dameTodos");
				this.toggleProperty("dameTodos");
			} else {
				log("lo dejo intecto");
			}
		} catch (err) {
			log("no jalo cuantos en componente ofertas-recientes", err.message);
		}


		
	},
	actions: {
		mostrar: function(){
			this.toggleProperty("mostrarDatos");
		},
		ocultar: function(){
			this.toggleProperty("mostrarDatos");
		},
		seleccionar(oferta){
			log("valor de oferta en accion seleccionar", get(oferta, "oferta"));
			this.sendAction('hacer', get(oferta, "oferta"));

		}

	}


	
});
