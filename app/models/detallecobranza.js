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
  montoCredito: attr('string'),
  montoSubsidio: attr('string'),
  sumanDocumentos: attr('string'),
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
  sumanDocumentosFormateado: computed('sumanDocumentos', {
    get() {
      return this.formatter('sumanDocumentos');
    }
  }),
  montoCreditoFormateado: computed('montoCredito', {
    get() {
      return this.formatter('montoCredito');
    }
  }),
  montoSubsidioFormateado: computed('montoSubsidio', {
    get() {
      return this.formatter('montoSubsidio');
    }
  })
});
