import Transform from 'ember-data/transform';



export default Transform.extend({
  formatter(number, decimals=2, decPoint='.', thousandsSep=',') {
    //let number = get(this, key);
    let n = !isFinite(+number) ? 0 : +number;
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    let sep = thousandsSep;
    let dec = decPoint;
    let toFixedFix = function(n, prec) {
      // Fix for IE parseFloat(0.55).toFixed(0) = 0;
      let k = Math.pow(10, prec);
      return Math.round(n * k) / k;
    };
    let s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  },
  deserialize(serialized) {
    return this.formatter(serialized);
  },

  serialize(deserialized) {
    return deserialized;
  }
});
