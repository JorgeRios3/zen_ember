import Ember from 'ember';


const {
  get,
  set,
  observer,
  computed,
  isEmpty,
  Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  session:Ember.inject.service(),
  disponible:false,
  selectedEtapa:'',
  listaInmuebles:'',
  desplegarResultado:false,
  buscarActivado:computed('selectedEtapa',{
    get(){
      return parseInt(get(this, 'selectedEtapa'))>0;
    }
  }),

  actions: {
    selectedEtapaAction(item) {	
	  set(this, 'selectedEtapa', get(item, 'id'));
    },
    buscar() {
      set(this, 'desplegarResultado', true);
      let that=this;
      var hash={ etapa: get(this, 'selectedEtapa') };
      if (get(this, 'disponible')) {
        hash.disponible=1;
      }
	  set(this, 'listaInmuebles',this.store.query('inmuebledetalle', hash));
	}
  }
});
