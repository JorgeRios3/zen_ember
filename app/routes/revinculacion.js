import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  RSVP: { hash },
  Logger: { info },
  get,
  set
} = Ember;

/*

const ROUTE = 'prospecto';
const whereIAm = (argz) => info(`at ${ROUTE} ${argz.callee.toString()}`);

function getFunctionName() {
  let re = /function (.*?)\(/;
  let s = getFunctionName.caller.toString();
  let m = re.exec(s);
  info(m[1]);
}

*/

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin,
{
  setupController(ctrlr, model) {
    // let where = arguments.callee.toString();
    // whereIAm(arguments);
    // let { gtevdor, gerentesventas: apGerentesventas,  vendedor: apVendedors, mediospublicitario: apMediospublicitarios, prospectosreciente: apProspectosrecientes } = model;
    let { gtevdor, gerentesventa: apGerentesventas, vendedor: apVendedors, mediospublicitario: apMediospublicitarios, afiliacionesdisponible } = model;
    /*
    info('apGerentesventas', get(apGerentesventas, 'length'));
    info('apVendedors', get(apVendedors, 'length'));
    info('apMediospublicitarios', get(apMediospublicitarios, 'length'));
    info('gtevdor', gtevdor);
    info(new Error().stack);
    */
    let gerente = get(gtevdor, 'idgerente');
    let vendedor = get(gtevdor, 'idvendedor');
    if (gerente !== 0 && vendedor !== 0) {
      info('tiene gerente y vendedor');
      set(ctrlr, 'selectedGerente', gerente);
      set(ctrlr, 'selectedVendedor', vendedor);
    }
    info(get(afiliacionesdisponible, 'disponibles'));
    ctrlr.setProperties({
      gtevdor,
      apGerentesventas,
      apVendedors,
      apMediospublicitarios,
      afiliacionDisponible: get(afiliacionesdisponible, 'disponibles')
    });
  },
  beforeModel(transition) {
    this._super(...arguments);
    // getFunctionName();
    // info(new Error().stack);
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      mediopublicitario: null,
      rfc: '',
      apellidopaterno: '',
      apellidomaterno: '',
      gerenteVendedor: '',
      gtevdor: '',
      nombre: '',
      curp: '',
      prospecto: '',
      curpValido: false,
      telefonocasa: '',
      telefonotrabajo: '',
      telefonotrabajoextension: '',
      telefonocelular: '',
      fechanacimiento: '',
      fechadenacimiento: '',
      nullfechadenacimiento: '',
      afiliacionOk: false,
      afiliacion: '',
      rfcValido: false,
      muestroErrores: false,
      cuantosvendedores: 0,
      selectedMedio: null,
      selectedGerente: null,
      selectedVendedor: null,
      tipoCuenta: 'infonavit',
      mediopublicitariosugerido: ''
    });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return hash({
      gtevdor: store.findRecord('gtevdor', 1),
      gerentesventa: store.findAll('gerentesventa', reload),
      vendedor: store.findAll('vendedor', reload),
      mediospublicitario: store.findAll('mediospublicitario', reload),
      afiliacionesdisponible: store.findRecord('afiliaciondisponible', 1)
    });
  },
  actions: {
    error(error) {
      info('error en ruta prospecto', error);
    }
  }
});
