/**
 * @license MIT
 * @author BlueMöhre <bluemoehre@gmx.de>
 * @copyright 2014 BlueMöhre
 * @link http://www.github.com/bluemoehre
 */
(function ($, win, doc) {

    'use strict';

    // --- Plugin scope (shared between all plugin instances) ---

    /*
        Define the plugin's name here!
        The name is used to find elements via data-attribute selector which are using this plugin (e.g. data-foobar="")
        It MUST be unique in your jQuery-Scope!
    */
    /**
     * The plugin name and data-attribute name/selector
     * @type {string}
     */
    var PLUGIN_NAME = 'foobar';

    /*
        Define the plugin defaults here!
        I like to make everything configurable.
        Also i like this kind of naming to make the usage very clear:
        - selectElement: '.mySelector' (pass a selector or an element/jQuery)
        - tplElement: '<div>__text__</div>' (pass a string or an element/jQuery)
        - classLoading: 'loading' (when you are changing classes somewhere)
        - callbackFinished: $.noop (allow to configure a callback somewhere)
    */
    /**
     * The plugin defaults
     * @type {Object}
     */
    var defOpts = {
        propertyName: 'value'
    };


    /**
     * Example: A static-like function without access to the instance scope.
     */
    function staticFunction() {
        // Do something here!
    }



    /**
     * Plugin constructor
     * @param {HTMLElement} el
     * @param {Array} args
     * @constructor
     */
    function Plugin(el, args) {

        // --- Instance scope (shared between all plugin functions on the given element) ---

        /**
         * The element which was passed to the plugin
         * @type {jQuery}
         */
        var $el = $(el);

        /**
         * The plugin settings for this instance
         * @type {Object}
         */
        var opts = {};

        /**
         * Self-reference
         * @type {Plugin}
         */
        var self = this;


        /**
         * Init function for setting up this instance
         * The settings are cascaded in the following order:
         *  - the plugin defaults
         *  - the given options via jQuery-call
         *  - the element options via attribute
         *  (latest takes precedence)
         *
         * @param {Object} initOpts
         */
        function init(initOpts) {
            var attrOptStr = $el.attr('data-' + PLUGIN_NAME);
            var attrOpts = attrOptStr ? $.parseJSON(attrOptStr) : {};
            opts = $.extend(opts, defOpts, initOpts, attrOpts);

            // Example: Use a private function
            privateFunction();

            // Example: Bind events
            $el.on('click.' + PLUGIN_NAME, function () {
                // Example: Use static function
                staticFunction();
                // Example: Use public function
                self.publicFunction();
            });
        }

        /**
         * Example: A private function
         */
        function privateFunction() {
            // Do something here!
        }


        /**
         * Example: A public function which can be called from outside:
         * - $('.mySelector').foobar('publicFunction')
         * - $('.mySelector').foobar('publicFunction', {optional: 'additionalParameter'})
         * @param {Object} [args]
         */
        this.publicFunction = function (args) {
            // Do something here

            // If you return something, the plugin call with this function will not be chainable by jQuery
        };

        /**
         * Remove this plugin off the element
         * This function should revert all changes which have been made by this plugin
         */
        this.destroy = function () {
            $el.find('*').addBack().off('.' + PLUGIN_NAME);
            $el.removeData(PLUGIN_NAME);
            $el = null;
        };


        init(args);
    }


    // Register plugin on jQuery
    $.fn[PLUGIN_NAME] = function () {
        var args = arguments || [];
        var val;

        this.each(function () {

            // Prevent multiple instances for same element
            var instance = $.data(this, PLUGIN_NAME);
            if (!instance) {
                instance = new Plugin(this, typeof args[0] === 'object' ? args[0] : {});
                $.data(this, PLUGIN_NAME, instance);
            }

            // Call public function
            // If it returns something, break the loop and return the value
            if (typeof args[0] === 'string') {
                if (typeof instance[args[0]] === 'function') {
                    val = instance[args[0]](args[1]);
                } else {
                    $.error('Method "' + args[0] + '" does not exist for ' + PLUGIN_NAME + ' plugin');
                }
            }

            return val === undefined;
        });

        return val === undefined ? this : val;
    };


    /*
         The plugin will bind itself to all elements which contain the plugin data-attribute (e.g. "data-foobar")
         but have no instance.
         This happens automatically on "ready" and every time when all AJAX-request have finished ("ajaxStop").
         When you add new nodes to the DOM manually you can trigger DOMContentAdded and optionally pass the new nodes as
         argument. If you do not pass the nodes the whole DOM is searched.
         
         Important:
          DOMContentAdded is no default event and can only be triggered manually.
     */
    // Auto pilot
    $(doc).on('ready ajaxStop DOMContentAdded', function (evt, nodes) {
        $(nodes || doc).find('[data-' + PLUGIN_NAME + ']').addBack('[data-' + PLUGIN_NAME + ']')[PLUGIN_NAME]();
    });


/*
    The dependencies which are imported to the plugin wrapper.
    You should add other plugins etc. here to trigger an error if they are missing
 */
})(jQuery, window, document);
