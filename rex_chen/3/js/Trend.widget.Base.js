//set namespace
Trend.namespace('Trend.widget.Base');

//widget main constructor
Trend.widget.Base = function(){
    this.name = 'base';
    this.title = 'Default Widget';
    this.hasBtnSetting = true;
    this.hasBtnRefresh = true;
    this.hasBtnHelp = true;
    this.hasBtnClose = true;
};

//widget main method
Trend.widget.Base.prototype = {
    constructor: Trend.widget.Base,
    init: function(){
        this.render();
        this.setTitle(this.title);
    },
    render: function(){
        //render UI
        var HTML = [
            '<div class="widget '+ this.name +'">',
            '    <div class="hd clearfix">',
            '        <div class="title">title</div>',
            '        <div class="icon clearfix">',
            '            <a href="#" class="button setting"></a>',
            '            <a href="#" class="button refresh"></a>',
            '            <a href="#" class="button help"></a>',
            '            <a href="#" class="button close"></a>',
            '        </div>',
            '    </div>',
            '    <div class="bd"></div>',
            '    <div class="ft"></div>',
            '</div>'
        ].join('');
        $('#container').append(HTML);
        //alias selector
        this.boxHD = $('.'+this.name+' .hd');
        this.boxBD = $('.'+this.name+' .bd');
        //bind event
        this.boxHD.find('.setting').bind('click',this.onClickSetting);
        this.boxHD.find('.refresh').bind('click',this.onClickRefresh);
        this.boxHD.find('.help').bind('click',this.onClickHelp);
        this.boxHD.find('.close').bind('click',this.onClickClose);
        //render chart
        this.renderChart();
    },
    setTitle: function(sTitle){
        this.boxHD.find('.title').html(sTitle);
    },
    onClickSetting: function(e){
        e.preventDefault();
        alert('onClickSetting');
    },
    onClickRefresh: function(e){
        e.preventDefault();
        alert('onClickRefresh');
    },
    onClickHelp: function(e){
        e.preventDefault();
        alert('onClickHelp');
    },
    onClickClose: function(e){
        e.preventDefault();
        alert('onClickClose');
    }
};