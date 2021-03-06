import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	get,
	set,
	getProperties,
	Logger: { info },
	RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,{
  setupController(ctrl, model) {
    info("viendo model--------- jajaja")

  	set(ctrl, 'titleCols', ['id Gerente', 'Nombre Gerente', 'id Vendedor', 'Nombre Vendedor']);
  	let lista = Ember.A();
  	let listaGerentes = Ember.A();
    let gerentes = get(model, 'gerentesventa');
    gerentes.forEach((gerente)=> {
      info("viendo el nombre  ", get(gerente, 'nombre'));
      let nombre = get(gerente, 'nombre');
      let id = parseInt(get(gerente, 'id'));
      listaGerentes.pushObject({id, nombre});
    });
    let vendedores = get(model, 'vendedor');
    // info(listaGerentes);
    vendedores.forEach((item)=> {
      let nombreVendedor = get(item, 'nombre');
      let idVendedor = get(item, 'id');
      let idGerente = get(item, 'gerente');
      // info(idGerente, get(item, 'nombre'));
      if (idGerente !== 0 && idGerente !==6 ) {
        let gerente = listaGerentes.findBy('id', idGerente);
        // info('el gerente es ', gerente);
        let nombreGerente = get(gerente, 'nombre');
        lista.pushObject({ idGerente, nombreGerente, idVendedor, nombreVendedor })
      }
    });
    set(ctrl, 'datos', lista);
  },
  model() {
  	let { store } = this;
  	return hash({
  	   gerentesventa: store.findAll('gerentesventa', { reload: true }),
      vendedor: store.findAll('vendedor', { reload: true }),
  	});
  }

})