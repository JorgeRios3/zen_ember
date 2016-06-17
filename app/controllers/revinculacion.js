import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';
import ModalDispatchMixin from '../mixins/modaldispatch';
import moment from 'moment';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  Logger: { info },
  inject: { service },
  setProperties
} = Ember;

let ErrorValidacion = Ember.Object.extend({
  variable: '',
  mensaje: '',
  campo: ''
});

export default Ember.Controller.extend(ModalDispatchMixin, EmberValidations, {
  session: service(),
  titleCols: ['gerente', 'vendedor', 'notas', 'transicion', 'fecha'],
  nombreVendedor: '',
  nombreProspecto: '',
  nombreGerente: '',
  curp: '',
  afiliacion: '',
  idProspecto: '',
  revincular: false,
  noExiste: false,
  saveOk: false,
  datos: null,
  idVendedor: '',
  //  needs: ['gerentesventas', 'vendedors', 'mediospublicitarios'],
  isDev: computed({
    get() {
      return config.AUTOMATIC_LOGIN;
    }
  }),

  observaIsGerenteVendedor: observer('gerenteVendedor', function() {
    set(this, 'selectedGerente', '');
    set(this, 'selectedVendedor', '');
    if (get(get(this, 'gerenteVendedor'), 'gerente') !== 0 && get(get(this, 'gerenteVendedor'), 'vendedor') !== 0) {
      set(this, 'selectedGerente',  get(get(this, 'gerenteVendedor'), 'gerente'));
      set(this, 'selectedVendedor', get(get(this, 'gerenteVendedor'), 'vendedor'));
    }
  }),
  init() {
    this._super(...arguments);
    set(this, 'erroresHabidos', Ember.ArrayProxy.create({ content: [] }));
  },
  /*
  cuantos: computed('apGerentesventas', {
    get() {
      return get(get(this, 'apGerentesventas'), 'cuantos');
    }
  }),
  */

  habilitaBotones: computed('idProspecto', {
    get() {
      if (isEmpty(get(this, 'idProspecto'))) {
        return true;
      } else {
        return false;
      }
    }
  }),
  nombrevendedor: computed('gtevdor', {
    get() {
      let nombre;
      let que = get(this, 'gtevdor');
      if (que !== undefined) {
        nombre = get(que, 'nombrevendedor');
      }
      return nombre || 'FOOBAR';
    }
  }),
  cuantosgerentes: computed({
    get() {
      let gv = get(this, 'apGerentesventas');
      let content = get(gv, 'content');
      return content.length;
    }
  }),
  misvendedores: computed('selectedGerente', {
    get() {
      let idvendedor = get(this, 'idVendedor');
      let gte = parseInt(get(this, 'selectedGerente'));
      let c = get(this, 'apVendedors');
      let that = this;
      set(this, 'cuantosvendedores', 0);
      return c.filter(function(item) {
        let g = get(item, 'gerente');
        if (parseInt(idvendedor) === parseInt(get(item, 'id'))) {
          return;
        } else {
          if (g === gte) {
            that.incrementProperty('cuantosvendedores');
            return true;
          } else {
            return false;
          }
        }
      });
    }
  }),
  actions: {
    buscaProspecto() {
      let prospecto = get(this, 'NoProspecto');
      info(prospecto);
      this.store.query('prospectosoferta', { prospecto, revinculacion: 1 }).then((data)=> {
        info('tamano de data', get(data, 'length'));
        if (get(data, 'length') === 0) {
          this.setProperties({
            nombreVendedor: '',
            nombreGerente: '',
            nombreProspecto: '',
            afiliacion: '',
            curp: '',
            idProspecto: ''
          });
          set(this, 'noExiste', true);
          Ember.run.later(()=> {
            set(this, 'noExiste', false);
          }, 4000);
          return;
        } else {
          data.forEach((item)=> {
            this.setProperties({
              nombreVendedor: get(item, 'nombrevendedor'),
              nombreGerente: get(item, 'nombregerente'),
              nombreProspecto: get(item, 'nombre'),
              afiliacion: get(item, 'afiliacion'),
              curp: get(item, 'curp'),
              idProspecto: get(item, 'id'),
              idVendedor: get(item, 'vendedor')
            });
          });
        }
      }, (error)=> {
        info('hubo error', error);
      });
    },
    activaRevincular() {
      this.toggleProperty('revincular');
    },
    muestraLog() {
      let datos = Ember.A();
      let prospecto = get(this, 'idProspecto');
      this.store.query('transicionprospecto', { prospecto })
      .then((data)=> {
        data.forEach((item)=> {
          let { gerente, vendedor, notas, transicion, fecha } = item.getProperties(['gerente', 'vendedor', 'notas', 'transicion', 'fecha']);
          datos.pushObject({
            gerente, vendedor, notas, transicion, fecha
          });
        });
        set(this, 'datos', datos);

      }, (error)=> {

      });
    },
    grabar() {
      info('grabar');
      let gerente = get(this, 'selectedGerente');
      let vendedor = get(this, 'selectedVendedor');
      let prospecto = get(this, 'idProspecto');
      info('valor de vendedor', vendedor);
      let record = this.store.createRecord('revinculacionprospecto');
      record.setProperties({ gerente,
        vendedor,
        prospecto
      });
      record.save().then(()=> {
        info('se grabo');
        this.setProperties({
          nombreVendedor: '',
          nombreGerente: '',
          nombreProspecto: '',
          afiliacion: '',
          curp: '',
          idProspecto: '',
          NoProspecto: '',
          datos: null
        });
        set(this, 'revincular', false);
        set(this, 'saveOk', true);
        Ember.run.later(()=> {
          set(this, 'saveOk', false);
        }, 4000);
      }, (error)=> {
        info('hubo error');
      });
    }
  }
});
