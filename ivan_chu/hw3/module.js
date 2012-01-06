var Trend = Trend || {};
Trend.widget = Trend.widget || {};
Trend.widget.Ivan_Chu = (function(){
    var widget = {
        //extend from Trend.widget.Base
        base : {
            name : "TrendFed Howework 3",
            title : "TrendFed Howework 3",
            hasBtnSetting : true,
            hasBtnRefresh : true,
            hasBtnHelp : true,
            hasBtnClose : true,
            onClickSetting : function(){
                alert('onClickSetting');
            },
            onClickRefresh : function(){
                alert('onClickRefresh');
            },
            onClickHelp : function(){
                alert('onClickHelp');
            },
            onClickClose : function(){
                alert('onClickClose');
            },
            init : function(){
            },
            render : function(){
            }
        },
        swf : "Column2D.swf",
        dTarget : new Object(),
        dContent : new Object(),
        width : "300px",
        midWidth : "286px"
    };
    // private method
    var init = function(){
        widget.dTarget.empty();
        widget.width = widget.dTarget.width();
        widget.midWidth = (parseInt(widget.width,10) - 7*2)+"px";
        render();
    };
    var genChart = function(){
        var chart_data = '<?xml version="1.0" encoding="UTF-8"?><chart showZeroPies="1" showLegend="1" useEllipsesWhenOverflow="0" labelDisplay="WRAP" manageLabelOverflow="1" use3DLighting="0" plotFillAlpha="100" plotBorderAlpha="100" showPlotBorder="1" bgColor="ffffff" showBorder="0"><set label="Online" value="10"/><set label="Offline" value="20"/><set label="Roaming" value="30"/></chart>';
        this.myChart = new FusionCharts('./FusionCharts/Charts/' + widget.swf, 'chart_id', widget.dContent.width(), widget.dContent.height() , '0', '0');
        this.myChart.setDataXML(chart_data);
        this.myChart.setTransparent(true);
        myChart.render(widget.dContent[0]);
    };
    var genControlBtn = function(){
        var $controlbtn = $('<div/>').addClass('control_btn');
        var $icon_edit = $('<div/>').addClass('icons icon_edit');
        var $icon_refresh = $('<div/>').addClass('icons icon_refresh');
        var $icon_help = $('<div/>').addClass('icons icon_help');
        var $icon_close = $('<div/>').addClass('icons icon_close');
        $icon_edit.bind('click' , widget.base.onClickSetting);
        $icon_refresh.bind('click' , widget.base.onClickRefresh);
        $icon_help.bind('click' , widget.base.onClickHelp);
        $icon_close.bind('click' , widget.base.onClickClose);
        if(widget.base.hasBtnSetting)
             $controlbtn.append($icon_edit);
        if(widget.base.hasBtnRefresh)
             $controlbtn.append($icon_refresh);
        if(widget.base.hasBtnHelp)
             $controlbtn.append($icon_help);
        if(widget.base.hasBtnClose)
             $controlbtn.append($icon_close);
        return $controlbtn;
    };
    var genHead = function(){
        var $container = $('<div/>').addClass('hd');
        var $containerLeft = $('<div/>').addClass('topleft');
        var $containerMid = $('<div/>').addClass('topmid').width(widget.midWidth)
        var $title = $('<div/>').addClass('title').text(widget.base.title);
        $controlbtn = genControlBtn();
        $containerMid.append($title,$controlbtn);
        var $containerRight = $('<div/>').addClass('topright');
        $container.append($containerLeft,$containerMid,$containerRight);
        return $container;
    };
    var genBody = function(){
        var $container = $('<div/>').addClass('bd clear');
        var $containerLeft = $('<div/>').addClass('bodyleft');
        var $containerMid = $('<div/>').addClass('bodymid').width(widget.midWidth);
        widget.dContent = $containerMid;
        var $containerRight = $('<div/>').addClass('bodyright');
        $container.append($containerLeft,$containerMid,$containerRight);
        return $container;
    };
    var genFoot = function(){
        var $container = $('<div/>').addClass('ft clear');
        var $containerLeft = $('<div/>').addClass('footleft');
        var $containerMid = $('<div/>').addClass('footmid').width(widget.midWidth);
        var $containerRight = $('<div/>').addClass('footright');
        $container.append($containerLeft,$containerMid,$containerRight);
        return $container;
    };
    var render = function(){
        var dhead = genHead();
        var dbody = genBody();
        var dfoot = genFoot();
        widget.dTarget.append(dhead,dbody,dfoot);
        genChart();
    };
    return {
        renderChar : function(dTarget , options){
            widget.dTarget = dTarget;
            widget.base = $.extend( widget.base , options);
            init();
            
            $(window).resize(function() {
                init();
            });
        }
    }
}());
