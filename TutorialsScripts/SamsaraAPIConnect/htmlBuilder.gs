function showController() {
     
  var html = HtmlService.createTemplateFromFile('index');
        html.headers = itemGet(4, 18);        
        html.data = itemGet(3, 18);
        html.query = itemGet(5, 12);  
        html.evaluate();  
  SpreadsheetApp.getUi().showSidebar(html.evaluate());
}

function showHelp() {
     
  var html = HtmlService.createTemplateFromFile('Help'); 
        html.evaluate();  
  SpreadsheetApp.getUi().showModalDialog(html.evaluate(), "Samsara API Connect - Help");
}

function itemAdd(form, col) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Controller');   
  var row = 2;    
  for (var i in form){
   var current = form[i];    
    sheet.getRange(row, col).setValue(current);
    row++;
  };  
  return true;
}

function postController(form){
  var col=3;
  var y = [];  
  for (var x in form){
    y.push(x+" :", form[x]);
  }
  itemAdd(form, col);
}

function itemGet(col, lRow) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Controller');   
  var items= [];  
  
  for (var x = 0; x<lRow-1; x++){
    var row = x+2;    
    var val =  sheet.getRange(row, col).getValue();
    
    if(val instanceof Date){
      val = Utilities.formatDate(val, "GMT", "MM-dd-yyyy hh:mm:ss")
    }            
    items[x] = val;
  }         
  return items;
}
