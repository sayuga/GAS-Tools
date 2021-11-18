function buildCoreSheets(){
  var id = SpreadsheetApp.getActiveSpreadsheet().getId();
  var controlSheetName ="Controller"; 
 checkController(id,controlSheetName )
 SpreadsheetApp.flush();
  
  var control = SpreadsheetApp.openById(id).getSheetByName(controlSheetName);  
  var range = "A2:B"+control.getLastRow();  
  var dictionary = getControlValues(id, controlSheetName, range);    
  
  checkSheet(id, dictionary["ResponseSheetName"], "API-Response", "response");  
  checkSheet(id, dictionary["sensorSeriesSheetName"], "API-Sensor Series", "sensorSeries");    
  checkSheet(id, dictionary["sensorListSheetName"], "API-SensorList", "sensorList");  
  checkSheet(id, "Recorder", "Recorder", "recorder");

  SpreadsheetApp.flush();
};

/**
* Checks that the Controller container sheet exists. 
* Otherwise it creates it. 
*
* @param {string} id Google ID for active sheet being checked
* @param {string} name Controller Sheet Name
*/
function checkController(id, name){
  var n = (name ==undefined)?"":(name ==null)?"":name;
  var ss = SpreadsheetApp.openById(id);        
  
  var sheet = ss.getSheetByName(n);  
  //Logger.log("sheet value: "+sheet);
  
  if(sheet == null){          
    buildControl(name);
  }
  else{
  }
  SpreadsheetApp.flush();
};
/**
* Checks if the sheet exists. If not, it selects the 
* appropiate sheet template and generates a new sheet. 
*
* @param {string} id Google ID for active sheet being checked
* @param {string} name Name of the sheet being searched 
* @param {string} alt Alternate name to assign new sheet
* @param {string} query Designates query type that needs to be added to the sheet. 
*/
function checkSheet(id, name, alt, query){
  var n = (name ==undefined)?"":(name ==null)?"":name;
  var ss = SpreadsheetApp.openById(id);
    
  if(n !=""){
    var sheet = ss.getSheetByName(n);
    
    if(sheet == null){          
      sheetPicker(id, alt, query);
    }
    else{
    }
  }
  else{
    sheetPicker(id, alt, query);
  }
};

/**
* Sheet constructor selector. Builds the appropiate sheet with 
* the correct query and adds relevant information to the 
* controller container sheet 
*
* @param {string} id Google ID for active sheet being checked
* @param {string} name Name of the sheet being searched 
* @param {string} query Designates query type that needs to be added to the sheet. 
*/
function sheetPicker(id, name, query) {
  var ss = SpreadsheetApp.openById(id);     
  var sheet = ss.insertSheet(name);     
  var cell = sheet.getRange("A2");
  var formula;  
  var controlSheet = ss.getSheetByName("Controller")
  
  switch(query){
    case "sensorList":{      
      sheet.getRange("A1").setValue("SensorId");      
      controlSheet.getRange("C18").setValue(name);//SheetName
      ss.toast(name+" Sheet was Added", "Added Control Container", 5);  
      break;
    }
    case "sensorSeries":{
      sheet.getRange("A1").setValue("widgetId");
      var rule = SpreadsheetApp.newDataValidation().requireValueInList(['ambientTemperature','probeTemperature','currentLoop1Raw','currentLoop1Mapped','currentLoop2Raw','currentLoop2Mapped','pmPowerTotal','pmPhase1Power','pmPhase2Power','pmPhase3Power','pmPhase1PowerFactor','pmPhase2PowerFactor','pmPhase3PowerFactor'], true).build()
      sheet.getRange("B1").setValue("field");
      sheet.getRange("B2:B10").setDataValidation(rule);
      
      controlSheet.getRange("C17").setValue(name);//Sheet Name
      
      ss.toast(name+ " Sheet was Added", "Added Sheet", 5);  
      break;
    }
    case "response":{
      controlSheet.getRange("C6").setValue(name);//Sheet Name
      ss.toast(name+" Sheet was Added", "Added Sheet", 5);  
      break;
    }    
    case "recorder":{
      var headers = [];
      headers.push(["Date", "Type", "Report Name", "Function", "Message", "Error on Line"]);
      sheet.getRange("A1:H1").setValues(headers);
      ss.toast("Recorder Sheet was Added", "Added Sheet", 5);  
      break;
    }
    default:{          
      sheet.toast(name+" Sheet was Added", "Added Sheet", 5);  

      break;
    }
  }  
};

/**
* Builds all the relevant fields for the Control Container.
*
* @param {string] sheetName Name of the control sheet.
*/

function buildControl(sheetName){  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.insertSheet(sheetName)
  var id = sheet.getId();  
  var data = controlBuildData();
  
  ss.getRange("A1:E1").setValues([data[0]]);
  
  itemAdd(data[1], 1, sheetName); //keys
  ss.autoResizeColumn(1);
  
  itemAdd(data[3], 4, sheetName); //form headers      
  ss.autoResizeColumn(4);
  
  itemFormulas(data[2], 2, sheetName)
  ss.autoResizeColumn(2);
  
  itemAdd(data[4], 5, sheetName)
  ss.autoResizeColumn(5);
  
  ss.getRange("C3").setValue("https://api.samsara.com/v1")
  ss.hideSheet();
  
  SpreadsheetApp.flush();
  
  sheet.toast("Control Container Sheet was Added", "Added Sheet", 5);  
};

/**
* Control Sheet Data Cache Container. 
*
*/
function controlBuildData(){
  var data = [];      
  data.push(['KEY',	'Calculated Value',	'Captured Value',	'Form Headers',	'Query List']);
  data.push(['APIMethod',	'APIBaseCall',	'APIKey',	'MainQuery',	'ResponseSheetName',	'GroupID',	'startMs',	'endMs',	'stepMs',	'fillMissing',	'vehicleId',	'orgId',	'driverId',	'JobCreatedMaxMs',	'DurationSeconds',	'sensorSeriesSheetName',	'sensorListSheetName']);
  data.push(['=C2','=C3','=C4','= C5','=C6','=C7','= ROUND((C8-(date(1970,1,1)+time(0,0,0)))*86400000)','= ROUND((C9-(date(1970,1,1)+time(0,0,0)))*86400000)','=round(C10*60000)','=C11','=C12','=C13','=C14','= ROUND((C15-(date(1970,1,1)+time(0,0,0)))*86400000)','=C16','=C17','=C18']);
  data.push(['API Method',	'API Base URL',	'API Key',	'Query Choice',	'Target Sheet Name',	'Group ID',	'Start Date & Time (mm/dd/yyy hh:mm:ss)',	'End Date & Time (mm/dd/yyy hh:mm:ss)',	'Minutes in interval',	'Fill Missing',	'Vehicle ID',	'Organization ID',	'Driver ID',	'Job Created - Max Date & Time (mm/dd/yyy hh:mm:ss)',	'Duration in Seconds',	'Sheet Name with Sensors Series List',	'Sheet Name with Sensors List']);
  data.push(['/sensors/list','/sensors/temperature',	'/sensors/humidity',	'/sensors/history',	'/fleet/list',	'/fleet/locations',	'/fleet/trips',	'/fleet/drivers',	'/fleet/drivers/summary',	'/fleet/hos_logs',	'/fleet/maintenance/list',	'/fleet/dispatch_jobs']);
  return data;
};

/**
* Adds formula items into the fields at given column of given sheet. 
* @param {object} form Formulas to be merged into the sheet
* @param {number} col Target column number
* @param {string} sheetName Target sheet name
* @return Returns true when the function has ran
*/
function itemFormulas(formulas, col, sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);   
  var row = 2;    
  for (var i in formulas){
   var current = formulas[i];    
    sheet.getRange(row, col).setFormula(current);
    row++;
  };  
  return true;
};
