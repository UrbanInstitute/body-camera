function gridmap() {

    outcomeSelect = d3.select("#statbtns .active").attr("value")
    catSelect = d3.select("#cat-select").property("value");

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    data = data_main.filter(function (d) {
        return d.cat == catSelect & d.level == outcomeSelect & d.isstate == 1 & d.fips != 0;
    })

    var rect = d3.selectAll("rect")
        .data(data)
        .enter().append("rect")

    var rects = d3.selectAll("rect")
        .data(data, function (d) {
            return d.fips;
        })
        .attr("fid", function (d) {
            return "f" + d.fips;
        })
        //.attr("class", "stategrid")
        .attr("fill", function (d) {
            if (d[yearSelect] == "") {
                return "#ececec";
            } else {
                return color(d[yearSelect]);
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


function legend() {

    var margin = {
        top: 10,
        right: 15,
        bottom: 5,
        left: 15
    };

    var width = 80 - margin.left - margin.right,
        height = 130 - margin.top - margin.bottom;

    var svg = d3.select("#legend").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var lp_h = 20,
        ls_w = 30,
        ls_h = 20;

    var legend = svg.selectAll("g.legend")
        .data(COLORS)
        .enter().append("g")
        .attr("class", "legend");

    //homicide map uses buckets of 1 - label side of bucket. Others - label breakpoints
    legend.append("text")
        .data(BREAKS)
        .attr("x", ls_w + 5)
        .attr("y", function (d, i) {
            return i * ls_h + lp_h + 3;
        })
        .text(function (d, i) {
            return FORMATTER(d);
        });

    legend.append("rect")
        .data(COLORS)
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * ls_h;
        })
        .attr("width", ls_w)
        .attr("height", lp_h)
        .style("fill", function (d, i) {
            return COLORS[i];
        })
}