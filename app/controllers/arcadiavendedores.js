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

export default Ember.Controller.extend(EmberValidations, {
    showForm: false,
    validations: {
        rfc: {
          length: { minimum: 0, allowBlank: true },
          format: { allowBlank: true,  with: /^([a-z]{4})([0-9]{6})([A-Za-z0-9]{3})$/i,  message: 'el rfc es incorrecto' }
        },
        nombre: {
          length: { minimum: 3 }
        },
        domicilio:{
            length: { minimum: 3, allowBlank:true }
        },
        colonia: {
            length: { minimum: 3, allowBlank:true }
        },
        cp: {
            length: { minimum: 3, allowBlank:true }
        },
        ciudad: {
            length: { minimum: 3, allowBlank:true }
        },
        estado: {
            length: { minimum: 3, allowBlank:true }
        },
        telefono: {
            length: { minimum: 3, allowBlank:true }
        },
        email: {
            length: { minimum: 3, allowBlank:true }
        }
      },
      /*observaRfc: observer('rfc', function() {
        info("entro aqui en observer")
        let fecha = get(this, 'rfc');
        if (isEmpty(get(this, 'rfc'))) {
          set(this, 'rfcValido', true);
        } else {
          fecha = fecha.substring(4, 10);
          let fecha2 = `${fecha.substring(0, 2)}-${fecha.substring(2, 4)}-${fecha.substring(4, 6)}`;
          set(this, 'rfcValido', moment(fecha2, 'YY-MM-DD').isValid());
        }
      }),*/
    actions: {
        closeForm(){
            set(this, 'showForm', false);
            set(this, 'dato', null);
            set(this, 'nombre', null);
            set(this, 'domicilio', null); 
            set(this, 'colonia', null);
            set(this, 'cp', null);
            set(this, 'ciudad', null);
            set(this, 'estado', null);
            set(this, 'telefono', null);
            set(this, 'rfc', null);
            set(this, 'email', null);
        },
        showForm(){
            if (get(this, 'record') == null) {
                set(this, 'dato', null);
                set(this, 'nombre', null);
                set(this, 'domicilio', null); 
                set(this, 'colonia', null);
                set(this, 'cp', null);
                set(this, 'ciudad', null);
                set(this, 'estado', null);
                set(this, 'telefono', null);
                set(this, 'rfc', null);
                set(this, 'email', null);
            }
            set(this, 'showForm', true);
        },
        buscarVendedor(codigo) {
            let that = this;
            info("aqui buscando esto")
            this.store.find('vendedoresarcadia',  codigo )
            .then((dato)=> {
                set(that, 'record', dato);
                let { nombre, domicilio, colonia, cp, ciudad, estado, telefono, rfc, email } = dato.getProperties(['nombre', 'domicilio', 'colonia', 'cp', 'ciudad', 'estado', 'telefono', 'rfc', 'email']);
                set(that, 'nombre', nombre);
                set(that, 'domicilio', domicilio);
                set(that, 'colonia', colonia);
                set(that, 'cp', cp);
                set(that, 'ciudad', ciudad);
                set(that, 'estado', estado);
                set(that, 'telefono', telefono);
                set(that, 'rfc', rfc);
                set(that, 'email', email);
                set(that, 'showForm', true);
            });
        },
        guardarEditar() {
            let that = this;
            if (get(this, 'record') !== null) {
                let r = get(this, 'record');
                let nombre = get(this, 'nombre');
                let domicilio = get(this, 'domicilio'); 
                let colonia = get(this, 'colonia');
                let cp = get(this, 'cp');
                let ciudad = get(this, 'ciudad');
                let estado = get(this, 'estado');
                let telefono = get(this, 'telefono');
                let rfc = get(this, 'rfc');
                let email = get(this, 'email');
                r.setProperties({
                    nombre,
                    domicilio,
                    colonia,
                    ciudad,
                    cp,
                    estado,
                    rfc,
                    telefono,
                    email
                });
                r.save().then(()=>{
                    set(this, 'showForm', false);
                    this.store.findAll('vendedoresarcadia', { reload: true })
                    .then((data)=>{
                        set(that, 'vendedores', data);
                        set(that, 'record', null);
                    })
                })
            }else {
                let that = this;
                let r = this.store.createRecord('vendedoresarcadia', {
                    nombre: get(this, 'nombre'),
                });
                r.save().then((data)=> {
                    info('si se grabo  el vendedor');
                    set(this, 'showForm', false);
                    this.store.findAll('vendedoresarcadia', { reload: true })
                    .then((data)=>{
                        set(this, 'vendedores', data);
                    });
                  });
            }
        }}
});
