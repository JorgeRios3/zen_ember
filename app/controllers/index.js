import Ember from 'ember';
import moment from 'moment';
import config from '../config/environment';
const {
	get,
	set,
	computed,
	observer,
	isEmpty,
	getOwner,
	Logger: { info },
	inject: { service, controller }
} = Ember;

export default Ember.Controller.extend({
  session: service(),
  gvCtrlr: controller('gravatar'),
  controllerApplication: controller('application'),
  perfil: '',
  usuario: '',
  opcionesLista: '',
  dummy: 'dummy',
  logoutPrompt: false,
  isInIclar: false,
  hasTwoFactorAuthentication: false,
  isTwoFactorAuthenticated: false,
  twoFactorValue: false,
  selectedMenu: 'todos',
  init() {
    this._super(...arguments);
    this.setProperties({
      bootTime: moment()
    });
    info('paso por aqui ahorita');
  },
  desktopOrJumbo: computed('media.isJumbo', 'media.isDesktop', {
    get() {
      return get(this, 'media.isJumbo') || get(this, 'media.isDesktop');
    }
  }),
  opcionesMenu: computed('', {
    get() {
      let listaMenu = get(this, 'menu');
      let lista = [];
      lista.addObject({ id: 'todos', nombre: 'todos' });
      listaMenu.forEach((item)=> {
        lista.addObject({ id: get(item, 'item'), nombre: get(item, 'item' )});
      });
      return lista;
    }
  }),
  tiempoTranscurrido: computed('hoy', 'bootTime', {
    get() {
      return get(this, 'hoy').to(get(this, 'bootTime'));
    }
  }),
  hasTwoFactorAuthentication2: computed({
    get() {
      let that = this;
      this.store.find('twofactor', 1)
      .then((data)=> {
        set(that, 'twoFactorValue', get(data, 'authenticated'));
      });
    }
  }),

  // gvCtrlr: computed.alias('controllers.gravatar'),
  hoy: null,
  hoyEs: computed('hoy', {
    get() {
      return get(this, 'hoy').format();
    }
  }),
  rutaDePrueba: computed('', {
    get() {
      return config.AUTOMATIC_LOGIN;
    }
  }),
  trackSession: observer('session.isAuthenticated', function() {
    let that = this;
    if (get(this.session, 'isAuthenticated')) {
      this.store.find('gravatar', 1)
      .then((data)=> {
        set(get(that, 'gvCtrlr'), 'content', data);
      });
    }
  }),
  logoutAttempt() {
    set(this, 'logoutPrompt', true);
  },
  logoutConfirmation() {
    this.send('invalidateSession');
  },
  /*Observa: observer('selectedMenu', function() {
    let menu = get(this, 'selectedMenu');
    if (!isEmpty(menu)) {
      if (menu === 'todos') {
        set(this, 'menu', get(this, 'opcionesLista'));
      } else {
        set(this, 'menu', [menu]);
      }
    }
  }),*/
  menuVisible: computed("selectedMenu", { 
    get: function(){
      //var that = this;
      let menuItem = this.getWithDefault('selectedMenu', 'todos');
      info("valor de selectedMenu", menuItem);
      let menu = get(this, 'menu');
      return menu.filter((item)=> {
        if ( menuItem === get(item, 'item')){
          return true;
        } else {
          return  menuItem === 'todos' ? true : false;
        }
      });
    }
  }),
  actions: {
    getOut() {
      let app = getOwner(this).lookup('controller:application');
      app.send('invalidateSession');
    }
  }
});
