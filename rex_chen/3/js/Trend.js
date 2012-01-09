var Trend = Trend || {};
Trend = {
    version: '0.1',
    namespace: function(ns_string){
        var parts = ns_string.split('.'),
            parent = Trend,
            i;
        // strip redundant leading global
        if (parts[0] === 'Trend'){
            parts = parts.slice(1);
        }
        for (i = 0; i < parts.length; i += 1){
            // create a property if it doesn't exist
            if (typeof parent[parts[i]] === 'undefined') {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    },
    /*
    object: function(o){
        function F(){}
        F.prototype = o;
        return new F();
    },
    */
    inherit: function(Child, Parent){
        Child.prototype = new Parent();
        /*
        var prototype = Trend.object(Parent.prototype);
        prototype.constructor = Child;
        Child.prototype = prototype;
        */
    }
};