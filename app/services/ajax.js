import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';
var info= Ember.Logger.info;
export default AjaxService.extend({
	session:Ember.inject.service(),
	headers:Ember.computed("session.session.content",{
		get(){
			let headers={};
			const sess=this.get("session.session.content");
			info("valor de session in service", sess);
			var token=sess.authenticated.access_token;
			if(token){
				headers["Authorization"]=`Bearer ${token}`;
			}
			return headers;
		}
	})
});
