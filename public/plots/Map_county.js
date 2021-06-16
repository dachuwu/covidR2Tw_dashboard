
// Project the data using Proj4
function project(geojson, projection) {
    const p = window.proj4(projection);
    const projectPolygon = coordinate => {
        coordinate.forEach((lonLat, i) => {
            coordinate[i] = p.forward(lonLat);
        });
    };
    geojson.features.forEach(function (feature) {
        if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates.forEach(projectPolygon);
        } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(items => {
                items.forEach(projectPolygon);
            });
        }
    });
}

function getRandomData(geojson) {
    return geojson.features.map(() => Math.round(Math.random() * 100));
}

$.getJSON(
    'https://raw.githubusercontent.com/jason2506/Taiwan.TopoJSON/master/topojson/counties.json', function(topology){
    // Convert the topoJSON feature into geoJSON
    const geojson = window.topojson.feature(
        topology,
        // For this demo, get the first of the named objects
        topology.objects[Object.keys(topology.objects)[0]]
    );
    // Optionally project the data using Proj4. This costs performance, and
    // when performance is crucial, should be done on the server. In this
    // case we're using a Lambert Conformal Conic projection for Europe,
    // with a projection center in the middle of the map.
    project(
        geojson,
        '+proj=lcc +lat_1=10 +lat_2=20 +lat_0=0 +lon_0=120'
    );





    $.getJSON('https://raw.githubusercontent.com/dachuwu/covidR2tw_dashboard/main/data/db1_data_geo.json', function (dataraw) {

        // content data
        var data = dataraw.value,
            df = [],
            dataLength = data.length,
            now_date = dataraw.now[0];  

            for (var i = 0; i < dataLength; i += 1) {
                df.push([
                    data[i][0], // the county code
                    data[i][1], // the county name
                    data[i][4], // rate ccount last 5 days
                    data[i][2], // ccount last 5 days
                    data[i][3] // ccount cumsum
                    
                    //data[i][5], // rate ccount cumsum
                ]);
            }


        // Initialize the chart
        Highcharts.mapChart('casemap', {
            chart: {
                map: geojson,
                reflow: true,
                backgroundColor: 'rgba(0,0,0,0)',
                 events: {
                    load: function () {
                    this.mapZoom(0.9, 0, 0);
                    }
                }
            },

            title: {
                text: null
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                tickPixelInterval: 100,
                minColor: '#F1EEF6',
                maxColor: '#ab2121'
            },

            series: [{
                data: df,
                keys: ['id', 'name', 'value', 'count5', 'counttotal'],
                joinBy: 'id',
                name: 'Reported rate per capita (Last 5 days)',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },
                borderColor: '#ffffff',
                borderWidth: 0.5
            }],
            tooltip: {
                pointFormat: '{point.name}: {point.value} per 100,000 population'
            },
            legend: {
                borderWidth: 0,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                floating: true,
                width: 60,
                margin: 10
            },
            exporting: { enabled: false },
        });
    })
    


})





