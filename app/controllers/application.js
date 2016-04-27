import Ember from 'ember';
import config from '../config/environment';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  getProperties,
  getOwner,
  Logger: { info },
  inject: { service, controller }
} = Ember;

export default Ember.Controller.extend({
  selectedMenu: '',
  ci: controller('index'),
  session: service(),
  comodin: service(),
  currentTime: moment(),
  restante: null,
  expirationFlag: false,
  loginTime: computed.alias('comodin.loginTime'),
  opcionesMenu: computed('', {
    get() {
      let ci = get(this, 'ci');
      let listaMenu = get(ci, 'model');
      let lista = [];
      listaMenu.forEach((item)=> {
        lista.addObject({ id: item, nombre: item });
      });
      lista.addObject({ id: 'index', nombre: 'index' });
      return lista;
    }
  }),
  isDev: computed('', {
    get() {
      return config.AUTOMATIC_LOGIN;
    }
  }),
  secondsLeft: computed('currentTime', 'loginTime', {
    get() {
      let { currentTime, loginTime } = getProperties(this, 'currentTime loginTime'.w());
      if (!isEmpty(currentTime) && !isEmpty(loginTime)) {
        let loqueva = currentTime.diff(loginTime, 'minutes');
        let restante =  60 - parseInt(loqueva);
        set(this, 'restante', restante);
        return restante;
      } else {
        return 60;
      }
    }
  }),
  opciones: [{ id: 'prospecto', nombre: 'prospecto' },
    { id: 'oferta', nombre: 'oferta' },
    { id: 'ofertaasignacion', nombre: 'ofertaasignacion' },
    { id: 'cancelacion', nombre: 'cancelacion' },
    { id: 'caracteristica', nombre: 'caracteristica' },
    { id: 'printers', nombre: 'printers' },
    { id: 'tramite', nombre: 'tramite' },
    { id: 'resumenoperativo', nombre: 'resumenoperativo' },
    { id: 'mantenimientoprecios', nombre: 'mantenimientoprecios' },
    { id: 'desasignacion', nombre: 'desasignacion' },
    { id: 'cliente', nombre: 'cliente' },
    { id: 'showversion', nombre: 'showversion' },
    { id: 'inmueble', nombre: 'inmueble' },
    { id: 'estadocuenta', nombre: 'estadocuenta' },
    { id: 'ofertaventa', nombre: 'ofertaventa' }],
  perfil: computed.alias('ci.perfil'),
  usuario: computed.alias('ci.usuario'),
  perfilEsSubdireccionComercial: computed.equal('perfil', 'subdireccioncomercial'),
  perfilEsComercial: computed.equal('perfil', 'comercial'),
  perfilEsAdmin: computed.equal('perfil', 'admin'),
  perfilEsGerente: computed.equal('perfil', 'gerente'),
  perfilEsVendedor: computed.equal('perfil', 'vendedor'),
  perfilParaCliente: computed.or('perfilEsAdmin', 'perfilEsComercial', 'perfilEsSubdireccionComercial'),
  perfilEsDireccionComercial: computed.equal('perfil', 'direccioncomercial'),
  perfilEsAuxiliarSubdireccion: computed.equal('perfil', 'auxiliarsubdireccion'),
  perfilEsFinanzas: computed.equal('perfil', 'finanzas'),
  perfilEsCobranza: computed.equal('perfil', 'cobranza'),
  perfilEsDireccion: computed.equal('perfil', 'direccion'),
  perfilEsPresidencia: computed.equal('perfil', 'presidencia'),
  perfilParaCambiarPrecio: computed.or('perfilEsAdmin', 'perfilEsAuxiliarSubdireccion'),
  usuariox: 'foobarx',
  actions: {
    navigate(where) {
      this.transitionToRoute(where);
    },
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
