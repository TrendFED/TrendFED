// set namespace
var nsTrendWidget = Trend.namespace("Trend.widget");
//Trend.namespace("Trend.widget.hanwen_chang");

// widget base constructor + attributes
nsTrendWidget.hanwen_chang = function() {
    this.data = "";
    this.renderChart = function() {
        var _container = this.boxBD,
            _imgSrc = this.data || "./images/noContent.png",
            _content;
            
        _content = $("<img></img>").attr("src", _imgSrc).appendTo(_container);
    };
};

Trend.inherit(Trend.widget.hanwen_chang, Trend.widget.Base);