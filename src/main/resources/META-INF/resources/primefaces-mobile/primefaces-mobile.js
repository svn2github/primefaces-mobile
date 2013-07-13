(function(window) {
    
    if(window.PrimeFaces) {
        PrimeFaces.debug("PrimeFaces already loaded, ignoring duplicate execution.");
        return;
    }
    
    PrimeFaces = {

        escapeClientId : function(id) {
            return "#" + id.replace(/:/g,"\\:");
        },

        cleanWatermarks : function(){
            $.watermark.hideAll();
        },

        showWatermarks : function(){
            $.watermark.showAll();
        },

        addSubmitParam : function(parent, params) {
            var form = $(this.escapeClientId(parent));

            for(var key in params) {
                form.append("<input type=\"hidden\" name=\"" + key + "\" value=\"" + params[key] + "\" class=\"ui-submit-param\"/>");
            }

            return this;
        },

        /**
         * Submits a form and clears ui-submit-param after that to prevent dom caching issues
         */ 
        submit : function(formId) {
            $(this.escapeClientId(formId)).submit().children('input.ui-submit-param').remove();
        },

        attachBehaviors : function(element, behaviors) {
            $.each(behaviors, function(event, fn) {
                element.bind(event, function(e) {
                    fn.call(element, e);
                });
            });
        },

        getCookie : function(name) {
            return $.cookie(name);
        },

        setCookie : function(name, value) {
            $.cookie(name, value);
        },

        skinInput : function(input) {
            input.hover(
                function() {
                    $(this).addClass('ui-state-hover');
                },
                function() {
                    $(this).removeClass('ui-state-hover');
                }
                ).focus(function() {
                $(this).addClass('ui-state-focus');
            }).blur(function() {
                $(this).removeClass('ui-state-focus');
            });

            //aria
            input.attr('role', 'textbox').attr('aria-disabled', input.is(':disabled'))
            .attr('aria-readonly', input.prop('readonly'))
            .attr('aria-multiline', input.is('textarea'));


            return this;
        },

        skinButton : function(button) {
            button.mouseover(function(){
                var el = $(this);
                if(!button.hasClass('ui-state-disabled')) {
                    el.addClass('ui-state-hover');
                }
            }).mouseout(function() {
                $(this).removeClass('ui-state-active ui-state-hover');
            }).mousedown(function() {
                var el = $(this);
                if(!button.hasClass('ui-state-disabled')) {
                    el.addClass('ui-state-active').removeClass('ui-state-hover');
                }
            }).mouseup(function() {
                $(this).removeClass('ui-state-active').addClass('ui-state-hover');
            }).focus(function() {
                $(this).addClass('ui-state-focus');
            }).blur(function() {
                $(this).removeClass('ui-state-focus ui-state-active');
            }).keydown(function(e) {
                if(e.keyCode == $.ui.keyCode.SPACE || e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.NUMPAD_ENTER) {
                    $(this).addClass('ui-state-active');
                }
            }).keyup(function() {
                $(this).removeClass('ui-state-active');
            });

            //aria
            button.attr('role', 'button').attr('aria-disabled', button.is(':disabled'));

            return this;
        },

        skinSelect : function(select) {
            select.mouseover(function() {
                var el = $(this);
                if(!el.hasClass('ui-state-focus'))
                    el.addClass('ui-state-hover'); 
            }).mouseout(function() {
                $(this).removeClass('ui-state-hover'); 
            }).focus(function() {
                $(this).addClass('ui-state-focus').removeClass('ui-state-hover');
            }).blur(function() {
                $(this).removeClass('ui-state-focus ui-state-hover'); 
            });

            return this;
        },

        isIE: function(version) {
            return ($.browser.msie && parseInt($.browser.version, 10) == version);
        },

        //ajax shortcut
        ab: function(cfg, ext) {
            PrimeFaces.ajax.AjaxRequest(cfg, ext);
        },

        info: function(log) {
            if(this.logger) {
                this.logger.info(log);
            }
        },

        debug: function(log) {
            if(this.logger) {
                this.logger.debug(log);
            }
        },

        warn: function(log) {
            if(this.logger) {
                this.logger.warn(log);
            }
        },

        error: function(log) {
            if(this.logger) {
                this.logger.error(log);
            }
        },

        setCaretToEnd: function(element) {
            if(element) {
                element.focus();
                var length = element.value.length;

                if(length > 0) {
                    if(element.setSelectionRange) {
                        element.setSelectionRange(0, length);
                    } 
                    else if (element.createTextRange) {
                      var range = element.createTextRange();
                      range.collapse(true);
                      range.moveEnd('character', 1);
                      range.moveStart('character', 1);
                      range.select();
                    }
                }
            }
        },

        changeTheme: function(newTheme) {
            if(newTheme && newTheme != '') {
                var themeLink = $('link[href*="javax.faces.resource/theme.css"]'),
                themeURL = themeLink.attr('href'),
                plainURL = themeURL.split('&')[0],
                oldTheme = plainURL.split('ln=')[1],
                newThemeURL = themeURL.replace(oldTheme, 'primefaces-' + newTheme);

                themeLink.attr('href', newThemeURL);
            }
        },

        escapeRegExp: function(text) {
            return text.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        },

        escapeHTML: function(value) {
            return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        },

        clearSelection: function() {
            if(window.getSelection) {
                if(window.getSelection().empty) {
                    window.getSelection().empty();
                } else if(window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            } else if(document.selection && document.selection.empty) {
                    document.selection.empty();
            }
        },

        cw : function(widgetConstructor, widgetVar, cfg, resource) {
            PrimeFaces.createWidget(widgetConstructor, widgetVar, cfg, resource);
        },

        createWidget : function(widgetConstructor, widgetVar, cfg, resource) {            
            if(PrimeFaces.widget[widgetConstructor]) {
                if(window[widgetVar])
                    window[widgetVar].refresh(cfg);                                     //ajax spdate
                else
                    window[widgetVar] = new PrimeFaces.widget[widgetConstructor](cfg);  //page init
            }
            else {
                var scriptURI = $('script[src*="/javax.faces.resource/primefaces.js"]').attr('src').replace('primefaces.js', resource + '/' + resource + '.js'),
                cssURI = $('link[href*="/javax.faces.resource/primefaces.css"]').attr('href').replace('primefaces.css', resource + '/' + resource + '.css'),
                cssResource = '<link type="text/css" rel="stylesheet" href="' + cssURI + '" />';

                //load css
                $('head').append(cssResource);

                //load script and initialize widget
                PrimeFaces.getScript(location.protocol + '//' + location.host + scriptURI, function() {
                    setTimeout(function() {
                        window[widgetVar] = new PrimeFaces.widget[widgetConstructor](cfg);
                    }, 100);
                });
            }
        },

        inArray: function(arr, item) {
            for(var i = 0; i < arr.length; i++) {
                if(arr[i] === item) {
                    return true;
                }
            }

            return false;
        },

        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        getScript: function(url, callback) {
            $.ajax({
                type: "GET",
                url: url,
                success: callback,
                dataType: "script",
                cache: true
            });
        },

        focus : function(id, context) {
            var selector = ':not(:submit):not(:button):input:visible:enabled';

            setTimeout(function() {
                if(id) {
                    var jq = $(PrimeFaces.escapeClientId(id));

                    if(jq.is(selector)) {
                        jq.focus();
                    } 
                    else {
                        jq.find(selector).eq(0).focus();
                    }
                }
                else if(context) {
                    $(PrimeFaces.escapeClientId(context)).find(selector).eq(0).focus();
                }
                else {
                    $(selector).eq(0).focus();
                }
            }, 250);
        },

        monitorDownload: function(start, complete) {
            if(start) {
                start();
            }

            window.downloadMonitor = setInterval(function() {
                var downloadComplete = PrimeFaces.getCookie('primefaces.download');

                if(downloadComplete == 'true') {
                    if(complete) {
                        complete();
                    }
                    clearInterval(window.downloadPoll);
                    PrimeFaces.setCookie('primefaces.download', null);
                }
            }, 500);
        },

        /**
         *  Scrolls to a component with given client id
         */
        scrollTo: function(id) {
            var offset = $(PrimeFaces.escapeClientId(id)).offset();

            $('html,body').animate({
                scrollTop:offset.top
                ,
                scrollLeft:offset.left
            },{
                easing: 'easeInCirc'
            },1000);

        },

        /**
         *  Aligns container scrollbar to keep item in container viewport, algorithm copied from jquery-ui menu widget
         */
        scrollInView: function(container, item) { 
            if(item.length == 0) {
                return;
            }

            var borderTop = parseFloat(container.css('borderTopWidth')) || 0,
            paddingTop = parseFloat(container.css('paddingTop')) || 0,
            offset = item.offset().top - container.offset().top - borderTop - paddingTop,
            scroll = container.scrollTop(),
            elementHeight = container.height(),
            itemHeight = item.outerHeight(true);

            if(offset < 0) {
                container.scrollTop(scroll + offset);
            }
            else if((offset + itemHeight) > elementHeight) {
                container.scrollTop(scroll + offset - elementHeight + itemHeight);
            }
        },        

        locales : {},

        zindex : 1000,

        PARTIAL_REQUEST_PARAM : "javax.faces.partial.ajax",

        PARTIAL_UPDATE_PARAM : "javax.faces.partial.render",

        PARTIAL_PROCESS_PARAM : "javax.faces.partial.execute",

        PARTIAL_SOURCE_PARAM : "javax.faces.source",

        BEHAVIOR_EVENT_PARAM : "javax.faces.behavior.event",

        PARTIAL_EVENT_PARAM : "javax.faces.partial.event",

        VIEW_STATE : "javax.faces.ViewState",

        VIEW_ROOT : "javax.faces.ViewRoot",

        CLIENT_ID_DATA : "primefaces.clientid"
    };

    /**
     * PrimeFaces Namespaces
     */
    PrimeFaces.ajax = {};
    PrimeFaces.widget = {};

    PrimeFaces.ajax.AjaxUtils = {

        encodeViewState : function() {
            var viewstateValue = document.getElementById(PrimeFaces.VIEW_STATE).value;
            var re = new RegExp("\\+", "g");
            var encodedViewState = viewstateValue.replace(re, "\%2B");

            return encodedViewState;
        },

        updateState: function(value) {
            var viewstateValue = $.trim(value),
            forms = this.portletForms ? this.portletForms : $('form');

            forms.each(function() {
                var form = $(this),
                formViewStateElement = form.children("input[name='javax.faces.ViewState']").get(0);

                if(formViewStateElement) {
                    $(formViewStateElement).val(viewstateValue);
                }
                else
                {
                    form.append('<input type="hidden" name="javax.faces.ViewState" id="javax.faces.ViewState" value="' + viewstateValue + '" autocomplete="off" />');
                }
            });
        },

        updateElement: function(id, content) {        
            if(id == PrimeFaces.VIEW_STATE) {
                PrimeFaces.ajax.AjaxUtils.updateState.call(this, content);
            }
            else if(id == PrimeFaces.VIEW_ROOT) {
                $('head').html(content.substring(content.indexOf("<head>") + 6, content.lastIndexOf("</head>")));
                $('body').html(content.substring(content.indexOf("<body>") + 6, content.lastIndexOf("</body>")));
            }
            else {
                $(PrimeFaces.escapeClientId(id)).replaceWith(content);
            }
        },

        /**
         *  Handles response handling tasks after updating the dom
         **/
        handleResponse: function(xmlDoc) {
            var redirect = xmlDoc.find('redirect'),
            callbackParams = xmlDoc.find('extension[ln="primefaces"][type="args"]'),
            scripts = xmlDoc.find('eval');

            if(redirect.length > 0) {
                window.location = redirect.attr('url');
            }
            else {
                //args
                this.args = callbackParams.length > 0 ? $.parseJSON(callbackParams.text()) : {};

                //scripts to execute
                for(var i=0; i < scripts.length; i++) {
                    $.globalEval(scripts.eq(i).text());
                }
            }
        },

        findComponents: function(selector) {
            //converts pfs to jq selector e.g. @(div.mystyle :input) to div.mystyle :input
            var jqSelector = selector.substring(2, selector.length - 1),
            components = $(jqSelector),
            ids = [];

            components.each(function() {
                var element = $(this),
                clientId = element.data(PrimeFaces.CLIENT_ID_DATA)||element.attr('id');

                ids.push(clientId);
            });

            return ids;
        },

        idsToArray: function(cfg, type, selector) {
            var arr = [],
            def = cfg[type],
            ext = cfg.ext ? cfg.ext[type] : null;

            if(def) {
                $.merge(arr, def.split(' '));
            }

            if(ext) {
                var extArr = ext.split(' ');

                for(var i = 0; i < extArr.length; i++) {
                    if(!PrimeFaces.inArray(arr, extArr[i])) {
                        arr.push(extArr[i]);
                    }
                }
            }

            if(selector) {
                $.merge(arr, PrimeFaces.ajax.AjaxUtils.findComponents(selector));
            }

            return arr;
        },

        send: function(cfg) {
            PrimeFaces.debug('Initiating ajax request.');

            if(cfg.onstart) {
                var retVal = cfg.onstart.call(this, cfg);
                if(retVal == false) {
                    PrimeFaces.debug('Ajax request cancelled by onstart callback.');

                    //remove from queue
                    if(!cfg.async) {
                        PrimeFaces.ajax.Queue.poll();
                    }

                    return;  //cancel request
                }
            }

            var form = null,
            sourceId = null;

            //source can be a client id or an element defined by this keyword
            if(typeof(cfg.source) == 'string') {
                sourceId = cfg.source;
            } else {
                sourceId = $(cfg.source).attr('id');
            }

            if(cfg.formId) {
                form = $(PrimeFaces.escapeClientId(cfg.formId));                         //Explicit form is defined
            }
            else {
                form = $(PrimeFaces.escapeClientId(sourceId)).parents('form:first');     //look for a parent of source

                //source has no parent form so use first form in document
                if(form.length == 0) {
                    form = $('form').eq(0);
                }
            }

            PrimeFaces.debug('Form to post ' + form.attr('id') + '.');

            var postURL = form.attr('action'),
            encodedURLfield = form.children("input[name='javax.faces.encodedURL']"),
            postParams = [];

            //portlet support
            var pForms = null;
            if(encodedURLfield.length > 0) {
                postURL = encodedURLfield.val();
                pForms = $('form[action="' + form.attr('action') + '"]');   //find forms of the portlet
            }

            PrimeFaces.debug('URL to post ' + postURL + '.');

            //partial ajax
            postParams.push({
                name:PrimeFaces.PARTIAL_REQUEST_PARAM, 
                value:true
            });

            //source
            postParams.push({
                name:PrimeFaces.PARTIAL_SOURCE_PARAM, 
                value:sourceId
            });

            //process
            var processArray = PrimeFaces.ajax.AjaxUtils.idsToArray(cfg, 'process', cfg.processSelector),
            processIds = processArray.length > 0 ? processArray.join(' ') : '@all';
            postParams.push({
                name:PrimeFaces.PARTIAL_PROCESS_PARAM, 
                value:processIds
            });

            //update
            var updateArray = PrimeFaces.ajax.AjaxUtils.idsToArray(cfg, 'update', cfg.updateSelector);
            if(updateArray.length > 0) {
                postParams.push({
                    name:PrimeFaces.PARTIAL_UPDATE_PARAM, 
                    value:updateArray.join(' ')
                });
            }

            //behavior event
            if(cfg.event) {
                postParams.push({
                    name:PrimeFaces.BEHAVIOR_EVENT_PARAM, 
                    value:cfg.event
                });

                var domEvent = cfg.event;

                if(cfg.event == 'valueChange')
                    domEvent = 'change';
                else if(cfg.event == 'action')
                    domEvent = 'click';

                postParams.push({
                    name:PrimeFaces.PARTIAL_EVENT_PARAM, 
                    value:domEvent
                });
            } 
            else {
                postParams.push({
                    name:sourceId, 
                    value:sourceId
                });
            }

            //params
            if(cfg.params) {
                $.merge(postParams, cfg.params);
            }
            if(cfg.ext && cfg.ext.params) {
                $.merge(postParams, cfg.ext.params);
            }

            /**
            * Only add params of process components and their children 
            * if partial submit is enabled and there are components to process partially
            */
            if(cfg.partialSubmit && processIds != '@all') {
                var hasViewstate = false;

                if(processIds != '@none') {
                    var processIdsArray = processIds.split(' ');

                    $.each(processIdsArray, function(i, item) {
                        var jqProcess = $(PrimeFaces.escapeClientId(item)),
                        componentPostParams = null;

                        if(jqProcess.is('form')) {
                            componentPostParams = jqProcess.serializeArray();
                            hasViewstate = true;
                        }
                        else if(jqProcess.is(':input')) {
                            componentPostParams = jqProcess.serializeArray();
                        }
                        else {
                            componentPostParams = jqProcess.find(':input').serializeArray();
                        }

                        $.merge(postParams, componentPostParams);
                    });
                }

                //add viewstate if necessary
                if(!hasViewstate) {
                    postParams.push({
                        name:PrimeFaces.VIEW_STATE, 
                        value:form.children("input[name='javax.faces.ViewState']").val()
                    });
                }

            }
            else {
                $.merge(postParams, form.serializeArray());
            }

            //serialize
            var postData = $.param(postParams);

            PrimeFaces.debug('Post Data:' + postData);

            var xhrOptions = {
                url : postURL,
                type : "POST",
                cache : false,
                dataType : "xml",
                data : postData,
                portletForms: pForms,
                source: cfg.source,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Faces-Request', 'partial/ajax');
                }
            };

            xhrOptions.global = cfg.global === true || cfg.global === undefined ? true : false;

            $.ajax(xhrOptions)
            .done(function(data, status, xhr) {
                PrimeFaces.debug('Response received succesfully.');
                
                var parsed;

                //call user callback
                if(cfg.onsuccess) {
                    parsed = cfg.onsuccess.call(this, data, status, xhr);
                }

                //extension callback that might parse response
                if(cfg.ext && cfg.ext.onsuccess && !parsed) {
                    parsed = cfg.ext.onsuccess.call(this, data, status, xhr); 
                }

                //do not execute default handler as response already has been parsed
                if(parsed) {
                    return;
                } 
                else {
                    PrimeFaces.ajax.AjaxResponse.call(this, data, status, xhr);
                }

                PrimeFaces.debug('DOM is updated.');
            })
            .fail(function(xhr, status, errorThrown) {
                if(cfg.onerror) {
                    cfg.onerror.call(xhr, status, errorThrown);
                }

                PrimeFaces.error('Request return with error:' + status + '.');
            })
            .always(function(xhr, status) {
                if(cfg.oncomplete) {
                    cfg.oncomplete.call(this, xhr, status, this.args);
                }

                if(cfg.ext && cfg.ext.oncomplete) {
                    cfg.ext.oncomplete.call(this, xhr, status, this.args);
                }

                PrimeFaces.debug('Response completed.');

                if(!cfg.async) {
                    PrimeFaces.ajax.Queue.poll();
                }
            });
        }
    };

    PrimeFaces.ajax.AjaxRequest = function(cfg, ext) {
        cfg.ext = ext;

        if(cfg.async) {
            PrimeFaces.ajax.AjaxUtils.send(cfg);
        }
        else {
            PrimeFaces.ajax.Queue.offer(cfg);
        }
    }

    PrimeFaces.ajax.AjaxResponse = function(responseXML) {
        var xmlDoc = $(responseXML.documentElement),
        updates = xmlDoc.find('update');

        for(var i=0; i < updates.length; i++) {
            var update = updates.eq(i),
            id = update.attr('id'),
            content = update.text();

            PrimeFaces.ajax.AjaxUtils.updateElement.call(this, id, content);
        }

        PrimeFaces.ajax.AjaxUtils.handleResponse.call(this, xmlDoc);
    }

    PrimeFaces.ajax.Queue = {

        requests : new Array(),

        offer : function(request) {
            this.requests.push(request);

            if(this.requests.length == 1) {
                PrimeFaces.ajax.AjaxUtils.send(request);
            }
        },

        poll : function() {
            if(this.isEmpty()) {
                return null;
            }

            var processed = this.requests.shift(),
            next = this.peek();

            if(next != null) {
                PrimeFaces.ajax.AjaxUtils.send(next);
            }

            return processed;
        },

        peek : function() {
            if(this.isEmpty()) {
                return null;
            }

            return this.requests[0];
        },

        isEmpty : function() {
            return this.requests.length == 0;
        }
    };

    /* Simple JavaScript Inheritance
     * By John Resig http://ejohn.org/
     * MIT Licensed.
     */
    // Inspired by base2 and Prototype
    (function(){
      var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
      // The base Class implementation (does nothing)
      this.Class = function(){};

      // Create a new Class that inherits from this class
      Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
          // Check if we're overwriting an existing function
          prototype[name] = typeof prop[name] == "function" && 
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
              return function() {
                var tmp = this._super;

                // Add a new ._super() method that is the same method
                // but on the super-class
                this._super = _super[name];

                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                var ret = fn.apply(this, arguments);        
                this._super = tmp;

                return ret;
              };
            })(name, prop[name]) :
            prop[name];
        }

        // The dummy class constructor
        function Class() {
          // All construction is actually done in the init method
          if ( !initializing && this.init )
            this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
      };
    })();

    /**
     * BaseWidget for PrimeFaces Widgets
     */
    PrimeFaces.widget.BaseWidget = Class.extend({

        init: function(cfg) {
            this.cfg = cfg;
            this.id = cfg.id;
            this.jqId = PrimeFaces.escapeClientId(this.id),
            this.jq = $(this.jqId);

            //remove script tag
            $(this.jqId + '_s').remove();
        },

        //used mostly in ajax updates, reloads the widget configuration
        refresh: function(cfg) {
            return this.init(cfg);
        },

        //returns jquery object representing the main dom element related to the widget
        getJQ: function(){
            return this.jq;
        }

    });
    
    //expose globally
    window.PrimeFaces = PrimeFaces;

})(window);

PrimeFaces.ajax.AjaxUtils.updateElement = function(id, content) {        
    if(id == PrimeFaces.VIEW_STATE) {
        PrimeFaces.ajax.AjaxUtils.updateState.call(this, content);
    }
    else if(id == PrimeFaces.VIEW_ROOT) {
        document.open();
        document.write(content);
        document.close();
    }
    else {
        if ($.mobile) {
            var context = $(PrimeFaces.escapeClientId(id)).parent(),
                controls = context.find(":input, button, a[data-role='button'], ul");
                                            
            //selects
            controls.filter("select:not([data-role='slider'])").selectmenu().selectmenu("destroy");             
        }
        
        $(PrimeFaces.escapeClientId(id)).replaceWith(content);

        //PrimeFaces Mobile
        if($.mobile) {
            context = $(PrimeFaces.escapeClientId(id)).parent(),
            controls = context.find(":input, button, a[data-role='button'], ul, table");

            //input text and textarea
            var inputs = controls.filter("[type='text'],[type='tel'],[type='range'],[type='number'],[type='email'],[type='password'],[type='date'],[type='datetime'],[type='time'],[type='url'],[type='password'],[type='file'],textarea").textinput();            
            if (inputs.parent().parent().hasClass("ui-input-text")){
                inputs.unwrap(); //prevent duplicate input
            }
            
            //radio-checkbox
            controls.filter("[type='radio'], [type='checkbox']").checkboxradio();
            
            //selects
            controls.filter("select:not([data-role='slider'])" ).selectmenu();
            
            //slider
            controls.filter(":jqmData(type='range')").slider();
            
            //switch
            controls.filter("select[data-role='slider']" ).slider();
            
            //lists                        
            var lists = controls.filter("ul[data-role='listview']").listview();     
            lists.prev("form.ui-listview-filter").prev("form.ui-listview-filter").remove();  //prevent duplicate filter                      
                                    
            //buttons
            controls.filter("button, [type='button'], [type='submit'], [type='reset'], [type='image']").button();
            controls.filter("a").buttonMarkup();
            
            //table                   
            var tables = controls.filter("table[data-role='table']");
            tables.table().table("refresh");
            tables.prev().prev(".ui-table-columntoggle-btn").prev().prev(".ui-table-columntoggle-btn").remove(); //prevent duplicate button
                        
            //field container
            context.find(":jqmData(role='fieldcontain')").fieldcontain();
            
            //control groups
            context.find(":jqmData(role='controlgroup')").controlgroup();
            
            //panel
            context.find("div[data-role='collapsible']").collapsible();
            
            //accordion
            context.find("div[data-role='collapsibleset']").collapsibleset();
            
            //navbar
            context.find("div[data-role='navbar']").navbar();     
            
            //popup
            context.find("div[data-role='popup']").popup();            
        }
    }
}

PrimeFaces.navigate = function(to, cfg) {        
    //cast
    cfg.reverse = (cfg.reverse == 'true' || cfg.reverse == true) ? true : false;

    $.mobile.changePage(to, cfg);
}

PrimeFaces.back = function() {        
    $.mobile.back();
    return false;
}

/**
 * PrimeFaces InputText Widget
 */
PrimeFaces.widget.InputText = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.input = this.jq.is(':input') ? this.jq : this.jq.children(':input');
        
        //Client behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.input, this.cfg.behaviors);
        }
    }
});

/**
 * PrimeFaces InputText Widget
 */
PrimeFaces.widget.InputTextarea = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.input = this.jq.is(':input') ? this.jq : this.jq.children(':input');
        
        this.cfg.rowsDefault = this.input.attr('rows');
        this.cfg.colsDefault = this.input.attr('cols');

        //max length
        if(this.cfg.maxlength){
            this.applyMaxlength();
        }

        //Client behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.input, this.cfg.behaviors);
        }
    },    
    
    applyMaxlength: function() {
        var _self = this;

        this.input.keyup(function(e) {
            var value = _self.input.val(),
            length = value.length;

            if(length > _self.cfg.maxlength) {
                _self.input.val(value.substr(0, _self.cfg.maxlength));
            }
        });
    }
});

/**
 * PrimeFaces SelectBooleanCheckbox Widget
 */
PrimeFaces.widget.SelectBooleanCheckbox = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.input = $(this.jqId + '_input');

        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.input, this.cfg.behaviors);
        }
    }
});

/**
 * PrimeFaces SelectManyCheckbox Widget
 */
PrimeFaces.widget.SelectManyCheckbox = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.inputs = this.jq.find(':checkbox:not(:disabled)');
                        
        //Client Behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.inputs, this.cfg.behaviors);
        }
    }
});

/**
 * PrimeFaces SelectOneRadio Widget
 */
PrimeFaces.widget.SelectOneRadio = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);

        this.inputs = this.jq.find(':radio:not(:disabled)');
                
        //Client Behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.inputs, this.cfg.behaviors);
        }
    }
});

/**
 * PrimeFaces Dialog Widget
 */
PrimeFaces.widget.Dialog = PrimeFaces.widget.BaseWidget.extend({
    
    show: function() {
        var _self = this;
        //Wait other popup close
        var delay = 300;
        setTimeout(function() {_self.jq.popup('open')}, delay);
    },
    
    hide: function() {
        this.jq.popup('close');
    }
});

/**
 * PrimeFaces Growl Widget
 */
PrimeFaces.widget.Growl = PrimeFaces.widget.BaseWidget.extend({
    init: function(cfg) {
        this._super(cfg);
        var element = this.jq;
        cfg.y = $(document).height();

        if (cfg.showPopup){  
            //Wait other popup close
            var delay = 300;
            setTimeout(function() {element.popup().popup('open', cfg)},delay);
            if (!cfg.sticky) {
                setTimeout(function() {element.popup('close')}, cfg.life+delay);
            }
        }
    }
});

/**
 * PrimeFaces Calendar Widget
 */
PrimeFaces.widget.Calendar = PrimeFaces.widget.BaseWidget.extend({
    init: function(cfg) {
        this._super(cfg);
        this.input = this.jq.is(':input') ? this.jq : this.jq.children(':input');

        this.cfg.theme = 'jqm';

        if (this.cfg.hasTime) {
            if (this.cfg.timeOnly) {
                this.jq.mobiscroll().time(this.cfg);
            } else {
                this.jq.mobiscroll().datetime(this.cfg);
            }
        } else {
            this.jq.mobiscroll().date(this.cfg);
        }

        if (this.cfg.defaultDate !== 'null') {
            this.jq.mobiscroll('setDate', $.scroller.parseDate(this.cfg.pattern, this.cfg.defaultDate), true);
        }
        
        //Client behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.input, this.cfg.behaviors);
        }        
        
        //Select listener
        this.bindDateSelectListener();
    },
    show: function() {
        this.jq.mobiscroll('show');
    },
    
    bindDateSelectListener: function() {
        if (this.cfg.behaviors) {
            var dateSelectBehavior = this.cfg.behaviors['dateSelect'];

            if (dateSelectBehavior) {
                this.jq.bind('change', function(e) {
                    dateSelectBehavior.call(this);
                });
            }
        }
    }
});

/**
 * PrimeFaces AutoComplete Widget
 */
PrimeFaces.widget.AutoComplete = PrimeFaces.widget.BaseWidget.extend({
    init: function(cfg) {
        this._super(cfg);
        this.cfg.minLength = this.cfg.minLength != undefined ? this.cfg.minLength : 1;
        this.cfg.delay = this.cfg.delay != undefined ? this.cfg.delay : 1000;

        this.bindEvents();
    },
    bindEvents: function() {
        var $this = this;

        this.jq.bind('listviewbeforefilter', function(event, ui) {
            $this.beforefilter(event, ui);
        });

        this.jq.find('a').bind('click', function(event) {
            $this.invokeItemSelectBehavior(event, $(event.target).attr('item-value'));
        });

    },
    beforefilter: function(event, ui) {
        var _self = this;
        $input = $(ui.input);
        query = $input.val();

        if (query.length === 0 || query.length >= _self.cfg.minLength) {

            //Cancel the search request if user types within the timeout
            if (_self.timeout) {
                clearTimeout(_self.timeout);
            }

            _self.timeout = setTimeout(function() {
                _self.search(query);
            },
            _self.cfg.delay);
        }

    },
    search: function(query) {
        var options = {
            source: this.id,
            update: this.id,
            formId: this.cfg.formId,
            onsuccess: function(responseXML) {
                var xmlDoc = $(responseXML.documentElement),
                        updates = xmlDoc.find("update");
                for (var i = 0; i < updates.length; i++) {
                    var update = updates.eq(i),
                            id = update.attr('id'),
                            data = update.text();

                    PrimeFaces.ajax.AjaxUtils.updateElement.call(this, id, data);
                    var context = $(PrimeFaces.escapeClientId(id));
                    context.find(":input").focus().val(query);

                }

                PrimeFaces.ajax.AjaxUtils.handleResponse.call(this, xmlDoc);

                return true;
            }
        };

        options.params = [
            {name: this.id + '_query', value: query}
        ];

        PrimeFaces.ajax.AjaxRequest(options);
    },
    invokeItemSelectBehavior: function(event, itemValue) {
        if (this.cfg.behaviors) {
            var itemSelectBehavior = this.cfg.behaviors['itemSelect'];

            if (itemSelectBehavior) {
                var ext = {
                    params: [
                        {name: this.id + '_itemSelect', value: itemValue}
                    ]
                };

                itemSelectBehavior.call(this, event, ext);
            }
        }
    }
});

/**
 * PrimeFaces OverlayPanel Widget
 */
PrimeFaces.widget.OverlayPanel = PrimeFaces.widget.BaseWidget.extend({
    init: function(cfg) {
        this._super(cfg);        

        this.targetId = PrimeFaces.escapeClientId(this.cfg.target);
        this.target = $(this.targetId);        
        //configuration      
        this.cfg.showEvent = this.cfg.showEvent||'click.ui-overlaypanel';        
        
        this.bindEvents();
    },
            
    bindEvents: function() {
        var _self = this;
        //show and hide events for target        
        var event = this.cfg.showEvent;

        $(document).off(event, this.targetId).on(event, this.targetId, this, function(e) {
            e.data.show();
        });

        this.jq.bind('panelopen', function(event, ui) {
            if (_self.cfg.onShow) {
                _self.cfg.onShow.call(_self);
            }
        });

        this.jq.bind('panelclose', function(event, ui) {
            if (_self.cfg.onHide) {
                _self.cfg.onHide.call(_self);
            }
        });

    },            
            
    show: function() {
        this.jq.panel('open');
    },
    
    hide: function() {
        this.jq.panel('close');
    },
            
    toggle: function() {
        this.jq.panel('toggle');
    }                      
});


/**
 * PrimeFaces DataList Widget
 */
PrimeFaces.widget.DataList = PrimeFaces.widget.BaseWidget.extend({
    init: function(cfg) {
        var _self = this;
        this._super(cfg);
        this.scrollOffset = this.cfg.scrollStep;

        if (_self.cfg.isPaginator) {
            var btn = $(PrimeFaces.escapeClientId(_self.id + '_btn'));

            btn.click(function() {
                _self.loadRows();                
            });
        }
    },
            
    loadRows: function() {
        var options = {
            source: this.id,
            process: this.id,
            update: this.id,
            formId: this.cfg.formId
        },
        _self = this;

        options.onsuccess = function(responseXML) {
            var xmlDoc = $(responseXML.documentElement),
                    updates = xmlDoc.find("update");

            for (var i = 0; i < updates.length; i++) {
                var update = updates.eq(i),
                        id = update.attr('id'),
                        content = update.text();

                if (id == _self.id) {
                    var lastRow = $(_self.jqId + ' li:last');

                    //insert new rows
                    lastRow.after(content);
                    
                    _self.scrollOffset += _self.cfg.scrollStep;

                    //Disable scroll if there is no more data left
                    if(_self.scrollOffset >= _self.cfg.scrollLimit) {
                        var btn = $(PrimeFaces.escapeClientId(id + '_btn'));
                        btn.remove();
                    }                    

                    var context = $(PrimeFaces.escapeClientId(id)).parent();         
                    context.find("ul[data-role='listview']").listview("refresh");
                }
                else {
                    PrimeFaces.ajax.AjaxUtils.updateElement.call(this, id, content);
                }
            }

            PrimeFaces.ajax.AjaxUtils.handleResponse.call(this, xmlDoc);

            return true;
        };

        options.params = [
            {name: this.id + '_pagination', value: true},
            {name: this.id + '_first', value: this.scrollOffset},
            {name: this.id + '_rows', value: _self.cfg.scrollStep}
        ];

        PrimeFaces.ajax.AjaxRequest(options);

    }
});   


/**
 * PrimeFaces ContextMenu Widget
 */
PrimeFaces.widget.ContextMenu = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        var _self = this,
        documentTarget = (this.cfg.target === undefined); 

        //event
        this.cfg.event = this.cfg.event||'taphold';
        
        var viewId = this.jq.closest("div[data-role='page']").attr('id');

        //target
        this.jqTargetId = documentTarget ? PrimeFaces.escapeClientId(viewId) : PrimeFaces.escapeClientId(this.cfg.target);
        this.jqTarget = $(this.jqTargetId);

        //attach contextmenu        
        if (documentTarget) {
            $(document).off(_self.cfg.event, this.jqTargetId).on(_self.cfg.event, this.jqTargetId, null, function() {
                _self.show();
            });
        } else {
            if (this.cfg.type === 'DataList') {
                this.bindDataList();
            }
        }
                
        //close menu when link is clicked
        this.jq.find('li a').bind('click', function(event) {            
            _self.hide();
        });        
        
    },      
            
    bindDataList: function() {
        var _self = this;

        //target
        var selector = PrimeFaces.escapeClientId(this.cfg.target) + ' li.ui-li:not(.ui-li-divider)';

        $(document).off(_self.cfg.event, selector).on(_self.cfg.event, selector, null, function() {
            var linkSelection = $(this).find('a.selection');

            var options = {
                source: linkSelection.attr('id'),
                process: linkSelection.attr('id'),                               
                oncomplete: function(xhr, status, args) {
                    _self.show();
                }
            };

            PrimeFaces.ajax.AjaxRequest(options);
        });
            
    },            
            
    show: function() {  

        if(this.cfg.beforeShow) {
            this.cfg.beforeShow.call(this);
        }                
        
        if (this.cfg.hasContent) {
            this.jq.popup('open');
        }
    },
            
    hide: function() {
        this.jq.popup('close');
    }              

}); 

/**
 * PrimeFaces Accordion Panel Widget
 */
PrimeFaces.widget.AccordionPanel = PrimeFaces.widget.BaseWidget.extend({
    init: function(cfg) {
        this._super(cfg);        
        
        this.bindEvents();
    },
            
    bindEvents: function() {
        var $this = this;

        var tabs = $this.jq.find("div[data-role='collapsible'] > h3");
        tabs.bind('click', function() {
            var selectedTab = $(PrimeFaces.escapeClientId(this.parentElement.id));
            if (selectedTab.hasClass('ui-collapsible-collapsed')) {
                
                if ($this.cfg.onTabChange) {
                    var result = $this.cfg.onTabChange.call($this, panel);
                    if (result === false)
                        return false;
                }                
                
                if ($this.hasBehavior('tabChange')) {
                    $this.fireTabChangeEvent(selectedTab);
                }
            } else {
                if ($this.hasBehavior('tabClose')) {
                    $this.fireTabCloseEvent(selectedTab);
                }                
            }
        });

    },
            
    fireTabChangeEvent : function(panel) {
        var tabChangeBehavior = this.cfg.behaviors['tabChange'],
        ext = {
            params: [
                {name: this.id + '_newTab', value: panel.attr('id')},
                {name: this.id + '_tabindex', value: parseInt(panel.index())}
            ]
        };
        
        tabChangeBehavior.call(this, null, ext);
    },

    fireTabCloseEvent : function(panel) {
        var tabCloseBehavior = this.cfg.behaviors['tabClose'],
        ext = {
            params: [
                {name: this.id + '_tabId', value: panel.attr('id')},
                {name: this.id + '_tabindex', value: parseInt(panel.index())}
            ]
        };
        
        tabCloseBehavior.call(this, null, ext);
    },
            
    hasBehavior: function(event) {
        if(this.cfg.behaviors) {
            return this.cfg.behaviors[event] != undefined;
        }

        return false;
    }            
                        
});
