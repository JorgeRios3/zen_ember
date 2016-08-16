import Ember from 'ember';

const {
	get,
	set,
	RSVP: { hash },
	Logger: { info },
	computed,
	isEmpty,
	observer,
	getProperties
} = Ember;

export default Ember.Controller.extend({
  listaVendedoresComisiones: null,
  inmueble: '',
  recordInmueble: null,
  titleCols: ['id', 'inmueble', 'porcentaje %', 'vendedor', 'nombre', 'fecha'],
  alignments: ['left', 'left', 'left', 'left', 'left'],
  editable: null,
  error: null,
  forma: false,
  selectedGerente: null,
  selectedVendedor: null,
  porcentaje: '',
  listaComisionesInmueble: null,
  setVendedores: null,
  vendedor: null,
  puedoGrabar: false,
  errorGrabar: false,
  porcentajeTotalInmueble: '',
  inmuebleNoEditable: computed('editable', {
    get() {
      if (get(this, 'editable') === false) {
        return true;
      } else {
        return false;
      }
    }
  }),
  misvendedores: computed('selectedGerente', {
    get() {
      if (get(this, 'selectedGerente') !== null) {
        let gerente = get(this, 'selectedGerente');
        info('viendo cuanto vale selectedgeten', gerente);
        set(this, 'listaVendedoresComisiones', this.store.query('vendedorcomision', { gerente }));
        info('listavendedorescomisiones', get(this, 'listaVendedoresComisiones'));
        let gte = parseInt(get(this, 'selectedGerente'));
        let c = get(this, 'apVendedors');
        let that = this;
        return c.filter(function(item) {
          let g = get(item, 'gerente');
          if (g === gte) {
            return true;
          } else {
            return false;
          }
        });
      }
    }
  }),
  observaBotonGrabar: computed('puedoGrabar', 'porcentaje', {
    get() {
      if (get(this, 'puedoGrabar') === true && get(this, 'porcentaje') !== '') {
        return true;
      } else {
        return false;
      }
    }
  }),
  observaSelectedVendedor: observer('selectedVendedor', function() {
    let selectedVenedor = get(this, 'selectedVendedor');
    info('valor de vendedor', selectedVenedor);
    if (selectedVenedor !== null) {
      let vendedorTieneComision = get(this, 'listaComisionesInmueble').findBy('vendedor', parseInt(selectedVenedor));
      if (isEmpty(vendedorTieneComision)) {
        set(this, 'puedoGrabar', true);
        set(this, 'errorGrabar', false);
        info('el vendedor no esta en la lista de las comisiones, sigue adelante');
      } else {
        set(this, 'puedoGrabar', false);
        set(this, 'errorGrabar', true);
        info('ya tiene comision en el inmueble');
      }
    }
  }),
  llenarTablaComisiones() {
    let porcentajeTotal = 0;
    this.store.unloadAll('comisioncompartida');
    let listaComisiones = Ember.A();
    let inmueble = get(this, 'inmueble');
    this.store.query('comisioncompartida', { inmueble })
    .then((data2)=> {
      data2.forEach((item)=> {
        let { id, inmueble, porcentaje, vendedor, fecha } = getProperties(item, 'id inmueble porcentaje vendedor fecha'.w());
        info('vale vendedor en buscar', vendedor);
        let cual = get(this, 'apVendedors').findBy('id', `${vendedor}`);
        let nombre = get(cual, 'nombre');
        porcentajeTotal += parseFloat(porcentaje);
        listaComisiones.pushObject({ id, inmueble, porcentaje, vendedor, nombre, fecha });
      }, (error)=> {
        info('error en comisioncompartida promesa');
      });
      set(this, 'listaComisionesInmueble', listaComisiones);
      set(this, 'porcentajeTotalInmueble', porcentajeTotal);
    });
  },
  actions: {
    eliminarComision(comisionid) {
      this.store.unloadAll('comisioncompartida');
      this.store.find('comisioncompartida', comisionid)
      .then((data)=> {
        data.deleteRecord();
        data.save().then(()=> {
          this.llenarTablaComisiones();
        }); // => DELETE to /posts/1
      });
    },
    guardarComision() {
      let inmueble = get(get(this, 'recordInmueble'), 'id');
      let vendedor = get(this, 'selectedVendedor');
      let porcentaje = get(this, 'porcentaje');
      let record = this.store.createRecord('comisioncompartida', {
        inmueble,
        vendedor,
        porcentaje
      });
      record.save().then(()=> {
        info('se grabo');
        this.llenarTablaComisiones();
        set(this, 'forma', false);
      }, (error)=> {
        info('trono');
      });
    },
    levantaFormaComision() {
      set(this, 'porcentaje', '');
      set(this, 'selectedVendedor', null);
      set(this, 'selectedGerente', null);
      this.toggleProperty('forma');
    },
    buscarInmueble() {
      set(this, 'forma', false);
      set(this, 'errorGrabar', false);
      set(this, 'error', null);
      let listaComisiones = Ember.A();
      let inmueble = get(this, 'inmueble');
      this.store.unloadAll('inmueblecomisioncompartida');
      this.store.find('inmueblecomisioncompartida', inmueble)
      .then((data)=> {
        if (!isEmpty(get(data, 'manzana'))) {
          set(this, 'recordInmueble', data);
          set(this, 'editable', get(data, 'editable'));
          this.llenarTablaComisiones();
        } else {
          set(this, 'error', 'no se encontro el inmueble solicitado');
          set(this, 'recordInmueble', null);
        }
      });
    }
  }
});
