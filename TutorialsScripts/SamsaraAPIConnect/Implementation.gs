/*
* Project-Key: M1gPDg6Z8oqIu7tK5rE9XuYx32lPoSxpO
* Library: SamsaraAPIConnect
* Library Version: 2
* Release Date: 5/12/2017
* Developer: Jonathan Vargas
* Copyright And Licensing: GNU General Public License, version 3.0 (GPL-3.0) https://www.gnu.org/licenses/gpl-3.0.en.html
* GitHub: https://github.com/sayuga
*
* Description: Uses Samsara Sensor API to retrieve sensor data on command
* https://www.samsara.com/
*
*/

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

function buildCoreSheets(){
 SamsaraApiConnect.buildCoreSheets();
}

function showController(){
 SamsaraApiConnect.showController();
}

function demandRun(){
 SamsaraApiConnect.demandRun();
}

function showEpochFormulas(){
 SamsaraApiConnect.showEpochFormulas();
}

function showHelp(){
 SamsaraApiConnect.showHelp();
}
