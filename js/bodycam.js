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
        .selectAll("td")
        .data(data)
        .enter()
        .append("td")
        .text(function(d) {
            if (d3.select(this).node().parentNode.id == "r1"){ //row 1
                return d.ABBR;}
            // } else if (d3.select(this).node().parentNode.id == "r2"){ //row2
            //     return d.passed;
            // } else if (d3.select(this).node().parentNode.id == "r3"){ //row3
            //     return d.CreatesRecommendsaStudyGroupPilotProgram;
            // } else if (d3.select(this).node().parentNode.id == "r4"){ //row4
            //     return d.AddressesWiretappingPrivacyIssues;
            // } else if (d3.select(this).node().parentNode.id == "r5"){ //row4
            //     return d.DictatesWhereCamerasCanGoBeTurnedOnandOff;
            // } else if (d3.select(this).node().parentNode.id == "r6"){ //row4
            //     return d.PresumptivelyShieldsFootagefromPublicDisclosure;
            // }
        })
        .attr("class", function(d) {
            if (d3.select(this).node().parentNode.id == "r2"){ //row2
                if( d.passed == "X"){
                    return "yes";
                }
                else{
                    return "no";
                }
            }
            if (d3.select(this).node().parentNode.id == "r3"){ //row3
                if( d.CreatesRecommendsaStudyGroupPilotProgram == "X"){
                    return "yes";
                }
                else{
                    return "no";
                }
            }
            if (d3.select(this).node().parentNode.id == "r4"){ //row4
                if( d.AddressesWiretappingPrivacyIssues == "X"){
                    return "yes";
                }
                else{
                    return "no";
                }
            }
            if (d3.select(this).node().parentNode.id == "r5"){ //row5
                if( d.DictatesWhereCamerasCanGoBeTurnedOnandOff == "X"){
                    return "yes";
                }
                else{
                    return "no";
                }
            }
            if (d3.select(this).node().parentNode.id == "r6"){ //row6
                if( d.PresumptivelyShieldsFootagefromPublicDisclosure == "X"){
                    return "yes";
                }
                else{
                    return "no";
                }
            }
        });



//map stuff

            //Width and height
            var w = 250;
            var h = 150;

            //Define map projection
            var projection = d3.geo.albersUsa()
            .translate([w/2, h/2])
            .scale([250]);

            //Define path generator
            var path = d3.geo.path()
            .projection(projection);

            //Define quantize scale to sort data values into buckets of color
            var color = d3.scale.quantize()
            .range(["#1696d2", "#000"]);

            //Create SVG element
            var svg = d3.selectAll(".map-cell")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("id", function(d){
                if (d3.select(this).node().parentNode.parentNode.id == "r2"){ //row2
                    return "map2";
                } else if (d3.select(this).node().parentNode.parentNode.id == "r3"){ //row2
                    return "map3";
                } else if (d3.select(this).node().parentNode.parentNode.id == "r4"){ //row2
                    return "map4";
                } else if (d3.select(this).node().parentNode.parentNode.id == "r5"){ //row2
                    return "map5";
                } else if (d3.select(this).node().parentNode.parentNode.id == "r6"){ //row2
                    return "map6";
                }
            })
            .data(data);

            //Load in data

            //Set input domain for color scale
            color.domain([
                d3.min(data, function(d) { return d.passed; }),
                d3.max(data, function(d) { return d.passed; })
                ]);

var map2 = d3.select("#map2");
var map3 = d3.select("#map3");
var map4 = d3.select("#map4");
var map5 = d3.select("#map5");
var map6 = d3.select("#map6");

            //Load in GeoJSON data
            d3.json("data/us_states.json", function(json) {

                //Merge the data and GeoJSON
                //Loop through once for each data value
                for (var i = 0; i < data.length; i++) {

                    //Grab state name
                    var dataState = data[i].State;

                    //Grab data value
                    // var dataValue = data[i].passed;
                    var dataValue = data[i];

                    //Find the corresponding state inside the GeoJSON
                    for (var j = 0; j < json.features.length; j++) {

                        var jsonState = json.features[j].properties.name;

                        if (dataState == jsonState) {

                            //Copy the data value into the JSON
                            json.features[j].properties.value = dataValue;

                            //Stop looking through the JSON
                            break;

                        }
                    }
                }


                //Bind data and create one path per GeoJSON feature
                map2.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function(d) {
                        //Get data value
                         console.log(d);
                         if (d.properties.value){
                            var value = d.properties.value.passed;

                            if (value) {
                                //If value exists…
                                return "#1696d2";
                            } else {
                                //If value is undefined…
                                return "#eee";
                            }
                        }
                    });

                //Bind data and create one path per GeoJSON feature
                map3.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function(d) {
                        //Get data value
                         console.log(d);
                         if (d.properties.value){
                            var value = d.properties.value.CreatesRecommendsaStudyGroupPilotProgram;

                            if (value) {
                                //If value exists…
                                return "#1696d2";
                            } else {
                                //If value is undefined…
                                return "#eee";
                            }
                        }
                    });

                //Bind data and create one path per GeoJSON feature
                map4.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function(d) {
                        //Get data value
                         console.log(d);
                         if (d.properties.value){
                            var value = d.properties.value.AddressesWiretappingPrivacyIssues;

                            if (value) {
                                //If value exists…
                                return "#1696d2";
                            } else {
                                //If value is undefined…
                                return "#eee";
                            }
                        }
                    });

                //Bind data and create one path per GeoJSON feature
                map5.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function(d) {
                        //Get data value
                         console.log(d);
                         if (d.properties.value){
                            var value = d.properties.value.DictatesWhereCamerasCanGoBeTurnedOnandOff;

                            if (value) {
                                //If value exists…
                                return "#1696d2";
                            } else {
                                //If value is undefined…
                                return "#eee";
                            }
                        }
                    });

                //Bind data and create one path per GeoJSON feature
                map6.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function(d) {
                        //Get data value
                         console.log(d);
                         if (d.properties.value){
                            var value = d.properties.value.PresumptivelyShieldsFootagefromPublicDisclosure;

                            if (value) {
                                //If value exists…
                                return "#1696d2";
                            } else {
                                //If value is undefined…
                                return "#eee";
                            }
                        }
                    });


            });








}



document.write("The published spreadsheet is located at <a target='_new' href='" + public_spreadsheet_url + "'>" + public_spreadsheet_url + "</a>");