/**
 * @license MIT
 * @author BlueMöhre <bluemoehre@gmx.de>
 * @copyright 2014 BlueMöhre
 * @link http://www.github.com/bluemoehre
 */
(function($, win, doc) {

    'use strict';

    // --- Plugin scope (shared between all plugin instances) ---

    /*
        Define the plugin name here!
        It is also used to find elements via data-attribute selector which are using this plugin (e.g. data-foobar="")
        It MUST be unique!
    */
    /**
     * The plugin name and data-attribute name/selector
     * @type {string}
     */
    var PLUGIN_NAME = 'foobar';

    /*
        Define the plugin defaults here!
    */
    /**
     * The plugin defaults
     * @type {}
     */
    var defOpts = {
        propertyName: 'value'
    };

    // ---


    /**
     * Plugin constructor
     * @param el
     * @param args
     * @constructor
     */
    function Plugin(el, args)
    {
        // --- Instance scope (shared between all plugin functions on the given element) ---

        var $el = $(el);
        var opts = {};
        var self = this;

        /*
            var privateFunction = function(){
                // Do something here!
            };
        */

        // ---


        /**
         * Init function for setting up the given element
         * The settings for this element will be built in the order:
         *  - the plugin defaults
         *  - the given options via call
         *  - the element options via attribute
         *  (latest takes precedence)
         *
         * @param args
         */
        this.init = function(args){

            var attrOptStr = $el.attr('data-'+ PLUGIN_NAME);
            var attrOpts = attrOptStr ? $.parseJSON(attrOptStr) : {};
            opts = $.extend(opts, args, attrOpts);

            /*
                // Use private function
                privateFunction();

                // Bind events
                $el.on('click.' + PLUGIN_NAME, function(){
                    // Use public function
                    self.publicFunction();
                });
            */
        };

        /**
         * Destroy function to remove this plugin off the element
         */
        this.destroy = function(){
            $el.off('.' + PLUGIN_NAME);
            $el.find('*').off('.' + PLUGIN_NAME);
            $el.removeData(PLUGIN_NAME);
            $el = null;
        };

        /**
         * Returns the result of merging current settings with given settings
         * @todo what was this for? %)
         * @param args
         */
        this.getOpts = function(args){
            opts = $.extend(opts, args);
        }

        /*
            this.publicFunction = function(){
                // Do something here
            };
        */

        this.init(defOpts);
    }


    // Bind plugin to jQuery
    $.fn[PLUGIN_NAME] = function(){
        var args = arguments;

        return this.each(function(){

            // prevent multiple instances for same element
            var instance = $.data(this, PLUGIN_NAME);
            if (!instance){
                instance = new Plugin(this);
                $.data(this, PLUGIN_NAME, instance);
            }
            if (instance[args[0]]){
                instance[args[0]](args[1]);
            } else if (typeof args[0] == 'object'){
                instance.init(args[0]);
            } else if (args[0]) {
                $.error("Method '" + args[0] + "' doesn't exist for " + PLUGIN_NAME + " plugin");
            }
        });

    };

    /*
        Choose your events for running the auto pilot!
        If you have a lot of XHR in the background you might remove "ajaxStop" and trigger "DOMContentAdded" manually
        to improve performance.
     */
    /**
     * Auto pilot
     * The plugin will bind itself to all elements which contain the plugin data-attribute (e.g. "data-foobar")
     * When new nodes are added to the DOM it will try to use only the new nodes (must be passed as argument)
     * else it will search the whole DOM and init on elements which have no instance
     * INFO: DOMContentAdded is no default event and should be triggered manually or replaced with something else!
     */
    $(doc).on('ready DOMContentAdded ajaxStop', function(evt, nodes){
        $(nodes || document).find('[data-' + PLUGIN_NAME + ']').addBack('[data-' + PLUGIN_NAME + ']')[PLUGIN_NAME]();
    });


})(jQuery, window, document);
