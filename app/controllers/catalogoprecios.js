import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';

const {
 get,
 set,
 Logger: { info },
 getProperties,
 setProperties,
 observer,
 isEmpty,
 computed
} = Ember;

export default Ember.Controller.extend(FormatterMixin,{
  listaEstatus: [{ 'label':'activo', 'valor':'true' }, { 'label':'Desactivado', 'valor':'false' }],
  listaSustentable: [{ 'label':'Si', 'valor':'true' },{ 'label':'No', 'valor':'false' }],
  listatipo: [{ 'label':'A', 'valor':'A' },{ 'label':'B', 'valor':'B' },{ 'label':'C', 'valor':'C' }],
  listaVisible: [{ 'label':'Si', 'valor':true }, { 'label':'No', 'valor':false }],
  showPrecios: true,
  showDetalle: false,
  selectedCaracteristica: '',
  selectedEtapaPrecio: '',
  flagBotonGuardarEditar: computed.gt('caracteristicasPrecio.length', 0),
  observaval:observer('selectedSustentableItem', function() {
    set(this, 'sustentableEditar', get(this, 'selectedSustentableItem'));
  }),
  observaActivo: observer('selectedActivoItem', function() {
    set(this, 'activoEditar', get(this, 'selectedActivoItem'));
  }),

  observaCaracteristicaAndCantidad: computed('selectedCaracteristica', 'cantidad', {
  	get() {
      let cantidad = get(this, 'cantidad');
      let caracteristica = get(this, 'selectedCaracteristica');
      if (cantidad > 0 && !isEmpty(caracteristica)) {
      	return true
      } else {
      	return false;
      }
    }
  }),
  observaDescripcion: computed('descripcion', {
    get() {
      let d = get(this, 'descripcion');
      if(!isEmpty(d)) {
      	return true;
      } else {
      	return false;
      }
    }
  }),
  precioMayorADescuento: computed('precio', 'descuento', {
    get() {
      let p = get(this, 'precio');
      let d = get(this, 'descuento');
      if (parseFloat(p) > parseFloat(d) || parseFloat(p) > 0 && parseFloat(d) === 0) {
      	return true;
      } else {
        return false;
      }
    }
  }),
  etapaPrecio: computed('selectedEtapaPrecio', {
  	get(){
  	  return !isEmpty(get(this, 'selectedEtapaPrecio'));
  	}
  }),
  actions: {
  	guardarNuevo() {
  	  info('fuardar nuevo');
  	  let r = get(this, 'catalogo');
  	  let cadena = [];
  	  get(this, 'caracteristicasPrecio').forEach((item)=>{
  	    cadena.push(`${get(item, 'id')}:${get(item, 'cantidad')}`)
  	  });
  	  let caracteristicas = cadena.join(",");
  	  info(cadena);
  	  let descripcion = get(this, 'descripcion');
      let precio = this.formatter(get(this, 'precio'));
      let precioraw = parseFloat(get(this, 'precio'))
      let descuento = this.formatter(get(this, 'descuento'));
      let descuentoraw = parseFloat(get(this, 'descuento'));
      let activo = get(this, 'selectedActivoItem');
      let sustentable = get(this, 'selectedSustentableItem');
      let tipo = get(this, 'selectedPrototipoItem');
      let visible = get(this, 'selectedVisibleItem');
      let etapa = get(this, 'selectedEtapaPrecio');
      info('des', descripcion);
      info('precio', precio);
      info('precior', precioraw);
      info('descuento', descuento);
      info('desr', descuentoraw);
      info('act', activo);
      info('sus', sustentable);
      info('etapa', etapa);
      info('tipo', tipo);
      info('visible', visible);
      r = this.store.createRecord('preciosinmueble', {
        descripcion,
        precio,
        precioraw,
        descuento,
        descuentoraw,
        activo,
        sustentable,
        tipo,
        visible,
        etapa,
        caracteristicas
      });
      r.save().then((data)=> {
        info('si se grabo el nuevo precio');
      });

  	},
  	guardarEditar() {
  	  let r = get(this, 'catalogo');
  	  let cadena = [];
  	  get(this, 'caracteristicasPrecio').forEach((item)=>{
  	    cadena.push(`${get(item, 'id')}:${get(item, 'cantidad')}`)
  	  });
  	  let caracteristicas = cadena.join(",");
  	  info(cadena);
  	  let descripcion = get(this, 'descripcion');
      let precio = this.formatter(get(this, 'precio'));
      let precioraw = parseFloat(get(this, 'precio'))
      let descuento = this.formatter(get(this, 'descuento'));
      let descuentoraw = parseFloat(get(this, 'descuento'));
      let activo = get(this, 'selectedActivoItem');
      let sustentable = get(this, 'selectedSustentableItem');
      let tipo = get(this, 'selectedPrototipoItem');
      let visible = get(this, 'selectedVisibleItem');
      info('des', descripcion);
      info('precio', precio);
      info('precior', precioraw);
      info('descuento', descuento);
      info('desr', descuentoraw);
      info('act', activo);
      info('sus', sustentable);
      info(get(r, 'id'));
      r.setProperties({
      	descripcion,
      	precio,
      	precioraw,
      	descuento,
      	descuentoraw,
      	activo,
      	sustentable,
      	caracteristicas,
      	tipo,
      	visible
      });
      r.save();
  	},
  	quitarCaracteristica(c) {
  	  let item = get(this, 'caracteristicasPrecio').findBy('descripcion', get(c, 'descripcion'));
  	  get(this, 'caracteristicasPrecio').removeObject(item);
  	},
  	agregarCaracteristica() {
  	  let lista = get(this, 'caracteristicasPrecio');
  	  let item = get(this, 'selectedCaracteristica');
  	  let valida = lista.findBy('id', get(item ,'id'));
  	  if (valida) {
  	  	set(this, 'errorMsg', 'no se puede agregar la misma caracteristica 2 veces');
  	  	return;
  	  } else {
  	  	info(' valor de valida', valida);
  	  	info('valor de item', item);
  	  	let cantidad = get(this, 'cantidad');
  	  	let objeto = { 'id': get(item, 'id'), 'descripcion': get(item, 'descripcion'), cantidad };
  	  	lista.addObject(objeto);
  	  	set(this, 'selectedCaracteristica', '');
  	  	set(this, 'cantidad', '');
  	  }
  	},
    buscar() {
      let etapa = get(this, 'selectedEtapa');
      let activo = get(this, 'selectedEstatus');
      this.store.query('preciosinmueble', { etapa, activo })
      .then((data)=> {
        set(this, 'listaPrecios', data);
        set(this, 'showPrecios', true);
        set(this, 'showDetalle', false);
      });
    },
    precioNuevo() {
      info('jaja');
      let listaE = [];
      let listaS = [];
      //set(this, 'escojeRetapa', true);
      set(this, 'newFlag', true);
      listaE.push({ 'label':'Si', 'valor':true }, { 'label':'No', 'valor':false });
      set(this, 'listaEstatusPrecio', listaE);
      listaS.push({ 'label':'Si', 'valor':true }, { 'label':'No', 'valor':false });
      set(this, 'listaSustentablePrecio', listaS);
      set(this, 'descripcion', '');
      set(this, 'precio', 0);
      set(this, 'descuento', 0);
      set(this, 'selectedCaracteristica', '');
      set(this, 'cantidad', '');
      set(this, 'showDetalle', true);
      set(this, 'showPrecios', false);
      set(this, 'caracteristicasPrecio', []);
      set(this, 'selectedVisibleItem', true);
      set(this, 'selectedPrototipoItem', 'A');
      set(this, 'selectedSustentableItem', true);
      set(this, 'selectedActivoItem', true);
    },
    BuscarCatalogo(r) {
      set(this, 'newFlag', false);
      let listaE = [];
      let listaS = [];
      //let listaP = [];
      //let catalogoP = [{ 'label':'A', 'valor':'A' },{ 'label':'B', 'valor':'B' },{ 'label':'C', 'valor':'C' }];
      set(this, 'catalogo', r);
      info('catalogo', r);
      let precio_catalogo = get(r, 'id');
      let precio = get(r, 'id');
      set(this, 'descripcion', get(r, 'descripcion'));
      set(this, 'precio', get(r, 'precioraw'));
      set(this, 'descuento', get(r, 'descuentoraw'));
      set(this, 'selectedActivoItem', get(r, 'activo'));
      set(this, 'selectedSustentableItem', get(r, 'sustentable'));
      set(this, 'selectedPrototipoItem', get(r, 'tipo'));
      set(this, 'selectedVisibleItem', get(r, 'visible'));
      //let tipoItem = catalogoP.findBy('valor', )
      if (get(r, 'activo') === true) {
        listaE.push({ 'label':'Si', 'valor':true }, { 'label':'No', 'valor':false });
        set(this, 'listaEstatusPrecio', listaE);
      } else {
      	listaE.push({ 'label':'No', 'valor':false },{ 'label':'Si', 'valor':true });
      	set(this, 'listaEstatusPrecio', listaE);
      }
      if (get(r, 'sustentable') === true) {
        listaS.push({ 'label':'Si', 'valor':true }, { 'label':'No', 'valor':false });
        set(this, 'listaSustentablePrecio', listaS);
      } else {
      	listaS.push({ 'label':'No', 'valor':false },{ 'label':'Si', 'valor':true });
      	set(this, 'listaSustentablePrecio', listaS);
      }
      let lista = [];
      this.store.query('caracteristicasinmueble', { precio_catalogo, precio })
      .then((data)=> {
      	data.forEach((item)=> {
      	  let { id, descripcion, cantidad } = getProperties(item, 'id descripcion cantidad'.w());
      	  lista.addObject({ id, descripcion, cantidad });
      	})
        set(this, 'caracteristicasPrecio', lista);
        set(this, 'showPrecios', false);
        set(this, 'showDetalle', true);
      });
    }
  }
});