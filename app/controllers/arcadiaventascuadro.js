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
  totalFlag: false,
  terrenosDetalle: null,
  meses:' Ene Feb Mar Abr May Jun Jul Ago Sep Oct Nov Dic'.w(),

  cambioEnganche: observer('enganche', function() {
    info('cambio enganche', get(this, 'enganche'));
    set(this, 'mostrarBoton', true);
    this.send('pedir');
  }),
  actions: {
    detalleMesLotes(y, m) {
      info('valor de mes y año', y, m);
      let year = y;
      let month = get(this, 'meses').indexOf(m);
      this.store.unloadAll('terrenovendidoarcadia');
      set(this, 'terrenosDetalle', null);
      let lista = Ember.A();
      this.store.query('terrenovendidoarcadia', { year, month })
      .then((data)=> {
        data.forEach((item)=> {
          info('entor en el ofr ewach')
          lista.pushObject(getProperties(item, 'etapa manzana lote fecha'.w()));
        });
        info('valor de la lista')
        set(this, 'terrenosDetalle', lista);
      }, (error)=> {
        info('trono terrenovendidoarcadia');
      });
    },
    pedir() {
      let enganche = '';
      if (get(this, 'enganche') === true) {
        enganche = get(this, 'enganche');
      }
      this.store.query('ventascuadroarcadia', { enganche })
      .then((data)=> {
        let ventascuadro = Ember.A();
        let llaves = ['mes'];
        let titleCols = ['Mes'];
        let alignments = ['left'];
        let year = get(data, 'meta.maxyear');
        for (let i = 2003; i <= year; i++) {
          llaves.push(`a${i}`);
          titleCols.push(i);
          alignments.push('right');
        }
        data.forEach((item, i)=> {
          if(get(item, 'mes') === 'Total') {
            info('valor de total');
            let objeto = getProperties(item, llaves);
            objeto.total = true;
            ventascuadro.pushObject(objeto);
          } else {
            ventascuadro.pushObject(getProperties(item, llaves));
          }
        });
        setProperties(this, {
          titleCols,
          alignments,
          ventascuadro
        });
      });
      set(this, 'mostrarBoton', false);
    }
  }
});
