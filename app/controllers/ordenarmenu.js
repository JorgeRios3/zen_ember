import Ember from 'ember';

const {
	get,
	set,
	Logger:{info}
} = Ember;

export default Ember.Controller.extend({

  sortFinishText: null,
  nuevoAcomodo:"",
  actions: {
    dragStart: function(object) {
      //console.log('Drag Start', object);
    },
    sortEndAction: function() {
     // console.log('Sort Ended', this.get('sortableObjectList'));
    },
    guardar(){
    	var that=this;
    	let a =[]
    	 get(this, "sortableObjectList").forEach((item)=>{
    	 	a.push(get(item, "title"));
    	 })
    	 info("valor de a", a.join(" "));

    	 this.store.findRecord('zenusuario', 1).then((usuario)=> {
    	 	info("valor de usuario obtenido", usuario);
		 	usuario.set('menuitems', a.join(" "));
		 	usuario.save().then(()=>{
		 		this.transitionToRoute("index");
		 	},(error)=>{
		 		info("hay error");
		 	}); // => PUT to '/posts/1'
		});



    }
  }

});
