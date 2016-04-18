import Ember from 'ember';
import ExcelRequestMixin from '../mixins/excelrequest';

const {
  get,
  set,
  observer,
  isEmpty,
  Logger: { info },
  inject: { service }
} = Ember;


export default Ember.Controller.extend(ExcelRequestMixin, {
  ajax: service(),
  selectedEtapa: '',
  catalogoTramites: null,
  tramitesTotales: Ember.A(),
  showComponent: false,
  fileName: '',
  emailAddress: '',
  noHayTramites: Ember.computed.gt('tramitesTotales.length', 0),

  etapaSeleccionada: observer('selectedEtapa', function() {
    let that = this;
    let reportePdf = null;
    let email = get(this, 'emailAddress');
    get(this, 'tramitesTotales').clear();
    this.store.unloadAll('matriztramite');
    this.store.query('matriztramite', { etapa: get(this, 'selectedEtapa'), excel: get(this, 'emailAddress') }).then((data)=> {
      info(get(data, 'meta.filename'));
      let fileName = get(data, 'meta.filename');
      data.forEach((item)=> {
        let a = get(item, 'tramite');
        let tramite = get(this, 'catalogoTramites').findBy('id', `${a}`);
        let descripcion = get(tramite, 'descripcion');
        let objeto = { tramite:  descripcion, total: get(item, 'total') };
        get(this, 'tramitesTotales').pushObject(objeto);
      });
      this.requestExcel(fileName, email);
      /*if (!isEmpty(fileName)) {
        let urlp = `/api/otro?printer=null&tipo=generaexcel&filename=${fileName}`;
        get(this, 'ajax').request(urlp).then((data)=> {
          info(data);
          if (data.error) {
            info('error al generar pdf de reporte con opcion null en printer');
            return;
          }
          reportePdf = data.name;
        });
        Ember.run.later(function() {
          let URL_EMAIL = `/api/otro?email=${email}&pdf=${reportePdf}&xls=1`;
          get(that, 'ajax').request(URL_EMAIL);
        }, 5000);
      }*/
    });
  }),

  actions: {
    togglePrinterComponent() {
      this.toggleProperty('showComponent');
    },
    mandarEmail(emailAddress) {
      set(this, 'emailAddress', emailAddress);
    }
  }
});
