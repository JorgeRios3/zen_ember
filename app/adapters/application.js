import DS from 'ember-data';
import Ember from 'ember';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const {
  Inflector: { inflector }
} = Ember;

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  namespace: 'api',
  authorizer: 'authorizer:oauth2'
});
const many = 'etapas prospectos clientes clientessin'.w();
many.forEach((one)=> {
  inflector.irregular(`${one}oferta`, `${one}ofertas`);
});
inflector.irregular('oferta', 'ofertas');
inflector.irregular('comisionventa', 'comisionventas');
inflector.irregular('parametrosetapa', 'parametrosetapas');
inflector.irregular('chilpayate', 'hijos');
inflector.irregular('referenciasrapconclientesincuenta', 'referenciasrapconclientesincuentas');
inflector.irregular('ventaspordia', 'ventaspordias');
inflector.irregular('panorama', 'panoramas');
inflector.irregular('lotesdisponiblesarcadia', 'lotesdisponiblesarcadias');
inflector.irregular('vendedoresarcadia', 'vendedoresarcadias');
inflector.irregular('clientesarcadia', 'clientesarcadias');
inflector.irregular('vendidosarcadia', 'vendidosarcadias');
inflector.irregular('lotesindividualesarcadia', 'lotesindividualesarcadias');
inflector.irregular('ventascuadroarcadia', 'ventascuadroarcadias');
inflector.irregular('cuentabancaria', 'cuentabancarias');
inflector.irregular('solicitud', 'solicitudes');
inflector.irregular('situacionfinacieraobra', 'situacionfinacieraobras');
inflector.irregular('logusuarioruta', 'logusuariorutas');
inflector.irregular('cuentabreve', 'cuentabreves');
inflector.irregular('hipotecaria', 'hipotecarias');
inflector.irregular('lotespagadosarcadia', 'lotespagadosarcadias');
inflector.irregular('carteravencidaarcadia', 'carteravencidaarcadias');
inflector.irregular('resumencobranzaarcadia', 'resumencobranzaarcadias');
inflector.irregular('analisiscarteraarcadia', 'analisiscarteraarcadias');
inflector.irregular('gixanip', 'gixanips');
inflector.irregular('referenciasrapcuenta', 'referenciasrapcuentas');
inflector.irregular('validaafiliacion', 'validaafiliacions');
inflector.irregular('transicionprospecto', 'transicionprospectos');
inflector.irregular('inmueblearcadia', 'inmueblearcadias');
inflector.irregular('autorizaciondescuento', 'autorizaciondescuentos');
inflector.irregular('etapaenautorizacion', 'etapaenautorizacions');
inflector.irregular('documentocuenta', 'documentocuentas');
inflector.irregular('etapacomisioncompartida', 'etapacomisioncompartidas');
inflector.irregular('empresasolicitud', 'empresasolicituds');
inflector.irregular('gxsolicitudchequedetalle', 'gxsolicitudchequedetalles');
inflector.irregular('gxsolicitudchequemaestroclon', 'gxsolicitudchequemaestroclons');
inflector.irregular('inmueblesconcuenta', 'inmueblesconcuentas');
inflector.irregular('blogentry', 'blogentries');
inflector.irregular('terrenovendidoarcadia', 'terrenovendidoarcadias');
inflector.irregular('solicitudfirmante', 'solicitudfirmantes');
inflector.irregular('solicitudfondeo', 'solicitudfondeos');
inflector.irregular('zenrapcuenta', 'zenrapcuentas');
inflector.irregular('inmueblesvendidosdescuento', 'inmueblesvendidosdescuentos');
inflector.irregular('zenmenuitemsuspendido', 'zenmenuitemsuspendidos');
inflector.irregular('asignacionesreporte', 'asignacionesreportes');
inflector.irregular('preciosdescuento', 'preciosdescuentos');
inflector.irregular('caracteristica', 'caracteristicas');
inflector.irregular('zenpreciooriginal', 'zenpreciooriginals');
inflector.irregular('zenhipotecaria', 'zenhipotecarias');
inflector.irregular('cuentaarcadia', 'cuentaarcadias');
inflector.irregular('zenrecibo', 'zenrecibos');
