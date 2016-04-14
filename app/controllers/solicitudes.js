import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
import moment from 'moment';

const {
	get,
	set,
	isEmpty,
	observer,
	getProperties,
	Logger: { info }
} = Ember;

export default Ember.Controller.extend(FormatterMixin,
{
  selectedEempresa: '',
  cuantos: 0,
  listaSolicitudes: Ember.A(),
  fecha: '',
  fechaDescriptiva: '',
  titleCols: ['Usuario', 'Identificador', 'Empresa', 'Beneficiario', 'Concepto', 'Anexo', 'Detalle Anexo', 'Observaciones', 'Cantidad'],
  alignments: ['left', 'left', 'left', 'left', 'left', 'left', 'left', 'left', 'right'],
  observaParametros: observer('fecha', 'selectedEmpresa', function() {
    set(this, 'cuantos', 0);
  }),
  actions: {
    pedir() {
      let objeto = {};
      let campos = ['usuario', 'identificador', 'empresa', 'beneficiario', 'concepto', 'anexo', 'detalleanexo', 'observaciones'];
      let total = 0;
      let lista = Ember.A();
      info('pidiendo');
      let fecha = moment(get(this, 'fecha'));
      objeto.fecha = fecha.format('DD/MM/YYYY');
      if (objeto.fecha === 'Invalid date') {
        objeto.fecha = '';
        set(this, 'fechaDescriptiva', 'Hoy');
      } else {
        let dow = fecha.format('dddd').capitalize();
        let day = fecha.format('D');
        let month = fecha.format('MMM').capitalize();
        let year = fecha.format('YYYY');
        set(this, 'fechaDescriptiva', `${dow} ${day} de ${month} de ${year}`);
      }
      let empresa = get(this, 'selectedEmpresa');
      objeto.empresa = isEmpty(empresa) ? '' : empresa;
      this.store.query('solicitud', objeto).then((data)=> {
        data.forEach((item)=> {
          total += get(item, 'cantidad');
          let row = getProperties(item, campos);
          row.cantidad = this.formatter(get(item, 'cantidad'));
          lista.pushObject(row);
        });
        set(this, 'cuantos', lista.length);
        if (lista.length > 0) {
          let row = {};
          campos.forEach((field)=> {
            row[field] = '';
          });
          row.cantidad = this.formatter(total);
          row.observaciones = 'Total';
          lista.pushObject(row);
        }
        set(this, 'listaSolicitudes', lista);
      });
    }
  }
});
