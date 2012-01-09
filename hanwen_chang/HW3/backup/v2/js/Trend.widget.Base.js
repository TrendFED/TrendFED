// set namespace
var nsTrendWidget = Trend.namespace("Trend.widget");
//Trend.namespace("Trend.widget.Base");

// widget base constructor + attributes
nsTrendWidget.Base = function() {
    this.name = "widgetBase";
    this.title = "Default Widget";
    this.hasBtnSetting = true;
    this.hasBtnRefresh = true;
    this.hasBtnHelp = true;
    this.hasBtnClose = true;
};

// widget base methods
nsTrendWidget.Base.prototype = {
    "constructor": nsTrendWidget.Base,
    "init": function() {
            //alert(this.name);
            this.render();
        },
    "render": function() {
            var _widgetDOM = $("<div></div>").addClass("widget").addClass(this.name),
                _widgetHDDOM = $("<div></div>").addClass("widgetHD clearfix").appendTo(_widgetDOM),
                _widgetHDTitleDOM = $("<div></div>").addClass("widgetTitle").text(this.name).appendTo(_widgetHDDOM),
                _widgetHDIconsDOM = $("<div></div>").addClass("widgetIcons clearfix").appendTo(_widgetHDDOM),
                _widgetHDSettingIconDOM = $("<a></a>").addClass("widgetIconBtn setting").appendTo(_widgetHDIconsDOM),
                _widgetHDRefreshIconDOM = $("<a></a>").addClass("widgetIconBtn refresh").appendTo(_widgetHDIconsDOM),
                _widgetHDHelpIconDOM = $("<a></a>").addClass("widgetIconBtn help").appendTo(_widgetHDIconsDOM),
                _widgetHDCloseIconDOM = $("<a></a>").addClass("widgetIconBtn close").appendTo(_widgetHDIconsDOM),
                _widgetBDDOM = $("<div></div>").addClass("widgetBD clearfix").appendTo(_widgetDOM),
                _widgetFTDOM = $("<div></div>").addClass("widgetFT clearfix").appendTo(_widgetDOM);                
            var _widgetBDContent = "";
            
            if (this.renderChart) {
                _widgetBDContent = this.renderChart();
            }
            _widgetBDDOM.append(_widgetBDContent);
            
            $("#container").append(_widgetDOM);
        },
    "setTitle": function(titleStr) {
            this.title = titleStr;
            return true;
        },
    "onClickSetting": function() {
            alert("Setting button clicked");
        },
    "onClickRefresh": function() {
            alert("Refresh button clicked");
        },
    "onClickHelp": function() {
            alert("Help button clicked");
        },
    "onClickClose": function() {
            alert("Close button clicked");
        }
};