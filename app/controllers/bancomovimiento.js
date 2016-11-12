import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
import moment from 'moment';

const {
  get,
  set,
  observer,
  computed,
  isEmpty,
  getProperties,
  setProperties,
  Logger: { info }
} = Ember;

function totalValorDePartidas(listaPartidas) {
  let total = 0;
  listaPartidas.forEach((item)=> {
    info('es abnono o cntifsd', item.tipomovto);
    if (item.tipomovto === 'A') {
    total += parseFloat(item.cantidad);
    }
    else {
      total -= parseFloat(item.cantidad);
    }
    info('entro  dando vueltas en totalValorPartidas', item.cantidad);
  });
  return total;
};

export default Ember.Controller.extend(FormatterMixin, {
  listaRequests: Ember.A(),
  resultPage: '',
  resultPages: '',
  requestedPage: '',
  formaMovimiento: false,
  //showBotonAgregar: false,
  selectedBancoOrigen: '',
  selectedMovimiento: '',
  selectedClasificado: '',
  selectedEliminado: '',
  selectedMovimientoForma: 'A',
  selectedEmpresa: '',
  nullFechaCapturaInicial: '',
  nullFechaCapturaFinal: '',
  listaEstatus: [{ 'id': 1, 'label': 'Firme', 'value': 'F' }, { 'id': 2, 'label': 'Salvo Buen Cobro', 'value': 'S' }],
  listaTipoMovto: [{ 'id': 1, 'label': 'Abono', 'value': 'A' }, { 'id': 2, 'label': 'Cargo', 'value': 'C' }],
  listaClasificado: [{ 'id': 1, 'label': 'Si', 'value': 'S' }, { 'id': 2, 'label': 'No', 'value': 'N' }],
  listaEliminado: [{ 'id': 1, 'label': 'Si', 'value': 'S' }, { 'id': 2, 'label': 'No', 'value': 'N' }],
  selectedTipoForma: '',
  fechaForma: '',
  selecteEstatusForma: '',
  cantidadForma: '',
  referenciaForma: '',
  init() {
    this._super(...arguments);
    set(this, 'listaPartidasEgresoGrabar', Ember.ArrayProxy.create({ content: [] }));
    info('viendo en le init el que quiero', get(this, 'listaPartidasEgresoGrabar'));
  },

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
        this.store.query('centrocosto', { empresa }).then((data2)=> {
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
  observaSelectedBancoOrigen: observer('selectedBancoOrigen', function() {
  	//set(this, 'showBotonAgregar', false);
    if (!isEmpty(get(this, 'selectedBancoOrigen'))) {
      this.store.query('gxbancosaldo', { banco: get(this, 'selectedBancoOrigen') })
      .then((data)=> {
        data.forEach((item)=> {
          info('data', get(item, 'saldo'));
          set(this, 'saldoBanco', get(item, 'saldo'));
        });
      },(error)=> {
        info(' trono');;
      });
      //set(this, 'showBotonAgregar', true);
    }
  }),
  observaSelectedCentroCosto: observer('selectedCentroCosto', function() {
    // set(this, '')
    set(this, 'selectedPartidaEgreso', '');
    set(this, 'selectedsubPartida1', '');
    set(this, 'selectedsubPartida2', '');
    set(this, 'selectedsubPartida3', '');
    set(this, 'selectedsubPartida4', '');
    set(this, 'selectedsubPartida5', '');
    set(this, 'subpartida1Lista', null);
    set(this, 'subpartida2Lista', null);
    set(this, 'subpartida3Lista', null);
    set(this, 'subpartida4Lista', null);
    set(this, 'subpartida5Lista', null);
    set(this, 'partidaEgresosLista', null);
    set(this, 'banderaUltimaPartidaSeleccionada', false);
    set(this, 'valorPartidaEgreso', '');
    let empresa = get(this, 'selectedEmpresa');
    let centrocosto = get(this, 'selectedCentroCosto');
    if (isEmpty(centrocosto)) {
      info('entro en el isEmpty que quiero');
      return;
    }
    this.store.query('partidaegreso', { empresa, centrocosto })
    .then((data)=> {
      set(this, 'partidaEgresosLista', data);
      info('paso centro costo');
    }, (error)=> {
      info('error centro costo');
    });
    info('valor de centro costo', centrocosto);
  }),
  observaselectedPartidaEgreso: observer('selectedPartidaEgreso', function() {
    let partida = get(get(this, 'selectedPartidaEgreso'), 'id');
    let nombrePartida =  get(get(this, 'selectedPartidaEgreso'), 'descripcion');
    let nivel = 1;
    let empresa = get(this, 'selectedEmpresa');
    let centrocosto = get(this, 'selectedCentroCosto');
    if (isEmpty(partida)) {
      info('entro en el isEmpty que quiero');
      return;
    }
    set(this, 'valorPartidaEgreso', { partidaID: partida, nombrePartida });
    this.store.query('partidaegreso', { partida, nivel, empresa, centrocosto })
    .then((data)=> {
      set(this, 'subpartida1Lista', data);
      if (get(data, 'length') === 0) {
        set(this, 'banderaUltimaPartidaSeleccionada', true);
      } else {
        set(this, 'banderaUltimaPartidaSeleccionada', false);
      }
     /* info('paso observaselectedPartidaEgreso valor de length', get(data, 'length'));
      if (get(data, 'length') >0) {
        info('si hay lista');
      }*/
    }, (error)=> {
      info('trono observaselectedPartidaEgreso');
    });
    info('en observapartida', partida);
  }),
  observaSelectedSubpartida1: observer('selectedsubPartida1', function() {
    let partida = get(get(this, 'selectedsubPartida1'), 'id');
    let nombrePartida =  get(get(this, 'selectedsubPartida1'), 'descripcion');
    let nivel = 2;
    let empresa = get(this, 'selectedEmpresa');
    let centrocosto = get(this, 'selectedCentroCosto');
    if (isEmpty(partida)) {
      info('entro en el isEmpty que quiero');
      return;
    }
    set(this, 'valorPartidaEgreso', { partidaID: partida, nombrePartida });
    this.store.query('partidaegreso', { partida, nivel, empresa, centrocosto })
    .then((data)=> {
      set(this, 'subpartida2Lista', data);
      info('si paso observaSelectedSubpartida1');
      if (get(data, 'length') === 0) {
        set(this, 'banderaUltimaPartidaSeleccionada', true);
      } else {
        set(this, 'banderaUltimaPartidaSeleccionada', false);
      }
    }, (error)=> {
      info('error observaSelectedSubpartida1');
    });
    info('entro selectedsubPartida1');
  }),
  observaSelectedSubpartida2: observer('selectedsubPartida2', function() {
    let partida = get(get(this, 'selectedsubPartida2'), 'id');
    let nombrePartida =  get(get(this, 'selectedsubPartida2'), 'descripcion');
    let nivel = 3;
    let empresa = get(this, 'selectedEmpresa');
    let centrocosto = get(this, 'selectedCentroCosto');
    if (isEmpty(partida)) {
      info('entro en el isEmpty que quiero');
      return;
    }
    set(this, 'valorPartidaEgreso', { partidaID: partida, nombrePartida });
    this.store.query('partidaegreso', { partida, nivel, empresa, centrocosto })
    .then((data)=> {
      set(this, 'subpartida3Lista', data);
      info('si paso observaSelectedSubpartida2');
      if (get(data, 'length') === 0) {
        set(this, 'banderaUltimaPartidaSeleccionada', true);
      } else {
        set(this, 'banderaUltimaPartidaSeleccionada', false);
      }
    }, (error)=> {
      info('error observaSelectedSubpartida2');
    });
    info('entro selectedsubPartida2');
  }),
  observaSelectedSubpartida3: observer('selectedsubPartida3', function() {
    let partida = get(get(this, 'selectedsubPartida3'), 'id');
    let nombrePartida =  get(get(this, 'selectedsubPartida3'), 'descripcion');
    let nivel = 4;
    let empresa = get(this, 'selectedEmpresa');
    let centrocosto = get(this, 'selectedCentroCosto');
    if (isEmpty(partida)) {
      info('entro en el isEmpty que quiero');
      return;
    }
    set(this, 'valorPartidaEgreso', { partidaID: partida, nombrePartida });
    this.store.query('partidaegreso', { partida, nivel, empresa, centrocosto })
    .then((data)=> {
      set(this, 'subpartida4Lista', data);
      info('si paso observaSelectedSubpartida3');
      if (get(data, 'length') === 0) {
        set(this, 'banderaUltimaPartidaSeleccionada', true);
      } else {
        set(this, 'banderaUltimaPartidaSeleccionada', false);
      }
    }, (error)=> {
      info('error observaSelectedSubpartida3');
    });
    info('entro selectedsubPartida1');
  }),
  observaSelectedSubpartida4: observer('selectedsubPartida4', function() {
    let partida = get(get(this, 'selectedsubPartida4'), 'id');
    let nombrePartida =  get(get(this, 'selectedsubPartida4'), 'descripcion');
    let nivel = 5;
    let empresa = get(this, 'selectedEmpresa');
    let centrocosto = get(this, 'selectedCentroCosto');
    if (isEmpty(partida)) {
      info('entro en el isEmpty que quiero');
      return;
    }
    set(this, 'valorPartidaEgreso', { partidaID: partida, nombrePartida });
    this.store.query('partidaegreso', { partida, nivel, empresa, centrocosto })
    .then((data)=> {
      set(this, 'subpartida5Lista', data);
      info('si paso observaSelectedSubpartida4');
      if (get(data, 'length') === 0) {
        set(this, 'banderaUltimaPartidaSeleccionada', true);
      } else {
        set(this, 'banderaUltimaPartidaSeleccionada', false);
      }
    }, (error)=> {
      info('error observaSelectedSubpartida4');
    });
    info('entro selectedsubPartida4');
  }),
  observaSelectedSubpartida4: observer('selectedsubPartida5', function() {
    let partida = get(get(this, 'selectedsubPartida4'), 'id');
    let nombrePartida =  get(get(this, 'selectedsubPartida5'), 'descripcion');
    set(this, 'valorPartidaEgreso', { partidaID: partida, nombrePartida });
  }),
  BanderaAceptarPagoPartida: computed('totalPartida', {
    get() {
      if (isEmpty(get(this, 'totalPartida'))) {
        return false;
      } else {
        return true;
      }
    }
  }),
  showBotonAgregar: computed('selectedBancoOrigen', 'selectedEmpresa', {
    get() {
      if (!isEmpty(get(this, 'selectedBancoOrigen')) && !isEmpty(get(this, 'selectedEmpresa'))) {
        return true;
      } else {
      	return false;
      }
    }
  }),
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
  hayPagSiguientes: computed('resultPage', {
    get() {
      if (get(this, 'resultPage') === '') {
        return false;
      }
      if (parseInt(get(this, 'resultPage')) < get(this, 'resultPages')) {
        return true;
      } else {
        return false;
      }
    }
  }),
  observaCamposForma: computed('fechaForma', 'cantidadForma', 'referenciaForma', {
    get() {
      if (!isEmpty(get(this, 'fechaForma')) && !isEmpty(get(this, 'cantidadForma')) && !isEmpty(get(this, 'referenciaForma'))) {
        return true;
      } else {
        return false;
      }
    }
  }),
  cantidadesIguales: computed('totalValorPartidas', {
    get() {
      if (get(this, 'movimientoRecord.cantidad') === get(this, 'totalValorPartidas')) {
        return true;
      } else {
        return false;
      }
    }
  }),
  quierover: computed.gt('listaPartidasEgresoGrabar.length', 0),
  actions: {
    coinciliarMovimiento() {
      let solicitudes = []
      let movimientobanco = get(get(this, 'movimientoRecord'), 'id');
      get(this, 'listaSolicitudesFondear').forEach((item)=> {
        if (get(item, 'seleccionado')) {
          solicitudes.push(get(item, 'id'));
        }
      });
      info('valor de a', solicitudes.join());
      info('valor de banco', movimientobanco);
    },
    cancelarCoinciliarMovimiento() {
      set(this, 'formaCoinciliar', false);
    },
    quitarSolicitud(r) {
      set(r, 'seleccionado', false);
    },
    agregarSolicitud(r) {
      set(r, 'seleccionado', true);
    },
    toggleCoinciliarForm() {
      this.toggleProperty('formaCoinciliar');
      info('en boton coinciliar');
      let estatus = 6;
      let empresa = get(this, 'selectedEmpresa');
      let idbancoorigen = get(this, 'selectedBancoOrigen');
      set(this, 'listaSolicitudesFondear', Ember.A());
      this.store.query('gxsolicitudcheque', { empresa, estatus, idbancoorigen})
      .then((data)=> {
        data.setEach('seleccionado', false);
        set(this, 'listaSolicitudesFondear', data);
        info('si llego')
      },(error)=> {
        info('trono');
      });
    },
    guardarClasificar() {
      this.store.find('gxingresodetallereset', get(this, 'movimientoRecord.id'))
      .then((data)=> {
        info('si se hizo reset movimiento', get(this, 'movimientoRecord.id'));
        let partidasGuardar = get(this, 'listaPartidasEgresoGrabar');
        let idreferenciamovto = get(this, 'movimientoRecord.id')
        let movimientos = !isEmpty(get(this, 'movimientosForm')) ? get(this, 'movimientosForm') : 0 ;
        partidasGuardar.forEach((item, i)=> {
          let { centrocostoid, partida, subpartida1,
            subpartida2, subpartida3, subpartida4,
            subpartida5, cantidad, tipomovto} = getProperties(item, `centrocostoid partida subpartida1 subpartida2 
              subpartida3 subpartida4 subpartida5 cantidad tipomovto`.w());
          let record2 = this.store.createRecord('gxingresodetalle', {
            idreferenciamovto, centrocostoid, partida, subpartida1, subpartida2, subpartida3, subpartida4, subpartida5, cantidad, tipomovto, movimientos, idreferenciamovto
          });
          record2.save().then(()=> {
            info('se grabo partida', i);
            // this.send('toggleClasificarForm');
          }, (error)=> {
            info('error grabar partida');
          });
        });
        this.send('pedir');
        });
    },
    borrarPartida(id) {
      info('queriendo borrar partida', id);
      let objeto = get(this, 'listaPartidasEgresoGrabar').findBy('partida', id);
      info('valor de objeto en quitar', objeto);
      get(this, 'listaPartidasEgresoGrabar').removeObject(objeto);
      let total = totalValorDePartidas(get(this, 'listaPartidasEgresoGrabar'));
      set(this, 'totalValorPartidas', total);
      set(this, 'totalValorPartidasformated', this.formatter(total));
    },
    guardarPartida() {
      let partidaObjeto = get(this, 'valorPartidaEgreso');
      let partidaId = get(partidaObjeto, 'partidaID');
      let buscarDuplicado = get(this, 'listaPartidasEgresoGrabar').findBy('partidaID', partidaId);
      if (!isEmpty(buscarDuplicado)) {
        info('no existe va a brahar');
        info('valor de buscarDuplicado', buscarDuplicado);
        set(this, 'errorTitle', 'Partida Duplicada');
        set(this, 'errorMsg', 'No se Puede Guardar 2 veces la misma partida en la misma solicitud');
        set(this, 'errorModal', true);
      } else {
        // partida.total = get(this, 'totalPartida');
        partidaObjeto.centrocostoid = parseInt(get(this, 'selectedCentroCosto'));
        partidaObjeto.partida = parseInt(get(this, 'selectedPartidaEgreso.id'));
        partidaObjeto.subpartida1 = isEmpty(get(this, 'selectedsubPartida1.id')) !== true ? parseInt(get(this, 'selectedsubPartida1.id')) : -1;
        partidaObjeto.subpartida2 = isEmpty(get(this, 'selectedsubPartida2.id')) !== true ? parseInt(get(this, 'selectedsubPartida2.id')) : -1;
        partidaObjeto.subpartida3 = isEmpty(get(this, 'selectedsubPartida3.id')) !== true ? parseInt(get(this, 'selectedsubPartida3.id')) : -1;
        partidaObjeto.subpartida4 = isEmpty(get(this, 'selectedsubPartida4.id')) !== true ? parseInt(get(this, 'selectedsubPartida4.id')) : -1;
        partidaObjeto.subpartida5 = isEmpty(get(this, 'selectedsubPartida5.id')) !== true ? parseInt(get(this, 'selectedsubPartida5.id')) : -1;
        partidaObjeto.tipomovto = get(this, 'selectedMovimientoForma');
        partidaObjeto.cantidad = get(this, 'totalPartida');
        partidaObjeto.cantidadComas = this.formatter(get(this, 'totalPartida'));
        get(this, 'listaPartidasEgresoGrabar').pushObject(partidaObjeto);
        info('valor del objeto agregado', partidaObjeto);
        set(this, 'selectedTipoForma', 'A');
        info('entrando en guardarPartida', get(this, 'listaPartidasEgresoGrabar'));
        let total = totalValorDePartidas(get(this, 'listaPartidasEgresoGrabar'));
        set(this, 'totalValorPartidas', total);
        set(this, 'totalValorPartidasformated', this.formatter(total));
        set(this, 'selectedCentroCosto', '');
        set(this, 'totalPartida', '');
      }
    },
    grabarCantidad() {
      info('grabo la cantidad');
      let record = get(this, 'partidaEditarRecord');
      set(record, 'cantidad', get(this, 'valorEditarCantidad'));
      set(record, 'cantidadComas', this.formatter(get(this, 'valorEditarCantidad')));
      set(this, 'modalModificarCantidad', false);
      let total = totalValorDePartidas(get(this, 'listaPartidasEgresoGrabar'));
      set(this, 'totalValorPartidas', total);
      set(this, 'totalValorPartidasformated', this.formatter(total));
    },
    toggleClasificarForm() {
      this.toggleProperty('formaClasificar');
      set(this, 'listaPartidasEgresoGrabar', Ember.ArrayProxy.create({ content: [] }));
      set(this, 'movimientosForm', '');
    },
    editRecord(r) {
      set(this, 'formaActionMovimiento', false);
      set(this, 'formaMovimiento', true);
      //set(this, 'selectedEmpresa', get(r, 'empresa'));
      //set(this, 'selectedBancoOrigen');
      set(this, 'nullFechaCapturaInicialForma', get(r, 'fecha'));
      set(this, 'fechaForma', get(r, 'fecha'));
      set(this, 'selectedTipoForma', get(r, 'tipo'));
      set(this, 'cantidadForma', get(r, 'cantidad'));
      set(this, 'referenciaForma', get(r, 'referencia'));
      set(this, 'selectedEstatusForma', get(r, 'estatus'));
    },
    deleteRecord(r) {
      let record = r;
      record.deleteRecord();
      record.save().then(()=> {
      set(this, 'listaRequests', Ember.A());
      this.send('pedir');
      this.send('pedirSaldo', false);
      set(this, 'formaActionMovimiento', false);
      info('se borro registro');  
      });
    },
    backRecord(r) {
      set(this, 'movimientoRecord', null);
      set(this, 'formaActionMovimiento', false);
    },
    updateRecord() {
      let empresa = get(this, 'selectedEmpresa');
      let banco = get(this, 'selectedBancoOrigen');
      let fCaptura = get(this, 'fechaForma');
      let fecha = '';
      if (!isEmpty(fCaptura)) {
        fecha = moment(fCaptura).format('YYYY/MM/DD');
      } else {
        fecha = get(this, 'nullFechaCapturaInicialForma');
      }
      let tipo = get(this, 'selectedTipoForma');
      let cantidad = get(this, 'cantidadForma');
      let referencia = get(this, 'referenciaForma');
      let estatus = get(this, 'selectedEstatusForma');
      let record = get(this, 'movimientoRecord')
      record.setProperties({
        empresa, banco, fecha, tipo, cantidad, referencia, estatus
      });
      record.save()
      .then((data)=> {
        set(this, 'listaRequests', Ember.A());
        this.send('limpiarCamposForma');
        this.send('pedirSaldo', false);
        this.send('pedir');
        info('ya lo actualizo');
      }, (error)=> {
        info('fallo actualizar');
      })
      info('valores', empresa, banco, fecha, tipo, cantidad, referencia, estatus);
    },
    limpiarCamposForma() {
      // set(this, 'formaActionMovimiento', false);
      // set(this, 'formaMovimiento', true);
      // set(this, 'selectedEmpresa', get(r, 'empresa'));
      // set(this, 'selectedBancoOrigen');
      set(this, 'nullFechaCapturaInicialForma', null);
      set(this, 'fechaForma', null);
      set(this, 'selectedTipoForma', 'C');
      set(this, 'cantidadForma', '');
      set(this, 'referenciaForma', '');
      set(this, 'selectedEstatusForma', 'F');
    },
    traerRecord(movimientoid) {
      set(this, 'formaCoinciliar', false);
      set(this, 'formaClasificar', false);
      this.store.find('gxbancomovimiento', movimientoid)
      .then((data)=> {
        set(this, 'movimientoRecord', data);
        set(this, 'formaActionMovimiento', true);

        set(this, 'formaMovimiento', false);
      },(error)=> {
        info('trono');
      });
    },
    grabarMovimiento() {
      let empresa = get(this, 'selectedEmpresa');
      let banco = get(this, 'selectedBancoOrigen');
      let fCaptura = get(this, 'fechaForma');
      let fecha = moment(fCaptura).format('YYYY/MM/DD');
      let tipo = get(this, 'selectedTipoForma');
      let cantidad = get(this, 'cantidadForma');
      let referencia = get(this, 'referenciaForma');
      let estatus = get(this, 'selectedEstatusForma');
      let record = this.store.createRecord('gxbancomovimiento', {
        empresa, banco, fecha, tipo, cantidad, referencia, estatus
      });

      info('valor de record', empresa, banco, fecha, tipo, cantidad, referencia, estatus);
      record.save().then((r)=> {
        set(this, 'listaRequests', Ember.A());
        info('si se actulizo el registro');
        this.send('pedirSaldo', false);
        this.send('pedir');
        this.send('limpiarCamposForma');
      },(error)=> {
        info('error no se actualizo');
      });
    },
  	toggleFormaMovimiento() {
  	  this.toggleProperty('formaMovimiento');
      set(this, 'movimientoRecord', null);
      this.send('limpiarCamposForma');
      set(this, 'formaActionMovimiento', false);
  	},
  	pedirSaldo(r) {
      let objeto = {};
      objeto.banco = get(this, 'selectedBancoOrigen');
      if (r) {
        objeto.reconstruir = 1;
      }
  	  this.store.query('gxbancosaldo',  objeto )
  	  .then((data)=> {
        data.forEach((item)=> {
          info('data', get(item, 'saldo'));
          set(this, 'saldoBanco', get(item, 'saldo'));
        });
  	  }, (error)=> {
  	  	info('no llego');
  	  });
  	},
  	pedir() {
  	  let listaRequests = get(this, 'listaRequests');
      this.store.unloadAll('gxbancomovimiento');
      let objeto = {};
      let estatus = get(this, 'selectedEstatus');
      let empresa = get(this, 'selectedEmpresa');
      let banco = get(this, 'selectedBancoOrigen');
      let tipo = get(this, 'selectedMovimiento');
      let clasificado = get(this, 'selectedClasificado');
      let eliminado = get(this, 'selectedEliminado');
      let requestedPage = get(this, 'requestedPage');
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
      if (empresa) {
        objeto.empresa = empresa;
      }
      if (banco) {
        objeto.banco = banco
      }
      if (estatus) {
        objeto.estatus = estatus;
      }
      if (requestedPage) {
        objeto.page = get(this, 'requestedPage');
      }
      if (tipo) {
      	objeto.tipo = tipo;
      }
      if (clasificado) {
      	objeto.clasificado = clasificado;
      }
      if (eliminado) {
        objeto.eliminado = eliminado;
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
      this.store.query('gxbancomovimiento', objeto)
      .then((data)=> {
        let cuantos = get(data, 'meta.cuantos');
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
        this.store.query('gxbancomovimiento', objeto)
        .then((data)=> {
          // data.forEach((item)=> {})
          set(this, 'movimientosLista', data);
          set(this, 'resultPage', get(data, 'meta.page'));
          set(this, 'resultPages', get(data, 'meta.pages'));
          info(' de lresult pages', get(this, 'resultPages'), get(this, 'resultPage',));
          let objetoCache = listaRequests.findBy('query', cadena);
          if (!objetoCache) {
            info('agregandolo a la listaRequests');
            listaRequests.addObject({ query: cadena, cache_token: get(data, 'meta.cache_token') });
          }
        });
      }, (error)=> {
        info('trono');
      });

  	},
  	buscarMovimientos() {
  	  this.send('pedir');
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
      set(this, 'modalActionRecord', false);
      set(this, 'errorModal', false);
      set(this, 'saveSuccess', false);
    }
  }
});
