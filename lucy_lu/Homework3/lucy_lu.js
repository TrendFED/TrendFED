var Trend={};
Trend.widget={};
Trend.widget.Lucy_Lu = {
    initWidget:function(){
        Trend.widget.Lucy_Lu.data();
        Trend.widget.Lucy_Lu.renderChart();
    },
    data:function(){
        this.swf = 'Pie3D.swf';//Pie3D.swf //Column3D.swf
        this.chart_data = [
            '<chart palette="2" caption="Unit Sales" xAxisName="Month" yAxisName="Units" showValues="0" decimals="0" formatNumberScale="0" useRoundEdges="1">',
                '<set label="Jan" value="123" />',
                '<set label="Feb" value="857" />',
                '<set label="Mar" value="671" />',
                '<set label="Apr" value="494" />',
                '<set label="May" value="761" />',
                '<set label="Jun" value="960" />',
            '</chart>'
        ].join(',');       
    },
    renderChart:function(){
			this.myChart = new FusionCharts('./FusionCharts/Charts/' + this.swf, 'chart_lucy', 500, 300, '0', '0');
			this.myChart.setDataXML(this.chart_data);
			this.myChart.setTransparent(true);
			this.myChart.render(document.getElementById('lucy_lu'));        
    }
};
