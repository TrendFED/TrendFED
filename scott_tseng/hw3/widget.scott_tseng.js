Trend.widget.scott_tseng = function(id) {
	this.targetId = id;
}

Trend.widget.scott_tseng.prototype = new Trend.widget.Base();

Trend.widget.scott_tseng.prototype.renderChart = function() {
	// generate title
	var title = document.createElement("span");
	title.textContent = this.title;
	
	// generate buttons
	var chart = this;
	var btnSettings = document.createElement("img");
	btnSettings.className = "widget-scott_tseng-sprite-1";
	btnSettings.addEventListener("click", function(e) {
		chart.onClickSetting();
	});
	
	var btnRefresh = document.createElement("img");
	btnRefresh.className = "widget-scott_tseng-sprite-2";
	btnRefresh.addEventListener("click", function(e) {
		chart.onClickRefresh();
	});
	
	var btnHelp = document.createElement("img");
	btnHelp.className = "widget-scott_tseng-sprite-3";
	btnHelp.addEventListener("click", function(e) {
		chart.onClickHelp();
	});
	
	var btnClose = document.createElement("img");
	btnClose.className = "widget-scott_tseng-sprite-4";
	btnClose.addEventListener("click", function(e) {
		chart.onClickClose();
	});
	
	// buttons are grouped together
	var titleBtns = document.createElement("span");
	titleBtns.className = "widget-scott_tseng-btn-container";
	titleBtns.appendChild(btnSettings);
	titleBtns.appendChild(btnRefresh);
	titleBtns.appendChild(btnHelp);
	titleBtns.appendChild(btnClose);
	
	var titleBar = document.createElement("div");
	titleBar.className = "widget-scott_tseng-chart-title";
	titleBar.appendChild(title);
	titleBar.appendChild(titleBtns);
	
	var img = document.createElement("img");
	img.setAttribute("src", "http://chart.apis.google.com/chart?chs=300x150&cht=p3&chco=7777CC%7C76A4FB%7C3399CC%7C3366CC&chd=s:Uf9a&chdl=January%7CFebruary%7CMarch%7CApril");
	img.setAttribute("alt", "chart content");
	
	var imgBox = document.createElement("div");
	imgBox.className = "widget-scott_tseng-chart-body";
	imgBox.appendChild(img);
	
	// put the chart inside our target element
	var target = document.getElementById(this.targetId);
	target.appendChild(titleBar);
	target.appendChild(imgBox);
}
