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
    total += parseFloat(item.cantidad);
    info('entro  dando vueltas en totalValorPartidas', item.cantidad);
  });
  return total;
};
export default Ember.Controller.extend(FormatterMixin, {
  operacionLista: [{ id: 'multicheque', label: 'Multicheque' }, { id: 'fondeo', label: 'Fondeo' }, { id: 'ninguna', label: 'Ninguna' }],
  anexoLista: [{ 'id': 'F', 'label': 'Factura' },{ 'id': 'C', 'label': 'Copia de la factura' },
  { 'id': 'P', 'label': 'presupuesto' },{ 'id': 'A', 'label': 'Autorizaciòn' }],
  especificacionesLista: [{ 'id': 'N', 'label': 'Cheque' }, { 'id': 'E', 'label': 'Cheque Certificado' },
  { 'id': 'A', 'label': 'Cheque de Caja' }, { 'id': 'D', 'label': 'Cotizar Tipo de Cambio DLLS' },
  { 'id': 'S', 'label': 'Spei' }, { 'id': 'T', 'label': 'Transferencia o Traspaso' }],
  tipoProgramacionLista: [{ 'id': 'E', 'label': 'Extemporanea' }],
  selectedAnexo: '',
  selectedEstatus: '',
  selectedEmpresa: '',
  selectedOperacion: '',
  selectedBancoOrigen: '',
  selectedEspecificaciones: '',
  selectedProgramacion: 'N',
  partidaEgresosLista: null,
  subpartida1Lista: null,
  subpartida2Lista: null,
  subpartida3Lista: null,
  subpartida4Lista: null,
  subpartida5Lista: null,
  selectedCentroCosto: '',
  selectedsubPartida1: '',
  selectedsubPartida2: '',
  selectedsubPartida3: '',
  selectedsubPartida4: '',
  selectedsubPartida5: '',
  valorPartidaEgreso: '',
  // listaPartidasEgresoGrabar: Ember.A(),
  totalValorPartidas: '',
  totalValorPartidasformated: '',
  banderaUltimaPartidaSeleccionada: false,
  totalPartida: '',
  resultPage: '',
  resultPages: '',
  requestedPage: '',
  fechaCapturaIncial: '',
  fechaCapturaFinal: '',
  nullFechaCapturaInicial: '',
  nullFechaCapturaFinal: '',
  fechaProgramadaIncial: '',
  fechaProgramadaFinal: '',
  nullFechaProgramadaInicial: '',
  nullFechaProgramadaFinal: '',
  nullFechaProgramadaSolicitud: '',
  fechaProgramadaSolicitud: '',
  listaRequests: Ember.A(),
  listaBeneficiarios: null,
  PagoEstimacion: false,
  beneficiarioBancoCuenta: null,
  bene: '',
  bancoDestinoSolicitud: '',
  plazaSolicitud: '',
  sucursalSolicitud: '',
  chequeSolicitud: '',
  claveCuentaSolicitud: '',
  errorMsg: '',
  errorTitle: '',
  errorModal: false,
  soloCliente: false,
  solicitudBuscar: '',
  titleDesenlaceSolicitud: '',
  desenlaSolicitud: false,
  solicitudDesenlace: '',
  selectedEmpresaEdicion: '',
  banderaClonar: false,
  recordSolicitudMaestro: '',
  IsComisionSolicitud: false,
  solicitudOtrosEgresosBandera: false,
  sort: '',
  conceptoOtrosEgresosLista: Ember.A(),
  selectedConcepto: '',
  blogsDetalleLista: null,
  BlogModal: false,
  init() {
    this._super(...arguments);
    set(this, 'listaPartidasEgresoGrabar', Ember.ArrayProxy.create({ content: [] }));
    info('viendo en le init el que quiero', get(this, 'listaPartidasEgresoGrabar'));
  },
  observaSelectedEstatus: observer('selectedEstatus', function() {
    set(this, 'requestedPage', '');
  }),
  observaSelectedEmpresa: observer('selectedEmpresa', function() {
    if (get(this, 'listaPartidasEgresoGrabar.length') > 0) {
      set(this, 'listaPartidasEgresoGrabar', Ember.ArrayProxy.create({ content: [] }));
      // if (isEmpty(get(this, 'selectedEmpresaEdicion')) === true) {
      // set(this, 'listaPartidasEgresoGrabar', Ember.A());
      // }
    }
    set(this, 'selectedCentroCosto', '');
    let empresa = get(this, 'selectedEmpresa');
    info('entro en selectedEmpresa', empresa);
    if (empresa !== '') {
      this.store.query('bancoorigen', { empresa }).then((data)=> {
        set(this, 'bancoOrigenLista', data);
        info('ya paso bacoorigen');
        this.store.query('centrocosto', { empresa }).then((data2)=> {
          set(this, 'centroCostoLista', data2);
        }, (error2)=> {
          info('trono error2');
        });
      }, (error)=> {
        info('error');
      });
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
  hayBeneficiarioNuevo: computed('beneficiarioNuevo', {
    get() {
      let beneficiario = get(this, 'beneficiarioNuevo');
      if (beneficiario >= 3) {
        return true;
      } else {
        return false;
      }
    }
  }),
  hayBene: computed('bene', {
    get() {
      let beneficiario = get(this, 'bene');
      if (get(this, 'bene').length >= 3) {
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
  tipoProgramacionBandera: computed('selectedProgramacion', {
    get() {
      if (get(this, 'selectedProgramacion') == 'N') {
        return true;
      } else {
        return false;
      }

    }
  }),
  quierover: computed.gt('listaPartidasEgresoGrabar.length', 0),
  levantaFormaSolicitud: computed('selectedBeneficiario', 'recordProvedor', {
    get() {
      let formaSolicitud = get(this, 'formaSolicitud');
      let selectedBeneficiario = get(this, 'selectedBeneficiario');
      let recordProvedor = get(this, 'recordProvedor');
      if (formaSolicitud && selectedBeneficiario) {
        return true;
      }
      if (recordProvedor && formaSolicitud) {
        return true;
      } else {
        return false;
      }
    }
  }),
  cuantosBeneficiarios: computed('listaBeneficiarios', {
    get() {
      let valor = get(this, 'listaBeneficiarios');
      let cuantos = get(valor, 'length');
      return cuantos;
    }
  }),
  computedBotonAceptarClonar: computed('motivoClonarSolicitud', 'numeroClonaciones', {
    get() {
      let motivo = get(this, 'motivoClonarSolicitud');
      let copias = get(this, 'numeroClonaciones');
      if (!isEmpty(motivo) && !isEmpty(copias)) {
        return true;
      } else {
        return false;
      }
    }
  }),
  observaSelectedNombre: observer('selectedBeneficiario', function() {
    info('valor de selectedBeneficiario siempre', get(this, 'selectedBeneficiario'));
    set(this, 'bancoDestinoSolicitud', '');
    set(this, 'plazaSolicitud', '');
    set(this, 'chequeSolicitud', '');
    set(this, 'sucursalSolicitud', '');
    set(this, 'claveCuentaSolicitud', '');
    set(this, 'selectedEspecificaciones', '');
    if (!isEmpty(get(this, 'selectedBeneficiario'))) {
      this.store.findRecord('gxsolicitudbeneficiario', get(this, 'selectedBeneficiario'))
      .then((data)=> {
        info('valor de data', data);
        set(this, 'beneficiarioBancoCuenta', data);
      });
    }
    // this.send('pedir');
    // this.store.unloadAll('gxsolicitudcheque');
    // this.store.query('gxsolicitudcheque', { beneficiario });
  }),
  observaIsCliente: observer('isCliente', function() {
    set(this, 'listaBeneficiarios', null);
    set(this, 'selectedBeneficiario', '');
    set(this, 'beneficiarioFiltro', '');
  }),
  observaBeneficiarioFiltro: observer('beneficiarioFiltro', function() {
    info('entro en beneficiarioFiltro ', get(this, 'probando'));
    let beneficiario = get(this, 'beneficiarioFiltro');
    let cliente = get(this, 'isCliente');
    let objeto = {};
    if (beneficiario.length >= 3) {
      objeto.nombrebeneficiario = beneficiario;
      if (cliente) {
        objeto.cliente = 1;
      }
      this.store.query('gxsolicitudbeneficiario', objeto)
      .then((data)=> {
        set(this, 'listaBeneficiarios', data);
        // set(this, 'cuantosBeneficiarios', get(data, 'length'));
        info('si llego beneficiario');
      }, (error)=> {
        info('error beneficiario');
      });
    }
  }),
  computedValueFiltroConceptoAndSelectedConcepto: computed('conceptoFiltro', 'selectedConcepto', {
    get() {
      let valor = get(this, 'conceptoFiltro');
      if (!isEmpty(get(this, 'selectedConcepto'))) {
        return { tipo: 'ingresado', concepto: get(this, 'selectedConcepto') };
      } else {
        return { tipo: 'nuevo', concepto: get(this, 'conceptoFiltro') };
      }
    }
  }),
  observaEspecificaciones: observer('selectedEspecificaciones', function() {
    if (!isEmpty(get(this, 'selectedEspecificaciones'))) {
      let r = get(this, 'beneficiarioBancoCuenta');
      info('valor de beneficiario', get(this, 'beneficiarioBancoCuenta'));
      info('valor de record', get(this, 'recordProvedor'));
      if (!isEmpty(get(this, 'recordProvedor')) && isEmpty(get(this, 'beneficiarioBancoCuenta'))) {
        r = get(this, 'recordProvedor');
      }

      // aqui va la cosa
      try {
        if (get(this, 'selectedEspecificaciones').includes('N') == true) {
          info('se va por cheque');
          set(this, 'bancoDestinoSolicitud', get(r, 'bancocheque'));
          set(this, 'plazaSolicitud', get(r, 'plazachque'));
          set(this, 'sucursalSolicitud', get(r, 'sucursalcheque'));
          set(this, 'claveCuentaSolicitud', get(r, 'clavecuentacheque'));
        }
        if (get(this, 'selectedEspecificaciones').includes('E') == true) {
          info('se va por cheque');
          set(this, 'bancoDestinoSolicitud', get(r, 'bancocheque'));
          set(this, 'plazaSolicitud', get(r, 'plazachque'));
          set(this, 'sucursalSolicitud', get(r, 'sucursalcheque'));
          set(this, 'claveCuentaSolicitud', get(r, 'clavecuentacheque'));
        }
        if (get(this, 'selectedEspecificaciones').includes('A') == true) {
          info('se va por cheque');
          set(this, 'bancoDestinoSolicitud', get(r, 'bancocheque'));
          set(this, 'plazaSolicitud', get(r, 'plazachque'));
          set(this, 'sucursalSolicitud', get(r, 'sucursalcheque'));
          set(this, 'claveCuentaSolicitud', get(r, 'clavecuentacheque'));
        }
        if (get(this, 'selectedEspecificaciones').includes('S') == true) {
          info('se va por spei');
          set(this, 'bancoDestinoSolicitud', get(r, 'banco'));
          set(this, 'plazaSolicitud', get(r, 'plaza'));
          set(this, 'sucursalSolicitud', get(r, 'sucursal'));
          set(this, 'claveCuentaSolicitud', get(r, 'clavecuenta'));
        }
        if (get(this, 'selectedEspecificaciones').includes('T') == true) {
          info('Transferencia');
          set(this, 'bancoDestinoSolicitud', get(r, 'banco'));
          set(this, 'plazaSolicitud', get(r, 'plaza'));
          set(this, 'sucursalSolicitud', get(r, 'sucursal'));
          set(this, 'claveCuentaSolicitud', get(r, 'clavecuenta'));
        }
        if (get(this, 'selectedEspecificaciones').includes('dlls') == true) {
          info('dorales');
        }
      } catch(error) {
        info('se fue por el cath');
      }
    }
  }),
  remaining: computed('listaPartidasEgresoGrabar.@each.cantidad', function() {
    return info('entro el el computed');
  }),
  estatusElaboradoACancelado:computed ('selectedEstatus', {
    get() {
      if(get(this, 'recordSolicitudMaestro.estatus') === 'E' && get(this, 'selectedEstatus') === 9) {
        info('aqui paso', get(this, 'recordSolicitudMaestro.estatus'), get(this, 'selectedEstatus'));
        return true;
      }
      if(get(this, 'recordSolicitudMaestro.estatus') === 'O' && get(this, 'selectedEstatus') === 14){
        return true;
      } else {
        info('aqui jaja', get(this, 'recordSolicitudMaestro.estatus'), get(this, 'selectedEstatus'));
        return false;
      }
    }
  }),
  actions: {
    CancelarEgreso(id) {
      set(this, 'CancelarModal', true);
    },
    CancelarAceptar() {
      info('se cancelo');
      set(this, 'CancelarModal', false);
    },
    cerrarCancelarModal() {
      info('se cerro');
      set(this, 'CancelarModal', false);
    },
    toggleFormaOtrosEgresos() {
      this.send('toggleFormaSolicitud');
      set(this, 'solicitudOtrosEgresosBandera', true);
      this.store.findAll('gxegresosotro').then((data)=> {
        info('si llego');
        set(this, 'conceptoOtrosEgresosLista', data);
      }, (error)=> {
        info('no llego');
      });

    },
    totalComisiones() {
      this.store.find('totalsolicitudcomisionable', 1)
      .then((data)=> {
        set(this, 'totalPartida', get(data, 'total'));
      });
    },
    togglePrinterComponent() {
      this.toggleProperty('showComponent');
    },
    guardarEditarSolicitud() {
      // checar las solicitudes otros egresos por que puede ser que el estatus no cambie por medio del la solixirud esixion
      info('entro en guardar editar solicitud');
      let r = get(this, 'recordSolicitudMaestro');
      let fechaprogramada = '';
      if (get(this, 'tipoProgramacionBandera') == true) {
        fechaprogramada = get(this, 'fechaprogramada');

      } else {
        let fCaptura = get(this, 'fechaProgramadaSolicitud');
        fechaprogramada = moment(fCaptura).format('YYYY/MM/DD');
      }
      info('valor de fgevha programada antes de grabar', fechaprogramada);
      if (isEmpty(fechaprogramada)) {
        set(this, 'errorModal', true);
        set(this, 'errorTitle', 'Error Fecha Programacion');
        set(this, 'errorMsg', 'La solicitud debe tener fecha de programacion');
        return;
      }
      let concepto = get(this, 'concepto');
      if (get(this, 'solicitudOtrosEgresosBandera')) {
        concepto = get(this, 'computedValueFiltroConceptoAndSelectedConcepto');
      } else {
        if (isEmpty(concepto)) {
          set(this, 'errorModal', true);
          set(this, 'errorTitle', 'No hay Concepto');
          set(this, 'errorMsg', 'La solicitud debe tener concepto');
          return;
        }
      }
      /*let concepto = get(this, 'concepto');
      if (isEmpty(concepto)) {
        set(this, 'errorModal', true);
        set(this, 'errorTitle', 'No hay Concepto');
        set(this, 'errorMsg', 'La solicitud debe tener concepto');
        return;
      }*/
      let anexo = get(this, 'selectedAnexo');
      if (get(this, 'solicitudOtrosEgresosBandera')) {
       anexo = 'O';
      } else {
        if (isEmpty(anexo)) {
          set(this, 'errorModal', true);
          set(this, 'errorTitle', 'Anexo');
          set(this, 'errorMsg', 'Debe de seleccionar algun tipo de anexo');
          return;
        }
      }
      /*let anexo = get(this, 'selectedAnexo');
      if (isEmpty(anexo)) {
        set(this, 'errorModal', true);
        set(this, 'errorTitle', 'Anexo');
        set(this, 'errorMsg', 'Debe de seleccionar algun tipo de anexo');
        return;
      }*/
      let fechacaptura = get(this, 'fechacaptura');
      let tipoprogramacion = get(this, 'selectedProgramacion');
      // fechaprogramada esta arriba ya lista
      // let empresaid = get(this, 'selectedEmpresa');
      // idbeneficiario esta arriba con validacion
      let devolucion = get(this, 'isCliente') === true ? 'S' : 'N';
      // concepto esta arriba con validacion
      let cantidad = get(this, 'totalValorPartidas');
      // anexo esta validado
      let anexoadicional = get(this, 'detalleAnexo');
      let especificaciones = get(this, 'selectedEspecificaciones');
      let idbancoorigen  = get(this, 'selectedBancoOrigen') === '' ? -1 : get(this, 'selectedBancoOrigen');
      let numerochequeorigen = get(this, 'chequeSolicitud');
      let bancodestino = get(this, 'bancoDestinoSolicitud');
      let sucursaldestino = get(this, 'sucursalSolicitud');
      let plazadestino = get(this, 'plazaSolicitud');
      let clavebancariadestino = get(this, 'claveCuentaSolicitud');
      let observaciones = get(this, 'observaciones');
      // let estatus = 'S';
      let estatus = get(this, 'selectedEstatus');
      let objetoEstatus = get(this, 'estatusLista').findBy('id', estatus);
      estatus = objetoEstatus.estatus;
      let pagoestimacion = get(this, 'PagoEstimacion');
      // let usuariosolicitante = '';
      let idfondeo = 0;
      let cantidadcheque = 0;
      info('se asignan valores a variables');
      if (get(this, 'solicitudOtrosEgresosBandera')) {
        r.setProperties({
          fechacaptura, 
          //tipoprogramacion, 
          fechaprogramada,
          // empresaid,
          // idbeneficiario,
          //devolucion, 
          concepto: 'OTRO EGRESO', cantidad, anexo: 'O', anexoadicional, especificaciones: 'O',
          idbancoorigen, 
          //numerochequeorigen, 
          bancodestino, sucursaldestino, plazadestino,
          clavebancariadestino, observaciones, estatus,
          // usuariosolicitante,
          idfondeo, cantidadcheque, pagoestimacion
        });
        if (get(this, 'computedValueFiltroConceptoAndSelectedConcepto.tipo') === 'nuevo') {
          info('entro en lo que queria que es nuevo');
          let ra = this.store.createRecord('gxegresosotro', {descripcion: get(this, 'computedValueFiltroConceptoAndSelectedConcepto.concepto') })
          ra.save().then((d)=> {
            r.idreferenciaotros = get(d, 'id');
            r.save().then((data)=> {
              let idcheque = get(data, 'id');
              let partidasGuardar = get(this, 'listaPartidasEgresoGrabar');
              partidasGuardar.forEach((item, i)=> {
                let { centrocostoid, partida, subpartida1,
                subpartida2, subpartida3, subpartida4,
                subpartida5, cantidad } = getProperties(item, 'centrocostoid partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5 cantidad'.w());
                let record2 = this.store.createRecord('gxsolicitudchequedetalle', {
                  idcheque, centrocostoid, partida, subpartida1, subpartida2, subpartida3, subpartida4, subpartida5, cantidad
                });
                record2.save().then(()=> {
                  info('se grabo partida', i);
                }, (error)=> {
                  info('error grabar partida al actualizar maestro');
                });
              });
              this.send('toggleFormaSolicitud');
                  set(this, 'formaSolicitud', false);
                  // let r = get(this, 'recordSolicitudMaestro');
                  set(this, 'recordSolicitudMaestro', '');
                  this.store.unloadAll('gxsolicitudcheque');
                  // aqui
                  set(this, 'listaRequests', Ember.A());
                  this.store.unloadAll('gxsolicitudcheque');
                  this.store.query('gxsolicitudcheque', { estatus: 2 })
                  .then((data)=> {
                    set(this, 'solicitudesLista', data);
                  });
              }, (error)=> {
                info('trono el actulizar el maestro');
            });
          });
        } else {
          r.idreferenciaotros = get(this, 'computedValueFiltroConceptoAndSelectedConcepto.tipo');
          r.save().then((data)=> {
            let idcheque = get(data, 'id');
            let partidasGuardar = get(this, 'listaPartidasEgresoGrabar');
            partidasGuardar.forEach((item, i)=> {
              let { centrocostoid, partida, subpartida1,
              subpartida2, subpartida3, subpartida4,
              subpartida5, cantidad } = getProperties(item, 'centrocostoid partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5 cantidad'.w());
              let record2 = this.store.createRecord('gxsolicitudchequedetalle', {
                idcheque, centrocostoid, partida, subpartida1, subpartida2, subpartida3, subpartida4, subpartida5, cantidad
              });
              record2.save().then(()=> {
                info('se grabo partida', i);
              }, (error)=> {
                info('error grabar partida al actualizar maestro');
              });
            });
            this.send('toggleFormaSolicitud');
            set(this, 'formaSolicitud', false);
            // let r = get(this, 'recordSolicitudMaestro');
            set(this, 'recordSolicitudMaestro', '');
            this.store.unloadAll('gxsolicitudcheque');
            set(this, 'listaRequests', Ember.A());
            this.store.unloadAll('gxsolicitudcheque');
            this.store.query('gxsolicitudcheque', { estatus: 2 })
            .then((data)=> {
              set(this, 'solicitudesLista', data);
            });
            }, (error)=> {
              info('trono el actulizar el maestro');
          });
        }
      } else {
        r.setProperties({
          fechacaptura, tipoprogramacion, fechaprogramada,
          // empresaid,
          // idbeneficiario,
          devolucion, concepto, cantidad, anexo, anexoadicional, especificaciones,
          idbancoorigen, numerochequeorigen, bancodestino, sucursaldestino, plazadestino,
          clavebancariadestino, observaciones, estatus, idfondeo, cantidadcheque, pagoestimacion
          // usuariosolicitante,
        });
      r.save().then((data)=> {
        let idcheque = get(data, 'id');
        let partidasGuardar = get(this, 'listaPartidasEgresoGrabar');
        partidasGuardar.forEach((item, i)=> {
          let { centrocostoid, partida, subpartida1,
            subpartida2, subpartida3, subpartida4,
            subpartida5, cantidad } = getProperties(item, 'centrocostoid partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5 cantidad'.w());
          let record2 = this.store.createRecord('gxsolicitudchequedetalle', {
            idcheque, centrocostoid, partida, subpartida1, subpartida2, subpartida3, subpartida4, subpartida5, cantidad
          });
          record2.save().then(()=> {
            info('se grabo partida', i);
          }, (error)=> {
            info('error grabar partida al actualizar maestro');
          });
        });
        this.send('toggleFormaSolicitud');
            set(this, 'formaSolicitud', false);
            // let r = get(this, 'recordSolicitudMaestro');
            set(this, 'recordSolicitudMaestro', '');
            this.store.unloadAll('gxsolicitudcheque');
            set(this, 'listaRequests', Ember.A());
            this.store.unloadAll('gxsolicitudcheque');
            this.store.query('gxsolicitudcheque', { estatus: 2 })
            .then((data)=> {
              set(this, 'solicitudesLista', data);
            });
      }, (error)=> {
        info('trono el actulizar el maestro');
      });
     }
    },
    clonarSolicitud() {
      let solicitudbase = get(this, 'solicitudDesenlace.solicitud');
      let motivo = get(this, 'motivoClonarSolicitud');
      let numeroclonaciones = get(this, 'numeroClonaciones');
      let record = this.store.createRecord('gxsolicitudchequemaestroclon', {
        solicitudbase,
        motivo,
        numeroclonaciones
      });
      record.save()
      .then(()=> {
        info('se grabo clonacion');
        set(this, 'motivoClonarSolicitud', '');
        set(this, 'numeroClonaciones', '');
        set(this, 'banderaClonar', false);
        set(this, 'desenlaSolicitud', false);

      }, (error)=> {
        info('trono clonacion');
      });
    },
    toggleFormaClonar() {
      this.toggleProperty('banderaClonar');
      set(this, 'motivoClonarSolicitud', '');
      set(this, 'numeroClonaciones', '');
    },
    levantaDesenlceSolicitud(solicitud, nombre) {
      set(this, 'titleDesenlaceSolicitud', `Solicitud ${solicitud}`);
      set(this, 'solicitudDesenlace', { solicitud, nombre });
      set(this, 'desenlaSolicitud', true);
    },
    cerrarDesenlaceSolicitud() {
      info('se fue por cerraer');
      set(this, 'desenlaSolicitud', false);
      set(this, 'titleDesenlaceSolicitud', '');
      // set(this, 'solicitudDesenlace', '');
      set(this, 'banderaClonar', false);
      set(this, 'motivoClonarSolciitud', '');
      set(this, 'numeroClonaciones', '');
      // set(this,'recordSolicitudMaestro', '');
      /*this.store.unloadAll('gxsolicitudcheque');
      this.store.query('gxsolicitudcheque', { estatus: 2 })
      .then((data)=> {
        set(this, 'solicitudesLista', data);
      }, (error)=> {
        info('trono recargar gxsolicitudcheque en clonar');
      });*/
    },
    CambiarEstatusACancelado() {
      // aqui tengo que ver si es de otros egresos o de cheques
      let r = get(this, 'recordSolicitudMaestro');
      let estatus = get(r, 'estatus');
      if (estatus === 'O') {
       set(r, 'estatus', 'N');
       r.save().then((data)=> {
        info('si se grabo otros egresos');
        let idcheque = get(data, 'id');
        let partidasGuardar = get(this, 'listaPartidasEgresoGrabar');
                partidasGuardar.forEach((item, i)=> {
                  let { centrocostoid, partida, subpartida1,
                  subpartida2, subpartida3, subpartida4,
                  subpartida5, cantidad } = getProperties(item, 'centrocostoid partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5 cantidad'.w());
                  let record2 = this.store.createRecord('gxsolicitudchequedetalle', {
                    idcheque, centrocostoid, partida, subpartida1, subpartida2, subpartida3, subpartida4, subpartida5, cantidad
                  });
                  record2.save().then(()=> {
                    info('se grabo partida', i);
                    // this.store.unloadAll('gxsolicitudcheque');
                  }, (error)=> {
                    info('error grabar partida');
                  });
                });
                this.send('toggleFormaSolicitud');
                set(this, 'formaSolicitud', false);
                // set(this, 'estatusElaboradoACancelado', false);
                set(this, 'listaRequests', Ember.A());
                this.send('pedir');
       },(error)=> {
        info('error en cambiar estatus a cancelado otros egresos');
       });
      } else {
        set(r, 'estatus', 'C');
        r.save().then((data)=> {
          let idcheque = get(data, 'id');
          info('si se grabo');
          let partidasGuardar = get(this, 'listaPartidasEgresoGrabar');
                partidasGuardar.forEach((item, i)=> {
                  let { centrocostoid, partida, subpartida1,
                  subpartida2, subpartida3, subpartida4,
                  subpartida5, cantidad } = getProperties(item, 'centrocostoid partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5 cantidad'.w());
                  let record2 = this.store.createRecord('gxsolicitudchequedetalle', {
                    idcheque, centrocostoid, partida, subpartida1, subpartida2, subpartida3, subpartida4, subpartida5, cantidad
                  });
                  record2.save().then(()=> {
                    info('se grabo partida', i);
                    // this.store.unloadAll('gxsolicitudcheque');
                  }, (error)=> {
                    info('error grabar partida');
                  });
                });
                this.send('toggleFormaSolicitud');
                set(this, 'formaSolicitud', false);
                // set(this, 'estatusElaboradoACancelado', false);
                set(this, 'listaRequests', Ember.A());
                this.send('pedir');
        },(error)=> {
          info('error en cambiar estatus a cancelado');
        });
      }

    },
    detalleBlog(solicitud, estatus) {
      info('detalle del blog', solicitud, estatus);
      // estatus va a funcionar cuando necesite en blogs otros egresos
      let lista = Ember.A();
      this.store.query('blogentry', {model: 'solicitud_cheque', pk: solicitud})
      .then((data)=> {
        data.forEach((item)=> {
          lista.pushObject(getProperties(item, 'usuario estatus content fecha'.w()));
        });
        set(this, 'blogsDetalleLista', lista);
        set(this, 'blogtitle', `Blog de solicitud ${solicitud}`);
        set(this, 'BlogModal', true);
      },(error)=> {
        info('trono blogentry');
      });
    },
    cerrarBlogModal() {
      set(this, 'BlogModal', false);
    },
    editarSolicitud(solicitudObjeto) {
      set(this, 'disabledEditarSolicitudFlag', false);
      let solicitud = get(solicitudObjeto, 'solicitud');
      // info('valor de solicitud', solicitudObjeto);
      let idbancoorigen = '';
      this.store.find('gxsolicitudchequemaestro', solicitud)
      .then((item)=> {
        set(this, 'recordSolicitudMaestro', item);
        set(this, 'selectedBeneficiario', get(item, 'idbeneficiario'));
        if (get(this, 'contaFlag')) {
          set(this, 'listaEstatusPerfil', [{ 'id': 2, 'label': 'Solicitud', 'estatus': 'S' },
          { 'id': 3, 'label': 'Revisado', 'estatus': 'R' }, { 'id': 4, 'label': 'Autorizado', 'estatus': 'A' },
          { 'id': 5, 'label': 'Elaborado', 'estatus': 'E' }]);
        }
        if (get(this, 'finanzasFlag')) {
          info('entro en finanzas');
          set(this, 'listaEstatusPerfil', [
            { 'id': 2, 'label': 'Solicitud', 'estatus': 'S' },
            { 'id': 3, 'label': 'Revisado', 'estatus': 'R' },
            { 'id': 4, 'label': 'Autorizado', 'estatus': 'A' },
            { 'id': 5, 'label': 'Elaborado', 'estatus': 'E' },
            { 'id': 6, 'label': 'Fondeado', 'estatus': 'F' },
            { 'id': 7, 'label': 'Cobrado', 'estatus': 'B' },
            { 'id': 8, 'label': 'Retenido', 'estatus': 'T' }]);
        }
        if (get(this, 'contaFlag') === false && get(this, 'finanzasFlag') === false) {
          set(this, 'listaEstatusPerfil', [{ 'id': 2, 'label': 'Solicitud', 'estatus': 'S' }]);
        }
        let estatus = get(item, 'estatus');
        let objetoEstatus = get(this, 'estatusLista').findBy('estatus', estatus);
        let idEstatus = get(objetoEstatus, ('id'));
        info('valor de objetoEstatus', objetoEstatus, idEstatus);
        let estatusEncontrado = false;
        let lista = Ember.A();
        lista.pushObject(objetoEstatus);
        set(this, 'selectedEstatus', idEstatus);
        set(this, 'estatusSolicitudFlag', estatus === 'S' ? true : false);
        get(this, 'listaEstatusPerfil').forEach((item, i)=> {
          if (estatusEncontrado) {
            lista.pushObject(item);
            estatusEncontrado = false;
          }
          if (estatus === get(item, 'estatus')) {
            estatusEncontrado = true;
          }
        });
        if (estatus === 'C') {
          lista.pushObject({ 'id': 2, 'label': 'Solicitud', 'estatus': 'S' });
        }
        if (estatus !== 'C' && estatus !== 'N') {
          lista.pushObject({ 'id': 9, 'label': 'Cancelado', 'estatus': 'C' });
        }
        if (estatus === 'E') {
          lista = Ember.A();
          lista.pushObject({ 'id': 5, 'label': 'Elaborado', 'estatus': 'E' });
          lista.pushObject({ 'id': 9, 'label': 'Cancelado', 'estatus': 'C' });
          set(this, 'disabledEditarSolicitudFlag', true);
          set(this, 'selectedEstatus', 5);
        }
        if (estatus === 'F') {
          lista = Ember.A();
          lista.pushObject({ 'id': 6, 'label': 'Fondeado', 'estatus': 'F' });
          lista.pushObject({ 'id': 8, 'label': 'Retenido', 'estatus': 'T' });
          set(this, 'selectedEstatus', 6);
        }
        if (estatus === 'P') {
          lista = Ember.A();
          lista.pushObject({ 'id': 13, 'label': 'Otro Aplicado', 'estatus': 'P' });
          set(this, 'disabledEditarSolicitudFlag', true);
          set(this, 'selectedEstatus', 13);
        }
        set(this, 'listaEstatusSiguiente', lista);
        info('valor de lista terminando ciclo', lista);
        let nombre = get(this, 'solicitudDesenlace.nombre');
        if (estatus === 'O') {
          set(this, 'disabledEditarSolicitudFlag', true);
          let lista = Ember.A();
          lista.pushObject({ 'id': 12, 'label': 'Otros No Aplicado', 'estatus': 'O' });
          lista.pushObject({ 'id': 14, 'label': 'Otro Cancelado', 'estatus': 'N' });
          set(this, 'listaEstatusSiguiente', lista);
          set(this, 'selectedEstatus', 12);
          set(this, 'solicitudOtrosEgresosBandera', true);
          this.store.findAll('gxegresosotro').then((data)=> {
            info('si llego');
            set(this, 'conceptoOtrosEgresosLista', data);
            let idreferenciaotros = get(this, 'recordSolicitudMaestro.idreferenciaotros');
            let buscar = get(this, 'conceptoOtrosEgresosLista').findBy('id', `${idreferenciaotros}`);
            info('valor de idreferneciaotros',buscar);
            set(this, 'selectedConcepto', buscar.id);
          }, (error)=> {
            info('no llego');
          });
        }
        if(estatus ==='B') {
          let lista = Ember.A();
          lista.pushObject({ 'id': 7, 'label': 'Cobrado', 'estatus': 'B' })
          set(this, 'selectedEstatus', 7);
          set(this, 'disabledEditarSolicitudFlag', true);
          set(this, 'listaEstatusSiguiente', lista);
        }

        let provedor = { 'id': get(item, 'idbeneficiario'), nombre };
        set(this, 'recordProvedor', provedor);
        set(this, 'selectedProgramacion', get(item, 'tipoprogramacion'));
        set(this, 'fechaProgramadaSolicitud', get(item, 'fechaprogramada'));
        // set(this, 'totalValorPartidas', get(item, 'cantidad'));
        set(this, 'concepto', get(item, 'concepto'));
        set(this, 'selectedAnexo', get(item, 'anexo'));
        set(this, 'detalleAnexo', get(item, 'anexoadicional'));
        set(this, 'observaciones', get(item, 'observaciones'));
        get(this, 'empresasLista').forEach((empresa1)=> {
          if (parseInt(get(item, 'empresaid')) === parseInt(get(empresa1, 'id'))) {
            set(this, 'selectedEmpresaEdicion', empresa1);
            set(this, 'selectedEmpresa', parseInt(get(empresa1, 'id')));
          }
        });
        set(this, 'selectedEspecificaciones', get(item, 'especificaciones'));
        // necesitamos un runlater auqi para cargar el banco origen desde maaestros
        // set(this, 'selectedBancoOrigen', get(item, 'idbancoorigen'));
        idbancoorigen = get(item, 'idbancoorigen');
        info('valor idbancoorigen', idbancoorigen);
        // let bancoSolicitud = get(this, 'bancoOrigenLista').findBy('id', )



        set(this, 'bancoDestinoSolicitud', get(item, 'bancodestino'));
        set(this, 'plazaSolicitud', get(item, 'plazadestino'));
        set(this, 'PagoEstimacion', get(item, 'pagoestimacion'));
        set(this, 'chequeSolicitud', get(item, 'numerochequeorigen'));
        set(this, 'sucursalSolicitud', get(item, 'sucursaldestino'));
        set(this, 'claveCuentaSolicitud', get(item, 'clavebancariadestino'));
        set(this, 'formaSolicitud', true);
        set(this, 'desenlaSolicitud', false);
        return this.store.query('gxsolicitudchequedetalle', { solicitud });
      }).then((partidasRes)=> {
        let lista = Ember.ArrayProxy.create({ content: [] });
        let total = 0;
        partidasRes.forEach((item)=> {
          let objeto = {};
          delete item.id;
          delete item.idcheque;
          objeto.cantidad = get(item, 'cantidad');
          objeto.cantidadComas = this.formatter(get(item, 'cantidad'));
          total += parseFloat(get(item, 'cantidad'));
          objeto.centrocostoid = get(item, 'centrocostoid');
          let { partida, subpartida1,
            subpartida2, subpartida3,
            subpartida4, subpartida5 } = getProperties(item, 'partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5'.w());
          objeto.partida = partida;
          objeto.subpartida1 = subpartida1;
          objeto.subpartida2 = subpartida2;
          objeto.subpartida3 = subpartida3;
          objeto.subpartida4 = subpartida4,
          objeto.subpartida5 = subpartida5;
          let llaves = 'partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5'.w();
          let nombrePartida = '';
          let partidaBuscar = '';
          llaves.forEach((k)=> {
            info('valor de las llaves', get(item, k));
            info('checando', !isEmpty(get(item, k)));
            if (parseInt(get(item, k)) !== -1) {
              partidaBuscar = get(item, k);
            }
          });
          this.store.find('partidaegreso', partidaBuscar)
          .then((item3)=> {
            nombrePartida = get(item3, 'descripcion');
            objeto.nombrePartida = nombrePartida;
            objeto.partidaID = partidaBuscar;
            lista.pushObject(objeto);
          }, (error3)=> {
          });
        });
        set(this, 'selectedBancoOrigen', `${idbancoorigen}`);
        set(this, 'listaPartidasEgresoGrabar', lista);
        info('viendo la que quiero ', get(this, 'listaPartidasEgresoGrabar'));
        set(this, 'totalValorPartidasformated', this.formatter(total));
        set(this, 'totalValorPartidas', total);
      });
    },
    guardarSolicitud() {
      let solicitudOtrosEgresosBandera = get(this, 'solicitudOtrosEgresosBandera');
      let fechaprogramada = '';
      if (get(this, 'tipoProgramacionBandera') == true) {
        fechaprogramada = get(this, 'fechaprogramada');

      } else {
        let fCaptura = get(this, 'fechaProgramadaSolicitud');
        fechaprogramada = !isEmpty(fCaptura) ? fCaptura.format('YYYY/MM/DD') : '';
      }
      if (isEmpty(fechaprogramada)) {
        set(this, 'errorModal', true);
        set(this, 'errorTitle', 'Error Fecha Programacion');
        set(this, 'errorMsg', 'La solicitud debe tener fecha de programacion');
        return;
      }
      let idbeneficiario = get(this, 'selectedBeneficiario');
      let recordProvedor = get(this, 'recordProvedor');
      if (isEmpty(idbeneficiario) && isEmpty(recordProvedor)) {
        set(this, 'errorModal', true);
        set(this, 'errorTitle', 'No hay Beneficiario');
        set(this, 'errorMsg', 'La solicitud debe tener un beneficiario');
        return;
      }
      if (recordProvedor) {
        idbeneficiario = get(this, 'recordProvedor.id');
      }
      // let conceptoOtrosEgresos = get(this, 'computedValueFiltroConceptoAndSelectedConcepto');
      let concepto = get(this, 'concepto');
      if (get(this, 'solicitudOtrosEgresosBandera')) {
        concepto = get(this, 'computedValueFiltroConceptoAndSelectedConcepto');
      } else {
        if (isEmpty(concepto)) {
          set(this, 'errorModal', true);
          set(this, 'errorTitle', 'No hay Concepto');
          set(this, 'errorMsg', 'La solicitud debe tener concepto');
          return;
        }
      }
      let anexo = get(this, 'selectedAnexo');
      if (get(this, 'solicitudOtrosEgresosBandera')) {
       anexo = 'O';
      } else {
        if (isEmpty(anexo)) {
          set(this, 'errorModal', true);
          set(this, 'errorTitle', 'Anexo');
          set(this, 'errorMsg', 'Debe de seleccionar algun tipo de anexo');
          return;
        }
      }
      let fechacaptura = get(this, 'fechacaptura');
      let tipoprogramacion = get(this, 'selectedProgramacion');
      // fechaprogramada esta arriba ya lista
      let empresaid = get(this, 'selectedEmpresa');
      // idbeneficiario esta arriba con validacion
      let devolucion = get(this, 'isCliente') === true ? 'S' : 'N';
      // concepto esta arriba con validacion
      let cantidad = get(this, 'totalValorPartidas');
      // anexo esta validado
      let anexoadicional = get(this, 'detalleAnexo');
      let especificaciones = get(this, 'selectedEspecificaciones');
      let idbancoorigen  = get(this, 'selectedBancoOrigen') === '' ? -1 : get(this, 'selectedBancoOrigen');
      let numerochequeorigen = get(this, 'chequeSolicitud');
      let bancodestino = get(this, 'bancoDestinoSolicitud');
      let sucursaldestino = get(this, 'sucursalSolicitud');
      let plazadestino = get(this, 'plazaSolicitud');
      let clavebancariadestino = get(this, 'claveCuentaSolicitud');
      let observaciones = get(this, 'observaciones');
      let estatus = 'S';
      if (get(this, 'IsComisionSolicitud')) {
        estatus = 'Y';
      }
      let pagoestimacion = get(this, 'PagoEstimacion');
      let usuariosolicitante = '';
      let idfondeo = 0;
      let cantidadcheque = 0;
      let idreferenciaotros = '';
      let valores = {};
      info('se asignan valores a variables');
      if (get(this, 'solicitudOtrosEgresosBandera')) {
        valores = {
          fechacaptura, tipoprogramacion, fechaprogramada, empresaid, idbeneficiario,
          concepto:"OTRO EGRESO",
          cantidad,
          anexo: 'O',
          anexoadicional: '',
          especificaciones: 'O', idbancoorigen, numerochequeorigen:'', bancodestino: '',
          sucursaldestino: '', plazadestino: '', clavebancariadestino: '', observaciones,
          estatus: 'O',
          usuariosolicitante,
          idfondeo, cantidadcheque,
          idreferenciaotros,
          pagoestimacion };
          if (get(this, 'computedValueFiltroConceptoAndSelectedConcepto.tipo') === 'nuevo') {
            info('entro en lo que queria que es nuevo');
            let ra = this.store.createRecord('gxegresosotro', {descripcion: get(this, 'computedValueFiltroConceptoAndSelectedConcepto.concepto') })
            ra.save().then((d)=> {
              valores.idreferenciaotros = get(d, 'id');
              let record = this.store.createRecord('gxsolicitudchequemaestro', valores);
              record.save().then((data)=> {
                info('si se grabo Maestro');
                let idcheque = get(data, 'id');
                let partidasGuardar = get(this, 'listaPartidasEgresoGrabar');
                partidasGuardar.forEach((item, i)=> {
                  let { centrocostoid, partida, subpartida1,
                  subpartida2, subpartida3, subpartida4,
                  subpartida5, cantidad } = getProperties(item, 'centrocostoid partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5 cantidad'.w());
                  let record2 = this.store.createRecord('gxsolicitudchequedetalle', {
                    idcheque, centrocostoid, partida, subpartida1, subpartida2, subpartida3, subpartida4, subpartida5, cantidad
                  });
                  record2.save().then(()=> {
                    info('se grabo partida', i);
                    set(this, 'listaRequests', Ember.A());
                    this.send('toggleFormaSolicitud');
                    set(this, 'formaSolicitud', false);
                    //
                    //
                  }, (error)=> {
                    info('error grabar partida');
                  });
                });
                this.send('pedir');
              }, (error)=> {
                info('no se grabo');
              });
            });
          } else {
            valores.idreferenciaotros = get(this, 'selectedConcepto');
            info('el concepto ya exite');
            let record = this.store.createRecord('gxsolicitudchequemaestro', valores);
            record.save().then((data)=> {
              info('si se grabo Maestro');
              let idcheque = get(data, 'id');
              let partidasGuardar = get(this, 'listaPartidasEgresoGrabar');
              partidasGuardar.forEach((item, i)=> {
                let { centrocostoid, partida, subpartida1,
                  subpartida2, subpartida3, subpartida4,
                  subpartida5, cantidad } = getProperties(item, 'centrocostoid partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5 cantidad'.w());
                let record2 = this.store.createRecord('gxsolicitudchequedetalle', {
                  idcheque, centrocostoid, partida, subpartida1, subpartida2, subpartida3, subpartida4, subpartida5, cantidad
                });
                record2.save().then(()=> {
                  info('se grabo partida', i);
                  this.send('toggleFormaSolicitud');
                  set(this, 'formaSolicitud', false);
                }, (error)=> {
                  info('error grabar partida');
                });
              });
            }, (error)=> {
              info('no se grabo');
            });
          }
        } else {
        valores = {
          fechacaptura, tipoprogramacion, fechaprogramada, empresaid, idbeneficiario,
          devolucion, concepto, cantidad, anexo, anexoadicional, especificaciones,
          idbancoorigen, numerochequeorigen, bancodestino, sucursaldestino, plazadestino,
          clavebancariadestino, observaciones, estatus, usuariosolicitante,
          idfondeo, cantidadcheque, pagoestimacion
        };
        let record = this.store.createRecord('gxsolicitudchequemaestro', valores);
        record.save().then((data)=> {
        info('si se grabo Maestro');
        let idcheque = get(data, 'id');
        let partidasGuardar = get(this, 'listaPartidasEgresoGrabar');
        partidasGuardar.forEach((item, i)=> {
          let { centrocostoid, partida, subpartida1,
            subpartida2, subpartida3, subpartida4,
            subpartida5, cantidad } = getProperties(item, 'centrocostoid partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5 cantidad'.w());
          let record2 = this.store.createRecord('gxsolicitudchequedetalle', {
            idcheque, centrocostoid, partida, subpartida1, subpartida2, subpartida3, subpartida4, subpartida5, cantidad
          });
          record2.save().then(()=> {
            info('se grabo partida', i);
            this.send('toggleFormaSolicitud');
            set(this, 'formaSolicitud', false);
          }, (error)=> {
            info('error grabar partida');
          });
        });
        this.send('pedir');
        }, (error)=> {
          info('no se grabo');
        });
      }
    },
    okCerrarModal() {
      info('cerrando el modal');
      set(this, 'errorModal', false);
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
        partidaObjeto.cantidad = get(this, 'totalPartida');
        partidaObjeto.cantidadComas = this.formatter(get(this, 'totalPartida'));
        get(this, 'listaPartidasEgresoGrabar').pushObject(partidaObjeto);
        info('valor del objeto agregado', partidaObjeto);
        info('entrando en guardarPartida', get(this, 'listaPartidasEgresoGrabar'));
        let total = totalValorDePartidas(get(this, 'listaPartidasEgresoGrabar'));
        set(this, 'totalValorPartidas', total);
        set(this, 'totalValorPartidasformated', this.formatter(total));
        set(this, 'selectedCentroCosto', '');
        set(this, 'totalPartida', '');
      }
    },
    modificarCantidad(record) {
      set(this, 'modalModificarCantidad', true);
      info('entrando en modificar cantidad',record);
      set(this, 'partidaEditarRecord', record);
    },
    cerrarModalCantidad() {
      info('cerrar modalcantidad bien');
      set(this, 'partidaEditarRecord', '');
      set(this, 'modalModificarCantidad', false);
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

    buscarSolicitudes() {
      this.send('pedir');
    },
    limpiarFiltros() {
      this.setProperties({
        selectedEstatus: '',
        selectedOperacion: '',
        selectedEmpresa: '',
        listaBeneficiarios: null,
        selectedBeneficiario: '',
        beneficiarioFiltro: '',
        solicitudBuscar: ''
      });
      '#fecha1 #fecha2 #fecha3 #fecha4'.w().forEach((item)=> {
        $(item).data('DateTimePicker').date(null);
      });
    },
    pedir() {
      let listaRequests = get(this, 'listaRequests');
      this.store.unloadAll('gxsolicitudcheque');
      let objeto = {};
      let beneficiario = get(this, 'selectedBeneficiario');
      let estatus = get(this, 'selectedEstatus');
      let empresa = get(this, 'selectedEmpresa');
      let operacion = get(this, 'selectedOperacion');
      let requestedPage = get(this, 'requestedPage');
      let fCapturaInicial = get(this, 'fechaCapturaInicial');
      let fechaCapturainicial = !isEmpty(fCapturaInicial) ? fCapturaInicial.format('YYYY/MM/DD') : '';
      let fCapturaFinal = get(this, 'fechaCapturaFinal');
      let fechaCapturafinal = !isEmpty(fCapturaFinal) ? fCapturaFinal.format('YYYY/MM/DD') : '';
      if (get(this, 'soloCliente')) {
        objeto.devolucion = 'S';
      }
      if (!isEmpty(get(this, 'solicitudBuscar'))) {
        objeto.solicitud = get(this, 'solicitudBuscar');
      }
      if (!isEmpty(beneficiario)) {
        objeto.beneficiario = beneficiario;
      }
      if (fechaCapturainicial) {
        objeto.fechacapturainicial = fechaCapturainicial;
      }
      if (fechaCapturafinal) {
        objeto.fechacapturafinal = fechaCapturafinal;
      }
      let fProgramadaInicial = get(this, 'fechaProgramadaInicial');
      let fechaProgramadainicial = !isEmpty(fProgramadaInicial) ? fProgramadaInicial.format('YYYY/MM/DD') : '';
      let fProgramadaFinal = get(this, 'fechaProgramadaFinal');
      let fechaProgramadafinal = !isEmpty(fProgramadaFinal) ? fProgramadaFinal.format('YYYY/MM/DD') : '';
      if (fechaProgramadainicial) {
        objeto.fechaprogramadainicial = fechaProgramadainicial;
      }
      if (fechaProgramadafinal) {
        objeto.fechaprogramadafinal = fechaProgramadafinal;
      }
      if (empresa) {
        objeto.empresa = empresa;
      }
      if (estatus) {
        objeto.estatus = estatus;
      }
      if (get(this, 'sort') !== '') {
        objeto.sort = get(this, 'sort');
        set(this, 'sort', '');
      }
      if (operacion !== '' && operacion !== 'ninguna') {
        if (operacion === 'multicheque') {
          objeto.multicheque = 1;
        } else {
          objeto.fondeo = 1;
        }
      }
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
      if (get(this, 'relacionadas') === true  && !isEmpty(get(this, 'solicitudBuscar'))) {
        info('si entro donde quiero para pedir solicitudes realcionadas');
        objeto = {};
        objeto.solicitud = get(this, 'solicitudBuscar');
        objeto.relacionadas = true;
        objeto.cuantos = 1;
      }
      this.store.query('gxsolicitudcheque', objeto)
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
        this.store.query('gxsolicitudcheque', objeto)
        .then((data)=> {
          // data.forEach((item)=> {})
          set(this, 'solicitudesLista', data);
          set(this, 'resultPage', get(data, 'meta.page'));
          set(this, 'resultPages', get(data, 'meta.pages'));
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
    toggleNuevoProvedor() {
      this.toggleProperty('nuevoProvedorForma');
      set(this, 'beneficiarioNuevo', '');
      set(this, 'listaBeneficiarios', null);
      set(this, 'selectedBeneficiario', '');
      set(this, 'beneficiarioFiltro', '');
    },
    toggleFormaSolicitud() {
      this.toggleProperty('formaSolicitud');
      set(this, 'solicitudOtrosEgresosBandera', false);
      set(this, 'disabledEditarSolicitudFlag', false);
      set(this, 'nuevoProvedorForma', false);
      set(this, 'estatusSolicitudFlag', true);
      set(this, 'concepto', '');
      set(this, 'detalleAnexo', '');
      set(this, 'observaciones', '');
      set(this, 'listaBeneficiarios', null);
      set(this, 'selectedBeneficiario', '');
      set(this, 'beneficiarioFiltro', '');
      set(this, 'recordProvedor', null);
      set(this, 'selectedEmpresa', '');
      set(this, 'selectedBancoOrigen', '');
      set(this, 'bancoOrigenLista', null);
      set(this, 'selectedEspecificaciones', '');
      set(this, 'selectedAnexo', '');
      set(this, 'centroCostoLista', null);
      set(this, 'selectedCentroCosto', '');
      set(this, 'partidaEgresosLista', null);
      set(this, 'selectedPartidaEgreso', '');
      set(this, 'subpartida1Lista', null);
      set(this, 'selectedsubPartida1', '');
      set(this, 'totalPartida', '');
      set(this, 'selectedProgramacion', 'N');
      // set(this, 'listaPartidasEgresoGrabar', Ember.A());
      set(this, 'totalValorPartidas', '');
      set(this, 'totalValorPartidasformated', '');
      set(this, 'selectedEmpresaEdicion', '');
      set(this, 'beneficiarioBancoCuenta', '');
      set(this, 'requestedPage', '');
      info('agregar solicitud boton');
    },
    buscarBeneficiarioMobile() {
      let beneficiario = get(this, 'bene');
      set(this, 'beneficiarioFiltro', beneficiario);
    },
    grabarBeneficiario() {
      let nombre = get(this, 'beneficiarioNuevo');
      let record = this.store.createRecord('gxsolicitudbeneficiario', {
        nombre: get(this, 'beneficiarioNuevo'),
        banco: get(this, 'banco'),
        plaza: get(this, 'plaza'),
        sucursal: get(this, 'sucursal'),
        clavecuenta: get(this, 'clavecuenta'),
        bancocheque: get(this, 'bancocheque'),
        plazacheque: get(this, 'plazacheque'),
        sucursalcheque: get(this, 'sucursalcheque'),
        clavecuentacheque: get(this, 'clavecuentacheque')
      });
      record.save()
      .then((data)=> {
        info('paso', data);
        set(this, 'recordProvedor', data);
        set(this, 'nuevoProvedorForma', false);
      }, (error)=> {
        info('trorno');
      });
      info('boton grabar grabarBeneficiario');
    },
    pedirSort(sort) {
      set(this, 'sort', sort);
      info('viendo valor de sort en pedirsort', sort);
      this.send('pedir');
    }
  }
});
