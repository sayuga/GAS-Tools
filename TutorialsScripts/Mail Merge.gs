 function onOpen() {
   var ss = SpreadsheetApp.getActiveSpreadsheet();      
   var menuEntries = [];
   menuEntries.push({name: "Mail Merge", functionName: "SayugaSolFunction"});
   menuEntries.push({name: "Show Data", functionName: "SayugaSolFunction1"});   
   ss.addMenu("SayugaSol Menu", menuEntries);      
 }

function SayugaSolFunction1(){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  var dataRange = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  
  Logger.log(dataRange);   
  
  var ui = SpreadsheetApp.getUi();
  ui.alert(dataRange);
  
  return dataRange;  
}

function SayugaSolFunction(){
  
  var dataRange = SayugaSolFunction1();
  var docID = "1h2GXToKPZ0dgHo0ZWrhFN0ngob1TJ9xbOIuaGDmYD9A";   
  var doc = DocumentApp.openById(docID);
  var destinationID = "16Nf_rr8jvCUwnyP6wrCgBQBC8qf_wwR7";
  var destinationFolder = DriveApp.getFolderById(destinationID);      
    
  for (var i = 1; i<dataRange.length; i++){
    
    var lName = "letter" +i;
    var newLetter = DriveApp.getFileById(docID).makeCopy(lName, destinationFolder); //Copy template to folder      
    var newDocID = newLetter.getId();
    
    var newDoc = DocumentApp.openById(newDocID);
    var body = newDoc.getBody();
    var currentData = dataRange[i];
    
    for (var x = 0; x< currentData.length;x++){
      var tag = "{"+dataRange[0][x]+"}";
      
      var entry = dateTimeCorrector(x, currentData[x]);
      
      while (body.findText(tag) != null){        
      //  body.replaceText(tag, currentData[x]);
        body.replaceText(tag, entry);
      }      
    }
    newDoc.saveAndClose();    
  }  
}

function dateTimeCorrector(x, entry){
  if (x == 1){
       return Utilities.formatDate(entry, "GMT", "MM-dd-yyyy");
  }
  
  else if (x == 2){
    
    return Utilities.formatDate(entry, "EST","hh:mm a");
  }
  else{
    return entry;
  }
}
