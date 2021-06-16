$.getJSON('https://raw.githubusercontent.com/dachuwu/covidR2tw_dashboard/main/data/db1_data_box.json', function (dataraw) {

    // split the data set into ohlc and volume https://demo-live-data.highcharts.com/aapl-ohlcv.json
    var data = dataraw.value;
    var nowdate = document.getElementById("update");
    nowdate.innerHTML = dataraw.now[0];

    var box1 = document.getElementById("infobox1");
    box1.innerHTML = data[0];
    var box2 = document.getElementById("infobox2");
    box2.innerHTML = data[1];
    var box3 = document.getElementById("infobox3");
    box3.innerHTML = data[2];
    var box4 = document.getElementById("infobox4");
    box4.innerHTML = data[3];

});

