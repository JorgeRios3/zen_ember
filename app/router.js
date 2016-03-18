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
});

export default Router;
