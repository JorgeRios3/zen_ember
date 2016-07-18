import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';

const {
	get,
	set,
	observer,
	computed,
	isEmpty,
  Logger: { info }
} = Ember;

let documentoSelec = Ember.Object.extend({
  idDoc: '',
  abono: '',
  abononum: computed('abono', {
    get() {
      let sabono = get(this, 'abono').replace(',', '');
      return parseFloat(sabono);
    }
  })
});

// info para impresora
let Impresora = Ember.Object.extend({
  impresora: '',
  nombre: '',
  online: false,
  copies: 0,
  chosen: false,
  elegible: computed('copies', 'online', {
    get() {
      return this.get('copies') && this.get('online');
    }
  })
  /*elegible: function() {
    return this.get('copies') && this.get('online');
  }.property('copies', 'online')*/
});

let ErrorValidacion = Ember.Object.extend({
  variable: '',
  mensaje: '',
  campo: ''
});

export default Ember.Controller.extend(Ember.Evented, EmberValidations, {
  session: Ember.inject.service(),
  ajax: Ember.inject.service(),
  selectedNombre: '',
  selectedEtapa: null,
  selectedDoc: null,
  catalogoNombres: '',
  docsCliente: '',
  error: '',
  nombre: '',
  idDocumento: '',
  conDevolucion: false,
  genSolicitudChq: false,
  reactivable: false,
  manzana: '',
  lote: '',
  cuenta: '',
  cliente: '',
  saldo: '',
  isCancelarOk: false,
  maximo: Ember.computed.lt('cuantos', 101),
  cuantos: '',
  // vara para imprimir
  muestraOpcionesImpresion: false,
  copiasDocsCliente: 1,
  copiasCancelacion: 1,
  enviarEmail: false,
  soloEmail: false,
  huboErrorAlImprimir: false,
  huboErrorAlImprimir1: false,
  // manejo de error al grabar
  huboErrorAlGrabar: false,
  muestroErrores: false,
  hayEtapa: computed('selectedEtapa', {
    get() {
      info(get(this, 'selectedEtapa'));
      return get(this, 'selectedEtapa') !== null ? true : false; 
    }
  }),
  abonos: computed('documentosSelec.content.@each.abononum', {
    get() {
      let suma = 0;
      get(this, 'documentosSelec.content').forEach((item)=> {
        suma = suma + get(item, 'abononum');
      });
      return suma;
    }
  }),
  validations: {
    nombre: {
      length: { minimum: 3, message: 'el nombre es mal' }
    },
    isCancelarOk: {
      inclusion: { in: [true], message: 'La cuenta ya esta en escrituras' }
    }
  },

  init() {
    this._super(...arguments);
    set(this, 'documentosSelec', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'erroresHabidos', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'impresoras', Ember.ArrayProxy.create({ content: [] }));
  },
  observaCatNombre: observer('selectedNombre', function() {
    let that = this;
    get(this, 'documentosSelec.content').clear();
    let cual = get(this, 'catalogoNombres').findBy('cuenta', get(this, 'selectedNombre'));
    let e = this.store.find('cuentaescritura', get(this, 'selectedNombre'));
    let p = this.store.query('documentoscliente', { cuenta: get(this, 'selectedNombre') });
    set(this, 'docsCliente', p);
    // llena info
    set(this, 'cuenta', cual.get('cuenta'));
    set(this, 'manzana', cual.get('manzana'));
    set(this, 'lote', cual.get('lote'));
    set(this, 'saldo', cual.get('saldo'));
    e.then((data)=> {
      let viable = get(data, 'viable');
      set(that, 'isCancelarOk', viable);
    });
    // Para impresion
    set(this, 'cliente', cual.get('cliente'));
  }),

  actions: {
    buscaImpresora() {
      let that = this;
      this.store.findAll('printer').then((data)=> {
        data.forEach((imp)=> {
          get(that, 'impresoras.content').pushObject(
            Impresora.create({
              nombre: get(imp, 'displayname'),
              impresora: get(imp, 'printerid'),
              online: get(imp, 'online'),
              copies: get(imp, 'copies'),
              chosen: false
            })
          );
        });
      }, (error)=> {
        info('hubo error');
      });
    },
    cancelar() {
      let docs = get(this, 'documentosSelec');
      let that = this;
      let documentosConRecibosADevolver = '';
      let record = this.store.createRecord('cancelacion', {});
      docs.forEach((item)=> {
        if (item.get('abononum') > 0) {
          documentosConRecibosADevolver = `documentosConRecibosADevolver${item.get('id')},`;
        }
      });
      record.setProperties({
        cuenta: get(that, 'cuenta'),
        total: get(that, 'abonos'),
        conDevolucion: get(that, 'conDevolucion'),
        generarSolicitudCheque: get(that, 'genSolicitudChq'),
        reactivable: get(that, 'reactivable'),
        documentosConRecibosADevolver
      });
      record.save().then(()=> {
        // Impresora
        get(that, 'impresoras.content').clear();
        that.store.findAll('printer', { reload: true }).then((data)=> {
          data.forEach((imp)=> {
            get(that, 'impresoras.content').pushObject(
              Impresora.create({
                nombre: get(imp, 'displayname'),
                impresora: get(imp, 'printerid'),
                online: get(imp, 'online'),
                copies: get(imp, 'copies'),
                chosen: false
              })
            );
          });
        });
        get(that, 'ajax').post('/api/useremail?query=1')
        .then((data)=> {
          if (data.success === '1') {
            set(that, 'emailaddress', data.email);
          }
        });
        // Variables para la impresion
        that.setProperties({
          muestraOpcionesImpresion: true,
          copiasCanc: 3,
          enviarEmail: false,
          soloEmail: false
        });
        set(that, 'catalogoNombres', null);
        set(that, 'docsCliente', '');
      }, (error)=> {
        set(that, 'huboErrorAlGrabar', true);
        set(that, 'error', error);
      });
    },
    enteradoHuboErrorAlGrabar() {
      this.transitionToRoute('index');
    },
    enteradoHuboErrorAlImprimir() {
      this.transitionToRoute('index');
    },
    enteradoHuboErrorAlImprimir1() {
      this.transitionToRoute('index');
    },
    enteradoInspeccionarErrores() {
      this.toggleProperty('muestroErrores');
    },
    selectedEtapa(item) {
      set(this, 'selectedEtapa', item.id);
    },
    selectedNombre(item) {
      set(this, 'selectedNombre', item.cuenta);
    },
    buscar() {
      let that = this;
      let nombre = get(this, 'nombre');
      let etapa = get(this, 'selectedEtapa');
      info(`valor de selectedEtapa ${etapa}`);
      set(this, 'catalogoNombres', null);
      let p2 = this.store.query('clientescuantosconcuentanosaldada' , { etapa, nombre, estadocuenta: 1 });
      p2.then((data)=> {
        if (get(data, 'length')) {
          data.forEach((item)=> {
            set(that, 'cuantos', get(item, 'cuantos'));
          });
        }
        if (parseInt(get(this, 'cuantos')) <= 100) {
          return this.store.query('clientesconcuentanosaldada', { etapa, nombre, estadocuenta: 1 })
          .then((data)=> {
            set(that, 'catalogoNombres', data);
          });
        }
      });
    },

    elegirImpresora(cual) {
      get(this, 'impresoras.content').objectAt(cual).toggleProperty('chosen');
    },

    procesaDocumento(idDocumento, abono) {
      let docs = get(this, 'documentosSelec');
      let cual = docs.findBy('id', idDocumento);
      let indice = docs.indexOf(cual);
      if (indice !== -1) {
        docs.removeAt(indice);
      } else {
        docs.pushObject(documentoSelec.create({ id: idDocumento, abono }));
      }
      cual = get(this, 'docsCliente').findBy('id', idDocumento);
      cual.toggleProperty('elegido');
    },

    revisarErrores() {
      let _this = this;
      get(this, 'erroresHabidos.content').clear();
      Object.keys(get(this, 'errors')).forEach((que)=> {
        if (typeof que === 'string' || que instanceof String) {
          let error = get(_this, `errors.${que}`);
          if (typeof error[0] === 'string' || error[0] instanceof String) {
            let [errmsg] = error;
            if (errmsg === 'is not a number') {
              errmsg = 'no es numérico';
            }
            get(_this, 'erroresHabidos.content').pushObject(ErrorValidacion.create({
              variable: que,
              mensaje: errmsg,
              campo: _this.getWithDefault(`label+${que.capitalize()}`, '')
            }));
          }
        }
      });
      this.toggleProperty('muestroErrores');
    },

    imprimir() {
      let email = 'webmaster@grupoiclar.com';
      let docsClientePdf = '';
      let cancelacionPdf = '';
      let cliente = get(this, 'cliente');
      let cuenta = get(this, 'cuenta');
      let abonos = get(this, 'abonos');
      let etapa = get(this, 'selectedEtapa');
      let that = this;
      if (true) {
        get(this, 'ajax').request(`/api/otro?printer=null&tipo=docscliente&cliente=${cliente}&cuenta=${cuenta}&etapa=${etapa}`)
        .then((data)=> {
          if (data.error) {
            return;
          }
          docsClientePdf = data.name;
          set(that, 'docsClientePdf', docsClientePdf);
        }, (error)=> {
          set(that, 'huboErrorAlImprimir', true);
        });
        get(this, 'ajax').request(`/api/otro?printer=null&tipo=cancelacion&cliente=${cliente}&devolucion=${abonos}&cuenta=${cuenta}&etapa=${etapa}`)
        .then((data)=> {
          if (data.error) {
            return;
          }
          cancelacionPdf = data.name;
          set(that, 'cancelacionPdf', cancelacionPdf);
        }, (error)=> {
          set(that, 'huboErrorAlImprimir1', true);
        });
        Ember.run.later(function() {
          let cancelacionPdf = get(that, 'cancelacionPdf');
          let docsClientePdf = get(that, 'docsClientePdf');
          let emailAddress = get(that, 'emailaddress');
          let request = function(tipoDestino, destino, listaDeArchivos) {
            listaDeArchivos.forEach((archivo)=> {
              get(that, 'ajax').request(`/api/otro?${tipoDestino}=${destino}&pdf=${archivo}`);
            });
          };
          let requestForPrinting = (destino , archivo, copies)=> {
            let promesa = null;
            promesa = get(that, 'ajax').request(`/api/otro?printer=${destino}&pdf=${archivo}&copies=${copies}`);
            return promesa;
          };
          let tieneValor = (que)=> {
            return !isEmpty(que);
          };
          let archivos = [ docsClientePdf, cancelacionPdf ];
          let archivosValidos = true;
          archivos.forEach((archivo)=> {
            if (isEmpty(archivo)) {
              archivosValidos = false;
            }
          });
          if (that.get('enviarEmail') && tieneValor(email) && archivosValidos) {
            request('email', email, archivos);
          }
          if (that.get('enviarEmail') && tieneValor(emailAddress) && archivosValidos) {
            request('email', emailAddress, archivos);
          }
          let impresoras = get(that, 'impresoras.content');
          if (!get(that, 'soloEmail') &&  archivosValidos && impresoras.length > 0) {
            impresoras.forEach((impresora)=> {
              if (get(impresora, 'chosen')) {
                requestForPrinting(get(impresora, 'impresora'), cancelacionPdf, get(that, 'copiasCancelacion'));
                requestForPrinting(get(impresora, 'impresora'), docsClientePdf, get(that, 'copiasDocsCliente'));
              }
            });
          }
        }, 5000);
      }
      this.setProperties({
        muestraOpcionesImpresion: false
      });
      Ember.run.later(function() {
        that.transitionToRoute('index');
      }, 7000);
    }
  }
});
