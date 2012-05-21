/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var self = jQuery( this ),
					args = [ parts[0], value ];

				self.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2012, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;

		var cur = a.nextSibling;
		}

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight,
		i = 0,
		len = which.length;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i++ ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i++ ) {
			val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
			}
		}
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );

window.Modernizr=function(ay,ax,aw){function V(b){ao.cssText=b}function U(d,c){return V(ak.join(d+";")+(c||""))}function T(d,c){return typeof d===c}function S(d,c){return !!~(""+d).indexOf(c)}function R(e,c){for(var f in e){if(ao[e[f]]!==aw){return c=="pfx"?e[f]:!0}}return !1}function Q(g,c,j){for(var i in g){var h=c[g[i]];if(h!==aw){return j===!1?g[i]:T(h,"function")?h.bind(j||c):h}}return !1}function P(g,f,j){var i=g.charAt(0).toUpperCase()+g.substr(1),h=(g+" "+ai.join(i+" ")+i).split(" ");return T(f,"string")||T(f,"undefined")?R(h,f):(h=(g+" "+ah.join(i+" ")+i).split(" "),Q(h,f,j))}function N(){au.input=function(f){for(var b=0,a=f.length;b<a;b++){ad[f[b]]=f[b] in an}return ad.list&&(ad.list=!!ax.createElement("datalist")&&!!ay.HTMLDataListElement),ad}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),au.inputtypes=function(b){for(var l=0,k,j,g,c=b.length;l<c;l++){an.setAttribute("type",j=b[l]),k=an.type!=="text",k&&(an.value=am,an.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(j)&&an.style.WebkitAppearance!==aw?(ar.appendChild(an),g=ax.defaultView,k=g.getComputedStyle&&g.getComputedStyle(an,null).WebkitAppearance!=="textfield"&&an.offsetHeight!==0,ar.removeChild(an)):/^(search|tel)$/.test(j)||(/^(url|email)$/.test(j)?k=an.checkValidity&&an.checkValidity()===!1:/^color$/.test(j)?(ar.appendChild(an),ar.offsetWidth,k=an.value!=am,ar.removeChild(an)):k=an.value!=am)),ae[b[l]]=!!k}return ae}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var av="2.5.3",au={},at=!0,ar=ax.documentElement,aq="modernizr",ap=ax.createElement(aq),ao=ap.style,an=ax.createElement("input"),am=":)",al={}.toString,ak=" -webkit- -moz- -o- -ms- ".split(" "),aj="Webkit Moz O ms",ai=aj.split(" "),ah=aj.toLowerCase().split(" "),ag={svg:"http://www.w3.org/2000/svg"},af={},ae={},ad={},ac=[],ab=ac.slice,aa,Z=function(t,s,r,q){var p,o,n,h=ax.createElement("div"),g=ax.body,b=g?g:ax.createElement("body");if(parseInt(r,10)){while(r--){n=ax.createElement("div"),n.id=q?q[r]:aq+(r+1),h.appendChild(n)}}return p=["&#173;","<style>",t,"</style>"].join(""),h.id=aq,(g?h:b).innerHTML+=p,b.appendChild(h),g||(b.style.background="",ar.appendChild(b)),o=s(h,t),g?h.parentNode.removeChild(h):b.parentNode.removeChild(b),!!o},Y=function(){function c(h,g){g=g||ax.createElement(b[h]||"div"),h="on"+h;var a=h in g;return a||(g.setAttribute||(g=ax.createElement("div")),g.setAttribute&&g.removeAttribute&&(g.setAttribute(h,""),a=T(g[h],"function"),T(g[h],"undefined")||(g[h]=aw),g.removeAttribute(h))),g=null,a}var b={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return c}(),X={}.hasOwnProperty,W;!T(X,"undefined")&&!T(X.call,"undefined")?W=function(d,c){return X.call(d,c)}:W=function(d,c){return c in d&&T(d.constructor.prototype[c],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(a){var h=this;if(typeof h!="function"){throw new TypeError}var g=ab.call(arguments,1),f=function(){if(this instanceof f){var b=function(){};b.prototype=h.prototype;var d=new b,c=h.apply(d,g.concat(ab.call(arguments)));return Object(c)===c?c:d}return h.apply(a,g.concat(ab.call(arguments)))};return f});var O=function(h,e){var b=h.join(""),a=e.length;Z(b,function(o,n){var m=ax.styleSheets[ax.styleSheets.length-1],l=m?m.cssRules&&m.cssRules[0]?m.cssRules[0].cssText:m.cssText||"":"",k=o.childNodes,g={};while(a--){g[k[a].id]=k[a]}au.touch="ontouchstart" in ay||ay.DocumentTouch&&ax instanceof DocumentTouch||(g.touch&&g.touch.offsetTop)===9,au.csstransforms3d=(g.csstransforms3d&&g.csstransforms3d.offsetLeft)===9&&g.csstransforms3d.offsetHeight===3,au.generatedcontent=(g.generatedcontent&&g.generatedcontent.offsetHeight)>=1,au.fontface=/src/i.test(l)&&l.indexOf(n.split(" ")[0])===0},a,e)}(['@font-face {font-family:"font";src:url("https://")}',["@media (",ak.join("touch-enabled),("),aq,")","{#touch{top:9px;position:absolute}}"].join(""),["@media (",ak.join("transform-3d),("),aq,")","{#csstransforms3d{left:9px;position:absolute;height:3px;}}"].join(""),['#generatedcontent:after{content:"',am,'";visibility:hidden}'].join("")],["fontface","touch","csstransforms3d","generatedcontent"]);af.flexbox=function(){return P("flexOrder")},af["flexbox-legacy"]=function(){return P("boxDirection")},af.canvas=function(){var b=ax.createElement("canvas");return !!b.getContext&&!!b.getContext("2d")},af.canvastext=function(){return !!au.canvas&&!!T(ax.createElement("canvas").getContext("2d").fillText,"function")},af.webgl=function(){try{var c=ax.createElement("canvas"),b;b=!(!ay.WebGLRenderingContext||!c.getContext("experimental-webgl")&&!c.getContext("webgl")),c=aw}catch(a){b=!1}return b},af.touch=function(){return au.touch},af.geolocation=function(){return !!navigator.geolocation},af.postmessage=function(){return !!ay.postMessage},af.websqldatabase=function(){return !!ay.openDatabase},af.indexedDB=function(){return !!P("indexedDB",ay)},af.hashchange=function(){return Y("hashchange",ay)&&(ax.documentMode===aw||ax.documentMode>7)},af.history=function(){return !!ay.history&&!!history.pushState},af.draganddrop=function(){var b=ax.createElement("div");return"draggable" in b||"ondragstart" in b&&"ondrop" in b},af.websockets=function(){for(var a=-1,d=ai.length;++a<d;){if(ay[ai[a]+"WebSocket"]){return !0}}return"WebSocket" in ay},af.rgba=function(){return V("background-color:rgba(150,255,150,.5)"),S(ao.backgroundColor,"rgba")},af.hsla=function(){return V("background-color:hsla(120,40%,100%,.5)"),S(ao.backgroundColor,"rgba")||S(ao.backgroundColor,"hsla")},af.multiplebgs=function(){return V("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(ao.background)},af.backgroundsize=function(){return P("backgroundSize")},af.borderimage=function(){return P("borderImage")},af.borderradius=function(){return P("borderRadius")},af.boxshadow=function(){return P("boxShadow")},af.textshadow=function(){return ax.createElement("div").style.textShadow===""},af.opacity=function(){return U("opacity:.55"),/^0.55$/.test(ao.opacity)},af.cssanimations=function(){return P("animationName")},af.csscolumns=function(){return P("columnCount")},af.cssgradients=function(){var e="background-image:",d="gradient(linear,left top,right bottom,from(#9f9),to(white));",f="linear-gradient(left top,#9f9, white);";return V((e+"-webkit- ".split(" ").join(d+e)+ak.join(f+e)).slice(0,-e.length)),S(ao.backgroundImage,"gradient")},af.cssreflections=function(){return P("boxReflect")},af.csstransforms=function(){return !!P("transform")},af.csstransforms3d=function(){var b=!!P("perspective");return b&&"webkitPerspective" in ar.style&&(b=au.csstransforms3d),b},af.csstransitions=function(){return P("transition")},af.fontface=function(){return au.fontface},af.generatedcontent=function(){return au.generatedcontent},af.video=function(){var b=ax.createElement("video"),f=!1;try{if(f=!!b.canPlayType){f=new Boolean(f),f.ogg=b.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),f.h264=b.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),f.webm=b.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}}catch(e){}return f},af.audio=function(){var b=ax.createElement("audio"),f=!1;try{if(f=!!b.canPlayType){f=new Boolean(f),f.ogg=b.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),f.mp3=b.canPlayType("audio/mpeg;").replace(/^no$/,""),f.wav=b.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),f.m4a=(b.canPlayType("audio/x-m4a;")||b.canPlayType("audio/aac;")).replace(/^no$/,"")}}catch(e){}return f},af.localstorage=function(){try{return localStorage.setItem(aq,aq),localStorage.removeItem(aq),!0}catch(b){return !1}},af.sessionstorage=function(){try{return sessionStorage.setItem(aq,aq),sessionStorage.removeItem(aq),!0}catch(b){return !1}},af.webworkers=function(){return !!ay.Worker},af.applicationcache=function(){return !!ay.applicationCache},af.svg=function(){return !!ax.createElementNS&&!!ax.createElementNS(ag.svg,"svg").createSVGRect},af.inlinesvg=function(){var b=ax.createElement("div");return b.innerHTML="<svg/>",(b.firstChild&&b.firstChild.namespaceURI)==ag.svg},af.smil=function(){return !!ax.createElementNS&&/SVGAnimate/.test(al.call(ax.createElementNS(ag.svg,"animate")))},af.svgclippaths=function(){return !!ax.createElementNS&&/SVGClipPath/.test(al.call(ax.createElementNS(ag.svg,"clipPath")))};for(var M in af){W(af,M)&&(aa=M.toLowerCase(),au[aa]=af[M](),ac.push((au[aa]?"":"no-")+aa))}return au.input||N(),V(""),ap=an=null,au._version=av,au._prefixes=ak,au._domPrefixes=ah,au._cssomPrefixes=ai,au.hasEvent=Y,au.testProp=function(b){return R([b])},au.testAllProps=P,au.testStyles=Z,ar.className=ar.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(at?" js "+ac.join(" "):""),au}(this,this.document),function(ad,ac,ab){function aa(b){return P.call(b)=="[object Function]"}function Z(b){return typeof b=="string"}function Y(){}function X(b){return !b||b=="loaded"||b=="complete"||b=="uninitialized"}function W(){var b=O.shift();M=1,b?b.t?R(function(){(b.t=="c"?L.injectCss:L.injectJs)(b.s,0,b.a,b.x,b.e,1)},0):(b(),W()):M=0}function V(w,v,t,s,q,p,n){function m(a){if(!g&&X(h.readyState)&&(x.r=g=1,!M&&W(),h.onload=h.onreadystatechange=null,a)){w!="img"&&R(function(){I.removeChild(h)},50);for(var c in D[v]){D[v].hasOwnProperty(c)&&D[v][c].onload()}}}var n=n||L.errorTimeout,h={},g=0,b=0,x={t:t,s:v,e:q,a:p,x:n};D[v]===1&&(b=1,D[v]=[],h=ac.createElement(w)),w=="object"?h.data=v:(h.src=v,h.type=w),h.width=h.height="0",h.onerror=h.onload=h.onreadystatechange=function(){m.call(this,b)},O.splice(s,0,x),w!="img"&&(b||D[v]===2?(I.insertBefore(h,J?null:Q),R(m,n)):D[v].push(h))}function U(g,e,j,i,h){return M=0,e=e||"j",Z(g)?V(e=="c"?G:H,g,e,this.i++,j,i,h):(O.splice(this.i++,0,g),O.length==1&&W()),this}function T(){var b=L;return b.loader={load:U,i:0},b}var S=ac.documentElement,R=ad.setTimeout,Q=ac.getElementsByTagName("script")[0],P={}.toString,O=[],M=0,K="MozAppearance" in S.style,J=K&&!!ac.createRange().compareNode,I=J?S:Q.parentNode,S=ad.opera&&P.call(ad.opera)=="[object Opera]",S=!!ac.attachEvent&&!S,H=K?"object":S?"script":"img",G=S?"script":H,F=Array.isArray||function(b){return P.call(b)=="[object Array]"},E=[],D={},C={timeout:function(d,c){return c.length&&(d.timeout=c[0]),d}},N,L;L=function(f){function d(j){var j=j.split("!"),i=E.length,q=j.pop(),p=j.length,q={url:q,origUrl:q,prefixes:j},o,m,l;for(m=0;m<p;m++){l=j[m].split("="),(o=C[l.shift()])&&(q=o(q,l))}for(m=0;m<i;m++){q=E[m](q)}return q}function n(m,s,r,q,p){var o=d(m),b=o.autoCallback;o.url.split(".").pop().split("?").shift(),o.bypass||(s&&(s=aa(s)?s:s[m]||s[q]||s[m.split("/").pop().split("?")[0]]||W),o.instead?o.instead(m,s,r,q,p):(D[o.url]?o.noexec=!0:D[o.url]=1,r.load(o.url,o.forceCSS||!o.forceJS&&"css"==o.url.split(".").pop().split("?").shift()?"c":ab,o.noexec,o.attrs,o.timeout),(aa(s)||aa(b))&&r.load(function(){T(),s&&s(o.origUrl,p,q),b&&b(o.origUrl,p,q),D[o.url]=2})))}function k(w,v){function u(b,i){if(b){if(Z(b)){i||(r=function(){var j=[].slice.call(arguments);q.apply(this,j),p()}),n(b,r,v,0,t)}else{if(Object(b)===b){for(g in o=function(){var a=0,j;for(j in b){b.hasOwnProperty(j)&&a++}return a}(),b){b.hasOwnProperty(g)&&(!i&&!--o&&(aa(r)?r=function(){var j=[].slice.call(arguments);q.apply(this,j),p()}:r[g]=function(j){return function(){var a=[].slice.call(arguments);j&&j.apply(this,a),p()}}(q[g])),n(b[g],r,v,g,t))}}}}else{!i&&p()}}var t=!!w.test,s=w.load||w.both,r=w.callback||Y,q=r,p=w.complete||Y,o,g;u(t?w.yep:w.nope,!!s),s&&u(s)}var h,e,c=this.yepnope.loader;if(Z(f)){n(f,0,c,0)}else{if(F(f)){for(h=0;h<f.length;h++){e=f[h],Z(e)?n(e,0,c,0):F(e)?L(e):Object(e)===e&&k(e,c)}}else{Object(f)===f&&k(f,c)}}},L.addPrefix=function(d,c){C[d]=c},L.addFilter=function(b){E.push(b)},L.errorTimeout=10000,ac.readyState==null&&ac.addEventListener&&(ac.readyState="loading",ac.addEventListener("DOMContentLoaded",N=function(){ac.removeEventListener("DOMContentLoaded",N,0),ac.readyState="complete"},0)),ad.yepnope=T(),ad.yepnope.executeStack=W,ad.yepnope.injectJs=function(r,q,p,n,m,h){var g=ac.createElement("script"),f,b,n=n||L.errorTimeout;g.src=r;for(b in p){g.setAttribute(b,p[b])}q=h?W:q||Y,g.onreadystatechange=g.onload=function(){!f&&X(g.readyState)&&(f=1,q(),g.onload=g.onreadystatechange=null)},R(function(){f||(f=1,q(1))},n),m?g.onload():Q.parentNode.insertBefore(g,Q)},ad.yepnope.injectCss=function(b,n,m,l,k,h){var l=ac.createElement("link"),f,n=h?W:n||Y;l.href=b,l.rel="stylesheet",l.type="text/css";for(f in m){l.setAttribute(f,m[f])}k||(Q.parentNode.insertBefore(l,Q),R(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};(function(){function af(b,n,m){if(b===n){return 0!==b||1/b==1/n}if(null==b||null==n){return b===n}b._chain&&(b=b._wrapped);n._chain&&(n=n._wrapped);if(b.isEqual&&ar.isFunction(b.isEqual)){return b.isEqual(n)}if(n.isEqual&&ar.isFunction(n.isEqual)){return n.isEqual(b)}var l=an.call(b);if(l!=an.call(n)){return !1}switch(l){case"[object String]":return b==""+n;case"[object Number]":return b!=+b?n!=+n:0==b?1/b==1/n:b==+n;case"[object Date]":case"[object Boolean]":return +b==+n;case"[object RegExp]":return b.source==n.source&&b.global==n.global&&b.multiline==n.multiline&&b.ignoreCase==n.ignoreCase}if("object"!=typeof b||"object"!=typeof n){return !1}for(var k=m.length;k--;){if(m[k]==b){return !0}}m.push(b);var k=0,j=!0;if("[object Array]"==l){if(k=b.length,j=k==n.length){for(;k--&&(j=k in b==k in n&&af(b[k],n[k],m));){}}}else{if("constructor" in b!="constructor" in n||b.constructor!=n.constructor){return !1}for(var i in b){if(ar.has(b,i)&&(k++,!(j=ar.has(n,i)&&af(b[i],n[i],m)))){break}}if(j){for(i in n){if(ar.has(n,i)&&!k--){break}}j=!k}}m.pop();return j}var ac=this,T=ac._,ak={},ao=Array.prototype,aj=Object.prototype,aq=ao.slice,Q=ao.unshift,an=aj.toString,g=aj.hasOwnProperty,R=ao.forEach,h=ao.map,ai=ao.reduce,ah=ao.reduceRight,ae=ao.filter,ad=ao.every,ab=ao.some,ag=ao.indexOf,Z=ao.lastIndexOf,aj=Array.isArray,f=Object.keys,aa=Function.prototype.bind,ar=function(b){return new am(b)};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=ar),exports._=ar):ac._=ar;ar.VERSION="1.3.3";var ap=ar.each=ar.forEach=function(b,l,k){if(b!=null){if(R&&b.forEach===R){b.forEach(l,k)}else{if(b.length===+b.length){for(var j=0,i=b.length;j<i;j++){if(j in b&&l.call(k,b[j],j,b)===ak){break}}}else{for(j in b){if(ar.has(b,j)&&l.call(k,b[j],j,b)===ak){break}}}}}};ar.map=ar.collect=function(j,l,i){var k=[];if(j==null){return k}if(h&&j.map===h){return j.map(l,i)}ap(j,function(b,n,m){k[k.length]=l.call(i,b,n,m)});if(j.length===+j.length){k.length=j.length}return k};ar.reduce=ar.foldl=ar.inject=function(b,l,k,j){var i=arguments.length>2;b==null&&(b=[]);if(ai&&b.reduce===ai){j&&(l=ar.bind(l,j));return i?b.reduce(l,k):b.reduce(l)}ap(b,function(n,m,o){if(i){k=l.call(j,k,n,m,o)}else{k=n;i=true}});if(!i){throw new TypeError("Reduce of empty array with no initial value")}return k};ar.reduceRight=ar.foldr=function(b,m,l,k){var j=arguments.length>2;b==null&&(b=[]);if(ah&&b.reduceRight===ah){k&&(m=ar.bind(m,k));return j?b.reduceRight(m,l):b.reduceRight(m)}var i=ar.toArray(b).reverse();k&&!j&&(m=ar.bind(m,k));return j?ar.reduce(i,m,l,k):ar.reduce(i,m)};ar.find=ar.detect=function(j,l,i){var k;X(j,function(b,n,m){if(l.call(i,b,n,m)){k=b;return true}});return k};ar.filter=ar.select=function(j,l,i){var k=[];if(j==null){return k}if(ae&&j.filter===ae){return j.filter(l,i)}ap(j,function(b,n,m){l.call(i,b,n,m)&&(k[k.length]=b)});return k};ar.reject=function(j,l,i){var k=[];if(j==null){return k}ap(j,function(b,n,m){l.call(i,b,n,m)||(k[k.length]=b)});return k};ar.every=ar.all=function(j,l,i){var k=true;if(j==null){return k}if(ad&&j.every===ad){return j.every(l,i)}ap(j,function(b,n,m){if(!(k=k&&l.call(i,b,n,m))){return ak}});return !!k};var X=ar.some=ar.any=function(b,k,j){k||(k=ar.identity);var i=false;if(b==null){return i}if(ab&&b.some===ab){return b.some(k,j)}ap(b,function(m,l,n){if(i||(i=k.call(j,m,l,n))){return ak}});return !!i};ar.include=ar.contains=function(j,k){var i=false;if(j==null){return i}if(ag&&j.indexOf===ag){return j.indexOf(k)!=-1}return i=X(j,function(b){return b===k})};ar.invoke=function(b,j){var i=aq.call(arguments,2);return ar.map(b,function(k){return(ar.isFunction(j)?j||k:k[j]).apply(k,i)})};ar.pluck=function(b,i){return ar.map(b,function(j){return j[i]})};ar.max=function(b,k,j){if(!k&&ar.isArray(b)&&b[0]===+b[0]){return Math.max.apply(Math,b)}if(!k&&ar.isEmpty(b)){return -Infinity}var i={computed:-Infinity};ap(b,function(m,l,n){l=k?k.call(j,m,l,n):m;l>=i.computed&&(i={value:m,computed:l})});return i.value};ar.min=function(b,k,j){if(!k&&ar.isArray(b)&&b[0]===+b[0]){return Math.min.apply(Math,b)}if(!k&&ar.isEmpty(b)){return Infinity}var i={computed:Infinity};ap(b,function(m,l,n){l=k?k.call(j,m,l,n):m;l<i.computed&&(i={value:m,computed:l})});return i.value};ar.shuffle=function(j){var i=[],k;ap(j,function(b,l){k=Math.floor(Math.random()*(l+1));i[l]=i[k];i[k]=b});return i};ar.sortBy=function(b,k,j){var i=ar.isFunction(k)?k:function(l){return l[k]};return ar.pluck(ar.map(b,function(m,l,n){return{value:m,criteria:i.call(j,m,l,n)}}).sort(function(m,l){var o=m.criteria,n=l.criteria;return o===void 0?1:n===void 0?-1:o<n?-1:o>n?1:0}),"value")};ar.groupBy=function(b,k){var j={},i=ar.isFunction(k)?k:function(l){return l[k]};ap(b,function(m,l){var n=i(m,l);(j[n]||(j[n]=[])).push(m)});return j};ar.sortedIndex=function(b,m,l){l||(l=ar.identity);for(var k=0,j=b.length;k<j;){var i=k+j>>1;l(b[i])<l(m)?k=i+1:j=i}return k};ar.toArray=function(b){return !b?[]:ar.isArray(b)||ar.isArguments(b)?aq.call(b):b.toArray&&ar.isFunction(b.toArray)?b.toArray():ar.values(b)};ar.size=function(b){return ar.isArray(b)?b.length:ar.keys(b).length};ar.first=ar.head=ar.take=function(j,i,k){return i!=null&&!k?aq.call(j,0,i):j[0]};ar.initial=function(j,i,k){return aq.call(j,0,j.length-(i==null||k?1:i))};ar.last=function(j,i,k){return i!=null&&!k?aq.call(j,Math.max(j.length-i,0)):j[j.length-1]};ar.rest=ar.tail=function(j,i,k){return aq.call(j,i==null||k?1:i)};ar.compact=function(b){return ar.filter(b,function(i){return !!i})};ar.flatten=function(b,i){return ar.reduce(b,function(j,k){if(ar.isArray(k)){return j.concat(i?k:ar.flatten(k))}j[j.length]=k;return j},[])};ar.without=function(b){return ar.difference(b,aq.call(arguments,1))};ar.uniq=ar.unique=function(b,k,j){var j=j?ar.map(b,j):b,i=[];b.length<3&&(k=true);ar.reduce(j,function(n,m,l){if(k?ar.last(n)!==m||!n.length:!ar.include(n,m)){n.push(m);i.push(b[l])}return n},[]);return i};ar.union=function(){return ar.uniq(ar.flatten(arguments,true))};ar.intersection=ar.intersect=function(b){var i=aq.call(arguments,1);return ar.filter(ar.uniq(b),function(j){return ar.every(i,function(k){return ar.indexOf(k,j)>=0})})};ar.difference=function(b){var i=ar.flatten(aq.call(arguments,1),true);return ar.filter(b,function(j){return !ar.include(i,j)})};ar.zip=function(){for(var b=aq.call(arguments),k=ar.max(ar.pluck(b,"length")),j=Array(k),i=0;i<k;i++){j[i]=ar.pluck(b,""+i)}return j};ar.indexOf=function(b,k,j){if(b==null){return -1}var i;if(j){j=ar.sortedIndex(b,k);return b[j]===k?j:-1}if(ag&&b.indexOf===ag){return b.indexOf(k)}j=0;for(i=b.length;j<i;j++){if(j in b&&b[j]===k){return j}}return -1};ar.lastIndexOf=function(j,i){if(j==null){return -1}if(Z&&j.lastIndexOf===Z){return j.lastIndexOf(i)}for(var k=j.length;k--;){if(k in j&&j[k]===i){return k}}return -1};ar.range=function(j,i,n){if(arguments.length<=1){i=j||0;j=0}for(var n=arguments[2]||1,m=Math.max(Math.ceil((i-j)/n),0),l=0,k=Array(m);l<m;){k[l++]=j;j=j+n}return k};var V=function(){};ar.bind=function(b,k){var j,i;if(b.bind===aa&&aa){return aa.apply(b,aq.call(arguments,1))}if(!ar.isFunction(b)){throw new TypeError}i=aq.call(arguments,2);return j=function(){if(!(this instanceof j)){return b.apply(k,i.concat(aq.call(arguments)))}V.prototype=b.prototype;var l=new V,m=b.apply(l,i.concat(aq.call(arguments)));return Object(m)===m?m:l}};ar.bindAll=function(b){var i=aq.call(arguments,1);i.length==0&&(i=ar.functions(b));ap(i,function(j){b[j]=ar.bind(b[j],b)});return b};ar.memoize=function(b,j){var i={};j||(j=ar.identity);return function(){var k=j.apply(this,arguments);return ar.has(i,k)?i[k]:i[k]=b.apply(this,arguments)}};ar.delay=function(j,i){var k=aq.call(arguments,2);return setTimeout(function(){return j.apply(null,k)},i)};ar.defer=function(b){return ar.delay.apply(ar,[b,1].concat(aq.call(arguments,1)))};ar.throttle=function(r,q){var p,o,n,m,l,k,b=ar.debounce(function(){l=m=false},q);return function(){p=this;o=arguments;n||(n=setTimeout(function(){n=null;l&&r.apply(p,o);b()},q));m?l=true:k=r.apply(p,o);b();m=true;return k}};ar.debounce=function(j,i,l){var k;return function(){var m=this,b=arguments;l&&!k&&j.apply(m,b);clearTimeout(k);k=setTimeout(function(){k=null;l||j.apply(m,b)},i)}};ar.once=function(j){var i=false,k;return function(){if(i){return k}i=true;return k=j.apply(this,arguments)}};ar.wrap=function(j,i){return function(){var b=[j].concat(aq.call(arguments,0));return i.apply(this,b)}};ar.compose=function(){var b=arguments;return function(){for(var i=arguments,j=b.length-1;j>=0;j--){i=[b[j].apply(this,i)]}return i[0]}};ar.after=function(j,i){return j<=0?i():function(){if(--j<1){return i.apply(this,arguments)}}};ar.keys=f||function(b){if(b!==Object(b)){throw new TypeError("Invalid object")}var j=[],i;for(i in b){ar.has(b,i)&&(j[j.length]=i)}return j};ar.values=function(b){return ar.map(b,ar.identity)};ar.functions=ar.methods=function(b){var j=[],i;for(i in b){ar.isFunction(b[i])&&j.push(i)}return j.sort()};ar.extend=function(b){ap(aq.call(arguments,1),function(i){for(var j in i){b[j]=i[j]}});return b};ar.pick=function(b){var i={};ap(ar.flatten(aq.call(arguments,1)),function(j){j in b&&(i[j]=b[j])});return i};ar.defaults=function(b){ap(aq.call(arguments,1),function(i){for(var j in i){b[j]==null&&(b[j]=i[j])}});return b};ar.clone=function(b){return !ar.isObject(b)?b:ar.isArray(b)?b.slice():ar.extend({},b)};ar.tap=function(j,i){i(j);return j};ar.isEqual=function(j,i){return af(j,i,[])};ar.isEmpty=function(b){if(b==null){return true}if(ar.isArray(b)||ar.isString(b)){return b.length===0}for(var i in b){if(ar.has(b,i)){return false}}return true};ar.isElement=function(b){return !!(b&&b.nodeType==1)};ar.isArray=aj||function(b){return an.call(b)=="[object Array]"};ar.isObject=function(b){return b===Object(b)};ar.isArguments=function(b){return an.call(b)=="[object Arguments]"};ar.isArguments(arguments)||(ar.isArguments=function(b){return !(!b||!ar.has(b,"callee"))});ar.isFunction=function(b){return an.call(b)=="[object Function]"};ar.isString=function(b){return an.call(b)=="[object String]"};ar.isNumber=function(b){return an.call(b)=="[object Number]"};ar.isFinite=function(b){return ar.isNumber(b)&&isFinite(b)};ar.isNaN=function(b){return b!==b};ar.isBoolean=function(b){return b===true||b===false||an.call(b)=="[object Boolean]"};ar.isDate=function(b){return an.call(b)=="[object Date]"};ar.isRegExp=function(b){return an.call(b)=="[object RegExp]"};ar.isNull=function(b){return b===null};ar.isUndefined=function(b){return b===void 0};ar.has=function(j,i){return g.call(j,i)};ar.noConflict=function(){ac._=T;return this};ar.identity=function(b){return b};ar.times=function(j,i,l){for(var k=0;k<j;k++){i.call(l,k)}};ar.escape=function(b){return(""+b).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};ar.result=function(b,j){if(b==null){return null}var i=b[j];return ar.isFunction(i)?i.call(b):i};ar.mixin=function(b){ap(ar.functions(b),function(i){e(i,ar[i]=b[i])})};var d=0;ar.uniqueId=function(j){var i=d++;return j?j+i:i};ar.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var Y=/.^/,al={"\\":"\\","'":"'",r:"\r",n:"\n",t:"\t",u2028:"\u2028",u2029:"\u2029"},W;for(W in al){al[al[W]]=W}var c=/\\|'|\r|\n|\t|\u2028|\u2029/g,a=/\\(\\|'|r|n|t|u2028|u2029)/g,U=function(b){return b.replace(a,function(j,i){return al[i]})};ar.template=function(b,k,j){j=ar.defaults(j||{},ar.templateSettings);b="__p+='"+b.replace(c,function(l){return"\\"+al[l]}).replace(j.escape||Y,function(m,l){return"'+\n_.escape("+U(l)+")+\n'"}).replace(j.interpolate||Y,function(m,l){return"'+\n("+U(l)+")+\n'"}).replace(j.evaluate||Y,function(m,l){return"';\n"+U(l)+"\n;__p+='"})+"';\n";j.variable||(b="with(obj||{}){\n"+b+"}\n");var b="var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n"+b+"return __p;\n",i=new Function(j.variable||"obj","_",b);if(k){return i(k,ar)}k=function(l){return i.call(this,l,ar)};k.source="function("+(j.variable||"obj")+"){\n"+b+"}";return k};ar.chain=function(b){return ar(b).chain()};var am=function(b){this._wrapped=b};ar.prototype=am.prototype;var S=function(b,i){return i?ar(b).chain():b},e=function(b,i){am.prototype[b]=function(){var j=aq.call(arguments);Q.call(j,this._wrapped);return S(i.apply(ar,j),this._chain)}};ar.mixin(ar);ap("pop,push,reverse,shift,sort,splice,unshift".split(","),function(j){var i=ao[j];am.prototype[j]=function(){var k=this._wrapped;i.apply(k,arguments);var b=k.length;(j=="shift"||j=="splice")&&b===0&&delete k[0];return S(k,this._chain)}});ap(["concat","join","slice"],function(j){var i=ao[j];am.prototype[j]=function(){return S(i.apply(this._wrapped,arguments),this._chain)}});am.prototype.chain=function(){this._chain=true;return this};am.prototype.value=function(){return this._wrapped}}).call(this);(function(){var V=this,b=V.Backbone,a=Array.prototype.slice,Q=Array.prototype.splice,Y;Y="undefined"!==typeof exports?exports:V.Backbone={};Y.VERSION="0.9.2";var Z=V._;!Z&&"undefined"!==typeof require&&(Z=require("underscore"));var X=V.jQuery||V.Zepto||V.ender;Y.setDomLibrary=function(f){X=f};Y.noConflict=function(){V.Backbone=b;return this};Y.emulateHTTP=!1;Y.emulateJSON=!1;var R=/\s+/,W=Y.Events={on:function(k,i,r){var p,o,n,m,l;if(!i){return this}k=k.split(R);for(p=this._callbacks||(this._callbacks={});o=k.shift();){n=(l=p[o])?l.tail:{},n.next=m={},n.context=r,n.callback=i,p[o]={tail:m,next:l?l.next:n}}return this},off:function(r,p,o){var n,m,k,l,i,f;if(m=this._callbacks){if(!r&&!p&&!o){return delete this._callbacks,this}for(r=r?r.split(R):Z.keys(m);n=r.shift();){if(k=m[n],delete m[n],k&&(p||o)){for(l=k.tail;(k=k.next)!==l;){if(i=k.callback,f=k.context,p&&i!==p||o&&f!==o){this.on(n,i,f)}}}}return this}},trigger:function(k){var i,p,o,n,m,l;if(!(o=this._callbacks)){return this}m=o.all;k=k.split(R);for(l=a.call(arguments,1);i=k.shift();){if(p=o[i]){for(n=p.tail;(p=p.next)!==n;){p.callback.apply(p.context||this,l)}}if(p=m){n=p.tail;for(i=[i].concat(l);(p=p.next)!==n;){p.callback.apply(p.context||this,i)}}}return this}};W.bind=W.on;W.unbind=W.off;var S=Y.Model=function(g,f){var i;g||(g={});f&&f.parse&&(g=this.parse(g));if(i=T(this,"defaults")){g=Z.extend({},i,g)}f&&f.collection&&(this.collection=f.collection);this.attributes={};this._escapedAttributes={};this.cid=Z.uniqueId("c");this.changed={};this._silent={};this._pending={};this.set(g,{silent:!0});this.changed={};this._silent={};this._pending={};this._previousAttributes=Z.clone(this.attributes);this.initialize.apply(this,arguments)};Z.extend(S.prototype,W,{changed:null,_silent:null,_pending:null,idAttribute:"id",initialize:function(){},toJSON:function(){return Z.clone(this.attributes)},get:function(f){return this.attributes[f]},escape:function(g){var f;if(f=this._escapedAttributes[g]){return f}f=this.get(g);return this._escapedAttributes[g]=Z.escape(null==f?"":""+f)},has:function(f){return null!=this.get(f)},set:function(i,f,p){var o,n;Z.isObject(i)||null==i?(o=i,p=f):(o={},o[i]=f);p||(p={});if(!o){return this}o instanceof S&&(o=o.attributes);if(p.unset){for(n in o){o[n]=void 0}}if(!this._validate(o,p)){return !1}this.idAttribute in o&&(this.id=o[this.idAttribute]);var f=p.changes={},l=this.attributes,m=this._escapedAttributes,k=this._previousAttributes||{};for(n in o){i=o[n];if(!Z.isEqual(l[n],i)||p.unset&&Z.has(l,n)){delete m[n],(p.silent?this._silent:f)[n]=!0}p.unset?delete l[n]:l[n]=i;!Z.isEqual(k[n],i)||Z.has(l,n)!=Z.has(k,n)?(this.changed[n]=i,p.silent||(this._pending[n]=!0)):(delete this.changed[n],delete this._pending[n])}p.silent||this.change(p);return this},unset:function(g,f){(f||(f={})).unset=!0;return this.set(g,null,f)},clear:function(f){(f||(f={})).unset=!0;return this.set(Z.clone(this.attributes),f)},fetch:function(g){var g=g?Z.clone(g):{},f=this,i=g.success;g.success=function(m,l,k){if(!f.set(f.parse(m,k),g)){return !1}i&&i(f,m)};g.error=Y.wrapError(g.error,f,g);return(this.sync||Y.sync).call(this,"read",this,g)},save:function(g,f,o){var n,m;Z.isObject(g)||null==g?(n=g,o=f):(n={},n[g]=f);o=o?Z.clone(o):{};if(o.wait){if(!this._validate(n,o)){return !1}m=Z.clone(this.attributes)}g=Z.extend({},o,{silent:!0});if(n&&!this.set(n,o.wait?g:o)){return !1}var l=this,k=o.success;o.success=function(p,i,r){i=l.parse(p,r);if(o.wait){delete o.wait;i=Z.extend(n||{},i)}if(!l.set(i,o)){return false}k?k(l,p):l.trigger("sync",l,p,o)};o.error=Y.wrapError(o.error,l,o);f=this.isNew()?"create":"update";f=(this.sync||Y.sync).call(this,f,this,o);o.wait&&this.set(m,g);return f},destroy:function(g){var g=g?Z.clone(g):{},f=this,l=g.success,k=function(){f.trigger("destroy",f,f.collection,g)};if(this.isNew()){return k(),!1}g.success=function(m){g.wait&&k();l?l(f,m):f.trigger("sync",f,m,g)};g.error=Y.wrapError(g.error,f,g);var i=(this.sync||Y.sync).call(this,"delete",this,g);g.wait||k();return i},url:function(){var f=T(this,"urlRoot")||T(this.collection,"url")||J();return this.isNew()?f:f+("/"==f.charAt(f.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(f){return f},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},change:function(g){g||(g={});var f=this._changing;this._changing=!0;for(var k in this._silent){this._pending[k]=!0}var i=Z.extend({},g.changes,this._silent);this._silent={};for(k in i){this.trigger("change:"+k,this,this.get(k),g)}if(f){return this}for(;!Z.isEmpty(this._pending);){this._pending={};this.trigger("change",this,g);for(k in this.changed){!this._pending[k]&&!this._silent[k]&&delete this.changed[k]}this._previousAttributes=Z.clone(this.attributes)}this._changing=!1;return this},hasChanged:function(f){return !arguments.length?!Z.isEmpty(this.changed):Z.has(this.changed,f)},changedAttributes:function(g){if(!g){return this.hasChanged()?Z.clone(this.changed):!1}var f,l=!1,k=this._previousAttributes,i;for(i in g){if(!Z.isEqual(k[i],f=g[i])){(l||(l={}))[i]=f}}return l},previous:function(f){return !arguments.length||!this._previousAttributes?null:this._previousAttributes[f]},previousAttributes:function(){return Z.clone(this._previousAttributes)},isValid:function(){return !this.validate(this.attributes)},_validate:function(g,f){if(f.silent||!this.validate){return !0}var g=Z.extend({},this.attributes,g),i=this.validate(g,f);if(!i){return !0}f&&f.error?f.error(this,i,f):this.trigger("error",this,i,f);return !1}});var O=Y.Collection=function(g,f){f||(f={});f.model&&(this.model=f.model);f.comparator&&(this.comparator=f.comparator);this._reset();this.initialize.apply(this,arguments);g&&this.reset(g,{silent:!0,parse:f.parse})};Z.extend(O.prototype,W,{model:S,initialize:function(){},toJSON:function(f){return this.map(function(g){return g.toJSON(f)})},add:function(v,u){var t,s,r,p,o,n={},m={},f=[];u||(u={});v=Z.isArray(v)?v.slice():[v];t=0;for(s=v.length;t<s;t++){if(!(r=v[t]=this._prepareModel(v[t],u))){throw Error("Can't add an invalid model to a collection")}p=r.cid;o=r.id;n[p]||this._byCid[p]||null!=o&&(m[o]||this._byId[o])?f.push(t):n[p]=m[o]=r}for(t=f.length;t--;){v.splice(f[t],1)}t=0;for(s=v.length;t<s;t++){(r=v[t]).on("all",this._onModelEvent,this),this._byCid[r.cid]=r,null!=r.id&&(this._byId[r.id]=r)}this.length+=s;Q.apply(this.models,[null!=u.at?u.at:this.models.length,0].concat(v));this.comparator&&this.sort({silent:!0});if(u.silent){return this}t=0;for(s=this.models.length;t<s;t++){if(n[(r=this.models[t]).cid]){u.index=t,r.trigger("add",r,this,u)}}return this},remove:function(i,f){var n,m,l,k;f||(f={});i=Z.isArray(i)?i.slice():[i];n=0;for(m=i.length;n<m;n++){if(k=this.getByCid(i[n])||this.get(i[n])){delete this._byId[k.id],delete this._byCid[k.cid],l=this.indexOf(k),this.models.splice(l,1),this.length--,f.silent||(f.index=l,k.trigger("remove",k,this,f)),this._removeReference(k)}}return this},push:function(g,f){g=this._prepareModel(g,f);this.add(g,f);return g},pop:function(g){var f=this.at(this.length-1);this.remove(f,g);return f},unshift:function(g,f){g=this._prepareModel(g,f);this.add(g,Z.extend({at:0},f));return g},shift:function(g){var f=this.at(0);this.remove(f,g);return f},get:function(f){return null==f?void 0:this._byId[null!=f.id?f.id:f]},getByCid:function(f){return f&&this._byCid[f.cid||f]},at:function(f){return this.models[f]},where:function(f){return Z.isEmpty(f)?[]:this.filter(function(g){for(var i in f){if(f[i]!==g.get(i)){return !1}}return !0})},sort:function(g){g||(g={});if(!this.comparator){throw Error("Cannot sort a set without a comparator")}var f=Z.bind(this.comparator,this);1==this.comparator.length?this.models=this.sortBy(f):this.models.sort(f);g.silent||this.trigger("reset",this,g);return this},pluck:function(f){return Z.map(this.models,function(g){return g.get(f)})},reset:function(g,f){g||(g=[]);f||(f={});for(var k=0,i=this.models.length;k<i;k++){this._removeReference(this.models[k])}this._reset();this.add(g,Z.extend({silent:!0},f));f.silent||this.trigger("reset",this,f);return this},fetch:function(g){g=g?Z.clone(g):{};void 0===g.parse&&(g.parse=!0);var f=this,i=g.success;g.success=function(m,l,k){f[g.add?"add":"reset"](f.parse(m,k),g);i&&i(f,m)};g.error=Y.wrapError(g.error,f,g);return(this.sync||Y.sync).call(this,"read",this,g)},create:function(g,f){var k=this,f=f?Z.clone(f):{},g=this._prepareModel(g,f);if(!g){return !1}f.wait||k.add(g,f);var i=f.success;f.success=function(m,l){f.wait&&k.add(m,f);i?i(m,l):m.trigger("sync",g,l,f)};g.save(null,f);return g},parse:function(f){return f},chain:function(){return Z(this.models).chain()},_reset:function(){this.length=0;this.models=[];this._byId={};this._byCid={}},_prepareModel:function(g,f){f||(f={});g instanceof S?g.collection||(g.collection=this):(f.collection=this,g=new this.model(g,f),g._validate(g.attributes,f)||(g=!1));return g},_removeReference:function(f){this==f.collection&&delete f.collection;f.off("all",this._onModelEvent,this)},_onModelEvent:function(g,f,k,i){("add"==g||"remove"==g)&&k!=this||("destroy"==g&&this.remove(f,i),f&&g==="change:"+f.idAttribute&&(delete this._byId[f.previous(f.idAttribute)],this._byId[f.id]=f),this.trigger.apply(this,arguments))}});Z.each("forEach,each,map,reduce,reduceRight,find,detect,filter,select,reject,every,all,some,any,include,contains,invoke,max,min,sortBy,sortedIndex,toArray,size,first,initial,rest,last,without,indexOf,shuffle,lastIndexOf,isEmpty,groupBy".split(","),function(f){O.prototype[f]=function(){return Z[f].apply(Z,[this.models].concat(Z.toArray(arguments)))}});var I=Y.Router=function(f){f||(f={});f.routes&&(this.routes=f.routes);this._bindRoutes();this.initialize.apply(this,arguments)},P=/:\w+/g,N=/\*\w+/g,M=/[-[\]{}()+?.,\\^$|#\s]/g;Z.extend(I.prototype,W,{initialize:function(){},route:function(g,f,i){Y.history||(Y.history=new U);Z.isRegExp(g)||(g=this._routeToRegExp(g));i||(i=this[f]);Y.history.route(g,Z.bind(function(k){k=this._extractParameters(g,k);i&&i.apply(this,k);this.trigger.apply(this,["route:"+f].concat(k));Y.history.trigger("route",this,f,k)},this));return this},navigate:function(g,f){Y.history.navigate(g,f)},_bindRoutes:function(){if(this.routes){var g=[],f;for(f in this.routes){g.unshift([f,this.routes[f]])}f=0;for(var i=g.length;f<i;f++){this.route(g[f][0],g[f][1],this[g[f][1]])}}},_routeToRegExp:function(f){f=f.replace(M,"\\$&").replace(P,"([^/]+)").replace(N,"(.*?)");return RegExp("^"+f+"$")},_extractParameters:function(g,f){return g.exec(f).slice(1)}});var U=Y.History=function(){this.handlers=[];Z.bindAll(this,"checkUrl")},L=/^[#\/]/,K=/msie [\w.]+/;U.started=!1;Z.extend(U.prototype,W,{interval:50,getHash:function(f){return(f=(f?f.location:window.location).href.match(/#(.*)$/))?f[1]:""},getFragment:function(g,f){if(null==g){if(this._hasPushState||f){var g=window.location.pathname,i=window.location.search;i&&(g+=i)}else{g=this.getHash()}}g.indexOf(this.options.root)||(g=g.substr(this.options.root.length));return g.replace(L,"")},start:function(g){if(U.started){throw Error("Backbone.history has already been started")}U.started=!0;this.options=Z.extend({},{root:"/"},this.options,g);this._wantsHashChange=!1!==this.options.hashChange;this._wantsPushState=!!this.options.pushState;this._hasPushState=!(!this.options.pushState||!window.history||!window.history.pushState);var g=this.getFragment(),f=document.documentMode;if(f=K.exec(navigator.userAgent.toLowerCase())&&(!f||7>=f)){this.iframe=X('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(g)}this._hasPushState?X(window).bind("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange" in window&&!f?X(window).bind("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval));this.fragment=g;g=window.location;f=g.pathname==this.options.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!f){return this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0}this._wantsPushState&&this._hasPushState&&f&&g.hash&&(this.fragment=this.getHash().replace(L,""),window.history.replaceState({},document.title,g.protocol+"//"+g.host+this.options.root+this.fragment));if(!this.options.silent){return this.loadUrl()}},stop:function(){X(window).unbind("popstate",this.checkUrl).unbind("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);U.started=!1},route:function(g,f){this.handlers.unshift({route:g,callback:f})},checkUrl:function(){var f=this.getFragment();f==this.fragment&&this.iframe&&(f=this.getFragment(this.getHash(this.iframe)));if(f==this.fragment){return !1}this.iframe&&this.navigate(f);this.loadUrl()||this.loadUrl(this.getHash())},loadUrl:function(g){var f=this.fragment=this.getFragment(g);return Z.any(this.handlers,function(i){if(i.route.test(f)){return i.callback(f),!0}})},navigate:function(g,f){if(!U.started){return !1}if(!f||!0===f){f={trigger:f}}var i=(g||"").replace(L,"");this.fragment!=i&&(this._hasPushState?(0!=i.indexOf(this.options.root)&&(i=this.options.root+i),this.fragment=i,window.history[f.replace?"replaceState":"pushState"]({},document.title,i)):this._wantsHashChange?(this.fragment=i,this._updateHash(window.location,i,f.replace),this.iframe&&i!=this.getFragment(this.getHash(this.iframe))&&(f.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,i,f.replace))):window.location.assign(this.options.root+g),f.trigger&&this.loadUrl(g))},_updateHash:function(g,f,i){i?g.replace(g.toString().replace(/(javascript:|#).*$/,"")+"#"+f):g.hash=f}});var j=Y.View=function(f){this.cid=Z.uniqueId("view");this._configure(f||{});this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()},q=/^(\S+)\s*(.*)$/,e="model,collection,el,id,attributes,className,tagName".split(",");Z.extend(j.prototype,W,{tagName:"div",$:function(f){return this.$el.find(f)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();return this},make:function(g,f,i){g=document.createElement(g);f&&X(g).attr(f);i&&X(g).html(i);return g},setElement:function(g,f){this.$el&&this.undelegateEvents();this.$el=g instanceof X?g:X(g);this.el=this.$el[0];!1!==f&&this.delegateEvents();return this},delegateEvents:function(g){if(g||(g=T(this,"events"))){this.undelegateEvents();for(var f in g){var l=g[f];Z.isFunction(l)||(l=this[g[f]]);if(!l){throw Error('Method "'+g[f]+'" does not exist')}var k=f.match(q),i=k[1],k=k[2],l=Z.bind(l,this),i=i+(".delegateEvents"+this.cid);""===k?this.$el.bind(i,l):this.$el.delegate(k,i,l)}}},undelegateEvents:function(){this.$el.unbind(".delegateEvents"+this.cid)},_configure:function(g){this.options&&(g=Z.extend({},this.options,g));for(var f=0,k=e.length;f<k;f++){var i=e[f];g[i]&&(this[i]=g[i])}this.options=g},_ensureElement:function(){if(this.el){this.setElement(this.el,!1)}else{var f=T(this,"attributes")||{};this.id&&(f.id=this.id);this.className&&(f["class"]=this.className);this.setElement(this.make(this.tagName,f),!1)}}});S.extend=O.extend=I.extend=j.extend=function(g,f){var i=h(this,g,f);i.extend=this.extend;return i};var d={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};Y.sync=function(g,f,l){var k=d[g];l||(l={});var i={type:k,dataType:"json"};l.url||(i.url=T(f,"url")||J());if(!l.data&&f&&("create"==g||"update"==g)){i.contentType="application/json",i.data=JSON.stringify(f.toJSON())}Y.emulateJSON&&(i.contentType="application/x-www-form-urlencoded",i.data=i.data?{model:i.data}:{});if(Y.emulateHTTP&&("PUT"===k||"DELETE"===k)){Y.emulateJSON&&(i.data._method=k),i.type="POST",i.beforeSend=function(m){m.setRequestHeader("X-HTTP-Method-Override",k)}}"GET"!==i.type&&!Y.emulateJSON&&(i.processData=!1);return X.ajax(Z.extend(i,l))};Y.wrapError=function(g,f,i){return function(l,k){k=l===f?k:l;g?g(f,k,i):f.trigger("error",f,k,i)}};var c=function(){},h=function(g,f,k){var i;i=f&&f.hasOwnProperty("constructor")?f.constructor:function(){g.apply(this,arguments)};Z.extend(i,g);c.prototype=g.prototype;i.prototype=new c;f&&Z.extend(i.prototype,f);k&&Z.extend(i,k);i.prototype.constructor=i;i.__super__=g.prototype;return i},T=function(g,f){return !g||!g[f]?null:Z.isFunction(g[f])?g[f]():g[f]},J=function(){throw Error('A "url" property or function must be specified')}}).call(this);(function(b){var h,g,c;if(typeof window==="undefined"){h=require("underscore");g=require("backbone");c=module.exports=g}else{var h=window._;g=window.Backbone;c=window}g.Relational={showWarnings:true};g.Semaphore={_permitsAvailable:null,_permitsUsed:0,acquire:function(){if(this._permitsAvailable&&this._permitsUsed>=this._permitsAvailable){throw new Error("Max permits acquired")}else{this._permitsUsed++}},release:function(){if(this._permitsUsed===0){throw new Error("All permits released")}else{this._permitsUsed--}},isLocked:function(){return this._permitsUsed>0},setAvailablePermits:function(j){if(this._permitsUsed>j){throw new Error("Available permits cannot be less than used permits")}this._permitsAvailable=j}};g.BlockingQueue=function(){this._queue=[]};h.extend(g.BlockingQueue.prototype,g.Semaphore,{_queue:null,add:function(j){if(this.isBlocked()){this._queue.push(j)}else{j()}},process:function(){while(this._queue&&this._queue.length){this._queue.shift()()}},block:function(){this.acquire()},unblock:function(){this.release();if(!this.isBlocked()){this.process()}},isBlocked:function(){return this.isLocked()}});g.Relational.eventQueue=new g.BlockingQueue();g.Store=function(){this._collections=[];this._reverseRelations=[];this._subModels=[]};h.extend(g.Store.prototype,g.Events,{addSubModels:function(j,k){this._subModels.push({superModelType:k,subModels:j})},setupSuperModel:function(j){h.find(this._subModels,function(k){return h.find(k.subModels,function(m,n){var l=this.getObjectByName(m);if(j===l){k.superModelType._subModels[n]=j;j._superModel=k.superModelType;j._subModelTypeValue=n;j._subModelTypeAttribute=k.superModelType.prototype.subModelTypeAttribute;return true}},this)},this)},addReverseRelation:function(l){var k=h.any(this._reverseRelations,function(m){return h.all(l,function(o,n){return o===m[n]})});if(!k&&l.model&&l.type){this._reverseRelations.push(l);var j=function(m,n){if(!m.prototype.relations){m.prototype.relations=[]}m.prototype.relations.push(n);h.each(m._subModels,function(o){j(o,n)},this)};j(l.model,l);this.retroFitRelation(l)}},retroFitRelation:function(k){var j=this.getCollection(k.model);j.each(function(l){if(!(l instanceof k.model)){return}new k.type(l,k)},this)},getCollection:function(k){if(k instanceof g.RelationalModel){k=k.constructor}var j=k;while(j._superModel){j=j._superModel}var l=h.detect(this._collections,function(m){return m.model===j});if(!l){l=this._createCollection(k)}return l},getObjectByName:function(j){var k=h.reduce(j.split("."),function(l,m){return l[m]},c);return k!==c?k:null},_createCollection:function(k){var j;if(k instanceof g.RelationalModel){k=k.constructor}if(k.prototype instanceof g.RelationalModel){j=new g.Collection();j.model=k;this._collections.push(j)}return j},resolveIdForItem:function(j,k){var l=h.isString(k)||h.isNumber(k)?k:null;if(l==null){if(k instanceof g.RelationalModel){l=k.id}else{if(h.isObject(k)){l=k[j.prototype.idAttribute]}}}return l},find:function(k,l){var n=this.resolveIdForItem(k,l);var j=this.getCollection(k);if(j){var m=j.get(n);if(m instanceof k){return m}}return null},register:function(k){var j=k.collection;var l=this.getCollection(k);l&&l.add(k);k.bind("destroy",this.unregister,this);k.collection=j},update:function(j){var k=this.getCollection(j);k._onModelEvent("change:"+j.idAttribute,j,k)},unregister:function(j){j.unbind("destroy",this.unregister);var k=this.getCollection(j);k&&k.remove(j)}});g.Relational.store=new g.Store();g.Relation=function(j,k){this.instance=j;k=h.isObject(k)?k:{};this.reverseRelation=h.defaults(k.reverseRelation||{},this.options.reverseRelation);this.reverseRelation.type=!h.isString(this.reverseRelation.type)?this.reverseRelation.type:g[this.reverseRelation.type]||g.Relational.store.getObjectByName(this.reverseRelation.type);this.model=k.model||this.instance.constructor;this.options=h.defaults(k,this.options,g.Relation.prototype.options);this.key=this.options.key;this.keySource=this.options.keySource||this.key;this.keyDestination=this.options.keyDestination||this.options.keySource||this.key;this.relatedModel=this.options.relatedModel;if(h.isString(this.relatedModel)){this.relatedModel=g.Relational.store.getObjectByName(this.relatedModel)}if(!this.checkPreconditions()){return false}if(j){this.keyContents=this.instance.get(this.keySource);if(this.key!==this.keySource){this.instance.unset(this.keySource,{silent:true})}this.instance._relations.push(this)}if(!this.options.isAutoRelation&&this.reverseRelation.type&&this.reverseRelation.key){g.Relational.store.addReverseRelation(h.defaults({isAutoRelation:true,model:this.relatedModel,relatedModel:this.model,reverseRelation:this.options},this.reverseRelation))}h.bindAll(this,"_modelRemovedFromCollection","_relatedModelAdded","_relatedModelRemoved");if(j){this.initialize();g.Relational.store.getCollection(this.instance).bind("relational:remove",this._modelRemovedFromCollection);g.Relational.store.getCollection(this.relatedModel).bind("relational:add",this._relatedModelAdded).bind("relational:remove",this._relatedModelRemoved)}};g.Relation.extend=g.Model.extend;h.extend(g.Relation.prototype,g.Events,g.Semaphore,{options:{createModels:true,includeInJSON:true,isAutoRelation:false},instance:null,key:null,keyContents:null,relatedModel:null,reverseRelation:null,related:null,_relatedModelAdded:function(l,m,k){var j=this;l.queue(function(){j.tryAddRelated(l,k)})},_relatedModelRemoved:function(k,l,j){this.removeRelated(k,j)},_modelRemovedFromCollection:function(j){if(j===this.instance){this.destroy()}},checkPreconditions:function(){var n=this.instance,l=this.key,j=this.model,p=this.relatedModel,q=g.Relational.showWarnings&&typeof console!=="undefined";if(!j||!l||!p){q&&console.warn("Relation=%o; no model, key or relatedModel (%o, %o, %o)",this,j,l,p);return false}if(!(j.prototype instanceof g.RelationalModel)){q&&console.warn("Relation=%o; model does not inherit from Backbone.RelationalModel (%o)",this,n);return false}if(!(p.prototype instanceof g.RelationalModel)){q&&console.warn("Relation=%o; relatedModel does not inherit from Backbone.RelationalModel (%o)",this,p);return false}if(this instanceof g.HasMany&&this.reverseRelation.type===g.HasMany){q&&console.warn("Relation=%o; relation is a HasMany, and the reverseRelation is HasMany as well.",this);return false}if(n&&n._relations.length){var o=h.any(n._relations,function(k){var m=this.reverseRelation.key&&k.reverseRelation.key;return k.relatedModel===p&&k.key===l&&(!m||this.reverseRelation.key===k.reverseRelation.key)},this);if(o){q&&console.warn("Relation=%o between instance=%o.%s and relatedModel=%o.%s already exists",this,n,l,p,this.reverseRelation.key);return false}}return true},setRelated:function(k,j){this.related=k;this.instance.acquire();this.instance.set(this.key,k,h.defaults(j||{},{silent:true}));this.instance.release()},_isReverseRelation:function(j){if(j.instance instanceof this.relatedModel&&this.reverseRelation.key===j.key&&this.key===j.reverseRelation.key){return true}return false},getReverseRelations:function(j){var k=[];var l=!h.isUndefined(j)?[j]:this.related&&(this.related.models||[this.related]);h.each(l,function(m){h.each(m.getRelations(),function(n){if(this._isReverseRelation(n)){k.push(n)}},this)},this);return k},sanitizeOptions:function(j){j=j?h.clone(j):{};if(j.silent){j=h.extend({},j,{silentChange:true});delete j.silent}return j},unsanitizeOptions:function(j){j=j?h.clone(j):{};if(j.silentChange){j=h.extend({},j,{silent:true});delete j.silentChange}return j},destroy:function(){g.Relational.store.getCollection(this.instance).unbind("relational:remove",this._modelRemovedFromCollection);g.Relational.store.getCollection(this.relatedModel).unbind("relational:add",this._relatedModelAdded).unbind("relational:remove",this._relatedModelRemoved);h.each(this.getReverseRelations(),function(j){j.removeRelated(this.instance)},this)}});g.HasOne=g.Relation.extend({options:{reverseRelation:{type:"HasMany"}},initialize:function(){h.bindAll(this,"onChange");this.instance.bind("relational:change:"+this.key,this.onChange);var j=this.findRelated({silent:true});this.setRelated(j);h.each(this.getReverseRelations(),function(k){k.addRelated(this.instance)},this)},findRelated:function(k){var l=this.keyContents;var j=null;if(l instanceof this.relatedModel){j=l}else{if(l){j=this.relatedModel.findOrCreate(l,{create:this.options.createModels})}}return j},onChange:function(m,j,l){if(this.isLocked()){return}this.acquire();l=this.sanitizeOptions(l);var p=h.isUndefined(l._related);var n=p?this.related:l._related;if(p){this.keyContents=j;if(j instanceof this.relatedModel){this.related=j}else{if(j){var o=this.findRelated(l);this.setRelated(o)}else{this.setRelated(null)}}}if(n&&this.related!==n){h.each(this.getReverseRelations(n),function(q){q.removeRelated(this.instance,l)},this)}h.each(this.getReverseRelations(),function(q){q.addRelated(this.instance,l)},this);if(!l.silentChange&&this.related!==n){var k=this;g.Relational.eventQueue.add(function(){k.instance.trigger("update:"+k.key,k.instance,k.related,l)})}this.release()},tryAddRelated:function(k,j){if(this.related){return}j=this.sanitizeOptions(j);var l=this.keyContents;if(l){var m=g.Relational.store.resolveIdForItem(this.relatedModel,l);if(k.id===m){this.addRelated(k,j)}}},addRelated:function(k,j){if(k!==this.related){var l=this.related||null;this.setRelated(k);this.onChange(this.instance,k,{_related:l})}},removeRelated:function(k,j){if(!this.related){return}if(k===this.related){var l=this.related||null;this.setRelated(null);this.onChange(this.instance,k,{_related:l})}}});g.HasMany=g.Relation.extend({collectionType:null,options:{reverseRelation:{type:"HasOne"},collectionType:g.Collection,collectionKey:true,collectionOptions:{}},initialize:function(){h.bindAll(this,"onChange","handleAddition","handleRemoval","handleReset");this.instance.bind("relational:change:"+this.key,this.onChange);this.collectionType=this.options.collectionType;if(h.isString(this.collectionType)){this.collectionType=g.Relational.store.getObjectByName(this.collectionType)}if(!this.collectionType.prototype instanceof g.Collection){throw new Error("collectionType must inherit from Backbone.Collection")}if(this.keyContents instanceof g.Collection){this.setRelated(this._prepareCollection(this.keyContents))}else{this.setRelated(this._prepareCollection())}this.findRelated({silent:true})},_getCollectionOptions:function(){return h.isFunction(this.options.collectionOptions)?this.options.collectionOptions(this.instance):this.options.collectionOptions},_prepareCollection:function(k){if(this.related){this.related.unbind("relational:add",this.handleAddition).unbind("relational:remove",this.handleRemoval).unbind("relational:reset",this.handleReset)}if(!k||!(k instanceof g.Collection)){k=new this.collectionType([],this._getCollectionOptions())}k.model=this.relatedModel;if(this.options.collectionKey){var j=this.options.collectionKey===true?this.options.reverseRelation.key:this.options.collectionKey;if(k[j]&&k[j]!==this.instance){if(g.Relational.showWarnings&&typeof console!=="undefined"){console.warn("Relation=%o; collectionKey=%s already exists on collection=%o",this,j,this.options.collectionKey)}}else{if(j){k[j]=this.instance}}}k.bind("relational:add",this.handleAddition).bind("relational:remove",this.handleRemoval).bind("relational:reset",this.handleReset);return k},findRelated:function(j){if(this.keyContents){var k=[];if(this.keyContents instanceof g.Collection){k=this.keyContents.models}else{this.keyContents=h.isArray(this.keyContents)?this.keyContents:[this.keyContents];h.each(this.keyContents,function(m){var l=null;if(m instanceof this.relatedModel){l=m}else{l=this.relatedModel.findOrCreate(m,{create:this.options.createModels})}if(l&&!this.related.getByCid(l)&&!this.related.get(l)){k.push(l)}},this)}if(k.length){j=this.unsanitizeOptions(j);this.related.add(k,j)}}},onChange:function(m,j,l){l=this.sanitizeOptions(l);this.keyContents=j;h.each(this.getReverseRelations(),function(o){o.removeRelated(this.instance,l)},this);if(j instanceof g.Collection){this._prepareCollection(j);this.related=j}else{var n;if(this.related instanceof g.Collection){n=this.related;n.remove(n.models)}else{n=this._prepareCollection()}this.setRelated(n);this.findRelated(l)}h.each(this.getReverseRelations(),function(o){o.addRelated(this.instance,l)},this);var k=this;g.Relational.eventQueue.add(function(){!l.silentChange&&k.instance.trigger("update:"+k.key,k.instance,k.related,l)})},tryAddRelated:function(k,j){j=this.sanitizeOptions(j);if(!this.related.getByCid(k)&&!this.related.get(k)){var l=h.any(this.keyContents,function(m){var n=g.Relational.store.resolveIdForItem(this.relatedModel,m);return n&&n===k.id},this);if(l){this.related.add(k,j)}}},handleAddition:function(l,m,k){if(!(l instanceof g.Model)){return}k=this.sanitizeOptions(k);h.each(this.getReverseRelations(l),function(n){n.addRelated(this.instance,k)},this);var j=this;g.Relational.eventQueue.add(function(){!k.silentChange&&j.instance.trigger("add:"+j.key,l,j.related,k)})},handleRemoval:function(l,m,k){if(!(l instanceof g.Model)){return}k=this.sanitizeOptions(k);h.each(this.getReverseRelations(l),function(n){n.removeRelated(this.instance,k)},this);var j=this;g.Relational.eventQueue.add(function(){!k.silentChange&&j.instance.trigger("remove:"+j.key,l,j.related,k)})},handleReset:function(l,k){k=this.sanitizeOptions(k);var j=this;g.Relational.eventQueue.add(function(){!k.silentChange&&j.instance.trigger("reset:"+j.key,j.related,k)})},addRelated:function(l,k){var j=this;k=this.unsanitizeOptions(k);l.queue(function(){if(j.related&&!j.related.getByCid(l)&&!j.related.get(l)){j.related.add(l,k)}})},removeRelated:function(k,j){j=this.unsanitizeOptions(j);if(this.related.getByCid(k)||this.related.get(k)){this.related.remove(k,j)}}});g.RelationalModel=g.Model.extend({relations:null,_relations:null,_isInitialized:false,_deferProcessing:false,_queue:null,subModelTypeAttribute:"type",subModelTypes:null,constructor:function(k,l){var j=this;if(l&&l.collection){this._deferProcessing=true;var m=function(n){if(n===j){j._deferProcessing=false;j.processQueue();l.collection.unbind("relational:add",m)}};l.collection.bind("relational:add",m);h.defer(function(){m(j)})}this._queue=new g.BlockingQueue();this._queue.block();g.Relational.eventQueue.block();g.Model.apply(this,arguments);g.Relational.eventQueue.unblock()},trigger:function(k){if(k.length>5&&"change"===k.substr(0,6)){var j=this,l=arguments;g.Relational.eventQueue.add(function(){g.Model.prototype.trigger.apply(j,l)})}else{g.Model.prototype.trigger.apply(this,arguments)}return this},initializeRelations:function(){this.acquire();this._relations=[];h.each(this.relations,function(j){var k=!h.isString(j.type)?j.type:g[j.type]||g.Relational.store.getObjectByName(j.type);if(k&&k.prototype instanceof g.Relation){new k(this,j)}else{g.Relational.showWarnings&&typeof console!=="undefined"&&console.warn("Relation=%o; missing or invalid type!",j)}},this);this._isInitialized=true;this.release();this.processQueue()},updateRelations:function(j){if(this._isInitialized&&!this.isLocked()){h.each(this._relations,function(k){var l=this.attributes[k.key];if(k.related!==l){this.trigger("relational:change:"+k.key,this,l,j||{})}},this)}},queue:function(j){this._queue.add(j)},processQueue:function(){if(this._isInitialized&&!this._deferProcessing&&this._queue.isBlocked()){this._queue.unblock()}},getRelation:function(j){return h.detect(this._relations,function(k){if(k.key===j){return true}},this)},getRelations:function(){return this._relations},fetchRelated:function(o,q){q||(q={});var m,k=[],p=this.getRelation(o),r=p&&p.keyContents,n=r&&h.select(h.isArray(r)?r:[r],function(s){var t=g.Relational.store.resolveIdForItem(p.relatedModel,s);return t&&!g.Relational.store.find(p.relatedModel,t)},this);if(n&&n.length){var l=h.map(n,function(u){var t;if(h.isObject(u)){t=p.relatedModel.build(u)}else{var s={};s[p.relatedModel.prototype.idAttribute]=u;t=p.relatedModel.build(s)}return t},this);if(p.related instanceof g.Collection&&h.isFunction(p.related.url)){m=p.related.url(l)}if(m&&m!==p.related.url()){var j=h.defaults({error:function(){var s=arguments;h.each(l,function(t){t.trigger("destroy",t,t.collection,q);q.error&&q.error.apply(t,s)})},url:m},q,{add:true});k=[p.related.fetch(j)]}else{k=h.map(l,function(s){var t=h.defaults({error:function(){s.trigger("destroy",s,s.collection,q);q.error&&q.error.apply(s,arguments)}},q);return s.fetch(t)},this)}}return k},set:function(m,n,l){g.Relational.eventQueue.block();var k;if(h.isObject(m)||m==null){k=m;l=n}else{k={};k[m]=n}var j=g.Model.prototype.set.apply(this,arguments);if(!this._isInitialized&&!this.isLocked()){this.constructor.initializeModelHierarchy();g.Relational.store.register(this);this.initializeRelations()}else{if(k&&this.idAttribute in k){g.Relational.store.update(this)}}if(k){this.updateRelations(l)}g.Relational.eventQueue.unblock();return j},unset:function(l,k){g.Relational.eventQueue.block();var j=g.Model.prototype.unset.apply(this,arguments);this.updateRelations(k);g.Relational.eventQueue.unblock();return j},clear:function(k){g.Relational.eventQueue.block();var j=g.Model.prototype.clear.apply(this,arguments);this.updateRelations(k);g.Relational.eventQueue.unblock();return j},change:function(l){var j=this,k=arguments;g.Relational.eventQueue.add(function(){g.Model.prototype.change.apply(j,k)})},clone:function(){var j=h.clone(this.attributes);if(!h.isUndefined(j[this.idAttribute])){j[this.idAttribute]=null}h.each(this.getRelations(),function(k){delete j[k.key]});return new this.constructor(j)},toJSON:function(){if(this.isLocked()){return this.id}this.acquire();var j=g.Model.prototype.toJSON.call(this);if(this.constructor._superModel&&!(this.constructor._subModelTypeAttribute in j)){j[this.constructor._subModelTypeAttribute]=this.constructor._subModelTypeValue}h.each(this._relations,function(k){var l=j[k.key];if(k.options.includeInJSON===true){if(l&&h.isFunction(l.toJSON)){j[k.keyDestination]=l.toJSON()}else{j[k.keyDestination]=null}}else{if(h.isString(k.options.includeInJSON)){if(l instanceof g.Collection){j[k.keyDestination]=l.pluck(k.options.includeInJSON)}else{if(l instanceof g.Model){j[k.keyDestination]=l.get(k.options.includeInJSON)}else{j[k.keyDestination]=null}}}else{delete j[k.key]}}if(k.keyDestination!==k.key){delete j[k.key]}});this.release();return j}},{setup:function(j){this.prototype.relations=(this.prototype.relations||[]).slice(0);this._subModels={};this._superModel=null;if(this.prototype.hasOwnProperty("subModelTypes")){g.Relational.store.addSubModels(this.prototype.subModelTypes,this)}else{this.prototype.subModelTypes=null}h.each(this.prototype.relations,function(k){if(!k.model){k.model=this}if(k.reverseRelation&&k.model===this){var m=true;if(h.isString(k.relatedModel)){var l=g.Relational.store.getObjectByName(k.relatedModel);m=l&&(l.prototype instanceof g.RelationalModel)}var n=!h.isString(k.type)?k.type:g[k.type]||g.Relational.store.getObjectByName(k.type);if(m&&n&&n.prototype instanceof g.Relation){new n(null,k)}}},this)},build:function(l,n){var m=this;this.initializeModelHierarchy();if(this._subModels&&this.prototype.subModelTypeAttribute in l){var k=l[this.prototype.subModelTypeAttribute];var j=this._subModels[k];if(j){m=j}}return new m(l,n)},initializeModelHierarchy:function(){if(h.isUndefined(this._superModel)||h.isNull(this._superModel)){g.Relational.store.setupSuperModel(this);if(this._superModel){if(this._superModel.prototype.relations){var j=h.any(this.prototype.relations,function(k){return k.model&&k.model!==this},this);if(!j){this.prototype.relations=this._superModel.prototype.relations.concat(this.prototype.relations)}}}else{this._superModel=false}}if(this.prototype.subModelTypes&&h.keys(this.prototype.subModelTypes).length!==h.keys(this._subModels).length){h.each(this.prototype.subModelTypes,function(l){var k=g.Relational.store.getObjectByName(l);k&&k.initializeModelHierarchy()})}},findOrCreate:function(j,l){var k=g.Relational.store.find(this,j);if(h.isObject(j)){if(k){k.set(j,l)}else{if(!l||(l&&l.create!==false)){k=this.build(j,l)}}}return k}});h.extend(g.RelationalModel.prototype,g.Semaphore);g.Collection.prototype.__prepareModel=g.Collection.prototype._prepareModel;g.Collection.prototype._prepareModel=function(l,k){k||(k={});if(!(l instanceof g.Model)){var j=l;k.collection=this;if(typeof this.model.build!=="undefined"){l=this.model.build(j,k)}else{l=new this.model(j,k)}if(!l._validate(l.attributes,k)){l=false}}else{if(!l.collection){l.collection=this}}return l};var i=g.Collection.prototype.__add=g.Collection.prototype.add;g.Collection.prototype.add=function(l,j){j||(j={});if(!h.isArray(l)){l=[l]}var k=[];h.each(l,function(n){if(!(n instanceof g.Model)){var m=g.Relational.store.find(this.model,n[this.model.prototype.idAttribute]);if(m){m.set(m.parse?m.parse(n):n,j);n=m}else{n=g.Collection.prototype._prepareModel.call(this,n,j)}}if(n instanceof g.Model&&!this.get(n)&&!this.getByCid(n)){k.push(n)}},this);if(k.length){i.call(this,k,j);h.each(k,function(m){this.trigger("relational:add",m,this,j)},this)}return this};var e=g.Collection.prototype.__remove=g.Collection.prototype.remove;g.Collection.prototype.remove=function(k,j){j||(j={});if(!h.isArray(k)){k=[k]}else{k=k.slice(0)}h.each(k,function(l){l=this.getByCid(l)||this.get(l);if(l instanceof g.Model){e.call(this,l,j);this.trigger("relational:remove",l,this,j)}},this);return this};var f=g.Collection.prototype.__reset=g.Collection.prototype.reset;g.Collection.prototype.reset=function(k,j){f.call(this,k,j);this.trigger("relational:reset",this,j);return this};var d=g.Collection.prototype.__sort=g.Collection.prototype.sort;g.Collection.prototype.sort=function(j){d.call(this,j);this.trigger("relational:reset",this,j);return this};var a=g.Collection.prototype.__trigger=g.Collection.prototype.trigger;g.Collection.prototype.trigger=function(k){if(k==="add"||k==="remove"||k==="reset"){var j=this,l=arguments;g.Relational.eventQueue.add(function(){a.apply(j,l)})}else{a.apply(this,arguments)}return this};g.RelationalModel.extend=function(j,k){var l=g.Model.extend.apply(this,arguments);l.setup(this);return l}})();(function(h,g,l){var k=function(){return l.View.extend({fields:null,initialize:function(b){this.schema=function(){if(b.schema){return b.schema}var a=b.model;if(!a){throw new Error("Could not find schema")}return g.isFunction(a.schema)?a.schema():a.schema}(),this.model=b.model,this.data=b.data,this.fieldsToRender=b.fields||g.keys(this.schema),this.fieldsets=b.fieldsets,this.templateName=b.template||"form",this.fields={}},render:function(){var n=this,m=this.fieldsets,d=k.templates,b=h(d[this.templateName]({fieldsets:'<div class="bbf-placeholder"></div>'})),a=h(".bbf-placeholder",b);return m||(m=[{fields:this.fieldsToRender}]),g.each(m,function(o){g(o).isArray()&&(o={fields:o});var f=h(d.fieldset(g.extend({},o,{legend:o.legend?"<legend>"+o.legend+"</legend>":"",fields:'<div class="bbf-placeholder"></div>'}))),c=h(".bbf-placeholder",f);n.renderFields(o.fields,c),c=c.children().unwrap(),a.append(f)}),a.children().unwrap(),this.setElement(b),this},renderFields:function(b,r){var q=this,p=this.schema,o=this.model,n=this.data,m=this.fields,d=k.helpers.getNested;g.each(b,function(f){var c=function(){if(p[f]){return p[f]}var a=f.replace(/\./g,".subSchema.");return d(p,a)}();if(!c){throw"Field '"+f+"' not found in schema"}var s={form:q,key:f,schema:c,idPrefix:q.options.idPrefix};o?s.model=o:n?s.value=n[f]:s.value=null;var e=new k.Field(s);c.type=="Hidden"?e.editor=k.helpers.createEditor("Hidden",s):r.append(e.render().el),m[f]=e})},validate:function(){var b=this,q=this.fields,p=this.model,o={};g.each(q,function(d){var c=d.validate();c&&(o[d.key]=c)});if(p&&p.validate){var n=p.validate(this.getValue());if(n){var m=g.isObject(n)&&!g.isArray(n);m||(o._others=o._others||[],o._others.push(n)),m&&g.each(n,function(a,f){if(b.fields[f]&&!o[f]){b.fields[f].setError(a)}else{o._others=o._others||[];var e={};e[f]=a,o._others.push(e)}})}}return g.isEmpty(o)?null:o},commit:function(){var d=this.validate();if(d){return d}var c;this.model.set(this.getValue(),{error:function(b,e){c=e}});if(c){return c}},getValue:function(b){if(b){return this.fields[b].getValue()}var d={};return g.each(this.fields,function(c){d[c.key]=c.getValue()}),d},setValue:function(d){for(var c in d){this.fields[c].setValue(d[c])}},remove:function(){var d=this.fields;for(var c in d){d[c].remove()}l.View.prototype.remove.call(this)}})}(),j={form:'      <form class="bbf-form">{{fieldsets}}</form>    ',fieldset:"      <fieldset>        {{legend}}        <ul>{{fields}}</ul>      </fieldset>    ",field:'    <li class="bbf-field bbf-field{{type}}">      <label for="{{id}}">{{title}}</label>      <div class="bbf-editor bbf-editor{{type}}">{{editor}}</div>      <div class="bbf-help">{{help}}</div>    </li>    '},i={error:"bbf-error"};k.helpers=function(){var b={};return b.getNested=function(n,m){var r=m.split("."),q=n;for(var p=0,o=r.length;p<o;p++){q=q[r[p]]}return q},b.keyToTitle=function(c){return c=c.replace(/([A-Z])/g," $1"),c=c.replace(/^./,function(d){return d.toUpperCase()}),c},b.compileTemplate=function(e){var m=g.templateSettings.interpolate;g.templateSettings.interpolate=/\{\{(.+?)\}\}/g;var f=g.template(e);return g.templateSettings.interpolate=m,f},b.createTemplate=function(a,f){var e=b.compileTemplate(a);return f?e(f):e},b.setTemplateCompiler=function(a){b.compileTemplate=a},b.setTemplates=function(m,d){var a=b.createTemplate;k.templates=k.templates||{},k.classNames=k.classNames||{},g.each(m,function(f,o,n){g.isString(f)&&(f=a(f)),k.templates[o]=f}),g.extend(k.classNames,d)},b.createEditor=function(d,m){var f;return g.isString(d)?f=k.editors[d]:f=d,new f(m)},b.triggerCancellableEvent=function(n,m,s,r){if(!n._callbacks||!n._callbacks[m]){return r()}var q=n._callbacks[m].next;if(!q){return r()}var p=q.callback,o=q.context||this;s.push(r),p.apply(o,s)},b.getValidator=function(d){var m=k.validators;if(g.isRegExp(d)){return m.regexp({regexp:d})}if(g.isString(d)){if(!m[d]){throw new Error('Validator "'+d+'" not found')}return m[d]()}if(g.isFunction(d)){return d}if(g.isObject(d)&&d.type){var f=d;return m[f.type](f)}throw new Error("Invalid validator: "+d)},b}(),k.validators=function(){var b={};return b.errMessages={required:"Required",regexp:"Invalid",email:"Invalid email address",url:"Invalid URL",match:'Must match field "{{field}}"'},b.required=function(c){return c=g.extend({type:"required",message:this.errMessages.required},c),function(d){c.value=d;var a={type:c.type,message:k.helpers.createTemplate(c.message,c)};if(d===null||d===undefined||d===""){return a}}},b.regexp=function(c){if(!c.regexp){throw new Error('Missing required "regexp" option for "regexp" validator')}return c=g.extend({type:"regexp",message:this.errMessages.regexp},c),function(d){c.value=d;var a={type:c.type,message:k.helpers.createTemplate(c.message,c)};if(d===null||d===undefined||d===""){return}if(!c.regexp.test(d)){return a}}},b.email=function(a){return a=g.extend({type:"email",message:this.errMessages.email,regexp:/^[\w\-]{1,}([\w\-.]{1,1}[\w\-]{1,}){0,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/},a),b.regexp(a)},b.url=function(a){return a=g.extend({type:"url",message:this.errMessages.url,regexp:/^(http|https):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i},a),b.regexp(a)},b.match=function(c){if(!c.field){throw new Error('Missing required "field" options for "match" validator')}return c=g.extend({type:"match",message:this.errMessages.match},c),function(m,d){c.value=m;var a={type:c.type,message:k.helpers.createTemplate(c.message,c)};if(m===null||m===undefined||m===""){return}if(m!=d[c.field]){return a}}},b}(),k.Field=function(){var b=k.helpers,a=k.templates;return l.View.extend({initialize:function(d){this.form=d.form,this.key=d.key,this.value=d.value,this.model=d.model;var e=this.schema=function(){return g.isString(d.schema)?{type:d.schema}:d.schema||{}}();e.type||(e.type="Text"),e.title||(e.title=b.keyToTitle(this.key)),e.template||(e.template="field")},render:function(){var d=this.schema,p=k.templates,o={form:this.form,key:this.key,schema:d,idPrefix:this.options.idPrefix,id:this.getId()};this.model?o.model=this.model:o.value=this.value;var n=this.editor=b.createEditor(d.type,o),m=h(p[d.template]({key:this.key,title:d.title,id:n.id,type:d.type,editor:'<span class="bbf-placeholder-editor"></span>',help:'<span class="bbf-placeholder-help"></span>'})),e=h(".bbf-placeholder-editor",m);return e.append(n.render().el),e.children().unwrap(),this.$help=h(".bbf-placeholder-help",m).parent(),this.$help.empty(),this.schema.help&&this.$help.html(this.schema.help),this.schema.fieldClass&&m.addClass(this.schema.fieldClass),this.schema.fieldAttrs&&m.attr(this.schema.fieldAttrs),this.setElement(m),this},getId:function(){var d=this.options.idPrefix,e=this.key;return e=e.replace(/\./g,"_"),g.isString(d)||g.isNumber(d)?d+e:g.isNull(d)?e:this.model?this.model.cid+"_"+e:e},validate:function(){var c=this.editor.validate();return c?this.setError(c.message):this.clearError(),c},setError:function(d){if(this.editor.hasNestedForm){return}var c=k.classNames.error;this.$el.addClass(c),this.$help&&this.$help.html(d)},clearError:function(){var d=k.classNames.error;this.$el.removeClass(d);if(this.$help){this.$help.empty();var c=this.schema.help;c&&this.$help.html(c)}},commit:function(){return this.editor.commit()},getValue:function(){return this.editor.getValue()},setValue:function(c){this.editor.setValue(c)},logValue:function(){if(!console||!console.log){return}console.log(this.getValue())},remove:function(){this.editor.remove(),l.View.prototype.remove.call(this)}})}(),k.editors=function(){var a={};return a.Base=l.View.extend({defaultValue:null,initialize:function(b){var b=b||{};if(b.model){if(!b.key){throw"Missing option: 'key'"}this.model=b.model,this.key=b.key,this.value=this.model.get(this.key)}else{b.value&&(this.value=b.value)}this.value===undefined&&(this.value=this.defaultValue),this.form=b.form,this.schema=b.schema||{},this.validators=b.validators||this.schema.validators,this.$el.attr("name",this.getName()),this.schema.editorClass&&this.$el.addClass(this.schema.editorClass),this.schema.editorAttrs&&this.$el.attr(this.schema.editorAttrs)},getValue:function(){throw"Not implemented. Extend and override this method."},setValue:function(){throw"Not implemented. Extend and override this method."},getName:function(){var b=this.key||"";return b.replace(/\./g,"_")},commit:function(){var b=this.validate();if(b){return b}this.model.set(this.key,this.getValue(),{error:function(d,e){b=e}});if(b){return b}},validate:function(){var b=this.$el,p=null,o=this.getValue(),n=this.form?this.form.getValue():{},m=this.validators,d=k.helpers.getValidator;return m&&g.each(m,function(c){p||(p=d(c)(o,n))}),p}}),a.Text=a.Base.extend({tagName:"input",defaultValue:"",initialize:function(e){a.Base.prototype.initialize.call(this,e);var d=this.schema,f="text";d&&d.editorAttrs&&d.editorAttrs.type&&(f=d.editorAttrs.type),d&&d.dataType&&(f=d.dataType),this.$el.attr("type",f)},render:function(){return this.setValue(this.value),this},getValue:function(){return this.$el.val()},setValue:function(b){this.$el.val(b)}}),a.Number=a.Text.extend({defaultValue:0,events:{keypress:"onKeyPress"},initialize:function(b){a.Text.prototype.initialize.call(this,b),this.$el.attr("type","number")},onKeyPress:function(e){if(e.charCode==0){return}var d=this.$el.val()+String.fromCharCode(e.charCode),f=/^[0-9]*\.?[0-9]*?$/.test(d);f||e.preventDefault()},getValue:function(){var b=this.$el.val();return b===""?null:parseFloat(b,10)},setValue:function(b){b=b===null?null:parseFloat(b,10),a.Text.prototype.setValue.call(this,b)}}),a.Password=a.Text.extend({initialize:function(b){a.Text.prototype.initialize.call(this,b),this.$el.attr("type","password")}}),a.TextArea=a.Text.extend({tagName:"textarea"}),a.Checkbox=a.Base.extend({defaultValue:!1,tagName:"input",initialize:function(b){a.Base.prototype.initialize.call(this,b),this.$el.attr("type","checkbox")},render:function(){return this.setValue(this.value),this},getValue:function(){return this.$el.attr("checked")?!0:!1},setValue:function(b){b&&this.$el.attr("checked",!0)}}),a.Hidden=a.Base.extend({defaultValue:"",initialize:function(b){a.Text.prototype.initialize.call(this,b),this.$el.attr("type","hidden")},getValue:function(){return this.value},setValue:function(b){this.value=b}}),a.Select=a.Base.extend({tagName:"select",initialize:function(b){a.Base.prototype.initialize.call(this,b);if(!this.schema||!this.schema.options){throw"Missing required 'schema.options'"}},render:function(){var b=this.schema.options,f=this;if(b instanceof l.Collection){var c=b;c.length>0?f.renderOptions(b):c.fetch({success:function(d){f.renderOptions(b)}})}else{g.isFunction(b)?b(function(d){f.renderOptions(d)}):f.renderOptions(b)}return this},renderOptions:function(b){var f=this.$el,c;g.isString(b)?c=b:g.isArray(b)?c=this._arrayToHtml(b):b instanceof l.Collection&&(c=this._collectionToHtml(b)),f.html(c),this.setValue(this.value)},getValue:function(){return this.$el.val()},setValue:function(b){this.$el.val(b)},_collectionToHtml:function(e){var d=[];e.each(function(b){d.push({val:b.id,label:b.toString()})});var f=this._arrayToHtml(d);return f},_arrayToHtml:function(b){var d=[];return g.each(b,function(c){if(g.isObject(c)){var e=c.val?c.val:"";d.push('<option value="'+e+'">'+c.label+"</option>")}else{d.push("<option>"+c+"</option>")}}),d.join("")}}),a.Radio=a.Select.extend({tagName:"ul",className:"bbf-radio",getValue:function(){return this.$el.find("input[type=radio]:checked").val()},setValue:function(b){this.$el.find("input[type=radio][value="+b+"]").attr("checked",!0)},_arrayToHtml:function(b){var f=[],e=this;return g.each(b,function(c,n){var m="<li>";if(g.isObject(c)){var d=c.val?c.val:"";m+='<input type="radio" name="'+e.id+'" value="'+d+'" id="'+e.id+"-"+n+'" />',m+='<label for="'+e.id+"-"+n+'">'+c.label+"</label>"}else{m+='<input type="radio" name="'+e.id+'" value="'+c+'" id="'+e.id+"-"+n+'" />',m+='<label for="'+e.id+"-"+n+'">'+c+"</label>"}m+="</li>",f.push(m)}),f.join("")}}),a.Checkboxes=a.Select.extend({tagName:"ul",className:"bbf-checkboxes",getValue:function(){var c=[];return this.$el.find("input[type=checkbox]:checked").each(function(){c.push(h(this).val())}),c},setValue:function(b){var d=this;g.each(b,function(c){d.$el.find('input[type=checkbox][value="'+c+'"]').attr("checked",!0)})},_arrayToHtml:function(b){var f=[],e=this;return g.each(b,function(c,n){var m="<li>";if(g.isObject(c)){var d=c.val?c.val:"";m+='<input type="checkbox" name="'+e.id+'" value="'+d+'" id="'+e.id+"-"+n+'" />',m+='<label for="'+e.id+"-"+n+'">'+c.label+"</label>"}else{m+='<input type="checkbox" name="'+e.id+'" value="'+c+'" id="'+e.id+"-"+n+'" />',m+='<label for="'+e.id+"-"+n+'">'+c+"</label>"}m+="</li>",f.push(m)}),f.join("")}}),a.Object=a.Base.extend({hasNestedForm:!0,className:"bbf-object",defaultValue:{},initialize:function(b){a.Base.prototype.initialize.call(this,b);if(!this.schema.subSchema){throw"Missing required 'schema.subSchema' option for Object editor"}},render:function(){var m=this.$el,d=this.value||{},p=this.key,o=this.schema,n=o.subSchema;return this.form=new k({schema:n,data:d,idPrefix:this.id+"_"}),m.html(this.form.render().el),this},getValue:function(){return this.form.getValue()},setValue:function(b){this.value=b,this.render()},remove:function(){this.form.remove(),l.View.prototype.remove.call(this)},validate:function(){return this.form.validate()}}),a.NestedModel=a.Object.extend({initialize:function(b){a.Base.prototype.initialize.call(this,b);if(!b.schema.model){throw'Missing required "schema.model" option for NestedModel editor'}},render:function(){var b=this.value||{},n=this.key,m=this.schema.model,d=m.prototype.schema;return g.isFunction(d)&&(d=d()),this.form=new k({schema:d,model:new m(b),idPrefix:this.id+"_"}),this.$el.html(this.form.render().el),this},commit:function(){var b=this.form.commit();return b?(this.$el.addClass("error"),b):a.Object.prototype.commit.call(this)}}),a}(),k.setTemplates=k.helpers.setTemplates,k.setTemplateCompiler=k.helpers.setTemplateCompiler,k.setTemplates(j,i),l.Form=l.Form||k;if(typeof define=="function"&&define.amd){return define(function(){return k})}if(typeof module=="object"&&typeof module.exports=="object"){module.exports=k;return}})(jQuery,_,Backbone);(function(){var a={form:'      <form class="form-horizontal">{{fieldsets}}</form>    ',fieldset:"      <fieldset>        {{legend}}        {{fields}}      </fieldset>    ",field:'      <div class="control-group">        <label class="control-label" for="{{id}}">{{title}}</label>        <div class="controls">          <div class="input-xlarge">{{editor}}</div>          <div class="help-block">{{help}}</div>        </div>      </div>    '};var b={error:"error"};Backbone.Form.helpers.setTemplates(a,b)})();var DEBUG=true;if(DEBUG){if(!window.console){var console={}}if(!console.log){console.log=function(){}}if(!console.error){console.error=console.log}if(!console.info){console.info=console.log}}window.history_js=window.history_js||{hashInterval:100,delimiter:"-"};if(document.location.hash){(function(){var a=document.location.hash[0]==="#"?document.location.hash.substr(1):document.location.hash;if(a[0]===window.history_js.delimiter&&a.length>=2){a=a.substr(1);document.location=a}}())}(function(d,f,b){if("pushState" in f.history){if(DEBUG){console.info("pushState: history.pushState already implemented, skipping")}return}var c=document.documentMode&&document.documentMode<=7,g="sessionStorage" in f&&f.JSON&&!c;if(g){if(DEBUG){console.info("Using persistent storage");d.persist=true}d.setStorage=function h(i,j){f.sessionStorage[i]=JSON.stringify(j)};d.getStorage=function a(i){return JSON.parse(f.sessionStorage[i])}}else{if(DEBUG){console.info("Using non-persistent storage");d.persist=false}d.fake_storage={};d.setStorage=function h(i,j){d.fake_storage[i]=j};d.getStorage=function a(i){return d.fake_storage[i]}}function e(k,l,i,j){i=d.delimiter+escape(i);d.setStorage(i,{state:k,title:l});d.hash=i;if(j){b.replace("#"+i)}else{b.hash="#"+i}}f.history.pushState=function(j,k,i){e(j,k,i,false)};f.history.replaceState=function(j,k,i){e(j,k,i,true)};d.normalized_hash=function(){return b.hash[0]==="#"?b.hash.substring(1):b.hash};d.hashchange=function(){var i=d.normalized_hash(),j;if(i===d.hash){return}d.hash=i;j=d.hash?d.getStorage(d.hash):{};if(DEBUG){console.info("New hash: ",d.hash)}if("onpopstate" in f&&typeof f.onpopstate==="function"){f.onpopstate.apply(f,[{state:j?j.state:null}])}else{if(DEBUG){console.info("State changed, but no handler!")}}};if("onhashchange" in f&&!c){if(DEBUG){console.info("Browser has native onHashChange")}f.onhashchange=d.hashchange}else{if(DEBUG){console.info("Using manualy hash change detection")}d.hashInterval=setInterval(function(){var i=d.normalized_hash();if(i!==d.hash){d.hashchange()}},d.hashInterval)}if(d.normalized_hash()){d.hashchange()}}(window.history_js,window,document.location));var Chunk,Navigation,NavigationCollection,NavigationView,Page,Rendering,go_to_path;if(!(window.console!=null)){window.console={};window.console.data=[];window.console.log=function(a){return window.console.data.append(a)}}Navigation=Backbone.RelationalModel.extend({defaults:{path:"/",title:"New Page",show:false,children:[]},relations:[{type:Backbone.HasMany,key:"children",relatedModel:"Navigation",collectionType:"NavigationCollection",reverseRelation:{key:"parent",includeInJSON:"id"}}],schema:{title:"Text",path:"Text",show:"Boolean",children:{type:"List",listType:"NestedModel",sortable:true,model:"Navigation"}}});NavigationCollection=Backbone.Collection.extend();NavigationView=Backbone.View.extend({template:_.template(window.JST.navigation),render:function(){var b,a;console.log("rendering nav",this);b={collection:this.collection,nodeTemplate:this.nodeTemplate};a=this.template(b);$(this.el).append(a);return true}});Rendering=Backbone.RelationalModel.extend({defaults:{location:"#some-location",type:"Template",template:"some_name",content:""},tpl:function(){var a;if((this.get("content")!=null)&&this.get("content")===!""){console.log("using @content",this.get("content"));a=_.template(this.get("content"))}else{console.log("using @template",this.get("template"));a=_.template(window.JST[this.get("template")])}return a},schema:{location:{type:"Text",helpText:"CSS Selector for the rendering"},type:{type:"Select",options:["Server Template","Simple Template"]},template:"Text",content:{type:"TextArea",label:"Simple Template"}}});Page=Backbone.RelationalModel.extend({defaults:{title:"Why Hello There!",path:"newpage",content:"<p>From this day forward, Flight Control will be known by two words: 'Tough' and 'Competent.' Tough means we are forever accountable for what we do or what we fail to do. We will never again compromise our responsibilities. Every time we walk into Mission Control we will know what we stand for. Competent means we will never take anything for granted. We will never be found short in our knowledge and in our skills. Mission Control will be perfect. When you leave this meeting today you will go to your office and the first thing you will do there is to write 'Tough and Competent' on your blackboards. It will never be erased. Each day when you enter the room these words will remind you of the price paid by Grissom, White, and Chaffee. These words are the price of admission to the ranks of Mission Control.</p>"},relations:[{type:Backbone.HasMany,key:"renderings",relatedModel:"Rendering"}],schema:{title:"Text",path:"Text",content:"TextArea",rendering:{type:"List"}},initialize:function(){return this.bind("change",function(){return this.render()})},render:function(){var a;a=this;console.log("Rendering! "+this.get("title"));console.log(this);this.get("renderings").each(function(b){var d,c;c=b.tpl();console.log(c,a);d=c({page:a});$(b.get("location")).html(d);return true});return true},url:function(){return this.path+".json"}});Chunk=Backbone.Model.extend({defaults:{template:"chunk",slug:"newpage",content:"<p>It has been said that astronomy is a humbling and character-building experience.</p>"},schema:{slug:"Text",content:"TextArea"},url:function(){return"_"+this.path+".json"}});go_to_path=function(a){console.log("going to path "+a);if(a[a.length-1]==="/"){a+="index.json"}else{a+=".json"}return $.ajax({url:a,contentType:"json",success:function(c,d){var b;b=new Page(c);return b.render()},error:function(b,d,c){return console.log(b,d,c)}})};$(function(){var a;$.ajax({url:"navigation.json",contentType:"json",success:function(c,d){var e,b;e=new NavigationCollection(c);b=new NavigationView();b.el=$("#primary_nav")[0];b.collection=e;return b.render()},error:function(b,d,c){return console.log(b,d,c)}});a=null;$("a").live("click",function(c){var b;b=$(this).attr("href");history.pushState({href:b},$(this).text(),b);if(a!==b){go_to_path(b)}a=b;return c.preventDefault()});window.onpopstate=function(c){var b;b=window.location.pathname;if(a!==b){go_to_path(b)}c.preventDefault();a=window.location.pathname;return false};if(!jQuery.browser.webkit){go_to_path(window.location.href);return a=window.location.pathname}});!function(a){var b=function(d,c){this.$element=a(d);this.options=a.extend({},a.fn.collapse.defaults,c);if(this.options.parent){this.$parent=a(this.options.parent)}this.options.toggle&&this.toggle()};b.prototype={constructor:b,dimension:function(){var c=this.$element.hasClass("width");return c?"width":"height"},show:function(){var f,c,e,d;if(this.transitioning){return}f=this.dimension();c=a.camelCase(["scroll",f].join("-"));e=this.$parent&&this.$parent.find("> .accordion-group > .in");if(e&&e.length){d=e.data("collapse");if(d&&d.transitioning){return}e.collapse("hide");d||e.data("collapse",null)}this.$element[f](0);this.transition("addClass",a.Event("show"),"shown");this.$element[f](this.$element[0][c])},hide:function(){var c;if(this.transitioning){return}c=this.dimension();this.reset(this.$element[c]());this.transition("removeClass",a.Event("hide"),"hidden");this.$element[c](0)},reset:function(c){var d=this.dimension();this.$element.removeClass("collapse")[d](c||"auto")[0].offsetWidth;this.$element[c!==null?"addClass":"removeClass"]("collapse");return this},transition:function(g,d,e){var f=this,c=function(){if(d.type=="show"){f.reset()}f.transitioning=0;f.$element.trigger(e)};this.$element.trigger(d);if(d.isDefaultPrevented()){return}this.transitioning=1;this.$element[g]("in");a.support.transition&&this.$element.hasClass("collapse")?this.$element.one(a.support.transition.end,c):c()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}};a.fn.collapse=function(c){return this.each(function(){var f=a(this),e=f.data("collapse"),d=typeof c=="object"&&c;if(!e){f.data("collapse",(e=new b(this,d)))}if(typeof c=="string"){e[c]()}})};a.fn.collapse.defaults={toggle:true};a.fn.collapse.Constructor=b;a(function(){a("body").on("click.collapse.data-api","[data-toggle=collapse]",function(h){var g=a(this),c,f=g.attr("data-target")||h.preventDefault()||(c=g.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),d=a(f).data("collapse")?"toggle":g.data();a(f).collapse(d)})})}(window.jQuery);(function(a,b){function c(b){return a.less[b.split("/")[1]]}function l(){var a=document.getElementsByTagName("style");for(var b=0;b<a.length;b++){a[b].type.match(j)&&(new d.Parser).parse(a[b].innerHTML||"",function(c,d){var e=d.toCSS(),f=a[b];f.type="text/css",f.styleSheet?f.styleSheet.cssText=e:f.innerHTML=e})}}function m(a,b){for(var c=0;c<d.sheets.length;c++){n(d.sheets[c],a,b,d.sheets.length-(c+1))}}function n(b,c,e,f){var h=a.location.href.replace(/[#?].*$/,""),i=b.href.replace(/\?.*$/,""),j=g&&g.getItem(i),k=g&&g.getItem(i+":timestamp"),l={css:j,timestamp:k};/^(https?|file):/.test(i)||(i.charAt(0)=="/"?i=a.location.protocol+"//"+a.location.host+i:i=h.slice(0,h.lastIndexOf("/")+1)+i);var m=i.match(/([^\/]+)$/)[1];q(b.href,b.type,function(a,g){if(!e&&l&&g&&(new Date(g)).valueOf()===(new Date(l.timestamp)).valueOf()){p(l.css,b),c(null,null,a,b,{local:!0,remaining:f})}else{try{(new d.Parser({optimization:d.optimization,paths:[i.replace(/[\w\.-]+$/,"")],mime:b.type,filename:m})).parse(a,function(d,e){if(d){return u(d,i)}try{c(d,e,a,b,{local:!1,lastModified:g,remaining:f}),s(document.getElementById("less-error-message:"+o(i)))}catch(d){u(d,i)}})}catch(h){u(h,i)}}},function(a,b){throw new Error("Couldn't load "+b+" ("+a+")")})}function o(a){return a.replace(/^[a-z]+:\/\/?[^\/]+/,"").replace(/^\//,"").replace(/\?.*$/,"").replace(/\.[^\.\/]+$/,"").replace(/[^\.\w-]+/g,"-").replace(/\./g,":")}function p(a,b,c){var d,e=b.href?b.href.replace(/\?.*$/,""):"",f="less:"+(b.title||o(e));(d=document.getElementById(f))===null&&(d=document.createElement("style"),d.type="text/css",d.media=b.media||"screen",d.id=f,document.getElementsByTagName("head")[0].appendChild(d));if(d.styleSheet){try{d.styleSheet.cssText=a}catch(h){throw new Error("Couldn't reassign styleSheet.cssText.")}}else{(function(a){d.childNodes.length>0?d.firstChild.nodeValue!==a.nodeValue&&d.replaceChild(a,d.firstChild):d.appendChild(a)})(document.createTextNode(a))}c&&g&&(t("saving "+e+" to cache."),g.setItem(e,a),g.setItem(e+":timestamp",c))}function q(a,b,c,e){function i(b,c,d){b.status>=200&&b.status<300?c(b.responseText,b.getResponseHeader("Last-Modified")):typeof d=="function"&&d(b.status,a)}var g=r(),h=f?!1:d.async;typeof g.overrideMimeType=="function"&&g.overrideMimeType("text/css"),g.open("GET",a,h),g.setRequestHeader("Accept",b||"text/x-less, text/css; q=0.9, */*; q=0.5"),g.send(null),f?g.status===0||g.status>=200&&g.status<300?c(g.responseText):e(g.status,a):h?g.onreadystatechange=function(){g.readyState==4&&i(g,c,e)}:i(g,c,e)}function r(){if(a.XMLHttpRequest){return new XMLHttpRequest}try{return new ActiveXObject("MSXML2.XMLHTTP.3.0")}catch(b){return t("browser doesn't support AJAX."),null}}function s(a){return a&&a.parentNode.removeChild(a)}function t(a){d.env=="development"&&typeof console!="undefined"&&console.log("less: "+a)}function u(a,b){var c="less-error-message:"+o(b),e='<li><label>{line}</label><pre class="{class}">{content}</pre></li>',f=document.createElement("div"),g,h,i=[],j=a.filename||b;f.id=c,f.className="less-error-message",h="<h3>"+(a.message||"There is an error in your .less file")+'</h3><p>in <a href="'+j+'">'+j+"</a> ";var k=function(a,b,c){a.extract[b]&&i.push(e.replace(/\{line\}/,parseInt(a.line)+(b-1)).replace(/\{class\}/,c).replace(/\{content\}/,a.extract[b]))};a.stack?h+="<br/>"+a.stack.split("\n").slice(1).join("<br/>"):a.extract&&(k(a,0,""),k(a,1,"line"),k(a,2,""),h+="on line "+a.line+", column "+(a.column+1)+":</p><ul>"+i.join("")+"</ul>"),f.innerHTML=h,p([".less-error-message ul, .less-error-message li {","list-style-type: none;","margin-right: 15px;","padding: 4px 0;","margin: 0;","}",".less-error-message label {","font-size: 12px;","margin-right: 15px;","padding: 4px 0;","color: #cc7777;","}",".less-error-message pre {","color: #dd6666;","padding: 4px 0;","margin: 0;","display: inline-block;","}",".less-error-message pre.line {","color: #ff0000;","}",".less-error-message h3 {","font-size: 20px;","font-weight: bold;","padding: 15px 0 5px 0;","margin: 0;","}",".less-error-message a {","color: #10a","}",".less-error-message .error {","color: red;","font-weight: bold;","padding-bottom: 2px;","border-bottom: 1px dashed red;","}"].join("\n"),{title:"error-message"}),f.style.cssText=["font-family: Arial, sans-serif","border: 1px solid #e00","background-color: #eee","border-radius: 5px","-webkit-border-radius: 5px","-moz-border-radius: 5px","color: #e00","padding: 15px","margin-bottom: 15px"].join(";"),d.env=="development"&&(g=setInterval(function(){document.body&&(document.getElementById(c)?document.body.replaceChild(f,document.getElementById(c)):document.body.insertBefore(f,document.body.firstChild),clearInterval(g))},10))}typeof define=="function"&&define.amd&&define("less",[],function(){return d}),Array.isArray||(Array.isArray=function(a){return Object.prototype.toString.call(a)==="[object Array]"||a instanceof Array}),Array.prototype.forEach||(Array.prototype.forEach=function(a,b){var c=this.length>>>0;for(var d=0;d<c;d++){d in this&&a.call(b,this[d],d,this)}}),Array.prototype.map||(Array.prototype.map=function(a){var b=this.length>>>0,c=new Array(b),d=arguments[1];for(var e=0;e<b;e++){e in this&&(c[e]=a.call(d,this[e],e,this))}return c}),Array.prototype.filter||(Array.prototype.filter=function(a){var b=[],c=arguments[1];for(var d=0;d<this.length;d++){a.call(c,this[d])&&b.push(this[d])}return b}),Array.prototype.reduce||(Array.prototype.reduce=function(a){var b=this.length>>>0,c=0;if(b===0&&arguments.length===1){throw new TypeError}if(arguments.length>=2){var d=arguments[1]}else{do{if(c in this){d=this[c++];break}if(++c>=b){throw new TypeError}}while(!0)}for(;c<b;c++){c in this&&(d=a.call(null,d,this[c],c,this))}return d}),Array.prototype.indexOf||(Array.prototype.indexOf=function(a){var b=this.length,c=arguments[1]||0;if(!b){return -1}if(c>=b){return -1}c<0&&(c+=b);for(;c<b;c++){if(!Object.prototype.hasOwnProperty.call(this,c)){continue}if(a===this[c]){return c}}return -1}),Object.keys||(Object.keys=function(a){var b=[];for(var c in a){Object.prototype.hasOwnProperty.call(a,c)&&b.push(c)}return b}),String.prototype.trim||(String.prototype.trim=function(){return String(this).replace(/^\s\s*/,"").replace(/\s\s*$/,"")});var d,e;typeof environment=="object"&&{}.toString.call(environment)==="[object Environment]"?(typeof a=="undefined"?d={}:d=a.less={},e=d.tree={},d.mode="rhino"):typeof a=="undefined"?(d=exports,e=c("./tree"),d.mode="node"):(typeof a.less=="undefined"&&(a.less={}),d=a.less,e=a.less.tree={},d.mode="browser"),d.Parser=function v(a){function q(){h=k[g],i=f,l=f}function r(){k[g]=h,f=i,l=f}function s(){f>l&&(k[g]=k[g].slice(f-l),l=f)}function t(a){var c,d,e,h,i,j,n,o;if(a instanceof Function){return a.call(m.parsers)}if(typeof a=="string"){c=b.charAt(f)===a?a:null,e=1,s()}else{s();if(c=a.exec(k[g])){e=c[0].length}else{return null}}if(c){o=f+=e,j=f+k[g].length-e;while(f<j){h=b.charCodeAt(f);if(h!==32&&h!==10&&h!==9){break}f++}return k[g]=k[g].slice(e+(f-o)),l=f,k[g].length===0&&g<k.length-1&&g++,typeof c=="string"?c:c.length===1?c[0]:c}}function u(a,c){var d=t(a);if(!d){v(c||(typeof a=="string"?"expected '"+a+"' got '"+b.charAt(f)+"'":"unexpected token"))}else{return d}}function v(a,b){throw {index:f,type:b||"Syntax",message:a}}function w(a){return typeof a=="string"?b.charAt(f)===a:a.test(k[g])?!0:!1}function x(a){return d.mode==="node"?c("path").basename(a):a.match(/[^\/]+$/)[0]}function y(a,c){return a.filename&&c.filename&&a.filename!==c.filename?m.imports.contents[x(a.filename)]:b}function z(a,b){for(var c=a,d=-1;c>=0&&b.charAt(c)!=="\n";c--){d++}return{line:typeof a=="number"?(b.slice(0,a).match(/\n/g)||"").length:null,column:d}}function A(a,b){var c=y(a,b),d=z(a.index,c),e=d.line,f=d.column,g=c.split("\n");this.type=a.type||"Syntax",this.message=a.message,this.filename=a.filename||b.filename,this.index=a.index,this.line=typeof e=="number"?e+1:null,this.callLine=a.call&&z(a.call,c).line+1,this.callExtract=g[z(a.call,c).line],this.stack=a.stack,this.column=f,this.extract=[g[e-1],g[e],g[e+1]]}var b,f,g,h,i,j,k,l,m,n=this,o=function(){},p=this.imports={paths:a&&a.paths||[],queue:[],files:{},contents:{},mime:a&&a.mime,error:null,push:function(b,c){var e=this;this.queue.push(b),d.Parser.importer(b,this.paths,function(a,d,f){e.queue.splice(e.queue.indexOf(b),1),e.files[b]=d,e.contents[b]=f,a&&!e.error&&(e.error=a),c(a,d),e.queue.length===0&&o()},a)}};return this.env=a=a||{},this.optimization="optimization" in this.env?this.env.optimization:1,this.env.filename=this.env.filename||null,m={imports:p,parse:function(h,i){var n,p,q,r,s,u,v=[],w,x=null;f=g=l=j=0,b=h.replace(/\r\n/g,"\n"),k=function(c){var d=0,e=/[^"'`\{\}\/\(\)\\]+/g,f=/\/\*(?:[^*]|\*+[^\/*])*\*+\/|\/\/.*/g,g=/"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'|`((?:[^`\\\r\n]|\\.)*)`/g,h=0,i,j=c[0],k;for(var l=0,m,n;l<b.length;l++){e.lastIndex=l,(i=e.exec(b))&&i.index===l&&(l+=i[0].length,j.push(i[0])),m=b.charAt(l),f.lastIndex=g.lastIndex=l,(i=g.exec(b))&&i.index===l&&(l+=i[0].length,j.push(i[0]),m=b.charAt(l)),!k&&m==="/"&&(n=b.charAt(l+1),(n==="/"||n==="*")&&(i=f.exec(b))&&i.index===l&&(l+=i[0].length,j.push(i[0]),m=b.charAt(l)));switch(m){case"{":if(!k){h++,j.push(m);break}case"}":if(!k){h--,j.push(m),c[++d]=j=[];break}case"(":if(!k){k=!0,j.push(m);break}case")":if(k){k=!1,j.push(m);break}default:j.push(m)}}return h>0&&(x=new A({index:l,type:"Parse",message:"missing closing `}`",filename:a.filename},a)),c.map(function(a){return a.join("")})}([[]]);if(x){return i(x)}try{n=new e.Ruleset([],t(this.parsers.primary)),n.root=!0}catch(y){return i(new A(y,a))}n.toCSS=function(b){var f,g,h;return function(f,g){var h=[],i;f=f||{},typeof g=="object"&&!Array.isArray(g)&&(g=Object.keys(g).map(function(a){var b=g[a];return b instanceof e.Value||(b instanceof e.Expression||(b=new e.Expression([b])),b=new e.Value([b])),new e.Rule("@"+a,b,!1,0)}),h=[new e.Ruleset(null,g)]);try{var j=b.call(this,{frames:h}).toCSS([],{compress:f.compress||!1})}catch(k){throw new A(k,a)}if(i=m.imports.error){throw i instanceof A?i:new A(i,a)}return f.yuicompress&&d.mode==="node"?c("./cssmin").compressor.cssmin(j):f.compress?j.replace(/(\s)+/g,"$1"):j}}(n.eval);if(f<b.length-1){f=j,u=b.split("\n"),s=(b.slice(0,f).match(/\n/g)||"").length+1;for(var z=f,B=-1;z>=0&&b.charAt(z)!=="\n";z--){B++}x={type:"Parse",message:"Syntax Error on line "+s,index:f,filename:a.filename,line:s,column:B,extract:[u[s-2],u[s-1],u[s]]}}this.imports.queue.length>0?o=function(){i(x,n)}:i(x,n)},parsers:{primary:function(){var a,b=[];while((a=t(this.mixin.definition)||t(this.rule)||t(this.ruleset)||t(this.mixin.call)||t(this.comment)||t(this.directive))||t(/^[\s\n]+/)){a&&b.push(a)}return b},comment:function(){var a;if(b.charAt(f)!=="/"){return}if(b.charAt(f+1)==="/"){return new e.Comment(t(/^\/\/.*/),!0)}if(a=t(/^\/\*(?:[^*]|\*+[^\/*])*\*+\/\n?/)){return new e.Comment(a)}},entities:{quoted:function(){var a,c=f,d;b.charAt(c)==="~"&&(c++,d=!0);if(b.charAt(c)!=='"'&&b.charAt(c)!=="'"){return}d&&t("~");if(a=t(/^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/)){return new e.Quoted(a[0],a[1]||a[2],d)}},keyword:function(){var a;if(a=t(/^[_A-Za-z-][_A-Za-z0-9-]*/)){return e.colors.hasOwnProperty(a)?new e.Color(e.colors[a].slice(1)):new e.Keyword(a)}},call:function(){var b,c,d=f;if(!(b=/^([\w-]+|%|progid:[\w\.]+)\(/.exec(k[g]))){return}b=b[1].toLowerCase();if(b==="url"){return null}f+=b.length;if(b==="alpha"){return t(this.alpha)}t("("),c=t(this.entities.arguments);if(!t(")")){return}if(b){return new e.Call(b,c,d,a.filename)}},arguments:function(){var a=[],b;while(b=t(this.entities.assignment)||t(this.expression)){a.push(b);if(!t(",")){break}}return a},literal:function(){return t(this.entities.dimension)||t(this.entities.color)||t(this.entities.quoted)},assignment:function(){var a,b;if((a=t(/^\w+(?=\s?=)/i))&&t("=")&&(b=t(this.entity))){return new e.Assignment(a,b)}},url:function(){var a;if(b.charAt(f)!=="u"||!t(/^url\(/)){return}return a=t(this.entities.quoted)||t(this.entities.variable)||t(this.entities.dataURI)||t(/^[-\w%@$\/.&=:;#+?~]+/)||"",u(")"),new e.URL(a.value||a.data||a instanceof e.Variable?a:new e.Anonymous(a),p.paths)},dataURI:function(){var a;if(t(/^data:/)){a={},a.mime=t(/^[^\/]+\/[^,;)]+/)||"",a.charset=t(/^;\s*charset=[^,;)]+/)||"",a.base64=t(/^;\s*base64/)||"",a.data=t(/^,\s*[^)]+/);if(a.data){return a}}},variable:function(){var c,d=f;if(b.charAt(f)==="@"&&(c=t(/^@@?[\w-]+/))){return new e.Variable(c,d,a.filename)}},color:function(){var a;if(b.charAt(f)==="#"&&(a=t(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/))){return new e.Color(a[1])}},dimension:function(){var a,c=b.charCodeAt(f);if(c>57||c<45||c===47){return}if(a=t(/^(-?\d*\.?\d+)(px|%|em|rem|pc|ex|in|deg|s|ms|pt|cm|mm|rad|grad|turn)?/)){return new e.Dimension(a[1],a[2])}},javascript:function(){var a,c=f,d;b.charAt(c)==="~"&&(c++,d=!0);if(b.charAt(c)!=="`"){return}d&&t("~");if(a=t(/^`([^`]*)`/)){return new e.JavaScript(a[1],f,d)}}},variable:function(){var a;if(b.charAt(f)==="@"&&(a=t(/^(@[\w-]+)\s*:/))){return a[1]}},shorthand:function(){var a,b;if(!w(/^[@\w.%-]+\/[@\w.-]+/)){return}if((a=t(this.entity))&&t("/")&&(b=t(this.entity))){return new e.Shorthand(a,b)}},mixin:{call:function(){var c=[],d,g,h,i=f,j=b.charAt(f),k=!1;if(j!=="."&&j!=="#"){return}while(d=t(/^[#.](?:[\w-]|\\(?:[a-fA-F0-9]{1,6} ?|[^a-fA-F0-9]))+/)){c.push(new e.Element(g,d,f)),g=t(">")}t("(")&&(h=t(this.entities.arguments))&&t(")"),t(this.important)&&(k=!0);if(c.length>0&&(t(";")||w("}"))){return new e.mixin.Call(c,h||[],i,a.filename,k)}},definition:function(){var a,c=[],d,g,h,i,j,k=!1;if(b.charAt(f)!=="."&&b.charAt(f)!=="#"||w(/^[^{]*(;|})/)){return}q();if(d=t(/^([#.](?:[\w-]|\\(?:[a-fA-F0-9]{1,6} ?|[^a-fA-F0-9]))+)\s*\(/)){a=d[1];do{if(b.charAt(f)==="."&&t(/^\.{3}/)){k=!0;break}if(!(h=t(this.entities.variable)||t(this.entities.literal)||t(this.entities.keyword))){break}if(h instanceof e.Variable){if(t(":")){i=u(this.expression,"expected expression"),c.push({name:h.name,value:i})}else{if(t(/^\.{3}/)){c.push({name:h.name,variadic:!0}),k=!0;break}c.push({name:h.name})}}else{c.push({value:h})}}while(t(","));u(")"),t(/^when/)&&(j=u(this.conditions,"expected condition")),g=t(this.block);if(g){return new e.mixin.Definition(a,c,g,j,k)}r()}}},entity:function(){return t(this.entities.literal)||t(this.entities.variable)||t(this.entities.url)||t(this.entities.call)||t(this.entities.keyword)||t(this.entities.javascript)||t(this.comment)},end:function(){return t(";")||w("}")},alpha:function(){var a;if(!t(/^\(opacity=/i)){return}if(a=t(/^\d+/)||t(this.entities.variable)){return u(")"),new e.Alpha(a)}},element:function(){var a,b,c,d;c=t(this.combinator),a=t(/^(?:\d+\.\d+|\d+)%/)||t(/^(?:[.#]?|:*)(?:[\w-]|\\(?:[a-fA-F0-9]{1,6} ?|[^a-fA-F0-9]))+/)||t("*")||t(this.attribute)||t(/^\([^)@]+\)/),a||t("(")&&(d=t(this.entities.variable))&&t(")")&&(a=new e.Paren(d));if(a){return new e.Element(c,a,f)}if(c.value&&c.value.charAt(0)==="&"){return new e.Element(c,null,f)}},combinator:function(){var a,c=b.charAt(f);if(c===">"||c==="+"||c==="~"){f++;while(b.charAt(f)===" "){f++}return new e.Combinator(c)}if(c==="&"){a="&",f++,b.charAt(f)===" "&&(a="& ");while(b.charAt(f)===" "){f++}return new e.Combinator(a)}return b.charAt(f-1)===" "?new e.Combinator(" "):new e.Combinator(null)},selector:function(){var a,c,d=[],g,h;if(t("(")){return a=t(this.entity),u(")"),new e.Selector([new e.Element("",a,f)])}while(c=t(this.element)){g=b.charAt(f),d.push(c);if(g==="{"||g==="}"||g===";"||g===","){break}}if(d.length>0){return new e.Selector(d)}},tag:function(){return t(/^[a-zA-Z][a-zA-Z-]*[0-9]?/)||t("*")},attribute:function(){var a="",b,c,d;if(!t("[")){return}if(b=t(/^[a-zA-Z-]+/)||t(this.entities.quoted)){(d=t(/^[|~*$^]?=/))&&(c=t(this.entities.quoted)||t(/^[\w-]+/))?a=[b,d,c.toCSS?c.toCSS():c].join(""):a=b}if(!t("]")){return}if(a){return"["+a+"]"}},block:function(){var a;if(t("{")&&(a=t(this.primary))&&t("}")){return a}},ruleset:function(){var b=[],c,d,g;q();while(c=t(this.selector)){b.push(c),t(this.comment);if(!t(",")){break}t(this.comment)}if(b.length>0&&(d=t(this.block))){return new e.Ruleset(b,d,a.strictImports)}j=f,r()},rule:function(){var a,c,d=b.charAt(f),h,l;q();if(d==="."||d==="#"||d==="&"){return}if(a=t(this.variable)||t(this.property)){a.charAt(0)!="@"&&(l=/^([^@+\/'"*`(;{}-]*);/.exec(k[g]))?(f+=l[0].length-1,c=new e.Anonymous(l[1])):a==="font"?c=t(this.font):c=t(this.value),h=t(this.important);if(c&&t(this.end)){return new e.Rule(a,c,h,i)}j=f,r()}},"import":function(){var a,b,c=f;if(t(/^@import\s+/)&&(a=t(this.entities.quoted)||t(this.entities.url))){b=t(this.mediaFeatures);if(t(";")){return new e.Import(a,p,b,c)}}},mediaFeature:function(){var a,b,c=[];do{if(a=t(this.entities.keyword)){c.push(a)}else{if(t("(")){b=t(this.property),a=t(this.entity);if(!t(")")){return null}if(b&&a){c.push(new e.Paren(new e.Rule(b,a,null,f,!0)))}else{if(a){c.push(new e.Paren(a))}else{return null}}}}}while(a);if(c.length>0){return new e.Expression(c)}},mediaFeatures:function(){var a,b=[];do{if(a=t(this.mediaFeature)){b.push(a);if(!t(",")){break}}else{if(a=t(this.entities.variable)){b.push(a);if(!t(",")){break}}}}while(a);return b.length>0?b:null},media:function(){var a,b;if(t(/^@media/)){a=t(this.mediaFeatures);if(b=t(this.block)){return new e.Media(b,a)}}},directive:function(){var a,c,d,g,h,i;if(b.charAt(f)!=="@"){return}if(c=t(this["import"])||t(this.media)){return c}if(a=t(/^@page|@keyframes/)||t(/^@(?:-webkit-|-moz-|-o-|-ms-)[a-z0-9-]+/)){g=(t(/^[^{]+/)||"").trim();if(d=t(this.block)){return new e.Directive(a+" "+g,d)}}else{if(a=t(/^@[-a-z]+/)){if(a==="@font-face"){if(d=t(this.block)){return new e.Directive(a,d)}}else{if((c=t(this.entity))&&t(";")){return new e.Directive(a,c)}}}}},font:function(){var a=[],b=[],c,d,f,g;while(g=t(this.shorthand)||t(this.entity)){b.push(g)}a.push(new e.Expression(b));if(t(",")){while(g=t(this.expression)){a.push(g);if(!t(",")){break}}}return new e.Value(a)},value:function(){var a,b=[],c;while(a=t(this.expression)){b.push(a);if(!t(",")){break}}if(b.length>0){return new e.Value(b)}},important:function(){if(b.charAt(f)==="!"){return t(/^! *important/)}},sub:function(){var a;if(t("(")&&(a=t(this.expression))&&t(")")){return a}},multiplication:function(){var a,b,c,d;if(a=t(this.operand)){while(!w(/^\/\*/)&&(c=t("/")||t("*"))&&(b=t(this.operand))){d=new e.Operation(c,[d||a,b])}return d||a}},addition:function(){var a,c,d,g;if(a=t(this.multiplication)){while((d=t(/^[-+]\s+/)||b.charAt(f-1)!=" "&&(t("+")||t("-")))&&(c=t(this.multiplication))){g=new e.Operation(d,[g||a,c])}return g||a}},conditions:function(){var a,b,c=f,d;if(a=t(this.condition)){while(t(",")&&(b=t(this.condition))){d=new e.Condition("or",d||a,b,c)}return d||a}},condition:function(){var a,b,c,d,g=f,h=!1;t(/^not/)&&(h=!0),u("(");if(a=t(this.addition)||t(this.entities.keyword)||t(this.entities.quoted)){return(d=t(/^(?:>=|=<|[<=>])/))?(b=t(this.addition)||t(this.entities.keyword)||t(this.entities.quoted))?c=new e.Condition(d,a,b,g,h):v("expected expression"):c=new e.Condition("=",a,new e.Keyword("true"),g,h),u(")"),t(/^and/)?new e.Condition("and",c,t(this.condition)):c}},operand:function(){var a,c=b.charAt(f+1);b.charAt(f)==="-"&&(c==="@"||c==="(")&&(a=t("-"));var d=t(this.sub)||t(this.entities.dimension)||t(this.entities.color)||t(this.entities.variable)||t(this.entities.call);return a?new e.Operation("*",[new e.Dimension(-1),d]):d},expression:function(){var a,b,c=[],d;while(a=t(this.addition)||t(this.entity)){c.push(a)}if(c.length>0){return new e.Expression(c)}},property:function(){var a;if(a=t(/^(\*?-?[-a-z_0-9]+)\s*:/)){return a[1]}}}}};if(d.mode==="browser"||d.mode==="rhino"){d.Parser.importer=function(a,b,c,d){!/^([a-z]+:)?\//.test(a)&&b.length>0&&(a=b[0]+a),n({href:a,title:a,type:d.mime},function(e){e&&typeof d.errback=="function"?d.errback.call(null,a,b,c,d):c.apply(null,arguments)},!0)}}(function(a){function b(b){return a.functions.hsla(b.h,b.s,b.l,b.a)}function c(b){if(b instanceof a.Dimension){return parseFloat(b.unit=="%"?b.value/100:b.value)}if(typeof b=="number"){return b}throw {error:"RuntimeError",message:"color functions take numbers as parameters"}}function d(a){return Math.min(1,Math.max(0,a))}a.functions={rgb:function(a,b,c){return this.rgba(a,b,c,1)},rgba:function(b,d,e,f){var g=[b,d,e].map(function(a){return c(a)}),f=c(f);return new a.Color(g,f)},hsl:function(a,b,c){return this.hsla(a,b,c,1)},hsla:function(a,b,d,e){function h(a){return a=a<0?a+1:a>1?a-1:a,a*6<1?g+(f-g)*a*6:a*2<1?f:a*3<2?g+(f-g)*(2/3-a)*6:g}a=c(a)%360/360,b=c(b),d=c(d),e=c(e);var f=d<=0.5?d*(b+1):d+b-d*b,g=d*2-f;return this.rgba(h(a+1/3)*255,h(a)*255,h(a-1/3)*255,e)},hue:function(b){return new a.Dimension(Math.round(b.toHSL().h))},saturation:function(b){return new a.Dimension(Math.round(b.toHSL().s*100),"%")},lightness:function(b){return new a.Dimension(Math.round(b.toHSL().l*100),"%")},alpha:function(b){return new a.Dimension(b.toHSL().a)},saturate:function(a,c){var e=a.toHSL();return e.s+=c.value/100,e.s=d(e.s),b(e)},desaturate:function(a,c){var e=a.toHSL();return e.s-=c.value/100,e.s=d(e.s),b(e)},lighten:function(a,c){var e=a.toHSL();return e.l+=c.value/100,e.l=d(e.l),b(e)},darken:function(a,c){var e=a.toHSL();return e.l-=c.value/100,e.l=d(e.l),b(e)},fadein:function(a,c){var e=a.toHSL();return e.a+=c.value/100,e.a=d(e.a),b(e)},fadeout:function(a,c){var e=a.toHSL();return e.a-=c.value/100,e.a=d(e.a),b(e)},fade:function(a,c){var e=a.toHSL();return e.a=c.value/100,e.a=d(e.a),b(e)},spin:function(a,c){var d=a.toHSL(),e=(d.h+c.value)%360;return d.h=e<0?360+e:e,b(d)},mix:function(b,c,d){var e=d.value/100,f=e*2-1,g=b.toHSL().a-c.toHSL().a,h=((f*g==-1?f:(f+g)/(1+f*g))+1)/2,i=1-h,j=[b.rgb[0]*h+c.rgb[0]*i,b.rgb[1]*h+c.rgb[1]*i,b.rgb[2]*h+c.rgb[2]*i],k=b.alpha*e+c.alpha*(1-e);return new a.Color(j,k)},greyscale:function(b){return this.desaturate(b,new a.Dimension(100))},e:function(b){return new a.Anonymous(b instanceof a.JavaScript?b.evaluated:b)},escape:function(b){return new a.Anonymous(encodeURI(b.value).replace(/=/g,"%3D").replace(/:/g,"%3A").replace(/#/g,"%23").replace(/;/g,"%3B").replace(/\(/g,"%28").replace(/\)/g,"%29"))},"%":function(b){var c=Array.prototype.slice.call(arguments,1),d=b.value;for(var e=0;e<c.length;e++){d=d.replace(/%[sda]/i,function(a){var b=a.match(/s/i)?c[e].value:c[e].toCSS();return a.match(/[A-Z]$/)?encodeURIComponent(b):b})}return d=d.replace(/%%/g,"%"),new a.Quoted('"'+d+'"',d)},round:function(a){return this._math("round",a)},ceil:function(a){return this._math("ceil",a)},floor:function(a){return this._math("floor",a)},_math:function(b,d){if(d instanceof a.Dimension){return new a.Dimension(Math[b](c(d)),d.unit)}if(typeof d=="number"){return Math[b](d)}throw {type:"Argument",message:"argument must be a number"}},argb:function(b){return new a.Anonymous(b.toARGB())},percentage:function(b){return new a.Dimension(b.value*100,"%")},color:function(b){if(b instanceof a.Quoted){return new a.Color(b.value.slice(1))}throw {type:"Argument",message:"argument must be a string"}},iscolor:function(b){return this._isa(b,a.Color)},isnumber:function(b){return this._isa(b,a.Dimension)},isstring:function(b){return this._isa(b,a.Quoted)},iskeyword:function(b){return this._isa(b,a.Keyword)},isurl:function(b){return this._isa(b,a.URL)},ispixel:function(b){return b instanceof a.Dimension&&b.unit==="px"?a.True:a.False},ispercentage:function(b){return b instanceof a.Dimension&&b.unit==="%"?a.True:a.False},isem:function(b){return b instanceof a.Dimension&&b.unit==="em"?a.True:a.False},_isa:function(b,c){return b instanceof c?a.True:a.False}}})(c("./tree")),function(a){a.colors={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"}}(c("./tree")),function(a){a.Alpha=function(a){this.value=a},a.Alpha.prototype={toCSS:function(){return"alpha(opacity="+(this.value.toCSS?this.value.toCSS():this.value)+")"},eval:function(a){return this.value.eval&&(this.value=this.value.eval(a)),this}}}(c("../tree")),function(a){a.Anonymous=function(a){this.value=a.value||a},a.Anonymous.prototype={toCSS:function(){return this.value},eval:function(){return this}}}(c("../tree")),function(a){a.Assignment=function(a,b){this.key=a,this.value=b},a.Assignment.prototype={toCSS:function(){return this.key+"="+(this.value.toCSS?this.value.toCSS():this.value)},eval:function(a){return this.value.eval&&(this.value=this.value.eval(a)),this}}}(c("../tree")),function(a){a.Call=function(a,b,c,d){this.name=a,this.args=b,this.index=c,this.filename=d},a.Call.prototype={eval:function(b){var c=this.args.map(function(a){return a.eval(b)});if(!(this.name in a.functions)){return new a.Anonymous(this.name+"("+c.map(function(a){return a.toCSS()}).join(", ")+")")}try{return a.functions[this.name].apply(a.functions,c)}catch(d){throw {type:d.type||"Runtime",message:"error evaluating function `"+this.name+"`"+(d.message?": "+d.message:""),index:this.index,filename:this.filename}}},toCSS:function(a){return this.eval(a).toCSS()}}}(c("../tree")),function(a){a.Color=function(a,b){Array.isArray(a)?this.rgb=a:a.length==6?this.rgb=a.match(/.{2}/g).map(function(a){return parseInt(a,16)}):this.rgb=a.split("").map(function(a){return parseInt(a+a,16)}),this.alpha=typeof b=="number"?b:1},a.Color.prototype={eval:function(){return this},toCSS:function(){return this.alpha<1?"rgba("+this.rgb.map(function(a){return Math.round(a)}).concat(this.alpha).join(", ")+")":"#"+this.rgb.map(function(a){return a=Math.round(a),a=(a>255?255:a<0?0:a).toString(16),a.length===1?"0"+a:a}).join("")},operate:function(b,c){var d=[];c instanceof a.Color||(c=c.toColor());for(var e=0;e<3;e++){d[e]=a.operate(b,this.rgb[e],c.rgb[e])}return new a.Color(d,this.alpha+c.alpha)},toHSL:function(){var a=this.rgb[0]/255,b=this.rgb[1]/255,c=this.rgb[2]/255,d=this.alpha,e=Math.max(a,b,c),f=Math.min(a,b,c),g,h,i=(e+f)/2,j=e-f;if(e===f){g=h=0}else{h=i>0.5?j/(2-e-f):j/(e+f);switch(e){case a:g=(b-c)/j+(b<c?6:0);break;case b:g=(c-a)/j+2;break;case c:g=(a-b)/j+4}g/=6}return{h:g*360,s:h,l:i,a:d}},toARGB:function(){var a=[Math.round(this.alpha*255)].concat(this.rgb);return"#"+a.map(function(a){return a=Math.round(a),a=(a>255?255:a<0?0:a).toString(16),a.length===1?"0"+a:a}).join("")}}}(c("../tree")),function(a){a.Comment=function(a,b){this.value=a,this.silent=!!b},a.Comment.prototype={toCSS:function(a){return a.compress?"":this.value},eval:function(){return this}}}(c("../tree")),function(a){a.Condition=function(a,b,c,d,e){this.op=a.trim(),this.lvalue=b,this.rvalue=c,this.index=d,this.negate=e},a.Condition.prototype.eval=function(a){var b=this.lvalue.eval(a),c=this.rvalue.eval(a),d=this.index,e,e=function(a){switch(a){case"and":return b&&c;case"or":return b||c;default:if(b.compare){e=b.compare(c)}else{if(c.compare){e=c.compare(b)}else{throw {type:"Type",message:"Unable to perform comparison",index:d}}}switch(e){case -1:return a==="<"||a==="=<";case 0:return a==="="||a===">="||a==="=<";case 1:return a===">"||a===">="}}}(this.op);return this.negate?!e:e}}(c("../tree")),function(a){a.Dimension=function(a,b){this.value=parseFloat(a),this.unit=b||null},a.Dimension.prototype={eval:function(){return this},toColor:function(){return new a.Color([this.value,this.value,this.value])},toCSS:function(){var a=this.value+this.unit;return a},operate:function(b,c){return new a.Dimension(a.operate(b,this.value,c.value),this.unit||c.unit)},compare:function(b){return b instanceof a.Dimension?b.value>this.value?-1:b.value<this.value?1:0:-1}}}(c("../tree")),function(a){a.Directive=function(b,c,d){this.name=b,Array.isArray(c)?(this.ruleset=new a.Ruleset([],c),this.ruleset.allowImports=!0):this.value=c},a.Directive.prototype={toCSS:function(a,b){return this.ruleset?(this.ruleset.root=!0,this.name+(b.compress?"{":" {\n  ")+this.ruleset.toCSS(a,b).trim().replace(/\n/g,"\n  ")+(b.compress?"}":"\n}\n")):this.name+" "+this.value.toCSS()+";\n"},eval:function(a){return a.frames.unshift(this),this.ruleset=this.ruleset&&this.ruleset.eval(a),a.frames.shift(),this},variable:function(b){return a.Ruleset.prototype.variable.call(this.ruleset,b)},find:function(){return a.Ruleset.prototype.find.apply(this.ruleset,arguments)},rulesets:function(){return a.Ruleset.prototype.rulesets.apply(this.ruleset)}}}(c("../tree")),function(a){a.Element=function(b,c,d){this.combinator=b instanceof a.Combinator?b:new a.Combinator(b),typeof c=="string"?this.value=c.trim():c?this.value=c:this.value="",this.index=d},a.Element.prototype.eval=function(b){return new a.Element(this.combinator,this.value.eval?this.value.eval(b):this.value,this.index)},a.Element.prototype.toCSS=function(a){return this.combinator.toCSS(a||{})+(this.value.toCSS?this.value.toCSS(a):this.value)},a.Combinator=function(a){a===" "?this.value=" ":a==="& "?this.value="& ":this.value=a?a.trim():""},a.Combinator.prototype.toCSS=function(a){return{"":""," ":" ","&":"","& ":" ",":":" :","+":a.compress?"+":" + ","~":a.compress?"~":" ~ ",">":a.compress?">":" > "}[this.value]}}(c("../tree")),function(a){a.Expression=function(a){this.value=a},a.Expression.prototype={eval:function(b){return this.value.length>1?new a.Expression(this.value.map(function(a){return a.eval(b)})):this.value.length===1?this.value[0].eval(b):this},toCSS:function(a){return this.value.map(function(b){return b.toCSS?b.toCSS(a):""}).join(" ")}}}(c("../tree")),function(a){a.Import=function(b,c,d,e){var f=this;this.index=e,this._path=b,this.features=d&&new a.Value(d),b instanceof a.Quoted?this.path=/\.(le?|c)ss(\?.*)?$/.test(b.value)?b.value:b.value+".less":this.path=b.value.value||b.value,this.css=/css(\?.*)?$/.test(this.path),this.css||c.push(this.path,function(b,c){b&&(b.index=e),f.root=c||new a.Ruleset([],[])})},a.Import.prototype={toCSS:function(a){var b=this.features?" "+this.features.toCSS(a):"";return this.css?"@import "+this._path.toCSS()+b+";\n":""},eval:function(b){var c,d=this.features&&this.features.eval(b);if(this.css){return this}c=new a.Ruleset([],this.root.rules.slice(0));for(var e=0;e<c.rules.length;e++){c.rules[e] instanceof a.Import&&Array.prototype.splice.apply(c.rules,[e,1].concat(c.rules[e].eval(b)))}return this.features?new a.Media(c.rules,this.features.value):c.rules}}}(c("../tree")),function(a){a.JavaScript=function(a,b,c){this.escaped=c,this.expression=a,this.index=b},a.JavaScript.prototype={eval:function(b){var c,d=this,e={},f=this.expression.replace(/@\{([\w-]+)\}/g,function(c,e){return a.jsify((new a.Variable("@"+e,d.index)).eval(b))});try{f=new Function("return ("+f+")")}catch(g){throw {message:"JavaScript evaluation error: `"+f+"`",index:this.index}}for(var h in b.frames[0].variables()){e[h.slice(1)]={value:b.frames[0].variables()[h].value,toJS:function(){return this.value.eval(b).toCSS()}}}try{c=f.call(e)}catch(g){throw {message:"JavaScript evaluation error: '"+g.name+": "+g.message+"'",index:this.index}}return typeof c=="string"?new a.Quoted('"'+c+'"',c,this.escaped,this.index):Array.isArray(c)?new a.Anonymous(c.join(", ")):new a.Anonymous(c)}}}(c("../tree")),function(a){a.Keyword=function(a){this.value=a},a.Keyword.prototype={eval:function(){return this},toCSS:function(){return this.value},compare:function(b){return b instanceof a.Keyword?b.value===this.value?0:1:-1}},a.True=new a.Keyword("true"),a.False=new a.Keyword("false")}(c("../tree")),function(a){a.Media=function(b,c){var d=new a.Element("&",null,0),e=[new a.Selector([d])];this.features=new a.Value(c),this.ruleset=new a.Ruleset(e,b),this.ruleset.allowImports=!0},a.Media.prototype={toCSS:function(a,b){var c=this.features.toCSS(b);return this.ruleset.root=a.length===0||a[0].multiMedia,"@media "+c+(b.compress?"{":" {\n  ")+this.ruleset.toCSS(a,b).trim().replace(/\n/g,"\n  ")+(b.compress?"}":"\n}\n")},eval:function(b){b.mediaBlocks||(b.mediaBlocks=[],b.mediaPath=[]);var c=b.mediaBlocks.length;b.mediaPath.push(this),b.mediaBlocks.push(this);var d=new a.Media([],[]);return d.features=this.features.eval(b),b.frames.unshift(this.ruleset),d.ruleset=this.ruleset.eval(b),b.frames.shift(),b.mediaBlocks[c]=d,b.mediaPath.pop(),b.mediaPath.length===0?d.evalTop(b):d.evalNested(b)},variable:function(b){return a.Ruleset.prototype.variable.call(this.ruleset,b)},find:function(){return a.Ruleset.prototype.find.apply(this.ruleset,arguments)},rulesets:function(){return a.Ruleset.prototype.rulesets.apply(this.ruleset)},evalTop:function(b){var c=this;if(b.mediaBlocks.length>1){var d=new a.Element("&",null,0),e=[new a.Selector([d])];c=new a.Ruleset(e,b.mediaBlocks),c.multiMedia=!0}return delete b.mediaBlocks,delete b.mediaPath,c},evalNested:function(b){var c,d,e=b.mediaPath.concat([this]);for(c=0;c<e.length;c++){d=e[c].features instanceof a.Value?e[c].features.value:e[c].features,e[c]=Array.isArray(d)?d:[d]}return this.features=new a.Value(this.permute(e).map(function(b){b=b.map(function(b){return b.toCSS?b:new a.Anonymous(b)});for(c=b.length-1;c>0;c--){b.splice(c,0,new a.Anonymous("and"))}return new a.Expression(b)})),new a.Ruleset([],[])},permute:function(a){if(a.length===0){return[]}if(a.length===1){return a[0]}var b=[],c=this.permute(a.slice(1));for(var d=0;d<c.length;d++){for(var e=0;e<a[0].length;e++){b.push([a[0][e]].concat(c[d]))}}return b}}}(c("../tree")),function(a){a.mixin={},a.mixin.Call=function(b,c,d,e,f){this.selector=new a.Selector(b),this.arguments=c,this.index=d,this.filename=e,this.important=f},a.mixin.Call.prototype={eval:function(a){var b,c,d=[],e=!1;for(var f=0;f<a.frames.length;f++){if((b=a.frames[f].find(this.selector)).length>0){c=this.arguments&&this.arguments.map(function(b){return b.eval(a)});for(var g=0;g<b.length;g++){if(b[g].match(c,a)){try{Array.prototype.push.apply(d,b[g].eval(a,this.arguments,this.important).rules),e=!0}catch(h){throw {message:h.message,index:this.index,filename:this.filename,stack:h.stack}}}}if(e){return d}throw {type:"Runtime",message:"No matching definition was found for `"+this.selector.toCSS().trim()+"("+this.arguments.map(function(a){return a.toCSS()}).join(", ")+")`",index:this.index,filename:this.filename}}}throw {type:"Name",message:this.selector.toCSS().trim()+" is undefined",index:this.index,filename:this.filename}}},a.mixin.Definition=function(b,c,d,e,f){this.name=b,this.selectors=[new a.Selector([new a.Element(null,b)])],this.params=c,this.condition=e,this.variadic=f,this.arity=c.length,this.rules=d,this._lookups={},this.required=c.reduce(function(a,b){return !b.name||b.name&&!b.value?a+1:a},0),this.parent=a.Ruleset.prototype,this.frames=[]},a.mixin.Definition.prototype={toCSS:function(){return""},variable:function(a){return this.parent.variable.call(this,a)},variables:function(){return this.parent.variables.call(this)},find:function(){return this.parent.find.apply(this,arguments)},rulesets:function(){return this.parent.rulesets.apply(this)},evalParams:function(b,c){var d=new a.Ruleset(null,[]),e;for(var f=0,g,h;f<this.params.length;f++){if(h=this.params[f].name){if(this.params[f].variadic&&c){e=[];for(var i=f;i<c.length;i++){e.push(c[i].eval(b))}d.rules.unshift(new a.Rule(h,(new a.Expression(e)).eval(b)))}else{if(g=c&&c[f]||this.params[f].value){d.rules.unshift(new a.Rule(h,g.eval(b)))}else{throw {type:"Runtime",message:"wrong number of arguments for "+this.name+" ("+c.length+" for "+this.arity+")"}}}}}return d},eval:function(b,c,d){var e=this.evalParams(b,c),f,g=[],h,i;for(var j=0;j<Math.max(this.params.length,c&&c.length);j++){g.push(c[j]||this.params[j].value)}return e.rules.unshift(new a.Rule("@arguments",(new a.Expression(g)).eval(b))),h=d?this.rules.map(function(b){return new a.Rule(b.name,b.value,"!important",b.index)}):this.rules.slice(0),(new a.Ruleset(null,h)).eval({frames:[this,e].concat(this.frames,b.frames)})},match:function(a,b){var c=a&&a.length||0,d,e;if(!this.variadic){if(c<this.required){return !1}if(c>this.params.length){return !1}if(this.required>0&&c>this.params.length){return !1}}if(this.condition&&!this.condition.eval({frames:[this.evalParams(b,a)].concat(b.frames)})){return !1}d=Math.min(c,this.arity);for(var f=0;f<d;f++){if(!this.params[f].name&&a[f].eval(b).toCSS()!=this.params[f].value.eval(b).toCSS()){return !1}}return !0}}}(c("../tree")),function(a){a.Operation=function(a,b){this.op=a.trim(),this.operands=b},a.Operation.prototype.eval=function(b){var c=this.operands[0].eval(b),d=this.operands[1].eval(b),e;if(c instanceof a.Dimension&&d instanceof a.Color){if(this.op==="*"||this.op==="+"){e=d,d=c,c=e}else{throw {name:"OperationError",message:"Can't substract or divide a color from a number"}}}return c.operate(this.op,d)},a.operate=function(a,b,c){switch(a){case"+":return b+c;case"-":return b-c;case"*":return b*c;case"/":return b/c}}}(c("../tree")),function(a){a.Paren=function(a){this.value=a},a.Paren.prototype={toCSS:function(a){return"("+this.value.toCSS(a)+")"},eval:function(b){return new a.Paren(this.value.eval(b))}}}(c("../tree")),function(a){a.Quoted=function(a,b,c,d){this.escaped=c,this.value=b||"",this.quote=a.charAt(0),this.index=d},a.Quoted.prototype={toCSS:function(){return this.escaped?this.value:this.quote+this.value+this.quote},eval:function(b){var c=this,d=this.value.replace(/`([^`]+)`/g,function(d,e){return(new a.JavaScript(e,c.index,!0)).eval(b).value}).replace(/@\{([\w-]+)\}/g,function(d,e){var f=(new a.Variable("@"+e,c.index)).eval(b);return"value" in f?f.value:f.toCSS()});return new a.Quoted(this.quote+d+this.quote,d,this.escaped,this.index)}}}(c("../tree")),function(a){a.Rule=function(b,c,d,e,f){this.name=b,this.value=c instanceof a.Value?c:new a.Value([c]),this.important=d?" "+d.trim():"",this.index=e,this.inline=f||!1,b.charAt(0)==="@"?this.variable=!0:this.variable=!1},a.Rule.prototype.toCSS=function(a){return this.variable?"":this.name+(a.compress?":":": ")+this.value.toCSS(a)+this.important+(this.inline?"":";")},a.Rule.prototype.eval=function(b){return new a.Rule(this.name,this.value.eval(b),this.important,this.index,this.inline)},a.Shorthand=function(a,b){this.a=a,this.b=b},a.Shorthand.prototype={toCSS:function(a){return this.a.toCSS(a)+"/"+this.b.toCSS(a)},eval:function(){return this}}}(c("../tree")),function(a){a.Ruleset=function(a,b,c){this.selectors=a,this.rules=b,this._lookups={},this.strictImports=c},a.Ruleset.prototype={eval:function(b){var c=this.selectors&&this.selectors.map(function(a){return a.eval(b)}),d=new a.Ruleset(c,this.rules.slice(0),this.strictImports);d.root=this.root,d.allowImports=this.allowImports,b.frames.unshift(d);if(d.root||d.allowImports||!d.strictImports){for(var e=0;e<d.rules.length;e++){d.rules[e] instanceof a.Import&&Array.prototype.splice.apply(d.rules,[e,1].concat(d.rules[e].eval(b)))}}for(var e=0;e<d.rules.length;e++){d.rules[e] instanceof a.mixin.Definition&&(d.rules[e].frames=b.frames.slice(0))}for(var e=0;e<d.rules.length;e++){d.rules[e] instanceof a.mixin.Call&&Array.prototype.splice.apply(d.rules,[e,1].concat(d.rules[e].eval(b)))}for(var e=0,f;e<d.rules.length;e++){f=d.rules[e],f instanceof a.mixin.Definition||(d.rules[e]=f.eval?f.eval(b):f)}return b.frames.shift(),d},match:function(a){return !a||a.length===0},variables:function(){return this._variables?this._variables:this._variables=this.rules.reduce(function(b,c){return c instanceof a.Rule&&c.variable===!0&&(b[c.name]=c),b},{})},variable:function(a){return this.variables()[a]},rulesets:function(){return this._rulesets?this._rulesets:this._rulesets=this.rules.filter(function(b){return b instanceof a.Ruleset||b instanceof a.mixin.Definition})},find:function(b,c){c=c||this;var d=[],e,f,g=b.toCSS();return g in this._lookups?this._lookups[g]:(this.rulesets().forEach(function(e){if(e!==c){for(var g=0;g<e.selectors.length;g++){if(f=b.match(e.selectors[g])){b.elements.length>e.selectors[g].elements.length?Array.prototype.push.apply(d,e.find(new a.Selector(b.elements.slice(1)),c)):d.push(e);break}}}}),this._lookups[g]=d)},toCSS:function(b,c){var d=[],e=[],f=[],g=[],h,i;this.root||(b.length===0?g=this.selectors.map(function(a){return[a]}):this.joinSelectors(g,b,this.selectors));for(var j=0;j<this.rules.length;j++){i=this.rules[j],i.rules||i instanceof a.Directive||i instanceof a.Media?f.push(i.toCSS(g,c)):i instanceof a.Comment?i.silent||(this.root?f.push(i.toCSS(c)):e.push(i.toCSS(c))):i.toCSS&&!i.variable?e.push(i.toCSS(c)):i.value&&!i.variable&&e.push(i.value.toString())}return f=f.join(""),this.root?d.push(e.join(c.compress?"":"\n")):e.length>0&&(h=g.map(function(a){return a.map(function(a){return a.toCSS(c)}).join("").trim()}).join(c.compress?",":",\n"),d.push(h,(c.compress?"{":" {\n  ")+e.join(c.compress?"":"\n  ")+(c.compress?"}":"\n}\n"))),d.push(f),d.join("")+(c.compress?"\n":"")},joinSelectors:function(a,b,c){for(var d=0;d<c.length;d++){this.joinSelector(a,b,c[d])}},joinSelector:function(b,c,d){var e=[],f=[],g=[],h=[],i=!1,j;for(var k=0;k<d.elements.length;k++){j=d.elements[k],j.combinator.value.charAt(0)==="&"&&(i=!0),i?h.push(j):g.push(j)}i||(h=g,g=[]),g.length>0&&e.push(new a.Selector(g)),h.length>0&&f.push(new a.Selector(h));for(var l=0;l<c.length;l++){b.push(e.concat(c[l]).concat(f))}}}}(c("../tree")),function(a){a.Selector=function(a){this.elements=a,this.elements[0].combinator.value===""&&(this.elements[0].combinator.value=" ")},a.Selector.prototype.match=function(a){var b=this.elements.length,c=a.elements.length,d=Math.min(b,c);if(b<c){return !1}for(var e=0;e<d;e++){if(this.elements[e].value!==a.elements[e].value){return !1}}return !0},a.Selector.prototype.eval=function(b){return new a.Selector(this.elements.map(function(a){return a.eval(b)}))},a.Selector.prototype.toCSS=function(a){return this._css?this._css:this._css=this.elements.map(function(b){return typeof b=="string"?" "+b.trim():b.toCSS(a)}).join("")}}(c("../tree")),function(b){b.URL=function(b,c){b.data?this.attrs=b:(typeof a!="undefined"&&!/^(?:https?:\/\/|file:\/\/|data:|\/)/.test(b.value)&&c.length>0&&(b.value=c[0]+(b.value.charAt(0)==="/"?b.value.slice(1):b.value)),this.value=b,this.paths=c)},b.URL.prototype={toCSS:function(){return"url("+(this.attrs?"data:"+this.attrs.mime+this.attrs.charset+this.attrs.base64+this.attrs.data:this.value.toCSS())+")"},eval:function(a){return this.attrs?this:new b.URL(this.value.eval(a),this.paths)}}}(c("../tree")),function(a){a.Value=function(a){this.value=a,this.is="value"},a.Value.prototype={eval:function(b){return this.value.length===1?this.value[0].eval(b):new a.Value(this.value.map(function(a){return a.eval(b)}))},toCSS:function(a){return this.value.map(function(b){return b.toCSS(a)}).join(a.compress?",":", ")}}}(c("../tree")),function(a){a.Variable=function(a,b,c){this.name=a,this.index=b,this.file=c},a.Variable.prototype={eval:function(b){var c,d,e=this.name;e.indexOf("@@")==0&&(e="@"+(new a.Variable(e.slice(1))).eval(b).value);if(c=a.find(b.frames,function(a){if(d=a.variable(e)){return d.value.eval(b)}})){return c}throw {type:"Name",message:"variable "+e+" is undefined",filename:this.file,index:this.index}}}}(c("../tree")),function(a){a.find=function(a,b){for(var c=0,d;c<a.length;c++){if(d=b.call(a,a[c])){return d}}return null},a.jsify=function(a){return Array.isArray(a.value)&&a.value.length>1?"["+a.value.map(function(a){return a.toCSS(!1)}).join(", ")+"]":a.toCSS(!1)}}(c("./tree"));var f=location.protocol==="file:"||location.protocol==="chrome:"||location.protocol==="chrome-extension:"||location.protocol==="resource:";d.env=d.env||(location.hostname=="127.0.0.1"||location.hostname=="0.0.0.0"||location.hostname=="localhost"||location.port.length>0||f?"development":"production"),d.async=!1,d.poll=d.poll||(f?1000:1500),d.watch=function(){return this.watchMode=!0},d.unwatch=function(){return this.watchMode=!1},d.env==="development"?(d.optimization=0,/!watch/.test(location.hash)&&d.watch(),d.watchTimer=setInterval(function(){d.watchMode&&m(function(a,b,c,d,e){b&&p(b.toCSS(),d,e.lastModified)})},d.poll)):d.optimization=3;var g;try{g=typeof a.localStorage=="undefined"?null:a.localStorage}catch(h){g=null}var i=document.getElementsByTagName("link"),j=/^text\/(x-)?less$/;d.sheets=[];for(var k=0;k<i.length;k++){(i[k].rel==="stylesheet/less"||i[k].rel.match(/stylesheet/)&&i[k].type.match(j))&&d.sheets.push(i[k])}d.refresh=function(a){var b,c;b=c=new Date,m(function(a,d,e,f,g){g.local?t("loading "+f.href+" from cache."):(t("parsed "+f.href+" successfully."),p(d.toCSS(),f,g.lastModified)),t("css for "+f.href+" generated in "+(new Date-c)+"ms"),g.remaining===0&&t("css generated in "+(new Date-b)+"ms"),c=new Date},a),l()},d.refreshStyles=l,d.refresh(d.env==="development")})(window);