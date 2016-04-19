import Ember from 'ember';
const {
	get,
	set,
	observer,
	computed,
	Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  listaUsuarios: null,
  selectedUsuario: 0,
  listaTabla:null,
  titleCols: ['Usuario', 'Timestamp', 'Ruta', 'Intro'],
  observaSelectedusuario: observer('selectedUsuario', function() {
  	this.store.unloadAll('logusuarioruta');
  	let lista = Ember.A();
    this.store.query('logusuarioruta', { usuario: get(this, 'selectedUsuario') })
    .then((data)=> {
    	data.forEach((item)=> {
    	  let record= {};
    	  record = {usuario: get(item, 'usuario'), timestamp: get(item, 'timestamp'), ruta: get(item, 'ruta'), intro: get(item, 'intro')};
    	  lista.pushObject(record);
    	});
    	set(this, 'listaTabla', lista);
    });
  }),
});
