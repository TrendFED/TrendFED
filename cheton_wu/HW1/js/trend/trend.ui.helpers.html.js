/**
 * Trend UI Helpers - HTML
 */

var Trend = Trend || {};
Trend.UI = Trend.UI || {};
Trend.UI.Helpers = Trend.UI.Helpers || {};
Trend.UI.Helpers.HTML = Trend.UI.Helpers.HTML || {};

(function() {

Trend.UI.Helpers.HTML = function() {
    /**
     * Private methods
     */

    /**
     * Sorts a key/value array of HTML attributes, putting form attributes first,
     * and compiles an array of HTML attributes into an attribute string.
     *
     * @param   string|array  array of attributes
     * @return  string
     */
    attributes = function(attrs) {
        if (empty(attrs))
            return '';

        if (is_string(attrs))
            return ' '.attrs;

        var order = [
             'action',
             'method',
             'type',
             'id',
             'name',
             'value',
             'src',
             'size',
             'maxlength',
             'rows',
             'cols',
             'accept',
             'tabindex',
             'accesskey',
             'align',
             'alt',
             'title',
             'class',
             'style',
             'selected',
             'checked',
             'readonly',
             'disabled'
        ];

        var sorted = [];
        for (var key in order) {
            if (isset(attrs[key])) {
                // Move the attribute to the sorted array
                sorted[key] = attrs[key];
                // Remove the attribute from unsorted array
                delete attrs[key];
            }
        }

        // Combine the sorted and unsorted attributes and create an HTML string
        attrs = array_merge(sorted, attrs);

        var compiled = '';
        for (var key in attrs) {
            var val = attrs[key];
            compiled = compiled + ' ' + key + '="' + specialchars(val) + '"';
        }

        return compiled;
    }
		
    /**
     * Perform a specialchars() with additional URL specific encoding.
     *  
     * @param   string   string to convert
     * @param   boolean  encode existing entities
     * @return  string
     */
    specialurlencode = function(str, double_encode) {
        double_encode = isset(double_encode) ? double_encode : true;

        return str_replace(' ', '%20', specialchars(str, double_encode));
    }

    /**
     * Convert special characters to HTML entities
     *
     * @param   string   string to convert
     * @param   boolean  encode existing entities
     * @return  string
     */
    specialchars = function(str, double_encode) {
        double_encode = isset(double_encode) ? double_encode : true;

        if (double_encode === true) {
			    str = htmlspecialchars(str, 'ENT_QUOTES', 'UTF-8');
        } else {
            str = htmlspecialchars(str, 'ENT_QUOTES', 'UTF-8', false);
			}

        return str;
    }

    /**
     * Public methods
     */

    /**
     * Create HTML link anchors.
     *
     * @param   string  URL or URI string
     * @param   string  link text
     * @param   array   HTML anchor attributes
     * @param   boolean option to escape the title that is output
     * @return  string
     */
    this.anchor = function(uri, title, attributes, escape_title) {
        title = isset(title) ? title : '';
        attributes = isset(attributes) ? attributes : '';
        escape_title = isset(escape_title) ? escape_title : false;

        var str = '';
        // Parsed URL
        str = str + '<a href="' + specialurlencode(uri, false) + '"';
        // Attributes empty? Use an empty string
        str = str + (is_array(attributes) ? this.attributes(attributes) : '') + '>';
        // Title empty? Use the parsed URL
        str = str + (escape_title ? specialchars(title ? title : uri, false) : title ? title : uri);
        str = str + '</a>';

        return str;
    }

    /**
     * Creates an HTML form button input tag.
     *
     * @param   string|array  input name or an array of HTML attributes
     * @param   string        input value, when using a name
     * @param   string        a string to be attached to the end of the attributes
     * @return  string
     */
    this.button = function(data, value, extra) {
        data = isset(data) ? data : '';
        value = isset(value) ? value : '';
        extra = isset(extra) ? extra : '';

        if ( ! is_array(data)) {
            data = { 'name' : data };
        }

        if (empty(data['name'])) {
            // Remove the name if it is empty
            delete data['name'];
        }

        if (isset(data['value']) && empty(value)) {
            value = data['value'];
            delete data['value'];
        }

        return '<button' + attributes(data) + ' ' + extra + '>' + value + '</button>';
    }

    /**
     * Creates an HTML form select tag, or "dropdown menu".
     *
     * @param   string|array  input name or an array of HTML attributes
     * @param   array         select options, when using a name
     * @param   string|array  option key(s) that should be selected by default
     * @param   string        a string to be attached to the end of the attributes
     * @return  string
     */
    this.dropdown = function(data, options, selected, extra) {
        options = isset(options) ? options : '';
        selected = isset(selected) ? selected : '';
        extra = isset(extra) ? extra : '';

        if (is_string(data)) {
            data = {'name' : data};
        } else {
            if (isset(data['options'])) {
                // Use data options
                options = data['options'];
            }
            if (isset(data['selected'])) { 
                // Use data selected
                selected = data['selected'];
            }
        }

        if (is_array(selected)) {
            // Multi-select box
            data['multiple'] = 'multiple';
        } else {
            // Single selection (but converted to an array)
            selected = [selected];
        }

        var input = '<select' + attributes(data) + ' ' + extra + '>' + "\n";

        for (var key in options) {
            var val = options[key];

            // Key should always be a string
            key = '' + key;

            if (is_array(val)) {
                input = input + '<optgroup label="' + key + '">' + "\n";
                for (var inner_key in val) {
                    var inner_val = val[inner_key];

                    // Inner key should always be a string
                    inner_key = '' + inner_key;

                    sel = in_array(inner_key, selected) ? ' selected="selected"' : '';
                    input = input + '<option value="' + inner_key + '"' + sel + '>' + inner_val + '</option>' + "\n";
                }
                input = input + '</optgroup>' + "\n";
            }
            else
            {
                sel = in_array(key, selected) ? ' selected="selected"' : '';
                input = input + '<option value="' + key + '"' + sel + '>' + val + '</option>' + "\n";
            }
        }
        input = input + '</select>';

        return input;
    }

    /**
     * Creates an HTML form input tag. Defaults to a text type.
     *
     * @param   string|array  input name or an array of HTML attributes
     * @param   string        input value, when using a name
     * @param   string        a string to be attached to the end of the attributes
     * @return  string
     */
    this.input = function(data, value, extra) {
        value = isset(value) ? value : '';
        extra = isset(extra) ? extra : '';

        if (is_string(data)) { 
            data = {'name' : data};
        }

        // Type and value are required attributes
        data['type'] = 'text';
        data['value'] = value;

        return '<input' + attributes(data) + ' ' + extra + ' />';
    }

    /**
     * Creates an HTML form textarea tag.
     *
     * @param   string|array  input name or an array of HTML attributes
     * @param   string        input value, when using a name
     * @param   string        a string to be attached to the end of the attributes
     * @param   boolean       encode existing entities
     * @return  string
     */
    this.textarea = function(data, value, extra, double_encode) {
        value = isset(value) ? value : '';
        extra = isset(extra) ? extra : '';
        double_encode = isset(double_encode) ? double_encode : true;

        if ( ! is_array(data)) { 
            data = {'name' : data};
        }

        // Use the value from $data if possible, or use $value
        value = isset(data['value']) ? data['value'] : value;

        // Value is not part of the attributes
        delete data['value'];

        return '<textarea' + attributes(data) + ' ' + extra + '>' + specialchars(value, double_encode) + '</textarea>';
    }

    /**
     * Creates an HTML form label tag.
     *
     * @param   string|array  label "for" name or an array of HTML attributes
     * @param   string        label text or HTML
     * @param   string        a string to be attached to the end of the attributes
     * @return  string
     */
    this.label = function(data, text, extra) {
        data = isset(data) ? data : '';
        text = isset(text) ? text : '';
        extra = isset(extra) ? extra : '';

        if ( ! is_array(data)) { 
            if (is_string(data)) {
                // Specify the input this label is for
                data = {'for' : data};
            } else {
                // No input specified
                data = {};
            }
        }

        if (text === '' && isset(data['for'])) {
            // Make the text the human-readable input name
            text = ucwords(preg_replace('/[_-]+/', ' ', trim(data['for'])));
        }

        return '<label' + attributes(data) + ' ' + extra + '>' + text + '</label>';
    }

    /**
     * Set the value of each element, ex., checkbox, radio, text, hidden, select, textare
     *
     * @param   string      the element name
     * @param   string      the element value
     * @return  none
     */
    this.set_value = function(elem_name, value) {
        var elem_name = elem_name.toLowerCase();
        var type_name = $('input[name="' + elem_name + '"]').attr('type');
        type_name = (type_name != undefined) ? type_name.toUpperCase() : null;

        if (type_name == null) {
            var elem_id = $('*[name="' + elem_name + '"]').attr('id');
            var elem = document.getElementById(elem_id);
            if (elem) {
                var tag_name = elem.tagName;
                tag_name = tag_name.toUpperCase();
            }
        }
        switch (type_name || tag_name) {
            case 'CHECKBOX':
                if (value == 0) {
                    $('input:checkbox[name="' + elem_name + '"]').attr('checked', false);
                } else {
                    $('input:checkbox[name="' + elem_name + '"]').attr('checked', true);
                }
                break;
            case 'RADIO':
                $('input:radio[name="' + elem_name + '"]').each(function() {
                    $(this).removeAttr('checked');
                    if ($(this).val() == value) {
                        $(this).attr('checked', true);
                    }
                });
                break;
            case 'TEXT':
                $('input:text[name="' + elem_name + '"]').each(function() {
                    $(this).attr('value', value);
                });
                break;
            case 'HIDDEN':
                $('input:hidden[name="' + elem_name + '"]').each(function() {
                    $(this).attr('value', value);
                });
                break;
            case 'SELECT':
                $('SELECT[name="' + elem_name + '"] option').each(function(){
                    if ($(this).val() == value) {
                        $(this).attr('selected', true);
                    }
                });
                break;
            case 'TEXTAREA':
                $('TEXTAREA[name="' + elem_name + '"]').val(value);
                break;
        }
    }

    /**
     * Get the value of each element, ex., checkbox, radio, text, hidden, select, textare
     *
     * @param   string      the element nname
     * @param   boolean     1 -> all options; 0 -> selected option(s) only
     * @return  none
     */
    this.get_value = function(elem_name, all_options) {
        all_options = isset(all_options) ? all_options : false;

        var elem_name = elem_name.toLowerCase();
        var type_name = $('input[name="' + elem_name + '"]').attr('type');
        type_name = (type_name != undefined) ? type_name.toUpperCase() : null;
        if (type_name == null) {
            var elem_id = $('*[name="' + elem_name + '"]').attr('id');
            var elem = document.getElementById(elem_id);
            if (elem) {
                var tag_name = elem.tagName;
                tag_name = tag_name.toUpperCase();
            }
        }
        var val;
        switch (type_name || tag_name) {
            case 'CHECKBOX':
                var $this_checkbox = $('input:checkbox[name="' + elem_name + '"]');
                var isChecked = $this_checkbox.attr('checked');
                val = $this_checkbox.attr('checked') ? 1 : 0;
                break;
            case 'RADIO':
                var $this_radio = $('input:radio[name="' + elem_name + '"]');
                $this_radio.each(function() {
                    if ($(this).attr('checked')) {
                        val = $(this).val();
                    }
                });
                break;
            case 'TEXT':
                var $this_input = $('input:text[name="' + elem_name + '"]');
                val = $this_input.val();
                break;
            case 'HIDDEN':
                var $this_hidden = $('input:hidden[name="' + elem_name + '"]');
                val = $this_hidden.val();
                break;
            case 'SELECT':
                var $this_select = $('select[name="' + elem_name + '"]');
                if ($this_select.attr('multiple')) {	// for multiple selection
                    var $this_options;
                    if (all_options) { // retrieve all options, not only selected
                        $this_options = $this_select.children('option');
                    } else {
                        $this_options = $this_select.children('option:selected');
                    }
                    var opts_str = '';
                    var opts_len = $this_options.length;
                    $this_options.each(function(i) {
                        var $this = $(this);
                        if ($this.val()) {
                            opts_str += $this.val();
                            if (i < opts_len - 1) {
                                opts_str += '|'
                            }
                        } else if ($this.text()) {
                            opts_str += $this.text();
                            if (i < opts_len - 1) {
                                opts_str += '|'
                            }
                        }
                    });
                    // convert String to Array
                    if (opts_str != '') {
                        val = opts_str.split('|');
                    } else {
                        val = [];
                    }
                } else {	// for single selection
                    var $this_options = $this_select.children('option:selected');
                    val = $this_options.val() || $this_options.children('span').text();
                }
                break;
            case 'TEXTAREA':
                var $this_textarea = $('textarea[name="' + elem_name + '"]');
                val = $this_textarea.val();
                break;
        }
        return val;
    }

    return this;

}

})();
