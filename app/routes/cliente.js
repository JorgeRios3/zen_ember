import Ember from 'ember';
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";
var log = Ember.Logger.info;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin,
{
	beforeModel2(transition){
    // this._super(...arguments);
    var controller = this.controllerFor(this.routeName);
    var url = this.get("router.url");
    controller.setProperties(
      { 
        clienteGrabado: 0,
        clienteValorSelect:"",
        nullfechanacimiento:"",
        fechanacimiento: "",
        nullconyugefechanacimiento:"",
        conyugefechanacimiento:"",
      }
    );
  },
	setupController(ctrlr, model) {
    try {
      var m = this.store.modelFor("cliente");
      var keys = Object.keys(m);

      m.eachAttribute(function(key, meta){ 
      });
    } catch (error){
    	log("no jala", error.message);

    }
    //keys.forEach((v) => log(v));
    ctrlr.set("content",model);
  },
  
  model() {
    return this.store.find("gtevdor",1);  
  }

});
