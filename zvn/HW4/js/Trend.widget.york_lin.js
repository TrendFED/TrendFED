//set namespace
Trend.namespace('Trend.widget.York_lin');
Trend.widget.York_lin = function(){
    this.name = 'york';
    this.title = 'york_lin';
    this.content = 'york_content'
    //public renderChart method
    this.renderChart = function(){
        
    };
};

//inherit from base
Trend.inherit(Trend.widget.York_lin, Trend.widget.Tooltip);