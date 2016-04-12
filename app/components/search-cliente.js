import Ember from 'ember';

const {
  get,
  set,
  observer,
  computed,
  isEmpty
} = Ember;

let clientefiltro = Ember.Object.extend({
  id: '',
  cuenta: '',
  saldo: '',
  nombre: ''
});

let alimenta = [];

export default Ember.Component.extend({
  selectedEtapa: 0,
  selectedTipo: 'CC',
  buscaNombre: '',
  nombreCliente: '',
  cuantos: '',
  cuantosLength: '',
  etapas: '',
  store: '',
  errores: '',
  maximo: 100,
  clientesArray: '',
  // listaNombresClientes:'',
  tipoTD: computed.equal('selectedTipo', 'TD'),
  tipoSC: computed.equal('selectedTipo', 'SC'),
  tiposSinCuenta: computed.or('tipoTD', 'tipoSC'),

  init() {
    this._super(...arguments);
    set(this, 'arrayClientes2', alimenta);
    set(this, 'erroresHabidos', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'listaNombresClientes', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'tipos', Ember.ArrayProxy.create({ content: [{ tipo: 'CC', nombre: 'cuenta con saldo' },
      { tipo: 'CS', nombre: 'cuenta sin saldo' }, { tipo: 'CV', nombre: 'cuenta vigente' }, { tipo: 'SC', nombre: 'sin cuenta' }, { tipo: 'TD', nombre: 'todos' }] }));
  },

  observaSelectedNombre: observer('selectedNombre', function() {
    if (get(this, 'selectedNombre') === null) {
      return;
    } else {
      let idNombre = get(this, 'selectedNombre');
      let cual = get(this, 'arrayClientes2').findBy('id', idNombre);
      this.sendAction('hacer', cual);
    }
  }),
  actions: {
    selectedEtapa(etapa) {
      set(this, 'selectedEtapa', etapa.id);
      set(this, 'listaNombresClientes', '');
      this.sendAction('hacer', '0');
    },
    selectedTipo(tipo) {
      set(this, 'selectedTipo', tipo.tipo);
      this.sendAction('hacer', '0');
    },
    buscarCliente() {
      let that = this;
      let tamano = get(this, 'nombreCliente');
      get(this, 'store').unloadAll('clientecuantofiltro');
      get(this, 'store').unloadAll('clientefiltro');
      get(this, 'arrayClientes2').clear();
      let mySet = new Set([]);
      if (tamano.length > 2) {
        if (get(this, 'tiposSinCuenta')) {
          set(this, 'selectedEtapa', 0);
        }
        // var l= get(this, 'listaNombresClientes');
        let nombre = get(this, 'nombreCliente');
        let p1 = get(this, 'store').query('clientecuantofiltro', { etapa: get(this, 'selectedEtapa'), nombre, tipo: get(this, 'selectedTipo') });
        p1.then((data)=> {
          if (get(data, 'length')) {
            data.forEach((item)=> {
              set(that, 'cuantos', get(item, 'cuantos'));
            });
            if (parseInt(get(this, 'cuantos')) < get(that, 'maximo')) {
              set(this, 'cuantosLength', true);
              let p2 = get(that, 'store').query('clientefiltro', { etapa: get(that, 'selectedEtapa'), nombre, tipo: get(that, 'selectedTipo') });
              p2.then((data)=> {
                data.forEach((item)=> {
                  let c = { id: get(item, 'id'), nombre: get(item, 'nombre'), cuenta: get(item, 'cuenta'), saldo: get(item, 'saldo') };
                  get(that, 'arrayClientes2').addObject(c);
                });
              }, (error)=> {
                set(that, 'errores', 'trono promesa');
              });
            } else {
              set(this, 'cuantosLength', false);
            }
          } else {
            set(this, 'cuantos', '');
          }
        });
      }
    }
  }
});
