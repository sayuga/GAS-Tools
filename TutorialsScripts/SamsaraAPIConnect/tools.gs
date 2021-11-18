
function mapData (d, t){  
  var y = 0;
  var q = {};
  var tag;
  
  for (var x in d){
    var c = d[x]; 
    tag = "{"+t+y+"}";
    q[tag] = c;    
    y++;
  }  
  return q;  
}


function getControlValues(sGID, sSheet, range){
  var controlSheet = SpreadsheetApp.openById(sGID).getSheetByName(sSheet);     
  var keyValues = controlSheet.getRange(range).getValues();     
  var dictionary = {};      
  
  for (var i in keyValues){              
    var tag = keyValues[i][0];
    var value = keyValues[i][1];           
    dictionary[tag] = value;    
  } 
  
  return dictionary;
}

function flattenSeriesRange(range) {
  //http://stackoverflow.com/questions/17044825/indexof-returning-1-despite-object-being-in-the-array-javascript-in-google-sp - Aggie Eric
  var results = [];
  var row, column;
  var payload = {};

  for(row = 0; row < range.length; row++) {
    var widgetId =range[row][0];
    var field =range[row][1];    
        
    if (widgetId != ""){
      
      payload={
        "widgetId": widgetId,
        "field": field       
      }      
      results.push(payload);
    }    
  }  
  return results;
}

function flattenRange(range) {
  //http://stackoverflow.com/questions/17044825/indexof-returning-1-despite-object-being-in-the-array-javascript-in-google-sp - Aggie Eric
  var results = [];
  var row, column;
  for(row = 0; row < range.length; row++) {
    for(column = 0; column < range[row].length; column++) {
      var current =range[row][column];
      if (current != ""){
        results.push(current);
      }
    }
  }  
  return results;
}
