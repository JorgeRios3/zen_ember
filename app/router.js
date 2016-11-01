import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('spinkit');
  this.route('loading');
  this.route('login');
  this.route('showversion');
  this.route('gravatar');
  this.route('informacion');
  this.route('prospecto');
  this.route('oferta');
  this.route('ubicacion');
  this.route('cancelacion');
  this.route('tramit');
  this.route('tramite');
  this.route('buscarprospecto');
  this.resource('printers', function() {
    
    this.resource('printers.printer',{
      "path": ":printer_id"
    });
  });
  this.route('cliente');
  this.route('buscarcliente');
  this.route('caracteristica');
  this.route('ofertasrecientes');
  this.route('resumenoperativo');
  this.route('ofertaasignacion');
  this.route('mantenimientoprecios');
  this.route('cancelaciones');
  this.route('desasignacion');
  this.route('changepassword');
  this.route('inmueble');
  this.route('estadocuenta');
  this.route('twofactorlogin');
  this.route('ofertaventa');
  this.route('pagares');
  this.route('consultatramite');
  this.route('ordenarmenu');
  this.route('ventasporsemana');
  this.route('ventaspordia');
  this.route('panorama');
  this.route('cobradasporsemana');
  this.route('matriztramites');
  this.route('detallecobranza');
  this.route('arcadialotesdisponibles');
  this.route('arcadiaventascuadro');
  this.route('cuentasbancarias');
  this.route('solicitudes');
  this.route('situacionfinancieraobras');
  this.route('logusuariosrutas');
  this.route('conteomedios');
  this.route('estimacionpagos');
  this.route('xmenu');
  this.route('hipotecaria');
  this.route('pruebagrafica');
  this.route('mediospublicitarios');
  this.route('vendedores');
  this.route('asignadasporsemana');
  this.route('preciosubicacion');
  this.route('arcadiavendidos');
  this.route('arcadialotespagados');
  this.route('arcadiacarteravencida');
  this.route('arcadiaresumencobranza');
  this.route('arcadiaanalisiscartera');
  this.route('xvendedor');
  this.route('referenciasrapcuenta');
  this.route('revinculacion');
  this.route('arcadiainmuebles');
  this.route('autorizaciondescuento');
  this.route('consultadescuentos');
  this.route('comisionestadocuenta');
  this.route('pagoscomisiones');
  this.route('comisionesporvendedor');
  this.route('comisioncompartida');
  this.route('distribucioncomision');
  this.route('solicitudcheque');
  this.route('solicitudesfondeo');
});

export default Router;
