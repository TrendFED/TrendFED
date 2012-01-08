var Trend = {};
Trend.widget = {};
Trend.widget.Base = function()  { 
		this.name = '';
		this.title = '';
		this.hasBtnSetting = true;
		this.hasBtnRefresh = true;
		this.hasBtnHelp = true;
		this.hasBtnClose = true;
};
Trend.widget.Base.prototype = {
		init:			function(){},
		render:			function(){},
		setTitle:		function(String){this.title = String;return true;},
		onClickSetting:	function(){alert('setting')},
		onClickRefresh:	function(){alert('refresh')},
		onClickHelp:	function(){alert('help')},
		onClickClose:	function(){alert('close')},
		shout:			function(){alert('ha');}
};
Trend.widget.York = function(){
	Trend.widget.Base.call(this);
};
Trend.widget.York.prototype = new Trend.widget.Base();
Trend.widget.York.prototype.init = (
	function()
	{
		if(this.data)
		{
			
			this.title = this.data.attr("title");
			this.name = this.data.attr("name");
			this.hasBtnSetting = (this.data.attr('hasBtnSetting').toLowerCase()=='true')
			this.hasBtnRefresh = (this.data.attr('hasBtnRefresh').toLowerCase()=='true')
			this.hasBtnHelp = (this.data.attr('hasBtnHelp').toLowerCase()=='true')
			this.hasBtnClose = (this.data.attr('hasBtnClose').toLowerCase()=='true')
			this.data.attr('class', 'YorkWidget');
			this.data.append(
				'<div class="YorkHeader" >'+
					'<span class="YorkText" id="Title"></span>'+
					'<span class="YorkButton" id="YorkClose"></span>'+
					'<span class="YorkButton" id="YorkHelp"></span>'+
					'<span class="YorkButton" id="YorkRefresh"></span>'+
					'<span class="YorkButton" id="YorkSetting"></span>'+
				'</div>'+
				'<div class="YorkBody">'+
				'</div>');
			var RefreshButton = this.data.find('#YorkRefresh');
			var CloseButton = this.data.find('#YorkClose');
			var HelpButton = this.data.find('#YorkHelp');
			var SettingButton = this.data.find('#YorkSetting');
			RefreshButton.bind('click', this.onClickRefresh);
			CloseButton.bind('click', this.onClickClose);
			HelpButton.bind('click', this.onClickHelp);
			SettingButton.bind('click', this.onClickSetting);
			this.renderChart();
		}
	});
Trend.widget.York.prototype.renderChart = (
	function()
	{
		var RefreshButton = this.data.find('#YorkRefresh');
		if(this.data && RefreshButton)
		{
			this.data.find('.YorkHeader .YorkText').text(this.title);
			this.data.find('.YorkHeader #YorkClose').css('visibility', ((this.hasBtnClose)? 'visible' : 'hidden'));
			this.data.find('.YorkHeader #YorkHelp').css('visibility', ((this.hasBtnHelp)? 'visible' : 'hidden'));
			this.data.find('.YorkHeader #YorkRefresh').css('visibility', ((this.hasBtnRefresh)? 'visible' : 'hidden'));
			this.data.find('.YorkHeader #YorkSetting').css('visibility', ((this.hasBtnSetting)? 'visible' : 'hidden'));
			var tmphtml = '';
			tmphtml += '<b>'+this.name+'</b><br>';
			tmphtml += '<TABLE BORDER=0 CELLSPACING=0 CELLPADDING=2 class="YorkTable"><TR bgcolor=lightgrey class="YorkTableTitle"><TH>Label</TH><TH>Value</TH><TH>%</TH></TR>';
			var tabledata = this.data.attr('data').split(';');
			var sum=0;
			for (var i=0;i<tabledata.length;i++)
			{
				sum += parseInt(tabledata[i].split(',')[1], 10);
			}
			for (var i=0;i<tabledata.length;i++)
			{
				var percent = 100.0 * parseInt(tabledata[i].split(',')[1], 10)/sum;
				tmphtml += '<tr><td>'+tabledata[i].split(',')[0]+'</td><td>'+tabledata[i].split(',')[1]+'</td><td><div style="background-color: #FF0000; height: 20px; width: '+Math.ceil(percent) * 3+'px" title="'+percent+'%"/></td></tr>';
			}
			tmphtml += '</table>';
			this.data.find('.YorkBody').html(tmphtml);
			
		}
	});
	
var oldOnload = window.onload || function () {};
window.onload = function ()
{
    oldOnload();
	var doYorkTest = function(ModuleID)
	{
        var dTarget = $(document.getElementById(ModuleID));
        if(dTarget){
			var t = new Trend.widget.York();
			t.data = dTarget;
			t.init();
        }                
    };
    doYorkTest("test");
}