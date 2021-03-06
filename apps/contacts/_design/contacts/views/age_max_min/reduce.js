function(key, values, rereduce ) {
  var max, min;
  if(rereduce == false) {
    max = values[0];
    min = values[0];
    for(item in values) {
      if(values[item] > max) max = values[item];
      if(values[item] < min) min = values[item];
    }
    return { "max": max, "min": min };
  } else {
    max = values[0].max;
    min = values[0].min;
    for(item in values) {
      if(values[item].max > max) max = values[item].max;
      if(values[item].min < min) min = values[item].min;
    }
    return { "max": max, "min": min };
  }

}