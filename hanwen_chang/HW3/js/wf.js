Trend.namespace('Trend.widgetframework');
Trend.widgetframework.module = {
    Dashboard: function(){
        var widget = new Trend.widget.rex_chen();
        var widget2 = new Trend.widget.hanwen_chang();
        widget.init();
        widget2.init();
        widget2.setTitle("Hanwen's widget");
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