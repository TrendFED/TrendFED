Trend.widget.Parent=function(){};
Trend.widget.Child=function(){};
Trend.widget.Lucy_Lu = {
    name:'lucy_sample',
    title:'Lucy Sample',    
    inherit:function(Child,Parent){
        Child.prototype = Parent;
    },
    initWidget:function(){
        Trend.widget.Lucy_Lu.inherit(Trend.widget.Lucy_Lu,Trend.widget.Base);
        Trend.widget.Lucy_Lu.data();
        Trend.widget.Lucy_Lu.renderChart();
    },
    data:function(){
        this.swf = 'Pie3D.swf';
        this.chart_data = [
            '<chart palette="2" caption="Unit Sales" xAxisName="Month" yAxisName="Units" showValues="0" decimals="0" formatNumberScale="0" useRoundEdges="1">',
                '<set label="Jan" value="123" />',
                '<set label="Feb" value="857" />',
                '<set label="Mar" value="671" />',
                '<set label="Apr" value="494" />',
                '<set label="May" value="761" />',
                '<set label="Jun" value="960" />',
            '</chart>'
        ].join(',');       
    },
    renderChart:function(){
        //render widget
        var widgetHtml = [
              '<table>',
              '    <thead class="hd">',
              '        <tr>',
              '            <th class="left"></th>',
              '            <th class="mid">'+Trend.widget.Base.setTitle(this.title),
              '                <span class="icon">',
              '                    <a href="#" class="btn_setting">',
               '                   <a href="#" class="btn_refresh">',
              '                    <a href="#" class="btn_help">',
              '                    <a href="#" class="btn_close">',             
              '                </span>',
              '            </th>',
              '            <th class="right"></th>',             
              '        </tr>',
              '    </thead>',
              '    <tbody class="bd">',
              '        <tr>',
              '            <td class="left"></td>',
              '            <td class="mid" ><div class="lucy_chart"></div></td>',
              '            <td class="right"></td>',                 
              '        <tr>',              
              '    </tbody>',
              '    <tfoot class="ft">',
              '        <tr>',
              '            <td class="left"></td>',
              '            <td class="mid"></td>',
              '            <td class="right"></td>',                 
              '        <tr>', 
              '    </tfoot>',
              '</table>'              
              ].join(''); 
  
        var widgetContent = document.getElementById('lucy_lu');
        widgetContent.innerHTML = widgetHtml;
        var tbody = widgetContent.getElementsByTagName('tbody')[0];
        var lucyChart = tbody.getElementsByTagName('div')[0];
        
        //render chart
        this.myChart = new FusionCharts('./lib/FusionCharts/Charts/' + this.swf, 'chart_lucy', 500, 250, '0', '0');
        this.myChart.setDataXML(this.chart_data);
        this.myChart.setTransparent(true);
        this.myChart.render(lucyChart);   

        //bind event
        this.addHandler(widgetContent.getElementsByTagName('a')[0],'click',this.onClickSetting);
        this.addHandler(widgetContent.getElementsByTagName('a')[1],'click',this.onClickRefresh);
        this.addHandler(widgetContent.getElementsByTagName('a')[2],'click',this.onClickHelp);
        this.addHandler(widgetContent.getElementsByTagName('a')[3],'click',this.onClickClose);                   
    },
    addHandler:function(element, type, handler){
        if(element.addEventListener){
            element.addEventListener(type, handler, false);
        }else if(element.attachment){
            element.attachment("on"+type, handler);
        }else{
            element["on"+type] = handler;
        }
    },
    onClickSetting:function(e){
        if(e){
            e.preventDefault();
        }
        console.log('edit');
    },
    onClickRefresh:function(e){
        if(e){
            e.preventDefault();    
        }
        console.log('refresh');       
    },onClickHelp:function(e){
        if(e){
            e.preventDefault();    
        }
        console.log('help');    
    },onClickClose:function(e){
        if(e){
            e.preventDefault();    
        }
        console.log('close');    
    }    
};
