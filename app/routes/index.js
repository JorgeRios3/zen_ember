import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../config/environment';
import ajax from 'ember-ajax';
import moment from 'moment';

const {
  get,
  set,
  isEmpty,
  computed,
  Logger: { info },
  inject: { service },
  getOwner
} = Ember;

let iclarLocation = [20.6765878,-103.3684634];

function deg2rad(degrees) {
  return degrees * Math.PI / 180;
}

function distance(lat1, lon1, lat2, lon2) {
  let R = 6371;
  let paramLat = lat2 - lat1;
  let dLat = deg2rad(paramLat);
  let paramLon = lon2 - lon1;
  let dLon = deg2rad(paramLon);
  let mitadLat = dLat / 2;
  let mitadLon = dLon / 2;
  let a = Math.sin(mitadLat) * Math.sin(mitadLat) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(mitadLon) * Math.sin(mitadLon);
  let c = 2 * Math.asin(Math.sqrt(a));
  let d = R * c;
  return d;
}

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  geolocation: service(),
  beforeModel(transition) {
    this._super(transition);
    let cl = get(get(this, 'geolocation'), 'currentLocation');
    info(`bmodel currentLocation ${cl}`);
    this.controllerFor('index').setProperties({
      usuario: '',
      perfil: '',
      hoy: moment()
    });
  },

  setupController(controller, model) {
    // info('entro en setupController');
    let perfil = get(model.zenusuario, 'perfil');
    set(this.controllerFor('gravatar'), 'model', model.gravatar);
    // let usuario = get(model.zenusuario, 'usuario');
    // let hasTwoFactorAuthentication = get(model.twofactor, 'hasTwoFactorAuthentication');
    // let isTwoFactorAuthenticated = get(model.twofactor, 'isTwoFactorAuthenticated');
    info('paso variables');
    if (isEmpty(perfil)) {
      getOwner(this).lookup('application').send('invalidateSession');
    }
    controller.setProperties({
      perfil: get(model.zenusuario, 'perfil'),
      usuario: get(model.zenusuario, 'usuario'),
      hasTwoFactorAuthentication: get(model.twofactor, 'hasTwoFactorAuthentication'),
      isTwoFactorAuthenticated: get(model.twofactor, 'isTwoFactorAuthenticated')
    });
    // let listaperfiles = this.profileHandler(perfil);
    let menu = Ember.A();
    let menuitems = get(model.zenusuario, 'menuitems').w();
    if (menuitems) {
      menuitems.forEach((item)=> {
        let obj = model.menu.findBy('item', item);
        let { title, intro, consulta } = obj.getProperties('title', 'intro', 'consulta');
        let arcadia = item.includes('arcadia');
        // info(`${title} ${intro} -- valen title e intro`);
        menu.pushObject({ ruta: item, title, intro, consulta, arcadia });
      });
    } else {
      model.menu.forEach((item)=> {
        let { title, intro, consulta } = item.getProperties('title', 'intro', 'consulta');
        let ruta = get(item, 'item');
        let arcadia = ruta.includes('arcadia');
        menu.pushObject({ ruta ,title, intro, consulta, arcadia });
      });
    }
    /*menuitems.forEach((item)=> {
      let obj = model.menu.findBy('item', item);
      let { title, intro, consulta } = obj.getProperties('title', 'intro', 'consulta');
      // info(`${title} ${intro} -- valen title e intro`);
      menu.pushObject({ item, title, intro, consulta });
    });*/
    controller.setProperties(
      { model: menuitems,
        opcionesLista: menuitems,
        menu
      }
    );
  },
  model() {
    let { store } = this;
    store.unloadAll('zenusuario');
    store.unloadAll('twofactor');
    let c = this.controllerFor('index');
    let bootTime = get(c, 'bootTime');
    // let requestLocation = get(c, 'tiempoTranscurrido').includes('seconds') || get(c, 'tiempoTranscurrido').includes('segundos');
    let requestLocation = get(get(this, 'geolocation'), 'currentLocation') === null;
    info('valor de requestLocation', get(c, 'tiempoTranscurrido'));
    let promises = {
      zenusuario: store.find('zenusuario', 1),
      twofactor: store.find('twofactor', 1),
      gravatar: store.find('gravatar', 1),
      menu: store.findAll('menu', { reload: true })
    };
    if (requestLocation) {
      promises.geolocation = get(this, 'geolocation').getLocation();
    }
    return Ember.RSVP.hash(
      promises
    );
  },

  afterModel(model, transition) {
    let hasTwoFactorAuthentication = get(model.twofactor, 'hasTwoFactorAuthentication');
    let isTwoFactorAuthenticated = get(model.twofactor, 'isTwoFactorAuthenticated');
    let currentLocation = get(get(this, 'geolocation'), 'currentLocation');
    info('valor de geolocation', get(this, 'geolocation'));
    info(`valor de currentLocation ${currentLocation}`);
    let radioIclar = 1; // 200 metros
    if (config.DISTANCIA) {
      radioIclar = 0;
    }
    let distancia = distance(currentLocation[0], currentLocation[1], iclarLocation[0], iclarLocation[1]);
    info('valor de distancia es', distancia);
    let isInIclar = distance(currentLocation[0], currentLocation[1], iclarLocation[0], iclarLocation[1]) <= radioIclar;
    info('isInIclar vale', isInIclar);
    this.controllerFor('index').setProperties({
      isInIclar
    });
    if (!isTwoFactorAuthenticated && hasTwoFactorAuthentication) {
      if (!isInIclar) {
        this.transitionTo('twofactorlogin');
      }
    }

  },
  actions: {
    error(error) {
      info('error en index', error);
    }
  }
});

