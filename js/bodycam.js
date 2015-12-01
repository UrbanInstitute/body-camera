var promise = new Promise(function(resolve, reject) {
    window.onload = function() {
        init()
    };
    var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1ePutuYZqgKWr7Z47cEfbHxCfpk4z5HoRoakYa8waR1E/pubhtml';
    var columnList = ["State", "passed", "proposedOrPending", "CreatesRecommendsaStudyGroupPilotProgram", "AddressesWiretappingPrivacyIssues", "DictatesWhereCamerasCanGoBeTurnedOnandOff", "PresumptivelyShieldsFootagefromPublicDisclosure", "AddressesRedactions", "AddressesStageandTimethatFootageMustbeKept"];

    function init() {
        Tabletop.init({
            key: public_spreadsheet_url,
            callback: showInfo,
            simpleSheet: true
        });
    }

    function showInfo(data) {
        // data comes through as a simple array since simpleSheet is turned on
        // alert("Successfully processed " + data.length + " rows!")
        // document.getElementById("food").innerHTML = "<strong>Foods:</strong> " + [ data[0].pass, data[1].Name, data[2].Name ].join(", ");

        //last updated
         document.getElementById("date").innerHTML = "Data last updated " + data[0].DateUpdated;
        // The table generation function
        function tabulate(data, columns) {
                var table = d3.select("#body-cam").append("table").style("border-collapse", "collapse") // <= Add this line in
                    .attr("id", "body-cam-table").attr("class", "floatThead-table")
                    thead = table.append("thead"),
                    tbody = table.append("tbody");
                // append the header row
                thead.append("tr").selectAll("th").data(columns).enter().append("th").text(function(column) {
                    if (column == "passed") return "Passed";
                    if (column == "proposedOrPending") return "Proposed or Pending ";
                    if (column == "CreatesRecommendsaStudyGroupPilotProgram") return "Creates or Recommends a Study Group Pilot Program";
                    if (column == "AddressesWiretappingPrivacyIssues") return "Addresses Wiretapping Privacy Issues";
                    if (column == "DictatesWhereCamerasCanGoBeTurnedOnandOff") return "Dictates Where Cameras Can Go and if They Can Be Turned On and Off";
                    if (column == "PresumptivelyShieldsFootagefromPublicDisclosure") return "Presumptively Shields Footage from Public Disclosure";
                    if (column == "AddressesRedactions") return "Addresses Redactions";
                    if (column == "AddressesStageandTimethatFootageMustbeKept") return "Addresses Stageand Time That Footage Must be Kept";
                }).attr("class", "section-header");
                // append the map row
                thead.append("tr").selectAll("td").data(columns).enter().append("td").attr("class", function(d) {
                    if (d.value != "State") {
                        return "map-cell";
                    }
                });
                // create a row for each object in the data
                var rows = tbody.selectAll("tr").data(data).enter().append("tr");
                // create a cell in each row for each column
                var cells = rows.selectAll("td").data(function(row) {
                    return columns.map(function(column) {
                        return {
                            column: column,
                            value: row[column],
                            stateAbbr: row["ABBR"],
                            link: row["pdfLink"]
                        };
                    });
                }).enter().append("td").text(function(d) {
                    if (d.value != '') {
                        if (d.value != "X") return d.value;
                    }
                }).attr("class", function(d) {
                    if (d.value == "X") {
                        return "yes";
                    } else if (d.value == "") {
                        return "no";
                    } else {
                        return "rowLabel";
                    }
                }).on("mouseenter", function(d) {
                    if($(this).hasClass("yes")){
                    var thisMapState = d3.select("." + d.column).select("." + d.stateAbbr).classed("mapYesSelected", true)}
                    else{
                        var thisMapState = d3.select("." + d.column).select("." + d.stateAbbr).classed("mapNoSelected", true)}
                    
                })
                .on("mouseleave", function(d) {
                    if($(this).hasClass("yes")){
                    var thisMapState = d3.select("." + d.column).select("." + d.stateAbbr).classed("mapYesSelected", false)}
                    else{
                        var thisMapState = d3.select("." + d.column).select("." + d.stateAbbr).classed("mapNoSelected", false)}
                    
                })
                .on("mousedown", function(d){
                    // console.log(d.link);
                    window.open(d.link);
                })
                $(".rowLabel").wrapInner("<span class='stateName'></span>");
                $(".map-cell").addClass(function(index) {
                    return (columnList[index]);
                });
                return table;
            }
            // render the table
        var stateTable = tabulate(data, columnList);

        function redraw(w, h) {
            //map stuff
            d3.selectAll(".map-cell").select("svg").remove();
            //Define map projection
            var projection = d3.geo.albersUsa().scale([w * 1.3]).translate(
                    [w / 2, h / 2])
                // .scale(1);
                //Define path generator
            var path = d3.geo.path().projection(projection);
            //Define quantize scale to sort data values into buckets of color
            var color = d3.scale.quantize().range(["#1696d2", "#000"]);
            //Create SVG element
            var svg = d3.selectAll(".map-cell").append("svg").attr("width", w).attr("height", h)
                // .attr("viewbox", viewbox)
                // .attr("preserveAspectRatio", preserveAspectRatio)
                .data(data).attr("class", "responsiveMap").attr("id", function(d, i) {
                    // console.log(d);
                    return "map" + i;
                });
            //responsive map stuff
            var aspect = 160 / 100
                // responsiveMap = $(".responsiveMap");
                //Set input domain for color scale
            color.domain([
                d3.min(data, function(d) {
                    return d.passed;
                }),
                d3.max(data, function(d) {
                    return d.passed;
                })
            ]);
            var map0 = d3.select("#map0");
            var map1 = d3.select("#map1");
            var map2 = d3.select("#map2");
            var map3 = d3.select("#map3");
            var map4 = d3.select("#map4");
            var map5 = d3.select("#map5");
            var map6 = d3.select("#map6");
            var map7 = d3.select("#map7");
            var map8 = d3.select("#map8");
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
                map1.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"passed"}})
                    .attr("class", function(d) {
                        if (d.properties.value) {
                            var value = d.properties.value.passed;
                            if (value) {
                                return "mapYes " + d.properties.value.ABBR + " mapState " + "passed";
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "passed";
                            }
                        }
                    })
                    //Bind data and create one path per GeoJSON feature
                map2.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"proposedOrPending"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.proposedOrPending;
                            if (value) {
                                return "mapYes " + d.properties.value.ABBR + " mapState " + "proposedOrPending";
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "proposedOrPending";
                            }
                        }
                    });
                map3.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"CreatesRecommendsaStudyGroupPilotProgram"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.CreatesRecommendsaStudyGroupPilotProgram;
                            if (value) {
                                return "mapYes " + d.properties.value.ABBR + " mapState " + "CreatesRecommendsaStudyGroupPilotProgram";
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "CreatesRecommendsaStudyGroupPilotProgram";
                            }
                        }
                    });
                map4.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"AddressesWiretappingPrivacyIssues"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.AddressesWiretappingPrivacyIssues;
                            if (value) {
                                return "mapYes " + d.properties.value.ABBR + " mapState " + "AddressesWiretappingPrivacyIssues";
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "AddressesWiretappingPrivacyIssues";
                            }
                        }
                    });
                map5.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"DictatesWhereCamerasCanGoBeTurnedOnandOff"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.DictatesWhereCamerasCanGoBeTurnedOnandOff;
                            if (value) {
                                return "mapYes " + d.properties.value.ABBR + " mapState " + "DictatesWhereCamerasCanGoBeTurnedOnandOff";
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "DictatesWhereCamerasCanGoBeTurnedOnandOff";
                            }
                        }
                    });
                map6.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"PresumptivelyShieldsFootagefromPublicDisclosure"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.PresumptivelyShieldsFootagefromPublicDisclosure;
                            if (value) {
                                return "mapYes " + d.properties.value.ABBR + " mapState " + "PresumptivelyShieldsFootagefromPublicDisclosure";
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "PresumptivelyShieldsFootagefromPublicDisclosure";
                            }
                        }
                    });
                map7.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"AddressesRedactions"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.AddressesRedactions;
                            if (value) {
                                return "mapYes " + d.properties.value.ABBR + " mapState " + "AddressesRedactions";
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "AddressesRedactions";
                            }
                        }
                    });
                map8.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"AddressesStageandTimethatFootageMustbeKept"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.AddressesStageandTimethatFootageMustbeKept;
                            if (value) {
                                return "mapYes " + d.properties.value.ABBR + " mapState " + "AddressesStageandTimethatFootageMustbeKept";
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "AddressesStageandTimethatFootageMustbeKept";
                            }
                        }
                    });
            });
        }
        var cells = d3.select(".map-cell")
        redraw(cells.node().getBoundingClientRect().width, cells.node().getBoundingClientRect().height)
        $(window).on("resize", function() {
            redraw(cells.node().getBoundingClientRect().width, cells.node().getBoundingClientRect().height - 5)
        });


        // state by state lists for small layouts
        // for each row, add text for each category. then shade/color based on value of row/column.
        var stateList = d3.select("#list-section").selectAll(".state-list-state").append("div")
            .data(data)
            .enter()
            .append("div")
            .attr("class", "state-list-state ")
            // .attr("class", function (d){
            //     var thisStateName = d.stateName;
            //     return thisStateName;
            // })
            stateName = stateList.append("div").attr("class", "stateName");
            stateName.selectAll("stateName")
            .data(data, function(d){
                // console.log(d.State)
                return d;
            })
            stateName.append("h2")
            .html(function (d){
                    return d.State;
                })

            stateStats = stateList.append("div").attr("class", "stateStats");
            stateStats.selectAll("stateStats")
                .data(data, function(d, i){
                 console.log(d)
                return d;
            })
                stateStats.append("div")
                .attr("class", "statItem")





        // tilemaps for small layouts
        var color = d3.scale.ordinal()
            .domain(["X", ""])
            .range(["#1696d2", "#fdbf11", "#000"]);

        drawTileMap(data, "tile1", "passed");
        drawTileMap(data, "tile2", "proposedOrPending");
        drawTileMap(data, "tile3", "CreatesRecommendsaStudyGroupPilotProgram");
        drawTileMap(data, "tile4", "AddressesWiretappingPrivacyIssues");
        drawTileMap(data, "tile5", "DictatesWhereCamerasCanGoBeTurnedOnandOff");
        drawTileMap(data, "tile6", "PresumptivelyShieldsFootagefromPublicDisclosure");
        drawTileMap(data, "tile7", "AddressesRedactions");
        drawTileMap(data, "tile8", "AddressesStageandTimethatFootageMustbeKept");

        function drawTileMap (data, thisMap, thisVariable) {
            var rect = d3.select("#" + thisMap).selectAll("rect")
                .data(data)
                .enter().append("rect")

            var rects = d3.select("#" + thisMap).selectAll("rect")
                .data(data, function (d) {
                    return d.ABBR;
                })
                .attr("class", function (d) {                       
                    var value = d[thisVariable];
                    if (value) {
                        return "mapYes ";
                    } else {
                        return "mapNo ";
                    }
                });


        }
        // end small layouts
    }
    document.write("The published spreadsheet is located at <a target='_new' href='" + public_spreadsheet_url + "'>" + public_spreadsheet_url + "</a>");
    resolve(1)
})
promise.then(function(result) {
    setTimeout(function(){  $('#body-cam-table').stickyTableHeaders({fixedOffset:50}); }, 3000)
    
})