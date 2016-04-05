import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  getOwner,
  Logger: { info },
  inject: { service }
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

let prospectoArray = Ember.Object.extend({
  id: '',
  nombre: '',
  nombrevendedor: '',
  gerente: '',
  nombregerente: ''
});

let Impresora = Ember.Object.extend({
  impresora: '',
  nombre: '',
  online: false,
  copies: 0,
  elegible: computed('copies', 'online', {
    get() {
      return get(this, 'copies') && get(this, 'online');
    }
  }),
  chosen: false
});

let miPrecio = Ember.Object.extend({
  descripcion: '',
  etapa: '',
  id: '',
  precio: '',
  precioraw: '',
  sustentable: '',
  precioDescripcion: ''
});

export default Ember.Controller.extend(Ember.Evented, EmberValidations, {
  session: service(),
  ajax: service(),
  queryParams: ['origenCliente', 'cliente', 'afiliacion', 'prospecto'],
  etapasofertas: '',
  tieneComision: true,
  manzanasdisponibles: '',
  isProspecto: false,
  comision: false,
  tieneCuenta: false,
  errorMessage: '',
  isCaracteristicas: false,
  origenCliente: false,
  labelProspecto: 'Prospecto',
  hayCaracteristicas: computed.gt('carateristicasLista.length', 0),
  carateristicasLista: null,
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
  precioUnico: [{ id: 0, precio: 0 }],
  precioCatalogo: '',
  candadoPrecio: false,
  caracteristicasPdf: '',
  anexoPdf: '',
  ofertaPdf: '',
  rapPdf: '',
  ofertaGenerada: '',
  soloEmail: false,
  emailaddress: '',
  processingGrabar: false,
  featureControl: false,
  selectedEtapa: null,
  etapaTemporal: null,
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
  errorMessageComision: 'El asesor no tiene comision',
  sumaCheca: false,
  apartado: '',
  anticipocomision: '',
  prospecto: '',
  cuantosprecios: 0,
  gastosadministrativos: '',
  precioseguro: '',
  precalificacion: '',
  prerecibo: '',
  prereciboadicional: '',
  avaluo: '',
  subsidio: '',
  pagare: '',
  cuantosInmueblesDisponibles: 0,
  flagLista: false,
  muestraCamposCapturaAdicionales: false,
  muestraOpcionesImpresion: false,
  copiasOferta: 1,
  copiasAnexo: 1,
  copiasCaracteristicas: 1,
  copiasRap: 1,
  clientessinofertas: null,
  clientesofertas: null,
  enviarEmail: false,
  tiposcuentas: [{ id: 'infonavit' , tipo: 'Infonavit' },
    { id: 'contado', tipo: 'Contado' },
    { id: 'hipotecaria', tipo: 'Hipotecaria' },
    { id: 'fovisste', tipo: 'Fovisste' },
    { id: 'pensiones', tipo: 'Pensiones del Estado' }],
  tipoCuenta: 'infonavit',
  huboErrorAlGrabar: false,
  muestroErrores: false,
  errorAlGrabar: '',
  socketU: 'ws://10.0.1.124:8888/zen',
  socketService: service('websockets'),
  comodin: service('comodin'),
  inmueblesdisponibles: '',
  socket: computed('socketService', 'socketU', {
    get() {
      return get(this, 'socketService').socketFor(config.WSOCKETS_URL);
    }
  }),
  init() {
    this._super(...arguments);
    set(this, 'precios', Ember.ArrayProxy.create({ content: [] }));
    for (let cual of 'inmueblesReservados impresoras prospectosReservados erroresHabidos prospectosofertas'.w()) {
      set(this, cual, Ember.ArrayProxy.create({ content: [] }));
    }
    let socket = this.get('socket');
    socket.on('open', this.openHandler, this);
    socket.on('message', this.messageHandler, this);
    socket.on('close', this.closeHandler, this);
  },
  openHandler(event) {
    let token = get(this, 'session.session.content.authenticated.access_token');
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
  closeHandler(valor) {
    info('se fue por aqui');
    get(this, 'session').invalidate();
  },
  montoCreditoCorrecto: computed('montocredito', 'afiliacionOk', 'tipoCuenta', {
    get() {
      let verdad = get(this, 'tipoCuentaEsContado');
      if (!verdad) {
        if (get(this, 'afiliacionOk') && isEmpty(get(this, 'montocredito'))) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }),
  reservados: computed.alias('inmueblesReservados.content.length'),
  reservadosProspectos: computed.alias('prospectosReservados.content.length'),
  tipoCuentaEsInfonavit: computed.equal('tipoCuenta', 'infonavit'),
  tipoCuentaEsHipotecaria: computed.equal('tipoCuenta', 'hipotecaria'),
  tipoCuentaEsContado: computed.equal('tipoCuenta', 'contado'),
  tipoCuentaEsPensiones: computed.equal('tipoCuenta', 'pensiones'),
  tipoCuentaEsFovisste: computed.equal('tipoCuenta', 'fovisste'),
  estaEnInmueblesReservados: computed('inmueble', {
    get() {
      let inmueble = get(this, 'inmueble');
      if (isEmpty(inmueble)) {
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
      if (isEmpty(prospecto)) {
        return false;
      }
      prospecto = parseInt(prospecto);
      let indice = -1;
      let ir = this.get('prospectosReservados');
      let cual = ir.findBy('prospecto', prospecto);
      indice = ir.indexOf(cual);
      return indice !== -1;
    }
  }),
  observaFlagLista: observer('flagLista', function() {
    if (get(this, 'flagLista')) {
      this.requestList();
      this.toggleProperty('flagLista');
    }
  }),
  observandoTipoCuenta: observer('tipoCuenta', function() {
    if (computed.or('tipoCuentaEsContado', 'tipoCuentaEsHipotecaria', 'tipoCuentaEsFovisste', 'tipoCuentaEsPensiones')) {
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
    set(this, 'selectedInmueblePrevio', despues);
    set(this, 'inmueble', despues);
    if (isEmpty(antes) && isEmpty(despues)) {
      info('por aqui');
    } else {
      if (isEmpty(despues)) {
        set(this, 'domicilio', '');
        this.send('freeInmueble', antes);
      } else {
        this.send('submitInmueble');
        this.store.unloadAll('caracteristicasinmueble');
        this.store.unloadAll('inmuebleindividual');
        this.store.unloadAll('catalogoprecio');
        this.store.find('inmuebleindividual', despues)
        .then((dato)=> {
          let candadoPrecio = get(dato, 'candadoPrecio');
          set(that, 'domicilio', get(dato, 'domicilio'));
          set(that, 'candadoPrecio', candadoPrecio);
          set(that, 'precioCatalogo', get(dato, 'precioCatalogo'));
          if (candadoPrecio) {
            set(that, 'selectedPrecio', 0);
          }
          set(that, 'sumaCheca', get(that, 'PrecioRaw') === get(that, 'precioCatalogo') ? true : false);
          return that.store.find('catalogoprecio', despues);
        }).then((dato)=> {
          let idPrecioCatalogo = get(dato, 'idPrecioCatalogo');
          if (idPrecioCatalogo !== 0) {
            info('paso la prueba', get(dato, 'idPrecioCatalogo'));
          } else {
            info('se fue por el else no hay idPrecioCatalogo');
          }
          return that.store.query('caracteristicasinmueble', {
            inmueble: despues,
            precio: isEmpty(get(that, 'selectedPrecio')) ? 0 : get(that, 'selectedPrecio'),
            precioCatalogo: get(that, 'precioCatalogo'),
            etapa: get(that, 'selectedEtapa')
          });

        }).then((data)=> {
          if (get(data, 'length') > 0) {
            set(that, 'carateristicasLista', data);
          } else {
            set(that, 'carateristicasLista', null);
          }
        });
        if (!isEmpty(get(that, 'prospecto'))) {
          that.store.query('comisionventa',
            {
              inmueble: despues,
              prospecto: get(that, 'prospecto')
            }
		  ).then((data)=> {
            set(that, 'comision', false);
            data.forEach((item)=> {
              let comision = get(item, 'comision');
              set(that, 'comision', comision);
              let error = comision === true ? '' : 'El asesor no tiene comision';
              set(that, 'errorMessageComision', error);
            });
          });
        }
      }
    }
  }),
  observaProspecto: observer('prospecto', function() {
    info('si esta observando el prospecto');
    let l = get(this, 'prospectosofertas');
    set(l, 'content', []);
    let prospecto = get(this, 'prospecto');
    let that = this;
    set(this, 'isProspecto', false);
    if (prospecto.length > 5) {
      this.store.find('prospectoconcliente', prospecto).then((item)=> {
        let cuenta = get(item, 'cuenta');
        info('valor de cuenta', cuenta);
        if (parseInt(get(item, 'cuenta')) > 0) {
          info('si entro en condifico de error');
          set(that, 'tieneCuenta', true);
          set(that, 'afiliacionOk', false);
          set(that, 'errorMessage', 'La cuenta-oferta ya tiene inmueble asignado');
          set(that, 'prospecto', '');
        } else {
          set(that, 'errorMessage', '');
          set(that, 'afiliacionOk', true);
        }
      });
    }
    if (!get(this, 'prospectoNoChecar')) {
      this.store.query('prospectosoferta', { prospecto })
      .then((data)=> {
        data.forEach((item)=> {
          set(that, 'afiliacionNoChecar', true);
          set(that, 'prospectoNoChecar', true);
          set(that, 'prospecto', get(item, 'id'));
          set(that, 'afiliacion', get(item, 'afiliacion'));
          l.pushObject(prospectoArray.create({
            id: get(item, 'id'),
            nombre: get(item, 'nombre'),
            nombrevendedor: get(item, 'nombrevendedor'),
            gerente: get(item, 'gerente'),
            nombregerente: get(item, 'nombregerente')
          }));
          set(that, 'isProspecto', !isEmpty(get(that, 'prospecto')));
        });
      });
    } else {
      this.toggleProperty('prospectoNoChecar');
    }
    let antes = get(this, 'prospectoPrevio');
    let despues = get(this, 'prospecto');
    set(this, 'prospectoPrevio', despues);
    if (isEmpty(antes) && isEmpty(despues)) {
      info('aqui');
    } else {
      if (isEmpty(despues)) {
        this.send('freeProspecto', antes);
      } else {
        this.send('submitProspecto');
      }
    }
  }),
  highLightAndTrue: function(key) {
    if (!isEmpty(key)) {
      set(this, key, true);
    }
  }.on('highlightandtrue'),
  validaAfiliacion: observer('afiliacion', function() {
    if (computed.or('tipoCuentaEsContado', 'tipoCuentaEsHipotecaria')) {
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
      if (parseInt(digits[10]) === resultado) {
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
      let c = get(this, 'inmueblesdisponibles');
      let isDepto = get(this, 'departamento');
      if (get(this, 'departamento')) {
        let mySet = new Set([]);
        set(this, 'numerosExteriores', mySet);
      }
      return c.filter((item)=> {
        let m = get(item, 'manzana');
        let lote = get(item, 'lote');
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
      let etapa = parseInt(get(this, 'selectedEtapa'));
      let v = get(this, 'precios').clear();
      // let c = get(v, 'content');
      let c = this.store.findAll('preciosinmueble');
      let that = this;
      set(this, 'cuantosprecios', 0);
      c.then((data)=> {
        data.forEach((item)=> {
          let e = get(item, 'etapa');
          if (e === etapa) {
            let { descripcion, id, precio, precioraw, sustentable } = item.getProperties();
            // get(this,'precios.content').pushObject(
            v.pushObject(
              miPrecio.create({
                descripcion,
                etapa,
                id,
                precio,
                precioraw,
                sustentable,
                precioDescripcion: `${get(item, 'precio')} ${get(item, 'descripcion')}`
              })
            );
          }
        });
      });
      return get(this, 'precios');
    }
  }),
  observaEtapa: observer('selectedEtapa', function() {
    set(this, 'sumaCheca', false);
    let selectedEtapa = this.getWithDefault('selectedEtapa', '');
    if (selectedEtapa === '') {
      return;
    }
    let _this = this;
    set(_this, 'cuantosInmueblesDisponibles', 0);
    set(this, 'manzanasdisponibles', this.store.query('manzanasdisponible', { etapa: selectedEtapa }));
    let etapaPromesa =  this.store.find('etapasoferta', selectedEtapa);
    etapaPromesa.then((data)=> {
      set(_this, 'departamento', get(data, 'departamento'));
    });
    let idisp = this.store.query('inmueblesdisponible', { etapa: selectedEtapa });
    idisp.then((data)=> {
      set(_this, 'cuantosInmueblesDisponibles', get(data, 'length'));
    });
    let params = this.store.find('parametrosetapa', get(this, 'selectedEtapa'));
    params.then((data)=> {
      'anticipocomision apartado gastosadministrativos precioseguro'.w().forEach((key)=> {
        set(_this, key, get(data, key));
      });
    });
    set(this, 'inmueblesdisponibles', idisp);
  }),
  observarCliente: observer('cliente', function() {
    let cliente = get(this, 'cliente');
    set(this, 'clientesofertas', this.store.query('clientesoferta', { cliente }));
    let _this = this;
    if (cliente) {
      let url = `/api/referenciasrapconclientesincuentas/${cliente}`;
      this.get('ajax').request(url).then((data)=> {
        let ref = data.referenciasrapconclientesincuenta.referencia;
        set(_this, 'referencia', ref);
      });
    }
  }),
  observaAfiliacion: observer('afiliacion', function() {
    let afiliacion = get(this, 'afiliacion');
    let _this = this;
    if (!get(this, 'afiliacionNoChecar')) {
      this.store.query('prospectosoferta', { afiliacion })
      .then((data)=> {
        let l = get(_this, 'prospectosofertas');
        data.forEach((item)=> {
          set(_this, 'afiliacionNoChecar', true);
          set(_this, 'prospectoNoChecar', true);
          set(_this, 'prospecto', get(item, 'id'));
          set(_this, 'isProspecto', !isEmpty(get(_this, 'prospecto')));
          l.pushObject(prospectoArray.create({
            id: get(item, 'id'),
            nombre: get(item, 'nombre'),
            nombrevendedor: get(item, 'nombrevendedor'),
            gerente: get(item, 'gerente'),
            nombregerente: get(item, 'nombregerente')
          }));
        });
      });
    } else {
      this.toggleProperty('afiliacionNoChecar');
    }
  }),
  observaManzana: observer('selectedManzana', function() {
    set(this, 'selectedInmueble', null);
  }),
  observaPrecios: observer('selectedPrecio', function() {
    this.store.unloadAll('caracteristicasinmueble');
    info('a que hora entro a qui ');
    if (isEmpty(get(this, 'selectedEtapa'))) {
      return;
    }
    let precioid = 0;
    try {
      precioid = parseInt(get(this, 'selectedPrecio'));
      Ember.assert('el precio deberia ser mayor de cero', precioid > 0);
    } catch(error) {
      set(this, 'precioRaw', 0);
      set(this, 'nuevoPrecioRaw', 0);
      return;
    }
    let that = this;

    let listaPrecios = get(this, 'misprecios');
    get(that, 'misprecios').forEach((item)=> {
      if (get(that, 'selectedPrecio') === get(item, 'id')) {
        set(that, 'precioCatalogo', get(item, 'precio'));
        set(that, 'nuevoPrecioRaw', get(item, 'precio'));
        if (!get(that, 'candadoPrecio')) {
          set(that, 'precioRaw', get(item, 'precioraw'));
          set(that, 'nuevoPrecioRaw', get(item, 'precioraw'));
        }
      }
    });
    that.store.query('caracteristicasinmueble', { precio: isEmpty(get(that, 'selectedPrecio')) ? 0 : get(that, 'selectedPrecio') })
    .then((data)=> {
      if (get(data, 'length') > 0) {
        set(that, 'carateristicasLista', data);
      } else {
        set(that, 'carateristicasLista', null);
      }
    });
  }),
  hayCamposObligatorios: computed('inmueble', 'cliente', {
    get() {
      if (isEmpty(get(this, 'inmueble')) || isEmpty(get(this, 'cliente'))) {
        return false;
      }
      return true;
    }
  }),
  checaSuma: Ember.observer('nuevoPrecioRaw', 'precalificacion', 'avaluo', 'subsidio' , 'pagare' , 'prerecibo' , 'prereciboadicional', function() {
    let _this = this;
    let total = 0;
    'precalificacion avaluo subsidio pagare prerecibo prereciboadicional'.w().forEach((key)=> {
      try {
        let n = Number(_this.getWithDefault(key, 0));
        total = total + n;
      } catch(err) {
        info(err.message);
      }
    });
    let pr = get(this, 'precioRaw');
    if (get(this, 'candadoPrecio')) {
      pr = get(this, 'precioCatalogo');
    }
    info('valor de pr', pr);
    set(this, 'sumaCheca', total === pr && pr > 0);
  }),
  validations: {
    comision: {
      inclusion: { in: [true], message: 'no tiene comision' }
    },
    montoCreditoCorrecto: {
      inclusion: { in: [true], message: 'monto de credito debe contener cantidad' }
    },
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
    referencia: {
      numericality: { onlyInteger: true, greaterThan: 0, messages: { onlyInteger: 'Solo digitos deben ser', greaterThan: 'Debe tener valor' } }
    },
    afiliacion: {
      length: { is: 11, allowBlank: true },
      numericality: { onlyInteger: true, allowBlank: true, messages: { onlyInteger: 'Solo digitos deben ser' } }
    },
    cliente: {
      numericality: { onlyInteger: true, messages: { onlyInteger: 'Solo digitos deben ser' } }
    },
    prospecto: {
      numericality: { onlyInteger: true, messages: { onlyInteger: 'Solo digitos deben ser' } }
    },
    montocredito: {
      numericality: { allowBlank: true, greaterThan: 0, messages: { greatherThan: 'Debe ser mayor a 0' } }
    },
    gastosadministrativos: {
      numericality: { allowBlank: true }
    },
    precioseguro: {
      numericality: { allowBlank: true }
    },
    selectedEtapa: {
      exclusion: { in: [null], message: 'Debe seleccionar etapa' }
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
    }
  },
  actions: {
    checarComision() {
      let that = this;
      let inmueble = get(this, 'selectedInmueble');
      let prospecto = get(this, 'prospecto');
      info(`valor de prospecto ${prospecto} valor de inmueble ${inmueble}`);
      this.store.unloadAll('prospectosoferta');
      this.store.query('prospectosoferta', { prospecto, inmueble })
      .then((data)=> {
        data.forEach((item)=> {
          set(that, 'comision', get(item, 'tieneComision'));
        });
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
          set(that, 'emailaddress', data.email);
        }
      });
    },
    grabar() {
      let cambiar = function(valor) {
        if (isEmpty(valor)) {
          return valor = 0;
        }
        return valor;
      };
      set(this, 'processingGrabar', true);
      get(this, 'socket').send({ topic: 'lock_feature', data: { feature: 'oferta.save' } }, true);
      let model = this.store.createRecord('oferta',
        {
          afiliacion: get(this, 'afiliacion'),
          inmueble: get(this, 'inmueble'),
          cliente: get(this, 'cliente'),
          prospecto: get(this, 'prospecto'),
          precio: get(this, 'selectedPrecio'),
          montocredito: cambiar(get(this, 'montocredito')),
          apartado: cambiar(get(this, 'apartado')),
          gastosadministrativos: cambiar(get(this, 'gastosadministrativos')),
          precioseguro: cambiar(get(this, 'precioseguro')),
          anticipocomision: cambiar(get(this, 'anticipocomision')),
          precalificacion: cambiar(get(this, 'precalificacion')),
          avaluo: cambiar(get(this, 'avaluo')),
          subsidio: cambiar(get(this, 'subsidio')),
          pagare: cambiar(get(this, 'pagare')),
          referencia: get(this, 'referencia'),
          tipocuenta: get(this, 'tipoCuenta'),
          prerecibo: cambiar(get(this, 'prerecibo')),
          prereciboadicional: cambiar(get(this, 'prereciboadicional'))
        }
      );

      let that = this;
      model.save().then(
      (data)=> {
        set(that, 'ofertaGenerada', get(data, 'id'));
        that.store.findAll('printer')
        .then((data)=> {
          get(that, 'impresoras.content').clear();
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
        .then((emaildata)=> {
          if (emaildata.success === '1') {
            set(that, 'emailaddress', emaildata.email);
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
          ofertaGenerada: get(data, 'id')
        });
        get(that, 'socket').send({ topic: 'free_feature', data: { feature: 'oferta.save' } }, true);
        info('termino el socket de oferta.save');
      }, (error)=> {
        info('error del save');
        set(that, 'errorAlGrabar', '');
        that.toggleProperty('huboErrorAlGrabar');
        set(that, 'processingGrabar', false);
        let errorGenerado = '';
        try {
          errorGenerado = error.errors.resultado[0];
        } catch (er) {
          info('error en obtencion de error', er.message);
        }
        set(that, 'errorAlGrabar', errorGenerado);
        get(this, 'socket').send({ topic: 'free_feature', data: { feature: 'oferta.save' } }, true);
      });
    },
    submitInmueble() {
      let inmueble = parseInt(get(this, 'inmueble'));
      get(this, 'socket').send({ topic: 'lock_oferta_home', data: { inmueble } }, true);
      info('paso topic  lock_oferta_home');
    },
    freeInmueble(x) {
      let inmueble = parseInt(x);
      get(this, 'socket').send({ topic: 'free_oferta_home', data: { inmueble } }, true);
      info('paso free_oferta_home');
    },
    submitProspecto() {
      let prospecto = parseInt(get(this, 'prospecto'));
      get(this, 'socket').send({ topic: 'lock_prospecto', data: { prospecto } }, true);
      info('paso lock_prospecto');
    },
    freeProspecto(x) {
      let prospecto = parseInt(x);
      get(this, 'socket').send({ topic: 'free_prospecto', data: { prospecto } }, true);
      info('paso free_prospecto');
    },
    buscarClientesSinOfertas() {
      let _this = this;
      let cso = this.store.findAll('clientessinoferta');
      cso.then((data)=> {
        set(_this, 'hayClientesSinOfertas', get(data, 'length') > 0 ? true : false);
      });
      set(this, 'clientessinofertas', cso);
    },
    cerrarBusquedaCliente() {
      this.toggleProperty('hayClientesSinOfertas');
    },
    savemessage(what) {
      info('estoy en savemessage', what);
    },
    revisarErrores() {
      let _this = this;
      get(this, 'erroresHabidos.content').clear();
      Object.keys(get(this, 'errors')).forEach((que)=> {
        if (typeof que === 'string' || que instanceof String) {
          let error = get(_this, `errors.${que}`);
          if (typeof error[0] === 'string' || error[0] instanceof String) {
            let [ errmsg ] = error;
            if (errmsg === 'is not a number') {
              errmsg = 'no es numérico';
            }
            let mayuscula = que.capitalize();
            get(_this, 'erroresHabidos.content').pushObject(ErrorValidacion.create({
              variable: que,
              mensaje: errmsg,
              campo: _this.getWithDefault(`label${mayuscula}`, '')
            }));
          }
        }
      });
      this.toggleProperty('muestroErrores');
    },
    imprimir() {
      set(this, 'processingGrabar', true);
      let email = 'webmaster@grupoiclar.com';
      let oferta = parseInt(get(this, 'ofertaGenerada'));
      let etapa = get(this, 'selectedEtapa');
      let precalificacion = this.getWithDefault('precalificacion', 0) || 0;
      let avaluo = this.getWithDefault('avaluo', 0) || 0;
      let subsidio = this.getWithDefault('subsidio', 0) || 0;
      let pagare = this.getWithDefault('pagare', 0) || 0;
      let cliente = this.get('cliente') || 0;
      let ofertaPdf = '';
      let anexoPdf = '';
      let caracteristicasPdf = '';
      let rapPdf = '';
      let that = this;
      if (true) {
        let url = null;
        get(this, 'ajax').request(`/api/otro?printer=null&tipo=oferta&etapa=${etapa}&oferta=${oferta}`)
        .then((data)=> {
          if (data.error) {
            return;
          }
          ofertaPdf = data.name;
          set(that, 'ofertaPdf', ofertaPdf);
        });
        get(this, 'ajax').request(`/api/otro?printer=null&tipo=caracteristicas&etapa=${etapa}&oferta=${oferta}`)
        .then((data)=> {
          if (data.error) {
            return;
          }
          caracteristicasPdf = data.name;
          set(that, 'caracteristicasPdf', caracteristicasPdf);
        });
        url = `/api/otro?printer=null&tipo=anexo&etapa=${etapa}&oferta=${oferta}&precalificacion=${precalificacion}&avaluo=${avaluo}&subsidio=${subsidio}&pagare=${pagare}`;
        get(this, 'ajax').request(url)
        .then((data)=> {
          if (data.error) {
            return;
          }
          anexoPdf = data.name;
          set(that, 'anexoPdf', anexoPdf);
        });

        get(this, 'ajax').request(`/api/otro?printer=null&tipo=rap&cliente=${cliente}`)
        .then((data)=> {
          if (data.error) {
            return;
          }
          rapPdf = data.name;
          set(that, 'rapPdf', rapPdf);
        });

        Ember.run.later(function() {
          let { caracteristicasPdf, anexoPdf, ofertaPdf, emailaddress : emailAddress } = that.getProperties('caracteristicasPdf', 'anexoPdf', 'emailaddress');
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
            return !isEmpty(que);
          };
          let archivos = [ ofertaPdf, caracteristicasPdf, anexoPdf, rapPdf ];
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
                requestForPrinting(get(impresora, 'impresora'), ofertaPdf, get(that, 'copiasOferta'));
                requestForPrinting(get(impresora, 'impresora'), caracteristicasPdf, get(that, 'copiasCaracteristicas'));
                requestForPrinting(get(impresora, 'impresora'), anexoPdf, get(that, 'copiasAnexo'));
                requestForPrinting(get(impresora, 'impresora'), rapPdf, get(that, 'copiasRap'));
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
    seleccionarCliente(cliente) {
      set(this, 'cliente', cliente);
      this.send('cerrarBusquedaCliente');
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
      let c = get(this, 'inmueblesdisponibles');
      let mySet2 = new Set([]);
      set(this, 'numerosInteriores', mySet2);
      return c.filter(function(item) {
        let lote = get(item, 'lote');
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
      let inmueble = get(cual, 'id');
      set(this, 'selectedInmueble', inmueble);
    },
    probar() {
      get(this, 'socket').send({ topic: 'lock_feature', data: { feature: 'oferta.save' } }, true);
      let p = new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.run.later(function() {
          resolve(1);
        }, 5000);
      });
      p.then((data)=> {
        info('regresando promesa', data);
        get(this, 'socket').send({ topic: 'free_feature', data: { feature: 'oferta.save' } }, true);
      });
    }
  }
});
