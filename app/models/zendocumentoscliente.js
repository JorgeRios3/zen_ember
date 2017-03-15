import DS from 'ember-data';

const {
	get,
	set,
	computed
} = Ember;

export default DS.Model.extend({ 
  descripcion: DS.attr("string"),
  cargo: DS.attr("string"),
  abono: DS.attr("string"),
  fecha: DS.attr("string"),
  saldo: DS.attr("string"),
  elegido: DS.attr("boolean", {default : false}),
  fechavencimiento: DS.attr('string'),
  diasvencimiento: DS.attr('number'),
  tipo: DS.attr('number'),
  saldoNumber: computed('saldo', {
    get() {
    let saldo = get(this, 'saldo');
    saldo = saldo.replace(",", "");
    return Number(saldo)
    }
  }),
  documentoVencido:computed('diasvencimiento', {
  	get() {
  	  if(get (this, 'diasvencimiento') > 0) {
  	    return true;
  	  } else {
	    return false;
	  }
	}
})
  
});
