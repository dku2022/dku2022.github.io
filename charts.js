var genderChart = dc.pieChart("#gender-chart");
var provinceChart = dc.barChart("#province-chart");
var cityChart = dc.barChart("#city-chart");
var schoolChart = dc.rowChart("#school-chart");
var studentCount = dc.dataCount("#students");
var studentGrid = dc.dataGrid(".dc-data-grid");

var chartHeight = 180;
var genderSymbols = { 男: "\u2642", 女: "\u2640" };

d3.json("./students.json").then(function(studentsData) {
  var students = crossfilter(studentsData);
  var all = students.groupAll();

  var genderDimension = students.dimension(function(d) {
    return d.gender;
  });
  var genderGroup = genderDimension.group().reduceCount();
  var provinceDimension = students.dimension(function(d) {
    return d.province;
  });
  var provinceGroup = provinceDimension.group().reduceCount();
  var cityDimension = students.dimension(function(d) {
    return d.city;
  });
  var cityGroup = cityDimension.group().reduceCount();
  var schoolDimension = students.dimension(function(d) {
    return d.school;
  });
  var schoolGroup = schoolDimension.group().reduceCount();
  var studentDimension = students.dimension(function(d) {
    return d.index;
  });

  genderChart
    .width(chartHeight)
    .height(chartHeight)
    .radius(80)
    .ordinalColors(d3.schemeCategory10)
    .dimension(genderDimension)
    .group(genderGroup)
    .label(function(d) {
      return genderSymbols[d.key];
    });

  provinceChart
    .width(null)
    .height(chartHeight)
    .dimension(provinceDimension)
    .group(provinceGroup)
    .ordering(function(d) {
      return -d.value;
    })
    .ordinalColors(d3.schemeCategory10)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .elasticY(true)
    .brushOn(false)
    .barPadding(0.1)
    .outerPadding(0.05);

  cityChart
    .width(null)
    .height(chartHeight)
    .dimension(cityDimension)
    .group(cityGroup)
    .ordering(function(d) {
      return -d.value;
    })
    .ordinalColors(d3.schemeCategory10)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .elasticY(true)
    .brushOn(false)
    .barPadding(0.1)
    .outerPadding(0.05);

  schoolChart
    .width(null)
    .height(800)
    .dimension(schoolDimension)
    .group(schoolGroup)
    .ordering(function(d) {
      return -d.value;
    })
    .rowsCap(30)
    .othersGrouper(false)
    .title(function(d) {
      return d.value;
    })
    .ordinalColors(d3.schemeCategory10)
    .elasticX(true)
    .xAxis()
    .ticks(4);

  studentCount
    .dimension(students)
    .group(all)
    .html({
      some:
        "<strong>%filter-count</strong> selected out of <strong>%total-count</strong> students" +
        " | <a href='javascript:dc.filterAll(); dc.renderAll();'>Reset All</a>",
      all: "All <strong>%total-count</strong> students"
    });

  studentGrid
    .dimension(studentDimension)
    .group(function(d) {
      return d.school;
    })
    .size(300)
    .htmlGroup(function(d) {
      return (
        '<div class="dc-grid-group bg-info text-white"><span class="dc-grid-label">' +
        d.key +
        "</span> (" +
        d.values.length +
        ")</div>"
      );
    })
    .html(function(d) {
      return genderSymbols[d.gender] + " " + d.name;
    })
    .sortBy(function(d) {
      return d.name;
    })
    .order(d3.ascending);

  dc.renderAll();
});
