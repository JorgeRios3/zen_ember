import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
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

export default Ember.Controller.extend(FormatterMixin, {
  session: Ember.inject.service(),
  ajax: service(),
  esBreve: false,
  esSmartics: computed('', {
    get() {
      let app = getOwner(this).lookup('controller:application');
      let usuario = get(app, 'usuario');
      if (usuario === 'smartics') {
        return true;
      } else {
        return false;
      }
    }
  }),
  esCesar: computed('', {
    get() {
      let app = getOwner(this).lookup('controller:application');
      let usuario = get(app, 'usuario');
      if (usuario === 'cesar') {
        return true;
      } else {
        return false;
      }
    }
  }),
  actions: {
    togglePrinterComponent() {
      this.toggleProperty('showComponent');
    },
    resumenBreve() {
      info(get(this, 'esSmartics'));
      this.toggleProperty('esBreve');
      // let resumen = get(this, 'ajax').request(`/api/ropiclar?elixir=1`);
      info(get(this, 'model'));
      let model = get(this, 'model');
      info(model.resumen);
      let that = this;
      let etapas = [];
      for (let i = 0; i < 4; i++) {
        let val = model.etapas.objectAt(i);
        etapas.push(parseInt((get(val, 'id'))));
      }
      etapas = etapas.reverse();
      this.setProperties({
        data: Ember.ArrayProxy.create({ content: [] }),
        showComponent: false,
        fecha: get(model.resumen, 'fecha')
      });
      let indice = 0;
      for (let etapa of etapas) {
        indice++;
        set(this, `nombre${indice}`, get(model.resumen, 'nombres_etapas')[etapa][0]);
      }
      try {
        let kvalores =  get(model.resumen, 'kvalores');
        if (get(this, 'esBreve')) {
          kvalores =  get(model.resumen, 'kvalores2');
        }
        kvalores.forEach((kvalor)=> {
          let linea = get(model.resumen, 'valores')[kvalor];
          let t = 0;
          for (let etapa of etapas) {
            t = t + linea[etapa];
          }
          let objeto = Ember.Object.create({
            titulo: linea[-1],
            tipo: linea[0] === 'GCMEX' ? 'CONSTRUCTOR' : linea[0],
            total: this.formatter(t, 2, '.', ',', true)
          });
          let indice = 0;
          for (let etapa of etapas) {
            indice++;
            set(objeto, `etapa${indice}`, this.formatter(linea[etapa], 2, '.', ',', true));
          }
          get(this, 'data.content').pushObject(objeto);
        });
      }
      catch(err) {
        info('trono', err.message);
      }
    }
  }
});
