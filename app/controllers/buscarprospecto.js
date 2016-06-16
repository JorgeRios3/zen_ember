import Ember from 'ember';
const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  getOwner,
  inject: { controller, service },
  Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  session: service(),
  // needs: ['prospectosbusquedas','application'],
  ci: controller('index'),
  comodin: service(),
  resultPage: '',
  resultPages: '',
  resultRowCountFormatted: '',
  requestedPage: 0,
  huboEnBusqueda: true,
  nombreLen: true,
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
      if (parseInt(get(this, 'resultPage')) < parseInt(get(this, 'resultPages'))) {
        return true;
      } else {
        return false;
      }
    }
  }),

  criterioindividual: false,
  tipoFecha: null,
  tipoCuenta: null,
  nullFechaInicial: '',
  fechaInicial: '',
  nullFechaFinal: '',
  fechaFinal: '',
  sincierre: false,
  selectedGerente: null,
  deboFiltrar: false,
  afiliacionOk: false,
  numeroprospecto: '',
  nombreprospecto: '',
  apellidomaternoprospecto: '',
  nombrepilaprospecto: '',
  afiliacion: '',
  cuantosBusqueda: 0,
  fini: '',
  ffin: '',
  criterioFiltro: 'numero',
  apGerentesventas: null,
  apVendedors: null,
  apMediospublicitarios: null,
  apProspectosrecientes: null,
  criterios: [
		{ id: 'numero', criterio: 'N&uacute;mero de Prospecto'.htmlSafe() },
		{ id: 'afiliacion', criterio: 'Afiliaci&oacute;n al IMSS'.htmlSafe() },
		{ id: 'nombre', criterio: 'Nombre del Prospecto' }
  ],
  criterioEsNombre: computed.equal('criterioFiltro', 'nombre'),
  criterioEsNumero: computed.equal('criterioFiltro', 'numero'),
  criterioEsAfiliacion: computed.equal('criterioFiltro', 'afiliacion'),

  muestraNavegacion: computed('resultPage', {
    get() {
      let cuantos = get(this, 'resultPages');
      if (Ember.isEmpty(cuantos)) {
        return false;
      }
      return parseInt(cuantos) > 1;
    }
  }),
  copiable: computed('ci.perfil', {
    get() {
      let perfil = get(this, 'ci.perfil');
      let valido = false;
      'admin subdireccioncomercial comercial'.w().forEach((item)=> {
        if (perfil === item) {
          valido = true;
        }
      });
      return valido;
    }
  }),
  tiposresultados: [
		{ id: 1, tipo: 'Solo cuantos' },
		{ id: 2, tipo: 'Contenido' }
  ],
  tipoResultado: null,
  tipoContenido: computed('tipoResultado', 'criterioindividual', {
    get() {
      return get(this, 'tipoResultado') === 2 || get(this, 'criterioindividual');
    }
  }),

  selectedVendedor: null,
  selectedMedio: null,
  recientes: computed.alias('apProspectosrecientes'),
  // buscados: Ember.computed.alias('controllers.prospectosbusquedas'),
  buscados: null,
  searchStyle: 'position: fixed; left : 120px; top : 40px; background : rgb(158,159,182); padding: 4.5px; border-radius: 6px',
  tiposfechas: [ { id: 'alta', tipo: 'Alta' },
					{ id: 'cierre', tipo: 'Cierre' }
    ],
  tiposcuentas: [ { id: 'infonavit', tipo: 'Infonavit' },
					{ id: 'contado', tipo: 'Contado' },
					{ id: 'hipotecaria', tipo: 'Hipotecaria' },
					{ id: 'pensiones', tipo: 'Pensiones del Estado' },
					{ id: 'fovisste', tipo: 'Fovisste' }
    ],
  tipoFechaEsAlta: computed.equal('tipoFecha', 'alta'),
  misvendedores: computed('selectedGerente', {
    get() {
      let gte = parseInt(get(this, 'selectedGerente'));
      let c = get(this, 'apVendedors');
      let that = this;
      set(this, 'cuantosvendedores', 0);
      return c.filter(function(item) {
        let g = get(item, 'gerente');
        if (g === gte) {
          that.incrementProperty('cuantosvendedores');
          return true;
        } else {
          return false;
        }
      });
    }
  }),
  validaAfiliacion: observer('afiliacion', function() {
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
  }),
  observaNombreLen: observer('nombreprospecto', 'criterioFiltro', function() {
    if (get(this, 'criterioEsNombre')) {
      if (get(this, 'nombreprospecto').length >= 3) {
        set(this, 'nombreLen', true);
      } else {
        set(this, 'nombreLen', false);
      }
    } else {
      set(this, 'nombreLen', true);
    }
  }),
  actions: {
    generaAfiliacion(prospecto) {
      info(Object.keys(prospecto));
      info(get(prospecto, 'apellidopaterno'));
      set(prospecto, 'afiliacion', '1');
      prospecto.save().then(()=> {
        info('ya se grabo bien');
        this.transitionToRoute('index');
      }, (error)=> {
        info('no se grabo se fue por error');
      });
      info('entro en generarAfialiacion');
    },
    copiarAfiliacion(afiliacion, prospecto) {
      set(this, 'prospecto', '');
      get(this, 'comodin').setProperties({
        afiliacion,
        prospecto
      });
      this.transitionToRoute('oferta', { queryParams: { afiliacion: '', prospecto: '', origenOferta: '' } });
    },
    recargarRecientes(tipo) {
      let recientes = get(this, 'recientes');
      set(recientes, 'model', this.store.query('prospectosreciente', { afiliacionvalida: tipo }));
    },
    filtrar() {
      set(this, 'deboFiltrar', true);
      set(this, 'requestedPage', 0);
    },
    todos() {
      set(this, 'deboFiltrar', false);
    },
    mostrarPagPrevia() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage - 1;
      set(this, 'requestedPage', nextPage);
      this.send(get(this, 'criterioindividual') ? 'mostrarCriterioIndividual' : 'mostrar');
    },
    mostrarPagSiguiente() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage + 1;
      set(this, 'requestedPage', nextPage);
      this.send(get(this, 'criterioindividual') ? 'mostrarCriterioIndividual' : 'mostrar');
    },
    mostrarCriterioIndividual() {
      let requestedPage = get(this, 'requestedPage') || '1';
      let criterio = {
        numeroprospecto: get(this, 'numeroprospecto') || '0',
        nombreprospecto: get(this, 'nombreprospecto') || '',
        apellidomaternoprospecto: get(this, 'apellidomaternoprospecto') || '',
        nombrepilaprospecto: get(this, 'nombrepilaprospecto')  || '',
        afiliacion: get(this, 'afiliacion') || '',
        criterio: get(this, 'criterioFiltro')  || 'numero',
        page: requestedPage
      };
      set(this, 'deboFiltrar', false);
      let that = this;
      let que = 'prospectosbusqueda';
      this.store.unloadAll(que);
      set(this, 'huboEnBusqueda', true);
      set(this, 'buscados', null);
      this.store.query(que, criterio).then(
        (data) => {
          set(that, 'huboEnBusqueda', data.length !== 0);
          set(that, 'cuantosBusqueda', '');
          set(that, 'buscados', data);
          set(that, 'resultPage', get(data, 'meta.page'));
          set(that, 'resultPages', get(data, 'meta.pages'));
          set(that, 'resultRowCountFormatted', get(data, 'meta.rowcountformatted'));
        },
        () => {
          set(that, 'cuantosBusqueda', '');
        }
      );
    },
    mostrar() {
      let tipo = get(this, 'tipoResultado');
      if (tipo !== 1 && tipo !== 2) {
        tipo = 1;
      }
      let that = this;
      let vendedor = get(this, 'selectedVendedor') || 0;
      let gerente = get(this, 'selectedGerente') || 0;
      let mediopublicitario = get(this, 'selectedMedio') || 0;
      let fInicial = get(this, 'fechaInicial');
      let fechainicial = !isEmpty(fInicial) ? fInicial.format('DD/MM/YYYY') : '';
      let fFinal = get(this, 'fechaFinal');
      // info('FECHA FINAL', fFinal.format('DD/MM/YYYY'));
      let fechafinal = !isEmpty(fFinal) ? fFinal.format('DD/MM/YYYY') : '';
      let tipofecha = get(this, 'tipoFecha') || '';
      let tipocuenta = get(this, 'tipoCuenta') || '';
      let sincierre = get(this, 'sincierre');
      let requestedPage = get(this, 'requestedPage') || '1';
      let criterio = {
        vendedor,
        gerente,
        mediopublicitario,
        fechainicial,
        fechafinal,
        tipofecha,
        tipocuenta,
        sincierre: sincierre ? '1' : '0',
        page: requestedPage
      };
      let que = tipo === 1 ? 'cuantosprospecto' : 'prospectosbusqueda';
      if (tipo === 2) {
        set(that, 'deboFiltrar', false);
      }
      this.store.query(que, criterio).then(
        (data)=> {
          if (tipo === 1) {
            let cuantos = 0;
            data.forEach((item)=> {
              cuantos = get(item, 'cuantosformateado');
            });
            set(that, 'cuantosBusqueda', cuantos);
          } else {
            set(that, 'cuantosBusqueda', '');
            set(that, 'buscados', data);
            set(that, 'resultPage', get(data, 'meta.page'));
            set(that, 'resultPages', get(data, 'meta.pages'));
            set(that, 'resultRowCountFormatted', get(data, 'meta.rowcountformatted'));
          }
        },
        () => {
          set(that, 'cuantosBusqueda', '');
        }
      );
    },
    getDateValue(result) {
      set(this, result.tag, result.value);
    }
  }
});

