//set namespace
Trend.namespace('Trend.widget.Tooltip');

//widget main constructor
Trend.widget.Tooltip = function(){
    this.name = 'base';
    this.title = 'tooltip title';
    this.content = '';
    };

//widget main method
Trend.widget.Tooltip.prototype = {
    constructor: Trend.widget.Tooltip,
    init: function(){
        this.render();
        this.setTitle(this.title);
    },
    render: function(){
        //render UI
        var HTML = [
            '<span class="widget '+this.name+'">',
            '   <a href="#">',
            '       <span class="hd">',
            this.title,
            '       </span>',
            '   </a>',
            '   <div class="bd">'+this.content+'</div>',
            '   <div class="ft"></div>',
            '</span>'
        ].join('');
        $('.Tooltip').append(HTML);
        //alias selector
        this.boxHD = $('.'+this.name+' .hd');
        this.boxBD = $('.'+this.name+' .bd');
    },
    setTitle: function(sTitle){
        this.boxHD.find('.title').html(sTitle);
    }
};