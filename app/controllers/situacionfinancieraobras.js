import Ember from 'ember';
import ExcelRequestMixin from '../mixins/excelrequest';
const {
	get,
	set,
	Logger: { info }
} = Ember;
export default Ember.Controller.extend(ExcelRequestMixin, {
  datos: '',
  emailAddress: '',
  fileName: '',
  titleCols: ['Contrato', 'Obra', 'Fecha', 'Valor Contrato', 'Facturado', 'Por Facturar', 'Pagado', 'Por pagar', 'Avance Obra', 'Avance Pagado',
  'Estimado','Estimado por Facturar'],
  alignments: ['left','left','left','right','right','right','right','right','right','right','right','right'],

  actions: {
    mandarEmail(emailAddress) {
      set(this, 'emailAddress', emailAddress);
    },
    enviar() {
      let fileName = get(this, 'fileName');
      let email = get(this, 'emailAddress');
      this.requestExcel(fileName, email);
      set(this, 'emailAddress', '');
    }
  }
});
