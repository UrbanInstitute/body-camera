var promise = new Promise(function(resolve, reject) {
    window.onload = function() {
        init()
    };

    //to edit data, visit https://docs.google.com/spreadsheets/d/15yXsR5uVKej8hobUdhBNzwazDZeF1JBF4IORk6eBQVQ/edit?usp=sharing
    //JPC will edit a different sheet, which is not live: https://docs.google.com/spreadsheets/d/1wShnyXTUYbu9LqkF6GG_dQeV70n4rqLNVsZwBNq8B-g/edit#gid=0
    //copy contents of JPCs sheet into the new sheet, or change the public spreadsheet url below to be that of the JPC sheet.

    var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/15yXsR5uVKej8hobUdhBNzwazDZeF1JBF4IORk6eBQVQ/pubhtml';
    var columnList = ["State", "audio","allPartyConsent", "privatePlaces", "lawEnforcement", "CreatesRecommendsaStudyGroupPilotProgram", "DictatesWhenWhereCamerasCanBeUsed", "RestrictsPublicAccess", "PrescribesStorageTime"];

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
                
                
                // append the header rows 

                //first part is the header-group labels
                thead.append("tr").selectAll("th").data(columns).enter().append("th").attr("colspan", function(column){
                    if (column == "audio") return "4";
                    if (column == "allPartyConsent") return "4";
                }).attr("class", "groupLabels")
                .text(function(column){
                    if (column == "audio") return "Current Laws Concerning Video Surveillance";
                    if (column == "allPartyConsent") return "Laws Specific to Police Body-Worn Cameras";
                });


                //grouping lines
                thead.append("tr").selectAll("th").data(columns).enter().append("th").attr("class", function(column){
                    if (column == "audio") return "header-group left center";
                    if (column == "allPartyConsent") return "header-group  center";
                    if (column == "privatePlaces") return "header-group  center";
                    if (column == "lawEnforcement") return "header-group right center";
                    if (column == "CreatesRecommendsaStudyGroupPilotProgram")  return "header-group left center";
                    if (column == "DictatesWhenWhereCamerasCanBeUsed")  return "header-group  center";
                    if (column == "RestrictsPublicAccess") return  "header-group  center";
                    if (column == "PrescribesStorageTime") return "header-group right center";
                });


                //header labels
                thead.append("tr").selectAll("th").data(columns).enter().append("th").text(function(column) {
                    if (column == "audio") return "Allow the recording of audio";
                    if (column == "allPartyConsent") return "Require all-party consent";
                    if (column == "privatePlaces") return "Private places are off limits";
                    if (column == "lawEnforcement") return "Law enforcement excemptions";
                    if (column == "CreatesRecommendsaStudyGroupPilotProgram") return "Creates or recommends a study group or pilot program";
                    if (column == "DictatesWhenWhereCamerasCanBeUsed") return "Dictates where and when cameras can be used";
                    if (column == "RestrictsPublicAccess") return "Restricts public access to footage";
                    if (column == "PrescribesStorageTime") return "Prescribes video storage time";
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
                        if (d.value != "passed" && d.value != "proposedpending" && d.value != "both") return d.value; //should only return stateNames
                    }
                }).attr("class", function(d) {
                    if (d.value == "passed") {
                        return "passed " + d.column;
                    } else if (d.value == "proposedpending"){
                        return "proposedpending " + d.column;
                    } else if (d.value == "both"){
                        return "both " + d.column;
                    } else if (d.value == "") {
                        return "no " + d.column;
                    } else {
                        return "rowLabel";
                    }
                }).on("mouseenter", function(d) {
                    if($(this).hasClass("passed")){
                        var thisMapState = d3.select("." + d.column).select("." + d.stateAbbr).classed("mapPassedSelected", true)}
                    else{
                        var thisMapState = d3.select("." + d.column).select("." + d.stateAbbr).classed("mapNoSelected", true)}
                })
                .on("mouseleave", function(d) {
                    if($(this).hasClass("passed")){
                        var thisMapState = d3.select("." + d.column).select("." + d.stateAbbr).classed("mapPassedSelected", false)}
                    else{
                        var thisMapState = d3.select("." + d.column).select("." + d.stateAbbr).classed("mapNoSelected", false)}
                    
                })
                .on("mousedown", function(d){
                    if ($(this).hasClass("rowLabel")){
                        window.open(d.link);
                    }
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
                //Define path generator
            var path = d3.geo.path().projection(projection);
            //Define quantize scale to sort data values into buckets of color
            var color = d3.scale.quantize().range(["#1696d2", "#000"]);
            //Create SVG element
            var svg = d3.selectAll(".map-cell").append("svg").attr("width", w).attr("height", h)
                .data(data).attr("class", "responsiveMap").attr("id", function(d, i) {
                    return "map" + i;
                });
            //responsive map stuff
            var aspect = 1.6 / 1
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
                            var value = d.properties.value.audio;
                            if (value) {
                                return d.properties.value.ABBR + " mapState " + "audio " + value;
                            } else{
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "audio";
                            }
                        }
                    })
                    //Bind data and create one path per GeoJSON feature
                map2.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"proposedOrPending"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.allPartyConsent;
                            if (value) {
                                return d.properties.value.ABBR + " mapState " + "allPartyConsent " + value;
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "allPartyConsent";
                            }
                        }
                    });
                    map3.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"proposedOrPending"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.lawEnforcement;
                            if (value) {
                                return d.properties.value.ABBR + " mapState " + "lawEnforcement " + value;
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "lawEnforcement";
                            }
                        }
                    });
                    map4.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"proposedOrPending"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.privatePlaces;
                            if (value) {
                                return d.properties.value.ABBR + " mapState " + "privatePlaces " + value;
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "privatePlaces";
                            }
                        }
                    });
                map5.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"CreatesRecommendsaStudyGroupPilotProgram"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.CreatesRecommendsaStudyGroupPilotProgram;
                            if (value) {
                                return d.properties.value.ABBR + " mapState " + "CreatesRecommendsaStudyGroupPilotProgram " + value;
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "CreatesRecommendsaStudyGroupPilotProgram";
                            }
                        }
                    });
                map6.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"AddressesWiretappingPrivacyIssues"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.DictatesWhenWhereCamerasCanBeUsed;
                            if (value) {
                                return d.properties.value.ABBR + " mapState " + "DictatesWhenWhereCamerasCanBeUsed " + value;
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "DictatesWhenWhereCamerasCanBeUsed";
                            }
                        }
                    });
                map7.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"DictatesWhenWhereCamerasCanBeUsed"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.DictatesWhenWhereCamerasCanBeUsed;
                            if (value) {
                                return d.properties.value.ABBR + " mapState " + "DictatesWhenWhereCamerasCanBeUsed " + value;
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "DictatesWhenWhereCamerasCanBeUsed";
                            }
                        }
                    });
                map8.selectAll("path").data(json.features).enter().append("path").attr("d", path)
                    // .attr("class", function(d){ if (d.properties.value){return d.properties.value.ABBR +" mapState "+"PresumptivelyShieldsFootagefromPublicDisclosure"}})
                    .attr("class", function(d) {
                        //Get data value
                        if (d.properties.value) {
                            var value = d.properties.value.PrescribesStorageTime;
                            if (value) {
                                return d.properties.value.ABBR + " mapState " + "PrescribesStorageTime " + value;
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "PrescribesStorageTime";
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

            stateList.append("h2")
            .html(function (d){
                    return d.State;
                })
            .attr("class", "state-name")

            stateList.append("div")
            .html("Passed")
            .attr("class", function(d){
                var value = d.passed;
                if (value == "X"){
                    return "list-item list-yes";
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Proposed or Pending")
            .attr("class", function(d){
                var value = d.proposedOrPending;
                if (value == "X"){
                    return "list-item list-yes";
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Creates or Recommends a Study Group Pilot Program")
            .attr("class", function(d){
                var value = d.CreatesRecommendsaStudyGroupPilotProgram;
                if (value == "X"){
                    return "list-item list-yes";
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Addresses Wiretapping Privacy Issues")
            .attr("class", function(d){
                var value = d.AddressesWiretappingPrivacyIssues;
                if (value == "X"){
                    return "list-item list-yes";
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Dictates Where Cameras Can Go and if They Can Be Turned On and Off")
            .attr("class", function(d){
                var value = d.DictatesWhenWhereCamerasCanBeUsed;
                if (value == "X"){
                    return "list-item list-yes";
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Presumptively Shields Footage from Public Disclosure")
            .attr("class", function(d){
                var value = d.PresumptivelyShieldsFootagefromPublicDisclosure;
                if (value == "X"){
                    return "list-item list-yes";
                }else{
                    return "list-item list-no"
                }
            })


            stateList.append("div")
            .html("Addresses Redactions")
            .attr("class", function(d){
                var value = d.RestrictsPublicAccess;
                if (value == "X"){
                    return "list-item list-yes";
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Addresses Stageand Time That Footage Must be Kept")
            .attr("class", function(d){
                var value = d.PrescribesStorageTime;
                if (value == "X"){
                    return "list-item list-yes";
                }else{
                    return "list-item list-no"
                }
            })


        // tilemaps for small layouts
        var color = d3.scale.ordinal()
            .domain(["X", ""])
            .range(["#1696d2", "#fdbf11", "#000"]);

        drawTileMap(data, "tile1", "passed");
        drawTileMap(data, "tile2", "proposedOrPending");
        drawTileMap(data, "tile3", "CreatesRecommendsaStudyGroupPilotProgram");
        drawTileMap(data, "tile4", "AddressesWiretappingPrivacyIssues");
        drawTileMap(data, "tile5", "DictatesWhenWhereCamerasCanBeUsed");
        drawTileMap(data, "tile6", "PresumptivelyShieldsFootagefromPublicDisclosure");
        drawTileMap(data, "tile7", "RestrictsPublicAccess");
        drawTileMap(data, "tile8", "PrescribesStorageTime");

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
                        return "mapPassed ";
                    } else {
                        return "mapNo ";
                    }
                });

        }

        stateBtn = d3.select("#state-btn")
            .on("mousedown", function(){
                var thisBtn = d3.select("#state-btn").classed("btn-active", true);
                var thatBtn = d3.select("#national-btn").classed("btn-active", false);

                var stateTable = d3.select("#list-section").classed("mobile-hide", false).classed("mobile-show", true);
                var natMaps = d3.select("#tile-map-section").classed("mobile-hide", true).classed("mobile-show", false);

             }) 
        nationalBtn = d3.select("#national-btn")
            .on("mousedown", function(){
                var thisBtn = d3.select("#state-btn").classed("btn-active", false);
                var thatBtn = d3.select("#national-btn").classed("btn-active", true);

                               var stateTable = d3.select("#list-section").classed("mobile-hide", true).classed("mobile-show", false);
                var natMaps = d3.select("#tile-map-section").classed("mobile-hide", false).classed("mobile-show", true);
            }) 
        // end small layouts



    }
    $( "#copy-language" ).append( "<a target='_new' href='" + public_spreadsheet_url + "'>Download the data</a>");
    resolve(1)
})
promise.then(function(result) {
    setTimeout(function(){  $('#body-cam-table').stickyTableHeaders({fixedOffset:50}); }, 3000);

    //do some window width stuff
    //if the window is small, remove body-cam div, save as a var

    // $(window).on("resize", function() {
    //     var w = window.innerWidth;
    //     if (w <= 768){
    //         var bodyCamTable = d3.select("#body-cam")
    //         .remove();
    //     }
    // });

    // savedElement will still contain the reference to the object,
    // so for example, you can do:
    // document.getElementById('container').appendChild(savedElement);
// etc.
    
})

