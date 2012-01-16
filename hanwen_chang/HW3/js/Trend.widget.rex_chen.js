//set namespace
Trend.namespace('Trend.widget.rex_chen');

//widget main function
Trend.widget.rex_chen = function(){
    //public properties
    this.name = 'rex_chen';
    this.title = 'Rex Chen';
    //charting data
    this.data = {
        chart: {
            renderTo: this.name+'_chart'
        },
        title: {
            text: 'Combination chart'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
        },
        tooltip: {
            formatter: function() {
                var s;
                if (this.point.name) { // the pie chart
                    s = ''+
                        this.point.name +': '+ this.y +' fruits';
                } else {
                    s = ''+
                        this.x  +': '+ this.y;
                }
                return s;
            }
        },
        labels: {
            items: [{
                html: 'Total fruit consumption',
                style: {
                    left: '40px',
                    top: '8px',
                    color: 'black'				
                }
            }]
        },
        series: [{
            type: 'column',
            name: 'Jane',
            data: [3, 2, 1, 3, 4]
        }, {
            type: 'column',
            name: 'John',
            data: [2, 3, 5, 7, 6]
        }, {
            type: 'column',
            name: 'Joe',
            data: [4, 3, 3, 9, 0]
        }, {
            type: 'spline',
            name: 'Average',
            data: [3, 2.67, 3, 6.33, 3.33]
        }, {
            type: 'pie',
            name: 'Total consumption',
            data: [{
                name: 'Jane',
                y: 13,
                color: '#4572A7' // Jane's color
            }, {
                name: 'John',
                y: 23,
                color: '#AA4643' // John's color
            }, {
                name: 'Joe',
                y: 19,
                color: '#89A54E' // Joe's color
            }],
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    };
    //public renderChart method
    this.renderChart = function(){
        //create chart element
        this.boxBD.append('<div class="chart" id="'+this.name+'_chart"></div>');
        var chartElement = this.boxBD.find('.chart');
        
        //set chart element width and height
        chartElement.css({
            'width': chartElement.width(),
            'height': Math.floor(chartElement.width()/2)
        });
        
        //use Highcharts
        var chart = new Highcharts.Chart(this.data);
    };
};

//inherit from base
Trend.inherit(Trend.widget.rex_chen, Trend.widget.Base);