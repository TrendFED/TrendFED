var TM = {};
TM.module = {
    Menu: function(dModule){
        var dMenu = dModule.find('.menu');
        var dPanel = dModule.find('.panel');
        var dHelp = dModule.find('.help .link');
        var dHelpPanel = dModule.find('.help_panel');
        dMenu.each(function(index){
            $(this).bind({
                mouseover: function(e){
                    dPanel.eq(index).addClass('show');
                },
                mouseout: function(e){
                    dPanel.eq(index).removeClass('show');
                }
            });
        });
        dHelp.each(function(index){
            $(this).bind({
                mouseover: function(e){
                    dHelpPanel.eq(index).addClass('show');
                },
                mouseout: function(e){
                    dHelpPanel.eq(index).removeClass('show');
                }
            });
        });
    }
};
(function(){
    var doWhileExist = function(ModuleID,objFunction){
        var dTarget = $(document.getElementById(ModuleID));
        if(dTarget){
            objFunction(dTarget);
        }                
    };
    doWhileExist('trendMenu',TM.module.Menu);
})();