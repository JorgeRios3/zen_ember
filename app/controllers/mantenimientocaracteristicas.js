import Ember from 'ember';

const {
  get,
  set,
  getProperties,
  setProperties,
  Logger: { info },
  computed,
  isEmpty
} = Ember;
export default Ember.Controller.extend({
  activarBtnGrabarActualizar: computed('caracteristicaDescrip', {
    get() {
      if (!isEmpty(get(this, 'caracteristicaDescrip'))) {
        return true;
      } else {
        return false;
      }
    }
  }),

  actions: {
    eliminar() {
      let r = get(this, 'record');
      let oldval = get(r, 'descripcion');
      r.deleteRecord();
      r.save().then((data)=> {
        info('se borro');
        this.store.unloadAll('caracteristica');
        this.store.findAll('caracteristica')
        .then((data)=>{
          set(this, 'model', data);
          set(this, 'showForma', false);
          set(this, 'btnGrabar', false);
        });
      },(error)=> {
        set(this, 'errorMsg', error.errors[0].detail);
        Ember.run.later('', ()=>{
          set(this, 'errorMsg', null);
        },4000)
      });
    },
    grabar() {
      let descripcion = get(this, 'caracteristicaDescrip');
      descripcion = descripcion.toUpperCase();
      descripcion = descripcion.trim();
      let r = this.store.createRecord('caracteristica', {
        descripcion
      });
      r.save().then(()=> {
        info('se grabo');
        this.store.unloadAll('caracteristica');
        this.store.findAll('caracteristica')
        .then((data)=>{
          set(this, 'model', data);
          set(this, 'showForma', false);
          set(this, 'btnGrabar', false);
        });
      });
    },
    formaInsert() {
      set(this, 'caracteristicaDescrip', '');
      set(this, 'showForma', true);
      set(this, 'btnGrabar', true);
      set(this, 'record', null);
    },
    seleccionarItem(item) {
      this.store.find('caracteristica', item.id)
      .then((data)=> {
      	info('si llego', data);
        set(this, 'record', data);
        set(this, 'caracteristicaDescrip', get(data, 'descripcion'));
        set(this, 'showForma', true);
      })
    },
    cerrarForma(){
      set(this, 'showForma', false);
      set(this, 'btnGrabar', false);    
    },
    actualizar() {
      let r = get(this, 'record');
      let oldval = get(r, 'descripcion');
      let descripcion = get(this, 'caracteristicaDescrip');
      descripcion = descripcion.toUpperCase();
      descripcion = descripcion.trim();
      r.setProperties({
        descripcion
      });
      r.save().then(()=>{
        info('se actualizo');
        set(this, 'showForma', false);
      },(error)=> {
        set(this, 'errorMsg', error.errors[0].detail);
        set(r, 'descripcion', oldval);
        Ember.run.later('', ()=>{
          set(this, 'errorMsg', null);
        },4000)
      });

    }
  }
});
