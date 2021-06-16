$.getJSON('https://raw.githubusercontent.com/dachuwu/covidR2tw_dashboard/main/data/db1_data_geo.json', function (dataraw) {

    // split the data set into ohlc and volume https://demo-live-data.highcharts.com/aapl-ohlcv.json
    var data = dataraw.value,
        df = [],
        dataLength = data.length,
        now_date = dataraw.now[0];  

    //db1_data_geo = JSON.stringify(scope.dataraw);

    for (var i = 0; i < dataLength; i += 1) {
        df.push([
            data[i][1], // the county chn name
            data[i][10], // ccount lag0
            data[i][2], // ccount last 5 days
            data[i][3], // ccount cumsum

            data[i][6].toString() + ', ' + data[i][7].toString() + ', ' + data[i][8].toString() + ', ' + data[i][9].toString()+ ', '  + data[i][10].toString() ,

            //data[i][15], // dev ccount lag0
            data[i][11].toString() + ', ' + data[i][12].toString() + ', ' + data[i][13].toString() + ', ' + 
            data[i][14].toString()+ ', '  + data[i][15].toString() + '; column'

            //data[i][4], // rate ccount last 5 days
            //data[i][5], // rate ccount cumsum
            //data[i][6], // ccount lag4
            //data[i][7], // ccount lag3
            //data[i][8],// ccount lag2
            //data[i][9], // ccount lag1   
            //data[i][10], // ccount lag0
            //data[i][11], // dev ccount lag4
            //data[i][12],// dev ccount lag3
            //data[i][13], // dev ccount lag2   
            //data[i][14], // dev ccount lag1
            //data[i][15] // dev ccount lag0
        ]);
    }

    // table header
    var col = ['County', 'Daily', '5-day', 'Total' , "Daily Trend", "Deviation Trend"];

    var table = document.createElement("table");
    table.id = "countytable";
    table.className = "table table-bordered table-striped display compact";
    table.style="height: 100%;width:100%; font-size:100%; padding: 1px 1px;";


    var header = table.createTHead ();
    var row = header.insertRow(0);

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      
        th.innerHTML = col[i];
        row.appendChild(th);
    }


    var bbody = table.appendChild(document.createElement('tbody'));
    bbody.setAttribute("id", "tbody-sparkline");

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.length; i++) {

            tr = bbody.insertRow(-1);

            var th = document.createElement("th");      
            th.innerHTML = df[i][0];
            tr.appendChild(th);

            for (var j = 1; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (j == 4 || j ==5) {
                    tabCell.setAttribute("data-sparkline", df[i][j]);
                } else {
                    tabCell.innerHTML = df[i][j];
                }
                
                
            }
        }

    var divContainer = document.getElementById("pane-table");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
    


    // Spark line
    Highcharts.SparkLine = function (a, b, c) {
      const hasRenderToArg = typeof a === 'string' || a.nodeName;
      let options = arguments[hasRenderToArg ? 1 : 0];
      const defaultOptions = {
        chart: {
          renderTo: (options.chart && options.chart.renderTo) || (hasRenderToArg && a),
          backgroundColor: null,
          borderWidth: 0,
          type: 'area',
          margin: [2, 0, 2, 0],
          width: 100,
          height: 30,
          style: {
            overflow: 'visible'
          },
          // small optimalization, saves 1-2 ms each sparkline
          skipClone: true
        },
        title: { text: '' },
        credits: { enabled: false },
        xAxis: { visible: false },
        yAxis: { visible: false },
        legend: { enabled: false },
        exporting: { enabled: false },
        tooltip: {
          hideDelay: 0,
          outside: true,
          shared: true
        },
        plotOptions: {
          series: {
            animation: false,
            lineWidth: 1.2,
            shadow: false,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            marker: {
              radius: 2,
              states: {
                hover: {
                  radius: 3
                }
              }
            },
            fillOpacity: 0.45
          },
          area: {
            color: 'rgba(178, 34, 34, 1)',
            fillColor: 'rgba(178, 34, 34, 0.2)',
          },
          column: {
            color: 'rgba(178, 34, 34, 1)',
            negativeColor: '#0088FF',
            borderColor: 'rgba(0, 0, 0, 0)',
            groupPadding: 0.1
          }

        }
      };

      options = Highcharts.merge(defaultOptions, options);

      return hasRenderToArg ?
        new Highcharts.Chart(a, options, c) :
        new Highcharts.Chart(options, b);
    };

    const start = +new Date(),
      tds = Array.from(document.querySelectorAll('td[data-sparkline]')),
      fullLen = tds.length;

    let n = 0;

    // Creating 153 sparkline charts is quite fast in modern browsers, but IE8 and mobile
    // can take some seconds, so we split the input into chunks and apply them in timeouts
    // in order avoid locking up the browser process and allow interaction.
    function doChunk() {
      const time = +new Date(),
        len = tds.length;

      for (let i = 0; i < len; i += 1) {
        const td = tds[i];
        const stringdata = td.dataset.sparkline;
        const arr = stringdata.split('; ');
        const data = arr[0].split(', ').map(parseFloat);
        const chart = {};
        const option_data = {
            series: [{
                data: data,
                pointStart: 1
            }],
            tooltip: {
                headerFormat: '<span style="font-size: 10px">' + td.parentElement.querySelector('th').innerText + ':</span><br/>',
                pointFormat: '<b>{point.y}</b>'
            },
            chart: chart
        }
            ;


        if (arr[1]) {
          chart.type = arr[1];
          option_data.yAxis = {
            min: -1.5,
            max: 1.5
          };
        }
        Highcharts.SparkLine(td, option_data);
        

        n += 1;

        // If the process takes too much time, run a timeout to allow interaction with the browser
        if (new Date() - time > 500) {
          tds.splice(0, i + 1);
          setTimeout(doChunk, 0);
          break;
        }

        // Print a feedback on the performance
        //if (n === fullLen) {
        //  document.getElementById('result').innerHTML = 'Generated ' + fullLen + ' sparklines in ' + (new Date() - start) + ' ms';
        //}
      }
    }
    doChunk();

    // build datatable
    $('#countytable').DataTable({
          "paging": true,
          "pageLength": 11,
          "pagingType": "simple",
          "lengthChange": false,
          "searching": false,
          "order": [[ 3, "desc" ]],
          "ordering": true,
          //"info": true,
          "autoWidth": true,
          //"responsive": true,
          "scrollX": true,
          dom: "<'row'<'col-sm-3'l><'col-sm-3'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-6'i><'float-right col-6'p>>",
        });


});



