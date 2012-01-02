var Trend = Trend || {};
Trend.widget = Trend.widget || {};
Trend.widget.Base = Trend.widget.Base || function() {
	this.name = "";
	this.title = "";
	this.hasBtnSetting = true;
	this.hasBtnRefresh = true;
	this.hasBtnHelp = true;
	this.hasBtnClose = true;
};

Trend.widget.Base.prototype.init = function() {
}

Trend.widget.Base.prototype.render = function() {
	this.renderChart();
}

Trend.widget.Base.prototype.setTitle = function(title) {
	this.title = title;
}

Trend.widget.Base.prototype.onClickSetting = function() {
	alert("onClickSetting()");
}

Trend.widget.Base.prototype.onClickRefresh = function() {
	alert("onClickRefresh()");
}

Trend.widget.Base.prototype.onClickHelp = function() {
	alert("onClickHelp()");
}

Trend.widget.Base.prototype.onClickClose = function() {
	alert("onClickClose()");
}
