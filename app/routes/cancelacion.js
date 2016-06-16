import Ember from 'ember';
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";
const info = Ember.Logger.info;
const {
	set,
    Route
}= Ember;


export default Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{

  setupController(ctrl, model) {
  	set(ctrl, 'etapas', model.etapas);
  },

  beforeModel2(){
    //this._super(...arguments);
    var controller = this.controllerFor(this.routeName);

    controller.setProperties({
        selectedEtapa: null, 
        selectedDoc: null,
        catalogoNombres: "",
        docsCliente: "",
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
        huboErrorAlImprimir: false,
        huboErrorAlImprimir1: false,
        muestraOpcionesImpresion: false,
        copiasDocsCliente: 1,
        copiasCancelacion: 1,
        enviarEmail: false,
        soloEmail: false,
        huboErrorAlGrabar: false,
        muestroErrores: false,
        cuantos:"",
    });
  },

  model() {
    var store = this.store;
      
    return Ember.RSVP.hash({
    	etapas: store.findAll('etapastramite', {reload: true})
    });
  },
  actions:{
    error(error){
        info("entre en error con domingo",error);
    }
  }

});
