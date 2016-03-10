import Ember from 'ember';
const {
  get,
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['title-formatter'],
  attributeBindings: ['title', 'intro'],
  
  title: computed("name", {
    get(){
      var titles = {
      prospecto: "Prospecto",
      oferta: "Oferta",
      ofertaasignacion:"Ubicación",
      cancelacion: "Cancelaci&oacute;n",
      caracteristica: "Característica",
      printers: "Impresoras",
      tramite: "Trámite",
      resumenoperativo: "Resumen",
      mantenimientoprecios: "Precios",
      desasignacion: "Desasignación",
      cliente: "Cliente",
      showversion: "Versión",
      inmueble:"Inmueble",
      estadocuenta:"Estado",
      ofertaventa:"Venta",
      pagares:"Pagar&eacute;s",
      consultatramite:"Gestión"
      };
      return  titles[get(this,'name')].htmlSafe();
    }
  }),
  
  intro: computed("name",{
    get(){
      var intros = {
      prospecto: "Prospectos de venta",
      oferta: "Oferta de Compra",
      ofertaasignacion:"Asignación de inmueble al cliente",
      cancelacion: "Cancelaci&oacute;n de Cuenta y Oferta",
      caracteristica: "Caracter&iacute;sticas en inmuebles",
      printers: "Impresoras y Correo Electr&oacute;nico",
      tramite: "Tr&aacute;mites de inmuebles",
      resumenoperativo: "Resumen Operativo",
      mantenimientoprecios:"Precios de inmuebles",
      cliente: "Clientes",
      desasignacion: "Desasignación de inmuebles",
      showversion: "Versión",
      inmueble:"Inmueble",
      estadocuenta:"Estado de Cuenta",
      ofertaventa:"Reporte de Ventas",
      pagares:"Consulta de Cartera Pagar&eacute;s",
      consultatramite:"Gestión de Tramites Inmuebles"
      };
      return  intros[get(this,'name')].htmlSafe();
    }
  })
});
