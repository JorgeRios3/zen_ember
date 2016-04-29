import Ember from 'ember';

const {
  get,
  set,
  observer,
  isEmpty,
  Logger: { info }
} = Ember;
let evaluaFecha = '';
export default Ember.Controller.extend({
  comparativo: false,
  nullFechaInicial: null,
  fechaInicial: '',
  datos: null,
  fechaInicialActual: '',
  fechaFinalActual: '',
  fechaInicialPrevia: '',
  fechaFinalPrevia: '',
  prospectos: false,
  observaFecha: observer('fechaInicial', function() {
    let fInicial = get(this, 'fechaInicial');
    let fechainicial = !isEmpty(fInicial) ? fInicial.format('YYYY/MM/DD') : '';
    if(evaluaFecha) {

    }
    this.no
    info(fechainicial);
    evaluaFecha = fechainicial;
    this.notifyPropertyChange('comparativo');
  }),

  observaComparativo: observer('comparativo', 'prospectos', function() {
  	info('entro en observer');
    let prospectos = get(this, 'prospectos');
    let prospectosQuery = ''
    if(prospectos) {
      prospectosQuery = 1;
    }
  	let lista = [];
  	this.store.unloadAll('mediopublicitario');
  	let fInicial = get(this, 'fechaInicial');
    let fechainicial = !isEmpty(fInicial) ? fInicial.format('YYYY/MM/DD') : '';
    let comparativo = get(this, 'comparativo');
    this.store.query('mediopublicitario', { fecha: fechainicial, prospectos: prospectosQuery }).then((data)=> {
      if(comparativo) {
      	info('se fue por comparativo');
        set(this, 'fechaInicialActual', get(data, 'meta.fechainicialactual'));
        set(this, 'fechaFinalActual', get(data, 'meta.fechafinalactual'));
        set(this, 'fechaInicialPrevia', get(data, 'meta.fechainicialprevia'));
        set(this, 'fechaFinalPrevia', get(data, 'meta.fechafinalprevia'));
        lista.push(['Medios Publicitarios', 'Semana', 'Semana Anterior']);
        data.forEach((item)=> {
          let descripcion = get(item, 'descripcion');
          let actual = get(item, 'actual');
          let previa = get(item, 'previa')
          lista.push([descripcion, actual, previa])
        });
        set(this, 'datos', lista);

      } else {
      	info('se fue sin comparativo');
        set(this, 'fechaInicialActual', get(data, 'meta.fechainicialactual'));
        set(this, 'Actual', get(data, 'meta.fechafinalactual'));
        set(this, 'fechaInicialPrevia', '');
        set(this, 'fechaFinalPrevia', '');
        lista.push(['Medios Publicitarios', 'Semana']);
        data.forEach((item)=> {
          let descripcion = get(item, 'descripcion');
          let actual = get(item, 'actual');
          lista.push([descripcion, actual])
        });
         set(this, 'datos', lista);

      }
    });

  })
});
