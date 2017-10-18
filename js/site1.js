function generatingComponent(vardata){

 

  var nbDatasetsTrends = dc.compositeChart('#CompositeChart') ;
  var scale_maxDate = new Date(2017, 7, 30);
  var numberFormat = d3.format(',f');
  var dateFormat = d3.time.format("%Y-%m-%d");
  var dateFormat1 = d3.time.format("%b %Y");
  var dateFormatPretty = d3.time.format("%b %d %Y");
  var dateFormatPretty1 = d3.time.format("%Y");
      vardata.forEach(function (e) {
        e.date = dateFormat.parse(e.date);
    });

  var xScaleRange = d3.time.scale().domain([new Date(2014, 0, 1), scale_maxDate]);
  
  var cf = crossfilter(vardata);

  var all = cf.groupAll();

  var colors = ['#2C5197','#FAE61E'] ;

   var dateDimension = cf.dimension(function (d) { return d.date});

  var groupvalue3 = dateDimension.group().reduceSum(function (d){return d.value3;});
              
           
 nbDatasetsTrends

      .width(1200)

      .height(300)

      .dimension(dateDimension)

      .x(d3.time.scale().domain([new Date(2015, 10, 30), new Date(2017, 8, 30)]))

      .elasticY(false)

      .valueAccessor(function(d){return d.value.avg;})
            
      .shareTitle(false)

      .compose([

        dc.lineChart(nbDatasetsTrends).group(groupvalue3).renderArea(true).colors(colors[0]).title(function (d) { return [ dateFormat1(d.key), d.value + ' organisations'].join('\n'); }),

        ])

      .brushOn(false)
      //.renderArea(true)
      .renderHorizontalGridLines(true)
      .margins({ top: 10, left: 33, right: 0, bottom: 60 })
      .xAxis().ticks(d3.time.months,1).tickFormat(d3.time.format("%Y-%b"));


      //test
      function remove_space(groupvalue3) { 
  return {
    all: function() {
      
      return groupFoodsec.all().filter(function(d) {
        console.log(d)
        return d.key !=0;
      });
    }
  };
}

nbDatasetsTrends
      .renderlet(function (chart) {
                    chart.selectAll("g.x text")
                      .attr('dx', '-30')
                      .attr('transform', "rotate(-60)");
                });

      

  dc.dataCount('count-info')

    .dimension(cf)

    .group(all);

  
      dc.renderAll();
     

}

var dataCall = $.ajax({

    type: 'GET',

    url: 'data/data.json',

    dataType: 'json',

});

var geomCall = $.ajax({

    type: 'GET',

    url: 'data/wa.geojson',

    dataType: 'json',

});

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){

    var geom = geomArgs[0];

    geom.features.forEach(function(e){

        e.properties['NAME'] = String(e.properties['NAME']);

    });

    generatingComponent(dataArgs[0],geom);

});
