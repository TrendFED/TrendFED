Trend.namespace('Trend.widget');
Trend.widget.module = {
    Dashboard: function(){
        var widget = new Trend.widget.York_lin();
        widget.init();
        
    }
};
(function(){
    var doWhileExist = function(ModuleID,objFunction){
        var dTarget = $('.Tooltip');
        if(dTarget){
            objFunction(dTarget);
        }                
    };
    doWhileExist('Tooltip',Trend.widget.module.Dashboard);
})();