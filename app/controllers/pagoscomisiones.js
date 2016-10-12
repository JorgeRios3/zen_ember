import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
const {
  get,
  set,
  getProperties,
  observer,
  computed,
  Logger: { info },
  inject: { service },
  isEmpty
} = Ember;

export default Ember.Controller.extend(FormatterMixin, {
  pago: '',
  comodin: service(),
  levantaModal: false,
  pagoComision: null,
  comisionesLista: null,
  pagoImporte: null,
  pagoImpuesto: null,
  solicitudCheque: null,
  nuevaSolicitud: null,
  editable: false,
  nombreVendedor: '',
  esGerente: false,
  cantidadesIguales: true,
  mostrarImprimirReporte: false, 
  numeroSolicitud: null,
  pagoComodin: null,
  TieneValor: observer('pagoComodin', function() {
    set(this, 'pago', get(this, 'pagoComodin'));
    this.send('buscarPago');
  }),
  cantidadesIgualesObserver: observer('numeroSolicitud', function() {
    let numeroSolicitud = get(this, 'numeroSolicitud');
    let suma = 0;
    let cantidad = 0;
    if (numeroSolicitud !== null) {
      cantidad = get(this, 'solicitudcheque.cantidad');
      let pagoImporte = get(this, 'pagoImporte').replace(',', '');
      let pagoImpuesto = get(this, 'pagoImpuesto').replace(',', '');
      suma = parseFloat(pagoImporte) + parseFloat(pagoImpuesto);
    } else {
      set(this, 'cantidadesIguales', true);
      return;
    }
    set(this, 'cantidadesIguales', suma === cantidad);
  }),
  actions: {
    regresaComisionEstadoCuenta() {
      this.transitionToRoute('comisionestadocuenta');
    },
    togglePrinterComponent() {
      info('hola');
    },
    cerrarModal() {
      set(this, 'levantaModal', false);
    },
    toggleEditable() {
      this.toggleProperty('editable');
    },
    editarSolicitud(solicitud) {
      set(this, 'nuevaSolicitud', null);
      let r = get(this, 'pagoComision');
      set(r, 'solicitudcheque', solicitud);
      r.save()
      .then((data)=> {
        this.toggleProperty('editable');
        this.send('buscarPago');
      });
    },
    buscarPago() {
      'pagocomision pagocomisiondetalle solicitudcheque'.w().forEach((item)=> {
        this.store.unloadAll(item);
      });
      let pago = get(this, 'pago');
      // this.store.find('pagocomision', recibo)
      let lista = Ember.A();
      // this.store.unloadAll('pagocomision');
      this.store.find('pagocomision', pago)
      .then((data)=> {
        set(this, 'pagoComision', data);
        set(this, 'mostrarImprimirReporte', true);
        set(this, 'pagoImporte', this.formatter(get(data, 'pagoimporte')));
        set(this, 'pagoImpuesto', this.formatter(get(data, 'pagoimpuesto')));
        let solicitud = get(data, 'solicitudcheque');
        if (solicitud !== 0) {
          set(this, 'numeroSolicitud', null);
          this.store.find('solicitudcheque', solicitud)
          .then((soli)=> {
            set(this, 'solicitudCheque', soli);
            set(this, 'numeroSolicitud', get(soli, 'id'));
          }, (error)=> {
            info('no encontro solicitud');
          });
        } else {
          set(this, 'solicitudCheque', null);
        }
        return this.store.query('pagocomisiondetalle', { pago })
  	    .then((data)=> {
    data.forEach((item)=> {
      let etapaFind = get(item, 'etapa');
      let etapaObjecto = get(this, 'listaEtapas').findBy('id', `${etapaFind}`);
      let etapaNombre = get(etapaObjecto, 'nombre');
      let { id, documento, inmueble, cuenta, manzana, lote, importe, nombrevendedor, esgerente, nombrecliente }  = getProperties(item, 'id documento inmueble cuenta manzana lote importe nombrevendedor esgerente nombrecliente'.w());
      set(this, 'nombreVendedor', nombrevendedor);
      set(this, 'esGerente', esgerente);
      lista.pushObject({
        id,
        documento,
        inmueble,
        cuenta,
        etapaNombre,
        manzana,
        lote,
        importe: this.formatter(importe),
        nombrevendedor,
        esgerente,
        nombrecliente
      });
    });
    set(this, 'comisionesLista', lista);
  });
      }, (error)=> {
        set(this, 'mostrarImprimirReporte', false);
        set(this, 'levantaModal', true);
        info('error no lo encontro');
      });
    }
  }
});
