import Ember from 'ember';

const {
  get,
  set,
  Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  etapas: [{ id:1, nombre:'etapa 1' },{ id:2, nombre:'etapa 2' }, { id:3, nombre:'etapa 3' }, { id:4, nombre:'etapa 4' }],
  titleCols: ['Inmueble', 'Manzana', 'Lote', 'Cuenta', 'Cliente', 'Nombre'],
  alignments: ['left', 'left', 'left', 'left', 'left', 'left', 'left'],
  listaLotes: null,

  actions: {
    selectedEtapa(item) {
      info(get(item, 'id'));
      let lista = Ember.A();
      let etapa = get(item, 'id');
      this.store.unloadAll('inmueblearcadia');
      this.store.query('inmueblearcadia', { etapa })
      .then((data)=> {
      	data.forEach((item)=> {
      	  let { inmueble, etapa, manzana, lote, cuenta, cliente, nombre } = item.getProperties(['inmueble', 'manzana', 'lote', 'cuenta', 'cliente', 'nombre']);
      	  lista.pushObject({ inmueble, lote, manzana, cuenta, cliente, nombre });
      	});
      });
      set(this, 'listaLotes', lista);
    }
  }
});
