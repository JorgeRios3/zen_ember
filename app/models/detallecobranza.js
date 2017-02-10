import DS from 'ember-data';
import Ember from 'ember';
// import Intl from 'intl';

const {
  computed,
  get,
  isEmpty
} = Ember;

const {
  attr
} = DS;

export default DS.Model.extend({
  manzana: attr('string'),
  lote: attr('string'),
  fecha: attr('string'),
  fechaPreliberacion: attr('string'),
  nota: attr('string'),
  oferta: attr('string'),
  montocredito: attr('money'),
  montosubsidio: attr('money'),
  sumandocumentos: attr('money'),
  saldo: attr('money'),
  imss: attr('string'),
  inmueble: attr('number'),
  institucion: attr('string'),
  numerocredito: attr('string')
  /*
  formatter(key) {
    let value = get(this, key);
    if (isEmpty(value)) {
      return value;
    }
    let i10nUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    let formatted = i10nUSD.format(value);
    let index = formatted.indexOf('$');
    return index >= 0 ? formatted.substring(index + 1) : formatted;
  },
  */
});
