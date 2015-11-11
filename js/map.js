var map_aspect_width = 1,
    map_aspect_height = 0.7;
//map - option for state or metro view
function cbsamap(div) {

    outcomeSelect = d3.select("#statbtns .active").attr("value")
    catSelect = d3.select("#cat-select").property("value");

    data = data_main.filter(function (d) {
        return d.cat == catSelect & d.level == outcomeSelect & d.fips != 0;
    })

    data.forEach(function (d) {
        d.fips = +d.fips;
        if (d[yearSelect] == "") {
            VALUE[d.fips] = null;
        } else {
            VALUE[d.fips] = +d[yearSelect];
        }
    });

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    var margin = {
        top: 10,
        right: 5,
        bottom: 10,
        left: 5
    };

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * map_aspect_height) / map_aspect_width) - margin.top - margin.bottom;

    $GRAPHDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var projection = d3.geo.albersUsa()
        .scale(width * 1.3)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    if (STATEMAP == 0) {

        svg.selectAll("path")
            .data(topojson.feature(us, us.objects.tl_2015_us_cbsa).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fid", function (d) {
                return "f" + d.id;
            })
            .attr("class", "metros")
            .attr("fill", function (d) {
                if (VALUE[d.id] != null) {
                    return color(VALUE[d.id]);
                } else {
                    return "#fff";
                }
            })
            .on("mouseover", function (d) {
                if (isIE != false) {
                    d3.selectAll(".hovered")
                        .classed("hovered", false);
                    d3.selectAll("[fid='" + this.fid)
                        .classed("hovered", true)
                        .moveToFront();
                    //tooltip(this.id);
                    this.parentNode.appendChild(this);
                } else {
                    dispatch.hoverState(this.fid);
                }
            })
            .on("mouseout", function (d) {
                dispatch.dehoverState(this.fid);
            });

        svg.append("g")
            .attr("class", "stateborders")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.cb_2014_us_state_20m).features)
            .enter().append("path")
            .attr("d", path);

    } else {

        svg.selectAll("path")
            .data(topojson.feature(us, us.objects.cb_2014_us_state_20m).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fid", function (d) {
                return "f" + d.id;
            })
            .attr("class", "statemap")
            .attr("fill", function (d) {
                if (VALUE[d.id] == null) {
                    return "#ececec";
                } else {
                    return color(VALUE[d.id]);
                }
            })
            .on("click", function (d) {
                dispatch.clickState(d3.select(this).attr("fid"));
            })
            .on("mouseover", function (d) {
                if (isIE != false) {
                    d3.selectAll(".hovered")
                        .classed("hovered", false);
                    d3.selectAll("[fid='" + d3.select(this).attr("fid"))
                        .classed("hovered", true)
                        .moveToFront();
                    //tooltip(this.id);
                    this.parentNode.appendChild(this);
                } else {
                    dispatch.hoverState(d3.select(this).attr("fid"));
                }
            })
            .on("mouseout", function (d) {
                dispatch.dehoverState(d3.select(this).attr("fid"));
            });
    }
}