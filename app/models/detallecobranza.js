import DS from 'ember-data';
import Ember from 'ember';

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
  montocredito: attr('string'),
  montosubsidio: attr('string'),
  sumandocumentos: attr('string'),
  saldo: attr('string'),
  imss: attr('string'),
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
  saldoFormateado: computed('saldo', {
    get() {
      return this.formatter('saldo');
    }
  }),
  sumanDocumentosFormateado: computed('sumandocumentos', {
    get() {
      return this.formatter('sumandocumentos');
    }
  }),
  montoCreditoFormateado: computed('montocredito', {
    get() {
      return this.formatter('montocredito');
    }
  }),
  montoSubsidioFormateado: computed('montosubsidio', {
    get() {
      return this.formatter('montosubsidio');
    }
  })
});
