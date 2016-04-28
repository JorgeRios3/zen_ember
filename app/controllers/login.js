import Ember from 'ember';
import moment from 'moment';
import config from '../config/environment';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  Logger: { info },
  inject: { service }
} = Ember;

export default Ember.Controller.extend(
{
  comodin: service(),
  session: service(),
  errorMessage: null,
  identification: '',
  password: '',
  oscillator: null,
  audiocontext: null,
  buttonReady: computed('identification', 'password', {
    get() {
      return !isEmpty(get(this, 'identification')) && !isEmpty(get(this, 'password'));
    }
  }),
  obIdentification: observer('identification', function() {
    set(this, 'comodin.usuario', get(this, 'identification'));
  }),
  identificationLength: computed('identification', {
    get() {
      let usuario = get(this, 'identification');
      return usuario.length;
    }
  }),
  passwordLength: computed('password', {
    get() {
      let password = get(this, 'password');
      return password.length;
    }
  }),
  init() {
    this._super(...arguments);
    if (config.AUTOMATIC_LOGIN) {
      info('doing automatic');
      set(this, 'identification', config.AUTOMATIC_LOGIN_IDENTIFICATION);
      set(this, 'password', config.AUTOMATIC_LOGIN_PASSWORD);
    }
  },
  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      get(this, 'session').authenticate('authenticator:oauth2', identification, password)
      .then(()=> {
        set(this, 'comodin.usuario', get(this, 'identification'));
        set(this, 'comodin.loginTime', moment());
        let app = getOwner(this).lookup('controller:application');
        set(app, 'invalidable', true);
      })
      .catch((reason)=> {
        set(this, 'errorMessage', reason.error || reason);
      });
    }
  }

});
