var Trend = Trend || {};

Trend = {
    "namespace": function(nsString) {
        var parts = nsString.split("."),
            parent = Trend;
        // strip redundant leading global
        if (parts[0] === 'Trend'){
            parts = parts.slice(1);
        };
        
        for (var i = 0, len = parts.length; i < len; i = i + 1) {
            // create a property if it doesn't exist
            if (typeof parent[parts[i]] === 'undefined') {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    },
    /*
    "object": function(o) {
        function F(){};
        F.prototype = o;
        return new F();
    },
    */
    "inherit": function(Child, Parent){
        Child.prototype = new Parent();
        //var prototype = Trend.object(Parent.prototype);
        //prototype.constructor = Child;
        //Child.prototype = prototype;
    }
};