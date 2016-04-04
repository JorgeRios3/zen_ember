import Ember from 'ember';
import config from '../config/environment';
import ModalDispatchMixin from '../mixins/modaldispatch';
import EmberValidations from 'ember-validations';

const {
  get,
  set,
  computed,
  isEmpty,
  Logger: { info },
  getOwner
} = Ember;

export default Ember.Controller.extend(EmberValidations, {
  session: Ember.inject.service(),
  errorAlGrabar: '',
  errorGenerado: '',
  huboErrorAlGrabar: false,
  password1: '',
  password2: '',
  validations: {
    sonCorrectos: {
      inclusion: { in: [true], message: 'no coinciden las 2 contraseñas' }
    }
  },
  sonCorrectos: computed('password1', 'password2', {
    get() {
      let p1 = get(this, 'password1');
      let p2 = get(this, 'password2');
      if (p1 === '' || p2 === '') {
        return false;
      }
      return Object.is(p1, p2);
    }
  }),
  actions: {
    guardar() {
      let that = this;
      let pass1 = get(this, 'password1');
      let pass2 = get(this, 'password2');
      let model = this.store.createRecord('password', { password1: pass1,
		password2: pass2 });
      model.save().then((data) => {
        let app = getOwner(this).lookup('controller:application');
        app.send('invalidateSession');
      }, (error) => {
        set(that, 'errorAlGrabar', '');
        that.toggleProperty('huboErrorAlGrabar');
        let errorGenerado = '';
        try {
          errorGenerado = error.errors.resultado[0];
        } catch (er) {
          info('error en obtencion de error', er.message);
        }
        set(that, 'errorAlGrabar', errorGenerado);
      });
    }
  }
});
