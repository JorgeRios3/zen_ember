import Ember from 'ember';

const {
	get,
	set,
	computed,
	observer,
	getOw,
	Logger: { info },
	inject: { service }
} =  Ember;

export default Ember.Component.extend({
  ajax: service(),
  generarExcel: false,
  emailaddress: '',
  emailEmpty: computed.empty('emailaddress'),

  observaGenerarExcel: observer('generarExcel', function() {
    this.sendAction('hacer', get(this, 'generarExcel') ? get(this, 'emailaddress') : '');
  }),
  init() {
    this._super(...arguments);
    let that = this;
    info('pasando por init de compoennte correro');
    get(this, 'ajax').post('/api/useremail?query=1')
    .then((data)=> {
      if (data.success === '1') {
        info('email to use in compent', data.email);
        set(that, 'emailaddress', data.email);
      }
    });
  }
});
