import Ember from 'ember';
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";
const info = Ember.Logger.info;
const {
  get,
  set
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , 
{
  
  beforeModel(transition){
    this._super(...arguments);
    info("paso por ofertaasignacion before");
    var controller = this.controllerFor(this.routeName);
    var url = get(this,"router.url");
    var origenCliente = url.indexOf("cliente?origenOferta") !== -1;
    
    if (origenCliente ){
      "selectedEtapa selectedManzana selectedInmueble".w().forEach( function(key) {
        info(key, controller.get(key));
      });
      info("before model agarraro parametros");
      return;
    }
    controller.setProperties({
      processingGrabar : false,
      selectedEtapa : null,
      selectedPrecio : null,
      selectedManzana : null,
      selectedLote: null,
      selectedInmueble : null,
      hayClientesSinOfertas : false,
      oferta:"",
      cuenta:"",
      inmuebleSaldo:"",
      nombreCliente:"",
      afiliacion : '',
      cliente : '',
      numerointerior: '',
      numeroexterior: '',
      departamento: false,
      montocredito : '',
      precio : '',
      inmueble : '',
      afiliacionOk: false,
      afiliacionNoChecar : false,
      prospectoNoChecar : false,
      manzana : '',
      lote : '',
      apartado : '',
      prospecto : '',
      cuantosprecios : 0,
      gastosadministrativos: '',
      precioseguro: '',
      prerecibo: '',
      prereciboadicional: '',
      anticipocomision: '',
      precalificacion: '',
      avaluo: '',
      subsidio: '',
      pagare: '',
      cuantosInmueblesDisponibles: 0,
      sumaCheca : false,
      precioRaw : null
    });
  },

	
	setupController(ctrlr, model) {
   // set(ctrlr,"model", model.gtevdor); 
    set(ctrlr, "etapasofertas", model.etapasoferta);
    set(ctrlr, "preciosinmuebles", model.preciosinmueble);
    set(ctrlr, "manzanasdisponibles", model.manzanasdisponible);
    const reservados = get(ctrlr,"reservados");
    if ( reservados > 0 ){
      set(ctrlr,"flagLista", true);
      
    }

    
  },

  model() {
    var store = this.store;
    
    store.unloadAll("etapasoferta");
   
    return Ember.RSVP.hash({
      gtevdor : store.find('zenversion',1),
      etapasoferta: store.findAll('etapasoferta'),
      preciosinmueble: store.findAll('preciosinmueble'),
      manzanasdisponible:store.findAll("manzanasdisponible")

    });
    
      
  },
  
  actions: {
    error(error, transition){
      info("se fue por aqui en ofertaasignacion");
      this.transitionTo("index");
    },
    willTransition(transition){
      var controller = this.controllerFor(this.routeName);
      var adonde = transition.targetName;
      if ( adonde.indexOf("cliente") !== -1 ){

      } else {
        try {
          controller.send("descartaInmueble");
          //controller.send("descartaProspecto");
        } catch (error) {
          info(error.message);
        }
      }   
      controller.get("inmueblesReservados.content").clear();
      //controller.get("prospectosReservados.content").clear();
      return true;
    }
  }
});
