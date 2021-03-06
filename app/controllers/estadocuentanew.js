import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';

const {
  get,
  set,
  observer,
  computed,
  isEmpty,
  setProperties,
  getProperties,
  Logger: { info },
  inject: { service, controller }
} = Ember;

export default Ember.Controller.extend(FormatterMixin,
{
  session: service(),
  comodin: service(),
  proxyCuenta: computed('comodin', {
    get() {
      return get(this, 'comodin.cuenta');
    }
  }),
  tipos: [{id:8, nombre: 'Documento de Ajuste de Precio'}, {id:13, nombre:'Documento Excedente de Credito'}],
  formaGeneraDocumento: false,
  telefonoCasa: '',
  telefonoTrabajo: '',
  huboErrorAlGrabar: false,
  errorAlGrabar: '',
  CantidadDocumento: '',
  ci: controller('index'),
  totalVencido: 0,
  selectedTipo: '',
  etapaBreve: '',
  ofertaCliente: '',
  loteBreve: '',
  documentosVencidos: 0,
  numeroDocumentos: 0,
  cargos: 0,
  abonos: 0,
  selectedNombre: '',
  selectedEtapa: null,
  selectedManzana: '',
  inmuebleSelected: '',
  inmueblesconcuenta: Ember.A(),
  inmueblesSortingDesc: ['inmueble:asc'],
  numerosExteriores: null,
  numerosInteriores: null,
  numeroExteriorSelected: '',
  numeroInteriorSelected: '',
  selectedDoc: null,
  cuantos: '',
  catalogoNombres: null,
  isArcadia: false,
  etapasArcadia: null,
  etapasDefinitiva: null,
  docsCliente: null,
  error: '',
  nombre: '',
  idDocumento: '',
  manzana: '',
  lote: '',
  cuenta: '',
  cliente: '',
  saldo: '',
  movimientosdocumento: null,
  maximo: computed.lt('cuantos', 101),
  conPagares: null,
  saldoPagares: '',
  showButton: false,
  showData: false,
  saldoPagaresFormateado: '',
  documentosPagares: null,
  saldoCuenta: '',
  recibo: '',
  recibosmovimientosLista: null,
  documentosSelec: null,
  movimientosMayorAUno: computed.gt('recibosmovimientosLista.length', 1),
  hayPrerecibos: computed.gt('listaPrerecibos.length', 0),
  cuentaBuscar: '',
  mostrarNombreClienteAlert: false,
  showName: '',
  showCuenta: '',
  errorMessage: '',
  hayReciboElegido: false,
  // aqui variables de recibos
  nullFechaCapturaInicial: '',
  nullFechaCapturaFinal: '',
  fechaCapturaInicial: '',
  fechaCapturaFinal: '',
  formaDepositos: false,
  prerecibosForma: false,
  selectedBancoOrigen: '',
  selectedEmpresa: '',
  depositosLista: Ember.A(),
  imss: '',
  init() {
    this._super(...arguments);
    set(this, 'listaDocsPagar', Ember.ArrayProxy.create({ content: [] }));
    info('viendo en le init el que quiero', get(this, 'listaDocsPagar'));
  },

  observanewna: observer('prueban', function() {
    info('funciono', get(this, 'prueban'));
    this.store.query('zenprospecto', {tipo:"nombre", nombre:get(this, 'prueban')})
    .then((data)=> {
      info('si llego', data);
    });
  }),
  observaTipo: observer('selectedTipo', function() {
    info('viendo tipo', get(this, 'selectedTipo'));
  }),
  derechosArcadia: computed('ci.perfil', {
    get() {
      let permiso = false;
      switch (get(this, 'ci.perfil')) {
        case 'admin':
        case 'finanzas':
        case 'cobranza':
          permiso = true;
          break;
        default:
          permiso = false;
      }
      return permiso;
    }
  }),
  saldoFormateado: computed('saldo', {
    get() {
      return this.formatter(get(this, 'saldo'));
    }
  }),
  cargosFormateado: computed('cargos', {
    get() {
      return this.formatter(get(this, 'cargos'));
    }
  }),
  abonosFormateado: computed('abonos', {
    get() {
      return this.formatter(get(this, 'abonos'));
    }
  }),
  totalVencidoFormateado: computed('totalVencido', {
    get() {
      return this.formatter(get(this, 'totalVencido'));
    }
  }),
  observaNombre: observer('nombre', function() {
    if (get(this, 'nombre').length > 2) {
      this.setProperties({
        showButton: true
      });
    } else {
      set(this, 'showButton', false);
    }
  }),
  observaCuentaBuscar: observer('cuentaBuscar', function() {
    try {

      info('viendo valor de cuentabuscar al cambiar de company', get(this, 'cuentabuscar'));
      let { store } = this;
      let isArcadia = get(this, 'isArcadia');
      let cuenta = get(this, 'cuentaBuscar');
      if (isEmpty(cuenta)) {
        info('cuenta buscar no vale nada');
        return;
      }
      if (!isArcadia && parseInt(cuenta) < 1000) {
        return;
      }
      if (true) {
        let objeto = {};
        if (get(this, 'company')) {
          objeto.company = get(this, 'company');
        }
        let company = get(this, 'company');
        objeto.cuenta = get(this, 'cuentaBuscar');
        info('valor de company', company);
        store.unloadAll('zencuentabreve');
        store.query('zencuentabreve', objeto)
        .then((data)=> {
          data.forEach((item)=> {
            if (get(item, 'id') && get(item, 'nombre')) {
              set(this, 'telefonoCasa', get(item, 'telefonocasa'));
              set(this, 'telefonoTrabajo', get(item, 'telefonotrabajo'));
              set(this, 'mostrarNombreClienteAlert', true);
              set(this, 'showName', get(item, 'nombre'));
              set(this, 'showCuenta', get(item, 'id'));
              set(this, 'etapaBreve', get(item, 'etapa'));
              set(this, 'loteBreve', get(item, 'lote'));
              set(this, 'imss', get(item, 'imss'));
              set(this, 'domicilioCliente', get(item, 'domicilio'));
              set(this, 'coloniaCliente', get(item, 'colonia'));
              set(this, 'ciudadCliente', get(item, 'ciudad'));
              set(this, 'estadoCliente', get(item, 'estado'));
              set(this, 'cpCliente', get(item, 'cp'));
              set(this, 'rfcCliente', get(item, 'rfc'));
              if (isArcadia) {
                info('en arcadia lote', get(item, 'lote'));
                info('en arcadia lote', get(item, 'manzana'));
                set(this, 'lote', get(item, 'lote'));
                set(this, 'manzana', get(item, 'manzana'));
              }
              info('viendo etapaBreve', get(this, 'etapaBreve'));
            } else {
              set(this, 'mostrarNombreClienteAlert', false);
              set(this, 'showName', '');
              set(this, 'showCuenta', '');
            }
          });
        });

      }
    } catch (e) {
      info('trono en cuentabuscar', e);
    }
  }),

  observaTodo: observer('isArcadia', 'selectedEtapa', 'nombre', function() {
    setProperties(this, {
      showData: false
    });
  }),
  observaCantidadYTipo: computed('CantidadDocumento', 'selectedTipo', {
    get() {
      if (get(this, 'CantidadDocumento') !== '' && get(this, 'selectedTipo') !== ''){
        return true;
      } else {
        return false;
      }
    }
  }),
  observaIsArcadia: observer('isArcadia', function() {
    setProperties(this, {
      nombre: '',
      cuentaBuscar: '',
      documentosPagares: null,
      docsCliente: null,
      movimientosdocumento: null,
      recibosmovimientosLista: null,
      mostrarNombreClienteAlert: false,
      selectedEtapa: '',
      showButton: false,
      showName: '',
      showCuenta: '',
      showData: '',
      cuantos: '',
      manzanasEtapaLista: null,
      numerosExteriores: null,
      numerosInteriores: null,
      inmueblesManzana: null,
      isDepartamento: false
    });
    info('aqui ando en observacion');
    let isArcadia = get(this, 'isArcadia');
    let company = isArcadia ? 'arcadia' : '';
    let etapas = Ember.A();
    let { store } = this;
    set(this, 'company', company);
    store.unloadAll('zenetapastramite');
    store.unloadAll('zendocumentoscliente');
    store.unloadAll('zenmovimientosdocumento');
    set(this, 'etapas', this.store.query('zenetapastramite', { company }));
  }),
  observaSelectedNombre: observer('selectedNombre', function() {
    let { store } = this;
    info('valor de selectedNombre', get(this, 'selectedNombre'));
    store.unloadAll('zendocumentoscliente');
    store.unloadAll('zendocumentopagare');
    store.unloadAll('zenrapcuenta');
    let that = this;
    let totalVencido = 0;
    let numeroDocumentos = 0;
    let documentosVencidos = 0;
    let cargos = 0;
    let abonos = 0;
    let company = get(this, 'company');
    let cuenta = get(this, 'selectedNombre');
    if (company !== 'arcadia') {
      store.find('zenrapcuenta', cuenta).then((data)=> {
        info('paso zenrapcuenta');
        set(this, 'rapCliente', get(data, 'rap'));
      },(error)=> {
        info('trono zenrapcuenta');
      });
    }
    // info(`valor de cuenta en observer selectednombre ${cuenta}`);
    info('revisando catalogo antes de pasar ', get(this, 'catalogoNombres'));
    let cual = get(this, 'catalogoNombres').findBy('cuenta', get(this, 'selectedNombre'));
    info('cual', cual);
    info(get(cual, 'oferta'));
    info(`valor de cual ${cual}`);
    let p = this.store.query('zendocumentoscliente', { cuenta: get(this, 'selectedNombre'), company });
    p.then((data)=> {
      data.forEach((item)=> {
        if (get(item, 'documentoVencido')) {
          totalVencido += parseFloat(get(item, 'saldo').replace(',', ''));
          documentosVencidos++;
        }
        numeroDocumentos++;
        cargos += parseFloat(get(item, 'cargo').replace(',', ''));
        abonos += parseFloat(get(item, 'abono').replace(',', ''));
      });
      // info('total vencido', totalVencido, 'yessir');
      setProperties(this, {
        totalVencido,
        documentosVencidos,
        numeroDocumentos,
        cargos,
        abonos
      });
    });
    try {
      set(this, 'docsCliente', p);
      set(this, 'cuenta', get(cual, 'cuenta'));
      set(this, 'cuentaBuscar', get(cual, 'cuenta'));
      if (!get(this, 'isArcadia')) {
        info('valor de manzana en iclar', get(cual, 'manzana'));
        info('valor de inmueble', get(cual, 'inmueble'));
        set(this, 'manzana', get(cual, 'manzana'));
        set(this, 'lote', get(cual, 'inmueble'));
      }
      set(this, 'saldo', get(cual, 'saldo'));
      set(this, 'conPagares', get(cual, 'conpagares'));
      set(this, 'saldoPagaresFormateado', get(cual, 'saldopagaresformateado'));
      set(this, 'ofertaCliente', get(cual, 'oferta'));
    } catch(e) {
      info('el error es ', e);
    }
    if (get(this, 'conPagares') === true) {
      set(this, 'documentosPagares', this.store.query('zendocumentopagare', { cuenta }));
    }
    set(this, 'cliente', get(cual, 'cliente'));
    set(this, 'showData', true);
  }),
  
  observaManzana: observer('selectedManzana', function() {
    info('esta aqui en selected manzana');
      //set(this, 'prueba', computed.sort('inmueblesconcuenta'), 'inmueblesSortingDesc');
      let isDepartamento = get(this, 'isDepartamento');
      if (get(this, 'isDepartamento')) {
        let mySet = new Set([]);
        set(this, 'numerosExteriores', mySet);
      }
      // let listaInmuebles = get(this, 'inmueblesManzanaFiltro');
      let listaInmuebles = get(this, 'inmueblesconcuenta').sortBy('inmueble').filter((item)=> {
        let lote = get(item, 'lote');
        info('en el filter de selectedManzana', get(item, 'manzana') === get(this, 'selectedManzana'));
        if (get(this, 'selectedManzana') === get(item, 'manzana')) {
          if (isDepartamento) {
            get(this, 'numerosExteriores').add(lote.substring(0, 2));
          }
          return true;
        } else {
          return false;
        }
      });
      set(this, 'inmueblesManzana', listaInmuebles);
  }),
  observaNumeroExteriorSelected: observer('numeroExteriorSelected', function() {    
    let exterior = get(this, 'numeroExteriorSelected');
    let inmuebles =  get(this, 'inmueblesManzana');
    let lista = Ember.A();
    inmuebles.forEach((item)=> {
      let exteriorInmueble = get(item, 'lote').substring(0, 2);
      info('valor de exterior', exterior, exteriorInmueble, exteriorInmueble === exterior);
      if (exterior === exteriorInmueble) {
        info('coincidio exterior');
        let { cuenta, etapa, id, inmueble, lote, manzana } = getProperties(item, 'cuenta etapa id inmueble lote manzana'.w());
        let depa = lote.substring(2, lote.length);
        lista.pushObject({
          cuenta, etapa, id, inmueble, lote, manzana, depa
        });
      } else {
        info('no coincidio exterior');
      }
    });
    set(this, 'numerosInteriores', lista);
  }),
  observaInteriorSelected: observer('numeroInteriorSelected', function() {
    info('entro en observainteior', get(this, 'numeroInteriorSelected'));
    set(this, 'cuentaBuscar', get(this, 'numeroInteriorSelected.cuenta'));
    Ember.run.later('',()=> {
      this.send('buscarConCuenta');
    }, 2000);
  }),
  observaInmuebleSelected: observer('inmuebleSelected', function() {
    info('viendo valor de inmueble selected', get(this, 'inmuebleSelected.cuenta'));
    set(this, 'cuentaBuscar', get(this, 'inmuebleSelected.cuenta'));
    Ember.run.later('',()=> {
      this.send('buscarConCuenta');
    }, 2000);
  }),
  hayFechas: computed('fechaCapturaInicial', 'fechaCapturaFinal', 'selectedBancoOrigen', {
    get() {
      let ini = get(this, 'fechaCapturaInicial');
      let fini = get(this, 'fechaCapturaFinal');
      let banco = get(this, 'selectedBancoOrigen');
      if (!isEmpty(ini) && !isEmpty(fini) && !isEmpty(banco)) {
        return true;
      } else {
        return false;
      }
    }
  }),
  observaSelectedEmpresa: observer('selectedEmpresa', function() {
    if (get(this, 'listaPartidasEgresoGrabar.length') > 0) {
      set(this, 'listaPartidasEgresoGrabar', Ember.ArrayProxy.create({ content: [] }));
    }
    if (!isEmpty(get(this, 'selectedEmpresa'))) {
      set(this, 'selectedBancoOrigen', '');
      let empresa = get(this, 'selectedEmpresa');
      this.store.query('bancoorigen', { empresa })
      .then((data)=> {
        set(this, 'bancoOrigenLista', data);
        this.store.query('centrocosto', { empresa, naturaleza: 1 }).then((data2)=> {
          set(this, 'centroCostoLista', data2);
        }, (error2)=> {
          info('trono error2');
        });
        info('ya paso bacoorigen');
      }, (error)=> {
        info('trono bancoorigen');
      });
    }
  }),
  actions: {
  	seleccionaReferenciaRap(rap) {
  	  let that = this;
  	  let r = rap.slice(4,rap.length);
  	  this.store.find('zencuentarap', r)
  	  .then((data)=> {
  	    set(this, 'showCuenta', get(data, 'cuenta'));
  	    set(this, 'cuentaBuscar', get(data, 'cuenta'));
  	    //set(this, 'prereciboRecord', r);
  	    Ember.run.later('', function() {
  	    that.send('buscarConCuenta');
  	    }, 3000);
  	    }, (error)=> {
  	      let e = error.errors[0];
  	      info('viendo si jalo', e.detail);
  	      set(this, 'errorFlagRap', true);
  	      set(this, 'errorMsgRap', e.detail);
  	      info('valor de error', error.errors[0]);
  	      info('error zencuentarap');
  	      Ember.run.later('', function() {
  	        set(that, 'errorFlagRap', false);
  	      },2000);
  	    });
  	},
  	buscarDepositos() {
  	  let objeto = {};
  	  info('entrando');
  	  let fCapturaInicial = get(this, 'fechaCapturaInicial');
      let fechaCapturainicial = !isEmpty(fCapturaInicial) ? fCapturaInicial.format('YYYY/MM/DD') : '';
      let fCapturaFinal = get(this, 'fechaCapturaFinal');
      let fechaCapturafinal = !isEmpty(fCapturaFinal) ? fCapturaFinal.format('YYYY/MM/DD') : '';
      if (fechaCapturainicial) {
        objeto.fechacapturainicial = fechaCapturainicial;
      }
      if (fechaCapturafinal) {
        objeto.fechacapturafinal = fechaCapturafinal;
      }
      let empresa = get(this, 'selectedEmpresa');
      let banco = get(this, 'selectedBancoOrigen');
      if (empresa) {
        objeto.empresa = empresa;
      }
      if (banco) {
        objeto.banco = banco;
      }
      objeto.clasificado = 'N';
      objeto.eliminado = 'N';
      objeto.referencia = 1;
      info('haciendo query');
      this.store.unloadAll('gxbancomovimiento');
      this.store.query('gxbancomovimiento', objeto)
      .then((data)=> {
        set(this, 'depositosLista', data);
        info('si fue por promesa');
      }, (error)=> {
        info('trono');
      });
  	},
  	toggleFormaDespositos() {
  	  if (get(this, 'hayPrerecibos') === true) {
  	    set(this, 'prerecibosForma', false);
  	  }
  	  this.toggleProperty('formaDepositos');
  	},
  	seleccionarPrerecibo(r) {
  	  let that = this;
  	  set(this, 'showCuenta', get(r, 'cuenta'));
  	  set(this, 'cuentaBuscar', get(r, 'cuenta'));
  	  set(this, 'prereciboRecord', r);
  	  set(this, 'prerecibosForma', false);
  	  Ember.run.later('', function() {
  	    that.send('buscarConCuenta');
  	  }, 2000);
  	},
  	BuscarPrerecibos() {
  	  if (get(this, 'formaDepositos') === true) {
  	    set(this, 'formaDepositos', false);
  	  }
  	  this.toggleProperty('prerecibosForma');
  	  this.store.unloadAll('zenprerecibo');
  	  this.store.findAll('zenprerecibo')
  	  .then((data)=> {
  	  	set(this, 'listaPrerecibos', data);
  	  }, (error)=> {
  	  	info('trono zenprerecibos');
  	  })
  	},
    guardarDocumento() {
      let cantidad = get(this, 'CantidadDocumento');
      let cuenta = get(this, 'cuenta');
      let tipo = get(this, 'selectedTipo');
      let record = this.store.createRecord('zendocumentocuenta', {
        cantidad,
        cuenta,
        tipo
      });
      record.save().then(()=> {
        info('se grabo');
        this.transitionToRoute('index');

      },(error)=> {
        info('no se grabo');
      });
    },
    levantaFormaDocumento() {
      this.toggleProperty('formaGeneraDocumento');
    },
    copiaCuenta() {
      set(this, 'isArcadia', true);
      let cuenta = get(this, 'comodin.cuenta');
      set(this, 'cuentaBuscar', cuenta);
      set(this, 'comodin.cuenta', '');
    },
    buscarConCuenta() {
      let that = this;
      let nombre = get(this, 'showName');
      set(this, 'nombre', nombre);
      this.send('buscar');
      Ember.run.later(function() {
        let cuenta = get(that, 'showCuenta');
        set(that, 'selectedNombre', parseInt(cuenta));
      }, 1000);
    },
    cerrarModal() {
    },
    enteradoError() {
      set(this, 'errorMessage', '');
    },
    saldarRecibo() {
      let { store } = this;
      let listaDocumentos = [];
      let recibo = get(this, 'recibo');
      let lista = get(this, 'recibosmovimientosLista');
      lista.forEach((item)=> {
        if (get(item, 'elegido') === true) {
          listaDocumentos.push(get(item, 'movimiento'));
        }
      });
      info('cancelando', listaDocumentos.join(','),    recibo);
      let movsLista = listaDocumentos.join(',');
      let record = store.createRecord('zenrecibocancelacion', {
        recibo,
        movimientos: movsLista
      });
      record.save().then(()=> {
        info('se grabo correctamente');
        this.notifyPropertyChange('selectedNombre');
        set(this, 'recibo', '');
        set(this, 'zenmovimientosdocumento', null);
      }, (error)=> {
        // info('log hubo error al grabar', error.errors);
        set(this, 'errorMessage', true);
        set(this, 'error', error.errors.resultado[0]);
        store.unloadAll('zenrecibomovimiento');
        set(this, 'recibosmovimientosLista', Ember.A());
        set(this, 'recibo', '');

      });

    },
    procesaReciboDocumento(documento) {
      let hayReciboElegido = false;
      let docs = get(this, 'recibosmovimientosLista');
      let cual = docs.findBy('documento', documento);
      if (get(cual, 'elegido') === false) {
        set(cual, 'elegido', true);
      } else {
        set(cual, 'elegido', false);
      }
      docs.forEach((item)=> {
        if (get(item, 'elegido') === true) {
          hayReciboElegido = true;
        }
        set(this, 'hayReciboElegido', hayReciboElegido);
      });
    },
    procesaRecibo(recibo, id) {
      let { store } = this;
      let lista = Ember.A();
      let isArcadia = get(this, 'isArcadia');
      let company = isArcadia ? 'arcadia' : '';
      info('valor de recibo de recibo', id);
      set(this, 'recibo', recibo);
      store.unloadAll('zenrecibomovimiento');
      // set(this, 'recibosmovimientosLista', this.store.query('recibomovimiento', { company, recibo }));
      store.query('zenrecibomovimiento', { company, recibo }).then((data)=> {
        data.forEach((item)=> {
          if (id === get(item, 'movimiento')) {
            let { movimiento, fecha, cantidad, documento } = item.getProperties('movimiento', 'fecha', 'cantidad', 'documento');
            let elegido = true;
            lista.pushObject({ elegido, movimiento, fecha, cantidad, documento });
            set(this, 'hayReciboElegido', true);
          } else {
            let { movimiento, fecha, cantidad, documento } = item.getProperties('movimiento', 'fecha', 'cantidad', 'documento');
            let elegido = false;
            lista.pushObject({ elegido, movimiento, fecha, cantidad, documento });
          }
        });
      });
      set(this, 'recibosmovimientosLista', lista);
    },
    procesaDocumento(idDocumento, abono) {
      let company = get(this, 'company');
      this.store.unloadAll('zenmovimientosdocumento');
      info(`valor de id documento ${idDocumento} valor de abono ${abono}`);
      set(this, 'movimientosdocumento', this.store.query('zenmovimientosdocumento', { documento: idDocumento, company }));
    },
    selectedEtapa(item) {
      let etapa = item.id
      let company = get(this, 'isArcadia');
      let objeto = {};
      objeto.etapa = etapa;
      if (company === true) {
        objeto.company = true;
      }
      set(this, 'selectedEtapa', etapa);
      set(this, 'catalogoNombres', null);
      set(this, 'cuantos', 0);
      this.store.unloadAll('zenclientesconcuentanosaldada');
      set(this, 'nombre', '');
      if (company !== true) {
        set(this, 'isDepartamento', get(item, 'departamento'));
      } else {
        set(this, 'isDepartamento', false);
      }
      this.store.query('inmueblesconcuenta', objeto)
      .then((data)=> {
        info('si llego inmueblesconcuenta');
        set(this, 'inmueblesconcuenta', data);
        let manzana = '';
        let  manzanasEtapa = Ember.A();
        data.forEach((item)=> {
          if(get(item, 'manzana') !==  manzana) {
            manzana = get(item, 'manzana');
            // info('entro en filter');
            manzanasEtapa.addObject({ id: manzana, label: manzana });
          } else {
            //info('no entro en filter');
          }
        });
        set(this, 'manzanasEtapaLista', manzanasEtapa);
      }, (error)=> {
        info('trono inmueblesconcuenta')
      });
    },
    buscar() {
      // info('entro en buscar desde llmada externa');
      let that = this;
      let a = Ember.A();
      let company = get(this, 'company');
      let nombre = get(this, 'nombre');
      let etapa = get(this, 'selectedEtapa');
      info('valor de selectedEtapa', get(this, 'selectedEtapa'));
      this.store.unloadAll('zenclientescuantosconcuentanosaldada');
      this.store.unloadAll('zenclientesconcuentanosaldada');
      this.store.query('zenclientescuantosconcuentanosaldada' , { etapa, nombre, estadocuenta: 1, company })
      .then((data)=> {
        if (get(data, 'length')) {
          data.forEach((item)=> {
            set(that, 'cuantos', get(item, 'cuantos'));
          });
        }
        if (parseInt(get(this, 'cuantos')) <= 100) {
          this.store.query('zenclientesconcuentanosaldada', { etapa, nombre, estadocuenta: 1, company })
          .then((data)=> {
            data.forEach((item)=> {
              let { cliente, conpagares, cuenta, inmueble, manzana, nombre, oferta, saldo, saldoformateado, saldopagares, saldopagaresformateado } = item.getProperties('cliente',
               'conpagares', 'cuenta', 'inmueble',
               'manzana', 'nombre', 'oferta', 'saldo',
                'saldoformateado', 'saldopagares', 'saldopagaresformateado');

              a.pushObject({ cliente, conpagares, cuenta, inmueble, manzana, nombre, oferta, saldo, saldoformateado, saldopagares, saldopagaresformateado });
            });
            set(this, 'catalogoNombres', a);
            info('valor de catalogoNombres, en buscar', get(this, 'catalogoNombres'));
          });
        }
      });
    }
  }
});

