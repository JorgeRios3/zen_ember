import Ember from 'ember';

const {
 get,
 set,
 Logger: { info },
 getProperties,
 setProperties
} = Ember;

export default Ember.Controller.extend({
  listaEstatus: [{ 'label':'activo', 'valor':'true' }, { 'label':'Desactivado', 'valor':'false' }],
  actions: {
    buscar() {
      let etapa = get(this, 'selectedEtapa');
      let activo = get(this, 'selectedEstatus');
      this.store.query('preciosinmueble', { etapa, activo })
      .then((data)=> {
        set(this, 'listaPrecios', data);
      });
    }
  }
});
