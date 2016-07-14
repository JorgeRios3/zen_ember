import Ember from 'ember';
const {
  get,
  set,
  Logger: { info },
  observer
} = Ember;

export default Ember.Controller.extend({
  selectedEtapa: '',
  listaCodigos: '',
  mensaje: '',
  comentario: '',
  observaetapa: observer('selectedEtapa', function() {
  	info('por etapa ',get(this, 'selectedEtapa'));
  }),
  actions: {
  	procesaAutorizacion(item) {
  	  info(get(item, 'comentario'));
  	  set(this, 'comentario', get(item, 'comentario'));
  	},
  	pedir() {
  	  let lista = Ember.A();
  	  let todos = get(this, 'todos') === true ? true : '';
  	  let concuenta = get(this, 'concuenta') === true ? true: '';
  	  let etapa = get(this, 'selectedEtapa');
  	  this.store.query('autorizaciondescuento', { etapa, todos, concuenta })
  	  .then((data)=> {
  	  	if (get(data, 'length')) {
  	  	  data.forEach((item)=> {
  	  	  	info('empujando objeto');
  	  	    let { autorizacion, inmueble, descuento, cuenta, vigente, usuarionombre, comentario } = item.getProperties(['autorizacion', 'inmueble', 'descuento', 'cuenta', 'vigente', 'usuarionombre', 'comentario']);
  	  	    lista.pushObject({ autorizacion, inmueble, descuento, cuenta, vigente, usuarionombre, comentario });
  	  	  });
  	  	  set(this, 'listaCodigos', lista);
  	  	} else {
  	  	  set(this, 'mensaje', 'No se encontraron resultados');
  	  	}
  	  });
  	}
  }
});
