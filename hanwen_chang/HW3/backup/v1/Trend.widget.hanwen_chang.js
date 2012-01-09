function inheritPrototype(subType, superType) {
    var _prototype = new Object(superType.prototype); //create object
    _prototype.constructor = subType; //augment object
    subType.prototype = _prototype; //assign object
}

var Trend = Trend || {};
Trend.widget = Trend.widget || {};
Trend.widget.hanwen_chang = function(dTarget, options) {
    var _options = options || {};
    
    Trend.widget.Base.call(this, _options);
    
    this.dTarget = dTarget;
    this.data = _options.imgSrc || "";
};

inheritPrototype(Trend.widget.hanwen_chang, Trend.widget.Base);

Trend.widget.hanwen_chang.prototype.renderChart = function() {
    if (this.data) {
        return '<img src="' + this.data + '" />';
    } else {
        return '<span>No data specified.</span>';
    }
};