import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	set,
	get,
	computed,
	Logger: { info }
} = Ember;
export default Ember.Route.extend(FormatterMixin, RouteAuthMixin, AuthenticatedRouteMixin, {
  beforeModel() {
    this._super(...arguments);
  },
  
  desktopOrJumbo: computed('media.isJumbo', 'media.isDesktop', {
    get() {
      return get(this, 'media.isJumbo') || get(this, 'media.isDesktop');
    }
  }),
  setupController(controller, model) {
    let lista = Ember.A();
    let totalSaldoDisponible = 0;
    let totalEnTransito = 0;
    let totalSaldoBanco = 0;
    let empresa = '';
    let totales = {};
    let contador = 1;
    let catalogoEmpresas = Ember.A();
    model.forEach((item)=> {
      let record = {};
      if (get(item, 'empresa') !== empresa && empresa === '') {
        empresa = get(item, 'empresa');
        catalogoEmpresas.pushObject(item);
      }
      if (empresa === get(item, 'empresa') && empresa !== '') {
        totalSaldoDisponible += get(item, 'saldodisponible');
        totalEnTransito += get(item, 'entransito');
        totalSaldoBanco += get(item, 'saldobanco');
        if (get(this, 'desktopOrJumbo')) {
          if (contador === 1) {
            record.empresa = get(item, 'empresa');
          } else {
            record.empresa = get(item, 'empresa') !== empresa ? get(item, 'empresa') : '';
          }
        } else {
          record.empresa = get(item, 'empresa');
        }
        record.cuenta = get(item, 'cuenta');
        record.entransito = this.formatter(get(item, 'entransito'));
        record.saldobanco = this.formatter(get(item, 'saldobanco'));
        record.saldodisponible = this.formatter(get(item, 'saldodisponible'));
        lista.pushObject(record);
      }
      if (get(item, 'empresa') !== empresa) {
        catalogoEmpresas.pushObject(item);
        totalSaldoDisponible = this.formatter(totalSaldoDisponible);
        totalEnTransito = this.formatter(totalEnTransito);
        totalSaldoBanco = this.formatter(totalSaldoBanco);
        totales = { empresa: 'Totales', saldodisponible: totalSaldoDisponible, entransito: totalEnTransito, saldobanco: totalSaldoBanco };
        lista.pushObject(totales);
        totales = {};
        totalSaldoDisponible = 0;
        totalEnTransito = 0;
        totalSaldoBanco = 0;
        totalSaldoDisponible += get(item, 'saldodisponible');
        totalEnTransito += get(item, 'entransito');
        totalSaldoBanco += get(item, 'saldobanco');
        empresa = get(item, 'empresa');
        record.empresa = get(item, 'empresa');
        record.cuenta = get(item, 'cuenta');
        record.entransito = this.formatter(get(item, 'entransito'));
        record.saldobanco = this.formatter(get(item, 'saldobanco'));
        record.saldodisponible = this.formatter(get(item, 'saldodisponible'));
        lista.pushObject(record);
      }
      contador++;
    });
    totalSaldoDisponible = this.formatter(totalSaldoDisponible);
    totalEnTransito = this.formatter(totalEnTransito);
    totalSaldoBanco = this.formatter(totalSaldoBanco);
    totales = { empresa: 'Totales', saldodisponible: totalSaldoDisponible, entransito: totalEnTransito, saldobanco: totalSaldoBanco };
    lista.pushObject(totales);
    controller.set('lista', lista);
    controller.set('titleCols', ['Empresa', 'Cuenta', 'En Transito', 'Saldo Banco', 'Saldo Disponible']);
    controller.set('catalogoEmpresas', catalogoEmpresas);

  },
  model() {
    return this.store.findAll('cuentabancaria');
  },
  actions: {
    error(e) {
      info('error', e);
    }
  }
});
