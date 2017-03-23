//Runs the getDataTable function to get core data and then runs the template line chart for each iteration of charts. It then creates
//a array of blobs of every chart programatically so that they can be references elsewhere. 

function buildCharts(counter, chartData){  
  //var t = 0;  
  var imageChart = {};
  var j = 0;
  var dataTable = getDataTable(chartData, counter); 
  
  for (var i = 1; i < counter; i++){//creates image for each chart
    var chartName = chartData[0][i];
    var chart = getChart(dataTable, i, chartName);    
    imageChart[j] = chart.getAs(MimeType.PNG); 
    j++    
  }
  return imageChart;
}


function getChart(dataTable, colNum, chartName){
  var xAxisTitle = "Date";
  var yAxisTitle = chartName;
  var chartTitle = yAxisTitle + " vs " + xAxisTitle;
  var dataViewDefinition = Charts.newDataViewDefinition().setColumns([0, colNum, {
    "calc":"stringify",
    "type":"string",
    "properties":{"role":"annotation"},
    "sourceColumn":colNum
  }]);

  var chart = Charts.newLineChart()
  .setDataTable(dataTable)
  .setDataViewDefinition(dataViewDefinition)
  .setOption('title', chartTitle)
  .setOption('height', 336)
  .setOption('width', 841)
  .setOption('curveType', 'function')
  .setOption('legend', 'top')
  .setOption('interpolateNulls', 'true')
  .setOption('legacyScatterChartLabels', 'true')
  .setOption('lineWidth', 1)
  .setOption('treatLabelAsText', 'true')
  .setOption('vAxis',
               {
                 useFormatFromData:'true',
                 minValue:'null', 
                 logScale:'false',
                 maxValue:'null', 
                 formatOptions:{scaleFactor:'null',source:'data'}, 
                 format: "##.##",
                 title:yAxisTitle, 
                 viewWindow:{min:'null',max:'null'}, 
                 titleTextStyle:{color:"#222",fontSize:12,italic:false}                 
               }) 
  .setOption('legacyContinuousAxisRemoved','true')
  .setOption('hAxis',{useFormatFromData:'true',title:xAxisTitle, slantedText: 'true', format: "MM/dd/yyyy"})
  .setOption('domainAxis', {direction: 1})
  .setOption('booleanRole', 'certainty')
  .setOption('hasHiddenData', 'false')
  .setOption('series', 
             {"0":{
               "pointSize":14,
               "errorBars":{"errorType":"none"},
               "dataLabel":"value",
               "annotations":{"stemColor":"none"},
               "pointShape":{"rotation":45,"sides":4,"dent":0.15,"type":"star"},
               "lineWidth":1
              }
             }
            )
  .setOption('trendlines',
             {"0":
              {
                "pointSize":0,
                "color":"#85200c",
                "showR2":'false',
                "labelInLegend":"Trendline",
                "degree":2,
                "visibleInLegend":'true',
                "type":"linear",
                "opacity":0.4,
                "lineWidth":2
              }
             })
  .setOption('isDefaultVisualization','true')
  .setOption('legacyContinuousAxisRemoved', 'true')
  .setOption('tooltip',{})
  .setOption('state', {})
    
  .build();
return chart;    
}

function getDataTable(chartData, counter){
  var dataTable = Charts.newDataTable();
  
  for (var col=0; col<counter+1; col++) {
    var label = chartData[0][col];
    var firstCell = chartData[1][col];
        
    if (col == 0)
      dataTable.addColumn(Charts.ColumnType.DATE, label);
    else if (typeof firstCell == 'number')
      dataTable.addColumn(Charts.ColumnType.NUMBER, label);
    else
      dataTable.addColumn(Charts.ColumnType.STRING, label);      
  }
  
  for (var row = 1; row < chartData.length; row++) {
    if (chartData[row][0] != ""){
      dataTable.addRow(chartData[row]);
    }
  }  
  var dt = dataTable.build()
  return dt; 
}


