import Ember from 'ember';

const {
	observer,
	get,
	set,
	Logger: { info },
	computed
} = Ember;

export default Ember.Controller.extend({
  selectedTipo: '1',
  options: null,
  options2: null,
  init() {
    this._super(...arguments);
    set(this, 'tipo', Ember.ArrayProxy.create({ content: [{ id: 2, nombre: 'Ventas totales por dia' }] }));
  },
  tipoSeleccionado: observer('selectedTipo', function() {
    this.send('consultar');
  }),
  tipoPromedio: computed.equal('selectedTipo', '1'),
  actions: {
    consultar() {
      let datos = Ember.A();
      let objeto = {};
      datos.push(['Dia', 'Valores']);
      	objeto.tipo = get(this, 'selectedTipo');
      this.store.query('ventaspordia', objeto).then((data)=> {
        data.forEach((item)=> {
          datos.push([ get(item, 'dia'), get(item, 'valor')]);
        });
        set(this, 'model', datos);
      });
    }
  }
});
