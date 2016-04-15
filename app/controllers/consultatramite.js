import Ember from 'ember';

const {
  set,
  get,
  observer,
  isEmpty,
  getProperties,
  Logger: { info },
  computed
} = Ember;

export default Ember.Controller.extend({
  tramitesSeleccionados2: 'impuesto predial gas luz agua seguro'.w(),
  inmueblesLista: 'uno dos tres cuatro'.w(),
  etapas: null,
  catalogoTramites: null,
  catalogoTramitesFiltrado: [],
  tramiteEnLista: false,
  todosTramites: false,
  etapaSeleccionada: '',
  encabezadoCulumnas: null,
  tramites: null,
  seleccionados: [],
  inmuebles: [],
  criterio: null,
  showComponent: false,
  sePuede: true,
  selectedTipo: '',
  criterios: [ { id: 'C', descripcion: 'Cualquiera' },
    { id: 'F', descripcion: 'Con Fecha' },
    { id: 'S', descripcion: 'Sin Fecha' }],
  tipos: [ { id: 'g', descripcion: 'Gestion' },
    { id: 'c', descripcion: 'Comercial' }],
  cuantosInmuebles: computed.alias('inmuebles.length'),
  noHayInmuebles: computed.lt('inmuebles.length', 2),
  init() {
    set(this, 'tramitesSeleccionados', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'tramitesNuevos', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'inmuebles', Ember.ArrayProxy.create({ content: [] }));
  },
  botonPedir: computed('etapaSeleccionada', 'todosTramites', {
    get() {
      return get(this, 'etapaSeleccionada') > 0 && get(this, 'todosTramites') === true ? true : false;
    }
  }),
  valorCriterio: observer('criterio', function() {
    if (get(this, 'inmuebles.length')) {
      get(this, 'inmuebles').clear();
    }
    get(this, 'tramitesSeleccionados').clear();
    get(this, 'seleccionados').clear();
    get(this, 'seleccionados').pushObject('inmueble');
    if (isEmpty(get(this, 'criterio')) || get(this, 'criterio') === 'C') {
      info('criterio cumple', get(this, 'criterio'));
      set(this, 'sePuede', true);
    } else {
      set(this, 'sePuede', false);
    }
  }),
  observaSelectedTramite: observer('selectedTramite', function() {
    info('valor de selectedTramite', get(this, 'selectedTramite'));
    if (get(this, 'sePuede') === false && get(this, 'seleccionados.length') > 1) {
      let esta = get(this, 'tramitesSeleccionados').findBy('id', get(this, 'selectedTramite'));
      info('valor de esta', esta);
      if (esta) {
        set(this, 'tramiteEnLista', true);
        return;
      }
      if (get(this, 'selectedTramite') !== null) {
        info('solo se puede escoger un tramite en con este criterio');
        get(this, 'seleccionados').removeAt(1);
        get(this, 'tramitesSeleccionados').removeAt(0);
        let cual = get(this, 'catalogoTramitesFiltrado').findBy('id', get(this, 'selectedTramite'));
        info(get(cual, 'catDescrip'));
        get(this, 'tramitesSeleccionados').pushObject(cual);
        get(this, 'seleccionados').pushObject(get(cual, 'catDescrip'));
      }
    } else {
      let esta = get(this, 'tramitesSeleccionados').findBy('id', get(this, 'selectedTramite'));
      info('valor de esta', esta);
      if (esta) {
        set(this, 'tramiteEnLista', true);
        return;
      }
      if (get(this, 'selectedTramite') !== null) {
        let cual = get(this, 'catalogoTramitesFiltrado').findBy('id', get(this, 'selectedTramite'));
        info(get(cual, 'catDescrip'));
        get(this, 'tramitesSeleccionados').pushObject(cual);
        get(this, 'seleccionados').pushObject(get(cual, 'catDescrip'));
      }
    }
  }),
  actions: {
    selectedTipoAction(item) {
      if (get(this, 'inmuebles.length')) {
        get(this, 'inmuebles').clear();
      }
      let tramites = get(this, 'catalogoTramitesFiltrado');
      tramites.clear();
      get(this, 'tramitesSeleccionados').clear();
      get(this, 'seleccionados').clear();
      get(this, 'seleccionados').pushObject('inmueble');
      info('valor de tramites', tramites);
      set(this, 'selectedTipo', item.id);
      let tipo = get(this, 'selectedTipo');
      get(this, 'catalogoTramites').forEach((item2) => {
        let a = item2;
        let t = get(item2, 'origen');
        if (tipo === t) {
          tramites.pushObject(a);
        }
      });
    },
    togglePrinterComponent() {
      this.toggleProperty('showComponent');
    },
    selectedEtapaAction(item) {
      set(this, 'etapaSeleccionada', item.id);
    },
    quitarTramite(item) {
      if (get(this, 'inmuebles.length')) {
        get(this, 'inmuebles').clear();
      }
      get(this, 'tramitesSeleccionados').removeObject(item);
      get(this, 'seleccionados').removeObject(get(item, 'catDescrip'));
    },
    enteradoInspeccionarErrores() {
      this.toggleProperty('tramiteEnLista');
    },
    pedir() {
      // let that = this;
      let objeto = {};
      if (!isEmpty(get(this, 'etapaSeleccionada'))) {
        objeto.etapa = get(this, 'etapaSeleccionada');
      }
      if (!isEmpty(get(this, 'criterio'))) {
        objeto.criterio = get(this, 'criterio');
      }
      if (get(this, 'tramitesSeleccionados')) {
        let tramiteslista = [];
        get(this, 'tramitesSeleccionados').forEach((item)=> {
          tramiteslista.addObject(get(item, 'id'));
        });
        objeto.tramites = tramiteslista.join(' ');
      }
      let inmuebles = get(this, 'inmuebles');
      objeto.tipo = get(this, 'selectedTipo');
      inmuebles.clear();
      let primerInmueble = 0;
      let r = this.store.query('tramitegestion', objeto);
      r.then((data)=> {
        let record = null;
        // let j = 0;
        for (let i = 0; i < get(data, 'length'); i++) {
          let item = data.objectAt(i);
          if (primerInmueble > 0 && primerInmueble !== get(item, 'inmueble')) {
            inmuebles.pushObject(record);
          }
          if (primerInmueble !== get(item, 'inmueble')) {
            let manzana = get(item , 'manzana');
            let lote = get(item, 'lote');
            record = { inmueble: `${manzana} ${lote}` };
            primerInmueble = get(item, 'inmueble');
          }
          let tram = `tramite${get(item, 'tramite')}`;
          record[tram] = get(item, 'fecha');
        }
        inmuebles.pushObject(record);

      });
      info('termino de armar el record');
    }
  }
});
