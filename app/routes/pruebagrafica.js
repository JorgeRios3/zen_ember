import Ember from 'ember';

export default Ember.Route.extend({
  model() {
  	return Ember.RSVP.hash({
  	 data: [
        ['City', '2010 Population', '2000 Population'],
        ['New York City, NY', 8175000, 8008000],
        ['Los Angeles, CA', 3792000, 3694000],
        ['Chicago, IL', 2695000, 2896000],
        ['Houston, TX', 2099000, 1953000],
        ['Philadelphia, PA', 1526000, 1517000]
      ],
      data2: [
        ['City', '2000 Population'],
        ['New York City, NY', 8008000],
        ['Los Angeles, CA', 3694000],
        ['Chicago, IL', 2896000],
        ['Houston, TX', 1953000],
        ['Philadelphia, PA', 1517000]
      ],

      promesa: this.store.findAll('etapastramite'),

      options: {
      	bars: 'horizontal',
        title: 'Population of Largest U.S. Cities',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Total Population',
          minValue: 0
        },
        vAxis: {
          title: 'City'
        }
      }
    });
  }
});
