function getDateOfWeek(w, y) {
    let date = new Date(y, 0, (1 + (w - 1) * 7)); // Elle's method
    date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sunday, 1 - Monday etc
    var tsdate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12);
    return tsdate;
}

$.when(
    $.getJSON('https://raw.githubusercontent.com/dachuwu/TWCovid2/master/covidR2tw/output/db1_data.json'),
    $.getJSON('https://raw.githubusercontent.com/dachuwu/TWCovid2/master/covidR2tw/output/test_year_week.json')
    ).then(function(dataraw, dataraw2) {
    // split the data set into ohlc and volume https://demo-live-data.highcharts.com/aapl-ohlcv.json
    var data = dataraw[0].value,
        case_total = [],
        case_in = [],
        case_im = [],
        dataRt = [],
        dataRtui = [],
        case_total_conf = [],
        case_in_conf = [],
        case_im_conf = [],
        // set the allowed units for data grouping
        groupingUnits = [[
            'day',                         // unit name
            [1]                             // allowed multiples
        ], [
            'week',
            [1]
        ]]
        ;

    for (var i = 0; i < data.length; i += 1) {

        case_total.push([
            data[i][0], // the date
            //data[i][1], // t_onset_ccount_import
            //data[i][2], // t_onset_ccount_indigenous
            //data[i][3], // t_conf_ccount_import
            //data[i][4], // t_conf_ccount_indigenous
            data[i][5] // t_onset_ccount_all
            //data[i][6], // t_conf_ccount_all
            //data[i][7], // Rt
            //data[i][8],// Rt_l
            //data[i][9], // Rt_u        
        ]);
        case_in.push([
            data[i][0], data[i][2] 
        ]);
        case_im.push([
            data[i][0], data[i][1] 
        ]);
        dataRt.push([
            data[i][0], data[i][7] 
        ]);
        dataRtui.push([
            data[i][0],  data[i][8], data[i][9] 
        ]);
        case_total_conf.push([
            data[i][0],  data[i][6]     
        ]);

        case_in_conf.push([
            data[i][0], data[i][4] 
        ]);
        case_im_conf.push([
            data[i][0], data[i][3] 
        ]);
    }



    var data2 = dataraw2[0],
    testdf = [];
    

    for (var key in data2) {
        if (data2.hasOwnProperty(key)) {
            var yr =  Math.floor(data2[key]['通報日']/100);  
            var wk = data2[key]['通報日'] - yr*100;
            testdf.push([ 
                    getDateOfWeek(wk, yr), // the date
                    data2[key]["Total"]// total
            ]);
           //console.log(getDateOfWeek(wk, yr));
        }
    }   
    testdf.pop();



    // create the chart
    Highcharts.stockChart('epicurve', {
        chart: {
            backgroundColor: 'rgba(0,0,0,0)',
            style: {
            fontFamily: 'Helvetica',
            fontSize:"0.9em"
            }
        },
        title: { text: ' '  },
        yAxis: [{
            startOnTick: false,
            endOnTick: false,
            labels: {
                align: 'right',
                x: -1
            },
            title: {
                text: 'Daily cases 個案數'
            },
            height: '74%',
            maxPadding: 0.2,
            lineWidth: 2,
            resize: {
                enabled: true,
                lineWidth: 3,
                y: 3
            },
            gridLineColor:'rgba(73,78,83, 0.1)',
            lineColor: 'rgba(73,78,83, 0.5)'
        }, {
            labels: {
                align: 'right',
                x: -1
            },
            title: {
                text: 'Rt'
            },
            top: '75%',
            height: '25%',
            offset: 0,
            lineWidth: 1,
            gridLineColor:'rgba(73,78,83, 0.1)',
            lineColor: 'rgba(73,78,83, 0.5)',
            plotLines: [{
              color: '#ff0000',
              dashStyle: 'longdash',
              width: 1,
              value: 1.0
             }]
        }],
        xAxis: { 
            lineColor: 'rgba(73,78,83, 0.5)'
        },
        series: [{
            type: 'column',
            name: 'Local case',
            id: 'lcase',
            data: case_in,
            color: "#e67e00",
            yAxis: 0,
            groupPadding: 0,
            pointPadding: 0.1
           // pointWidth: 20,
        },{
            type: 'column',
            name: 'Imported case',
            id: 'icase',
            data: case_im,
            color:"#4682B4",
            yAxis: 0,
            groupPadding: 0,
            pointPadding: 0.1
        },{
            type: 'areasplinerange',
            name: 'Rt_ui',
            data: dataRtui,
            id: 'Rt_ui',
            yAxis: 1,
            zIndex: 0,
            color:"rgba(178, 34, 34, 0.1)",
            opacity: 0.2,
            enableMouseTracking: false,
            showInLegend: false
        },{
            name: 'Rt',
            data: dataRt,
            id: 'Rt',
            yAxis: 1,
            zIndex: 1,
            color:"rgba(178, 34, 34, 1)",
            tooltip: { valueDecimals: 3 },
            showInLegend: false
        }
        //,{  type: 'flags',
           // name: 'annote_1',
           // data: [{
                //x: Date.UTC(2021, 5-1, 11, 12),
                //title: 'Level 2 alert',
                //text: 'Level 2 alert (national)'
            //}],
            //yAxis: 0,
            //onSeries: 'lcase',
            //shape: 'squarepin',
            //showInLegend: false,
            //visible: false}
        ],

        annotations: [{
          labelOptions: {
            shape: 'callout',//'connector',
            align: 'right',
            justify: false,
            crop: false
          },
          labels:[{
            point: {
                xAxis: 0,
                yAxis: 0,
                align: 'right',
                x: Date.UTC(2021, 5-1, 11, 12),
                y: case_total[486][1],
            },
            text: 'Level 2 alert',
            x: -10
          }]          
        }], 

        legend: {
          enabled: true,
          floating: true,
          //align: 'left',
          y: -40,
          verticalAlign: 'top'
        },
        navigator: {
              data: case_total,
              adaptToUpdatedData: true,
              height: 25,
              margin:10,
              outlineWidth: 0,
              series: {
                type: 'areaspline',
                fillColor: '#343a40',
                fillOpacity: 1,
                lineWidth: 0
              },
              xAxis: {
                gridLineWidth: 0,
                labels: {
                  enabled: false
                }
              },
              yAxis: {
                plotBands: [{
                  color: 'rgba(0,0,0,0)',
                  from: 0,
                  to: 1
                }]
              }
        },
        scrollbar: {
            enabled: false
        },
        tooltip: {
            split: true
        },
        rangeSelector: {
            selected: 1,
            floating: true,
            //y: 10,
            verticalAlign: 'top',
            buttons: [
              {
                type: "all", text: "All"
              },
              {
                type: "day", count: 90, text: "90d"
              },
              {
                type: "day", count: 30, text: "30d"
              }],
              inputEnabled: false
        },
        exporting: {
            enabled: false
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          },
          series: {
                dataGrouping: {
                    units: groupingUnits
                }
          }
        },
        
    });


    // by confirmation date
    Highcharts.stockChart('epicurve_conf', {
        chart: {
            backgroundColor: 'rgba(0,0,0,0)',
            style: {
            fontFamily: 'Helvetica',
            fontSize:"0.9em"
            }
        },
        title: { text: ' ' },
        yAxis: [{
            startOnTick: false,
            endOnTick: false,
            labels: {
                align: 'right',
                x: -1
            },
            title: {
                text: 'Daily cases 個案數'
            },
            height: '74%',
            maxPadding: 0.2,
            lineWidth: 2,
            resize: {
                enabled: true,
                lineWidth: 3,
                y: 3
            },
            gridLineColor:'rgba(73,78,83, 0.1)',
            lineColor: 'rgba(73,78,83, 0.5)'
        }, {
            labels: {
                align: 'right',
                x: -1
            },
            title: {
                text: 'Tested cases'
            },
            top: '75%',
            height: '25%',
            offset: 0,
            lineWidth: 1,
            gridLineColor:'rgba(73,78,83, 0.1)',
            lineColor: 'rgba(73,78,83, 0.5)',
            plotLines: []
        }],
        xAxis: { 
            lineColor: 'rgba(73,78,83, 0.5)',
            crosshair: {
                enabled: false
            }
        },
        series: [{
            type: 'column',
            name: 'Local case',
            id: 'lcase',
            data: case_in_conf,
            color: "#e67e00",
            yAxis: 0,
            groupPadding: 0.1,
            pointPadding: 0
           // pointWidth: 20,
        },{
            type: 'column',
            name: 'Imported case',
            id: 'icase',
            data: case_im_conf,
            color:"#4682B4",
            yAxis: 0,
            groupPadding: 0.1,
            pointPadding: 0
        },{ type: 'spline',
            name: 'Weekly Tested',
            data: testdf,
            id: 'tested_total',
            yAxis: 1,
            color:"rgba(178, 34, 34, 1)",
            tooltip: { valueDecimals: 0 },
            showInLegend: false
        }],
        annotations: [{
          labelOptions: {
            shape: 'callout',//'connector',
            align: 'right',
            justify: false,
            crop: false
          },
          labels:[{
            point: {
                xAxis: 0,
                yAxis: 0,
                align: 'right',
                //distance: 5,
                x: Date.UTC(2021, 5-1, 11, 12),
                y: case_total_conf[486][1],
            },
            text: 'Level 2 alert',
            x: -10
          }]        
        }], 

        legend: {
          enabled: true,
          floating: true,
          //align: 'left',
          y: -40,
          verticalAlign: 'top'
        },
        navigator: {
              data: case_total_conf,
              adaptToUpdatedData: true,
              height: 25,
              margin:10,
              //maskFill: 'rgba(115, 113, 115, 0)',
              //maskInside: false,
              outlineWidth: 0,
              handles: {
                //backgroundColor: '#FFFFFF',
                //borderColor: '#D1D1D1'
              },
              series: {
                type: 'areaspline',
                fillColor: '#343a40',
                fillOpacity: 1,
                lineWidth: 0
              },
              xAxis: {
                gridLineWidth: 0,
                labels: {
                  enabled: false
                }
              },
              yAxis: {
                plotBands: [{
                  color: 'rgba(0,0,0,0)',
                  from: 0,
                  to: 1
                }]
              }
        },
        scrollbar: {
            enabled: false
        },
        tooltip: {
            shared: true,
            split: false
        },
        rangeSelector: {
            selected: 1,
            floating: true,
            //y: 10,
            verticalAlign: 'top',
            buttons: [
              {
                type: "all", text: "All"
              },
              {
                type: "day", count: 90, text: "90d"
              },
              {
                type: "day", count: 30, text: "30d"
              }],
              inputEnabled: false
        },
        exporting: {
            enabled: false
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          },
          series: {
                pointPlacement: 'on',
                dataGrouping: {
                    units: groupingUnits
                }
          }
        }, 
    });



});


$('#button_sidebar').click( function(){
    //$(window).trigger('resize');//
    //$('#epicurve').highcharts().reflow();
    setTimeout( function(){ 
        $('.need-reflow').each(function(){
            $(this).highcharts().reflow(); 
        })
    }, 500);
});
