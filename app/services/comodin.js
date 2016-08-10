import Ember from 'ember';

export default Ember.Service.extend({
	usuario: 'smartics',
	socketURL: 'ws://localhost:8099',
	afiliacion: '',
	prospecto: '',
	cuenta: '',
	pago: ''
});
