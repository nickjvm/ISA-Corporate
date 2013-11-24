/**
* The Calendar component is a UI control that enables users to choose one or more dates from a graphical calendar presented in a one-month or
* multi-month interface. Calendars are generated entirely via script and can be navigated without any page refreshes.
* @module    calendar
* @title    Calendar
* @namespace  YAHOO.widget
* @requires  yahoo,dom,event
*/
(function(){

	var Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		Lang = YAHOO.lang,
		DateMath = YAHOO.widget.DateMath;

/**
* Calendar is the base class for the Calendar widget. In its most basic
* implementation, it has the ability to render a calendar widget on the page
* that can be manipulated to select a single date, move back and forth between
* months and years.
* <p>To construct the placeholder for the calendar widget, the code is as
* follows:
*	<xmp>
*		<div id="calContainer"></div>
*	</xmp>
* </p>
* <p>
* <strong>NOTE: As of 2.4.0, the constructor's ID argument is optional.</strong>
* The Calendar can be constructed by simply providing a container ID string, 
* or a reference to a container DIV HTMLElement (the element needs to exist 
* in the document).
* 
* E.g.:
*	<xmp>
*		var c = new YAHOO.widget.Calendar("calContainer", configOptions);
*	</xmp>
* or:
*   <xmp>
*       var containerDiv = YAHOO.util.Dom.get("calContainer");
*		var c = new YAHOO.widget.Calendar(containerDiv, configOptions);
*	</xmp>
* </p>
* <p>
* If not provided, the ID will be generated from the container DIV ID by adding an "_t" suffix.
* For example if an ID is not provided, and the container's ID is "calContainer", the Calendar's ID will be set to "calContainer_t".
* </p>
* 
* @namespace YAHOO.widget
* @class Calendar
* @constructor
* @param {String} id optional The id of the table element that will represent the Calendar widget. As of 2.4.0, this argument is optional.
* @param {String | HTMLElement} container The id of the container div element that will wrap the Calendar table, or a reference to a DIV element which exists in the document.
* @param {Object} config optional The configuration object containing the initial configuration values for the Calendar.
*/
function Calendar(id, containerId, config) {
	this.init.apply(this, arguments);
}

/**
* The path to be used for images loaded for the Calendar
* @property YAHOO.widget.Calendar.IMG_ROOT
* @static
* @deprecated	You can now customize images by overriding the calclose, calnavleft and calnavright default CSS classes for the close icon, left arrow and right arrow respectively
* @type String
*/
Calendar.IMG_ROOT = null;

/**
* Type constant used for renderers to represent an individual date (M/D/Y)
* @property YAHOO.widget.Calendar.DATE
* @static
* @final
* @type String
*/
Calendar.DATE = "D";

/**
* Type constant used for renderers to represent an individual date across any year (M/D)
* @property YAHOO.widget.Calendar.MONTH_DAY
* @static
* @final
* @type String
*/
Calendar.MONTH_DAY = "MD";

/**
* Type constant used for renderers to represent a weekday
* @property YAHOO.widget.Calendar.WEEKDAY
* @static
* @final
* @type String
*/
Calendar.WEEKDAY = "WD";

/**
* Type constant used for renderers to represent a range of individual dates (M/D/Y-M/D/Y)
* @property YAHOO.widget.Calendar.RANGE
* @static
* @final
* @type String
*/
Calendar.RANGE = "R";

/**
* Type constant used for renderers to represent a month across any year
* @property YAHOO.widget.Calendar.MONTH
* @static
* @final
* @type String
*/
Calendar.MONTH = "M";

/**
* Constant that represents the total number of date cells that are displayed in a given month
* @property YAHOO.widget.Calendar.DISPLAY_DAYS
* @static
* @final
* @type Number
*/
Calendar.DISPLAY_DAYS = 42;

/**
* Constant used for halting the execution of the remainder of the render stack
* @property YAHOO.widget.Calendar.STOP_RENDER
* @static
* @final
* @type String
*/
Calendar.STOP_RENDER = "S";

/**
* Constant used to represent short date field string formats (e.g. Tu or Feb)
* @property YAHOO.widget.Calendar.SHORT
* @static
* @final
* @type String
*/
Calendar.SHORT = "short";

/**
* Constant used to represent long date field string formats (e.g. Monday or February)
* @property YAHOO.widget.Calendar.LONG
* @static
* @final
* @type String
*/
Calendar.LONG = "long";

/**
* Constant used to represent medium date field string formats (e.g. Mon)
* @property YAHOO.widget.Calendar.MEDIUM
* @static
* @final
* @type String
*/
Calendar.MEDIUM = "medium";

/**
* Constant used to represent single character date field string formats (e.g. M, T, W)
* @property YAHOO.widget.Calendar.ONE_CHAR
* @static
* @final
* @type String
*/
Calendar.ONE_CHAR = "1char";

/**
* The set of default Config property keys and values for the Calendar
* @property YAHOO.widget.Calendar._DEFAULT_CONFIG
* @final
* @static
* @private
* @type Object
*/
Calendar._DEFAULT_CONFIG = {
	// Default values for pagedate and selected are not class level constants - they are set during instance creation 
	PAGEDATE : {key:"pagedate", value:null},
	SELECTED : {key:"selected", value:null},
	TITLE : {key:"title", value:""},
	CLOSE : {key:"close", value:false},
	IFRAME : {key:"iframe", value:(YAHOO.env.ua.ie && YAHOO.env.ua.ie <= 6) ? true : false},
	MINDATE : {key:"mindate", value:null},
	MAXDATE : {key:"maxdate", value:null},
	MULTI_SELECT : {key:"multi_select", value:false},
	START_WEEKDAY : {key:"start_weekday", value:0},
	SHOW_WEEKDAYS : {key:"show_weekdays", value:true},
	SHOW_WEEK_HEADER : {key:"show_week_header", value:false},
	SHOW_WEEK_FOOTER : {key:"show_week_footer", value:false},
	HIDE_BLANK_WEEKS : {key:"hide_blank_weeks", value:false},
	NAV_ARROW_LEFT: {key:"nav_arrow_left", value:null} ,
	NAV_ARROW_RIGHT : {key:"nav_arrow_right", value:null} ,
	MONTHS_SHORT : {key:"months_short", value:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]},
	MONTHS_LONG: {key:"months_long", value:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]},
	WEEKDAYS_1CHAR: {key:"weekdays_1char", value:["S", "M", "T", "W", "T", "F", "S"]},
	WEEKDAYS_SHORT: {key:"weekdays_short", value:["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]},
	WEEKDAYS_MEDIUM: {key:"weekdays_medium", value:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
	WEEKDAYS_LONG: {key:"weekdays_long", value:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]},
	LOCALE_MONTHS:{key:"locale_months", value:"long"},
	LOCALE_WEEKDAYS:{key:"locale_weekdays", value:"short"},
	DATE_DELIMITER:{key:"date_delimiter", value:","},
	DATE_FIELD_DELIMITER:{key:"date_field_delimiter", value:"/"},
	DATE_RANGE_DELIMITER:{key:"date_range_delimiter", value:"-"},
	MY_MONTH_POSITION:{key:"my_month_position", value:1},
	MY_YEAR_POSITION:{key:"my_year_position", value:2},
	MD_MONTH_POSITION:{key:"md_month_position", value:1},
	MD_DAY_POSITION:{key:"md_day_position", value:2},
	MDY_MONTH_POSITION:{key:"mdy_month_position", value:1},
	MDY_DAY_POSITION:{key:"mdy_day_position", value:2},
	MDY_YEAR_POSITION:{key:"mdy_year_position", value:3},
	MY_LABEL_MONTH_POSITION:{key:"my_label_month_position", value:1},
	MY_LABEL_YEAR_POSITION:{key:"my_label_year_position", value:2},
	MY_LABEL_MONTH_SUFFIX:{key:"my_label_month_suffix", value:" "},
	MY_LABEL_YEAR_SUFFIX:{key:"my_label_year_suffix", value:""},
	NAV: {key:"navigator", value: null},
	STRINGS : { 
		key:"strings",
		value: {
			previousMonth : "Previous Month",
			nextMonth : "Next Month",
			close: "Close"
		},
		supercedes : ["close", "title"]
	}
};

var DEF_CFG = Calendar._DEFAULT_CONFIG;

/**
* The set of Custom Event types supported by the Calendar
* @property YAHOO.widget.Calendar._EVENT_TYPES
* @final
* @static
* @private
* @type Object
*/
Calendar._EVENT_TYPES = {
	BEFORE_SELECT : "beforeSelect", 
	SELECT : "select",
	BEFORE_DESELECT : "beforeDeselect",
	DESELECT : "deselect",
	CHANGE_PAGE : "changePage",
	BEFORE_RENDER : "beforeRender",
	RENDER : "render",
	BEFORE_DESTROY : "beforeDestroy",
	DESTROY : "destroy",
	RESET : "reset",
	CLEAR : "clear",
	BEFORE_HIDE : "beforeHide",
	HIDE : "hide",
	BEFORE_SHOW : "beforeShow",
	SHOW : "show",
	BEFORE_HIDE_NAV : "beforeHideNav",
	HIDE_NAV : "hideNav",
	BEFORE_SHOW_NAV : "beforeShowNav",
	SHOW_NAV : "showNav",
	BEFORE_RENDER_NAV : "beforeRenderNav",
	RENDER_NAV : "renderNav"
};

/**
* The set of default style constants for the Calendar
* @property YAHOO.widget.Calendar._STYLES
* @final
* @static
* @private
* @type Object
*/
Calendar._STYLES = {
	CSS_ROW_HEADER: "calrowhead",
	CSS_ROW_FOOTER: "calrowfoot",
	CSS_CELL : "calcell",
	CSS_CELL_SELECTOR : "selector",
	CSS_CELL_SELECTED : "selected",
	CSS_CELL_SELECTABLE : "selectable",
	CSS_CELL_RESTRICTED : "restricted",
	CSS_CELL_TODAY : "today",
	CSS_CELL_OOM : "oom",
	CSS_CELL_OOB : "previous",
	CSS_HEADER : "calheader",
	CSS_HEADER_TEXT : "calhead",
	CSS_BODY : "calbody",
	CSS_WEEKDAY_CELL : "calweekdaycell",
	CSS_WEEKDAY_ROW : "calweekdayrow",
	CSS_FOOTER : "calfoot",
	CSS_CALENDAR : "yui-calendar",
	CSS_SINGLE : "single",
	CSS_CONTAINER : "yui-calcontainer",
	CSS_NAV_LEFT : "calnavleft",
	CSS_NAV_RIGHT : "calnavright",
	CSS_NAV : "calnav",
	CSS_CLOSE : "calclose",
	CSS_CELL_TOP : "calcelltop",
	CSS_CELL_LEFT : "calcellleft",
	CSS_CELL_RIGHT : "calcellright",
	CSS_CELL_BOTTOM : "calcellbottom",
	CSS_CELL_HOVER : "calcellhover",
	CSS_CELL_HIGHLIGHT1 : "highlight1",
	CSS_CELL_HIGHLIGHT2 : "highlight2",
	CSS_CELL_HIGHLIGHT3 : "highlight3",
	CSS_CELL_HIGHLIGHT4 : "highlight4"
};

Calendar.prototype = {

	/**
	* The configuration object used to set up the calendars various locale and style options.
	* @property Config
	* @private
	* @deprecated Configuration properties should be set by calling Calendar.cfg.setProperty.
	* @type Object
	*/
	Config : null,

	/**
	* The parent CalendarGroup, only to be set explicitly by the parent group
	* @property parent
	* @type CalendarGroup
	*/	
	parent : null,

	/**
	* The index of this item in the parent group
	* @property index
	* @type Number
	*/
	index : -1,

	/**
	* The collection of calendar table cells
	* @property cells
	* @type HTMLTableCellElement[]
	*/
	cells : null,

	/**
	* The collection of calendar cell dates that is parallel to the cells collection. The array contains dates field arrays in the format of [YYYY, M, D].
	* @property cellDates
	* @type Array[](Number[])
	*/
	cellDates : null,

	/**
	* The id that uniquely identifies this Calendar.
	* @property id
	* @type String
	*/
	id : null,

	/**
	* The unique id associated with the Calendar's container
	* @property containerId
	* @type String
	*/
	containerId: null,

	/**
	* The DOM element reference that points to this calendar's container element. The calendar will be inserted into this element when the shell is rendered.
	* @property oDomContainer
	* @type HTMLElement
	*/
	oDomContainer : null,

	/**
	* A Date object representing today's date.
	* @property today
	* @type Date
	*/
	today : null,

	/**
	* The list of render functions, along with required parameters, used to render cells. 
	* @property renderStack
	* @type Array[]
	*/
	renderStack : null,

	/**
	* A copy of the initial render functions created before rendering.
	* @property _renderStack
	* @private
	* @type Array
	*/
	_renderStack : null,

	/**
	* A reference to the CalendarNavigator instance created for this Calendar.
	* Will be null if the "navigator" configuration property has not been set
	* @property oNavigator
	* @type CalendarNavigator
	*/
	oNavigator : null,

	/**
	* The private list of initially selected dates.
	* @property _selectedDates
	* @private
	* @type Array
	*/
	_selectedDates : null,

	/**
	* A map of DOM event handlers to attach to cells associated with specific CSS class names
	* @property domEventMap
	* @type Object
	*/
	domEventMap : null,

	/**
	 * Protected helper used to parse Calendar constructor/init arguments.
	 *
	 * As of 2.4.0, Calendar supports a simpler constructor 
	 * signature. This method reconciles arguments
	 * received in the pre 2.4.0 and 2.4.0 formats.
	 * 
	 * @protected
	 * @method _parseArgs
	 * @param {Array} Function "arguments" array
	 * @return {Object} Object with id, container, config properties containing
	 * the reconciled argument values.
	 **/
	_parseArgs : function(args) {
		/*
		   2.4.0 Constructors signatures

		   new Calendar(String)
		   new Calendar(HTMLElement)
		   new Calendar(String, ConfigObject)
		   new Calendar(HTMLElement, ConfigObject)

		   Pre 2.4.0 Constructor signatures

		   new Calendar(String, String)
		   new Calendar(String, HTMLElement)
		   new Calendar(String, String, ConfigObject)
		   new Calendar(String, HTMLElement, ConfigObject)
		 */
		var nArgs = {id:null, container:null, config:null};

		if (args && args.length && args.length > 0) {
			switch (args.length) {
				case 1:
					nArgs.id = null;
					nArgs.container = args[0];
					nArgs.config = null;
					break;
				case 2:
					if (Lang.isObject(args[1]) && !args[1].tagName && !(args[1] instanceof String)) {
						nArgs.id = null;
						nArgs.container = args[0];
						nArgs.config = args[1];
					} else {
						nArgs.id = args[0];
						nArgs.container = args[1];
						nArgs.config = null;
					}
					break;
				default: // 3+
					nArgs.id = args[0];
					nArgs.container = args[1];
					nArgs.config = args[2];
					break;
			}
		} else {
			this.logger.log("Invalid constructor/init arguments", "error");
		}
		return nArgs;
	},

	/**
	* Initializes the Calendar widget.
	* @method init
	*
	* @param {String} id optional The id of the table element that will represent the Calendar widget. As of 2.4.0, this argument is optional.
	* @param {String | HTMLElement} container The id of the container div element that will wrap the Calendar table, or a reference to a DIV element which exists in the document.
	* @param {Object} config optional The configuration object containing the initial configuration values for the Calendar.
	*/
	init : function(id, container, config) {
		// Normalize 2.4.0, pre 2.4.0 args
		var nArgs = this._parseArgs(arguments);

		id = nArgs.id;
		container = nArgs.container;
		config = nArgs.config;

		this.oDomContainer = Dom.get(container);
		if (!this.oDomContainer) { this.logger.log("Container not found in document.", "error"); }

		if (!this.oDomContainer.id) {
			this.oDomContainer.id = Dom.generateId();
		}
		if (!id) {
			id = this.oDomContainer.id + "_t";
		}

		this.id = id;
		this.containerId = this.oDomContainer.id;

		this.logger = new YAHOO.widget.LogWriter("Calendar " + this.id);
		this.initEvents();

		this.today = new Date();
		DateMath.clearTime(this.today);

		/**
		* The Config object used to hold the configuration variables for the Calendar
		* @property cfg
		* @type YAHOO.util.Config
		*/
		this.cfg = new YAHOO.util.Config(this);

		/**
		* The local object which contains the Calendar's options
		* @property Options
		* @type Object
		*/
		this.Options = {};

		/**
		* The local object which contains the Calendar's locale settings
		* @property Locale
		* @type Object
		*/
		this.Locale = {};

		this.initStyles();

		Dom.addClass(this.oDomContainer, this.Style.CSS_CONTAINER);
		Dom.addClass(this.oDomContainer, this.Style.CSS_SINGLE);

		this.cellDates = [];
		this.cells = [];
		this.renderStack = [];
		this._renderStack = [];

		this.setupConfig();

		if (config) {
			this.cfg.applyConfig(config, true);
		}

		this.cfg.fireQueue();
	},

	/**
	* Default Config listener for the iframe property. If the iframe config property is set to true, 
	* renders the built-in IFRAME shim if the container is relatively or absolutely positioned.
	* 
	* @method configIframe
	*/
	configIframe : function(type, args, obj) {
		var useIframe = args[0];
	
		if (!this.parent) {
			if (Dom.inDocument(this.oDomContainer)) {
				if (useIframe) {
					var pos = Dom.getStyle(this.oDomContainer, "position");
					
					if (pos == "absolute" || pos == "relative") {
						
						if (!Dom.inDocument(this.iframe)) {
							this.iframe = document.createElement("iframe");
							this.iframe.src = "javascript:false;";
	
							Dom.setStyle(this.iframe, "opacity", "0");
	
							if (YAHOO.env.ua.ie && YAHOO.env.ua.ie <= 6) {
								Dom.addClass(this.iframe, "fixedsize");
							}
	
							this.oDomContainer.insertBefore(this.iframe, this.oDomContainer.firstChild);
						}
					}
				} else {
					if (this.iframe) {
						if (this.iframe.parentNode) {
							this.iframe.parentNode.removeChild(this.iframe);
						}
						this.iframe = null;
					}
				}
			}
		}
	},

	/**
	* Default handler for the "title" property
	* @method configTitle
	*/
	configTitle : function(type, args, obj) {
		var title = args[0];

		// "" disables title bar
		if (title) {
			this.createTitleBar(title);
		} else {
			var close = this.cfg.getProperty(DEF_CFG.CLOSE.key);
			if (!close) {
				this.removeTitleBar();
			} else {
				this.createTitleBar("&#160;");
			}
		}
	},
	
	/**
	* Default handler for the "close" property
	* @method configClose
	*/
	configClose : function(type, args, obj) {
		var close = args[0],
			title = this.cfg.getProperty(DEF_CFG.TITLE.key);
	
		if (close) {
			if (!title) {
				this.createTitleBar("&#160;");
			}
			this.createCloseButton();
		} else {
			this.removeCloseButton();
			if (!title) {
				this.removeTitleBar();
			}
		}
	},

	/**
	* Initializes Calendar's built-in CustomEvents
	* @method initEvents
	*/
	initEvents : function() {

		var defEvents = Calendar._EVENT_TYPES,
			CE = YAHOO.util.CustomEvent,
			cal = this; // To help with minification

		/**
		* Fired before a date selection is made
		* @event beforeSelectEvent
		*/
		cal.beforeSelectEvent = new CE(defEvents.BEFORE_SELECT); 

		/**
		* Fired when a date selection is made
		* @event selectEvent
		* @param {Array}	Array of Date field arrays in the format [YYYY, MM, DD].
		*/
		cal.selectEvent = new CE(defEvents.SELECT);

		/**
		* Fired before a date or set of dates is deselected
		* @event beforeDeselectEvent
		*/
		cal.beforeDeselectEvent = new CE(defEvents.BEFORE_DESELECT);

		/**
		* Fired when a date or set of dates is deselected
		* @event deselectEvent
		* @param {Array}	Array of Date field arrays in the format [YYYY, MM, DD].
		*/
		cal.deselectEvent = new CE(defEvents.DESELECT);
	
		/**
		* Fired when the Calendar page is changed
		* @event changePageEvent
		*/
		cal.changePageEvent = new CE(defEvents.CHANGE_PAGE);
	
		/**
		* Fired before the Calendar is rendered
		* @event beforeRenderEvent
		*/
		cal.beforeRenderEvent = new CE(defEvents.BEFORE_RENDER);
	
		/**
		* Fired when the Calendar is rendered
		* @event renderEvent
		*/
		cal.renderEvent = new CE(defEvents.RENDER);

		/**
		* Fired just before the Calendar is to be destroyed
		* @event beforeDestroyEvent
		*/
		cal.beforeDestroyEvent = new CE(defEvents.BEFORE_DESTROY);

		/**
		* Fired after the Calendar is destroyed. This event should be used
		* for notification only. When this event is fired, important Calendar instance
		* properties, dom references and event listeners have already been 
		* removed/dereferenced, and hence the Calendar instance is not in a usable 
		* state.
		*
		* @event destroyEvent
		*/
		cal.destroyEvent = new CE(defEvents.DESTROY);

		/**
		* Fired when the Calendar is reset
		* @event resetEvent
		*/
		cal.resetEvent = new CE(defEvents.RESET);

		/**
		* Fired when the Calendar is cleared
		* @event clearEvent
		*/
		cal.clearEvent = new CE(defEvents.CLEAR);

		/**
		* Fired just before the Calendar is to be shown
		* @event beforeShowEvent
		*/
		cal.beforeShowEvent = new CE(defEvents.BEFORE_SHOW);

		/**
		* Fired after the Calendar is shown
		* @event showEvent
		*/
		cal.showEvent = new CE(defEvents.SHOW);

		/**
		* Fired just before the Calendar is to be hidden
		* @event beforeHideEvent
		*/
		cal.beforeHideEvent = new CE(defEvents.BEFORE_HIDE);

		/**
		* Fired after the Calendar is hidden
		* @event hideEvent
		*/
		cal.hideEvent = new CE(defEvents.HIDE);

		/**
		* Fired just before the CalendarNavigator is to be shown
		* @event beforeShowNavEvent
		*/
		cal.beforeShowNavEvent = new CE(defEvents.BEFORE_SHOW_NAV);
	
		/**
		* Fired after the CalendarNavigator is shown
		* @event showNavEvent
		*/
		cal.showNavEvent = new CE(defEvents.SHOW_NAV);
	
		/**
		* Fired just before the CalendarNavigator is to be hidden
		* @event beforeHideNavEvent
		*/
		cal.beforeHideNavEvent = new CE(defEvents.BEFORE_HIDE_NAV);
	
		/**
		* Fired after the CalendarNavigator is hidden
		* @event hideNavEvent
		*/
		cal.hideNavEvent = new CE(defEvents.HIDE_NAV);

		/**
		* Fired just before the CalendarNavigator is to be rendered
		* @event beforeRenderNavEvent
		*/
		cal.beforeRenderNavEvent = new CE(defEvents.BEFORE_RENDER_NAV);

		/**
		* Fired after the CalendarNavigator is rendered
		* @event renderNavEvent
		*/
		cal.renderNavEvent = new CE(defEvents.RENDER_NAV);

		cal.beforeSelectEvent.subscribe(cal.onBeforeSelect, this, true);
		cal.selectEvent.subscribe(cal.onSelect, this, true);
		cal.beforeDeselectEvent.subscribe(cal.onBeforeDeselect, this, true);
		cal.deselectEvent.subscribe(cal.onDeselect, this, true);
		cal.changePageEvent.subscribe(cal.onChangePage, this, true);
		cal.renderEvent.subscribe(cal.onRender, this, true);
		cal.resetEvent.subscribe(cal.onReset, this, true);
		cal.clearEvent.subscribe(cal.onClear, this, true);
	},

	/**
	* The default event handler for clicks on the "Previous Month" navigation UI
	*
	* @method doPreviousMonthNav
	* @param {DOMEvent} e	The DOM event
	* @param {Calendar} cal	A reference to the calendar
	*/
	doPreviousMonthNav : function(e, cal) {
		Event.preventDefault(e);
		// previousMonth invoked in a timeout, to allow
		// event to bubble up, with correct target. Calling
		// previousMonth, will call render which will remove 
		// HTML which generated the event, resulting in an 
		// invalid event target in certain browsers.
		setTimeout(function() {
			cal.previousMonth();
			var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_LEFT, "a", cal.oDomContainer);
			if (navs && navs[0]) {
				try {
					navs[0].focus();
				} catch (e) {
					// ignore
				}
			}
		}, 0);
	},

	/**
	 * The default event handler for clicks on the "Next Month" navigation UI
	 *
	 * @method doNextMonthNav
	 * @param {DOMEvent} e	The DOM event
	 * @param {Calendar} cal	A reference to the calendar
	 */
	doNextMonthNav : function(e, cal) {
		Event.preventDefault(e);
		setTimeout(function() {
			cal.nextMonth();
			var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_RIGHT, "a", cal.oDomContainer);
			if (navs && navs[0]) {
				try {
					navs[0].focus();
				} catch (e) {
					// ignore
				}
			}
		}, 0);
	},

	/**
	* The default event handler for date cell selection. Currently attached to 
	* the Calendar's bounding box, referenced by it's <a href="#property_oDomContainer">oDomContainer</a> property.
	*
	* @method doSelectCell
	* @param {DOMEvent} e	The DOM event
	* @param {Calendar} cal	A reference to the calendar
	*/
	doSelectCell : function(e, cal) {
		var cell, d, date, index;

		var target = Event.getTarget(e),
			tagName = target.tagName.toLowerCase(),
			defSelector = false;

		while (tagName != "td" && !Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {

			if (!defSelector && tagName == "a" && Dom.hasClass(target, cal.Style.CSS_CELL_SELECTOR)) {
				defSelector = true;
			}

			target = target.parentNode;
			tagName = target.tagName.toLowerCase();

			if (target == this.oDomContainer || tagName == "html") {
				return;
			}
		}

		if (defSelector) {
			// Stop link href navigation for default renderer
			Event.preventDefault(e);
		}
	
		cell = target;

		if (Dom.hasClass(cell, cal.Style.CSS_CELL_SELECTABLE)) {
			index = cal.getIndexFromId(cell.id);
			if (index > -1) {
				d = cal.cellDates[index];
				if (d) {
					date = DateMath.getDate(d[0],d[1]-1,d[2]);
				
					var link;

					cal.logger.log("Selecting cell " + index + " via click", "info");
					if (cal.Options.MULTI_SELECT) {
						link = cell.getElementsByTagName("a")[0];
						if (link) {
							link.blur();
						}

						var cellDate = cal.cellDates[index];
						var cellDateIndex = cal._indexOfSelectedFieldArray(cellDate);

						if (cellDateIndex > -1) {	
							cal.deselectCell(index);
						} else {
							cal.selectCell(index);
						}	

					} else {
						link = cell.getElementsByTagName("a")[0];
						if (link) {
							link.blur();
						}
						cal.selectCell(index);
					}
				}
			}
		}
	},

	/**
	* The event that is executed when the user hovers over a cell
	* @method doCellMouseOver
	* @param {DOMEvent} e	The event
	* @param {Calendar} cal	A reference to the calendar passed by the Event utility
	*/
	doCellMouseOver : function(e, cal) {
		var target;
		if (e) {
			target = Event.getTarget(e);
		} else {
			target = this;
		}

		while (target.tagName && target.tagName.toLowerCase() != "td") {
			target = target.parentNode;
			if (!target.tagName || target.tagName.toLowerCase() == "html") {
				return;
			}
		}

		if (Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {
			Dom.addClass(target, cal.Style.CSS_CELL_HOVER);
		}
	},

	/**
	* The event that is executed when the user moves the mouse out of a cell
	* @method doCellMouseOut
	* @param {DOMEvent} e	The event
	* @param {Calendar} cal	A reference to the calendar passed by the Event utility
	*/
	doCellMouseOut : function(e, cal) {
		var target;
		if (e) {
			target = Event.getTarget(e);
		} else {
			target = this;
		}

		while (target.tagName && target.tagName.toLowerCase() != "td") {
			target = target.parentNode;
			if (!target.tagName || target.tagName.toLowerCase() == "html") {
				return;
			}
		}

		if (Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {
			Dom.removeClass(target, cal.Style.CSS_CELL_HOVER);
		}
	},

	setupConfig : function() {
		var cfg = this.cfg;

		/**
		* The month/year representing the current visible Calendar date (mm/yyyy)
		* @config pagedate
		* @type String | Date
		* @default today's date
		*/
		cfg.addProperty(DEF_CFG.PAGEDATE.key, { value:new Date(), handler:this.configPageDate } );

		/**
		* The date or range of dates representing the current Calendar selection
		* @config selected
		* @type String
		* @default []
		*/
		cfg.addProperty(DEF_CFG.SELECTED.key, { value:[], handler:this.configSelected } );

		/**
		* The title to display above the Calendar's month header
		* @config title
		* @type String
		* @default ""
		*/
		cfg.addProperty(DEF_CFG.TITLE.key, { value:DEF_CFG.TITLE.value, handler:this.configTitle } );

		/**
		* Whether or not a close button should be displayed for this Calendar
		* @config close
		* @type Boolean
		* @default false
		*/
		cfg.addProperty(DEF_CFG.CLOSE.key, { value:DEF_CFG.CLOSE.value, handler:this.configClose } );

		/**
		* Whether or not an iframe shim should be placed under the Calendar to prevent select boxes from bleeding through in Internet Explorer 6 and below.
		* This property is enabled by default for IE6 and below. It is disabled by default for other browsers for performance reasons, but can be 
		* enabled if required.
		* 
		* @config iframe
		* @type Boolean
		* @default true for IE6 and below, false for all other browsers
		*/
		cfg.addProperty(DEF_CFG.IFRAME.key, { value:DEF_CFG.IFRAME.value, handler:this.configIframe, validator:cfg.checkBoolean } );

		/**
		* The minimum selectable date in the current Calendar (mm/dd/yyyy)
		* @config mindate
		* @type String | Date
		* @default null
		*/
		cfg.addProperty(DEF_CFG.MINDATE.key, { value:DEF_CFG.MINDATE.value, handler:this.configMinDate } );

		/**
		* The maximum selectable date in the current Calendar (mm/dd/yyyy)
		* @config maxdate
		* @type String | Date
		* @default null
		*/
		cfg.addProperty(DEF_CFG.MAXDATE.key, { value:DEF_CFG.MAXDATE.value, handler:this.configMaxDate } );
	
	
		// Options properties
	
		/**
		* True if the Calendar should allow multiple selections. False by default.
		* @config MULTI_SELECT
		* @type Boolean
		* @default false
		*/
		cfg.addProperty(DEF_CFG.MULTI_SELECT.key,	{ value:DEF_CFG.MULTI_SELECT.value, handler:this.configOptions, validator:cfg.checkBoolean } );

		/**
		* The weekday the week begins on. Default is 0 (Sunday = 0, Monday = 1 ... Saturday = 6).
		* @config START_WEEKDAY
		* @type number
		* @default 0
		*/
		cfg.addProperty(DEF_CFG.START_WEEKDAY.key,	{ value:DEF_CFG.START_WEEKDAY.value, handler:this.configOptions, validator:cfg.checkNumber  } );
	
		/**
		* True if the Calendar should show weekday labels. True by default.
		* @config SHOW_WEEKDAYS
		* @type Boolean
		* @default true
		*/
		cfg.addProperty(DEF_CFG.SHOW_WEEKDAYS.key,	{ value:DEF_CFG.SHOW_WEEKDAYS.value, handler:this.configOptions, validator:cfg.checkBoolean  } );
	
		/**
		* True if the Calendar should show week row headers. False by default.
		* @config SHOW_WEEK_HEADER
		* @type Boolean
		* @default false
		*/
		cfg.addProperty(DEF_CFG.SHOW_WEEK_HEADER.key, { value:DEF_CFG.SHOW_WEEK_HEADER.value, handler:this.configOptions, validator:cfg.checkBoolean } );
	
		/**
		* True if the Calendar should show week row footers. False by default.
		* @config SHOW_WEEK_FOOTER
		* @type Boolean
		* @default false
		*/	
		cfg.addProperty(DEF_CFG.SHOW_WEEK_FOOTER.key,{ value:DEF_CFG.SHOW_WEEK_FOOTER.value, handler:this.configOptions, validator:cfg.checkBoolean } );
	
		/**
		* True if the Calendar should suppress weeks that are not a part of the current month. False by default.
		* @config HIDE_BLANK_WEEKS
		* @type Boolean
		* @default false
		*/	
		cfg.addProperty(DEF_CFG.HIDE_BLANK_WEEKS.key, { value:DEF_CFG.HIDE_BLANK_WEEKS.value, handler:this.configOptions, validator:cfg.checkBoolean } );
		
		/**
		* The image that should be used for the left navigation arrow.
		* @config NAV_ARROW_LEFT
		* @type String
		* @deprecated	You can customize the image by overriding the default CSS class for the left arrow - "calnavleft"  
		* @default null
		*/	
		cfg.addProperty(DEF_CFG.NAV_ARROW_LEFT.key,	{ value:DEF_CFG.NAV_ARROW_LEFT.value, handler:this.configOptions } );
	
		/**
		* The image that should be used for the right navigation arrow.
		* @config NAV_ARROW_RIGHT
		* @type String
		* @deprecated	You can customize the image by overriding the default CSS class for the right arrow - "calnavright"
		* @default null
		*/	
		cfg.addProperty(DEF_CFG.NAV_ARROW_RIGHT.key, { value:DEF_CFG.NAV_ARROW_RIGHT.value, handler:this.configOptions } );
	
		// Locale properties
	
		/**
		* The short month labels for the current locale.
		* @config MONTHS_SHORT
		* @type String[]
		* @default ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		*/
		cfg.addProperty(DEF_CFG.MONTHS_SHORT.key,	{ value:DEF_CFG.MONTHS_SHORT.value, handler:this.configLocale } );
		
		/**
		* The long month labels for the current locale.
		* @config MONTHS_LONG
		* @type String[]
		* @default ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		*/	
		cfg.addProperty(DEF_CFG.MONTHS_LONG.key,		{ value:DEF_CFG.MONTHS_LONG.value, handler:this.configLocale } );

		/**
		* The 1-character weekday labels for the current locale.
		* @config WEEKDAYS_1CHAR
		* @type String[]
		* @default ["S", "M", "T", "W", "T", "F", "S"]
		*/	
		cfg.addProperty(DEF_CFG.WEEKDAYS_1CHAR.key,	{ value:DEF_CFG.WEEKDAYS_1CHAR.value, handler:this.configLocale } );
		
		/**
		* The short weekday labels for the current locale.
		* @config WEEKDAYS_SHORT
		* @type String[]
		* @default ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
		*/	
		cfg.addProperty(DEF_CFG.WEEKDAYS_SHORT.key,	{ value:DEF_CFG.WEEKDAYS_SHORT.value, handler:this.configLocale } );
		
		/**
		* The medium weekday labels for the current locale.
		* @config WEEKDAYS_MEDIUM
		* @type String[]
		* @default ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		*/	
		cfg.addProperty(DEF_CFG.WEEKDAYS_MEDIUM.key,	{ value:DEF_CFG.WEEKDAYS_MEDIUM.value, handler:this.configLocale } );
		
		/**
		* The long weekday labels for the current locale.
		* @config WEEKDAYS_LONG
		* @type String[]
		* @default ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		*/	
		cfg.addProperty(DEF_CFG.WEEKDAYS_LONG.key,	{ value:DEF_CFG.WEEKDAYS_LONG.value, handler:this.configLocale } );
	
		/**
		* Refreshes the locale values used to build the Calendar.
		* @method refreshLocale
		* @private
		*/
		var refreshLocale = function() {
			cfg.refireEvent(DEF_CFG.LOCALE_MONTHS.key);
			cfg.refireEvent(DEF_CFG.LOCALE_WEEKDAYS.key);
		};
	
		cfg.subscribeToConfigEvent(DEF_CFG.START_WEEKDAY.key, refreshLocale, this, true);
		cfg.subscribeToConfigEvent(DEF_CFG.MONTHS_SHORT.key, refreshLocale, this, true);
		cfg.subscribeToConfigEvent(DEF_CFG.MONTHS_LONG.key, refreshLocale, this, true);
		cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_1CHAR.key, refreshLocale, this, true);
		cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_SHORT.key, refreshLocale, this, true);
		cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_MEDIUM.key, refreshLocale, this, true);
		cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_LONG.key, refreshLocale, this, true);
		
		/**
		* The setting that determines which length of month labels should be used. Possible values are "short" and "long".
		* @config LOCALE_MONTHS
		* @type String
		* @default "long"
		*/	
		cfg.addProperty(DEF_CFG.LOCALE_MONTHS.key,	{ value:DEF_CFG.LOCALE_MONTHS.value, handler:this.configLocaleValues } );
		
		/**
		* The setting that determines which length of weekday labels should be used. Possible values are "1char", "short", "medium", and "long".
		* @config LOCALE_WEEKDAYS
		* @type String
		* @default "short"
		*/	
		cfg.addProperty(DEF_CFG.LOCALE_WEEKDAYS.key,	{ value:DEF_CFG.LOCALE_WEEKDAYS.value, handler:this.configLocaleValues } );
	
		/**
		* The value used to delimit individual dates in a date string passed to various Calendar functions.
		* @config DATE_DELIMITER
		* @type String
		* @default ","
		*/	
		cfg.addProperty(DEF_CFG.DATE_DELIMITER.key,		{ value:DEF_CFG.DATE_DELIMITER.value, handler:this.configLocale } );
	
		/**
		* The value used to delimit date fields in a date string passed to various Calendar functions.
		* @config DATE_FIELD_DELIMITER
		* @type String
		* @default "/"
		*/	
		cfg.addProperty(DEF_CFG.DATE_FIELD_DELIMITER.key, { value:DEF_CFG.DATE_FIELD_DELIMITER.value, handler:this.configLocale } );
	
		/**
		* The value used to delimit date ranges in a date string passed to various Calendar functions.
		* @config DATE_RANGE_DELIMITER
		* @type String
		* @default "-"
		*/
		cfg.addProperty(DEF_CFG.DATE_RANGE_DELIMITER.key, { value:DEF_CFG.DATE_RANGE_DELIMITER.value, handler:this.configLocale } );
	
		/**
		* The position of the month in a month/year date string
		* @config MY_MONTH_POSITION
		* @type Number
		* @default 1
		*/
		cfg.addProperty(DEF_CFG.MY_MONTH_POSITION.key,	{ value:DEF_CFG.MY_MONTH_POSITION.value, handler:this.configLocale, validator:cfg.checkNumber } );
	
		/**
		* The position of the year in a month/year date string
		* @config MY_YEAR_POSITION
		* @type Number
		* @default 2
		*/
		cfg.addProperty(DEF_CFG.MY_YEAR_POSITION.key,	{ value:DEF_CFG.MY_YEAR_POSITION.value, handler:this.configLocale, validator:cfg.checkNumber } );
	
		/**
		* The position of the month in a month/day date string
		* @config MD_MONTH_POSITION
		* @type Number
		* @default 1
		*/
		cfg.addProperty(DEF_CFG.MD_MONTH_POSITION.key,	{ value:DEF_CFG.MD_MONTH_POSITION.value, handler:this.configLocale, validator:cfg.checkNumber } );
	
		/**
		* The position of the day in a month/year date string
		* @config MD_DAY_POSITION
		* @type Number
		* @default 2
		*/
		cfg.addProperty(DEF_CFG.MD_DAY_POSITION.key,		{ value:DEF_CFG.MD_DAY_POSITION.value, handler:this.configLocale, validator:cfg.checkNumber } );
	
		/**
		* The position of the month in a month/day/year date string
		* @config MDY_MONTH_POSITION
		* @type Number
		* @default 1
		*/
		cfg.addProperty(DEF_CFG.MDY_MONTH_POSITION.key,	{ value:DEF_CFG.MDY_MONTH_POSITION.value, handler:this.configLocale, validator:cfg.checkNumber } );
	
		/**
		* The position of the day in a month/day/year date string
		* @config MDY_DAY_POSITION
		* @type Number
		* @default 2
		*/
		cfg.addProperty(DEF_CFG.MDY_DAY_POSITION.key,	{ value:DEF_CFG.MDY_DAY_POSITION.value, handler:this.configLocale, validator:cfg.checkNumber } );
	
		/**
		* The position of the year in a month/day/year date string
		* @config MDY_YEAR_POSITION
		* @type Number
		* @default 3
		*/
		cfg.addProperty(DEF_CFG.MDY_YEAR_POSITION.key,	{ value:DEF_CFG.MDY_YEAR_POSITION.value, handler:this.configLocale, validator:cfg.checkNumber } );
		
		/**
		* The position of the month in the month year label string used as the Calendar header
		* @config MY_LABEL_MONTH_POSITION
		* @type Number
		* @default 1
		*/
		cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_POSITION.key,	{ value:DEF_CFG.MY_LABEL_MONTH_POSITION.value, handler:this.configLocale, validator:cfg.checkNumber } );
	
		/**
		* The position of the year in the month year label string used as the Calendar header
		* @config MY_LABEL_YEAR_POSITION
		* @type Number
		* @default 2
		*/
		cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_POSITION.key,	{ value:DEF_CFG.MY_LABEL_YEAR_POSITION.value, handler:this.configLocale, validator:cfg.checkNumber } );
		
		/**
		* The suffix used after the month when rendering the Calendar header
		* @config MY_LABEL_MONTH_SUFFIX
		* @type String
		* @default " "
		*/
		cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_SUFFIX.key,	{ value:DEF_CFG.MY_LABEL_MONTH_SUFFIX.value, handler:this.configLocale } );
		
		/**
		* The suffix used after the year when rendering the Calendar header
		* @config MY_LABEL_YEAR_SUFFIX
		* @type String
		* @default ""
		*/
		cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_SUFFIX.key, { value:DEF_CFG.MY_LABEL_YEAR_SUFFIX.value, handler:this.configLocale } );

		/**
		* Configuration for the Month/Year CalendarNavigator UI which allows the user to jump directly to a 
		* specific Month/Year without having to scroll sequentially through months.
		* <p>
		* Setting this property to null (default value) or false, will disable the CalendarNavigator UI.
		* </p>
		* <p>
		* Setting this property to true will enable the CalendarNavigatior UI with the default CalendarNavigator configuration values.
		* </p>
		* <p>
		* This property can also be set to an object literal containing configuration properties for the CalendarNavigator UI.
		* The configuration object expects the the following case-sensitive properties, with the "strings" property being a nested object.
		* Any properties which are not provided will use the default values (defined in the CalendarNavigator class).
		* </p>
		* <dl>
		* <dt>strings</dt>
		* <dd><em>Object</em> :  An object with the properties shown below, defining the string labels to use in the Navigator's UI
		*     <dl>
		*         <dt>month</dt><dd><em>String</em> : The string to use for the month label. Defaults to "Month".</dd>
		*         <dt>year</dt><dd><em>String</em> : The string to use for the year label. Defaults to "Year".</dd>
		*         <dt>submit</dt><dd><em>String</em> : The string to use for the submit button label. Defaults to "Okay".</dd>
		*         <dt>cancel</dt><dd><em>String</em> : The string to use for the cancel button label. Defaults to "Cancel".</dd>
		*         <dt>invalidYear</dt><dd><em>String</em> : The string to use for invalid year values. Defaults to "Year needs to be a number".</dd>
		*     </dl>
		* </dd>
		* <dt>monthFormat</dt><dd><em>String</em> : The month format to use. Either YAHOO.widget.Calendar.LONG, or YAHOO.widget.Calendar.SHORT. Defaults to YAHOO.widget.Calendar.LONG</dd>
		* <dt>initialFocus</dt><dd><em>String</em> : Either "year" or "month" specifying which input control should get initial focus. Defaults to "year"</dd>
		* </dl>
		* <p>E.g.</p>
		* <pre>
		* var navConfig = {
		*	  strings: {
		*		  month:"Calendar Month",
		*		  year:"Calendar Year",
		*		  submit: "Submit",
		*		  cancel: "Cancel",
		*		  invalidYear: "Please enter a valid year"
		*	  },
		*	  monthFormat: YAHOO.widget.Calendar.SHORT,
		*	  initialFocus: "month"
		* }
		* </pre>
		* @config navigator
		* @type {Object|Boolean}
		* @default null
		*/
		cfg.addProperty(DEF_CFG.NAV.key, { value:DEF_CFG.NAV.value, handler:this.configNavigator } );

		/**
		 * The map of UI strings which the Calendar UI uses.
		 *
		 * @config strings
		 * @type {Object}
		 * @default An object with the properties shown below:
		 *     <dl>
		 *         <dt>previousMonth</dt><dd><em>String</em> : The string to use for the "Previous Month" navigation UI. Defaults to "Previous Month".</dd>
		 *         <dt>nextMonth</dt><dd><em>String</em> : The string to use for the "Next Month" navigation UI. Defaults to "Next Month".</dd>
		 *         <dt>close</dt><dd><em>String</em> : The string to use for the close button label. Defaults to "Close".</dd>
		 *     </dl>
		 */
		cfg.addProperty(DEF_CFG.STRINGS.key, { 
			value:DEF_CFG.STRINGS.value,
			handler:this.configStrings,
			validator: function(val) {
				return Lang.isObject(val);
			},
			supercedes:DEF_CFG.STRINGS.supercedes
		});
	},

	/**
	* The default handler for the "strings" property
	* @method configStrings
	*/
	configStrings : function(type, args, obj) {
		var val = Lang.merge(DEF_CFG.STRINGS.value, args[0]);
		this.cfg.setProperty(DEF_CFG.STRINGS.key, val, true);
	},

	/**
	* The default handler for the "pagedate" property
	* @method configPageDate
	*/
	configPageDate : function(type, args, obj) {
		this.cfg.setProperty(DEF_CFG.PAGEDATE.key, this._parsePageDate(args[0]), true);
	},

	/**
	* The default handler for the "mindate" property
	* @method configMinDate
	*/
	configMinDate : function(type, args, obj) {
		var val = args[0];
		if (Lang.isString(val)) {
			val = this._parseDate(val);
			this.cfg.setProperty(DEF_CFG.MINDATE.key, DateMath.getDate(val[0],(val[1]-1),val[2]));
		}
	},

	/**
	* The default handler for the "maxdate" property
	* @method configMaxDate
	*/
	configMaxDate : function(type, args, obj) {
		var val = args[0];
		if (Lang.isString(val)) {
			val = this._parseDate(val);
			this.cfg.setProperty(DEF_CFG.MAXDATE.key, DateMath.getDate(val[0],(val[1]-1),val[2]));
		}
	},

	/**
	* The default handler for the "selected" property
	* @method configSelected
	*/
	configSelected : function(type, args, obj) {
		var selected = args[0],
			cfgSelected = DEF_CFG.SELECTED.key;
		
		if (selected) {
			if (Lang.isString(selected)) {
				this.cfg.setProperty(cfgSelected, this._parseDates(selected), true);
			} 
		}
		if (! this._selectedDates) {
			this._selectedDates = this.cfg.getProperty(cfgSelected);
		}
	},
	
	/**
	* The default handler for all configuration options properties
	* @method configOptions
	*/
	configOptions : function(type, args, obj) {
		this.Options[type.toUpperCase()] = args[0];
	},

	/**
	* The default handler for all configuration locale properties
	* @method configLocale
	*/
	configLocale : function(type, args, obj) {
		this.Locale[type.toUpperCase()] = args[0];

		this.cfg.refireEvent(DEF_CFG.LOCALE_MONTHS.key);
		this.cfg.refireEvent(DEF_CFG.LOCALE_WEEKDAYS.key);
	},
	
	/**
	* The default handler for all configuration locale field length properties
	* @method configLocaleValues
	*/
	configLocaleValues : function(type, args, obj) {

		type = type.toLowerCase();

		var val = args[0],
			cfg = this.cfg,
			Locale = this.Locale;

		switch (type) {
			case DEF_CFG.LOCALE_MONTHS.key:
				switch (val) {
					case Calendar.SHORT:
						Locale.LOCALE_MONTHS = cfg.getProperty(DEF_CFG.MONTHS_SHORT.key).concat();
						break;
					case Calendar.LONG:
						Locale.LOCALE_MONTHS = cfg.getProperty(DEF_CFG.MONTHS_LONG.key).concat();
						break;
				}
				break;
			case DEF_CFG.LOCALE_WEEKDAYS.key:
				switch (val) {
					case Calendar.ONE_CHAR:
						Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_1CHAR.key).concat();
						break;
					case Calendar.SHORT:
						Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_SHORT.key).concat();
						break;
					case Calendar.MEDIUM:
						Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_MEDIUM.key).concat();
						break;
					case Calendar.LONG:
						Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_LONG.key).concat();
						break;
				}
				
				var START_WEEKDAY = cfg.getProperty(DEF_CFG.START_WEEKDAY.key);
	
				if (START_WEEKDAY > 0) {
					for (var w=0; w < START_WEEKDAY; ++w) {
						Locale.LOCALE_WEEKDAYS.push(Locale.LOCALE_WEEKDAYS.shift());
					}
				}
				break;
		}
	},

	/**
	 * The default handler for the "navigator" property
	 * @method configNavigator
	 */
	configNavigator : function(type, args, obj) {
		var val = args[0];
		if (YAHOO.widget.CalendarNavigator && (val === true || Lang.isObject(val))) {
			if (!this.oNavigator) {
				this.oNavigator = new YAHOO.widget.CalendarNavigator(this);
				// Cleanup DOM Refs/Events before innerHTML is removed.
				this.beforeRenderEvent.subscribe(function () {
					if (!this.pages) {
						this.oNavigator.erase();
					}
				}, this, true);
			}
		} else {
			if (this.oNavigator) {
				this.oNavigator.destroy();
				this.oNavigator = null;
			}
		}
	},

	/**
	* Defines the style constants for the Calendar
	* @method initStyles
	*/
	initStyles : function() {

		var defStyle = Calendar._STYLES;

		this.Style = {
			/**
			* @property Style.CSS_ROW_HEADER
			*/
			CSS_ROW_HEADER: defStyle.CSS_ROW_HEADER,
			/**
			* @property Style.CSS_ROW_FOOTER
			*/
			CSS_ROW_FOOTER: defStyle.CSS_ROW_FOOTER,
			/**
			* @property Style.CSS_CELL
			*/
			CSS_CELL : defStyle.CSS_CELL,
			/**
			* @property Style.CSS_CELL_SELECTOR
			*/
			CSS_CELL_SELECTOR : defStyle.CSS_CELL_SELECTOR,
			/**
			* @property Style.CSS_CELL_SELECTED
			*/
			CSS_CELL_SELECTED : defStyle.CSS_CELL_SELECTED,
			/**
			* @property Style.CSS_CELL_SELECTABLE
			*/
			CSS_CELL_SELECTABLE : defStyle.CSS_CELL_SELECTABLE,
			/**
			* @property Style.CSS_CELL_RESTRICTED
			*/
			CSS_CELL_RESTRICTED : defStyle.CSS_CELL_RESTRICTED,
			/**
			* @property Style.CSS_CELL_TODAY
			*/
			CSS_CELL_TODAY : defStyle.CSS_CELL_TODAY,
			/**
			* @property Style.CSS_CELL_OOM
			*/
			CSS_CELL_OOM : defStyle.CSS_CELL_OOM,
			/**
			* @property Style.CSS_CELL_OOB
			*/
			CSS_CELL_OOB : defStyle.CSS_CELL_OOB,
			/**
			* @property Style.CSS_HEADER
			*/
			CSS_HEADER : defStyle.CSS_HEADER,
			/**
			* @property Style.CSS_HEADER_TEXT
			*/
			CSS_HEADER_TEXT : defStyle.CSS_HEADER_TEXT,
			/**
			* @property Style.CSS_BODY
			*/
			CSS_BODY : defStyle.CSS_BODY,
			/**
			* @property Style.CSS_WEEKDAY_CELL
			*/
			CSS_WEEKDAY_CELL : defStyle.CSS_WEEKDAY_CELL,
			/**
			* @property Style.CSS_WEEKDAY_ROW
			*/
			CSS_WEEKDAY_ROW : defStyle.CSS_WEEKDAY_ROW,
			/**
			* @property Style.CSS_FOOTER
			*/
			CSS_FOOTER : defStyle.CSS_FOOTER,
			/**
			* @property Style.CSS_CALENDAR
			*/
			CSS_CALENDAR : defStyle.CSS_CALENDAR,
			/**
			* @property Style.CSS_SINGLE
			*/
			CSS_SINGLE : defStyle.CSS_SINGLE,
			/**
			* @property Style.CSS_CONTAINER
			*/
			CSS_CONTAINER : defStyle.CSS_CONTAINER,
			/**
			* @property Style.CSS_NAV_LEFT
			*/
			CSS_NAV_LEFT : defStyle.CSS_NAV_LEFT,
			/**
			* @property Style.CSS_NAV_RIGHT
			*/
			CSS_NAV_RIGHT : defStyle.CSS_NAV_RIGHT,
			/**
			* @property Style.CSS_NAV
			*/
			CSS_NAV : defStyle.CSS_NAV,
			/**
			* @property Style.CSS_CLOSE
			*/
			CSS_CLOSE : defStyle.CSS_CLOSE,
			/**
			* @property Style.CSS_CELL_TOP
			*/
			CSS_CELL_TOP : defStyle.CSS_CELL_TOP,
			/**
			* @property Style.CSS_CELL_LEFT
			*/
			CSS_CELL_LEFT : defStyle.CSS_CELL_LEFT,
			/**
			* @property Style.CSS_CELL_RIGHT
			*/
			CSS_CELL_RIGHT : defStyle.CSS_CELL_RIGHT,
			/**
			* @property Style.CSS_CELL_BOTTOM
			*/
			CSS_CELL_BOTTOM : defStyle.CSS_CELL_BOTTOM,
			/**
			* @property Style.CSS_CELL_HOVER
			*/
			CSS_CELL_HOVER : defStyle.CSS_CELL_HOVER,
			/**
			* @property Style.CSS_CELL_HIGHLIGHT1
			*/
			CSS_CELL_HIGHLIGHT1 : defStyle.CSS_CELL_HIGHLIGHT1,
			/**
			* @property Style.CSS_CELL_HIGHLIGHT2
			*/
			CSS_CELL_HIGHLIGHT2 : defStyle.CSS_CELL_HIGHLIGHT2,
			/**
			* @property Style.CSS_CELL_HIGHLIGHT3
			*/
			CSS_CELL_HIGHLIGHT3 : defStyle.CSS_CELL_HIGHLIGHT3,
			/**
			* @property Style.CSS_CELL_HIGHLIGHT4
			*/
			CSS_CELL_HIGHLIGHT4 : defStyle.CSS_CELL_HIGHLIGHT4
		};
	},

	/**
	* Builds the date label that will be displayed in the calendar header or
	* footer, depending on configuration.
	* @method buildMonthLabel
	* @return	{String}	The formatted calendar month label
	*/
	buildMonthLabel : function() {
		return this._buildMonthLabel(this.cfg.getProperty(DEF_CFG.PAGEDATE.key));
	},

    /**
     * Helper method, to format a Month Year string, given a JavaScript Date, based on the 
     * Calendar localization settings
     * 
     * @method _buildMonthLabel
     * @private
     * @param {Date} date
     * @return {String} Formated month, year string
     */
	_buildMonthLabel : function(date) {
		var	monthLabel  = this.Locale.LOCALE_MONTHS[date.getMonth()] + this.Locale.MY_LABEL_MONTH_SUFFIX,
			yearLabel = date.getFullYear() + this.Locale.MY_LABEL_YEAR_SUFFIX;

		if (this.Locale.MY_LABEL_MONTH_POSITION == 2 || this.Locale.MY_LABEL_YEAR_POSITION == 1) {
			return yearLabel + monthLabel;
		} else {
			return monthLabel + yearLabel;
		}
	},
	
	/**
	* Builds the date digit that will be displayed in calendar cells
	* @method buildDayLabel
	* @param {Date}	workingDate	The current working date
	* @return	{String}	The formatted day label
	*/
	buildDayLabel : function(workingDate) {
		return workingDate.getDate();
	},
	
	/**
	 * Creates the title bar element and adds it to Calendar container DIV
	 * 
	 * @method createTitleBar
	 * @param {String} strTitle The title to display in the title bar
	 * @return The title bar element
	 */
	createTitleBar : function(strTitle) {
		var tDiv = Dom.getElementsByClassName(YAHOO.widget.CalendarGroup.CSS_2UPTITLE, "div", this.oDomContainer)[0] || document.createElement("div");
		tDiv.className = YAHOO.widget.CalendarGroup.CSS_2UPTITLE;
		tDiv.innerHTML = strTitle;
		this.oDomContainer.insertBefore(tDiv, this.oDomContainer.firstChild);
	
		Dom.addClass(this.oDomContainer, "withtitle");
	
		return tDiv;
	},
	
	/**
	 * Removes the title bar element from the DOM
	 * 
	 * @method removeTitleBar
	 */
	removeTitleBar : function() {
		var tDiv = Dom.getElementsByClassName(YAHOO.widget.CalendarGroup.CSS_2UPTITLE, "div", this.oDomContainer)[0] || null;
		if (tDiv) {
			Event.purgeElement(tDiv);
			this.oDomContainer.removeChild(tDiv);
		}
		Dom.removeClass(this.oDomContainer, "withtitle");
	},
	
	/**
	 * Creates the close button HTML element and adds it to Calendar container DIV
	 * 
	 * @method createCloseButton
	 * @return The close HTML element created
	 */
	createCloseButton : function() {
		var cssClose = YAHOO.widget.CalendarGroup.CSS_2UPCLOSE,
			DEPR_CLOSE_PATH = "us/my/bn/x_d.gif",
			lnk = Dom.getElementsByClassName("link-close", "a", this.oDomContainer)[0],
			strings = this.cfg.getProperty(DEF_CFG.STRINGS.key),
			closeStr = (strings && strings.close) ? strings.close : "";

		if (!lnk) {
			lnk = document.createElement("a");
			Event.addListener(lnk, "click", function(e, cal) {
				cal.hide(); 
				Event.preventDefault(e);
			}, this);
		}

		lnk.href = "#";
		lnk.className = "link-close";

		if (Calendar.IMG_ROOT !== null) {
			var img = Dom.getElementsByClassName(cssClose, "img", lnk)[0] || document.createElement("img");
			img.src = Calendar.IMG_ROOT + DEPR_CLOSE_PATH;
			img.className = cssClose;
			lnk.appendChild(img);
		} else {
			lnk.innerHTML = '<span class="' + cssClose + ' ' + this.Style.CSS_CLOSE + '">' + closeStr + '</span>';
		}
		this.oDomContainer.appendChild(lnk);

		return lnk;
	},
	
	/**
	 * Removes the close button HTML element from the DOM
	 * 
	 * @method removeCloseButton
	 */
	removeCloseButton : function() {
		var btn = Dom.getElementsByClassName("link-close", "a", this.oDomContainer)[0] || null;
		if (btn) {
			Event.purgeElement(btn);
			this.oDomContainer.removeChild(btn);
		}
	},

	/**
	* Renders the calendar header.
	* @method renderHeader
	* @param {Array}	html	The current working HTML array
	* @return {Array} The current working HTML array
	*/
	renderHeader : function(html) {

		this.logger.log("Rendering header", "render");

		var colSpan = 7,
			DEPR_NAV_LEFT = "us/tr/callt.gif",
			DEPR_NAV_RIGHT = "us/tr/calrt.gif",
			cfg = this.cfg,
			pageDate = cfg.getProperty(DEF_CFG.PAGEDATE.key),
			strings= cfg.getProperty(DEF_CFG.STRINGS.key),
			prevStr = (strings && strings.previousMonth) ?  strings.previousMonth : "",
			nextStr = (strings && strings.nextMonth) ? strings.nextMonth : "",
            monthLabel;

		if (cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key)) {
			colSpan += 1;
		}
	
		if (cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key)) {
			colSpan += 1;
		}

		html[html.length] = "<thead>";
		html[html.length] =		"<tr>";
		html[html.length] =			'<th colspan="' + colSpan + '" class="' + this.Style.CSS_HEADER_TEXT + '">';
		html[html.length] =				'<div class="' + this.Style.CSS_HEADER + '">';

		var renderLeft, renderRight = false;

		if (this.parent) {
			if (this.index === 0) {
				renderLeft = true;
			}
			if (this.index == (this.parent.cfg.getProperty("pages") -1)) {
				renderRight = true;
			}
		} else {
			renderLeft = true;
			renderRight = true;
		}

		if (renderLeft) {
			monthLabel  = this._buildMonthLabel(DateMath.subtract(pageDate, DateMath.MONTH, 1));

			var leftArrow = cfg.getProperty(DEF_CFG.NAV_ARROW_LEFT.key);
			// Check for deprecated customization - If someone set IMG_ROOT, but didn't set NAV_ARROW_LEFT, then set NAV_ARROW_LEFT to the old deprecated value
			if (leftArrow === null && Calendar.IMG_ROOT !== null) {
				leftArrow = Calendar.IMG_ROOT + DEPR_NAV_LEFT;
			}
			var leftStyle = (leftArrow === null) ? "" : ' style="background-image:url(' + leftArrow + ')"';
			html[html.length] = '<a class="' + this.Style.CSS_NAV_LEFT + '"' + leftStyle + ' href="#">' + prevStr + ' (' + monthLabel + ')' + '</a>';
		}

		var lbl = this.buildMonthLabel();
		var cal = this.parent || this;
		if (cal.cfg.getProperty("navigator")) {
			lbl = "<a class=\"" + this.Style.CSS_NAV + "\" href=\"#\">" + lbl + "</a>";
		}
		html[html.length] = lbl;

		if (renderRight) {
			monthLabel  = this._buildMonthLabel(DateMath.add(pageDate, DateMath.MONTH, 1));

			var rightArrow = cfg.getProperty(DEF_CFG.NAV_ARROW_RIGHT.key);
			if (rightArrow === null && Calendar.IMG_ROOT !== null) {
				rightArrow = Calendar.IMG_ROOT + DEPR_NAV_RIGHT;
			}
			var rightStyle = (rightArrow === null) ? "" : ' style="background-image:url(' + rightArrow + ')"';
			html[html.length] = '<a class="' + this.Style.CSS_NAV_RIGHT + '"' + rightStyle + ' href="#">' + nextStr + ' (' + monthLabel + ')' + '</a>';
		}

		html[html.length] =	'</div>\n</th>\n</tr>';

		if (cfg.getProperty(DEF_CFG.SHOW_WEEKDAYS.key)) {
			html = this.buildWeekdays(html);
		}
		
		html[html.length] = '</thead>';
	
		return html;
	},
	
	/**
	* Renders the Calendar's weekday headers.
	* @method buildWeekdays
	* @param {Array}	html	The current working HTML array
	* @return {Array} The current working HTML array
	*/
	buildWeekdays : function(html) {

		html[html.length] = '<tr class="' + this.Style.CSS_WEEKDAY_ROW + '">';

		if (this.cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key)) {
			html[html.length] = '<th>&#160;</th>';
		}

		for(var i=0;i < this.Locale.LOCALE_WEEKDAYS.length; ++i) {
			html[html.length] = '<th class="calweekdaycell">' + this.Locale.LOCALE_WEEKDAYS[i] + '</th>';
		}

		if (this.cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key)) {
			html[html.length] = '<th>&#160;</th>';
		}

		html[html.length] = '</tr>';

		return html;
	},
	
	/**
	* Renders the calendar body.
	* @method renderBody
	* @param {Date}	workingDate	The current working Date being used for the render process
	* @param {Array}	html	The current working HTML array
	* @return {Array} The current working HTML array
	*/
	renderBody : function(workingDate, html) {
		this.logger.log("Rendering body", "render");

		var startDay = this.cfg.getProperty(DEF_CFG.START_WEEKDAY.key);

		this.preMonthDays = workingDate.getDay();
		if (startDay > 0) {
			this.preMonthDays -= startDay;
		}
		if (this.preMonthDays < 0) {
			this.preMonthDays += 7;
		}

		this.monthDays = DateMath.findMonthEnd(workingDate).getDate();
		this.postMonthDays = Calendar.DISPLAY_DAYS-this.preMonthDays-this.monthDays;

		this.logger.log(this.preMonthDays + " preciding out-of-month days", "render");
		this.logger.log(this.monthDays + " month days", "render");
		this.logger.log(this.postMonthDays + " post-month days", "render");

		workingDate = DateMath.subtract(workingDate, DateMath.DAY, this.preMonthDays);
		this.logger.log("Calendar page starts on " + workingDate, "render");
	
		var weekNum,
			weekClass,
			weekPrefix = "w",
			cellPrefix = "_cell",
			workingDayPrefix = "wd",
			dayPrefix = "d",
			cellRenderers,
			renderer,
			t = this.today,
			cfg = this.cfg,
			todayYear = t.getFullYear(),
			todayMonth = t.getMonth(),
			todayDate = t.getDate(),
			useDate = cfg.getProperty(DEF_CFG.PAGEDATE.key),
			hideBlankWeeks = cfg.getProperty(DEF_CFG.HIDE_BLANK_WEEKS.key),
			showWeekFooter = cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key),
			showWeekHeader = cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key),
			mindate = cfg.getProperty(DEF_CFG.MINDATE.key),
			maxdate = cfg.getProperty(DEF_CFG.MAXDATE.key);

		if (mindate) {
			mindate = DateMath.clearTime(mindate);
		}
		if (maxdate) {
			maxdate = DateMath.clearTime(maxdate);
		}

		html[html.length] = '<tbody class="m' + (useDate.getMonth()+1) + ' ' + this.Style.CSS_BODY + '">';

		var i = 0,
			tempDiv = document.createElement("div"),
			cell = document.createElement("td");

		tempDiv.appendChild(cell);

		var cal = this.parent || this;

		for (var r=0;r<6;r++) {
			weekNum = DateMath.getWeekNumber(workingDate, startDay);
			weekClass = weekPrefix + weekNum;

			// Local OOM check for performance, since we already have pagedate
			if (r !== 0 && hideBlankWeeks === true && workingDate.getMonth() != useDate.getMonth()) {
				break;
			} else {
				html[html.length] = '<tr class="' + weekClass + '">';

				if (showWeekHeader) { html = this.renderRowHeader(weekNum, html); }

				for (var d=0; d < 7; d++){ // Render actual days

					cellRenderers = [];

					this.clearElement(cell);
					cell.className = this.Style.CSS_CELL;
					cell.id = this.id + cellPrefix + i;
					this.logger.log("Rendering cell " + cell.id + " (" + workingDate.getFullYear() + "-" + (workingDate.getMonth()+1) + "-" + workingDate.getDate() + ")", "cellrender");

					if (workingDate.getDate()		== todayDate && 
						workingDate.getMonth()		== todayMonth &&
						workingDate.getFullYear()	== todayYear) {
						cellRenderers[cellRenderers.length]=cal.renderCellStyleToday;
					}

					var workingArray = [workingDate.getFullYear(),workingDate.getMonth()+1,workingDate.getDate()];
					this.cellDates[this.cellDates.length] = workingArray; // Add this date to cellDates

					// Local OOM check for performance, since we already have pagedate
					if (workingDate.getMonth() != useDate.getMonth()) {
						cellRenderers[cellRenderers.length]=cal.renderCellNotThisMonth;
					} else {
						Dom.addClass(cell, workingDayPrefix + workingDate.getDay());
						Dom.addClass(cell, dayPrefix + workingDate.getDate());

						for (var s=0;s<this.renderStack.length;++s) {

							renderer = null;

							var rArray = this.renderStack[s],
								type = rArray[0],
								month,
								day,
								year;

							switch (type) {
								case Calendar.DATE:
									month = rArray[1][1];
									day = rArray[1][2];
									year = rArray[1][0];

									if (workingDate.getMonth()+1 == month && workingDate.getDate() == day && workingDate.getFullYear() == year) {
										renderer = rArray[2];
										this.renderStack.splice(s,1);
									}
									break;
								case Calendar.MONTH_DAY:
									month = rArray[1][0];
									day = rArray[1][1];

									if (workingDate.getMonth()+1 == month && workingDate.getDate() == day) {
										renderer = rArray[2];
										this.renderStack.splice(s,1);
									}
									break;
								case Calendar.RANGE:
									var date1 = rArray[1][0],
										date2 = rArray[1][1],
										d1month = date1[1],
										d1day = date1[2],
										d1year = date1[0],
										d1 = DateMath.getDate(d1year, d1month-1, d1day),
										d2month = date2[1],
										d2day = date2[2],
										d2year = date2[0],
										d2 = DateMath.getDate(d2year, d2month-1, d2day);

									if (workingDate.getTime() >= d1.getTime() && workingDate.getTime() <= d2.getTime()) {
										renderer = rArray[2];

										if (workingDate.getTime()==d2.getTime()) { 
											this.renderStack.splice(s,1);
										}
									}
									break;
								case Calendar.WEEKDAY:
									var weekday = rArray[1][0];
									if (workingDate.getDay()+1 == weekday) {
										renderer = rArray[2];
									}
									break;
								case Calendar.MONTH:
									month = rArray[1][0];
									if (workingDate.getMonth()+1 == month) {
										renderer = rArray[2];
									}
									break;
							}

							if (renderer) {
								cellRenderers[cellRenderers.length]=renderer;
							}
						}

					}

					if (this._indexOfSelectedFieldArray(workingArray) > -1) {
						cellRenderers[cellRenderers.length]=cal.renderCellStyleSelected; 
					}

					if ((mindate && (workingDate.getTime() < mindate.getTime())) ||
						(maxdate && (workingDate.getTime() > maxdate.getTime()))
					) {
						cellRenderers[cellRenderers.length]=cal.renderOutOfBoundsDate;
					} else {
						cellRenderers[cellRenderers.length]=cal.styleCellDefault;
						cellRenderers[cellRenderers.length]=cal.renderCellDefault;	
					}

					for (var x=0; x < cellRenderers.length; ++x) {
						this.logger.log("renderer[" + x + "] for (" + workingDate.getFullYear() + "-" + (workingDate.getMonth()+1) + "-" + workingDate.getDate() + ")", "cellrender");
						if (cellRenderers[x].call(cal, workingDate, cell) == Calendar.STOP_RENDER) {
							break;
						}
					}

					workingDate.setTime(workingDate.getTime() + DateMath.ONE_DAY_MS);
					// Just in case we crossed DST/Summertime boundaries
					workingDate = DateMath.clearTime(workingDate);

					if (i >= 0 && i <= 6) {
						Dom.addClass(cell, this.Style.CSS_CELL_TOP);
					}
					if ((i % 7) === 0) {
						Dom.addClass(cell, this.Style.CSS_CELL_LEFT);
					}
					if (((i+1) % 7) === 0) {
						Dom.addClass(cell, this.Style.CSS_CELL_RIGHT);
					}

					var postDays = this.postMonthDays; 
					if (hideBlankWeeks && postDays >= 7) {
						var blankWeeks = Math.floor(postDays/7);
						for (var p=0;p<blankWeeks;++p) {
							postDays -= 7;
						}
					}
					
					if (i >= ((this.preMonthDays+postDays+this.monthDays)-7)) {
						Dom.addClass(cell, this.Style.CSS_CELL_BOTTOM);
					}
	
					html[html.length] = tempDiv.innerHTML;
					i++;
				}
	
				if (showWeekFooter) { html = this.renderRowFooter(weekNum, html); }
	
				html[html.length] = '</tr>';
			}
		}
	
		html[html.length] = '</tbody>';
	
		return html;
	},
	
	/**
	* Renders the calendar footer. In the default implementation, there is
	* no footer.
	* @method renderFooter
	* @param {Array}	html	The current working HTML array
	* @return {Array} The current working HTML array
	*/
	renderFooter : function(html) { return html; },
	
	/**
	* Renders the calendar after it has been configured. The render() method has a specific call chain that will execute
	* when the method is called: renderHeader, renderBody, renderFooter.
	* Refer to the documentation for those methods for information on 
	* individual render tasks.
	* @method render
	*/
	render : function() {
		this.beforeRenderEvent.fire();

		// Find starting day of the current month
		var workingDate = DateMath.findMonthStart(this.cfg.getProperty(DEF_CFG.PAGEDATE.key));

		this.resetRenderers();
		this.cellDates.length = 0;

		Event.purgeElement(this.oDomContainer, true);

		var html = [];

		html[html.length] = '<table cellSpacing="0" class="' + this.Style.CSS_CALENDAR + ' y' + workingDate.getFullYear() + '" id="' + this.id + '">';
		html = this.renderHeader(html);
		html = this.renderBody(workingDate, html);
		html = this.renderFooter(html);
		html[html.length] = '</table>';

		this.oDomContainer.innerHTML = html.join("\n");

		this.applyListeners();
		this.cells = this.oDomContainer.getElementsByTagName("td");
	
		this.cfg.refireEvent(DEF_CFG.TITLE.key);
		this.cfg.refireEvent(DEF_CFG.CLOSE.key);
		this.cfg.refireEvent(DEF_CFG.IFRAME.key);

		this.renderEvent.fire();
	},

	/**
	* Applies the Calendar's DOM listeners to applicable elements.
	* @method applyListeners
	*/
	applyListeners : function() {
		var root = this.oDomContainer,
			cal = this.parent || this,
			anchor = "a",
			click = "click";

		var linkLeft = Dom.getElementsByClassName(this.Style.CSS_NAV_LEFT, anchor, root),
			linkRight = Dom.getElementsByClassName(this.Style.CSS_NAV_RIGHT, anchor, root);

		if (linkLeft && linkLeft.length > 0) {
			this.linkLeft = linkLeft[0];
			Event.addListener(this.linkLeft, click, this.doPreviousMonthNav, cal, true);
		}

		if (linkRight && linkRight.length > 0) {
			this.linkRight = linkRight[0];
			Event.addListener(this.linkRight, click, this.doNextMonthNav, cal, true);
		}

		if (cal.cfg.getProperty("navigator") !== null) {
			this.applyNavListeners();
		}

		if (this.domEventMap) {
			var el,elements;
			for (var cls in this.domEventMap) {	
				if (Lang.hasOwnProperty(this.domEventMap, cls)) {
					var items = this.domEventMap[cls];
	
					if (! (items instanceof Array)) {
						items = [items];
					}
	
					for (var i=0;i<items.length;i++)	{
						var item = items[i];
						elements = Dom.getElementsByClassName(cls, item.tag, this.oDomContainer);
	
						for (var c=0;c<elements.length;c++) {
							el = elements[c];
							 Event.addListener(el, item.event, item.handler, item.scope, item.correct );
						}
					}
				}
			}
		}

		Event.addListener(this.oDomContainer, "click", this.doSelectCell, this);
		Event.addListener(this.oDomContainer, "mouseover", this.doCellMouseOver, this);
		Event.addListener(this.oDomContainer, "mouseout", this.doCellMouseOut, this);
	},

	applyNavListeners : function() {
		var calParent = this.parent || this,
			cal = this,
			navBtns = Dom.getElementsByClassName(this.Style.CSS_NAV, "a", this.oDomContainer);

		if (navBtns.length > 0) {

			Event.addListener(navBtns, "click", function (e, obj) {
				var target = Event.getTarget(e);
				// this == navBtn
				if (this === target || Dom.isAncestor(this, target)) {
					Event.preventDefault(e);
				}
				var navigator = calParent.oNavigator;
				if (navigator) {
					var pgdate = cal.cfg.getProperty("pagedate");
					navigator.setYear(pgdate.getFullYear());
					navigator.setMonth(pgdate.getMonth());
					navigator.show();
				}
			});
		}
	},

	/**
	* Retrieves the Date object for the specified Calendar cell
	* @method getDateByCellId
	* @param {String}	id	The id of the cell
	* @return {Date} The Date object for the specified Calendar cell
	*/
	getDateByCellId : function(id) {
		var date = this.getDateFieldsByCellId(id);
		return (date) ? DateMath.getDate(date[0],date[1]-1,date[2]) : null;
	},
	
	/**
	* Retrieves the Date object for the specified Calendar cell
	* @method getDateFieldsByCellId
	* @param {String}	id	The id of the cell
	* @return {Array}	The array of Date fields for the specified Calendar cell
	*/
	getDateFieldsByCellId : function(id) {
		id = this.getIndexFromId(id);
		return (id > -1) ? this.cellDates[id] : null;
	},

	/**
	 * Find the Calendar's cell index for a given date.
	 * If the date is not found, the method returns -1.
	 * <p>
	 * The returned index can be used to lookup the cell HTMLElement  
	 * using the Calendar's cells array or passed to selectCell to select 
	 * cells by index. 
	 * </p>
	 *
	 * See <a href="#cells">cells</a>, <a href="#selectCell">selectCell</a>.
	 *
	 * @method getCellIndex
	 * @param {Date} date JavaScript Date object, for which to find a cell index.
	 * @return {Number} The index of the date in Calendars cellDates/cells arrays, or -1 if the date 
	 * is not on the curently rendered Calendar page.
	 */
	getCellIndex : function(date) {
		var idx = -1;
		if (date) {
			var m = date.getMonth(),
				y = date.getFullYear(),
				d = date.getDate(),
				dates = this.cellDates;

			for (var i = 0; i < dates.length; ++i) {
				var cellDate = dates[i];
				if (cellDate[0] === y && cellDate[1] === m+1 && cellDate[2] === d) {
					idx = i;
					break;
				}
			}
		}
		return idx;
	},

	/**
	 * Given the id used to mark each Calendar cell, this method
	 * extracts the index number from the id.
	 * 
	 * @param {String} strId The cell id
	 * @return {Number} The index of the cell, or -1 if id does not contain an index number
	 */
	getIndexFromId : function(strId) {
		var idx = -1,
			li = strId.lastIndexOf("_cell");

		if (li > -1) {
			idx = parseInt(strId.substring(li + 5), 10);
		}

		return idx;
	},
	
	// BEGIN BUILT-IN TABLE CELL RENDERERS
	
	/**
	* Renders a cell that falls before the minimum date or after the maximum date.
	* widget class.
	* @method renderOutOfBoundsDate
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	* @return {String} YAHOO.widget.Calendar.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
	*			should not be terminated
	*/
	renderOutOfBoundsDate : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL_OOB);
		cell.innerHTML = workingDate.getDate();
		return Calendar.STOP_RENDER;
	},
	
	/**
	* Renders the row header for a week.
	* @method renderRowHeader
	* @param {Number}	weekNum	The week number of the current row
	* @param {Array}	cell	The current working HTML array
	*/
	renderRowHeader : function(weekNum, html) {
		html[html.length] = '<th class="calrowhead">' + weekNum + '</th>';
		return html;
	},
	
	/**
	* Renders the row footer for a week.
	* @method renderRowFooter
	* @param {Number}	weekNum	The week number of the current row
	* @param {Array}	cell	The current working HTML array
	*/
	renderRowFooter : function(weekNum, html) {
		html[html.length] = '<th class="calrowfoot">' + weekNum + '</th>';
		return html;
	},
	
	/**
	* Renders a single standard calendar cell in the calendar widget table.
	* All logic for determining how a standard default cell will be rendered is 
	* encapsulated in this method, and must be accounted for when extending the
	* widget class.
	* @method renderCellDefault
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	*/
	renderCellDefault : function(workingDate, cell) {
		cell.innerHTML = '<a href="#" class="' + this.Style.CSS_CELL_SELECTOR + '">' + this.buildDayLabel(workingDate) + "</a>";
	},
	
	/**
	* Styles a selectable cell.
	* @method styleCellDefault
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	*/
	styleCellDefault : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL_SELECTABLE);
	},
	
	
	/**
	* Renders a single standard calendar cell using the CSS hightlight1 style
	* @method renderCellStyleHighlight1
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	*/
	renderCellStyleHighlight1 : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT1);
	},
	
	/**
	* Renders a single standard calendar cell using the CSS hightlight2 style
	* @method renderCellStyleHighlight2
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	*/
	renderCellStyleHighlight2 : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT2);
	},
	
	/**
	* Renders a single standard calendar cell using the CSS hightlight3 style
	* @method renderCellStyleHighlight3
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	*/
	renderCellStyleHighlight3 : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT3);
	},
	
	/**
	* Renders a single standard calendar cell using the CSS hightlight4 style
	* @method renderCellStyleHighlight4
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	*/
	renderCellStyleHighlight4 : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT4);
	},
	
	/**
	* Applies the default style used for rendering today's date to the current calendar cell
	* @method renderCellStyleToday
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	*/
	renderCellStyleToday : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL_TODAY);
	},
	
	/**
	* Applies the default style used for rendering selected dates to the current calendar cell
	* @method renderCellStyleSelected
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	* @return {String} YAHOO.widget.Calendar.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
	*			should not be terminated
	*/
	renderCellStyleSelected : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL_SELECTED);
	},
	
	/**
	* Applies the default style used for rendering dates that are not a part of the current
	* month (preceding or trailing the cells for the current month)
	* @method renderCellNotThisMonth
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	* @return {String} YAHOO.widget.Calendar.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
	*			should not be terminated
	*/
	renderCellNotThisMonth : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL_OOM);
		cell.innerHTML=workingDate.getDate();
		return Calendar.STOP_RENDER;
	},
	
	/**
	* Renders the current calendar cell as a non-selectable "black-out" date using the default
	* restricted style.
	* @method renderBodyCellRestricted
	* @param {Date}					workingDate		The current working Date object being used to generate the calendar
	* @param {HTMLTableCellElement}	cell			The current working cell in the calendar
	* @return {String} YAHOO.widget.Calendar.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
	*			should not be terminated
	*/
	renderBodyCellRestricted : function(workingDate, cell) {
		Dom.addClass(cell, this.Style.CSS_CELL);
		Dom.addClass(cell, this.Style.CSS_CELL_RESTRICTED);
		cell.innerHTML=workingDate.getDate();
		return Calendar.STOP_RENDER;
	},
	
	// END BUILT-IN TABLE CELL RENDERERS
	
	// BEGIN MONTH NAVIGATION METHODS
	
	/**
	* Adds the designated number of months to the current calendar month, and sets the current
	* calendar page date to the new month.
	* @method addMonths
	* @param {Number}	count	The number of months to add to the current calendar
	*/
	addMonths : function(count) {
		var cfgPageDate = DEF_CFG.PAGEDATE.key;
		this.cfg.setProperty(cfgPageDate, DateMath.add(this.cfg.getProperty(cfgPageDate), DateMath.MONTH, count));
		this.resetRenderers();
		this.changePageEvent.fire();
	},
	
	/**
	* Subtracts the designated number of months from the current calendar month, and sets the current
	* calendar page date to the new month.
	* @method subtractMonths
	* @param {Number}	count	The number of months to subtract from the current calendar
	*/
	subtractMonths : function(count) {
		var cfgPageDate = DEF_CFG.PAGEDATE.key;
		this.cfg.setProperty(cfgPageDate, DateMath.subtract(this.cfg.getProperty(cfgPageDate), DateMath.MONTH, count));
		this.resetRenderers();
		this.changePageEvent.fire();
	},

	/**
	* Adds the designated number of years to the current calendar, and sets the current
	* calendar page date to the new month.
	* @method addYears
	* @param {Number}	count	The number of years to add to the current calendar
	*/
	addYears : function(count) {
		var cfgPageDate = DEF_CFG.PAGEDATE.key;
		this.cfg.setProperty(cfgPageDate, DateMath.add(this.cfg.getProperty(cfgPageDate), DateMath.YEAR, count));
		this.resetRenderers();
		this.changePageEvent.fire();
	},
	
	/**
	* Subtcats the designated number of years from the current calendar, and sets the current
	* calendar page date to the new month.
	* @method subtractYears
	* @param {Number}	count	The number of years to subtract from the current calendar
	*/
	subtractYears : function(count) {
		var cfgPageDate = DEF_CFG.PAGEDATE.key;
		this.cfg.setProperty(cfgPageDate, DateMath.subtract(this.cfg.getProperty(cfgPageDate), DateMath.YEAR, count));
		this.resetRenderers();
		this.changePageEvent.fire();
	},
	
	/**
	* Navigates to the next month page in the calendar widget.
	* @method nextMonth
	*/
	nextMonth : function() {
		this.addMonths(1);
	},
	
	/**
	* Navigates to the previous month page in the calendar widget.
	* @method previousMonth
	*/
	previousMonth : function() {
		this.subtractMonths(1);
	},
	
	/**
	* Navigates to the next year in the currently selected month in the calendar widget.
	* @method nextYear
	*/
	nextYear : function() {
		this.addYears(1);
	},
	
	/**
	* Navigates to the previous year in the currently selected month in the calendar widget.
	* @method previousYear
	*/
	previousYear : function() {
		this.subtractYears(1);
	},
	
	// END MONTH NAVIGATION METHODS
	
	// BEGIN SELECTION METHODS
	
	/**
	* Resets the calendar widget to the originally selected month and year, and 
	* sets the calendar to the initial selection(s).
	* @method reset
	*/
	reset : function() {
		this.cfg.resetProperty(DEF_CFG.SELECTED.key);
		this.cfg.resetProperty(DEF_CFG.PAGEDATE.key);
		this.resetEvent.fire();
	},
	
	/**
	* Clears the selected dates in the current calendar widget and sets the calendar
	* to the current month and year.
	* @method clear
	*/
	clear : function() {
		this.cfg.setProperty(DEF_CFG.SELECTED.key, []);
		this.cfg.setProperty(DEF_CFG.PAGEDATE.key, new Date(this.today.getTime()));
		this.clearEvent.fire();
	},
	
	/**
	* Selects a date or a collection of dates on the current calendar. This method, by default,
	* does not call the render method explicitly. Once selection has completed, render must be 
	* called for the changes to be reflected visually.
	*
	* Any dates which are OOB (out of bounds, not selectable) will not be selected and the array of 
	* selected dates passed to the selectEvent will not contain OOB dates.
	* 
	* If all dates are OOB, the no state change will occur; beforeSelect and select events will not be fired.
	*
	* @method select
	* @param	{String/Date/Date[]}	date	The date string of dates to select in the current calendar. Valid formats are
	*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
	*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
	*								This method can also take a JavaScript Date object or an array of Date objects.
	* @return	{Date[]}			Array of JavaScript Date objects representing all individual dates that are currently selected.
	*/
	select : function(date) {
		this.logger.log("Select: " + date, "info");

		var aToBeSelected = this._toFieldArray(date),
			validDates = [],
			selected = [],
			cfgSelected = DEF_CFG.SELECTED.key;

		this.logger.log("Selection field array: " + aToBeSelected, "info");
		
		for (var a=0; a < aToBeSelected.length; ++a) {
			var toSelect = aToBeSelected[a];

			if (!this.isDateOOB(this._toDate(toSelect))) {

				if (validDates.length === 0) {
					this.beforeSelectEvent.fire();
					selected = this.cfg.getProperty(cfgSelected);
				}
				validDates.push(toSelect);

				if (this._indexOfSelectedFieldArray(toSelect) == -1) { 
					selected[selected.length] = toSelect;
				}
			}
		}

		if (validDates.length === 0) { this.logger.log("All provided dates were OOB. beforeSelect and select events not fired", "info"); }

		if (validDates.length > 0) {
			if (this.parent) {
				this.parent.cfg.setProperty(cfgSelected, selected);
			} else {
				this.cfg.setProperty(cfgSelected, selected);
			}
			this.selectEvent.fire(validDates);
		}

		return this.getSelectedDates();
	},
	
	/**
	* Selects a date on the current calendar by referencing the index of the cell that should be selected.
	* This method is used to easily select a single cell (usually with a mouse click) without having to do
	* a full render. The selected style is applied to the cell directly.
	*
	* If the cell is not marked with the CSS_CELL_SELECTABLE class (as is the case by default for out of month 
	* or out of bounds cells), it will not be selected and in such a case beforeSelect and select events will not be fired.
	* 
	* @method selectCell
	* @param	{Number}	cellIndex	The index of the cell to select in the current calendar. 
	* @return	{Date[]}	Array of JavaScript Date objects representing all individual dates that are currently selected.
	*/
	selectCell : function(cellIndex) {

		var cell = this.cells[cellIndex],
			cellDate = this.cellDates[cellIndex],
			dCellDate = this._toDate(cellDate),
			selectable = Dom.hasClass(cell, this.Style.CSS_CELL_SELECTABLE);

		this.logger.log("Select: " + dCellDate, "info");
		if (!selectable) {this.logger.log("The cell at cellIndex:" + cellIndex + " is not a selectable cell. beforeSelect, select events not fired", "info"); }

		if (selectable) {
	
			this.beforeSelectEvent.fire();
	
			var cfgSelected = DEF_CFG.SELECTED.key;
			var selected = this.cfg.getProperty(cfgSelected);
	
			var selectDate = cellDate.concat();
	
			if (this._indexOfSelectedFieldArray(selectDate) == -1) {
				selected[selected.length] = selectDate;
			}
			if (this.parent) {
				this.parent.cfg.setProperty(cfgSelected, selected);
			} else {
				this.cfg.setProperty(cfgSelected, selected);
			}
			this.renderCellStyleSelected(dCellDate,cell);
			this.selectEvent.fire([selectDate]);
	
			this.doCellMouseOut.call(cell, null, this);		
		}
	
		return this.getSelectedDates();
	},
	
	/**
	* Deselects a date or a collection of dates on the current calendar. This method, by default,
	* does not call the render method explicitly. Once deselection has completed, render must be 
	* called for the changes to be reflected visually.
	* 
	* The method will not attempt to deselect any dates which are OOB (out of bounds, and hence not selectable) 
	* and the array of deselected dates passed to the deselectEvent will not contain any OOB dates.
	* 
	* If all dates are OOB, beforeDeselect and deselect events will not be fired.
	* 
	* @method deselect
	* @param	{String/Date/Date[]}	date	The date string of dates to deselect in the current calendar. Valid formats are
	*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
	*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
	*								This method can also take a JavaScript Date object or an array of Date objects.	
	* @return	{Date[]}			Array of JavaScript Date objects representing all individual dates that are currently selected.
	*/
	deselect : function(date) {
		this.logger.log("Deselect: " + date, "info");

		var aToBeDeselected = this._toFieldArray(date),
			validDates = [],
			selected = [],
			cfgSelected = DEF_CFG.SELECTED.key;

		this.logger.log("Deselection field array: " + aToBeDeselected, "info");

		for (var a=0; a < aToBeDeselected.length; ++a) {
			var toDeselect = aToBeDeselected[a];
	
			if (!this.isDateOOB(this._toDate(toDeselect))) {
	
				if (validDates.length === 0) {
					this.beforeDeselectEvent.fire();
					selected = this.cfg.getProperty(cfgSelected);
				}
	
				validDates.push(toDeselect);
	
				var index = this._indexOfSelectedFieldArray(toDeselect);
				if (index != -1) {	
					selected.splice(index,1);
				}
			}
		}
	
		if (validDates.length === 0) { this.logger.log("All provided dates were OOB. beforeDeselect and deselect events not fired");}
	
		if (validDates.length > 0) {
			if (this.parent) {
				this.parent.cfg.setProperty(cfgSelected, selected);
			} else {
				this.cfg.setProperty(cfgSelected, selected);
			}
			this.deselectEvent.fire(validDates);
		}
	
		return this.getSelectedDates();
	},
	
	/**
	* Deselects a date on the current calendar by referencing the index of the cell that should be deselected.
	* This method is used to easily deselect a single cell (usually with a mouse click) without having to do
	* a full render. The selected style is removed from the cell directly.
	* 
	* If the cell is not marked with the CSS_CELL_SELECTABLE class (as is the case by default for out of month 
	* or out of bounds cells), the method will not attempt to deselect it and in such a case, beforeDeselect and 
	* deselect events will not be fired.
	* 
	* @method deselectCell
	* @param	{Number}	cellIndex	The index of the cell to deselect in the current calendar. 
	* @return	{Date[]}	Array of JavaScript Date objects representing all individual dates that are currently selected.
	*/
	deselectCell : function(cellIndex) {
		var cell = this.cells[cellIndex],
			cellDate = this.cellDates[cellIndex],
			cellDateIndex = this._indexOfSelectedFieldArray(cellDate);

		var selectable = Dom.hasClass(cell, this.Style.CSS_CELL_SELECTABLE);
		if (!selectable) { this.logger.log("The cell at cellIndex:" + cellIndex + " is not a selectable/deselectable cell", "info"); }

		if (selectable) {

			this.beforeDeselectEvent.fire();

			var selected = this.cfg.getProperty(DEF_CFG.SELECTED.key),
				dCellDate = this._toDate(cellDate),
				selectDate = cellDate.concat();

			if (cellDateIndex > -1) {
				if (this.cfg.getProperty(DEF_CFG.PAGEDATE.key).getMonth() == dCellDate.getMonth() &&
					this.cfg.getProperty(DEF_CFG.PAGEDATE.key).getFullYear() == dCellDate.getFullYear()) {
					Dom.removeClass(cell, this.Style.CSS_CELL_SELECTED);
				}
				selected.splice(cellDateIndex, 1);
			}

			if (this.parent) {
				this.parent.cfg.setProperty(DEF_CFG.SELECTED.key, selected);
			} else {
				this.cfg.setProperty(DEF_CFG.SELECTED.key, selected);
			}

			this.deselectEvent.fire([selectDate]);
		}

		return this.getSelectedDates();
	},

	/**
	* Deselects all dates on the current calendar.
	* @method deselectAll
	* @return {Date[]}		Array of JavaScript Date objects representing all individual dates that are currently selected.
	*						Assuming that this function executes properly, the return value should be an empty array.
	*						However, the empty array is returned for the sake of being able to check the selection status
	*						of the calendar.
	*/
	deselectAll : function() {
		this.beforeDeselectEvent.fire();
		
		var cfgSelected = DEF_CFG.SELECTED.key,
			selected = this.cfg.getProperty(cfgSelected),
			count = selected.length,
			sel = selected.concat();

		if (this.parent) {
			this.parent.cfg.setProperty(cfgSelected, []);
		} else {
			this.cfg.setProperty(cfgSelected, []);
		}
		
		if (count > 0) {
			this.deselectEvent.fire(sel);
		}
	
		return this.getSelectedDates();
	},
	
	// END SELECTION METHODS
	
	// BEGIN TYPE CONVERSION METHODS
	
	/**
	* Converts a date (either a JavaScript Date object, or a date string) to the internal data structure
	* used to represent dates: [[yyyy,mm,dd],[yyyy,mm,dd]].
	* @method _toFieldArray
	* @private
	* @param	{String/Date/Date[]}	date	The date string of dates to deselect in the current calendar. Valid formats are
	*								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
	*								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
	*								This method can also take a JavaScript Date object or an array of Date objects.	
	* @return {Array[](Number[])}	Array of date field arrays
	*/
	_toFieldArray : function(date) {
		var returnDate = [];
	
		if (date instanceof Date) {
			returnDate = [[date.getFullYear(), date.getMonth()+1, date.getDate()]];
		} else if (Lang.isString(date)) {
			returnDate = this._parseDates(date);
		} else if (Lang.isArray(date)) {
			for (var i=0;i<date.length;++i) {
				var d = date[i];
				returnDate[returnDate.length] = [d.getFullYear(),d.getMonth()+1,d.getDate()];
			}
		}
		
		return returnDate;
	},
	
	/**
	* Converts a date field array [yyyy,mm,dd] to a JavaScript Date object. The date field array
	* is the format in which dates are as provided as arguments to selectEvent and deselectEvent listeners.
	* 
	* @method toDate
	* @param	{Number[]}	dateFieldArray	The date field array to convert to a JavaScript Date.
	* @return	{Date}	JavaScript Date object representing the date field array.
	*/
	toDate : function(dateFieldArray) {
		return this._toDate(dateFieldArray);
	},
	
	/**
	* Converts a date field array [yyyy,mm,dd] to a JavaScript Date object.
	* @method _toDate
	* @private
	* @deprecated Made public, toDate 
	* @param	{Number[]}		dateFieldArray	The date field array to convert to a JavaScript Date.
	* @return	{Date}	JavaScript Date object representing the date field array
	*/
	_toDate : function(dateFieldArray) {
		if (dateFieldArray instanceof Date) {
			return dateFieldArray;
		} else {
			return DateMath.getDate(dateFieldArray[0],dateFieldArray[1]-1,dateFieldArray[2]);
		}
	},
	
	// END TYPE CONVERSION METHODS 
	
	// BEGIN UTILITY METHODS
	
	/**
	* Converts a date field array [yyyy,mm,dd] to a JavaScript Date object.
	* @method _fieldArraysAreEqual
	* @private
	* @param	{Number[]}	array1	The first date field array to compare
	* @param	{Number[]}	array2	The first date field array to compare
	* @return	{Boolean}	The boolean that represents the equality of the two arrays
	*/
	_fieldArraysAreEqual : function(array1, array2) {
		var match = false;
	
		if (array1[0]==array2[0]&&array1[1]==array2[1]&&array1[2]==array2[2]) {
			match=true;	
		}
	
		return match;
	},
	
	/**
	* Gets the index of a date field array [yyyy,mm,dd] in the current list of selected dates.
	* @method	_indexOfSelectedFieldArray
	* @private
	* @param	{Number[]}		find	The date field array to search for
	* @return	{Number}			The index of the date field array within the collection of selected dates.
	*								-1 will be returned if the date is not found.
	*/
	_indexOfSelectedFieldArray : function(find) {
		var selected = -1,
			seldates = this.cfg.getProperty(DEF_CFG.SELECTED.key);
	
		for (var s=0;s<seldates.length;++s) {
			var sArray = seldates[s];
			if (find[0]==sArray[0]&&find[1]==sArray[1]&&find[2]==sArray[2]) {
				selected = s;
				break;
			}
		}
	
		return selected;
	},
	
	/**
	* Determines whether a given date is OOM (out of month).
	* @method	isDateOOM
	* @param	{Date}	date	The JavaScript Date object for which to check the OOM status
	* @return	{Boolean}	true if the date is OOM
	*/
	isDateOOM : function(date) {
		return (date.getMonth() != this.cfg.getProperty(DEF_CFG.PAGEDATE.key).getMonth());
	},
	
	/**
	* Determines whether a given date is OOB (out of bounds - less than the mindate or more than the maxdate).
	*
	* @method	isDateOOB
	* @param	{Date}	date	The JavaScript Date object for which to check the OOB status
	* @return	{Boolean}	true if the date is OOB
	*/
	isDateOOB : function(date) {
		var minDate = this.cfg.getProperty(DEF_CFG.MINDATE.key),
			maxDate = this.cfg.getProperty(DEF_CFG.MAXDATE.key),
			dm = DateMath;
		
		if (minDate) {
			minDate = dm.clearTime(minDate);
		} 
		if (maxDate) {
			maxDate = dm.clearTime(maxDate);
		}
	
		var clearedDate = new Date(date.getTime());
		clearedDate = dm.clearTime(clearedDate);
	
		return ((minDate && clearedDate.getTime() < minDate.getTime()) || (maxDate && clearedDate.getTime() > maxDate.getTime()));
	},
	
	/**
	 * Parses a pagedate configuration property value. The value can either be specified as a string of form "mm/yyyy" or a Date object 
	 * and is parsed into a Date object normalized to the first day of the month. If no value is passed in, the month and year from today's date are used to create the Date object 
	 * @method	_parsePageDate
	 * @private
	 * @param {Date|String}	date	Pagedate value which needs to be parsed
	 * @return {Date}	The Date object representing the pagedate
	 */
	_parsePageDate : function(date) {
		var parsedDate;

		if (date) {
			if (date instanceof Date) {
				parsedDate = DateMath.findMonthStart(date);
			} else {
				var month, year, aMonthYear;
				aMonthYear = date.split(this.cfg.getProperty(DEF_CFG.DATE_FIELD_DELIMITER.key));
				month = parseInt(aMonthYear[this.cfg.getProperty(DEF_CFG.MY_MONTH_POSITION.key)-1], 10)-1;
				year = parseInt(aMonthYear[this.cfg.getProperty(DEF_CFG.MY_YEAR_POSITION.key)-1], 10);

				parsedDate = DateMath.getDate(year, month, 1);
			}
		} else {
			parsedDate = DateMath.getDate(this.today.getFullYear(), this.today.getMonth(), 1);
		}
		return parsedDate;
	},
	
	// END UTILITY METHODS
	
	// BEGIN EVENT HANDLERS
	
	/**
	* Event executed before a date is selected in the calendar widget.
	* @deprecated Event handlers for this event should be susbcribed to beforeSelectEvent.
	*/
	onBeforeSelect : function() {
		if (this.cfg.getProperty(DEF_CFG.MULTI_SELECT.key) === false) {
			if (this.parent) {
				this.parent.callChildFunction("clearAllBodyCellStyles", this.Style.CSS_CELL_SELECTED);
				this.parent.deselectAll();
			} else {
				this.clearAllBodyCellStyles(this.Style.CSS_CELL_SELECTED);
				this.deselectAll();
			}
		}
	},
	
	/**
	* Event executed when a date is selected in the calendar widget.
	* @param	{Array}	selected	An array of date field arrays representing which date or dates were selected. Example: [ [2006,8,6],[2006,8,7],[2006,8,8] ]
	* @deprecated Event handlers for this event should be susbcribed to selectEvent.
	*/
	onSelect : function(selected) { },
	
	/**
	* Event executed before a date is deselected in the calendar widget.
	* @deprecated Event handlers for this event should be susbcribed to beforeDeselectEvent.
	*/
	onBeforeDeselect : function() { },
	
	/**
	* Event executed when a date is deselected in the calendar widget.
	* @param	{Array}	selected	An array of date field arrays representing which date or dates were deselected. Example: [ [2006,8,6],[2006,8,7],[2006,8,8] ]
	* @deprecated Event handlers for this event should be susbcribed to deselectEvent.
	*/
	onDeselect : function(deselected) { },
	
	/**
	* Event executed when the user navigates to a different calendar page.
	* @deprecated Event handlers for this event should be susbcribed to changePageEvent.
	*/
	onChangePage : function() {
		this.render();
	},

	/**
	* Event executed when the calendar widget is rendered.
	* @deprecated Event handlers for this event should be susbcribed to renderEvent.
	*/
	onRender : function() { },

	/**
	* Event executed when the calendar widget is reset to its original state.
	* @deprecated Event handlers for this event should be susbcribed to resetEvemt.
	*/
	onReset : function() { this.render(); },

	/**
	* Event executed when the calendar widget is completely cleared to the current month with no selections.
	* @deprecated Event handlers for this event should be susbcribed to clearEvent.
	*/
	onClear : function() { this.render(); },
	
	/**
	* Validates the calendar widget. This method has no default implementation
	* and must be extended by subclassing the widget.
	* @return	Should return true if the widget validates, and false if
	* it doesn't.
	* @type Boolean
	*/
	validate : function() { return true; },
	
	// END EVENT HANDLERS
	
	// BEGIN DATE PARSE METHODS
	
	/**
	* Converts a date string to a date field array
	* @private
	* @param	{String}	sDate			Date string. Valid formats are mm/dd and mm/dd/yyyy.
	* @return				A date field array representing the string passed to the method
	* @type Array[](Number[])
	*/
	_parseDate : function(sDate) {
		var aDate = sDate.split(this.Locale.DATE_FIELD_DELIMITER),
			rArray;
	
		if (aDate.length == 2) {
			rArray = [aDate[this.Locale.MD_MONTH_POSITION-1],aDate[this.Locale.MD_DAY_POSITION-1]];
			rArray.type = Calendar.MONTH_DAY;
		} else {
			rArray = [aDate[this.Locale.MDY_YEAR_POSITION-1],aDate[this.Locale.MDY_MONTH_POSITION-1],aDate[this.Locale.MDY_DAY_POSITION-1]];
			rArray.type = Calendar.DATE;
		}
	
		for (var i=0;i<rArray.length;i++) {
			rArray[i] = parseInt(rArray[i], 10);
		}
	
		return rArray;
	},
	
	/**
	* Converts a multi or single-date string to an array of date field arrays
	* @private
	* @param	{String}	sDates		Date string with one or more comma-delimited dates. Valid formats are mm/dd, mm/dd/yyyy, mm/dd/yyyy-mm/dd/yyyy
	* @return							An array of date field arrays
	* @type Array[](Number[])
	*/
	_parseDates : function(sDates) {
		var aReturn = [],
			aDates = sDates.split(this.Locale.DATE_DELIMITER);
		
		for (var d=0;d<aDates.length;++d) {
			var sDate = aDates[d];
	
			if (sDate.indexOf(this.Locale.DATE_RANGE_DELIMITER) != -1) {
				// This is a range
				var aRange = sDate.split(this.Locale.DATE_RANGE_DELIMITER),
					dateStart = this._parseDate(aRange[0]),
					dateEnd = this._parseDate(aRange[1]),
					fullRange = this._parseRange(dateStart, dateEnd);

				aReturn = aReturn.concat(fullRange);
			} else {
				// This is not a range
				var aDate = this._parseDate(sDate);
				aReturn.push(aDate);
			}
		}
		return aReturn;
	},
	
	/**
	* Converts a date range to the full list of included dates
	* @private
	* @param	{Number[]}	startDate	Date field array representing the first date in the range
	* @param	{Number[]}	endDate		Date field array representing the last date in the range
	* @return							An array of date field arrays
	* @type Array[](Number[])
	*/
	_parseRange : function(startDate, endDate) {
		var dCurrent = DateMath.add(DateMath.getDate(startDate[0],startDate[1]-1,startDate[2]),DateMath.DAY,1),
			dEnd     = DateMath.getDate(endDate[0],  endDate[1]-1,  endDate[2]),
			results = [];

		results.push(startDate);
		while (dCurrent.getTime() <= dEnd.getTime()) {
			results.push([dCurrent.getFullYear(),dCurrent.getMonth()+1,dCurrent.getDate()]);
			dCurrent = DateMath.add(dCurrent,DateMath.DAY,1);
		}
		return results;
	},
	
	// END DATE PARSE METHODS
	
	// BEGIN RENDERER METHODS
	
	/**
	* Resets the render stack of the current calendar to its original pre-render value.
	*/
	resetRenderers : function() {
		this.renderStack = this._renderStack.concat();
	},
	
	/**
	 * Removes all custom renderers added to the Calendar through the addRenderer, addMonthRenderer and 
	 * addWeekdayRenderer methods. Calendar's render method needs to be called after removing renderers 
	 * to re-render the Calendar without custom renderers applied.
	 */
	removeRenderers : function() {
		this._renderStack = [];
		this.renderStack = [];
	},

	/**
	* Clears the inner HTML, CSS class and style information from the specified cell.
	* @method clearElement
	* @param	{HTMLTableCellElement} cell The cell to clear
	*/ 
	clearElement : function(cell) {
		cell.innerHTML = "&#160;";
		cell.className="";
	},
	
	/**
	* Adds a renderer to the render stack. The function reference passed to this method will be executed
	* when a date cell matches the conditions specified in the date string for this renderer.
	* @method addRenderer
	* @param	{String}	sDates		A date string to associate with the specified renderer. Valid formats
	*									include date (12/24/2005), month/day (12/24), and range (12/1/2004-1/1/2005)
	* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
	*/
	addRenderer : function(sDates, fnRender) {
		var aDates = this._parseDates(sDates);
		for (var i=0;i<aDates.length;++i) {
			var aDate = aDates[i];
		
			if (aDate.length == 2) { // this is either a range or a month/day combo
				if (aDate[0] instanceof Array) { // this is a range
					this._addRenderer(Calendar.RANGE,aDate,fnRender);
				} else { // this is a month/day combo
					this._addRenderer(Calendar.MONTH_DAY,aDate,fnRender);
				}
			} else if (aDate.length == 3) {
				this._addRenderer(Calendar.DATE,aDate,fnRender);
			}
		}
	},
	
	/**
	* The private method used for adding cell renderers to the local render stack.
	* This method is called by other methods that set the renderer type prior to the method call.
	* @method _addRenderer
	* @private
	* @param	{String}	type		The type string that indicates the type of date renderer being added.
	*									Values are YAHOO.widget.Calendar.DATE, YAHOO.widget.Calendar.MONTH_DAY, YAHOO.widget.Calendar.WEEKDAY,
	*									YAHOO.widget.Calendar.RANGE, YAHOO.widget.Calendar.MONTH
	* @param	{Array}		aDates		An array of dates used to construct the renderer. The format varies based
	*									on the renderer type
	* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
	*/
	_addRenderer : function(type, aDates, fnRender) {
		var add = [type,aDates,fnRender];
		this.renderStack.unshift(add);	
		this._renderStack = this.renderStack.concat();
	},

	/**
	* Adds a month to the render stack. The function reference passed to this method will be executed
	* when a date cell matches the month passed to this method.
	* @method addMonthRenderer
	* @param	{Number}	month		The month (1-12) to associate with this renderer
	* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
	*/
	addMonthRenderer : function(month, fnRender) {
		this._addRenderer(Calendar.MONTH,[month],fnRender);
	},

	/**
	* Adds a weekday to the render stack. The function reference passed to this method will be executed
	* when a date cell matches the weekday passed to this method.
	* @method addWeekdayRenderer
	* @param	{Number}	weekday		The weekday (Sunday = 1, Monday = 2 ... Saturday = 7) to associate with this renderer
	* @param	{Function}	fnRender	The function executed to render cells that match the render rules for this renderer.
	*/
	addWeekdayRenderer : function(weekday, fnRender) {
		this._addRenderer(Calendar.WEEKDAY,[weekday],fnRender);
	},

	// END RENDERER METHODS
	
	// BEGIN CSS METHODS
	
	/**
	* Removes all styles from all body cells in the current calendar table.
	* @method clearAllBodyCellStyles
	* @param	{style}	style The CSS class name to remove from all calendar body cells
	*/
	clearAllBodyCellStyles : function(style) {
		for (var c=0;c<this.cells.length;++c) {
			Dom.removeClass(this.cells[c],style);
		}
	},
	
	// END CSS METHODS
	
	// BEGIN GETTER/SETTER METHODS
	/**
	* Sets the calendar's month explicitly
	* @method setMonth
	* @param {Number}	month		The numeric month, from 0 (January) to 11 (December)
	*/
	setMonth : function(month) {
		var cfgPageDate = DEF_CFG.PAGEDATE.key,
			current = this.cfg.getProperty(cfgPageDate);
		current.setMonth(parseInt(month, 10));
		this.cfg.setProperty(cfgPageDate, current);
	},

	/**
	* Sets the calendar's year explicitly.
	* @method setYear
	* @param {Number}	year		The numeric 4-digit year
	*/
	setYear : function(year) {
		var cfgPageDate = DEF_CFG.PAGEDATE.key,
			current = this.cfg.getProperty(cfgPageDate);

		current.setFullYear(parseInt(year, 10));
		this.cfg.setProperty(cfgPageDate, current);
	},

	/**
	* Gets the list of currently selected dates from the calendar.
	* @method getSelectedDates
	* @return {Date[]} An array of currently selected JavaScript Date objects.
	*/
	getSelectedDates : function() {
		var returnDates = [],
			selected = this.cfg.getProperty(DEF_CFG.SELECTED.key);

		for (var d=0;d<selected.length;++d) {
			var dateArray = selected[d];

			var date = DateMath.getDate(dateArray[0],dateArray[1]-1,dateArray[2]);
			returnDates.push(date);
		}

		returnDates.sort( function(a,b) { return a-b; } );
		return returnDates;
	},

	/// END GETTER/SETTER METHODS ///
	
	/**
	* Hides the Calendar's outer container from view.
	* @method hide
	*/
	hide : function() {
		if (this.beforeHideEvent.fire()) {
			this.oDomContainer.style.display = "none";
			this.hideEvent.fire();
		}
	},

	/**
	* Shows the Calendar's outer container.
	* @method show
	*/
	show : function() {
		if (this.beforeShowEvent.fire()) {
			this.oDomContainer.style.display = "block";
			this.showEvent.fire();
		}
	},

	/**
	* Returns a string representing the current browser.
	* @deprecated As of 2.3.0, environment information is available in YAHOO.env.ua
	* @see YAHOO.env.ua
	* @property browser
	* @type String
	*/
	browser : (function() {
				var ua = navigator.userAgent.toLowerCase();
					  if (ua.indexOf('opera')!=-1) { // Opera (check first in case of spoof)
						 return 'opera';
					  } else if (ua.indexOf('msie 7')!=-1) { // IE7
						 return 'ie7';
					  } else if (ua.indexOf('msie') !=-1) { // IE
						 return 'ie';
					  } else if (ua.indexOf('safari')!=-1) { // Safari (check before Gecko because it includes "like Gecko")
						 return 'safari';
					  } else if (ua.indexOf('gecko') != -1) { // Gecko
						 return 'gecko';
					  } else {
						 return false;
					  }
				})(),
	/**
	* Returns a string representation of the object.
	* @method toString
	* @return {String}	A string representation of the Calendar object.
	*/
	toString : function() {
		return "Calendar " + this.id;
	},

	/**
	 * Destroys the Calendar instance. The method will remove references
	 * to HTML elements, remove any event listeners added by the Calendar,
	 * and destroy the Config and CalendarNavigator instances it has created.
	 *
	 * @method destroy
	 */
	destroy : function() {

		if (this.beforeDestroyEvent.fire()) {
			var cal = this;

			// Child objects
			if (cal.navigator) {
				cal.navigator.destroy();
			}

			if (cal.cfg) {
				cal.cfg.destroy();
			}

			// DOM event listeners
			Event.purgeElement(cal.oDomContainer, true);

			// Generated markup/DOM - Not removing the container DIV since we didn't create it.
			Dom.removeClass(cal.oDomContainer, "withtitle");
			Dom.removeClass(cal.oDomContainer, cal.Style.CSS_CONTAINER);
			Dom.removeClass(cal.oDomContainer, cal.Style.CSS_SINGLE);
			cal.oDomContainer.innerHTML = "";

			// JS-to-DOM references
			cal.oDomContainer = null;
			cal.cells = null;

			this.destroyEvent.fire();
		}
	}
};

YAHOO.widget.Calendar = Calendar;

/**
* @namespace YAHOO.widget
* @class Calendar_Core
* @extends YAHOO.widget.Calendar
* @deprecated The old Calendar_Core class is no longer necessary.
*/
YAHOO.widget.Calendar_Core = YAHOO.widget.Calendar;

YAHOO.widget.Cal_Core = YAHOO.widget.Calendar;

})();