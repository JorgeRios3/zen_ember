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

  observaSelectedEmpresa: observer('selectedEmpresa', function() {
  	//aqui va la nueva lista
  	//set(this, 'showNavigation', false);
    if (!isEmpty(get(this, 'selectedEmpresa'))) {
      set(this, 'selectedBancoOrigen', '');
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
  actions: {
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
