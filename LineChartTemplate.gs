//takes a data table with a Date stamp on column 0, the chart name, and the column number for the chart to be built. 
//This function will take the given data table and create a preset line chart template with trendline, smooth curve and data annotation
//already in place for the chart. It will generate one chart for each data view, which currently consists of the date stamp and the
//column number of the correlated data. 

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
