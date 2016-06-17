import Ember from 'ember';
import ExcelRequestMixin from '../mixins/excelrequest';

const {
  set,
  get,
  computed,
  observer,
  isEmpty,
  Logger: { info }
} = Ember;
export default Ember.Controller.extend(ExcelRequestMixin, {
  selectedEtapa: '',
  fecha: '',
  nullFecha: '',
  hoy: '',
  datos: null,
  emailAddress: '',
  titleCols: ['Cliente', 'Nombre', 'Manzana', 'Lote', 'Numero Credito', 'Monto Credito', 'Monto Subsidio', 'Codigo Hipotecaria', 'Domicilio Hipotecaria', 'Oferta', 'Documentos', 'Imss'],
  alignments: ['right','left','left','left','left','right','right','left','left','right','right','left'],

  actions: {
    mandarEmail(emailAddress) {
      set(this, 'emailAddress', emailAddress);
    },
    enviar() {
      let fileName = get(this, 'fileName');
      let email = get(this, 'emailAddress');
      this.requestExcel(fileName, email);
      set(this, 'emailAddress', '');
    },
    pedir() {
      let lista = Ember.A();
      let email = get(this, 'emailAddress');
      let Fecha = get(this, 'fecha');
      let fecha = !isEmpty(Fecha) ? Fecha.format('YYYY/MM/DD') : '';
      info('valor de etapa', get(this, 'selectedEtapa'));
      info('valor de fecha', Fecha);
      let etapa = get(this, 'selectedEtapa');
      this.store.query('hipotecaria', { etapa, fecha, excel: email }).then((data)=> {
        data.forEach((item)=> {
          let { cliente, nombre, manzana, lote, numerocredito, montocredito, montosubsidio, codigohipotecaria, domiciliohipotecaria, oferta, documentos, imss } = item.getProperties('cliente nombre manzana lote numerocredito montocredito montosubsidio codigohipotecaria domiciliohipotecaria oferta documentos imss'.w());
          lista.pushObject({ cliente, nombre, manzana, lote, numerocredito, montocredito, montosubsidio, codigohipotecaria, domiciliohipotecaria, oferta, documentos, imss });
      });
        if (!isEmpty(lista)) {
          info('mando a pedir excelrequest');
          let fileName = get(data, 'meta.filename');
          this.requestExcel(fileName, email);
        }
      });
      set(this, 'datos', lista);

    }
  }
});
