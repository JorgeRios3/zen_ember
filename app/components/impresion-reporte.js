import Ember from 'ember';

const {
  get,
  computed,
  set,
  isEmpty,
  Logger: { info },
  inject: { service }
} = Ember;

let Impresora = Ember.Object.extend({
  impresora: '',
  nombre: '',
  online: false,
  copies: 0,
  chosen: false,
  elegible: computed('copies', 'online', {
    get() {
      return get(this, 'copies') && get(this, 'online');
    }
  })
});


export default Ember.Component.extend({
  ajax: service(),
  impresoras: Ember.ArrayProxy.create({content: []}),
  emailaddress: '',
  valorInicialParametro1: null,
  valorParametro1: '',
  valorParametro2: '',
  sinParametro: false,
  botonHabilitado: true,
  onlyEmail: false,
  excel: false,
  getExcel: false,
  hayCorreo: computed("emailaddress", {
    get() {
      let email = get(this, 'emailaddress');
      return !isEmpty(email);
    }
  }),
  
  esVisible: computed('valorParametro1', 'valorInicialParametro1', {
    get(){
      if (get(this, 'sinParametro')){
        return true;
      }
      if (get(this, 'sinParametro') === false && get(this, 'onlyEmail') === true){
        return true;
      }
      var nan= NaN;
      var valor=get(this, 'valorParametro1');
      if ( valor > 0 ){
        return true;
      }
      if (valor !== nan){
        set(this, 'valorParametro1', '');
      }
      return false;
    }
  }),
	copias: 1,
	labelParametro1: '',
	placeholderParametro1: '',
	soloEmail: false,
  didInsertElement(){
    set(this, 'valorInicialParametro1', get(this, 'valorParametro1'));
  },
	init(){
    this._super( ...arguments);
    let that = this;
    get(that, 'impresoras.content').clear();
    get(this, 'ajax').post('/api/useremail?query=1')
    .then(
      (data)=>{
        if ( data.success === '1') {
          info('email to use in compent',data.email);
          set(that, 'emailaddress', data.email);
        }
        
        if ( get(this, 'onlyEmail') === false ){
          info('loading printers in the component init');
          get(this, 'store').findAll('printer')
          .then( (data)=> {
            data.forEach((imp)=> {
              get(that,'impresoras.content').pushObject(
                Impresora.create({
                  nombre : get(imp,'displayname'),
                  impresora: get(imp, 'printerid'),
                  online: get(imp, 'online'),
                  copies: get(imp, 'copies'),
                  chosen: false
                })
              );
            });
        
          });
        }
    });
  },
	actions: {
    cancelar(){
      this.attrs.cancel();
    },
		elegirImpresora(cual){	
			get(this, 'impresoras.content').objectAt(cual).toggleProperty('chosen');
		},
		imprimir(){
      set(this, 'botonHabilitado', false);
			let reporte = get(this, 'reporte');
			let parametro1 = get(this, 'parametro1');
			let valorParametro1 = get(this, 'valorParametro1');
			let that = this;
			let email = 'webmaster@grupoiclar.com';
			let reportePdf = '';
      let urlp = `/api/otro?printer=null&tipo=${reporte}&${parametro1}=${valorParametro1}`;
      if ( get(this, 'sinParametro') ) {
        urlp = `/api/otro?printer=null&tipo=${reporte}`;
      }
      if (get(this, 'sinParametro') === false && get(this, 'onlyEmail') === true) {
        urlp = `/api/otro?printer=null&tipo=${reporte}&${parametro1}=${valorParametro1}`;
      }
			get(this, 'ajax').request(urlp)
      .then(
      		(data)=> {
      			info(data);
      			if (data.error) {
      				info('error al generar pdf de reporte con opcion null en printer');
      				return;
      			}
      			reportePdf = data.name;
      			set(that, 'reportePdf', reportePdf);
      			info('el archivo es', reportePdf);
        			
      		}
      );

          	Ember.run.later(function(){
          				var request_email = function( destino, archivo){
          					info('pidiendo enviar archivo por email', archivo);
                    let url_email = `/api/otro?email=${destino}&pdf=${archivo}`;
                    if (get(that, "excel")){
                      url_email=`${url_email}&xls=1`;
                    }
          					get(that, "ajax").request(url_email);
          				};

          				var request_for_printing = function( destino , archivo, copies ){
          					//var promesa = null;
          					info("pidiendo imprimir archivo ", archivo , "en impresora ", destino );
          					get(that, "ajax").request("/api/otro?printer="+destino+"&pdf="+archivo+"&copies="+copies);
          				
          				};
          				if (get(that,"enviarEmail") && !Ember.isEmpty(email) && !Ember.isEmpty(reportePdf)){
          					request_email(email, reportePdf);
          				}
          				if (get(that,"enviarEmail") && !Ember.isEmpty(get(that,"emailaddress")) && !Ember.isEmpty(reportePdf)){
          					request_email(get(that,"emailaddress"), reportePdf);
          				}
          				var impresoras = get(that,"impresoras.content");
          				
          				if (!get(that,"soloEmail") &&  !Ember.isEmpty(reportePdf) && impresoras.length > 0 ){
          					info("entrando a despachar impresiones");
          					impresoras.forEach(function( impresora ){
          						if ( get(impresora,"chosen")){
          							request_for_printing( get(impresora,"impresora"), reportePdf , get(that,"copias") );
          						}
          					});
          				}
                  set(that, "botonHabilitado", true);
          				that.attrs.submit();
          	}, 5000);

			
		}
	}
});
