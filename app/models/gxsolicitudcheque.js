import DS from 'ember-data';
import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
const {
  computed,
  get
} = Ember;

export default DS.Model.extend(FormatterMixin,{
  fechacaptura: DS.attr('string'),
  fechaprogramada : DS.attr('string'),
  numerochequeorigen: DS.attr('number'),
  cantidad: DS.attr('number'),
  nombrebeneficiario: DS.attr('string'),
  razonsocial: DS.attr('string'),
  estatus: DS.attr('string'),
  estatusdescripcion: DS.attr('string'),
  usuariosolicitante: DS.attr('string'),
  nombrecliente: DS.attr('string'),
  devolucion: DS.attr('string'),
  nombreReal: computed('devolucion', {
    get() {
      return get(this, 'devolucion') === 'S' ? get(this, 'nombrecliente') : get(this, 'nombrebeneficiario');
    }
  }),
  esCliente: computed('devolucion', {
    get() {
      return get(this, 'devolucion') === 'S';
    }
  }),
  cantidadComas: computed('cantidad', {
    get() {
      return this.formatter(get(this, 'cantidad'));
    }
  })
});
