import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  Logger: { info }
} = Ember;

let InmuebleReservado = Ember.Object.extend({
  inmueble: '',
  timestamp: '',
  me: false
});
let ProspectoReservado = Ember.Object.extend({
  prospecto: '',
  timestamp: '',
  me: false
});
let ErrorValidacion = Ember.Object.extend({
  variable: '',
  mensaje: '',
  campo: ''
});

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
});

let NumeroExterior = Ember.Object.extend({
  numero: ''
});

let log = Ember.Logger.info;

export default Ember.Controller.extend(Ember.Evented, EmberValidations, {
  session: Ember.inject.service(),
  ajax: Ember.inject.service(),
  // 'etapasofertas', 'preciosinmuebles','manzanasdisponibles','inmueblesdisponibles','prospectosofertas',
  // needs: ['clientessinofertas'],
  queryParams: ['origenCliente', 'cliente', 'afiliacion'],
  clientesofertas: null,
  clientessinofertas: null,
  todosSortingDesc: ['loteSort:asc'],
  sortedTodosDesc: '',
  origenCliente: false,
  labelProspecto: 'Prospecto',
  labelCliente: 'Cliente',
  labelAfiliacion: 'Afiliación de Prospecto',
  labelReferencia: 'Referencia RAP',
  labelMontocredito: 'Monto de Crédito',
  labelSelectedEtapa: 'Etapa',
  labelSelectedManzana: 'Manzana',
  labelSelectedInmueble: 'Lote',
  labelSelectedPrecio: 'Precio del Inmueble',
  labelSumaCheca: 'Sumas',
  domicilio: '',
  hayCaracteristicas: computed.gt('carateristicasLista.length', 0),
  etapasofertas: null,
  preciosinmuebles: null,
  inmueblesdisponibles: '',
  featureControl: false,
  oferta: '',
  isOferta: false,
  prerecibo: '',
  prereciboadicional: '',
  avaluo: '',
  subsidio: '',
  pagare: '',
  precalificacion: '',
  saldo: '',
  nombreCliente: '',
  clienteId: '',
  fechaVenta: '',
  cuenta: '',
  inmuebleSaldo: '',
  errorMessage: '',
  candadoPrecio: '',
  precioCatalogo: '',
  caracteristicasPdf: '',
  anexoPdf: '',
  ofertaPdf: '',
  rapPdf: '',
  ofertaGenerada: '',
  soloEmail: false,
  emailaddress: '',
  processingGrabar: false,
  selectedEtapa: null,
  selectedPrecio: null,
  selectedManzana: null,
  selectedLote: null,
  selectedInmueble: null,
  hayClientesSinOfertas: false,
  numerointerior: '',
  numeroexterior: '',
  numerosExteriores: null,
  numerosInteriores: null,
  proxyNumerosExteriores: null,
  afiliacion: '',
  cliente: '',
  montocredito: '',
  precio: '',
  precioRaw: null,
  inmueble: '',
  afiliacionOk: false,
  afiliacionNoChecar: false,
  prospectoNoChecar: false,
  manzana: '',
  lote: '',
  sumaCheca: false,
  apartado: '',
  anticipocomision: '',
  prospecto: '',
  cuantosprecios: 0,
  gastosadministrativos: '',
  precioseguro: '',
  cuantosInmueblesDisponibles: 0,
  flagLista: false,
  muestraCamposCapturaAdicionales: false,
  muestraOpcionesImpresion: false,
  copiasOferta: 1,
  copiasAnexo: 1,
  copiasCaracteristicas: 1,
  copiasRap: 1,
  enviarEmail: false,
  tiposcuentas: [ { id: 'infonavit', tipo: 'Infonavit' },
    { id: 'contado', tipo: 'Contado' },
    { id: 'hipotecaria', tipo: 'Hipotecaria' } ],
  tipoCuenta: 'infonavit',
  huboErrorAlGrabar: false,
  muestroErrores: false,
  errorAlGrabar: '',
  socketU: 'ws://10.0.1.124:8888/zen',
  socketService: Ember.inject.service('websockets'),
  comodin: Ember.inject.service('comodin'),
  socket: computed('socketService', 'socketU', {
    get() {
      return get(this, 'socketService').socketFor(config.WSOCKETS_URL);
    }
  }),

  init() {
    this._super(...arguments);
    set(this, 'precios', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'prospectosofertas', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'inmueblesReservados', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'impresoras', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'prospectosReservados', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'erroresHabidos', Ember.ArrayProxy.create({ content: [] }));
    let socket = this.get('socket');
    socket.on('open', this.openHandler, this);
    socket.on('message', this.messageHandler, this);
    socket.on('close', this.closeHandler, this);
  },
  openHandler(event) {
    let token = get(this, 'session.session.content.authenticated.access_token');
    // var token = get(this,'session.content').secure.access_token;
    get(this, 'socket').send({ topic: 'token', data: { token } }, true);
    if (!get(this, 'reservados')) {
      this.requestList();
    }
  },
  requestList() {
    get(this, 'socket').send({ topic: 'list_oferta_home', data: '' }, true);
    get(this, 'socket').send({ topic: 'list_prospecto', data: '' }, true);
    get(this, 'socket').send({ topic: 'list_feature', data: '' }, true);
  },
  messageHandler(event) {
    let payload = JSON.parse(event.data);
    let ir, cual, indice;
    let that = this;
    if (payload.topic === 'lock_oferta_home') {
      get(this, 'inmueblesReservados.content').pushObject(InmuebleReservado.create({
        inmueble: payload.data.inmueble,
        timestamp: payload.data.timestamp
      }));
    }
    if (payload.topic === 'free_oferta_home') {
      ir = get(this, 'inmueblesReservados');
      cual = ir.findBy('timestamp', payload.data.timestamp);
      indice = ir.indexOf(cual);
      ir.removeAt(indice);
    }
    if (payload.topic === 'list_oferta_home') {
      // var that = this;
      payload.data.forEach((que)=> {
        get(that, 'inmueblesReservados.content').pushObject(InmuebleReservado.create({
          inmueble: que.inmueble,
          timestamp: que.timestamp
        }));
      });
    }
    if (payload.topic === 'lock_prospecto') {
      get(this, 'prospectosReservados.content').pushObject(ProspectoReservado.create({
        prospecto: payload.data.prospecto,
        timestamp: payload.data.timestamp
      }));
    }
    if (payload.topic === 'free_prospecto') {
      ir = get(this, 'prospectosReservados');
      cual = ir.findBy('timestamp', payload.data.timestamp);
      indice = ir.indexOf(cual);
      ir.removeAt(indice);
    }
    if (payload.topic === 'list_prospecto') {
      payload.data.forEach((que)=> {
        get(that, 'prospectosReservados.content').pushObject(ProspectoReservado.create({
          prospecto: que.prospecto,
          timestamp: que.timestamp
        }));
      });
    }
    if (payload.topic === 'list_feature') {
      if (payload.data.feature === 'oferta.save') {
        set(this, 'featureControl', true);
      }
    }
    if (payload.topic === 'lock_feature') {
      if (payload.data.feature === 'oferta.save') {
        set(this, 'featureControl', true);
      }
    }
    if (payload.topic === 'free_feature') {
      if (payload.data.feature === 'oferta.save') {
        set(this, 'featureControl', false);
      }
    }
  },
  closeHandler(event) {
    get(this, 'session').invalidate();
  },
  reservados: Ember.computed.alias('inmueblesReservados.content.length'),
  reservadosProspectos: Ember.computed.alias('prospectosReservados.content.length'),
  tipoCuentaEsInfonavit: computed('tipoCuenta', {
    get() {
      return Ember.isEqual(get(this, 'tipoCuenta'), 'infonavit');
    }
  }),
  tipoCuentaEsHipotecaria: computed('tipoCuenta', {
    get() {
      return Ember.isEqual(get(this, 'tipoCuenta'), 'hipotecaria');
    }
  }),
  /* hayPagPrevias: computed('resultPage', {
    get() { */
  tipoCuentaEsContado: computed('tipoCuenta', {
    get() {
      return Ember.isEqual(get(this, 'tipoCuenta'), 'contado');
    }
  }),
  estaEnInmueblesReservados: computed('inmueble', {
    get() {
      let inmueble = get(this, 'inmueble');
      if (Ember.isEmpty(inmueble)) {
        return false;
      }
      inmueble = parseInt(inmueble);
      let indice = -1;
      let ir = get(this, 'inmueblesReservados');
      let cual = ir.findBy('inmueble', inmueble);
      indice = ir.indexOf(cual);
      return indice !== -1;
    }
  }),
  estaEnProspectosReservados: computed('prospecto', {
    get() {
      let prospecto = get(this, 'prospecto');
      if (Ember.isEmpty(prospecto)) {
        return false;
      }
      prospecto = parseInt(prospecto);
      let indice = -1;
      let ir = get(this, 'prospectosReservados');
      let cual = ir.findBy('prospecto', prospecto);
      indice = ir.indexOf(cual);
      return indice !== -1;
    }
  }),
  // observer('flagLista', function() {
  observaFlagLista: observer('flagLista', function() {
    if (get(this, 'flagLista')) {
      this.requestList();
      this.toggleProperty('flagLista');
    }
  }),
  observandoTipoCuenta: observer('tipoCuenta', function() {
    if (get(this, 'tipoCuentaEsContado') || this.get('tipoCuentaEsHipotecaria')) {
      set(this, 'afiliacionOk', true);
    } else {
      set(this, 'afiliacion', '');
      set(this, 'afiliacionOk', false);
    }
  }),
  observaSelectedInmueble: observer('selectedInmueble', function() {
    let that = this;
    let antes = get(this, 'selectedInmueblePrevio');
    let despues = get(this, 'selectedInmueble');
    set(this, 'inmueble', despues);
    if (Ember.isEmpty(antes) && Ember.isEmpty(despues)) {
      info('no hay nada');
    } else {
      if (Ember.isEmpty(despues)) {
        set(this, 'domicilio', '');
        this.send('freeInmueble', antes);
      } else {
        this.send('submitInmueble');
        let p = this.store.find('inmuebleindividual', despues);
        p.then((dato)=> {
          set(that, 'domicilio', dato.get('domicilio'));
          set(that, 'candadoPrecio', dato.get('candadoPrecio'));
          set(that, 'precioCatalogo', dato.get('precioCatalogo'));
          set(that, 'selectedPrecio', 0);
          let p1 = that.store.find('catalogoprecio', despues);
          p1.then((dato)=> {
            let idPrecioCatalogo = get(dato, 'idPrecioCatalogo');
            if (idPrecioCatalogo !== 0) {
              info('paso la prueba', get(dato, 'idPrecioCatalogo'));
            } else {
              info('se fue por el else no hay idPrecioCatalogo');
              return;
            }
          });
          let p2 = that.store.query('caracteristicasinmueble', { inmueble: despues, precio: get(that, 'selectedPrecio'), precioCatalogo: get(that, 'precioCatalogo'), etapa: get(that, 'selectedEtapa') });
          p2.then((data)=> {
            if (get(data, 'length') > 0) {
              set(that, 'carateristicasLista', data);
            } else {
              set(that, 'carateristicasLista', null);
            }
          }, (error)=> {

          });
        });
      }
    }
  }),
  observaProspecto: observer('prospecto', function() {
    let prospecto = get(this, 'prospecto');
    if (!get(this, 'prospectoNoChecar')) {
      get(this, 'prospectosofertas').set('model', this.store.query('prospectosoferta', { prospecto }));
    } else {
      this.toggleProperty('prospectoNoChecar');
    }
    let antes = get(this, 'prospectoPrevio');
    let despues = get(this, 'prospecto');
    if (Ember.isEmpty(antes) && Ember.isEmpty(despues)) {
      info('if en blanco');
    } else {
      if (Ember.isEmpty(despues)) {
        this.send('freeProspecto', antes);
      } else {
        this.send('submitProspecto');
      }
    }
  }),
  highLightAndTrue: function(key) {
    if (!Ember.isEmpty(key)) {
      set(this, key, true);
    }
  }.on('highlightandtrue'),
  validaAfiliacion: observer('afiliacion', function() {
    if (get(this, 'tipoCuentaEsContado') || get(this, 'tipoCuentaEsHipotecaria')) {
      set(this, 'afiliacionOk', true);
      return;
    }
    let afi = get(this, 'afiliacion');
    let digits = afi.split('');
    let acumula = 0;
    if (afi.length === 11) {
      for (let i = 0; i < 10; i++) {
        let digito = parseInt(digits[i]);
        let factor = 2;
        if ((i % 2) === 0) {
          factor = 1;
        }
        let prod = factor * digito;
        if (prod > 10) {
          prod = prod - 9;
        }
        acumula = acumula + prod;
      }
      let resultado = 10 - (acumula % 10);
      if (resultado === 10) {
        resultado = 0;
      }
      if (parseInt(digits[10])  === resultado) {
        set(this, 'afiliacionOk', true);
      } else {
        set(this, 'afiliacionOk', false);
      }
    } else {
      set(this, 'afiliacionOk', false);
    }
    if (get(this, 'afiliacionOk')) {
      this.trigger('highlightandtrue');
    }
  }),
  mislotes: computed('selectedManzana', {
    get() {
      let that = this;
      let manzana = get(this, 'selectedManzana');
      info('valor de manzana', manzana);
      // var v = get(this, 'controllers.inmueblesdisponibles');
      let c = get(this, 'inmueblesdisponibles');
      let isDepto = get(this, 'departamento');
      if (get(this, 'departamento')) {
        let mySet = new Set([]);
        set(this, 'numerosExteriores', mySet);
      }
      return c.filter(function(item) {
        let m = item.get('manzana');
        let lote = item.get('lote');
        if (m === manzana) {
          if (isDepto) {
            get(that, 'numerosExteriores').add(lote.substring(0, 2));
          }
          return true;
        } else {
          return false;
        }
      });
    }
  }),
  misprecios: computed('selectedEtapa', {
    get() {
      info('aqui truena');
      let etapa = parseInt(get(this, 'selectedEtapa'));
      info('valor de etapa', etapa);
      // var v = get(this, 'controllers.preciosinmuebles');
      let c = get(this, 'preciosinmuebles');
      let that = this;
      set(this, 'cuantosprecios', 0);
      return c.filter(function(item) {
        let e = item.get('etapa');
        if (e === etapa) {
          that.incrementProperty('cuantosprecios');
          info('la libro mis precios');
          return true;
        } else {
          return false;
        }
      });
      info('la libro mis precios');
    }
  }),
  observaEtapa: observer('selectedEtapa', function() {
    let _this = this;
    set(_this, 'cuantosInmueblesDisponibles', 0);
    // get(this, 'manzanasdisponibles').
    set(this, 'manzanasdisponibles', this.store.query('manzanasdisponible', { etapa: get(this, 'selectedEtapa') }));
    let etapaPromesa =  this.store.find('etapasoferta', get(this, 'selectedEtapa'));
    etapaPromesa.then((data)=> {
      set(_this, 'departamento', data.get('departamento'));
    });
    let idisp = this.store.query('inmueblesdisponible', { etapa: get(this, 'selectedEtapa') });
    idisp.then((data)=> {
      set(_this, 'cuantosInmueblesDisponibles', data.get('length'));
    });
    let params = this.store.find('parametrosetapa', get(this, 'selectedEtapa'));
    params.then((data)=> {
      'anticipocomision apartado gastosadministrativos precioseguro'.w().forEach((key)=> {
        set(_this, key, get(data, key));
      });
    });
    //  get(this, 'controllers.inmueblesdisponibles').
    set(this, 'inmueblesdisponibles', idisp);
    //  set(this, 'selectedManzana', null);
  }),
  observarCliente: observer('cliente', function() {
    let cliente = get(this, 'clienteId');
    set(this, 'clientesofertas', this.store.query('clientesoferta', { cliente }));
    let _this = this;
    let rap = this.store.find('referenciasrapconclientesincuenta', cliente);
    rap.then((data)=> {
      set(_this, 'referencia', data.get('referencia'));
    }, ()=> {
      set(_this, 'referencia', '');
    });
  }),
  observaAfiliacion: observer('afiliacion', function() {
    let afiliacion = get(this, 'afiliacion');
    if (!get(this, 'afiliacionNoChecar')) {
      get(this, 'prospectosofertas').set('model', this.store.query('prospectosoferta', { afiliacion }));
    } else {
      this.toggleProperty('afiliacionNoChecar');
    }
  }),
  observaProspectosOfertas: observer('prospectosofertas', function() {
    let _this = this;
    return get(this, 'prospectosofertas').filter(function(item) {
      set(_this, 'afiliacionNoChecar', true);
      set(_this, 'prospectoNoChecar', true);
      set(_this, 'prospecto', item.get('id'));
      set(_this, 'afiliacion', item.get('afiliacion'));
    });
  }),
  observaManzana: observer('selectedManzana', function() {
    set(this, 'selectedInmueble', null);
  }),
  observaPrecios: observer('selectedPrecio', function() {
    if (isEmpty(get(this, 'selectedEtapa'))) {
      return;
    }
    let precioid = get(this, 'selectedPrecio');
    // var v = get(this,'controllers.preciosinmuebles');
    let c = get(this, 'preciosinmuebles');
    let item = c.findBy('id', precioid);
    if (!get(this, 'candadoPrecio')) {
      set(this, 'precioRaw', get(item, 'precioraw'));
    }
  }),
  hayCamposObligatorios: computed('inmueble', 'cliente', {
    get() {
      if (Ember.isEmpty(get(this, 'inmueble')) || isEmpty(get(this, 'cliente'))) {
        return false;
      }
      return true;
    }
  }),
  // clientesofertas : Ember.computed.alias('controllers.clientesofertas'),
  // clientessinofertas : Ember.computed.alias('controllers.clientessinofertas'),
  checaSuma: Ember.observer('precalificacion', 'avaluo', 'subsidio' , 'pagare' , 'prerecibo' , 'prereciboadicional', function() {
    let _this = this;
    let total = 0;
    'precalificacion avaluo subsidio pagare prerecibo prereciboadicional'.w().forEach((key)=> {
      try {
        let n = Number(_this.getWithDefault(key, 0));
        total = total + n;
      } catch(err) {
        Ember.Logger.info(err.message);
      }
    });
    let pr = get(this, 'precioRaw');
    set(this, 'sumaCheca', total === get(this, 'precioCatalogo'));
  }),
  validations: {
    precalificacion: {
      numericality: { allowBlank: true }
    },
    avaluo: {
      numericality: { allowBlank: true }
    },
    subsidio: {
      numericality: { allowBlank: true }
    },
    pagare: {
      numericality: { allowBlank: true }
    },
    prerecibo: {
      numericality: { allowBlank: true }
    },
    prereciboadicional: {
      numericality: { allowBlank: true }
    },
    selectedEtapa: {
      exclusion: { in: [null] , message: 'Debe seleccionar etapa' }
    },
    selectedPrecio: {
      exclusion: { in: [null], message: 'Debe seleccionar precio' }
    },
    selectedManzana: {
      exclusion: { in: [null], message: 'Debe seleccionar manzana' }
    },
    selectedInmueble: {
      exclusion: { in: [null] , message: 'Debe seleccionar inmueble' }
    },
    tipoCuenta: {
      exclusion: { in: [null], message: 'Debe seleccionar tipo cuenta' }
    },
    sumaCheca: {
      exclusion: { in: [false], message: 'No checa total con precio' }
    },
    oferta: {
      numericality: { onlyInteger: true, messages: { onlyInteger: 'la oferta solo debe contenter numeros' } }
    }
  },
  actions: {
    seleccionar(oferta) {
      info('entrando en la accion de hacer con su parametro', oferta);
      set(this, 'oferta', oferta);
      this.send('buscarOferta', oferta);
    },
    buscarOferta(oferta) {
      set(this, 'isOferta', false);
      set(this, 'errorMessage', '');
      let etapa = get(this, 'selectedEtapa');
      let that = this;
      let p = this.store.query('ofertasasignacion', { etapa, oferta });
      p.then((data)=> {
        let length = data.get('length');
        // info('viendo valor', get(data, 'length'));
        if (length) {
          info('entro en length');
          data.forEach((item)=> {
            if (Object.is(get(item, 'inmueble'), 0)) {
              set(that, 'isOferta', true);
              set(that, 'inmuebleSaldo', item.get('saldo'));
              set(that, 'nombreCliente', item.get('nombreCliente'));
              // set (that, 'inmueble', item.get('inmueble'));
              set(that, 'fechaVenta', item.get('fechaVenta'));
              set(that, 'clienteId', item.get('clienteId'));
              set(that, 'cuenta', item.get('cuenta'));
            } else {
              set(that, 'errorMessage', 'La cuenta-oferta ya tiene inmueble asignado');
            }
          });
        } else {
          set(that, 'errorMessage', 'No Existe Oferta');
          set(that, 'inmuebleSaldo', '');
        }
      });
    },
    pegarAfiliacion() {
      set(this, 'afiliacion', get(this, 'comodin.afiliacion'));
    },
    mostrarCamposCapturaAdicionales() {
      this.toggleProperty('muestraCamposCapturaAdicionales');
    },
    descartaInmueble() {
      set(this, 'selectedInmueble', null);
    },
    descartaProspecto() {
      set(this, 'prospecto', null);
    },
    requestListAgain() {
      this.requestList();
    },
    traerEmail() {
      let that = this;
      get(this, 'ajax').post('/api/useremail?query=1').then((data)=> {
        if (data.success === '1') {
          that.set('emailaddress', data.email);
        }
      });
    },
    grabar() {
      try {
        info('valor de inmueble ', get(this, 'inmueble'));
        info('valor de cliente ', get(this, 'clienteId'));
        info('valor de oferta ', get(this, 'oferta'));
        info('valor de precio ', get(this, 'precioCatalogo'));
        info('valor de precalifiacion', get(this, 'precalificacion'));
        info('valor de avaluo ', get(this, 'avaluo'));
        info('valor de subsidio', get(this, 'subsidio'));
        info('valor de pagare ', get(this, 'pagare'));
        info('valor de prerecibo ', get(this, 'prerecibo'));
        info('valor de prereciboadicional ', get(this, 'prereciboadicional'));
      } catch(e) {
        return;
      }
      set(this, 'processingGrabar', true);
      get(this, 'socket').send({ topic: 'lock_feature', data: { feature: 'oferta.save' } }, true);
      let model = this.store.createRecord('asignacion', {
        inmueble: get(this, 'inmueble'),
        cliente: get(this, 'clienteId'),
        oferta: get(this, 'oferta'),
        precio: get(this, 'precioCatalogo'),
        precalificacion: get(this, 'precalificacion'),
        avaluo: get(this, 'avaluo'),
        subsidio: get(this, 'subsidio'),
        pagare: get(this, 'pagare'),
        prerecibo: get(this, 'prerecibo'),
        prereciboadicional: get(this, 'prereciboadicional')
      });
      let that = this;
      model.save().then((data)=> {
        that.store.findAll('printer').then((data)=> {
          get(that, 'impresoras.content').clear();
          data.forEach((imp)=> {
            get(that, 'impresoras.content').pushObject(Impresora.create({
              nombre: imp.get('displayname'),
              impresora: imp.get('printerid'),
              online: imp.get('online'),
              copies: imp.get('copies'),
              chosen: false
            }));
          });
        });
        get(that, 'ajax').post('/api/useremail?query=1').then((data)=> {
          if (data.success === '1') {
            set(that, 'emailaddress', data.email);
          }
        });
        that.setProperties({
          muestraOpcionesImpresion: true,
          muestraCamposCapturaAdicionales: false,
          copiasCaracteristicas: 2,
          copiasAnexo: 2,
          copiasOferta: 3,
          enviarEmail: false,
          soloEmail: false,
          processingGrabar: false,
          ofertaGenerada: data.get('id')
        });
        get(that, 'socket').send({ topic: 'free_feature', data: { feature: 'oferta.save' } }, true);
      }, (error)=> {
        set(that, 'errorAlGrabar', '');
        that.toggleProperty('huboErrorAlGrabar');
        set(that, 'processingGrabar', false);
        let errorGenerado = '';
        try {
          errorGenerado = error.errors.resultado[0];
        } catch (er) {
          log('error en obtencion de error', er.message);
        }
        set(that, 'errorAlGrabar', errorGenerado);
        get(this, 'socket').send({ topic: 'free_feature', data: { feature: 'oferta.save' } }, true);
      });
    },
    submitInmueble() {
      let inmueble = parseInt(this.get('inmueble'));
      get(this, 'socket').send({ topic: 'lock_oferta_home', data: { inmueble } }, true);
    },
    freeInmueble(x) {
      let inmueble = parseInt(x);
      get(this, 'socket').send({ topic: 'free_oferta_home', data: { inmueble } }, true);
    },
    submitProspecto() {
      let prospecto = parseInt(this.get('prospecto'));
      get(this, 'socket').send({ topic: 'lock_prospecto', data: { prospecto } }, true);
    },
    freeProspecto(x) {
      let prospecto = parseInt(x);
      get(this, 'socket').send({ topic: 'free_prospecto', data: { prospecto } }, true);
    },
    buscarClientesSinOfertas() {
      let _this = this;
      let cso = this.store.findAll('clientessinoferta');
      cso.then((data)=> {
        set(_this, 'hayClientesSinOfertas', data.get('length') > 0 ? true : false);
      });
      set(this, 'clientessinofertas', cso);
    },
    cerrarBusquedaCliente() {
      this.toggleProperty('hayClientesSinOfertas');
    },
    savemessage(what) {
      Ember.Logger.info('estoy en savemessage', what);
    },
    revisarErrores() {
      let _this = this;
      get(this, 'erroresHabidos.content').clear();
      Object.keys(this.get('errors')).forEach((que)=> {
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
              campo: _this.getWithDefault(`label${que.capitalize()}`, '')
            }));
          }
        }
      });
      this.toggleProperty('muestroErrores');
    },
    imprimir() {
      set(this, 'processingGrabar', true);
      // var email = this.get('email');
      let email = 'webmaster@grupoiclar.com';
      let oferta = parseInt(get(this, 'ofertaGenerada'));
      let etapa = get(this, 'selectedEtapa');
      let precalificacion = this.getWithDefault('precalificacion', 0) || 0;
      let avaluo = this.getWithDefault('avaluo', 0) || 0;
      let subsidio = this.getWithDefault('subsidio', 0) || 0;
      let pagare = this.getWithDefault('pagare', 0) || 0;
      let cliente = this.get('cliente') || 0;
      // var ofertaPdf = '';
      let anexoPdf = '';
      let caracteristicasPdf = '';
      // var rapPdf = '';
      let that = this;
      // var rep = new Ember.RSVP.Promise();
      if (true) {
        /*ajax( { type: 'GET' ,
        async : false,
        url: '/api/otro?printer=null&tipo=oferta&etapa='+etapa+'&oferta='+oferta }).then(function(data){
        if (data.error){
        return;
        }
        ofertaPdf = data.name;
        set(that, 'ofertaPdf', ofertaPdf);
        );
        log( 'fin del if al final del ajax de generar oferta en pdf');
        */
        get(this, 'ajax').request(`/api/otro?printer=null&tipo=caracteristicas&etapa=${etapa}&oferta=${oferta}`)
        .then((data)=> {
          if (data.error) {
            return;
          }
          caracteristicasPdf = data.name;
          that.set('caracteristicasPdf', caracteristicasPdf);
        });
        let url = `/api/otro?printer=null&tipo=anexo&etapa=${etapa}&oferta=${oferta}&precalificacion=${precalificacion}&avaluo=${avaluo}&subsidio=${subsidio}&pagare=${pagare}`;
        get(this, 'ajax').request(url).then((data)=> {
          if (data.error) {
            return;
          }
          anexoPdf = data.name;
          set(that, 'anexoPdf', anexoPdf);
        });
        /*ajax( { type: 'GET' ,
            			async : false,
            			url: '/api/otro?printer=null&tipo=rap&cliente='+cliente }
          		).then(
            		function(data){
            			if (data.error){
            				return;
            			}
            			rapPdf = data.name;
            			set(that, 'rapPdf', rapPdf);
            		}
          		);*/
        Ember.run.later(function() {
          let caracteristicasPdf = get(that, 'caracteristicasPdf');
          let anexoPdf = get(that, 'anexoPdf');
          let ofertaPdf = get(that, 'ofertaPdf');
          let emailAddress = get(that, 'emailaddress');
          let request = function(tipoDestino, destino, listaDeArchivos) {
            listaDeArchivos.forEach((archivo)=> {
              get(that, 'ajax').request(`/api/otro?${tipoDestino}=${destino}&pdf=${archivo}`);
            });
          };
          let requestForPrinting = function(destino, archivo, copies) {
          let promesa = null;
          promesa = get(that, 'ajax').request(`/api/otro?printer=${destino}&pdf=${archivo}&copies=${copies}`);
          return promesa;
        };
          let tieneValor = function(que) {
            return !Ember.isEmpty(que);
          };
          let archivos = [caracteristicasPdf, anexoPdf];
          let archivosValidos = true;
          archivos.forEach((archivo)=> {
            if (Ember.isEmpty(archivo)) {
              archivosValidos = false;
            }
          });
          if (get(that, 'enviarEmail') && tieneValor(email) && archivosValidos) {
            request('email', email, archivos);
          }
          if (get(that, 'enviarEmail') && tieneValor(emailAddress) && archivosValidos) {
            request('email', emailAddress, archivos);
          }
          let impresoras = get(that, 'impresoras.content');
          if (!that.get('soloEmail') &&  archivosValidos && impresoras.length > 0) {
            impresoras.forEach((impresora)=> {
              if (impresora.get('chosen')) {
                // requestForPrinting( impresora.get('impresora'), ofertaPdf, get(that, 'copiasOferta') );
                requestForPrinting(impresora.get('impresora'), caracteristicasPdf, get(that, 'copiasCaracteristicas'));
                requestForPrinting(impresora.get('impresora'), anexoPdf, get(that, 'copiasAnexo'));
                // requestForPrinting( impresora.get('impresora'), rapPdf, get(that, 'copiasRap') );
              }
            });
          }
        }, 5000);
      }
      this.setProperties({
        muestraOpcionesImpresion: false
      });
      Ember.run.later(function() {
        get(that, 'session').invalidate();
      }, 7000);
    },
    enteradoHuboErrorAlGrabar() {
      this.toggleProperty('huboErrorAlGrabar');
    },
    enteradoInspeccionarErrores() {
      this.toggleProperty('muestroErrores');
    },
    elegirImpresora(cual) {
      get(this, 'impresoras.content').objectAt(cual).toggleProperty('chosen');
    },
    numeroExteriorElegido(edificio) {
      set(this, 'numeroexterior', edificio);
      let that = this;
      // var v = get(this, 'controllers.inmueblesdisponibles');
      let c = get(this, 'inmueblesdisponibles');
      let mySet2 = new Set([]);
      set(this, 'numerosInteriores', mySet2);
      return c.filter(function(item) {
        let lote = item.get('lote');
        if (edificio === lote.substring(0, 2)) {
          get(that, 'numerosInteriores').add(lote.substring(2, 5));
          return true;
        } else {
          return false;
        }
      });
    },
    numeroInteriorElegido(depa) {
      let ne = get(this, 'numeroexterior');
      let loteoficial = `${ne}${depa}`;
      let misLotes = get(this, 'mislotes');
      let cual = misLotes.findBy('lote', loteoficial);
      let inmueble = cual.get('id');
      set(this, 'selectedInmueble', inmueble);
    }
  }
});
