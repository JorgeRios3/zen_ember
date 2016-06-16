import Ember from 'ember';
const {
	get,
	set,
	getProperties,
	isEmpty,
	Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  listaInmuebles: null,
  mostrarModal: false,
  selectedInmueble: '',
  manzanaInmueble: '',
  loteInmueble: '',
  precioPorMetroInmueble: '',
  lotesdisponibles: null,
  superficieInmueble: '',
  nuevoValor: '',
  record: null,
  hayInmuebles: Ember.computed.gt('listaLength', 0),
  listaLength: '',
  actions: {
    selectedEtapa(etapa) {
      let contador = 0;
      let listaInmuebles = Ember.A();
      this.store.unloadAll('lotesindividualesarcadia');
      let p = this.store.query('lotesindividualesarcadia', { etapa, tipo: 'D' });
      set(this, 'listaInmuebles', p);
      /*this.store.query('lotesindividualesarcadia', { etapa, tipo: 'D' }).then((data)=> {
  	    data.forEach((item)=> {
  	    	let { id, manzana, lote, inmueble, preciopormetro, superficie } = item.getProperties(['id', 'manzana', 'lote', 'inmueble', 'preciopormetro', 'superficie']);
  	    	listaInmuebles.pushObject({ id, manzana, lote, inmueble, preciopormetro, superficie });
  	    })
  	  });
  	  set(this, 'listaInmuebles', listaInmuebles);*/
    },
    levantarModel(inmueble) {
      info(get(inmueble, 'id'), get(inmueble, 'inmueble'));
      let record = get(this, 'listaInmuebles').findBy('id', get(inmueble, 'id'));
      set(this, 'record', record);
      this.setProperties({
        selectedInmueble: get(record, 'inmueble'),
        manzanaInmueble: get(record, 'manzana'),
        loteInmueble: get(record, 'lote'),
        precioPorMetroInmueble: get(record, 'preciopormetro'),
        superficieInmueble: get(record, 'superficie'),
        nuevoValor: get(record, 'preciopormetro')
      });
      this.toggleProperty('mostrarModal');
    },
    ok() {
      if (isEmpty(get(this, 'nuevoValor'))) {
        info('no tienen valor');
        return;
      }
      let lotesdisponibles = Ember.A();
      let record = get(this, 'record');
      set(record, 'preciopormetro', get(this, 'nuevoValor'));
      record.save().then(()=> {
        info('se grabo');
        set(this, 'nuevoValor', '');
        set(this, 'lotesdisponibles', this.store.findAll('lotesdisponiblesarcadia', { reload: true }));
      }, (error)=> {
        info('se fue por el error de la promesa');
      });
    }
  }
});
