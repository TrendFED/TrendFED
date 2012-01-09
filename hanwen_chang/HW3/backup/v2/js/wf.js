// set namespace
var nsWidgetFramework = Trend.namespace("Trend.widgetFramework");

nsWidgetFramework.module = {
    "dashboard": function() {
        var widget = new Trend.widget.hanwen_chang();
        widget.init();
    }
};
(function() {
    var doWhileExist = function(moduleId, objFunction) {
        var dTarget = $(document.getElementById(moduleId));
        if (dTarget) {
            objFunction(dTarget);
        }
    };
    doWhileExist("container", nsWidgetFramework.module.dashboard);
})();