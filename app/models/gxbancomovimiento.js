import DS from 'ember-data';
import FormatterMixin from '../mixins/formatter';
const {
  computed,
  get
} = Ember;

export default DS.Model.extend(FormatterMixin,{
  fecha: DS.attr('string'),
  nombrebanco: DS.attr('string'),
  cantidad: DS.attr('number'),
  referencia: DS.attr('string'),
  estatus: DS.attr('string'),
  clasificado: DS.attr('string'),
  tipo: DS.attr('string'),
  eliminado: DS.attr('string'),
  banco: DS.attr('number'),
  empresa: DS.attr('number'),
  cantidadComas: computed('cantidad', {
    get() {
      return this.formatter(get(this, 'cantidad'));
    }
  }),
  isClasificadoEliminado: computed('clasificado', {
  	get() {
  	  if (get(this, 'clasificado') === 'N' && get(this, 'eliminado') === 'N') {
  	    return false;
  	  } else {
  	  	return true;
  	  }
  	}
  }),
});
