import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  timestamp : DS.attr("string"),
  name : DS.attr("string"),
  displayname : DS.attr("string"),
  status : DS.attr("string"),
  printerid : DS.attr("string"),
  copies : DS.attr("number"),
  online : Ember.computed("status", function(){ return this.get("status") === "ONLINE" ;})
  //online : function(){ return this.get("status") === "ONLINE"; }.property("status")
});
