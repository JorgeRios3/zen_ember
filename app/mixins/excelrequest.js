import Ember from 'ember';
const {
	Logger: { info },
	inject: { service },
	isEmpty,
	get,
	set
} = Ember;

export default Ember.Mixin.create({
  ajax: service(),
  requestExcel(fileName, email) {
    if (isEmpty(fileName) || isEmpty(email)) {
      info('algun parametro esta vacio');
      return;
    }
    let reportePdf = null;
    let that = this;
    if (!isEmpty(fileName)) {
      let urlp = `/api/otro?printer=null&tipo=generaexcel&filename=${fileName}`;
      get(this, 'ajax').request(urlp).then((data)=> {
        info(data);
        if (data.error) {
          info('error al generar pdf de reporte con opcion null en printer');
          return;
        }
        reportePdf = data.name;
        let URL_EMAIL = `/api/otro?email=${email}&pdf=${reportePdf}&xls=1`;
        return get(that, 'ajax').request(URL_EMAIL);
      });
    }
  }
});
