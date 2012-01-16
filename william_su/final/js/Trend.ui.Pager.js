Trend.namespace('Trend.ui.Pager');
Trend.ui.Pager = function(objPager){
    this.objPager = objPager;
    this.intPagerCurrentPage = 1; // current page of Pager
    this.intPagerTotalNum = 0; // total row num of Pager
    this.intPagerPerPage = 10; // record per page of Pager
    this.arrSelectOption = [10,20,30]; // arrSelectOption record_per_page of Pager, EX = [10,20,30]
    this.callbackRefreshPagerList = ''; //objCaller callback function to refresh Pager List
    this.init = function(){
        this.pager = this.objPager;
        this.pager.addClass('comPager');

        var strHtmlPager = [
                        '<ul>',
                        '    <li class="records">Records: <span class="pager_start_cont">1</span>&nbsp;-&nbsp;<span class="pager_end_cont">1</span> / <span class="pager_total_num">1</span> </li>',
                        '    <li class="btn btn_first disabled"></li>',
                        '    <li class="btn btn_prev disabled"></li>',
                        '    <li class="pageInput">Page&nbsp;&nbsp;<input type="text" class="pager_current_page" />&nbsp;&nbsp;/ <span class="pager_total_page">1</span></li>',
                        '    <li class="btn btn_next disabled"></li>',
                        '    <li class="btn btn_last disabled"></li>',
                        '    <li class="pager_per_page">',
                        '        <select></select>&nbsp;&nbsp;per page',
                        '    </li>',
                        '</ul>'                        
                        ].join('');
        this.pager.set('html',strHtmlPager);

        // get element to be use
        this.btn_first = this.pager.getElement('.btn_first');
        this.btn_prev = this.pager.getElement('.btn_prev');
        this.btn_last = this.pager.getElement('.btn_last');
        this.btn_next = this.pager.getElement('.btn_next');
        this.pager_current_page = this.pager.getElement('.pager_current_page');
        this.pager_per_page = this.pager.getElement('.pager_per_page select');

        // set select=pager_per_page option
        this.arrSelectOption.each(function(item,index){
            if(this.intPagerPerPage == item){
                this.pager_per_page.adopt(new Element('option',{
                    'text'  : item,
                        'value' : item,
                        'selected': 'selected'
                    }));
                }else{
                    this.pager_per_page.adopt(new Element('option',{
                        'text'  : item,
                    'value' : item
                }));
            }
        }.bind(this));

        this._refreshPager();
    };
    this._refreshPager = function(){
        // Step 1: recalculate Pager variable
        this.intPagerPerPage = this._getValidatePagerPerPage(this.intPagerPerPage);
        this.intPagerTotalPage = Math.ceil(this.intPagerTotalNum/this.intPagerPerPage);
        this.intPagerCurrentPage = this._getValidatePagerCurrentPage(this.intPagerCurrentPage);
        this.intPagerStartCont = this._getValidatePagerStartCont();
        var intPagerEndCont = this.intPagerCurrentPage * this.intPagerPerPage;
        this.intPagerEndCont = this._getValidatePagerEndCont(intPagerEndCont);

        // Step 2: set Pager variable to UI
        this.pager.getElement('.pager_start_cont').set('html',this.intPagerStartCont);
        this.pager.getElement('.pager_end_cont').set('html',this.intPagerEndCont);
        this.pager.getElement('.pager_total_num').set('html',this.intPagerTotalNum);
        this.pager.getElement('.pager_total_page').set('html',this.intPagerTotalPage);

        // Step3-1:
        // - bind button first[<<] event
        // - bind button prev[<] event
        if(this.intPagerCurrentPage > 1){
            this.btn_first.removeClass('disabled');
            if(this.btn_first.hasEvent('click') == undefined){
                this.btn_first.addEvent('click',function(){
                    this.intPagerCurrentPage = 1;
                    this._refreshPager();
                }.bind(this));
            }

            this.btn_prev.removeClass('disabled');
            if(this.btn_prev.hasEvent('click') == undefined){
                this.btn_prev.addEvent('click',function(){
                    this.intPagerCurrentPage = this.intPagerCurrentPage - 1;
                    this._refreshPager();
                }.bind(this));
            }
        }else{
            this.btn_first.addClass('disabled');
            this.btn_first.removeEvent('click');
            this.btn_prev.addClass('disabled');
            this.btn_prev.removeEvent('click');
        }

        // Step3-2:
        // - bind input textbox=pager_current_page [ ] event
        this.pager_current_page.set('value', this.intPagerCurrentPage);
        if(this.pager_current_page.hasEvent('keydown') == undefined){
            this.pager_current_page.addEvent('keydown',function(event){
                if (event.key == 'enter'){
                    //var intPagerCurrentPage = this.pager_current_page.get('value');
                    //intPagerCurrentPage = this._getValidatePagerCurrentPage(intPagerCurrentPage);
                    this.intPagerCurrentPage = this.pager_current_page.get('value');
                    this._refreshPager();
                }
            }.bind(this));
        }

        // Step3-3:
        // - bind button next[>] event
        // - bind button last[>>] event
        if(this.intPagerCurrentPage < this.intPagerTotalPage){
            this.btn_next.removeClass('disabled');
            if(this.btn_next.hasEvent('click') == undefined){
                this.btn_next.addEvent('click',function(){
                    this.intPagerCurrentPage = this.intPagerCurrentPage + 1;
                    this._refreshPager();
                }.bind(this));
            }

            this.btn_last.removeClass('disabled');
            if(this.btn_last.hasEvent('click') == undefined){
                this.btn_last.addEvent('click',function(){
                    this.intPagerCurrentPage = this.intPagerTotalPage;
                    this._refreshPager();
                }.bind(this));
            }
        }else{
            this.btn_last.addClass('disabled');
            this.btn_last.removeEvent('click');
            this.btn_next.addClass('disabled');
            this.btn_next.removeEvent('click');
        }

        // Step3-4:
        // - bind select pager_per_page event
        if(this.pager_per_page.hasEvent('change') == undefined){
            this.pager_per_page.addEvent('change',function(){
                var intPagerPerPage = this.pager_per_page.getSelected().get('value');
                this.intPagerPerPage = intPagerPerPage;
                this._refreshPager();
            }.bind(this));
        }
        // Step4: sent [intPagerCurrentPage,intPagerPerPage,intPagerStartCont,intPagerEndCont] Pager information to objCaller to refreshPagerList
        this.intPagerCurrentPage = this.intPagerCurrentPage;
        this.intPagerPerPage = this.intPagerPerPage;
        this.intPagerStartCont = this.intPagerStartCont;
        this.intPagerEndCont = this.intPagerEndCont;

        // Step5: call objCaller.refreshPagerList()
        //var callbackRefreshPagerList = 'this.objCaller.'+this.callbackRefreshPagerList+'();';
        //eval(callbackRefreshPagerList);
        if(this.callbackRefreshPagerList){
            this.callbackRefreshPagerList.apply();
        }
    };
    this._getValidatePagerCurrentPage = function(intPagerCurrentPage){
        var ret = intPagerCurrentPage;
        if(intPagerCurrentPage < 1){
            ret = 1;
        }else if(this.intPagerTotalPage > 0 && intPagerCurrentPage > this.intPagerTotalPage){
            ret = this.intPagerTotalPage;
        }else if(isNaN(intPagerCurrentPage) == true){
            ret = 1;
        }
        return parseInt(ret);
    };
    this._getValidatePagerEndCont = function(intPagerEndCont){
        var ret = intPagerEndCont;
        if(this.intPagerCurrentPage == 1 && (intPagerEndCont > this.intPagerTotalNum)){
            ret = this.intPagerTotalNum;
        }else if(this.intPagerCurrentPage == this.intPagerTotalPage && (intPagerEndCont > this.intPagerTotalNum)){
            ret = this.intPagerTotalNum;
        }
        return ret;
    };
    this._getValidatePagerPerPage = function(intPagerPerPage){
        var ret = intPagerPerPage;
        if(!intPagerPerPage){
            ret = this.arrSelectOption[0];
        }
        return ret;
    };
    this._getValidatePagerStartCont = function(){
        var ret = 0;
        if(this.intPagerTotalNum > 0){
            ret = ((this.intPagerCurrentPage-1) * this.intPagerPerPage)+1;
        }
        return ret;
    };
};