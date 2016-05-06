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
  carrusel: service(),
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
  selectedCategoria: 'todos',
  devLink: '',
  hasCategorias: computed.gt('opcionesCategoria.length', 1),
  init() {
    this._super(...arguments);
    if (config.DEVLINK) {
      set(this, 'devLink', config.DEVLINK);
    }
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
  opcionesCategoria: computed('categoriasMenu', {
    get() {
      let categoriasMenu = get(this, 'categoriasMenu');
      let mySet = new Set([]);
      categoriasMenu.forEach((item)=> {
        let valor = get(item, 'categoria');
        mySet.add(valor);
      });
      let menusCategorias = Ember.A();
      mySet.forEach((item)=> {
        let valorDespliegue = item;
        if (valorDespliegue === 'todos') {
          valorDespliegue = 'Todas las categorias'
        }
        info('valor de item en el mySet', item);
        menusCategorias.pushObject({ ruta: valorDespliegue, id: item });
      });
      return menusCategorias;
    }
  }),
  opcionesMenuEsTodos: computed.equal('selectedMenu', 'todos'),
  opcionesMenu: computed('menu', {
    get() {
      let listaMenu = get(this, 'menu');
      let lista = [];
      lista.addObject({ id: 'todos', nombre: 'Todas las opciones' });
      listaMenu.forEach((item)=> {
        lista.addObject({ id: get(item, 'ruta'), nombre: get(item, 'ruta')});
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
  menuVisible: computed('selectedMenu', 'selectedCategoria', { 
    get: function(){
      let that = this;
      let menuItem = this.getWithDefault('selectedMenu', 'todos');
      let categoria = this.getWithDefault('selectedCategoria', 'todos');
      let menu = get(this, 'menu');
      return menu.filter((item)=> {
        let ruta = get(item, 'ruta');
        if (menuItem === ruta) {
          return true;
        } else {
          if(categoria === 'todos') {
            return  menuItem === 'todos' ? true : false;
          } else {
            info('categoria != todos');
            let flag = false;
            get(that, 'categoriasMenu').forEach((cm)=> {     
              if (get(cm, 'categoria') === categoria && ruta === get(cm, 'menu')) {
                flag = true;
              }
            });
            return flag;
          }
        }
      }); 
    }
  }),
  actions: {
    carrusel() {
      let carousel = get(this, 'carrusel');
      set(carousel, 'activateCarousel', true);
      this.get('carrusel').hazCarrusel();
    },
    stopCarrusel() {
      let g= get(this, 'carrusel');
      set(g, 'activateCarousel', false);
    },
    getOut() {
      let app = getOwner(this).lookup('controller:application');
      app.send('invalidateSession');
    }
  }
});
