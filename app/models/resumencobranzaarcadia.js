import DS from 'ember-data';
import FormatterMixin from '../mixins/formatter';

const {
	observer,
	get,
	set,
	computed,
	Logger: { info }
} = Ember;

export default DS.Model.extend(FormatterMixin, {
  rubro: DS.attr('string'),
  enganche: DS.attr('string'), 
  ocurrenciasenganche: DS.attr('string'),
  porcentajeenganche: DS.attr('string'),
  pagos: DS.attr('string'),
  ocurrenciaspagos: DS.attr('string'),
  porcentajepagos: DS.attr('string'),
  total: DS.attr('string'),

  suma: computed('rubro', {
    get() {
      if (parseInt(get(this, 'rubro')) < 2000){
        info('se fue por aqui');
        let a = get(this, 'enganche').replace(",","");
        a = parseFloat(a);
        let b = get(this, 'pagos').replace(",","");
        b = parseFloat(b);
        let suma = a + b;
        suma = this.formatter(suma, 2, '.', ',', false);
        info('valor de suma', suma);
        return suma;
      }
    }
  })
});
