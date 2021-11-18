function onOpen()
{
  var ui = SpreadsheetApp.getUi();
   ui.createMenu('Samsara API Connect')   
   .addItem('Add Core Sheets', "buildCoreSheets")
   .addItem('API Call Control', 'showController')
   .addItem('Run API Call', 'demandRun')
   .addItem('Epoch Formula Reference', 'showEpochFormulas')
   .addItem('Help And Instructions', 'showHelp')
   .addToUi();     
};

function showEpochFormulas(){
  SpreadsheetApp.getUi().alert(
    "Date to Epoch formula	= ROUND((<datecell>-(date(1970,1,1)+time(0,0,0))*86400000) \n Epoch to Date Formula	=(<epochcell>/86400000)+date(1970,1,1)+time(0,0,0)"
  );
}


function recorder(GID, type, e){
  var ss = SpreadsheetApp.openById(GID);
  var errorSheet = ss.getSheetByName('Recorder');
  var sheetName = ss.getName();    
  var lastRow = errorSheet.getLastRow();
  var cell = errorSheet.getRange('A1');
 
  switch (type){
    case "Error":{    
      cell.offset(lastRow, 0).setValue(Utilities.formatDate(new Date(), "EST", "MM-dd-YYYY HH:MM:SS"));
      cell.offset(lastRow, 1).setValue("Error");
      cell.offset(lastRow, 2).setValue(sheetName);
      cell.offset(lastRow, 3).setValue(e.fileName);
      cell.offset(lastRow, 4).setValue(e.message);    
      cell.offset(lastRow, 5).setValue(e.lineNumber);      
      break;
    };
      
    case "Success-NoEntry": {
      cell.offset(lastRow, 0).setValue(Utilities.formatDate(new Date(), "EST", "MM-dd-YYYY HH:MM:SS"));
      cell.offset(lastRow, 1).setValue("Success");
      cell.offset(lastRow, 2).setValue(sheetName);               
      cell.offset(lastRow, 3).setValue(" -NA- ");
      cell.offset(lastRow, 4).setValue("No Entries Present.");          
      cell.offset(lastRow, 5).setValue(" -NA- ");
      break;
    };     
    case "Success-Entry-NoEmail": {
      cell.offset(lastRow, 0).setValue(Utilities.formatDate(new Date(), "EST", "MM-dd-YYYY HH:MM:SS"));
      cell.offset(lastRow, 1).setValue("Success");
      cell.offset(lastRow, 2).setValue(sheetName);
      cell.offset(lastRow, 3).setValue(" -NA- ");
      cell.offset(lastRow, 4).setValue(" -NA- ");
      cell.offset(lastRow, 5).setValue("No Email Receiver Assigned");      
      break;
    };
    case "Success-Entry-Email": {
      cell.offset(lastRow, 0).setValue(Utilities.formatDate(new Date(), "EST", "MM-dd-YYYY HH:MM:SS"));
      cell.offset(lastRow, 1).setValue("Success");
      cell.offset(lastRow, 2).setValue(sheetName);                      
      cell.offset(lastRow, 3).setValue(" -NA- ");
      cell.offset(lastRow, 4).setValue(" -NA- ");
      cell.offset(lastRow, 5).setValue("Email Successfully Sent");
      break;
    };
    default: {
      cell.offset(lastRow, 0).setValue(Utilities.formatDate(new Date(), "EST", "MM-dd-YYYY HH:MM:SS"));
      cell.offset(lastRow, 1).setValue("Unknown");
      cell.offset(lastRow, 2).setValue(sheetName);                      
      cell.offset(lastRow, 3).setValue(" -NA- ");
      cell.offset(lastRow, 4).setValue(" -NA- ");
      cell.offset(lastRow, 5).setValue("Unknown Entry - No Handler Assigned");
      break;
    }
  }
  
  SpreadsheetApp.flush();
};

function demandRun(){
  var sheetID = SpreadsheetApp.getActiveSpreadsheet().getId(); //report Spreadsheet        
  SpreadsheetApp.flush();          
  try{    
    samsaraTransaction(sheetID, "Controller");               
  }  
  catch(e){           
    var sheetID = SpreadsheetApp.getActiveSpreadsheet().getId(); //report Spreadshee        
    recorder(sheetID, "Error", e);
  }
};
