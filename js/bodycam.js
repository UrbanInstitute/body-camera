var promise = new Promise(function(resolve, reject) {
    window.onload = function() {
        init()
    };

    //to edit data, visit https://docs.google.com/spreadsheets/d/15yXsR5uVKej8hobUdhBNzwazDZeF1JBF4IORk6eBQVQ/edit?usp=sharing
    //JPC will edit a different sheet, which is not live: https://docs.google.com/spreadsheets/d/1wShnyXTUYbu9LqkF6GG_dQeV70n4rqLNVsZwBNq8B-g/edit#gid=0
    //copy contents of JPCs sheet into the new sheet, or change the public spreadsheet url below to be that of the JPC sheet.
    
    // var GOOGLE_ID = "1vXUL4EmbuJAYgUig7EH3O0HyQ2UPpMJFTgL67nWSczs"
    var GOOGLE_ID = "1ge0fmqhQKiWjJJ8pZe7DPSch4SxelJW1ejGVcn59l_g"
    var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/'+ GOOGLE_ID +'/pubhtml';

    var columnList = ["State", "audio","allPartyConsent", "privatePlaces", "lawEnforcement", "CreatesRecommendsaStudyGroupPilotProgram", "DictatesWhenWhereCamerasCanBeUsed", "RestrictsPublicAccess", "PrescribesStorageTime"];

    function init() {
        d3.selectAll("span.page-scroll")
            .on("click", function(){
                // console.log($('#stateTable').offset().top)
                if(d3.select("#mobile").style("display") == "block"){
                    $("html, body").animate({ scrollTop: $('#mobile #stateTable').offset().top-120 }, 1000);    
                }else{
                    $("html, body").animate({ scrollTop: $('#desktopTitle #stateTable').offset().top-90 }, 1000);
                }
            })

        Tabletop.init({
            key: public_spreadsheet_url,
            callback: showInfo,
            simpleSheet: false
        });
    }

    function showInfo(sheets) {
        // data comes through as a simple array since simpleSheet is turned on
        // alert("Successfully processed " + data.length + " rows!")
        // document.getElementById("food").innerHTML = "<strong>Foods:</strong> " + [ data[0].pass, data[1].Name, data[2].Name ].join(", ");

        //last updated
        console.log(sheets)
        var blurbs = sheets.blurbs.all()
        var data = sheets.data.all()
         // document.getElementById("date").innerHTML = "Data current as of " + data[0].DateUpdated;
        // The table generation function
        function tabulate(data, blurbs, columns) {
                // console.log(data, blurbs)

                for (var i=0; i < data.length; i ++){
                    for(var key in blurbs[i]){
                        if (key == "ABBR" || key == "DateUpdated" || key == "State" || key == "pdfLink"){
                            continue
                        }else{
                            if (blurbs[i][key] != ""){
                                data[i][key + "blurb"] = blurbs[i][key]
                            }
                        }
                    }
                }

                console.log(data)

                var table = d3.select("#body-cam").append("table").style("border-collapse", "collapse") // <= Add this line in
                    .attr("id", "body-cam-table").attr("class", "floatThead-table")
                    thead = table.append("thead"),
                    tbody = table.append("tbody");
                
                
                // append the header rows 

                //first part is the header-group labels
                thead.append("tr")
                .selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .attr("colspan", function(column){
                    if (column == "State") return "1";
                    else if (column == "audio") return "4";
                    else if (column == "allPartyConsent") return "4";
                    else{ d3.select(this).remove();}
                }).attr("class", "groupLabels")
                .html(function(column){
                    if (column == "audio") return "Current Laws Applicable to Body-Worn Cameras";
                    if (column == "allPartyConsent") return "Laws Specific to Body-Worn Cameras";
                });


                //grouping lines
                thead.append("tr").selectAll("th").data(columns).enter().append("th").attr("class", function(column){
                    if (column == "audio") return "header-group  center";
                    if (column == "allPartyConsent") return "header-group  center";
                    if (column == "privatePlaces") return "header-group  center";
                    if (column == "lawEnforcement") return "header-group right center";
                    if (column == "CreatesRecommendsaStudyGroupPilotProgram")  return "header-group left center";
                    if (column == "DictatesWhenWhereCamerasCanBeUsed")  return "header-group  center";
                    if (column == "RestrictsPublicAccess") return  "header-group  center";
                    if (column == "PrescribesStorageTime") return "header-group  center";
                });


                //header labels
                thead.append("tr").selectAll("th").data(columns).enter().append("th").html(function(column) {
                    if (column == "audio") return "Prohibits only audio recordings<i class=\"fa fa-info-circle\" data-text=\"Video recordings with no sound may be permissible.\"></i>";
                    if (column == "allPartyConsent") return "Requires two-/all-party consent<i class=\"fa fa-info-circle\" data-text=\"Law enforcement exceptions may exist conditional on context and location.\"></i>";
                    if (column == "privatePlaces") return "Restricts recordings where privacy is expected<i class=\"fa fa-info-circle\" data-text=\"In many states, lawful recordings are contingent on whether there is a reasonable expectation of privacy.\"></i>";
                    if (column == "lawEnforcement") return "Exempts police from public records requests<i class=\"fa fa-info-circle\" data-text=\"Law enforcement may choose to withhold records in order to protect active investigations, public safety, or national security.\"></i>";
                    if (column == "CreatesRecommendsaStudyGroupPilotProgram") return "Creates or recommends a study group or pilot";
                    if (column == "DictatesWhenWhereCamerasCanBeUsed") return "Dictates where, when, and how cameras can be used";
                    if (column == "RestrictsPublicAccess") return "Sets rules for public access to footage";
                    if (column == "PrescribesStorageTime") return "Prescribes video storage time";
                }).attr("class", "section-header");
                // append the map row
                thead.append("tr").selectAll("td").data(columns).enter().append("td").attr("class", function(d) {
                    if (d.value != "State") {
                        return "map-cell";
                    }
                });



                // create a row for each object in the data
                var rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr");
                // create a cell in each row for each column
                var cells = rows.selectAll("td")
                    .data(function(row) {
                        return columns.map(function(column) {
                            return {
                                column: column,
                                value: row[column],
                                stateAbbr: row["ABBR"],
                                blurb: row[column + "blurb"]
                            };
                        });
                }).enter().append("td").text(function(d) {
                    if (d.value != '') {
                        if (d.value != "passed" && d.value != "proposedpending" && d.value != "recent") return d.value; //should only return stateNames
                    }
                }).attr("class", function(d) {
                    if (d.value == "passed") {
                        return "passed " + d.column;
                    } else if (d.value == "proposedpending"){
                        return "proposedpending " + d.column;
                    } else if (d.value == "recent"){
                        return "recent " + d.column;
                    } else if (d.value == "") {
                        return "no " + d.column;
                    } else {
                        return "rowLabel";
                    }
                }).on("mouseenter", function(d) {
                    if(!d3.select(this).classed("rowLabel")){
                        d3.select(this)
                            .append("div")
                            .attr("class","blurbOutline")
                            .style("width",function(){ 
                                var w = (parseFloat(d3.select(this).node().parentNode.getBoundingClientRect().width))
                                if(d3.select(d3.select(this).node().parentNode).classed("CreatesRecommendsaStudyGroupPilotProgram") || d3.select(d3.select(this).node().parentNode).classed("lawEnforcement")){
                                    return (w-4) + "px"
                                }else{ return w + "px"}
                            })
                    }
                    if(typeof(d.blurb) != "undefined"){
                        d3.select(this)
                            .append("div")
                            .attr("class","blurbTooltip")
                        .style("width",function(){ 
                            var w = (parseFloat(d3.select(this).node().parentNode.getBoundingClientRect().width))
                            if(d3.select(d3.select(this).node().parentNode).classed("CreatesRecommendsaStudyGroupPilotProgram") || d3.select(d3.select(this).node().parentNode).classed("lawEnforcement")){
                                return (w-4) + "px"
                            }else{ return w + "px"}
                        })
                            .html(d.blurb)

                    }
                    // if($(this).hasClass("passed")){
                        var state = d3.select("." + d.column).select("path." + d.stateAbbr)
                            .classed("mapPassedSelected", true)
                        state.node().parentNode.appendChild(state.node())
                    // else{
                        // var thisMapState = d3.select("." + d.column).select("." + d.stateAbbr).classed("mapNoSelected", true)}
                })
                .on("mouseleave", function(d) {
                    d3.selectAll(".blurbTooltip").remove();
                    d3.selectAll(".blurbOutline").remove();

                    d3.selectAll("." + d.column).select("." + d.stateAbbr).classed("mapPassedSelected", false)
                    
                })
                // .on("mousedown", function(d){
                //     if ($(this).hasClass("rowLabel")){
                //         window.open(d.link);
                //     }
                // })
                $(".rowLabel").wrapInner("<span class='stateName'></span>");
                $(".map-cell").addClass(function(index) {
                    return (columnList[index]);
                });
                return table;
            }

        
            // render the table
        var stateTable = tabulate(data, blurbs, columnList);

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
                            var value = d.properties.value.privatePlaces;
                            if (value) {
                                return d.properties.value.ABBR + " mapState " + "privatePlaces " + value;
                            } else {
                                return "mapNo " + d.properties.value.ABBR + " mapState " + "privatePlaces";
                            }
                        }
                    });
                    map4.selectAll("path").data(json.features).enter().append("path").attr("d", path)
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
            // var cells = d3.select(".map-cell")
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
            .html("Prohibits only audio recordings")
            .attr("class", function(d){
                var value = d.audio;
                if (value == "passed"){
                    return "list-item list-passed";
                }else if (value == "proposedpending"){
                    return "list-item list-proposedpending"
                }else if (value == "recent"){
                    return "list-item list-recent"
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Requires two-/all-party consent")
            .attr("class", function(d){
                var value = d.allPartyConsent;
                if (value == "passed"){
                    return "list-item list-passed";
                }else if (value == "proposedpending"){
                    return "list-item list-proposedpending"
                }else if (value == "recent"){
                    return "list-item list-recent"
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Restricts recordings where privacy is expected")
            .attr("class", function(d){
                var value = d.privatePlaces;
                if (value == "passed"){
                    return "list-item list-passed";
                }else if (value == "proposedpending"){
                    return "list-item list-proposedpending"
                }else if (value == "recent"){
                    return "list-item list-recent"
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Exempts police from public records requests")
            .attr("class", function(d){
                var value = d.lawEnforcement;
                if (value == "passed"){
                    return "list-item list-passed";
                }else if (value == "proposedpending"){
                    return "list-item list-proposedpending"
                }else if (value == "recent"){
                    return "list-item list-recent"
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Creates or recommends a study group or pilot")
            .attr("class", function(d){
                var value = d.CreatesRecommendsaStudyGroupPilotProgram;
                if (value == "passed"){
                    return "list-item list-passed";
                }else if (value == "proposedpending"){
                    return "list-item list-proposedpending"
                }else if (value == "recent"){
                    return "list-item list-recent"
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Dictates where, when, and how cameras can be used")
            .attr("class", function(d){
                var value = d.DictatesWhenWhereCamerasCanBeUsed;
                if (value == "passed"){
                    return "list-item list-passed";
                }else if (value == "proposedpending"){
                    return "list-item list-proposedpending"
                }else if (value == "recent"){
                    return "list-item list-recent"
                }else{
                    return "list-item list-no"
                }
            })


            stateList.append("div")
            .html("Sets rules for public access to footage")
            .attr("class", function(d){
                var value = d.RestrictsPublicAccess;
                if (value == "passed"){
                    return "list-item list-passed";
                }else if (value == "proposedpending"){
                    return "list-item list-proposedpending"
                }else if (value == "recent"){
                    return "list-item list-recent"
                }else{
                    return "list-item list-no"
                }
            })

            stateList.append("div")
            .html("Prescribes video storage time")
            .attr("class", function(d){
                var value = d.PrescribesStorageTime;
                if (value == "passed"){
                    return "list-item list-passed";
                }else if (value == "proposedpending"){
                    return "list-item list-proposedpending"
                }else if (value == "recent"){
                    return "list-item list-recent"
                }else{
                    return "list-item list-no"
                }
            })


        // tilemaps for small layouts
        var color = d3.scale.ordinal()
            .domain(["X", ""])
            .range(["#1696d2", "#fdbf11", "#000"]);

        drawTileMap(data, "tile1", "audio");
        drawTileMap(data, "tile2", "allPartyConsent");
        drawTileMap(data, "tile3", "privatePlaces");
        drawTileMap(data, "tile4", "lawEnforcement");
        drawTileMap(data, "tile5", "CreatesRecommendsaStudyGroupPilotProgram");
        drawTileMap(data, "tile6", "DictatesWhenWhereCamerasCanBeUsed");
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
                    if (value == "passed") {
                        return "mapPassed ";
                    } else if (value =="proposedpending"){
                        return "mapProposedpending ";
                    } else if (value =="recent"){
                        return "maprecent ";
                    } else{
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

           d3.selectAll(".fa-info-circle")
            .on("mouseover", function(){
                console.log("true")
                var text = d3.select(this).attr("data-text")
                d3.select(this)
                    .append("div")
                    .attr("class","headerTooltip")
                    .html(text)
            })
            .on("mouseout", function(){
                d3.selectAll(".headerTooltip").remove();
            })

    }

    resolve(1)
})
promise.then(function(result) {
    setTimeout(function(){  $('#body-cam-table').stickyTableHeaders({fixedOffset:50}); }, 3000);
    
})

