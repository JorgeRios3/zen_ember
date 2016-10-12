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
