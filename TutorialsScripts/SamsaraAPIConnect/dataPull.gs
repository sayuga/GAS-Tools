function sensorData1(dataSet){
  var rows = [];    
  var length = dataSet.sensors.length;  
      for (var i = 0; i < length; i++) {
        var data = dataSet.sensors[i];
        var container = [];
        for (var b in data) {      
          container.push(data[b]);
        }
        rows.push(container); //your JSON entities here              
      }    
  return rows;
}

function fleetData1(dataSet){
  var rows = [];    
  var length = dataSet.vehicles.length;  
      for (var i = 0; i < length; i++) {
        var data = dataSet.vehicles[i];
        var container = [];
        for (var b in data) {      
          container.push(data[b]);
        }
        rows.push(container); //your JSON entities here              
      }    
  return rows;
}

function sensorData2(dataSet){
  var rows = [];    
  var length = dataSet.results.length;  
  for (var i = 0; i < length; i++) {
    var data = dataSet.results[i];
    var container = [];          
    container.push(data.timeMs);
    var seriesData = data.series;          
    for (var b in seriesData) {      
      container.push(seriesData[b]);          
      
    }
    rows.push(container); //your JSON entities here              
  } 
  
  return rows;
}

function fleetData2(dataSet){
  var rows = [];    
  var length = dataSet.trips.length;  
      for (var i = 0; i < length; i++) {
        var data = dataSet.trips[i];
        var container = [];
        for (var b in data) {      
          container.push(data[b]);
        }
        rows.push(container); //your JSON entities here              
      }    
  return rows;
}

function fleetData3(dataSet){
  var rows = [];    
  var length = dataSet.drivers.length;  
      for (var i = 0; i < length; i++) {
        var data = dataSet.drivers[i];
        var container = [];
        for (var b in data) {      
          container.push(data[b]);
        }
        rows.push(container); //your JSON entities here              
      }    
  return rows;
}

function fleetData4(dataSet){
  var rows = [];    
  var length = dataSet.Summaries.length;  
      for (var i = 0; i < length; i++) {
        var data = dataSet.Summaries[i];
        var container = [];
        for (var b in data) {      
          container.push(data[b]);
        }
        rows.push(container); //your JSON entities here              
      }    
  return rows;
}

function fleetData5(dataSet){
  var rows = [];    
  var length = dataSet.logs.length;  
      for (var i = 0; i < length; i++) {
        var data = dataSet.logs[i];
        var container = [];
        for (var b in data) {      
          container.push(data[b]);
        }
        rows.push(container); //your JSON entities here              
      }    
  return rows;
}

function fleetData6(dataSet){
  var rows = [];    
  var length = dataSet.dispatch_jobs.length;  
      for (var i = 0; i < length; i++) {
        var data = dataSet.dispatch_jobs[i];
        var container = [];
        for (var b in data) {      
          container.push(data[b]);
        }
        rows.push(container); //your JSON entities here              
      }    
  return rows;
}
