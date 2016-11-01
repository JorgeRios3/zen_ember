import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
import moment from 'moment';
const {
  get,
  set,
  getProperties,
  setProperties,
  Logger: { info },
  computed,
  observer,
  isEmpty
} = Ember;

function listaComas(lista) {
  let resultado = [];
  lista.forEach((item)=> {
    resultado.push(get(item, 'id'));
  });
  return resultado.join();
};

export default Ember.Controller.extend(FormatterMixin, {
  selectedEmpresa: '',
  selectedBancoOrigen: '',
  sort: '',
  resultPage: '',
  resultPages: '',
  requestedPage: '',
  resultRowCountFormatted: '',
  selectedEstatus: 5,
  listaRequests: Ember.A(),
  otraLista: null,
  isEstatusElaborado: computed.equal('selectedEstatus', 5),
  tablaFirmantesFlag: false,
  listaEstatus: [{ 'id': 5, 'label': 'Elaborado', 'estatus': 'E' }, { 'id': 12, 'label': 'Otro No Aplicado', 'estatus': 'O' }],
  init() {
    this._super(...arguments);
    set(this, 'listaSolicitudFirmarFondear', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'listaFirmantesSolicitud', Ember.ArrayProxy.create({ content: [] }));
    info('viendo en le init el que quiero', get(this, 'listaSolicitudFirmarFondear'));
  },
  hayPagPrevias: computed('resultPage', {
    get() {
      if (get(this, 'resultPage') === '') {
        return false;
      }
      if (parseInt(get(this, 'resultPage')) === 1) {
        return false;
      } else {
        return true;
      }
    }
  }),
  ultimaPagina: observer('resultPage', function() {
    if (parseInt(get(this, 'resultPage')) < parseInt(get(this, 'resultPages'))) {
      set(this, 'hayPagSiguientes', true);
    } else {
      set(this, 'hayPagSiguientes', false);
    }
  }),
  hayPagSiguientes: computed('resultPage', {
    get() {
      if (get(this, 'resultPage') === '') {
        return false;
      }
      if (parseInt(get(this, 'resultPage')) < 2) {
        return false;
      } else {
        return true;
      }
    }
  }),
  observaSelectedEmpresa: observer('selectedEmpresa', function() {
  	set(this, 'solicitudesLista', '');
  	set(this, 'listaSolicitudFirmarFondear', Ember.ArrayProxy.create({ content: [] }));
  	set(this, 'showNavigation', false);
  	set(this, 'tablaFirmantesFlag', false);
    if (!isEmpty(get(this, 'selectedEmpresa'))) {
      let empresa = get(this, 'selectedEmpresa');
      this.store.query('bancoorigen', { empresa })
      .then((data)=> {
        set(this, 'bancoOrigenLista', data);
        info('ya paso bacoorigen');
      }, (error)=> {
        info('trono bancoorigen');
      });
    }
  }),
  observaSelectedBancoOrigen: observer('selectedBancoOrigen', function() {
  	set(this, 'listaSolicitudFirmarFondear',  Ember.ArrayProxy.create({ content: [] }));
    if (!isEmpty(get(this, 'selectedBancoOrigen'))) {
      set(this, 'tablaFirmantesFlag', false);
      this.notifyPropertyChange('elquesea');
      let banco = get(this, 'selectedBancoOrigen');
  	  let empresa = get(this, 'selectedEmpresa');
      this.store.unloadAll('saldosfondeo');
      this.store.query('saldosfondeo', { banco, empresa, solicitudes: '' })
  	    .then((data)=> {
  	      set(this, 'calculaSaldosBancosCall', data);
  	    },(error)=> {
  	    	info('torno');
  	    });
      this.send('pedir');
    }
  }),
  observaSelectedEstatus: observer('selectedEstatus', function() {
    if (!isEmpty(get(this, 'selectedEstatus'))) {
      this.notifyPropertyChange('selectedBancoOrigen');
    }
  }),
  revisarFirmas: computed('elquesea',{
  	get(){
  	  let regreso = false;
  	  get(this, 'listaFirmantes').forEach((item)=> {
  	    if (get(item, 'select') === true) {
  	      regreso = true;
  	    }
  	  });
  	  return regreso;
  	}
  }),
  calculaSaldosBanco: observer('calculaSaldosBancosCall', function() {
  	  let item = get(this, 'calculaSaldosBancosCall').get('firstObject');
  	  let { cantidadfondear, saldobanco, saldofinaldisponible, 
  	      	saldofinaltransito, saldoinicialdisponible, 
  	      	saldoinicialtransito } = getProperties(item, `cantidadfondear saldobanco saldofinaldisponible
  	      		saldofinaltransito saldoinicialdisponible saldoinicialtransito`.w());
  	  setProperties(this, {
  	    cantidadfondear: {'cantidad': this.formatter(cantidadfondear), 'colorPositivo': cantidadfondear >= 0 ? true : false }, 
  	    saldobanco: { 'cantidad': this.formatter(saldobanco), 'colorPositivo': saldobanco >= 0 ? true : false },
  	    saldofinaldisponible: { 'cantidad': this.formatter(saldofinaldisponible), 'colorPositivo': saldofinaldisponible >= 0 ? true : false },
  	    saldofinaltransito: { 'cantidad': this.formatter(saldofinaltransito), 'colorPositivo': saldofinaltransito >= 0 ? true : false },
  	    saldoinicialdisponible: {'cantidad': this.formatter(saldoinicialdisponible), 'colorPositivo': saldoinicialdisponible >= 0 ? true : false },
  	    saldoinicialtransito: {'cantidad': this.formatter(saldoinicialtransito), 'colorPositivo': saldoinicialtransito >= 0 ? true : false }
  	  });
  }),
  actions: {
  	limpiarCampos() {
  	  this.setProperties({
  	    selectedEmpresa: '',
        selectedBancoOrigen: '',
        cantidadfondear: '',
        saldobanco: '',
        saldofinaldisponible: '',
        saldofinaltransito: '',
        saldoinicialdisponible: '',
        saldoinicialtransito: '',
        selectedEstatus: 5,
        resultPage: '',
        requestedPage: '',
        resultRowCountFormatted: '',
        tablaFirmantesFlag: false,
        bancoOrigenLista: '',
        listaSolicitudFirmarFondear: '',
        listaFirmantes: '',
        solicitudesSeleccionadas: '',
        solicitudesLista: ''
      });
  	},
  	aplicarFondeo() {
  	  info('aplicandofondeoOtro');
  	  let empresa = get(this, 'selectedEmpresa');
  	  let banco = get(this, 'selectedBancoOrigen');
  	  let solicitudes = [];
  	   get(this, 'listaSolicitudFirmarFondear').forEach((item)=> {
  	    solicitudes.push(get(item, 'id'));
  	  });
  	  solicitudes = solicitudes.join();
  	  let estatus = get(this, 'selectedEstatus') === 12 ? 'P': '';
  	  let record = this.store.createRecord('solicitudfondeo', { banco, empresa, solicitudes, estatus, firmantes: ''});
  	  record.save().then((data)=> {
  	    info('llego');
  	    set(this, 'saveSuccess', true);
  	    set(this, 'tablaFirmantesFlag', false);
        this.notifyPropertyChange('elquesea');
  	    this.send('limpiarCampos');
  	  },(error)=> {
  	    info('trono');
  	  });
  	},
  	firmarSolicitudes() {
  	  let empresa = get(this, 'selectedEmpresa');
  	  let banco = get(this, 'selectedBancoOrigen');
  	  let solicitudes = [];
  	  let firmantes = [];
  	  let estatus = get(this, 'selectedEstatus') === 5 ? 'F': '';
  	  get(this, 'listaSolicitudFirmarFondear').forEach((item)=> {
  	    solicitudes.push(get(item, 'id'));
  	  });
  	  solicitudes = solicitudes.join();
  	  get(this, 'listaFirmantes').forEach((f)=> {
  	    if (get(f, 'select') === true) {
  	      firmantes.push(get(f, 'id'));
  	    }
  	  });
  	  firmantes = firmantes.join();
  	  info('viendo valores para enviar a solicitudfondeo');
  	  info(banco);
  	  info(empresa);
  	  info(solicitudes);
  	  info(firmantes);
  	  let record = this.store.createRecord('solicitudfondeo', { banco, empresa, solicitudes, firmantes, estatus});
  	  record.save().then((data)=> {
  	    info('llego');
  	    //this.notifyPropertyChange('selectedBancoOrigen');
  	    set(this, 'saveSuccess', true);
  	    set(this, 'tablaFirmantesFlag', false);
        this.notifyPropertyChange('elquesea');
  	    this.send('limpiarCampos');
  	  },(error)=> {
  	    info('trono');
  	  });

  	},
  	seleccionarFirmante(firmante) {
  	  set(firmante, 'select', true);
  	  this.notifyPropertyChange('elquesea');
  	},
  	quitarFirmante(firmante){
  	  set(firmante, 'select', false);
  	  this.notifyPropertyChange('elquesea');
  	},
  	cerrarFirmantes(){
  	  this.notifyPropertyChange('elquesea');
  	  this.toggleProperty('tablaFirmantesFlag');
  	},
  	MostrarFirmantes() {
  	  let lista = Ember.A();
  	  let select = false;
  	  info('entrando en el boton que quiero');
  	  this.store.findAll('solicitudfirmante')
  	  .then((data)=> {
  	  	data.forEach((item)=> {
  	      let { id, nombre } = getProperties(item, 'id nombre'.w());
  	      lista.pushObject({ id, nombre, select });
  	    });
  	    set(this, 'listaFirmantes', lista);
  	    this.toggleProperty('tablaFirmantesFlag');
  	  },(error)=> {
  	  	info('trono firmante');
  	  })
  	},
  	agregarSolicitud(solicitud) {
  	  // info('viendo si lo calculo bien',calculaSaldosBanco(122243.00, this));
  	  let lista = get(this, 'listaSolicitudFirmarFondear');
  	  let objeto = lista.findBy('id', get(solicitud, 'id'));
  	  if (!isEmpty(objeto)) {
  	    info('ya estaba el objeto');
  	  } else {
  	    set(solicitud, 'select', true);
  	    lista.pushObject(solicitud);
  	    set(this, 'solicitudesSeleccionadas', get(lista, 'length'));
  	    let banco = get(this, 'selectedBancoOrigen');
  	    let empresa = get(this, 'selectedEmpresa');
  	    let solicitudes = listaComas(lista);
  	    this.store.unloadAll('saldosfondeo');
  	    this.store.query('saldosfondeo', {banco, empresa, solicitudes})
  	    .then((data)=> {
  	      set(this, 'calculaSaldosBancosCall', data);
  	      // let saldo = get(this, 'calculaSaldosBanco');
  	      // let item = data.get('firstObject');
  	      /*let { cantidadfondear, saldobanco, saldofinaldisponible, 
  	      	saldofinaltransito, saldoinicialdisponible, 
  	      	saldoinicialtransito } = getProperties(item, `cantidadfondear saldobanco saldofinaldisponible
  	      		saldofinaltransito saldoinicialdisponible saldoinicialtransito`.w());
  	      setProperties(this, {
  	        cantidadfondear: {'cantidad': this.formatter(cantidadfondear), colorPositivo: cantidadfondear < 0 ? false : true}, 
  	        saldobanco: this.formatter(saldobanco),
  	        saldofinaldisponible: this.formatter(saldofinaldisponible),
  	      	saldofinaltransito: this.formatter(saldofinaltransito),
  	      	saldoinicialdisponible: this.formatter(saldoinicialdisponible),
  	      	saldoinicialtransito: this.formatter(saldoinicialtransito)
  	      });*/
  	    },(error)=> {
  	    	info('torno');
  	    });
  	  }
  	},
  	quitarSolicitud(solicitud) {
  	  let lista = get(this, 'listaSolicitudFirmarFondear');
  	  let objeto = lista.findBy('id', get(solicitud, 'id'));
  	  lista.removeObject(objeto);
  	  set(this, 'solicitudesSeleccionadas', get(lista, 'length'));
  	  set(solicitud, 'select', false);
  	  let banco = get(this, 'selectedBancoOrigen');
  	  let empresa = get(this, 'selectedEmpresa')
  	  let solicitudes = listaComas(lista);
  	  this.store.unloadAll('saldosfondeo');
  	  this.store.query('saldosfondeo', {banco, empresa, solicitudes})
  	  .then((data)=> {
  	  	set(this, 'calculaSaldosBancosCall', data);
  	    /*let item = data.get('firstObject');
  	      let { cantidadfondear, saldobanco, saldofinaldisponible, 
  	      	saldofinaltransito, saldoinicialdisponible, 
  	      	saldoinicialtransito } = getProperties(item, `cantidadfondear saldobanco saldofinaldisponible
  	      		saldofinaltransito saldoinicialdisponible saldoinicialtransito`.w());
  	      setProperties(this, {
  	        cantidadfondear, saldobanco, saldofinaldisponible, 
  	      	saldofinaltransito, saldoinicialdisponible, 
  	      	saldoinicialtransito
  	      });*/
  	  },(error)=> {
  	    info('torno');
  	  });
  	},
  	pedirSort(sortColumn) {
  	  set(this, 'sort', sortColumn);
  	  this.send('pedir');
  	},
  	pedir() {
      let listaRequests = get(this, 'listaRequests');
      this.store.unloadAll('gxsolicitudcheque');
      let objeto = {};
      let estatus = get(this, 'selectedEstatus');
      let banco = get(this, 'selectedBancoOrigen')
      let empresa = get(this, 'selectedEmpresa');
      // let operacion = get(this, 'selectedOperacion');
      let requestedPage = get(this, 'requestedPage');
      
      if (empresa) {
        objeto.empresa = empresa;
      }
      if (banco) {
        objeto.banco = banco;
      }
      if (estatus) {
        objeto.estatus = estatus;
      }
      if (get(this, 'sort') !== '') {
        objeto.sort = get(this, 'sort');
        set(this, 'sort', '');
      }
      /* if (operacion !== '' && operacion !== 'ninguna') {
        if (operacion === 'multicheque') {
          objeto.multicheque = 1;
        } else {
          objeto.fondeo = 1;
        }
      }*/
      if (requestedPage) {
        objeto.page = get(this, 'requestedPage');
      }
      objeto.cuantos = 1;
      info('valor de objeto', objeto);
      let cadena = '';
      Object.keys(objeto).forEach((key)=> {
        let valor = get(objeto, key);
        cadena += `${key}=${valor}`;
      });
      let objetoCache = listaRequests.findBy('query', cadena);
      if (objetoCache) {
        info(' si lo encontro valor de objeto token', objetoCache);
        objeto.cache_token = objetoCache.cache_token;
      }
      this.store.query('gxsolicitudcheque', objeto)
      .then((data)=> {
        let cuantos = get(data, 'meta.cuantos');
        info('valor de cuantos', cuantos);
        cuantos > 20 ? set(this, 'showNavigation', true) : set(this, 'showNavigation', false);
        if (cuantos <= 0) {
          info('no hubo resultados');
          set(this, 'errorModal', true);
          set(this, 'errorTitle', 'No Se Encontraron Resultados');
          set(this, 'errorMsg', 'No se encontraron resultados con los filtros dados');
          return;
        }
        if (cuantos > 1000) {
          info('cuantos fue mayor a 1000');
          set(this, 'errorModal', true);
          set(this, 'errorTitle', 'Busqueda Muy Extensa');
          set(this, 'errorMsg', 'El resultado de la busqueda es mayor de 1000 registros filtre mas su busqueda o utilice un rango de fechas menos amplio');
          return;
        }
        set(this, 'resultRowCountFormatted', cuantos);
        delete objeto.cuantos;
        let lista = Ember.A();
        this.store.query('gxsolicitudcheque', objeto)
        .then((data)=> {
          data.forEach((item)=> {
          	let select = false;
          	let objeto = get(this, 'listaSolicitudFirmarFondear').findBy('id', get(item, 'id'));
          	if (objeto) {
          	  select = true;
          	  info('valor del ojeto seleccionado', get(objeto, 'id'));
          	}
            let {id, fechacaptura, fechaprogramada, numerochequeorigen, 
            	cantidadComas, nombredefinitivo, 
            	razonsocial, estatusdescripcion, usuariosolicitante} = getProperties(item, `id fechacaptura fechaprogramada numerochequeorigen 
            		cantidadComas nombredefinitivo 
            		razonsocial estatusdescripcion usuariosolicitante`.w());
            	lista.pushObject({id, fechacaptura, fechaprogramada, numerochequeorigen,
            	cantidadComas, nombredefinitivo, 
            	razonsocial, estatusdescripcion, usuariosolicitante, select});
          });
          //data.setEach('select', false);
          set(this, 'solicitudesLista', lista);
          set(this, 'resultPage', get(data, 'meta.page'));
          set(this, 'resultPages', get(data, 'meta.pages'));
          set(this, 'hayPagSiguientes', true);
          /*let objetoCache = listaRequests.findBy('query', cadena);
          if (!objetoCache) {
            info('agregandolo a la listaRequests');
            listaRequests.addObject({ query: cadena, cache_token: get(data, 'meta.cache_token') });
          }*/
        });
      }, (error)=> {
        info('trono');
      });
    },
    mostrarPagPrevia() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage - 1;
      set(this, 'requestedPage', nextPage);
      this.send('pedir');
    },
    mostrarPagSiguiente() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage + 1;
      set(this, 'requestedPage', nextPage);
      this.send('pedir');
    },
    okCerrarModal() {
      info('cerrando el modal');
      set(this, 'errorModal', false);
      set(this, 'saveSuccess', false);
    }
  }
});
