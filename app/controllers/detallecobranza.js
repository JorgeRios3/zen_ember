import Ember from 'ember';
import moment from 'moment';

const {
	observer,
	get,
	set,
	Logger: { info },
	computed,
	getProperties,
	setProperties
} = Ember;
export default Ember.Controller.extend({
  selectedEtapa: '',
  selectedTipo: '',
  nullFechaInicial: null,
  nullFechaFinal: null,
  fechaInicial: '',
  fechaFinal: '',
  total: '',
  totDocumentos: null,
  totMontoCredito: null,
  totMontoSubsidio: null,
  tipocobradas: computed.equal('selectedTipo', 'X'),
  inmuebles: null,
  init() {
    this._super(...arguments);
    set(this, 'tipos', Ember.ArrayProxy.create({ content: [{ valor: 'C', nombre: 'Cotejadas' }, { valor: 'F', nombre: 'Firma sin cotejo' },
	{ valor: 'E', nombre: 'En firma' }, { valor: 'I', nombre: 'Ingresadas' }, { valor: 'P', nombre: 'Por ingresar' }, { valor: 'S', nombre: 'Solicitados por cerrar' },
	{ valor: 'A', nombre: 'Asignados por solicitar' }, { valor: 'X', nombre: 'Cobradas' }, { valor: 'T', nombre: 'Taller infonavit' }] }));
  },
  etapaSeleccionada: observer('selectedEtapa', function() {
    info('valor de etapaseleccionada', get(this, 'selectedEtapa'));
  }),
  tipoSeleccionado: observer('selectedTipo', function() {
    info('valor de selectedTipo', get(this, 'selectedTipo'));
    for (let key of 'totMontoCredito totMontoSubsidio totDocumentos'.w()) {
      set(this, key, '');
    }
  }),

  observaFechas: observer('fechaInicial', 'fechaFinal', function() {
    let finicial = moment(get(this, 'fechaInicial')).format('YYYY/MM/DD');
    let ffinal = moment(get(this, 'fechaFinal')).format('YYYY/MM/DD');
    info(`${finicial}, ${ffinal}`);
  }),

  actions: {
    pedir() {
      let objeto = {};
      if (get(this, 'tipocobradas')) {
        objeto.fechaincial = moment(get(this, 'fechaInicial')).format('YYYY/MM/DD');
        objeto.fechafinal = moment(get(this, 'fechaFinal')).format('YYYY/MM/DD');
      }
      objeto.etapa = get(this, 'selectedEtapa');
      objeto.tipo = get(this, 'selectedTipo');
      this.store.query('detallecobranza', objeto)
      .then((data)=> {
        let totMontoCredito = get(data, 'meta.totmontocredito');
        // info('totMontoCredito ', totMontoCredito);
        let totMontoSubsidio = get(data, 'meta.totmontosubsidio');
        let totDocumentos = get(data, 'meta.totdocumentos');
        setProperties(this, { totDocumentos, totMontoCredito, totMontoSubsidio });
        set(this, 'inmuebles', data);
      }, (error)=> {

      });
    }
  }
});