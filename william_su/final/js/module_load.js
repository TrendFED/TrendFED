Trend.namespace('Trend.final');
Trend.final.module = {
    Pager: function(dTarget){
        var objPager = new Trend.ui.Pager(dTarget);
        objPager.init();
    }
};
(function(){
    var doWhileExist = function(moduleID, objFunctionCallbackIfModuleIDExist){
        var dTarget = $(document.getElementById(moduleID));
        if(dTarget){
            objFunctionCallbackIfModuleIDExist(dTarget);
        }
    };
    doWhileExist('pager',Trend.final.module.Pager);
})();
