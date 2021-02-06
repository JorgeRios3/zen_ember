import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';
import moment from 'moment';
const log = Ember.Logger.info;

const {
  get,
  set,
  inject: { service },
  Logger: { info },
  observer,
  computed,
  setProperties,
  isEmpty
} = Ember;

let Hijo = Ember.Object.extend({
  sexo: 'M',
  anos: '',
  meses: '',
  timestamp: '',
  descripcion: computed('sexo', 'anos', 'meses', {
    get() {
      let sexo =  get(this, 'sexo') === 'M' ? 'Hombre' : 'Mujer';
      let meses = isEmpty(get(this, 'meses')) ? '' : `, ${get(this, 'meses')} meses`;
      // let meses = isEmpty(get(this, 'meses')) ? '' : ', ' + get(this, 'meses') + ' meses';
      return `${sexo}, $get(this, 'anos')} años ${meses}`;
    }
  })
});

let ErrorValidacion = Ember.Object.extend({
  variable: '',
  mensaje: '',
  campo: ''
});

export default Ember.Controller.extend(EmberValidations, {
  session: Ember.inject.service(),
  init() {
    this._super(...arguments);
    set(this, 'etapas', this.store.query('etapastramite', { reload: true, company:"arcadia" }));
    set(this, 'hijos', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'erroresHabidos', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'showForm', false);
  },
  queryParams: ['afiliacion', 'origenOferta', 'prospecto'],
  origenOferta: false,
  partiendoDeOferta: computed('origenOferta', function() {
    return get(this, 'origenOferta') ? ' ( proviniendo de Oferta de Compra )' : '';
  }),
  // losHijos: computed.alias('hijos'),
  record: null,
  showForm: false,
  tieneCuenta: false,
  muestroErrores: false,
  huboErrorAlGrabar: false,
  errorMessage: '',
  errorAlGrabar: '',
  prospecto: '',
  clienteValorSelect: '',
  prospectoCliente: '',
  rfc: '',
  clienteGrabado: 0,
  conyugerfc: '',
  nombre: '',
  conyugenombre: '',
  curp: '',
  conyugecurp: '',
  telefonocasa: '',
  telefonotrabajo: '',
  fechanacimiento: '',
  nullfechanacimiento: '',
  nullconyugefechanacimiento: '',
  conyugefechanacimiento:'',
  lugarnacimiento: '',
  conyugelugarnacimiento: '',
  nacionalidad: '',
  conyugenacionalidad: '',
  afiliacionOk: true,
  afiliacion: '',
  estadocivil: null,
  situacion: null,
  regimen: null,
  ocupacion: null,
  conyugeocupacion: null,
  domicilio: '',
  colonia: '',
  ciudad: '',
  estado: '',
  codigopostal: '',
  email: '',
  agregarHijo: false,
  tipoTramite: null,
  titularIfe: false,
  titularCopiasIfe: false,
  titularCartaEmpresa: false,
  titularCopiaAfore: false,
  titularActaNacimiento: false,
  titularCopiasActaNacimiento: false,
  conyugeIfe: false,
  conyugeCopiasIfe: false,
  conyugeCartaEmpresa: false,
  conyugeCopiaAfore: false,
  conyugeActaNacimiento: false,
  conyugeCopiasActaNacimiento: false,
  actaMatrimonio: false,
  copiasActaMatrimonio: false,
  processingGrabar: false,
  estadosciviles: [ { id: 'S' , tipo: 'Soltero' },
					{ id: 'C', tipo: 'Casado' },
					{ id: 'V', tipo: 'Viudo' },
					{ id: 'D', tipo: 'Divorciado' }
	],
  situaciones: [ { id: 'U', tipo: 'Unión Libre' },
					{ id: 'S', tipo: 'Separado' }
	],
  regimenes: [ { id: 'L', tipo: 'Sociedad Legal' },
				{ id: 'C', tipo: 'Sociedad Conyugal' },
				{ id: 'S', tipo: 'Separación de Bienes' }
	],
  ocupaciones: [ { id: 'E', tipo: 'Empleado' },
				{ id: 'P', tipo: 'Profesionista' },
				{ id: 'O', tipo: 'Otro' }
	],
  sexos: [ { id: 'M', tipo: 'Masculino' },
			{ id: 'F', tipo: 'Femenino' }
	],
  tipostramites: [ { id: 'IS', tipo: 'Individual Soltero' },
    { id: 'IC', tipo: 'Individual Casado' },
    { id: 'C', tipo: 'Conyugal' }
  ],
  conyugehijossexo: null,
  conyugehijosanos: null,
  conyugehijosmeses: null,
  hayHijos: false,
  validations: {
    nombre: {
        length: { minimum: 3 }
    }
    /*curpValido: {
      inclusion: { in: [true], message: 'debe tener fecha valida' }
    },
    rfcValido: {
      inclusion: { in: [true], message: 'debe tener fecha valida' }
    },
    rfc: {
      length: { minimum: 0, allowBlank: true },
      format: { allowBlank: true,  with: /^([a-z]{4})([0-9]{6})([A-Za-z0-9]{3})$/i,  message: 'el rfc es incorrecto' }
    },
    curp: {
      format: { with: /^([a-z]{4})([0-9]{6})([a-z]{6})([0-9A]{1})([0-9]{1})$/i,  message: 'el curp es incorrecto' }
    },
    afiliacion: {
      length: { is: 11, allowBlank: true },
      numericality: { onlyInteger: true, allowBlank: true }
    },
    estadocivil: {
      inclusion: { in: ['S','C','V','D'] }
    },
    ocupacion: {
      inclusion: { in: ['E','P','O'] }
    },
    conyugeocupacion: {
      inclusion: { allowBlank: true, in: ['E','P','O'] }
    }*/

  },
  setEstadoCivil:function(e){
    switch (e) {
        case "0":
            info("entro aqui")
            set(this, 'estadocivil', 'S');
          //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
          break;
        case "1":
            info("entro aqui 2")
            set(this, 'estadocivil', 'C')
          //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
          break;
        case "2":
            info("entro aqui 3")
            set(this, 'estadocivil', 'V')
          //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
          break;
        case "3":
            info("entro aqui 4")
            set(this, 'estadocivil', 'D')
            break;
        default:
            info("entro aqui 5")
            set(this, 'estadocivil', 'S');
          //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
          break;
      }
  },
  setOcupacion:function(e, field='ocupacion'){
      info("ocupacion", e)
      //'E','P','O']
    switch (e) {
        case "1":
            info("entro aqui 2")
            set(this, field, 'E')
          break;
        case "2":
            info("entro aqui 3")
            set(this, field, 'P')
          break;
        case "3":
            info("entro aqui 4")
            set(this, field, 'O')
            break;
        default:
            info("entro aqui 5")
            set(this, field, null);
          break;
      }
  },
  setSituacion:function(e){
    switch (e) {
        case "1":
            info("entro aqui 2")
            set(this, 'situacion', 'U')
          break;
        case "2":
            info("entro aqui 3")
            set(this, 'situacion', 'S')
          break;
        default:
            info("entro aqui 5")
            set(this, 'situacion', null);
          break;
      }

  },
  setRegimen:function(e){
    switch (e) {
        case "1":
            info("entro aqui 2")
            set(this, 'regimen', 'L')
          break;
        case "2":
            info("entro aqui 3")
            set(this, 'regimen', 'C')
          break;
          case "3":
            info("entro aqui 3")
            set(this, 'regimen', 'S')
          break;
        default:
            info("entro aqui 5")
            set(this, 'regimen', null);
          break;
      }

  },
  formatValueCivil:function(record){
      info("civil ", get(record, 'estadocivil'))
    switch (get(record, 'estadocivil')) {
        case "S":
            set(record, 'estadocivil', 0);
          break;
        case "C":
            set(record, 'estadocivil', 1);
          break;
        case "V":
            set(record, 'estadocivil', 2);
          break;
        case "D":
            set(record, 'estadocivil', 3);
            break;
        default:
            set(record, 'estadocivil', null);
          break;
      }
      return record
  },
  formatValueSituacion:function(record){
      info("situacion ", get(record, 'situacion'))
    switch (get(record, 'situacion')) {
        case "U":
            set(record, 'situacion', 1);
          break;
        case "S":
            set(record, 'situacion', 2);
          break;
        default:
            set(record, 'situacion', null);
          break;
      }
      return record

  },
  formatValueOcupacion:function(record, field='ocupacion'){
      info(field + " " + get(record, field))
    switch (get(record, field)) {
        case "E":
            info("entro aqui 2");
            set(record, field, 1);
          break;
        case "P":
            info("entro aqui 3");
            set(record, field, 2);
          break;
        case "O":
            info("entro aqui 4");
            set(record, field, 3);
            break;
        default:
            info("entro aqui 5");
            set(record, field, null);
          break;
      }
      return record

  },
  formatValueRegimen:function(record){
      info("regimen  ", get(record, 'regimen'))
    switch (get(record, 'regimen')) {
        case "L":
            info("entro aqui 2");
            set(record, 'regimen', 1);
          break;
        case "C":
            info("entro aqui 3");
            set(record, 'regimen', 2);
          break;
          case "S":
            info("entro aqui 3");
            set(record, 'regimen', 3);
          break;
        default:
            info("entro aqui 5");
            set(record, 'regimen', null);
          break;
      }
      return record

  },
  cleanCliente: function(){
    info("trato de limpiar");
    set(this, 'clienteValorSelect', null);
    this.set('nombre', null);
    this.set('rfc', null);
    this.set('curp', null);
    this.set('fechanacimiento', null);
    this.set('lugarnacimiento', null);
    this.set('nullfechanacimiento', null);
    this.set('nacionalidad', null);
    this.set('telefonocasa', null);
    this.set('telefonotrabajo', null);
    this.set('estadocivil', null);
    this.set('situacion', null);
    this.set('regimen', null);
    this.set('ocupacion', null);
    this.set('domicilio', null);
    this.set('colonia', null);
    this.set('ciudad', null);
    this.set('estado', null);
    this.set('codigopostal', null);
    this.set('email', null);
    this.set('conyugenombre', null);
    this.set('conyugerfc', null);
    this.set('conyugecurp', null);
    this.set('conyugelugarnacimiento', null);
    this.set('conyugenacionalidad', null);
    this.set('conyugeocupacion', null);
    this.set('conyugefechanacimiento', null);
    this.set('nullconyugefechanacimiento', null);
  },
  observaProspectoAcarreo: observer('prospecto', function() {
    set(this, 'prospectoCliente', get(this, 'prospecto'));
  }),
  isDev: computed({
    get() {
      return config.AUTOMATIC_LOGIN;
    }
  }),
  isCasado: computed.equal('estadocivil', 'C'),
  observaCurp: observer('curp', function() {
    let fecha = get(this, 'curp');
    if (isEmpty(get(this, 'curp'))) {
      set(this, 'curpValido', true);
    } else {
      fecha = fecha.substring(4, 10);
      let fecha2 = `${fecha.substring(0, 2)}-${fecha.substring(2, 4)}-${fecha.substring(4, 6)}`;
      set(this, 'curpValido', moment(fecha2, 'YY-MM-DD').isValid());
    }
  }),
  isSociedadCivil: computed.equal('regimen', 'L'),
  observaRfc: observer('rfc', function() {
    let fecha = get(this, 'rfc');
    if (isEmpty(get(this, 'rfc'))) {
      set(this, 'rfcValido', true);
    } else {
      fecha = fecha.substring(4, 10);
      let fecha2 = `${fecha.substring(0, 2)}-${fecha.substring(2, 4)}-${fecha.substring(4, 6)}`;
      set(this, 'rfcValido', moment(fecha2, 'YY-MM-DD').isValid());
    }
  }),
  observaClienteGrabado: observer('clienteGrabado', function() {
    if (get(this, 'clienteGrabado')) {
      this.setProperties({
        muestroErrores: false,
        huboErrorAlGrabar: false,
        errorAlGrabar: '',
        rfc: '',
        conyugerfc: '',
        nombre: '',
        conyugenombre: '',
        curp: '',
        conyugecurp: '',
        telefonocasa: '',
        telefonotrabajo: '',
        fechanacimiento: '',
        conyugefechanacimiento: '',
        lugarnacimiento: '',
        conyugelugarnacimiento: '',
        nacionalidad: '',
        conyugenacionalidad: '',
        afiliacionOk: false,
        afiliacion: '',
        estadocivil: null,
        situacion: null,
        regimen: null,
        ocupacion: null,
        conyugeocupacion: null,
        domicilio: '',
        colonia: '',
        ciudad: '',
        estado: '',
        codigopostal: '',
        email: '',
        agregarHijo: false,
        tipoTramite: null,
        titularIfe: false,
        titularCopiasIfe: false,
        titularCartaEmpresa: false,
        titularCopiaAfore: false,
        titularActaNacimiento: false,
        titularCopiasActaNacimiento: false,
        conyugeIfe: false,
        conyugeCopiasIfe: false,
        conyugeCartaEmpresa: false,
        conyugeCopiaAfore: false,
        conyugeActaNacimiento: false,
        conyugeCopiasActaNacimiento: false,
        actaMatrimonio: false,
        copiasActaMatrimonio: false,
        processingGrabar: false
      });
      try {
        get(this, 'hijos').clear();
        get(this, 'erroresHabidos.content').clear();
      } catch(err) {
        log('error al limpiar proxy', err.message);
      }
      if (get(this, 'origenOferta')) {
        this.transitionToRoute('oferta', { queryParams: {
          origenCliente: true,
          cliente: get(this, 'clienteGrabado'),
          afiliacion: get(this, 'afiliacion'),
          prospecto: get(this, 'prospecto') }
        });
      } else {
        this.transitionToRoute('index');
      }
    }
  }),
  validaAfiliacion: observer('afiliacion', function() {
    /*info('probando info ');
    let afi = get(this, 'afiliacion');
    let digits = afi.split('');
    let acumula = 0;
    if (afi.length === 11) {
      for (let i = 0; i < 10; i++) {
        let digito = parseInt(digits[i]);
        let factor = 2;
        if ((i % 2) === 0) {
          factor = 1;
        }
        let prod = factor * digito;
        if (prod > 10) {
          prod = prod - 9;
        }
        acumula = acumula + prod;
      }
      let resultado = 10 - (acumula % 10);
      if (resultado === 10) {
        resultado = 0;
      }
      if (parseInt(digits[10])  === resultado) {
        set(this, 'afiliacionOk', true);
      } else {
        set(this, 'afiliacionOk', false);
      }
    } else {
      set(this, 'afiliacionOk', false);
    }*/
    set(this, 'afiliacionOk', true);
  }),
  esBool(value) {
    let valores = {
      titularIfe: true,
      titularCopiasIfe: true,
      titularCartaEmpresa: true,
      titularCopiaAfore: true,
      titularActaNacimiento: true,
      titularCopiasActaNacimiento: true,
      conyugeIfe: true,
      conyugeCopiasIfe: true,
      conyugeCartaEmpresa: true,
      conyugeCopiaAfore: true,
      conyugeActaNacimiento: true,
      conyugeCopiasActaNacimiento: true,
      actaMatrimonio: true,
      copiasActaMatrimonio: true
    };
    Object.keys(valores).forEach((key)=> {
      if (key === value) {
        return true;
      }
    });
    return false;
  },

  actions: {
    AgregarCliente(){
      set(this, 'record', null)
      set(this, 'showForm', true);
      set(this, 'clienteValorSelect', '')
      set(this, 'nullfechanacimiento', '');
      set(this, 'fechanacimiento', '');
      set(this, 'nullconyugefechanacimiento', '');
      set(this, 'conyugefechanacimiento', '');

    },
    guardarEditar() {
        let r = get(this, 'clienteRecord')
        //set(this, 'formaEditarCliente', true);
        let nombre = get(this, 'clienteNombre');
        let rfc = get(this, 'clienteRfc');
        let telefonocasa = get(this, 'clienteTelCasa');
        let telefonotrabajo = get(this, 'clienTelTrabajo');
        r.setProperties({
          nombre, rfc, telefonocasa, telefonotrabajo
        });
        r.save().then(()=>{
          this.setProperties({
            clienteRecord: null,
            formaEditarCliente: false,
            clienteNombre: '',
            clienteRfc:'',
            clienteTelCasa: '',
            clienTelTrabajo: ''
          });
          this.store.unloadAll('clientecuantofiltro');
          this.store.unloadAll('clientefiltro');
          this.store.unloadAll('cliente');
        });
    },
    closeForm(){
        set(this, 'showForm', false);
        this.cleanCliente();

    },
    seleccionar(cliente) {
      let cliente1 = parseInt(get(cliente, 'id'));
      let that = this;
      set(this, 'clienteValorSelect', cliente1);
      this.store.find('clientesarcadia', cliente1).
      then((data)=>{
        set(that, 'record', data);
        set(that, 'showForm', true);
        set(that, 'nombre', get(data, 'nombre'));
        that.set('rfc', get(data, 'rfc'));
        that.set('curp', get(data, 'curp'));
        that.set('fechanacimiento', get(data, 'fechanacimiento'));
        that.set('nullfechanacimiento', get(data, 'fechanacimiento'));
        that.set('lugarnacimiento', get(data, 'lugarnacimiento'));
        that.set('nacionalidad', get(data, 'nacionalidad'));
        that.set('telefonocasa', get(data, 'telefonocasa'));
        that.set('telefonotrabajo', get(data, 'telefonotrabajo'));
        that.setEstadoCivil(get(data, 'estadocivil'));
        that.setOcupacion(get(data, 'ocupacion'));
        that.setSituacion(get(data, 'situacion'));
        that.setRegimen(get(data, 'regimen'));
        that.set('domicilio', get(data, 'domicilio'));
        that.set('colonia', get(data, 'colonia'));
        that.set('ciudad', get(data, 'ciudad'));
        that.set('estado', get(data, 'estado'));
        that.set('codigopostal', get(data, 'codigopostal'));
        that.set('email', get(data, 'email'));
        that.set('conyugenombre', get(data, 'conyugenombre'));
        that.set('conyugerfc', get(data, 'conyugerfc'));
        that.set('conyugecurp', get(data, 'conyugecurp'));
        that.set('conyugelugarnacimiento', get(data, 'conyugelugarnacimiento'));
        that.set('conyugenacionalidad', get(data, 'conyugenacionalidad'));
        that.setOcupacion(get(data, 'ocupacion'), 'conyugeocupacion');
        that.set('conyugefechanacimiento', get(data, 'conyugefechanacimiento'));
        that.set('nullconyugefechanacimiento', get(data, 'conyugefechanacimiento'))
      },(error)=>{
        info('trono');
      });
    },
    llenarCliente() {
      this.set('nombre', 'otro');
      this.set('rfc', 'ribj910106lsk');
      this.set('curp', 'ribj910106hjcled00');
      this.set('fechanacimiento', '1991/01/06');
      this.set('nullfechanacimiento', '1991/01/06');
      this.set('nullconyugefechanacimiento', '1991/01/06');
      this.set('conyugefechanacimiento', '1991/01/06')
      this.set('lugarnacimiento', 'tlaquepulque');
      this.set('nacionalidad', 'mexicana');
      this.set('telefonocasa', '3338255454');
      this.set('telefonotrabajo', '3338255454');
      this.set('estadocivil', 'C');
      this.set('situacion', 'U');
      this.set('regimen', 'L');
      this.set('ocupacion', 'E');
      this.set('domicilio', 'loma indaparapeo #8879');
      this.set('colonia', 'golden hill');
      this.set('ciudad', 'tonala');
      this.set('estado', 'Jalisco');
      this.set('codigopostal', '44140');
      this.set('email', 'jrios@grupoiclar.com');
      this.set('conyugenombre', 'mariana');
      this.set('conyugerfc', 'ribj910106jjj');
      this.set('conyugecurp', 'ribj910106hjcled01');
      this.set('conyugelugarnacimiento', 'morels');
      this.set('conyugenacionalidad', 'mexicana');
      this.set('conyugeocupacion', 'E');
    },
    imprimeFicha() {
      this.transitionToRoute('index');
    },
    agregandoHijo() {
      set(this, 'agregarHijo', true);
    },
    aceptandoHijo() {
      let ts = new Date().getTime();
      get(this, 'hijos').pushObject(Hijo.create({
        sexo: this.get('conyugehijossexo'),
        anos: this.get('conyugehijosanos'),
        meses: this.get('conyugehijosmeses'),
        timestamp: ts
      }));
      this.setProperties({
        hayHijos: true,
        conyugehijossexo: null,
        conyugehijosanos: '',
        conyugehijosmeses: '',
        agregarHijo: false
      });
    },
    cancelandoAgregarHijo() {
      this.setProperties({
        conyugehijossexo: null,
        conyugehijosanos: '',
        conyugehijosmeses: '',
        agregarHijo: false
      });
    },
    removiendoHijo(ts) {
      let hijos = get(this, 'hijos');
      let cual = hijos.findBy('timestamp', ts);
      let indice = hijos.indexOf(cual);
      hijos.removeAt(indice);
    },
    revisarErrores2() {
      let _this = this;
      Object.keys(get(this, 'errors')).forEach((que)=> {
        if (typeof que === 'string' || que instanceof String) {
          let error = get(_this, `errors.${que}`);
          if (typeof error[0] === 'string' || error[0] instanceof String) {
            log('Errores - ', que, error[0]);
          }
        }
      });
    },
    revisarErrores() {
      let _this = this;
      get(this, 'erroresHabidos.content').clear();
      Object.keys(get(this, 'errors')).forEach((que)=> {
        if (typeof que === 'string' || que instanceof String) {
          let error = get(_this, `errors.${que}`);
          if (typeof error[0] === 'string' || error[0] instanceof String) {
            let [errmsg] = error;
            if (errmsg === 'is not a number') {
              errmsg = 'no es numérico';
            }
            log('Errores - ', que, errmsg);
            get(_this, 'erroresHabidos.content').pushObject(ErrorValidacion.create({
              variable: que,
              mensaje: errmsg,
              campo: _this.getWithDefault(`label${que.capitalize()}`, '')
            }));
          }
        }
      });
      this.toggleProperty('muestroErrores');
    },
    enteradoInspeccionarErrores() {
      this.toggleProperty('muestroErrores');
    },
    enteradoHuboErrorAlGrabar() {
      this.toggleProperty('huboErrorAlGrabar');
    },
    editar(){
      let modelo = 'clientesarcadia';
      let llave = '';
      let m = this.store.modelFor(modelo);
      let that = this;
      let record = get(this, 'record');
      let fecha = 'fecha';
      m.eachAttribute((key,meta)=> {
        let newVal;
        llave = key;
        if (llave.indexOf(fecha) > -1) {
          let f = that.get(llave);
          newVal = !isEmpty(f) ? moment(f).format('YYYY MM DD') : '';
          if (newVal) {
            newVal = newVal.w().join('/');
          }
          set(record, key, newVal);
        } else {
          newVal = get(that, key);
          if (!that.esBool(key) && isEmpty(newVal)) {
            newVal = '';
          }
          set(record, key, newVal);
        }
      });
      set(this, 'processingGrabar', true);
      record = this.formatValueCivil(record)
      record = this.formatValueSituacion(record)
      record = this.formatValueOcupacion(record)
      record = this.formatValueRegimen(record)
      record = this.formatValueOcupacion(record, 'conyugeocupacion')
      record.save().then((cliente)=> {
        that.setProperties({
            processingGrabar: false,
            clienteGrabado: cliente,
            showForm: false
          });
        })
        this.cleanCliente();

    },
    grabar() {
      let modelo = 'clientesarcadia';
      let llave = '';
      let m = this.store.modelFor(modelo);
      let that = this;
      let record = this.store.createRecord(modelo, {});
      let fecha = 'fecha';
      m.eachAttribute((key,meta)=> {
        let newVal;
        llave = key;
        if (llave.indexOf(fecha) > -1) {
          let f = that.get(llave);
          newVal = !isEmpty(f) ? moment(f).format('YYYY MM DD') : '';
          if (newVal) {
            newVal = newVal.w().join('/');
          }
          set(record, key, newVal);
        } else {
          newVal = get(that, key);
          if (!that.esBool(key) && isEmpty(newVal)) {
            newVal = '';
          }
          set(record, key, newVal);
        }
      });
      record = this.formatValueCivil(record)
      record = this.formatValueSituacion(record)
      record = this.formatValueOcupacion(record)
      record = this.formatValueRegimen(record)
      record = this.formatValueOcupacion(record, 'conyugeocupacion')
      set(this, 'processingGrabar', true);
      record.save().then((cliente)=> {
        that.setProperties({
            processingGrabar: false,
            clienteGrabado: cliente,
            showForm:false
          });
        })
        this.cleanCliente();
    }
  }
});
