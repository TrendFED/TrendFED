/******************************************************************************
 * Common Functions
 ******************************************************************************/

function breadcrumbs(settings) {
    if ( ! (is_array(settings.names) && is_array(settings.urls) && settings.names.length === settings.urls.length))
        return "";

    var arr = new Array(settings.names.length);
    for (i in settings.urls) {
        var url = settings.urls[i];
        if (url.length > 0) {
            arr[i] = "<a href='" + url + "'>" + settings.names[i] + "</a>";
        } else {
            arr[i] = settings.names[i];
        }
    }

    var tmpl = settings.tmpl || "";
    return tmpl.replace(/%breadcrumbs%/, arr.join(' &gt; ')) || arr.join(' &gt; ');
}

function getObjectValue(obj, key) {
    var r = new RegExp(/([\w\-\.]+)\[([^\]]*)\]/);
    var val, arr;

    if ( ! obj || ! key)
        return null;

    arr = key.split('.');
    for (var i = 0; i < arr.length; i++) {
        var match = arr[i].match(r);
        if (match) {
            match[2] = trim(match[2], "\"'");
            obj = obj[match[1]] ? obj[match[1]][match[2]] : null;
        } else {
            obj = obj[arr[i]];
        }
        if ( ! isset(obj))
            break; // skip undefined or null object
    }
    return obj;
}

/**
 * gotoUrl: go to link
 * @param {string} url  page link
 */
function gotoURL(url, target) {
	if (target == undefined || target == null) {
		target = top;
	}
    target.location.href = url;
}

function gotoPrevURL() {
    if ( ! document.referrer) {
        window.history.back();
    } else {
        gotoURL(document.referrer);
    }
}

function openBrowserWindow(theURL,winName,features) { //v2.0
    if (features == undefined || features == null) {
        features = 'resizable=yes,scrollbars=yes,width=640,height=640';
    }
    window.open(theURL,winName,features);
}

/**
 * Get Page Name
 * @param {Integer} text_case   0=LowerCase, 1=UpperCase (default)
 */
function getPageName(text_case) {
    pathname = window.location.pathname;
    pagename_arr = pathname.split('/').pop().split('.');
    if (pagename_arr.length > 1) {
        pagename_arr.pop()
    }
    pagename = pagename_arr.join('.');
	return pagename.toUpperCase();
}

/**
 * Get local time zone offset
 */
function getTimeZoneOffset() {
    var d = new Date();
    var tz_offset = d.getTimezoneOffset();
    var hour = Math.abs(tz_offset / 60);
    var minute = Math.abs(tz_offset % 60);
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    tz_offset = (tz_offset < 0) ? '+' + hour + ':' + minute : '-' + hour + ':' + minute;
    return tz_offset;
}

/**
 * Get the URL parameters and parse them into a name/value pair array
 * @param {String} queryStr     (optional) a URL paramaters string, e.g., username=jackhsieh, ...
 */
function getURLParams(queryStr) {
    var args = new Object();
    var query = queryStr || location.search.substring(1);
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        args[argname] = decodeURIComponent(value.replace(/\+/g, " "));
    }
    return args;
}

function toQueryString(args) {
    var serial = [];
    for (name in args) {
        value = args[name];
        serial.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
    }
    return serial.join('&');
}

/******************************************************************************
 * Ajax Functions
 ******************************************************************************/

/**
 * http://api.jquery.com/jQuery.ajax/
 */
var $ajax_loading = 0;
function ajax(settings) {
    if ( ! isset(settings))
        return false;

    settings.async = isset(settings.async) ? settings.async : true;
    settings.type = is_string(settings.type) ? settings.type.toUpperCase() : "GET";
    settings.url = settings.url || "";
    settings.data = settings.data || {};
    settings.query = settings.query || {};
    settings.requiredLogon = isset(settings.requiredLogon) ? settings.requiredLogon : true;
    settings.processData = settings.processData || true;
    settings.timeout = settings.timeout || CONFIG.COMMON.AJAX_TIMEOUT * 1000;
    settings.contentType = settings.contentType || "application/json";
    settings.dataType = settings.dataType || "json";

    // The data will be processed and transformed into a query string for GET and DELETE requests
    if ((settings.type == "GET" || settings.type == "DELETE") && ! empty(settings.data)) {
        settings.data = { json : settings.data };
    }

    // RESTful API
    if (settings.type == "PUT" || settings.type == "DELETE") {
        settings.query["_method"] = settings.type;
        settings.type = "POST";
    }

    // To append query string to the URL
    if ( ! empty(settings.query)) {
        if (strpos(settings.url, "?") === false) {
            settings.url = settings.url + "?" + toQueryString(settings.query);
        } else {
            settings.url = settings.url + "&" + toQueryString(settings.query);
        }
    }

	$.ajax({
        async: settings.async,
		url: settings.url,
		data: settings.data,
		type: settings.type,
        processData : settings.processData,
		timeout: settings.timeout,
		contentType: settings.contentType,
		dataType: settings.dataType,
		dataFilter: function(data, type) {
			// A pre-filtering function to sanitize the response. The return value is the sanotized data.
			if (type == "json") {
			// TODO: to replace html tags
			}
			return data;
		},
		beforeSend: function(xhr) {
			if (isset(settings.content_id)) {
				$(content_id).hide();
            }
			if (isset(settings.loading_id)) {
				$(loading_id).show();
				$(loading_id+' > h3').addClass('loader');
			}
			$ajax_loading++;
			return true;
		},
		complete: function(xhr, status) {
			if (isset(settings.loading_id)) {
				$(loading_id).hide();
				$(loading_id+' > h3').removeClass('loader');
			}
			if (isset(settings.content_id)) {
				$(content_id).show();
            }
			$ajax_loading--;
		},
		success: function(data, status, xhr) {
			if (isset(settings.success)) {
                settings.success(data, xhr);
            }
		},
		error: function(xhr, status, errorThrown) {
            xhr = xhr || {};
            try {
                if (settings.requiredLogon) {
                    if (xhr.status == 401) { // Not Authorized
                        gotoURL(CONFIG.LOGON.URL);
                        return false;
                    }
                }
            }
            catch (err) {
            /**
             * The browser will throw an unknown error for HTTP request timeout.
             * The exception must be catached so that the error handling function be executed later.
             */
            }

            return isset(settings.error) ? settings.error(xhr) : false;
        }
    });
}

function ajax_loading(loading_id, content_id) {
	if ($ajax_loading > 0) {
		setTimeout("ajax_loading(\""+loading_id+"\",\""+content_id+"\");", 100);
	} else {
		if (loading_id) {
			$(loading_id).hide();
			$(loading_id+' > h3').removeClass('loader');
		}
		if (content_id) {
			$(content_id).show();
        }
	}
}

/******************************************************************************
 * PHP Equivalent Functions
 ******************************************************************************/

/**
 * The gettext helper method
 */
function _(str, vars) {
	if (isset(str) && isset(vars)) {
		for (name in vars) {
			var value = vars[name];
			str = str.replace(eval('/%' + name + '%/mgi'), value);
		}
	}

	return str;
}

/**
 * Computes the difference of arrays
 */
function array_diff() {
    var arr1 = arguments[0], retArr = {};
    var k1 = '', i = 1, k = '', arr = {};

arr1keys:
    for (k1 in arr1) {
        for (i = 1; i < arguments.length; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1]) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys; 
                }
            }
            retArr[k1] = arr1[k1];
        }
    }

    return retArr;
}

/**
 * Computes the intersection of arrays
 */
function array_intersect() {
    var arr1 = arguments[0], retArr = {};
    var k1 = '', arr = {}, i = 0, k = '';

arr1keys:
    for (k1 in arr1) {
arrs:
        for (i=1; i < arguments.length; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1]) {
                    if (i === arguments.length-1) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value, continue the loop until done
                    continue arrs;
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys;
        }
    }

    return retArr;
}

/**
 * Return all the keys or a subset of the keys of an array
 */
function array_keys(input, search_value, argStrict) {
    var tmp_arr = [], strict = !!argStrict, include = true, cnt = 0;
    var key = '';

    for (key in input) {
        include = true;
        if (search_value != undefined) {
            if (strict && input[key] !== search_value){
                include = false;
            } else if (input[key] != search_value){
                include = false;
            }
        }

        if (include) {
            tmp_arr[cnt] = key;
            cnt++;
        }
    }

    return tmp_arr;
}

/**
 * Merge one or more arrays
 */
function array_merge() {
    var args = Array.prototype.slice.call(arguments),
        retObj = {}, k, j = 0, i = 0, retArr = true;

    for (i=0; i < args.length; i++) {
        if (!(args[i] instanceof Array)) {
            retArr=false;
            break;
        }
    }
    
    if (retArr) {
        retArr = [];
        for (i=0; i < args.length; i++) {
            retArr = retArr.concat(args[i]);
        }
        return retArr;
    }
    var ct = 0;
    
    for (i=0, ct=0; i < args.length; i++) {
        if (args[i] instanceof Array) {
            for (j=0; j < args[i].length; j++) {
                retObj[ct++] = args[i][j];
            }
        } else {
            for (k in args[i]) {
                if (args[i].hasOwnProperty(k)) {
                    if (parseInt(k, 10)+'' === k) {
                        retObj[ct++] = args[i][k];
                    } else {
                        retObj[k] = args[i][k];
                    }
                }
            }
        }
    }
    return retObj;
}

/**
 * Searches the array for a given value and returns the corresponding key if successful
 */
function array_search(needle, haystack, argStrict) {
    var strict = !!argStrict;
    var key = '';

    for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            return key;
        }
    }

    return false;
}

/**
 * Removes duplicate values from an array
 */
function array_unique(inputArr) {
    var key = '', tmp_arr2 = {}, val = '';

    var __array_search = function (needle, haystack) {
        var fkey = '';
        for (fkey in haystack) {
            if (haystack.hasOwnProperty(fkey)) {
                if ((haystack[fkey] + '') === (needle + '')) {
                    return fkey;
                }
            }
        }
        return false;
    };

    for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
            val = inputArr[key];
            if (false === __array_search(val, tmp_arr2)) {
                tmp_arr2[key] = val;
            }
        }
    }

    return tmp_arr2;
}

/**
 * Return all the values of an array
 */
function array_values(input) {
    var tmp_arr = [], cnt = 0;
    var key = '';

    for ( key in input ){
        tmp_arr[cnt] = input[key];
        cnt++;
    }

    return tmp_arr;
}

function array_walk(array, funcname, userdata) {
    var key; 

    if (typeof array !== 'object' || array === null) {
        return false;
    }

    for (key in array) {
        if (typeof(userdata) !== 'undefined') {
            funcname(array[key], key, userdata);
        } else {
            funcname(array[key], key);
        }
    }

    return true;
}

/**
 * Returns trailing name component of path
 */
function basename(path, suffix) {
    var b = path.replace(/^.*[\/\\]/g, '');

    if (typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix) {
        b = b.substr(0, b.length-suffix.length);
    }

    return b;
}

/**
 * Returns parent directory's path
 */
function dirname(path) {
    return path.replace(/\\/g,'/').replace(/\/[^\/]*\/?$/, '');
}

/**
 * Determine whether a variable is empty
 */
function empty(mixed_var) {
    var key;
    
    if (mixed_var === "" ||
        mixed_var === 0 ||
        mixed_var === "0" ||
        mixed_var === null ||
        mixed_var === false ||
        typeof mixed_var === 'undefined'
    ){
        return true;
    }

    if (typeof mixed_var == 'object') {
        for (key in mixed_var) {
            return false;
        }
        return true;
    }

    return false;
}

/**
 * Split a string by string
 */
function explode(delimiter, string, limit) {
    var emptyArray = { 0: '' };

    // third argument is not required
    if ( arguments.length < 2 ||
            typeof arguments[0] == 'undefined' ||
            typeof arguments[1] == 'undefined' ) {
        return null;
    }

    if ( delimiter === '' ||
            delimiter === false ||
            delimiter === null ) {
        return false;
    }

    if ( typeof delimiter == 'function' ||
            typeof delimiter == 'object' ||
            typeof string == 'function' ||
            typeof string == 'object' ) {
        return emptyArray;
    }

    if ( delimiter === true ) {
        delimiter = '1';
    }

    if (!limit) {
        return string.toString().split(delimiter.toString());
    } else {
        // support for limit argument
        var splitted = string.toString().split(delimiter.toString());
        var partA = splitted.splice(0, limit - 1);
        var partB = splitted.join(delimiter.toString());
        partA.push(partB);
        return partA;
    }
}

/**
 * Convert special characters to HTML entities
 */
function htmlspecialchars(string, quote_style, charset, double_encode) {
    var optTemp = 0, i = 0, noquotes= false;
    if (typeof quote_style === 'undefined' || quote_style === null) {
        quote_style = 2;
    }
    string = string.toString();
    if (double_encode !== false) { // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
    }
    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE' : 1,
        'ENT_HTML_QUOTE_DOUBLE' : 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE' : 4
    };
    if (quote_style === 0) {
        noquotes = true;
    }
    if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i=0; i < quote_style.length; i++) {
            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
            if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
            }
            else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;');
    }
    if (!noquotes) {
        string = string.replace(/"/g, '&quot;');
    }

    return string;
}

/**
 * Join array elements with a string
 */
function implode(glue, pieces) {
    var i = '', retVal='', tGlue='';
    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }
    if (typeof(pieces) === 'object') {
        if (pieces instanceof Array) {
            return pieces.join(glue);
        }
        else {
            for (i in pieces) {
                retVal += tGlue + pieces[i];
                tGlue = glue;
            }
            return retVal;
        }
    }
    else {
        return pieces;
    }
}

/**
 * Checks if a value exists in an array
 */
function in_array(needle, haystack, argStrict) {
    var key = '', strict = !!argStrict;

    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Determine if a variable is set and is not NULL
 */
function isset(mixed_var) {
    return (mixed_var != null) && (mixed_var != undefined);
}

/**
 * Returns true if variable is an integer
 */
function is_int(mixed_var) {
	if (typeof mixed_var !== 'number') {
		return false;
    }
 
    return !(mixed_var % 1);
}

/**
 * Returns true if variable is a Unicode or binary string
 */
function is_string(mixed_var) {
    return (typeof(mixed_var) == 'string');
}

/**
 * Finds whether a variable is an array
 */
function is_array(mixed_var) {
    return typeof(mixed_var) == "object" && (mixed_var instanceof Array);
}

function in_range(needle, min, max) {
    return needle >= min && needle <= max;
}

function is_ascii(str) {
	for (var i = 0; i < str.length; i++) {
		var ch = str.charCodeAt(i);
		if (ch > 127) {
			return false;
		}
	}

	return true;
}

/**
 * Parse a URL and return its components
 */
function parse_url(str, component) {
    var o = {
        strictMode: false,
        key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
        q:   {
            name:   "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-protocol to catch file:/// (should restrict this)
        }
    };

    var m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
    uri = {},
    i   = 14;
    while (i--) uri[o.key[i]] = m[i] || "";
    // Uncomment the following to use the original more detailed (non-PHP) script
    /*
        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
        });
        return uri;
    */

    switch (component) {
        case 'URL_SCHEME':
            return uri.protocol;
        case 'URL_HOST':
            return uri.host;
        case 'URL_PORT':
            return uri.port;
        case 'URL_USER':
            return uri.user;
        case 'URL_PASS':
            return uri.password;
        case 'URL_PATH':
            return uri.path;
        case 'URL_QUERY':
            return uri.query;
        case 'URL_FRAGMENT':
            return uri.anchor;
        default:
            var retArr = {};
            if (uri.protocol !== '') retArr.scheme=uri.protocol;
            if (uri.host !== '') retArr.host=uri.host;
            if (uri.port !== '') retArr.port=uri.port;
            if (uri.user !== '') retArr.user=uri.user;
            if (uri.password !== '') retArr.pass=uri.password;
            if (uri.path !== '') retArr.path=uri.path;
            if (uri.query !== '') retArr.query=uri.query;
            if (uri.anchor !== '') retArr.fragment=uri.anchor;
            return retArr;
    }
}

/**
 * Binary safe case-insensitive string comparison
 */
function strcasecmp(s1, s2)
{
	s1 = (s1 + '').toLowerCase();
	s2 = (s2 + '').toLowerCase();

	if(s1 > s2)
	{
		return 1;
	}
	else if (s1 == s2)
	{
		return 0;
	}

	return -1;
}

/**
 * Strip HTML and PHP tags from a string
 */
function strip_tags(input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    var str = input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
    return str;
}

/**
 * Find position of first occurrence of a string
 */
function strpos(haystack, needle, offset) {
    var i = (haystack+'').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}

/**
 * Find position of first occurrence of a case-insensitive string
 */
function stripos(f_haystack, f_needle, f_offset) {
    var haystack = (f_haystack+'').toLowerCase();
    var needle = (f_needle+'').toLowerCase();
    var index = 0;

    if ((index = haystack.indexOf(needle, f_offset)) !== -1) {
        return index;
    }
    return false;
}

/**
 * Replace all occurrences of the search string with the replacement string
 */
function str_replace(search, replace, subject, count) {
    var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = r instanceof Array, sa = s instanceof Array;
    s = [].concat(s);
    if (count) {
        this.window[count] = 0;
    }

    for (i=0, sl=s.length; i < sl; i++) {
        if (s[i] === '') {
            continue;
        }
        for (j=0, fl=f.length; j < fl; j++) {
            temp = s[i]+'';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp).split(f[j]).join(repl);
            if (count && s[i] !== temp) {
                this.window[count] += (temp.length-s[i].length)/f[j].length;}
        }
    }
    return sa ? s : s[0];
}

/**
 * Strip whitespace (or other characters) from the beginning and end of a string
 */
function trim(str, charlist) {
    var whitespace, l = 0, i = 0;
    str += '';

    if (!charlist) {
        // default list
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

/**
 * Uppercase the first character of each word in a string
 */
function ucwords(str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
        return $1.toUpperCase();
    });
}

/******************************************************************************
 * Data Validation Functions
 ******************************************************************************/

function checkEmailFormat(email) {
    var re = /^[0-9a-zA-Z]+[0-9a-zA-Z\_\.\-]*@[0-9a-zA-Z]+[0-9a-zA-Z\.\-]+[0-9a-zA-Z]+$/;
//	var re = /^[0-9a-zA-Z@._\-]+$/;
//	var re = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (re.test(email)) {
        return true;
	}
    return false;
}

function checkAccountFormat(account) {
//      var re = /^[0-9a-zA-Z]+[0-9a-zA-Z\_\.\-]*@[0-9a-zA-Z]+[0-9a-zA-Z\.\-]+[0-9a-zA-Z]+$/;
    var re = /^[a-z_]+$/;
//	var re = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (re.test(account)) {
        return true;
	}
    return false;
}

function checkDateTimeFormat(datetime) {
    try {
        var dtTemp = new Date(datetime);
        return true;
    } catch (e) {
        return false;
    }
}

function inet_aton(ip) {
	var arr = ip.split('.');
	with (Math) {
		iplong = arr[0]*pow(256,3)+arr[1]*pow(256,2)+arr[2]*pow(256,1)+arr[3]*pow(256,0);
	}
	return iplong;
}

function compareIPAddress(from_ip, to_ip) {
	var ip_f = inet_aton(from_ip);
	var ip_t = inet_aton(to_ip);
	if (ip_f == ip_t) {
		return 0;
	}
	return ip_f > ip_t ? 1 : -1;
}

function checkIPAddressFormat(IPAddress) {
	var re = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
	if (re.test(IPAddress)) {
		re.exec(IPAddress);
		if ((RegExp.$1 >= 1) && (RegExp.$1 <= 255) && (RegExp.$2 >= 0) && (RegExp.$2 <= 255) && (RegExp.$3 >= 0) && (RegExp.$3 <= 255) && (RegExp.$4 >= 0) && (RegExp.$4 <= 255) && (IPAddress != "255.255.255.255")) {
			return true;
		}
	}
	return false;
}

function checkNumber(num) {
    var re = /^(0|[1-9][0-9]*)$/;
    if (re.test(num)) {
        return true;
	}
    return false;
}

function checkPort(port) {
	if (!checkNumber(port)) {
		return false;
	}
	p = parseInt(port);
	if (p >= 1 && p <= 65535) {
		return true;
	}
    return false;
}

function checkNumberRange(num, min, max) {
    if (min > max) {
		var temp = min;
		min = max;
		max = temp;
	}
	if (checkNumber(num) && num <= max && num >= min) {
		return true;
	}
	return false;
}

// i.e., c:\; c:\temp\ExcludeDir; c:\temp\ExcludeDir\
function checkDirectoryPathFormat(dirPath) {
	var i;
	var path;
	var path_list;
	var re1 = /^[A-Za-z]:\\(.*)$/;
	var re2 = /^[^"*\/:?|<>\\.\x00-\x20]([^"*\/:?|<>\\\x00-\x1F]*[^"*\/:?|<>\\.\x00-\x20])?$/;

	if (re1.test(dirPath)) {
		path = dirPath.replace(re1, "$1");
		path_list = path.split("\\");
		for ( i=0; i<path_list.length; i++ ){
			if ( path_list[i] && !re2.test(path_list[i]) ){
				return false;
			}
		}
		if ( i == path_list.length ){
			return true;
		}
	}
	return false;
}

// i.e., ExcludeDoc.hlp; c:\temp\excldir\ExcludeDoc.hlp
function checkFileNameFormat(fileName) {
	var re = /^[^"*\/:?|<>\x00-\x20][^"*\/:?|<>\\.\x00-\x1F]*(\.[^"*\/:?|<>\\.\x00-\x1F]{1,6})?$/;
	if (checkDirectoryPathFormat(fileName)) {
		var bname = basename(fileName);
		return re.test(bname);
	}else{
		return re.test(fileName);
	}
}

function checkDuplicatedItem(inputString, $selectElem) {
	var count = 0;
	$selectElem.children('option').each(function() {
		if (($(this).val()).toLowerCase() == inputString.toLowerCase()) {
			count ++;
		}
	});
	if (count == 0) {
		return true;
	}
	return false;
}

function checkEntryLimit(entryType, $entryElem, maxEntries) {
	var type = entryType.toLowerCase();
	if (type == 'select') {
		var count = $entryElem.children('option').length;
		if (count > maxEntries) {
			return false;
		}
	} else if (type == 'array') {
		var count = ($entryElem.split(',')).length;
		if (count > maxEntries) {
			return false;
		}
	}
	return true;
}

// i.e., C:\Program Files\MSN Messenger\MSVS.exe; \\tw-test\test.exe; //tw-test/test.exe; 
function checkFullFilePathFormat(fullFilePath) {
	var re = /([a-zA-Z]:\\[^\/:\*\?<>\|]+\.\w{2,6})|(\\{2}[^\/:\*\?<>\|]+\.\w{2,6})|(\/{2}[^\\:\*\?<>\|]+\.\w{2,6})/;
//	var re = /^([a-zA-Z]:)(\\(\w[\w ]*.*))+\.\w{2,6}$/;
	if (re.test(fullFilePath)) {
		return true;
	}
	return false;
}

// i.e.,, TXT; html
function checkExtensionFormat(extensionName) {	// without a prifix dot(.)
	var re = /^[^"*\/:?|<>\\.\x00-\x20]{1,6}$/;
	if (re.test(extensionName) && isASCII(extensionName)) {
		return true;
	}
	return false;
}

// Only allow 4 to 20 alphanumeric characters
function checkAgentUninstallPassword(password) {
    var re = /^[a-zA-Z0-9]{4,20}$/;
	$('span[name="' + name + '.err_msg"]').empty();
    if (re.test(password))
    {
        return true;
    }
    return false;
}

// Strip HTML Tage function
function stripHTML( html )
{
  // Replace the tag
  var html = html.replace(/<.*?>/g, '');
  return html;
};

/******************************************************************************
 * Javascript Extended Functions
 ******************************************************************************/

Date.prototype.parseISO8601 = function(s) {
    var regexp = /((\d\d\d\d)(-)?(\d\d)(-)?(\d\d))?(T)?((\d\d)((:)?(\d\d)((:)?(\d\d)(\.\d+)?)?)?(Z|([+-])(\d\d)((:)?(\d\d))?))?/;

    var d = s.toString().match(new RegExp(regexp));
    if (d) {
        this.setUTCDate(1);
        this.setUTCFullYear(d[2] ? parseInt(d[2],10) : 0);
        this.setUTCMonth(d[4] ? parseInt(d[4],10) - 1 : 0);
        this.setUTCDate(d[6] ? parseInt(d[6],10) : 0);
        this.setUTCHours(d[9] ? parseInt(d[9],10) : 0);
        this.setUTCMinutes(d[12] ? parseInt(d[12],10) : 0);
        this.setUTCSeconds(d[15] ? parseInt(d[15],10) : 0);
        this.setUTCMilliseconds(d[16] ? parseFloat(d[16]) * 1000 : 0);
        if (d[15] != 'Z') {
            var sign = d[18];
            var min = d[19] ? parseInt(d[19],10) : 0;
            var sec = d[22] ? parseInt(d[22],10) : 0;
            var offset = (min * 60) + sec;
            offset *= ((sign == '-') ? -1 : 1);
            this.setTime(this.getTime() - offset * 60 * 1000);
        }
    } else {
        var t = Date.parse(s);
        if (isNaN(t))
            return t;
        this.setTime(t);
    }

    return this;
}

