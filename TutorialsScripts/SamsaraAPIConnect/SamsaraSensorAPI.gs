function samsaraTransaction(ssID, controlSheetName) {   
  var lRow = SpreadsheetApp.openById(ssID).getSheetByName(controlSheetName).getLastRow();    
  var range = "A2:B"+lRow;
  var dictionary = getControlValues(ssID, controlSheetName, range);        
    
  var accessToken = "?access_token=" + dictionary["APIKey"]; 
  var method = dictionary["APIMethod"];
  var url = dictionary["APIBaseCall"] + dictionary["MainQuery"] + accessToken;         
  
  var payload = getPayload(ssID, dictionary);
  
  var options = {
    "method": method,    
    "payload": JSON.stringify(payload)    
  };      
  
  prepareResponse(ssID, dictionary);// dictionary["ResponseSheetName"], dictionary["MainQuery"]);
  
  var rows = getData(url, options, dictionary["MainQuery"]);    
  
  setResponse(ssID, dictionary["ResponseSheetName"], rows);      
}

function getPayload(ssID, dictionary){
  var spreadSheet = SpreadsheetApp.openById(ssID);
  var subQuery = dictionary["MainQuery"];
  var payload = {};  
  var groupID = dictionary["GroupID"];
  
  switch (subQuery){
      //Sensors----------------------------
    case "/sensors/list":          
      payload = {    
        "groupId": groupID
      }      
      break;      
    case "/sensors/temperature":   
      {var sensorsList  = spreadSheet.getSheetByName(dictionary["sensorListSheetName"]).getRange("A2:A").getValues();   

      payload ={    
        "groupId": groupID,
        "sensors": flattenRange(sensorsList)
      }      
      break;
      }
    case "/sensors/humidity":{
      var sensorsList  = spreadSheet.getSheetByName(dictionary["sensorListSheetName"]).getRange("A2:A").getValues();   

      payload ={    
        "groupId": groupID,
        "sensors": flattenRange(sensorsList)      
      }
      break;
      }
      
    case "/sensors/history": {  
      var sensorSeries = spreadSheet.getSheetByName(dictionary["sensorSeriesSheetName"]).getRange("A2:B").getValues();   
      payload ={    
        "groupId": groupID,        
        "startMs": dictionary["startMs"],
        "endMs": dictionary["endMs"],
        "stepMs": dictionary["stepMs"],
        "series": flattenSeriesRange(sensorSeries),
        "fillMissing": dictionary["fillMissing"],        
      }    
      break;
    }    
      
      //Fleet----------------------------
    case "/fleet/list":
      payload ={    
        "groupId": groupID
      }            
      break;
    case "/fleet/locations":
      payload ={    
        "groupId": groupID
      }
      break;
    case "/fleet/trips":{
      payload ={    
        "groupId": groupID,
        "vehicleId": dictionary["vehicleId"],
        "startMs": dictionary["startMs"],
        "endMs": dictionary["endMs"]        
      }
      break;
    }
    case "/fleet/drivers":
      payload ={    
        "groupId": groupID
      }
      break;
    case "/fleet/drivers/summary":      
      payload ={    
        "orgId":  dictionary["orgId"],
        "startMs": dictionary["startMs"],
        "endMs": dictionary["endMs"]        
      }            
      break;
    case "/fleet/hos_logs":
      payload ={    
        "groupId": groupID,
        "driverId": dictionary["driverId"],
        "startMs": dictionary["startMs"],
        "endMs": dictionary["endMs"]        
      }     
      break;
    case "/fleet/maintenance/list":
      payload ={    
        "groupId": groupID
      }
      break;
    case "/fleet/add_address":
      payload ={    
        "groupId": groupID
      }
      break;
    case "/fleet/set_data":
      payload ={    
        "groupId": groupID
      }
      break;
    case "/fleet/dispatch_jobs":
      payload ={    
        "group_Id": groupID,
        "job_created_at_max_ms": dictionary["JobCreatedMaxMs"],
        "duration_seconds": dictionary["DurationSeconds"]
      }
      break;
    case "/fleet/dispatch_jobs/create":
      payload ={    
        "groupId": groupID
      }
      break;
    case "/fleet/dispatch_jobs/update":
      payload ={    
        "groupId": groupID
      }
      break;      
    default:
      payload = {};
      break;
  } 
  return payload;
};

function getData(url, options, subQuery){  
  var response = UrlFetchApp.fetch(url, options);   
  var dataSet = JSON.parse(response.getContentText());   
  var rows = [];      
  switch (subQuery){
  
      //Sensors----------------------------
    case "/sensors/list":
      rows = sensorData1(dataSet);
      break;
    case "/sensors/temperature":
      rows = sensorData1(dataSet);
      break;
    case "/sensors/humidity":
      rows = sensorData1(dataSet);
      break;
    case "/sensors/history":    
      rows = sensorData2(dataSet);
      break;
      
      //Fleet----------------------------
    case "/fleet/list":      
      rows = fleetData1(dataSet);
      break;
    case "/fleet/locations":
      rows = fleetData1(dataSet);
      break;
    case "/fleet/trips":
      rows = fleetData2(dataSet);
      break;
    case "/fleet/drivers":
      rows = fleetData3(dataSet);
      break;
    case "/fleet/drivers/summary":   
      rows = fleetData4(dataSet);
      break;
    case "/fleet/hos_logs":
      rows = fleetData5(dataSet);
      break;
    case "/fleet/maintenance/list":
      rows = fleetData1(dataSet);
      break;
    case "/fleet/add_address":
      break;
    case "/fleet/set_data":
      break;
    case "/fleet/dispatch_jobs":
      rows = fleetData6(dataSet);
      break;
    case "/fleet/dispatch_jobs/create":
      break;
    case "/fleet/dispatch_jobs/update":
      break;
    case "test":
      rows = testPull(dataSet);
      break;
    default:
      break;      
  } 
return rows;  
}

function prepareResponse(ssID, dictionary){
  var responseSheetName = dictionary["ResponseSheetName"];
  var subQuery = dictionary["MainQuery"];
  var ss = SpreadsheetApp.openById(ssID);
  var responseSheet = ss.getSheetByName(responseSheetName);    
  responseSheet.clear();
  var headerRow = [];
    
  switch (subQuery){  
      //Sensors----------------------------
    case "/sensors/list":
      headerRow.push(["Id","Name","MacAddress"]);
      break;
    case "/sensors/temperature":
      headerRow.push(["Id","Ambient Temperature (miliDeg Celsius)","Probe Temperature (miliDeg Celsius)"]);
      break;
      
    case "/sensors/humidity":
      headerRow.push(["Id","Humidity(%)"]);
      break;
      
    case "/sensors/history":    
      var sensorSeries = ss.getSheetByName(dictionary["sensorSeriesSheetName"]).getRange("A2:A").getValues();      
      var result=[];
      result.push("Time(MiliSeconds)");
      var row, column;
      for(row = 0; row < sensorSeries.length; row++) {
        for(column = 0; column < sensorSeries[row].length; column++) {
          var current =sensorSeries[row][column];
          if (current != ""){
            var caption = "SensorID: "+current;
            result.push(caption);
          }
        }
      }    
      headerRow.push(result);
      break;
      
      //Fleet----------------------------
    case "/fleet/list":
      headerRow.push(["Id","Name","Note", "Vin", "OdometerMeters"]);
      break;
    case "/fleet/locations":
      headerRow.push(["Id","Name","Time", "Latitude","Longitude","Heading","Speed", "Location","On Trip"]);
      break;
    case "/fleet/trips":
      headerRow.push(["Trip Start (Ms)","Trip End (Ms)","Start Location","End Location","Start Coordinates","End Coordinates","Distance Meters"]);      
      break;
    case "/fleet/drivers":
      headerRow.push(["Id","Name"]);
      break;
    case "/fleet/drivers/summary":      
      headerRow.push(["Driver Id","Driver Name","Driver User Name","Group Id","Active Hours","Distance (Miles)"]);
      break;
    case "/fleet/hos_logs":
      headerRow.push(["Group Id","Vehicle Id","Driver Id","Log Start Ms","Status Type","LocCity","LocState","locLat","LocLon","LocName"]);
      break;
    case "/fleet/maintenance/list":
      headerRow.push(["Id","j1939","Passenger"]);
      break;
    case "/fleet/add_address":
      headerRow.push(["Status Code ","Message"]);
      break;
    case "/fleet/set_data":
      headerRow.push(["Status Code ","Message"]);
      break;
    case "/fleet/dispatch_jobs":
      headerRow.push(["Id","Org ID","GroupId","DriverID","VehicleId","Job State","Scheduled Arrival Time (Miliseconds)","Stated at (Miliseconds)","Completed At","Cancelled At","Job Created At","Notes","Destination Name","Destination Address","Destination Latitude","Destination Longtude", "External Identifier"]);
      break;
    case "/fleet/dispatch_jobs/create":
      headerRow.push(["Id","External Identifier","Org ID","GroupId","DriverID","VehicleId","Job State","Scheduled Arrival Time (Miliseconds)","Stated at (Miliseconds)","Completed At","Cancelled At","Job Created At","Notes","Destination Name","Destination Address","Destination Latitude","Destination Longtude"]);
      break;
    case "/fleet/dispatch_jobs/update":
      headerRow.push(["Id","External Identifier","Org ID","GroupId","DriverID","VehicleId","Job State","Scheduled Arrival Time (Miliseconds)","Stated at (Miliseconds)","Completed At","Cancelled At","Job Created At","Notes","Destination Name","Destination Address","Destination Latitude","Destination Longtude"]);
      break;
    default:
      break;      
  } 
  if(headerRow.length >0){
    setResponse(ssID, responseSheetName, headerRow);
  }
}

function setResponse(ssID, responseSheetName, rows){
  var responseSheet = SpreadsheetApp.openById(ssID).getSheetByName(responseSheetName);    
  var lastRow = responseSheet.getLastRow();
  var cell = responseSheet.getRange("A1");    
  
  for (var x = 0; x < rows.length; x++){
    var cRow = rows[x];    
    var cLRow = lastRow+x;    
    for (var y =0; y<cRow.length; y++ ){       
         cell.offset(cLRow, y).setValue(cRow[y]);    
    } 
  }
}

