import Ember from 'ember';
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const {
  get,
  set,
  computed,
  observer,
  isEmpty
}= Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin,
{
	
	setupController(ctrlr, model) {
    
    ctrlr.setProperties({
      model:model.model,
      apGerentesventas:model.gerentesventa,
      apVendedors:model.vendedor,
      apMediospublicitarios:model.mediospublicitario,
      apProspectosrecientes:model.prospectosreciente
    })
    
  },

  beforeModel(transition){
    this._super(...arguments);
    var controller = this.controllerFor(this.routeName);

    controller.setProperties({
        mediopublicitario: null,
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
        fechadenacimiento:"",
        nullfechadenacimiento:"",
        afiliacionOk: false,
        afiliacion: "",
        rfcValido: false,
        muestroErrores: false,
        cuantosvendedores : 0,
        selectedMedio: null,
        selectedGerente: null,
        selectedVendedor: null,
        tipoCuenta : "infonavit",
    });
  },


   model() {
     var store = this.store;
      
    return Ember.RSVP.hash({
       model:store.find('gtevdor',1),
       gerentesventa:store.findAll('gerentesventa'),
       vendedor:store.findAll('vendedor'),
       mediospublicitario:store.findAll('mediospublicitario'),
       prospectosreciente:store.findAll('prospectosreciente')
    });
  }
});
