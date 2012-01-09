var Trend = Trend || {};
Trend.widget = Trend.widget || {};
Trend.widget.Base = function(options) {
    var _options = options || {};
    this.name = _options.name || "";
    this.title = _options.title || "";
    this.hasBtnSetting = _options.hasBtnSetting || true;
    this.hasBtnRefresh = _options.hasBtnRefresh || true;
    this.hasBtnHelp = _options.hasBtnHelp || true;
    this.hasBtnClose = _options.hasBtnClose || true;
};

Trend.widget.Base.prototype.init = function() {
};
Trend.widget.Base.prototype.render = function() {
    var _content;
    if (this.renderChart) {
        _content = this.renderChart();
    }
    if (this.dTarget) {
        this.dTarget.innerHTML = _content;
    }
};
Trend.widget.Base.prototype.setTitle = function(titleStr) {
    this.title = titleStr;
    return true;
};
Trend.widget.Base.prototype.onClickSetting = function() {
    alert("Setting Button Clicked");
};
Trend.widget.Base.prototype.onClickRefresh = function() {
    alert("Refresh Button Clicked");
};
Trend.widget.Base.prototype.onClickHelp = function() {
    alert("Help Button Clicked");
};
Trend.widget.Base.prototype.onClickClose = function() {
    alert("Close Button Clicked");
};