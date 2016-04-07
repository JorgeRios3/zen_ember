import Ember from 'ember';

const {
  get,
  set,
  observer,
  setProperties,
  getProperties,
  Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  enganche: false,
  mostrarBoton: false,

  cambioEnganche: observer('enganche', function() {
  	info('cambio enganche', get(this, 'enganche'))
  	set(this, 'mostrarBoton', true);
  	this.send('pedir');
  }),
  actions: {
  	pedir() {
  	  let enganche = ""
  	  if( get(this, 'enganche') === true) {
  	    enganche = get(this, 'enganche')
  	  }
  	  this.store.query('ventascuadroarcadia', { enganche })
  	  .then((data)=> {
  	    let ventascuadro = Ember.A();
        let llaves = ['mes'];
        let titleCols = ['Mes'];
        let alignments = ['left'];
        let year = get(data, 'meta.maxyear')
        for (let i = 2000; i <= year; i++){
          llaves.push(`a${i}`);
          titleCols.push(i);
          alignments.push('right');
        }
        data.forEach((item)=> {
          ventascuadro.pushObject(getProperties(item, llaves));
        });
        setProperties(this, {
          titleCols,
          alignments,
          ventascuadro
        });
      });
  	  set(this, 'mostrarBoton', false);
  	},
  	error(errro) {
  	  info("aqui truena", error);
  	}
  }
});
