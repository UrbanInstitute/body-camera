window.onload = function() { init() };

var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1ePutuYZqgKWr7Z47cEfbHxCfpk4z5HoRoakYa8waR1E/pubhtml';

function init() {
    Tabletop.init( { key: public_spreadsheet_url,
       callback: showInfo,
       simpleSheet: true } );
}

function showInfo(data) {
        // data comes through as a simple array since simpleSheet is turned on
        // alert("Successfully processed " + data.length + " rows!")
        // document.getElementById("food").innerHTML = "<strong>Foods:</strong> " + [ data[0].pass, data[1].Name, data[2].Name ].join(", ");
        // console.log(data);

        d3.select("#bodycam")
        .selectAll("tr")
        .data(data)
        .enter()
        .append("td")

        .text(function(d) {
        console.log(d);
            return d.ABBR;
        });




}



    document.write("The published spreadsheet is located at <a target='_new' href='" + public_spreadsheet_url + "'>" + public_spreadsheet_url + "</a>");