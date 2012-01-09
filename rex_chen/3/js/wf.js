Trend.namespace('Trend.widgetframework');
Trend.widgetframework.module = {
    Dashboard: function(){
        var widget = new Trend.widget.rex_chen();
        widget.init();
    }
};
(function(){
    var doWhileExist = function(ModuleID,objFunction){
        var dTarget = $(document.getElementById(ModuleID));
        if(dTarget){
            objFunction(dTarget);
        }                
    };
    doWhileExist('container',Trend.widgetframework.module.Dashboard);
})();