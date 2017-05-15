/**
 *  First look through the element's siblings, then go up a level and repeat
 */
;(function( $ ){
   $.fn.psiblings = function(search) {
        // Get the current element's siblings
        var siblings = this.siblings(search);

        if (siblings.length != 0) { // Did we get a hit?
            return siblings.eq(0);
        }

        // Traverse up another level
        var parent = this.parent();
        if (parent === undefined || parent.get(0).tagName.toLowerCase() == 'body') {
            // We reached the body tag or failed to get a parent with no result.
            // Return the empty siblings tag so as to return an empty jQuery object.
            return siblings;
        }
        // Try again
        return parent.psiblings(search);
   }; 
})( jQuery );
/*!
 * bootstrap-tokenfield
 * https://github.com/sliptree/bootstrap-tokenfield
 * Copyright 2013-2014 Sliptree and other contributors; Licensed MIT
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // For CommonJS and CommonJS-like environments where a window with jQuery
    // is present, execute the factory with the jQuery instance from the window object
    // For environments that do not inherently posses a window with a document
    // (such as Node.js), expose a Tokenfield-making factory as module.exports
    // This accentuates the need for the creation of a real window or passing in a jQuery instance
    // e.g. require("bootstrap-tokenfield")(window); or require("bootstrap-tokenfield")($);
    module.exports = global.window && global.window.$ ?
      factory( global.window.$ ) :
      function( input ) {
        if ( !input.$ && !input.fn ) {
          throw new Error( "Tokenfield requires a window object with jQuery or a jQuery instance" );
        }
        return factory( input.$ || input );
      };
  } else {
    // Browser globals
    factory(jQuery, window);
  }
}(function ($, window) {

  "use strict"; // jshint ;_;

 /* TOKENFIELD PUBLIC CLASS DEFINITION
  * ============================== */

  var Tokenfield = function (element, options) {
    var _self = this

    this.$element = $(element)
    this.textDirection = this.$element.css('direction');

    // Extend options
    this.options = $.extend(true, {}, $.fn.tokenfield.defaults, { tokens: this.$element.val() }, this.$element.data(), options)

    // Setup delimiters and trigger keys
    this._delimiters = (typeof this.options.delimiter === 'string') ? [this.options.delimiter] : this.options.delimiter
    this._triggerKeys = $.map(this._delimiters, function (delimiter) {
      return delimiter.charCodeAt(0);
    });
    this._firstDelimiter = this._delimiters[0];

    // Check for whitespace, dash and special characters
    var whitespace = $.inArray(' ', this._delimiters)
      , dash = $.inArray('-', this._delimiters)

    if (whitespace >= 0)
      this._delimiters[whitespace] = '\\s'

    if (dash >= 0) {
      delete this._delimiters[dash]
      this._delimiters.unshift('-')
    }

    var specialCharacters = ['\\', '$', '[', '{', '^', '.', '|', '?', '*', '+', '(', ')']
    $.each(this._delimiters, function (index, character) {
      var pos = $.inArray(character, specialCharacters)
      if (pos >= 0) _self._delimiters[index] = '\\' + character;
    });

    // Store original input width
    var elRules = (window && typeof window.getMatchedCSSRules === 'function') ? window.getMatchedCSSRules( element ) : null
      , elStyleWidth = element.style.width
      , elCSSWidth
      , elWidth = this.$element.width()

    if (elRules) {
      $.each( elRules, function (i, rule) {
        if (rule.style.width) {
          elCSSWidth = rule.style.width;
        }
      });
    }

    // Move original input out of the way
    var hidingPosition = $('body').css('direction') === 'rtl' ? 'right' : 'left',
        originalStyles = { position: this.$element.css('position') };
    originalStyles[hidingPosition] = this.$element.css(hidingPosition);

    this.$element
      .data('original-styles', originalStyles)
      .data('original-tabindex', this.$element.prop('tabindex'))
      .css('position', 'absolute')
      .css(hidingPosition, '-10000px')
      .prop('tabindex', -1)

    // Create a wrapper
    this.$wrapper = $('<div class="tokenfield form-control" />')
    if (this.$element.hasClass('input-lg')) this.$wrapper.addClass('input-lg')
    if (this.$element.hasClass('input-sm')) this.$wrapper.addClass('input-sm')
    if (this.textDirection === 'rtl') this.$wrapper.addClass('rtl')

    // Create a new input
    var id = this.$element.prop('id') || new Date().getTime() + '' + Math.floor((1 + Math.random()) * 100)
    this.$input = $('<input type="'+this.options.inputType+'" class="token-input" autocomplete="off" />')
                    .appendTo( this.$wrapper )
                    .prop( 'placeholder',  this.$element.prop('placeholder') )
                    .prop( 'id', id + '-tokenfield' )
                    .prop( 'tabindex', this.$element.data('original-tabindex') )

    // Re-route original input label to new input
    var $label = $( 'label[for="' + this.$element.prop('id') + '"]' )
    if ( $label.length ) {
      $label.prop( 'for', this.$input.prop('id') )
    }

    // Set up a copy helper to handle copy & paste
    this.$copyHelper = $('<input type="text" />').css('position', 'absolute').css(hidingPosition, '-10000px').prop('tabindex', -1).prependTo( this.$wrapper )

    // Set wrapper width
    if (elStyleWidth) {
      this.$wrapper.css('width', elStyleWidth);
    }
    else if (elCSSWidth) {
      this.$wrapper.css('width', elCSSWidth);
    }
    // If input is inside inline-form with no width set, set fixed width
    else if (this.$element.parents('.form-inline').length) {
      this.$wrapper.width( elWidth )
    }

    // Set tokenfield disabled, if original or fieldset input is disabled
    if (this.$element.prop('disabled') || this.$element.parents('fieldset[disabled]').length) {
      this.disable();
    }

    // Set tokenfield readonly, if original input is readonly
    if (this.$element.prop('readonly')) {
      this.readonly();
    }

    // Set up mirror for input auto-sizing
    this.$mirror = $('<span style="position:absolute; top:-999px; left:0; white-space:pre;"/>');
    this.$input.css('min-width', this.options.minWidth + 'px')
    $.each([
        'fontFamily',
        'fontSize',
        'fontWeight',
        'fontStyle',
        'letterSpacing',
        'textTransform',
        'wordSpacing',
        'textIndent'
    ], function (i, val) {
        _self.$mirror[0].style[val] = _self.$input.css(val);
    });
    this.$mirror.appendTo( 'body' )

    // Insert tokenfield to HTML
    this.$wrapper.insertBefore( this.$element )
    this.$element.prependTo( this.$wrapper )

    // Calculate inner input width
    this.update()

    // Create initial tokens, if any
    this.setTokens(this.options.tokens, false, ! this.$element.val() && this.options.tokens )

    // Start listening to events
    this.listen()

    // Initialize autocomplete, if necessary
    if ( ! $.isEmptyObject( this.options.autocomplete ) ) {
      var side = this.textDirection === 'rtl' ? 'right' : 'left'
       ,  autocompleteOptions = $.extend({
            minLength: this.options.showAutocompleteOnFocus ? 0 : null,
            position: { my: side + " top", at: side + " bottom", of: this.$wrapper }
          }, this.options.autocomplete )

      this.$input.autocomplete( autocompleteOptions )
    }

    // Initialize typeahead, if necessary
    if ( ! $.isEmptyObject( this.options.typeahead ) ) {

      var typeaheadOptions = this.options.typeahead
        , defaults = {
            minLength: this.options.showAutocompleteOnFocus ? 0 : null
          }
        , args = $.isArray( typeaheadOptions ) ? typeaheadOptions : [typeaheadOptions, typeaheadOptions]

      args[0] = $.extend( {}, defaults, args[0] )

      this.$input.typeahead.apply( this.$input, args )
      this.typeahead = true
    }
  }

  Tokenfield.prototype = {

    constructor: Tokenfield

  , createToken: function (attrs, triggerChange) {
      var _self = this

      if (typeof attrs === 'string') {
        attrs = { value: attrs, label: attrs }
      } else {
        // Copy objects to prevent contamination of data sources.
        attrs = $.extend( {}, attrs )
      }

      if (typeof triggerChange === 'undefined') {
         triggerChange = true
      }

      // Normalize label and value
      attrs.value = $.trim(attrs.value.toString());
      attrs.label = attrs.label && attrs.label.length ? $.trim(attrs.label) : attrs.value

      // Bail out if has no value or label, or label is too short
      if (!attrs.value.length || !attrs.label.length || attrs.label.length <= this.options.minLength) return

      // Bail out if maximum number of tokens is reached
      if (this.options.limit && this.getTokens().length >= this.options.limit) return

      // Allow changing token data before creating it
      var createEvent = $.Event('tokenfield:createtoken', { attrs: attrs })
      this.$element.trigger(createEvent)

      // Bail out if there if attributes are empty or event was defaultPrevented
      if (!createEvent.attrs || createEvent.isDefaultPrevented()) return

      var $token = $('<div class="token" />')
            .append('<span class="token-label" />')
            .append('<a href="#" class="close" tabindex="-1">&times;</a>')
            .data('attrs', attrs)

      // Insert token into HTML
      if (this.$input.hasClass('tt-input')) {
        // If the input has typeahead enabled, insert token before it's parent
        this.$input.parent().before( $token )
      } else {
        this.$input.before( $token )
      }

      // Temporarily set input width to minimum
      this.$input.css('width', this.options.minWidth + 'px')

      var $tokenLabel = $token.find('.token-label')
        , $closeButton = $token.find('.close')

      // Determine maximum possible token label width
      if (!this.maxTokenWidth) {
        this.maxTokenWidth =
          this.$wrapper.width() - $closeButton.outerWidth() -
          parseInt($closeButton.css('margin-left'), 10) -
          parseInt($closeButton.css('margin-right'), 10) -
          parseInt($token.css('border-left-width'), 10) -
          parseInt($token.css('border-right-width'), 10) -
          parseInt($token.css('padding-left'), 10) -
          parseInt($token.css('padding-right'), 10)
          parseInt($tokenLabel.css('border-left-width'), 10) -
          parseInt($tokenLabel.css('border-right-width'), 10) -
          parseInt($tokenLabel.css('padding-left'), 10) -
          parseInt($tokenLabel.css('padding-right'), 10)
          parseInt($tokenLabel.css('margin-left'), 10) -
          parseInt($tokenLabel.css('margin-right'), 10)
      }

      $tokenLabel.css('max-width', this.maxTokenWidth)
      if (this.options.html)
        $tokenLabel.html(attrs.label)
      else
        $tokenLabel.text(attrs.label)

      // Listen to events on token
      $token
        .on('mousedown',  function (e) {
          if (_self._disabled || _self._readonly) return false
          _self.preventDeactivation = true
        })
        .on('click',    function (e) {
          if (_self._disabled || _self._readonly) return false
          _self.preventDeactivation = false

          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            return _self.toggle( $token )
          }

          _self.activate( $token, e.shiftKey, e.shiftKey )
        })
        .on('dblclick', function (e) {
          if (_self._disabled || _self._readonly || !_self.options.allowEditing ) return false
          _self.edit( $token )
        })

      $closeButton
          .on('click',  $.proxy(this.remove, this))

      // Trigger createdtoken event on the original field
      // indicating that the token is now in the DOM
      this.$element.trigger($.Event('tokenfield:createdtoken', {
        attrs: attrs,
        relatedTarget: $token.get(0)
      }))

      // Trigger change event on the original field
      if (triggerChange) {
        this.$element.val( this.getTokensList() ).trigger( $.Event('change', { initiator: 'tokenfield' }) )
      }

      // Update tokenfield dimensions
      var _self = this
      setTimeout(function () {
        _self.update()
      }, 0)

      // Return original element
      return this.$element.get(0)
    }

  , setTokens: function (tokens, add, triggerChange) {
      if (!add) this.$wrapper.find('.token').remove()

      if (!tokens) return

      if (typeof triggerChange === 'undefined') {
          triggerChange = true
      }

      if (typeof tokens === 'string') {
        if (this._delimiters.length) {
          // Split based on delimiters
          tokens = tokens.split( new RegExp( '[' + this._delimiters.join('') + ']' ) )
        } else {
          tokens = [tokens];
        }
      }

      var _self = this
      $.each(tokens, function (i, attrs) {
        _self.createToken(attrs, triggerChange)
      })

      return this.$element.get(0)
    }

  , getTokenData: function($token) {
      var data = $token.map(function() {
        var $token = $(this);
        return $token.data('attrs')
      }).get();

      if (data.length == 1) {
        data = data[0];
      }

      return data;
    }

  , getTokens: function(active) {
      var self = this
        , tokens = []
        , activeClass = active ? '.active' : '' // get active tokens only
      this.$wrapper.find( '.token' + activeClass ).each( function() {
        tokens.push( self.getTokenData( $(this) ) )
      })
      return tokens
  }

  , getTokensList: function(delimiter, beautify, active) {
      delimiter = delimiter || this._firstDelimiter
      beautify = ( typeof beautify !== 'undefined' && beautify !== null ) ? beautify : this.options.beautify

      var separator = delimiter + ( beautify && delimiter !== ' ' ? ' ' : '')
      return $.map( this.getTokens(active), function (token) {
        return token.value
      }).join(separator)
  }

  , getInput: function() {
    return this.$input.val()
  }
      
  , setInput: function (val) {
      if (this.$input.hasClass('tt-input')) {
          // Typeahead acts weird when simply setting input value to empty,
          // so we set the query to empty instead
          this.$input.typeahead('val', val)
      } else {
          this.$input.val(val)
      }
  }

  , listen: function () {
      var _self = this

      this.$element
        .on('change',   $.proxy(this.change, this))

      this.$wrapper
        .on('mousedown',$.proxy(this.focusInput, this))

      this.$input
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('paste',    $.proxy(this.paste, this))
        .on('keydown',  $.proxy(this.keydown, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      this.$copyHelper
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keydown',  $.proxy(this.keydown, this))
        .on('keyup',    $.proxy(this.keyup, this))

      // Secondary listeners for input width calculation
      this.$input
        .on('keypress', $.proxy(this.update, this))
        .on('keyup',    $.proxy(this.update, this))

      this.$input
        .on('autocompletecreate', function() {
          // Set minimum autocomplete menu width
          var $_menuElement = $(this).data('ui-autocomplete').menu.element

          var minWidth = _self.$wrapper.outerWidth() -
              parseInt( $_menuElement.css('border-left-width'), 10 ) -
              parseInt( $_menuElement.css('border-right-width'), 10 )

          $_menuElement.css( 'min-width', minWidth + 'px' )
        })
        .on('autocompleteselect', function (e, ui) {
          if (_self.createToken( ui.item )) {
            _self.$input.val('')
            if (_self.$input.data( 'edit' )) {
              _self.unedit(true)
            }
          }
          return false
        })
        .on('typeahead:selected typeahead:autocompleted', function (e, datum, dataset) {
          // Create token
          if (_self.createToken( datum )) {
            _self.$input.typeahead('val', '')
            if (_self.$input.data( 'edit' )) {
              _self.unedit(true)
            }
          }
        })

      // Listen to window resize
      $(window).on('resize', $.proxy(this.update, this ))

    }

  , keydown: function (e) {

      if (!this.focused) return

      var _self = this

      switch(e.keyCode) {
        case 8: // backspace
          if (!this.$input.is(document.activeElement)) break
          this.lastInputValue = this.$input.val()
          break

        case 37: // left arrow
          leftRight( this.textDirection === 'rtl' ? 'next': 'prev' )
          break

        case 38: // up arrow
          upDown('prev')
          break

        case 39: // right arrow
          leftRight( this.textDirection === 'rtl' ? 'prev': 'next' )
          break

        case 40: // down arrow
          upDown('next')
          break

        case 65: // a (to handle ctrl + a)
          if (this.$input.val().length > 0 || !(e.ctrlKey || e.metaKey)) break
          this.activateAll()
          e.preventDefault()
          break

        case 9: // tab
        case 13: // enter

          // We will handle creating tokens from autocomplete in autocomplete events
          if (this.$input.data('ui-autocomplete') && this.$input.data('ui-autocomplete').menu.element.find("li:has(a.ui-state-focus), li.ui-state-focus").length) break

          // We will handle creating tokens from typeahead in typeahead events
          if (this.$input.hasClass('tt-input') && this.$wrapper.find('.tt-cursor').length ) break
          if (this.$input.hasClass('tt-input') && this.$wrapper.find('.tt-hint').val() && this.$wrapper.find('.tt-hint').val().length) break

          // Create token
          if (this.$input.is(document.activeElement) && this.$input.val().length || this.$input.data('edit')) {
            return this.createTokensFromInput(e, this.$input.data('edit'));
          }

          // Edit token
          if (e.keyCode === 13) {
            if (!this.$copyHelper.is(document.activeElement) || this.$wrapper.find('.token.active').length !== 1) break
            if (!_self.options.allowEditing) break
            this.edit( this.$wrapper.find('.token.active') )
          }
      }

      function leftRight(direction) {
        if (_self.$input.is(document.activeElement)) {
          if (_self.$input.val().length > 0) return

          direction += 'All'
          var $token = _self.$input.hasClass('tt-input') ? _self.$input.parent()[direction]('.token:first') : _self.$input[direction]('.token:first')
          if (!$token.length) return

          _self.preventInputFocus = true
          _self.preventDeactivation = true

          _self.activate( $token )
          e.preventDefault()

        } else {
          _self[direction]( e.shiftKey )
          e.preventDefault()
        }
      }

      function upDown(direction) {
        if (!e.shiftKey) return

        if (_self.$input.is(document.activeElement)) {
          if (_self.$input.val().length > 0) return

          var $token = _self.$input.hasClass('tt-input') ? _self.$input.parent()[direction + 'All']('.token:first') : _self.$input[direction + 'All']('.token:first')
          if (!$token.length) return

          _self.activate( $token )
        }

        var opposite = direction === 'prev' ? 'next' : 'prev'
          , position = direction === 'prev' ? 'first' : 'last'

        _self.$firstActiveToken[opposite + 'All']('.token').each(function() {
          _self.deactivate( $(this) )
        })

        _self.activate( _self.$wrapper.find('.token:' + position), true, true )
        e.preventDefault()
      }

      this.lastKeyDown = e.keyCode
    }

  , keypress: function(e) {

      // Comma
      if ($.inArray( e.which, this._triggerKeys) !== -1 && this.$input.is(document.activeElement)) {
        if (this.$input.val()) {
          this.createTokensFromInput(e)
        }
        return false;
      }
    }

  , keyup: function (e) {
      this.preventInputFocus = false

      if (!this.focused) return

      switch(e.keyCode) {
        case 8: // backspace
          if (this.$input.is(document.activeElement)) {
            if (this.$input.val().length || this.lastInputValue.length && this.lastKeyDown === 8) break

            this.preventDeactivation = true
            var $prevToken = this.$input.hasClass('tt-input') ? this.$input.parent().prevAll('.token:first') : this.$input.prevAll('.token:first')

            if (!$prevToken.length) break

            this.activate( $prevToken )
          } else {
            this.remove(e)
          }
          break

        case 46: // delete
          this.remove(e, 'next')
          break
      }
      this.lastKeyUp = e.keyCode
    }

  , focus: function (e) {
      this.focused = true
      this.$wrapper.addClass('focus')

      if (this.$input.is(document.activeElement)) {
        this.$wrapper.find('.active').removeClass('active')
        this.$firstActiveToken = null

        if (this.options.showAutocompleteOnFocus) {
          this.search()
        }
      }
    }

  , blur: function (e) {

      this.focused = false
      this.$wrapper.removeClass('focus')

      if (!this.preventDeactivation && !this.$element.is(document.activeElement)) {
        this.$wrapper.find('.active').removeClass('active')
        this.$firstActiveToken = null
      }

      if (!this.preventCreateTokens && (this.$input.data('edit') && !this.$input.is(document.activeElement) || this.options.createTokensOnBlur )) {
        this.createTokensFromInput(e)
      }

      this.preventDeactivation = false
      this.preventCreateTokens = false
    }

  , paste: function (e) {
      var _self = this

      // Add tokens to existing ones
      if (_self.options.allowPasting) {
        setTimeout(function () {
          _self.createTokensFromInput(e)
        }, 1)
      }
    }

  , change: function (e) {
      if ( e.initiator === 'tokenfield' ) return // Prevent loops

      this.setTokens( this.$element.val() )
    }

  , createTokensFromInput: function (e, focus) {
      if (this.$input.val().length < this.options.minLength)
        return // No input, simply return

      var tokensBefore = this.getTokensList()
      this.setTokens( this.$input.val(), true )

      if (tokensBefore == this.getTokensList() && this.$input.val().length)
        return false // No tokens were added, do nothing (prevent form submit)

      this.setInput('')

      if (this.$input.data( 'edit' )) {
        this.unedit(focus)
      }

      return false // Prevent form being submitted
    }

  , next: function (add) {
      if (add) {
        var $firstActiveToken = this.$wrapper.find('.active:first')
          , deactivate = $firstActiveToken && this.$firstActiveToken ? $firstActiveToken.index() < this.$firstActiveToken.index() : false

        if (deactivate) return this.deactivate( $firstActiveToken )
      }

      var $lastActiveToken = this.$wrapper.find('.active:last')
        , $nextToken = $lastActiveToken.nextAll('.token:first')

      if (!$nextToken.length) {
        this.$input.focus()
        return
      }

      this.activate($nextToken, add)
    }

  , prev: function (add) {

      if (add) {
        var $lastActiveToken = this.$wrapper.find('.active:last')
          , deactivate = $lastActiveToken && this.$firstActiveToken ? $lastActiveToken.index() > this.$firstActiveToken.index() : false

        if (deactivate) return this.deactivate( $lastActiveToken )
      }

      var $firstActiveToken = this.$wrapper.find('.active:first')
        , $prevToken = $firstActiveToken.prevAll('.token:first')

      if (!$prevToken.length) {
        $prevToken = this.$wrapper.find('.token:first')
      }

      if (!$prevToken.length && !add) {
        this.$input.focus()
        return
      }

      this.activate( $prevToken, add )
    }

  , activate: function ($token, add, multi, remember) {

      if (!$token) return

      if (typeof remember === 'undefined') var remember = true

      if (multi) var add = true

      this.$copyHelper.focus()

      if (!add) {
        this.$wrapper.find('.active').removeClass('active')
        if (remember) {
          this.$firstActiveToken = $token
        } else {
          delete this.$firstActiveToken
        }
      }

      if (multi && this.$firstActiveToken) {
        // Determine first active token and the current tokens indicies
        // Account for the 1 hidden textarea by subtracting 1 from both
        var i = this.$firstActiveToken.index() - 2
          , a = $token.index() - 2
          , _self = this

        this.$wrapper.find('.token').slice( Math.min(i, a) + 1, Math.max(i, a) ).each( function() {
          _self.activate( $(this), true )
        })
      }

      $token.addClass('active')
      this.$copyHelper.val( this.getTokensList( null, null, true ) ).select()
    }

  , activateAll: function() {
      var _self = this

      this.$wrapper.find('.token').each( function (i) {
        _self.activate($(this), i !== 0, false, false)
      })
    }

  , deactivate: function($token) {
      if (!$token) return

      $token.removeClass('active')
      this.$copyHelper.val( this.getTokensList( null, null, true ) ).select()
    }

  , toggle: function($token) {
      if (!$token) return

      $token.toggleClass('active')
      this.$copyHelper.val( this.getTokensList( null, null, true ) ).select()
    }

  , edit: function ($token) {
      if (!$token) return

      var attrs = $token.data('attrs')

      // Allow changing input value before editing
      var options = { attrs: attrs, relatedTarget: $token.get(0) }
      var editEvent = $.Event('tokenfield:edittoken', options)
      this.$element.trigger( editEvent )

      // Edit event can be cancelled if default is prevented
      if (editEvent.isDefaultPrevented()) return

      $token.find('.token-label').text(attrs.value)
      var tokenWidth = $token.outerWidth()

      var $_input = this.$input.hasClass('tt-input') ? this.$input.parent() : this.$input

      $token.replaceWith( $_input )

      this.preventCreateTokens = true

      this.$input.val( attrs.value )
                .select()
                .data( 'edit', true )
                .width( tokenWidth )

      this.update();

      // Indicate that token is now being edited, and is replaced with an input field in the DOM
      this.$element.trigger($.Event('tokenfield:editedtoken', options ))
    }

  , unedit: function (focus) {
      var $_input = this.$input.hasClass('tt-input') ? this.$input.parent() : this.$input
      $_input.appendTo( this.$wrapper )

      this.$input.data('edit', false)
      this.$mirror.text('')

      this.update()

      // Because moving the input element around in DOM
      // will cause it to lose focus, we provide an option
      // to re-focus the input after appending it to the wrapper
      if (focus) {
        var _self = this
        setTimeout(function () {
          _self.$input.focus()
        }, 1)
      }
    }

  , remove: function (e, direction) {
      if (this.$input.is(document.activeElement) || this._disabled || this._readonly) return

      var $token = (e.type === 'click') ? $(e.target).closest('.token') : this.$wrapper.find('.token.active')

      if (e.type !== 'click') {
        if (!direction) var direction = 'prev'
        this[direction]()

        // Was it the first token?
        if (direction === 'prev') var firstToken = $token.first().prevAll('.token:first').length === 0
      }

      // Prepare events and their options
      var options = { attrs: this.getTokenData( $token ), relatedTarget: $token.get(0) }
        , removeEvent = $.Event('tokenfield:removetoken', options)

      this.$element.trigger(removeEvent);

      // Remove event can be intercepted and cancelled
      if (removeEvent.isDefaultPrevented()) return

      var removedEvent = $.Event('tokenfield:removedtoken', options)
        , changeEvent = $.Event('change', { initiator: 'tokenfield' })

      // Remove token from DOM
      $token.remove()

      // Trigger events
      this.$element.val( this.getTokensList() ).trigger( removedEvent ).trigger( changeEvent )

      // Focus, when necessary:
      // When there are no more tokens, or if this was the first token
      // and it was removed with backspace or it was clicked on
      if (!this.$wrapper.find('.token').length || e.type === 'click' || firstToken) this.$input.focus()

      // Adjust input width
      this.$input.css('width', this.options.minWidth + 'px')
      this.update()

      // Cancel original event handlers
      e.preventDefault()
      e.stopPropagation()
    }

    /**
     * Update tokenfield dimensions
     */
  , update: function (e) {
      var value = this.$input.val()
        , inputPaddingLeft = parseInt(this.$input.css('padding-left'), 10)
        , inputPaddingRight = parseInt(this.$input.css('padding-right'), 10)
        , inputPadding = inputPaddingLeft + inputPaddingRight

      if (this.$input.data('edit')) {

        if (!value) {
          value = this.$input.prop("placeholder")
        }
        if (value === this.$mirror.text()) return

        this.$mirror.text(value)

        var mirrorWidth = this.$mirror.width() + 10;
        if ( mirrorWidth > this.$wrapper.width() ) {
          return this.$input.width( this.$wrapper.width() )
        }

        this.$input.width( mirrorWidth )
      }
      else {
        //temporary reset width to minimal value to get proper results
        this.$input.width(this.options.minWidth);
        
        var w = (this.textDirection === 'rtl')
              ? this.$input.offset().left + this.$input.outerWidth() - this.$wrapper.offset().left - parseInt(this.$wrapper.css('padding-left'), 10) - inputPadding - 1
              : this.$wrapper.offset().left + this.$wrapper.width() + parseInt(this.$wrapper.css('padding-left'), 10) - this.$input.offset().left - inputPadding;
        //
        // some usecases pre-render widget before attaching to DOM,
        // dimensions returned by jquery will be NaN -> we default to 100%
        // so placeholder won't be cut off.
        isNaN(w) ? this.$input.width('100%') : this.$input.width(w);
      }
    }

  , focusInput: function (e) {
      if ( $(e.target).closest('.token').length || $(e.target).closest('.token-input').length || $(e.target).closest('.tt-dropdown-menu').length ) return
      // Focus only after the current call stack has cleared,
      // otherwise has no effect.
      // Reason: mousedown is too early - input will lose focus
      // after mousedown. However, since the input may be moved
      // in DOM, there may be no click or mouseup event triggered.
      var _self = this
      setTimeout(function() {
        _self.$input.focus()
      }, 0)
    }

  , search: function () {
      if ( this.$input.data('ui-autocomplete') ) {
        this.$input.autocomplete('search')
      }
    }

  , disable: function () {
      this.setProperty('disabled', true);
    }

  , enable: function () {
      this.setProperty('disabled', false);
    }

  , readonly: function () {
      this.setProperty('readonly', true);
    }

  , writeable: function () {
      this.setProperty('readonly', false);
    }

  , setProperty: function(property, value) {
      this['_' + property] = value;
      this.$input.prop(property, value);
      this.$element.prop(property, value);
      this.$wrapper[ value ? 'addClass' : 'removeClass' ](property);
  }

  , destroy: function() {
      // Set field value
      this.$element.val( this.getTokensList() );
      // Restore styles and properties
      this.$element.css( this.$element.data('original-styles') );
      this.$element.prop( 'tabindex', this.$element.data('original-tabindex') );

      // Re-route tokenfield label to original input
      var $label = $( 'label[for="' + this.$input.prop('id') + '"]' )
      if ( $label.length ) {
        $label.prop( 'for', this.$element.prop('id') )
      }

      // Move original element outside of tokenfield wrapper
      this.$element.insertBefore( this.$wrapper );

      // Remove tokenfield-related data
      this.$element.removeData('original-styles')
                   .removeData('original-tabindex')
                   .removeData('bs.tokenfield');

      // Remove tokenfield from DOM
      this.$wrapper.remove();
      this.$mirror.remove();

      var $_element = this.$element;

      return $_element;
  }

  }


 /* TOKENFIELD PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.tokenfield

  $.fn.tokenfield = function (option, param) {
    var value
      , args = []

    Array.prototype.push.apply( args, arguments );

    var elements = this.each(function () {
      var $this = $(this)
        , data = $this.data('bs.tokenfield')
        , options = typeof option == 'object' && option

      if (typeof option === 'string' && data && data[option]) {
        args.shift()
        value = data[option].apply(data, args)
      } else {
        if (!data && typeof option !== 'string' && !param) {
          $this.data('bs.tokenfield', (data = new Tokenfield(this, options)))
          $this.trigger('tokenfield:initialize')
        }
      }
    })

    return typeof value !== 'undefined' ? value : elements;
  }

  $.fn.tokenfield.defaults = {
    minWidth: 60,
    minLength: 0,
    html: true,
    allowEditing: true,
    allowPasting: true,
    limit: 0,
    autocomplete: {},
    typeahead: {},
    showAutocompleteOnFocus: false,
    createTokensOnBlur: false,
    delimiter: ',',
    beautify: true,
    inputType: 'text'
  }

  $.fn.tokenfield.Constructor = Tokenfield


 /* TOKENFIELD NO CONFLICT
  * ================== */

  $.fn.tokenfield.noConflict = function () {
    $.fn.tokenfield = old
    return this
  }

  return Tokenfield;

}));

/**
 *  jquery.validator.js - Custom Form Validation JS class
 *
 *  Client-side form validation class
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *
 */
;(function($,window) {


	'use strict';
	var validator = function(frm) {


		//initialize values
		this.errMsg = {
			'Anything'		: 'Please enter something.',
			'file' 			: 'Please select a file.',
			'Number' 		: 'Please enter a number.',
			'Integer' 		: 'Please enter an integer.',
			'Email Address' : 'Please enter an email address.',
			'Zip Code'		: 'Please enter a valid 5-digit or 9-digit US zip code.',
			'Phone Number'	: 'Please enter a valid 10-digit phone number.',
			'US State'		: 'Please enter a valid US State abbreviation.',
			'Credit Card'	: 'Please enter a valid credit card number.',
			'IPV4'			: 'Please enter a valid IPV4 IP address',
			'base64'		: 'Please enter a valid base64 encoded string.',
			'SSN'			: 'Please enter a valid social security number.',
			'color'			: 'Please emter a valid 6-digit hex color code or color keyword.',
			'checkbox'		: 'Please check the box',
			'radio'			: 'Please check one of the options.',
			'select'		: 'Please select a value from the dropdown.',
			'min>='			: 'Field value must be at least [val] characters long.',
			'max<='			: 'Field value must be at most [val] characters long.',
			'min_val>='		: 'Field value must be >= [val].',
			'max_val<='		: 'Field value must be <= [val].',
			'exact=='		: 'Field value must be exactly [val] characters long.',
			'between=='		: 'Field value must be between [val]',
			'date_gt_'		: 'Date must be after [val].',
			'date_lt_'		: 'Date must be before [val].',
			'date_eq_'		: 'Date must match [val]',
			'datetime_gt_'	: 'Date and Time must be after [val].',
			'datetime_lt_'	: 'Date and Time must be before [val].',
			'datetime_eq_'	: 'Date and Time must match [val]',
			'field=='		: 'Field must match [val]',
			'default'		: 'Please correct this field.'
		};

		this.regExp = {
			'Anything'		: /^.+$/,
			'file'			: /^.+$/,
			'Number' 		: /^[0-9.]+$/,
			'Integer'		: /^[0-9]+$/,
			'Email Address' : /^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+.)+([a-zA-Z0-9]{2,4})+$/,
			'Zip Code' 		: /^\d{5}([\-]\d{4})?$/,
			'Phone Number'	: /^\(?(\d{3})\)?[\- ]?(\d{3})[\- ]?(\d{4})$/,
			'IPV4'			: /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/,
			'base64'		: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
			'SSN'			: /^\d{3}-\d{2}-\d{4}$/,
			'color'			: /^#[0-9A-F]{6}$/i

		};

		//this.frm = frm;
		this.$frm = frm;
		this.$elms = this.$frm.find('[data-validType]');
		this.errorState = false;
		this.errorClass = 'has-error';
		this.validClass = 'has-success';


		//declare vars
		var self = this;
		var $frm = this.$frm;
		var elm_valid;
		var checkedFields = [];

		// declare functions
		this.fn = {

			/**  **  **  **  **  **  **  **  **  **
			 *   validateForm
			 *
			 *  Iterates through all the form
			 *  elements with a data-validType defined
			 *
			 **  **  **  **  **  **  **  **  **  **/
			validateForm : function() {
				// reset errorState
				self.errorState = false;
				$.noty.closeAll()

				$.each(self.$elms, function($i,elm) {
					console.log('validating ' + $(elm).attr('name'));
					if ($.inArray( $(elm).attr('name'), checkedFields) === -1) {
						elm_valid = self.fn.validateField( $(elm) );
						if ( elm_valid ) { // field is valid
							console.log('valid ' + $(elm).attr('name'));
							self.fn.removeError( $(elm) );
						}
					}
					else {
						console.log($(elm).attr('name') + ' has been checked already.');
					}
				});

				if (self.errorState === true) {
					var n = noty( {
						text: '<strong>Error </strong> Please correct the errors before continuing.',
						layout: 'top',
						type: 'error',
						//timeout: 5000
					});
				}
			}, //end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   validateField
			 *
			 *  Checks element value against
			 *  valid pattern and determines
			 *  if it validates.
			 *
			 **  **  **  **  **  **  **  **  **  **/
			validateField : function($elm) {

				var cats  = $elm.attr('data-validType').split(', ');
				var type = $elm.attr('type');
				var elmValid = false;
				var val = $.isArray( $elm.val() ) ? $elm.val() : !! $elm.val() ? $elm.val().trim() : '';
				var required = $elm.attr('required') != 'required' ? false : true;

				// check some conditions before validating input: if element is disabled or blank and not required, then return valid
				if ( $elm.prop('disabled') || $elm.hasClass('disabled') || ( !required && !val ) ) {
					return true;
				}

				$.each(cats, function(i,cat) {
					console.log('Testing element data-validType=' + cat);
					switch (cat) {

						case 'Anything' :
						case 'file' :
						case 'Number' :
						case 'Integer' :
						case 'Email Address' :
						case 'Zip Code' :
						case 'Phone Number' :
						case 'IPV4' :
						case 'base64' :
						case 'SSN' :
							elmValid = Boolean( val.match( self.regExp[cat] ) || ( !required && !val ) );
						break;

						case 'color' :
							var colorNames = [
								// Colors start with A
								'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
								// B
								'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood',
								// C
								'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
								// D
								'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta',
								'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
								'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray',
								'dimgrey', 'dodgerblue',
								// F
								'firebrick', 'floralwhite', 'forestgreen', 'fuchsia',
								// G
								'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
								// H
								'honeydew', 'hotpink',
								// I
								'indianred', 'indigo', 'ivory',
								// K
								'khaki',
								// L
								'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
								'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen',
								'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen',
								'linen',
								// M
								'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
								'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
								'mistyrose', 'moccasin',
								// N
								'navajowhite', 'navy',
								// O
								'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid',
								// P
								'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink',
								'plum', 'powderblue', 'purple',
								// R
								'red', 'rosybrown', 'royalblue',
								// S
								'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue',
								'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue',
								// T
								'tan', 'teal', 'thistle', 'tomato', 'transparent', 'turquoise',
								// V
								'violet',
								// W
								'wheat', 'white', 'whitesmoke',
								// Y
								'yellow', 'yellowgreen'
							];

							elmValid = Boolean( val.match( self.regExp[cat] ) || $.inArray(val,colorNames) != -1 || ( !required && !val ) );
						break;

						case 'Credit Card' :
							if (/[^0-9-\s]+/.test(val)) {
								return false;
							}
							val = val.replace(/\D/g, '');

							// Validate the card number based on prefix (IIN ranges) and length
							var cards = {
								AMERICAN_EXPRESS: {
									length: [15],
									prefix: ['34', '37']
								},
								DINERS_CLUB: {
									length: [14],
									prefix: ['300', '301', '302', '303', '304', '305', '36']
								},
								DINERS_CLUB_US: {
									length: [16],
									prefix: ['54', '55']
								},
								DISCOVER: {
									length: [16],
									prefix: ['6011', '622126', '622127', '622128', '622129', '62213',
											 '62214', '62215', '62216', '62217', '62218', '62219',
											 '6222', '6223', '6224', '6225', '6226', '6227', '6228',
											 '62290', '62291', '622920', '622921', '622922', '622923',
											 '622924', '622925', '644', '645', '646', '647', '648',
											 '649', '65']
								},
								JCB: {
									length: [16],
									prefix: ['3528', '3529', '353', '354', '355', '356', '357', '358']
								},
								LASER: {
									length: [16, 17, 18, 19],
									prefix: ['6304', '6706', '6771', '6709']
								},
								MAESTRO: {
									length: [12, 13, 14, 15, 16, 17, 18, 19],
									prefix: ['5018', '5020', '5038', '6304', '6759', '6761', '6762', '6763', '6764', '6765', '6766']
								},
								MASTERCARD: {
									length: [16],
									prefix: ['51', '52', '53', '54', '55']
								},
								SOLO: {
									length: [16, 18, 19],
									prefix: ['6334', '6767']
								},
								UNIONPAY: {
									length: [16, 17, 18, 19],
									prefix: ['622126', '622127', '622128', '622129', '62213', '62214',
											 '62215', '62216', '62217', '62218', '62219', '6222', '6223',
											 '6224', '6225', '6226', '6227', '6228', '62290', '62291',
											 '622920', '622921', '622922', '622923', '622924', '622925']
								},
								VISA: {
									length: [16],
									prefix: ['4']
								}
							};

							var type, i;
							loop1:
							for (type in cards) {
								loop2:
								for (i in cards[type].prefix) {
									if (value.substr(0, cards[type].prefix[i].length) === cards[type].prefix[i]     // Check the prefix
										&& $.inArray(value.length, cards[type].length) !== -1)                      // and length
									{
										elmValid = true;
										break loop1;
									}
								}
							}

						break;


						case 'US State'	:
							var stateAbbrevs = ["AL","AK","AS","AZ","AR",
												"CA","CO","CT","DE","DC",
												"FM","FL","GA","GU","HI",
												"ID","IL","IN","IA","KS",
												"KY","LA","ME","MH","MD",
												"MA","MI","MN","MS","MO",
												"MT","NE","NV","NH","NJ",
												"NM","NY","NC","ND","MP",
												"OH","OK","OR","PW","PA",
												"PR","RI","SC","SD","TN",
												"TX","UT","VT","VI","VA",
												"WA","WV","WI","WY"];
							elmValid = Boolean( $.inArray(val.toUpperCase(), stateAbbrevs) !== -1 );
						break;

						case 'checkbox' :
							var min = Number( $elm.attr('min') );
							var max = Number( $elm.attr('max') );
							var numSelected = Number( $frm.find('input[name="' + $elm.attr('name') + '"]').filter(':checked').length );
							if (!min && !max) {
								elmValid = Boolean( !!numSelected || !required );
								self.errMsg.checkbox = 'Please check the box.';
							} else {

								console.log
								console.log('selected ' + numSelected);
								if (min > 0 && max > 0) {
									if ( min==max ) {
										elmValid = Boolean( numSelected === min );
										self.errMsg.checkbox = (min == 1) ? 'Please check an option.' : 'Please check exactly ' + min + ' options.';
									}
									else {
										elmValid = Boolean( numSelected >= min && numSelected <= max);
										self.errMsg.checkbox = 'Please check ' + min + '-' + max + ' options.';
									}
								} else if (min > 0) {
									elmValid = Boolean( numSelected >= min );
									self.errMsg.checkbox = 'Please check at least ' + min + ' options.';
								} else if (max > 0) {
									elmValid = Boolean( numSelected <= max );
									self.errMsg.checkbox = 'Please check at most ' + max + ' options.';
								}
							}

						break;

						case 'radio' :
							var name = $elm.attr('name');
							elmValid = Boolean(!required || $frm.find('[name='+name+']:checked').length > 0 );
						break;

						case 'select' :
							var min = Number( $elm.attr('min') );
							var max = Number( $elm.attr('max') );

							if (!min && !max) {
								elmValid = Boolean(!required || Number($elm.prop('selectedIndex') ) );
								self.errMsg.select = 'Please select a value from the dropdown.';
							}
							else {
								var numSelected = $elm.find('option').filter(':selected').length;
								console.log('selected ' + numSelected);
								if (min > 0 && max > 0) {
									if ( min==max ) {
										elmValid = Boolean( numSelected === min );
										self.errMsg.select = (min == 1) ? 'Please select a value from the dropdown.' : 'Please select exactly ' + min + ' values from the dropdown';
									}
									else {
										elmValid = Boolean( numSelected >= min && numSelected <= max);
										self.errMsg.select = 'Please select ' + min + '-' + max + ' values from the dropdown';
									}
								} else if (min > 0) {
									elmValid = Boolean( numSelected >= min );
									self.errMsg.select = 'Please select at least ' + min + ' values from the dropdown';
								} else if (max > 0) {
									elmValid = Boolean( numSelected <= max );
									self.errMsg.select = 'Please select at most ' + max + ' values from the dropdown';
								}
							}

						break;

						default :

							// minimum characters.
							if (cat.indexOf('min>=') != -1) {
								var min_chars = Number(cat.replace('min>=',''));
								elmValid = Boolean(val.length >= min_chars);
							}

							// maxiumum characters.
							else if (cat.indexOf('max<=') != -1) {
								var max_chars = Number(cat.replace('max<=',''));
								elmValid = required ? Boolean(val.length <= max_chars && val.length > 0) : Boolean(val.length <= max_chars);
							}

							// minimum value.
							else if (cat.indexOf('min_val>=') != -1) {
								var min_val = Number(cat.replace('min_val>=',''));
								elmValid = Boolean( Number(val ) >= min_val);
							}

							// maximum value.
							else if (cat.indexOf('max_val<=') != -1) {
								var max_val = Number(cat.replace('max_val<=',''));
								elmValid = required ? Boolean( Number(val) <= max_val && val.length > 0) : Boolean( Number(val) <= max_val);
							}

							// exact number of characters.
							else if (cat.indexOf('exact==') != -1) {
								var ex_chars = Number(cat.replace('exact==','') );
								elmValid = Boolean(val.length == ex_chars);
							}

							// between two values
							else if (cat.indexOf('between==') != -1) {
								var lo_hi = cat.replace('between==','');
								var lo = Number( lo_hi.split(',')[0] );
								var hi = Number( lo_hi.split(',')[1] );
								var $val = Number(val);
								elmValid = Boolean( $val >= lo && $val <= hi);
							}

							// field must be equal/greater/less than date.
							else if (cat.indexOf('date_gt_') != -1 || cat.indexOf('date_lt_') != -1 || cat.indexOf('date_eq_') != -1 ) {
								var yr,mo,da,hr,mn,date2midnight,date1midnight,date1,date1_val;
								var date2 = cat.replace('date_gt_','').replace('date_lt_','').replace('date_eq_','');
								console.log(date2);
								var date2_val = ( $frm.find(date2).length > 0 ) ? $frm.find(date2).val().trim() : date2.trim();

								switch(date2_val) {
									case 'today' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = today.getDate();
										hr = "00";
										mn = "00";
									break;

									case 'yesterday' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()-1);
										hr = "00";
										mn = "00";
									break;

									case 'tomorrow' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()+1);
										hr = "00";
										mn = "00";
									break;

									default :
										yr = date2_val.substr(0,4);
										mo = Number(date2_val.substr(5,2)-1);
										da = date2_val.substr(8,2);
										hr = "00";
										mn = "00";
									break;
								}

								// Calculate date2 - YYYY-MM-DD HH:II
								date2 = Date.UTC(yr,mo,da,hr,mn);
								console.log(date2midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);

								date1_val = val;
								// Calculate date1
								yr = date1_val.substr(0,4);
								mo = Number(date1_val.substr(5,2)-1);
								da = date1_val.substr(8,2);
								hr = "00";
								mn = "00";
								date1 = Date.UTC(yr,mo,da,hr,mn);
								console.log(date1midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);


								var date2_required = ( $frm.find(date2).length == 0 || $frm.find(date2).attr('required') != 'required' ) ? false : true;
								if (cat.indexOf('_gt_') !== -1 ) {
									// >
									elmValid = Boolean(date1 > date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else if (cat.indexOf('_lt_') !== -1 ) {
									// <
									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else {
									// ==

									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) );
								}

								//elmValid = $is_gt ? Boolean(date1 > date2 || ( $frm.find(date2).attr('required') != 'required' && String(val.trim()) != '' && String( date2_val.trim() ) == '') ) : Boolean(date2 > date1 || ( $frm.find(date2).attr('required') != 'required' && String( val.trim() ) != '' && String( date2_val.trim() ) == '') );
							}

							// field must be equal/greater/less than date with time.
							else if (cat.indexOf('datetime_gt_') != -1 || cat.indexOf('datetime_lt_') != -1 || cat.indexOf('datetime_eq_') != -1 ) {
								var yr,mo,da,hr,mn,date2midnight,date1midnight,date1,date1_val;
								var date2 = cat.replace('datetime_gt_','').replace('datetime_lt_','').replace('datetime_eq_','');
								console.log(date2);
								var date2_val = ( $frm.find(date2).length > 0 ) ? $frm.find(date2).val().trim() : date2.trim();

								switch(date2_val) {
									case 'today' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = today.getDate();
										hr = today.getHours();
										mn = today.getMinutes();
									break;

									case 'yesterday' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()-1);
										hr = today.getHours();
										mn = today.getMinutes();
									break;

									case 'tomorrow' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()+1);
										hr = today.getHours();
										mn = today.getMinutes();
									break;

									default :
										yr = date2_val.substr(0,4);
										mo = Number(date2_val.substr(5,2)-1);
										da = date2_val.substr(8,2);
										hr = date2_val.substr(11,2);
										mn = date2_val.substr(14,2);
									break;
								}

								// Calculate date2 - YYYY-MM-DD HH:II
								date2 = Date.UTC(yr,mo,da,hr,mn);
								date2midnight = Date.UTC(yr,mo,da,0,0);
								console.log(date2midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);

								date1_val = val;
								// Calculate date1
								yr = date1_val.substr(0,4);
								mo = Number(date1_val.substr(5,2)-1);
								da = date1_val.substr(8,2);
								hr = date1_val.substr(11,2);
								mn = date1_val.substr(14,2);
								date1 = Date.UTC(yr,mo,da,hr,mn);
								date1midnight = Date.UTC(yr,mo,da,0,0)
								console.log(date1midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);


								var date2_required = ( $frm.find(date2).length == 0 || $frm.find(date2).attr('required') != 'required' ) ? false : true;
								if (cat.indexOf('_gt_') !== -1 ) {
									// >
									elmValid = Boolean(date1 > date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else if (cat.indexOf('_lt_') !== -1 ) {
									// <
									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else {
									// ==
									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) );
								}

								//elmValid = $is_gt ? Boolean(date1 > date2 || ( $frm.find(date2).attr('required') != 'required' && String(val.trim()) != '' && String( date2_val.trim() ) == '') ) : Boolean(date2 > date1 || ( $frm.find(date2).attr('required') != 'required' && String( val.trim() ) != '' && String( date2_val.trim() ) == '') );
							}

							// field must match other field.
							else if (cat.indexOf('field==') != -1) {
								var pw1_name = cat.replace('field==','');
								var $pw1 = $frm.find( pw1_name );
								elmValid = Boolean(val == $pw1.val() );
							}

							// must be in list.
							else {
								var patterns = cat.toLowerCase().split('|');
								elmValid = Boolean( $.inArray(val.toLowerCase(), patterns) !== -1 );
							}
						break;
					} // end switch

					// put this element in the checkedFields array so it won't be checked again this iteration.
					checkedFields.push( $elm.attr('name')  );

					// report error if necessary
					if (!elmValid) {
						self.fn.raiseError( $elm, cat );
						self.errorState = true;
						return false;
					}

				}); // end each

				return elmValid;
			}, // end fn


			/**  **  **  **  **  **  **  **  **  **
			 *   isArray
			 *  @obj - object to check
			 *
			 *  Determines if input object is
			 *  an array
			 **  **  **  **  **  **  **  **  **  **/
			isArray : function(obj) {
				return Boolean( obj.constructor.toString().indexOf("Array") !== -1 );
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   oc
			 *  @arrayOrArgs - object/argument list
			 *
			 *  Creates a single-dimensional array
			 *  from the input array/object/args
			 **  **  **  **  **  **  **  **  **  **/
			oc : function(arrayOrArgs) {
				var o = {};
				var a = ( self.fn.isArray(arrayOrArgs)) ? arrayOrArgs : arguments;
				var i;
				for(i=0;i<a.length;i++) {
					o[a[i]]='';
				}
				return o;
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   raiseError
			 *  @elm - Form Element
			 *
			 *  Raises an error message for an invalid
			 *  form element.
			 **  **  **  **  **  **  **  **  **  **/
			raiseError : function($elm,$cat) {
				var $err_msg, $search, $replace;
				var $elmid = $elm.attr('id');
				var $label = $("label[for='"+$elmid+"']").html();
				var val = $.isArray( $elm.val() ) ? $elm.val() : !! $elm.val() ? $elm.val().trim() : '';
				//var $cat = arguments[1] || $elm.attr('data-validType');
				var $err_index = -1;
				console.log($elm[0].nodeName + ' ' + $elm.attr('name') + ' invalid ');
				console.log($elm.closest('.form_element'));
				$elm.closest('.form_element').addClass( self.errorClass );
				$elm.psiblings('.form-control-feedback').addClass('glyphicon-remove').removeClass('glyphicon-ok').show();
				$.each( self.errMsg, function($i,$val) {
					if ($cat.indexOf($i) !== -1) {
						$err_index = $i;
					}
				});

				if ($err_index == -1) {
					$err_index = 'default';
				}
				$err_msg = ($elm.attr('required') == 'required' && !val && $cat != 'select' && $cat != 'file' && $cat != 'checkbox' && $cat != 'radio') ?
					'[' + $label + '] : ' + 'Please enter something.' :
					'[' + $label + '] : ' + self.errMsg[$err_index];
				$search = '[val]';
				$replace = $cat.replace($err_index,'');

				try {
					if ( $($replace).length > 0 ) {
						$replace = $("label[for='" + $replace.substr(1) + "']").html();
					}
				} catch(e) {
					console.warn('Validator Class : Exception Caught')
				}
				$err_msg = $err_msg.replace($search,$replace);

				/* var n = noty( {
					text: '<strong>Error </strong> ' + $err_msg,
					layout: 'top',
					type: 'error',
					//timeout: 5000
				});  */
				$elm.psiblings('.help-block').html( $err_msg.replace('[' + $label + '] : ','') ).fadeIn('fast');
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   removeError
			 *  @elm - Form Element
			 *
			 *  Removes an error message for an invalid
			 *  form element.
			 **  **  **  **  **  **  **  **  **  **/
			removeError : function($elm) {
				$elm.closest('.form_element').removeClass( self.errorClass )
				$elm.psiblings('.form-control-feedback').removeClass('glyphicon-remove');
				$elm.psiblings('.help-block').html('').hide();

				//add success class if not a disabled element.
				if (!( $elm.prop('disabled') || $elm.hasClass('disabled') ) ) {
					$elm.psiblings('.form-control-feedback').addClass('glyphicon-ok').show().end()
						.closest('.form_element').addClass( self.validClass );
				}
			} //end fn

		}; //end fns


		// perform the validation
		//$.noty.closeAll(); // close all notifications
		this.fn.validateForm();

	}; // end validator class

	window.validator = validator;

})($,window); // end closure

/**
 * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 * 
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2015 David Stutz
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * 
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2015 David Stutz
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
!function ($) {
    "use strict";// jshint ;_;

    if (typeof ko !== 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
        ko.bindingHandlers.multiselect = {
            after: ['options', 'value', 'selectedOptions'],

            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect(config);

                if (allBindings.has('options')) {
                    var options = allBindings.get('options');
                    if (ko.isObservable(options)) {
                        ko.computed({
                            read: function() {
                                options();
                                setTimeout(function() {
                                    var ms = $element.data('multiselect');
                                    if (ms)
                                        ms.updateOriginalOptions();//Not sure how beneficial this is.
                                    $element.multiselect('rebuild');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        });
                    }
                }

                //value and selectedOptions are two-way, so these will be triggered even by our own actions.
                //It needs some way to tell if they are triggered because of us or because of outside change.
                //It doesn't loop but it's a waste of processing.
                if (allBindings.has('value')) {
                    var value = allBindings.get('value');
                    if (ko.isObservable(value)) {
                        ko.computed({
                            read: function() {
                                value();
                                setTimeout(function() {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                //Switched from arrayChange subscription to general subscription using 'refresh'.
                //Not sure performance is any better using 'select' and 'deselect'.
                if (allBindings.has('selectedOptions')) {
                    var selectedOptions = allBindings.get('selectedOptions');
                    if (ko.isObservable(selectedOptions)) {
                        ko.computed({
                            read: function() {
                                selectedOptions();
                                setTimeout(function() {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    $element.multiselect('destroy');
                });
            },

            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect('setOptions', config);
                $element.multiselect('rebuild');
            }
        };
    }

    function forEach(array, callback) {
        for (var index = 0; index < array.length; ++index) {
            callback(array[index], index);
        }
    }

    /**
     * Constructor to create a new multiselect using the given select.
     *
     * @param {jQuery} select
     * @param {Object} options
     * @returns {Multiselect}
     */
    function Multiselect(select, options) {

        this.$select = $(select);
        
        // Placeholder via data attributes
        if (this.$select.attr("data-placeholder")) {
            options.nonSelectedText = this.$select.data("placeholder");
        }
        
        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));

        // Initialization.
        // We have to clone to create a new reference.
        this.originalOptions = this.$select.clone()[0].options;
        this.query = '';
        this.searchTimeout = null;
        this.lastToggledInput = null

        this.options.multiple = this.$select.attr('multiple') === "multiple";
        this.options.onChange = $.proxy(this.options.onChange, this);
        this.options.onDropdownShow = $.proxy(this.options.onDropdownShow, this);
        this.options.onDropdownHide = $.proxy(this.options.onDropdownHide, this);
        this.options.onDropdownShown = $.proxy(this.options.onDropdownShown, this);
        this.options.onDropdownHidden = $.proxy(this.options.onDropdownHidden, this);
        
        // Build select all if enabled.
        this.buildContainer();
        this.buildButton();
        this.buildDropdown();
        this.buildSelectAll();
        this.buildDropdownOptions();
        this.buildFilter();

        this.updateButtonText();
        this.updateSelectAll();

        if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
            this.disable();
        }
        
        this.$select.hide().after(this.$container);
    };

    Multiselect.prototype = {

        defaults: {
            /**
             * Default text function will either print 'None selected' in case no
             * option is selected or a list of the selected options up to a length
             * of 3 selected options.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {String}
             */
            buttonText: function(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else if (this.allSelectedText 
                            && options.length === $('option', $(select)).length 
                            && $('option', $(select)).length !== 1 
                            && this.multiple) {

                    if (this.selectAllNumber) {
                        return this.allSelectedText + ' (' + options.length + ')';
                    }
                    else {
                        return this.allSelectedText;
                    }
                }
                else if (options.length > this.numberDisplayed) {
                    return options.length + ' ' + this.nSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;
                    
                    options.each(function() {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    
                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Updates the title of the button similar to the buttonText function.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {@exp;selected@call;substr}
             */
            buttonTitle: function(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;
                    
                    options.each(function () {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Create a label.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionLabel: function(element){
                return $(element).attr('label') || $(element).text();
            },
            /**
             * Triggered on change of the multiselect.
             * 
             * Not triggered when selecting/deselecting options manually.
             * 
             * @param {jQuery} option
             * @param {Boolean} checked
             */
            onChange : function(option, checked) {

            },
            /**
             * Triggered when the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShow: function(event) {

            },
            /**
             * Triggered when the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHide: function(event) {

            },
            /**
             * Triggered after the dropdown is shown.
             * 
             * @param {jQuery} event
             */
            onDropdownShown: function(event) {
                
            },
            /**
             * Triggered after the dropdown is hidden.
             * 
             * @param {jQuery} event
             */
            onDropdownHidden: function(event) {
                
            },
            /**
             * Triggered on select all.
             */
            onSelectAll: function() {
                
            },
            enableHTML: false,
            buttonClass: 'btn btn-default',
            inheritClass: false,
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            dropRight: false,
            selectedClass: 'active',
            // Maximum height of the dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: false,
            checkboxName: false,
            includeSelectAllOption: false,
            includeSelectAllIfMoreThan: 0,
            selectAllText: ' Select all',
            selectAllValue: 'multiselect-all',
            selectAllName: false,
            selectAllNumber: true,
            enableFiltering: false,
            enableCaseInsensitiveFiltering: false,
            enableClickableOptGroups: false,
            filterPlaceholder: 'Search',
            // possible options: 'text', 'value', 'both'
            filterBehavior: 'text',
            includeFilterClearBtn: true,
            preventInputChangeEvent: false,
            nonSelectedText: 'None selected',
            nSelectedText: 'selected',
            allSelectedText: 'All selected',
            numberDisplayed: 3,
            disableIfEmpty: false,
            delimiterText: ', ',
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                li: '<li><a tabindex="0"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
            }
        },

        constructor: Multiselect,

        /**
         * Builds the container of the multiselect.
         */
        buildContainer: function() {
            this.$container = $(this.options.buttonContainer);
            this.$container.on('show.bs.dropdown', this.options.onDropdownShow);
            this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);
            this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);
            this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);
        },

        /**
         * Builds the button of the multiselect.
         */
        buildButton: function() {
            this.$button = $(this.options.templates.button).addClass(this.options.buttonClass);
            if (this.$select.attr('class') && this.options.inheritClass) {
                this.$button.addClass(this.$select.attr('class'));
            }
            // Adopt active state.
            if (this.$select.prop('disabled')) {
                this.disable();
            }
            else {
                this.enable();
            }

            // Manually add button width if set.
            if (this.options.buttonWidth && this.options.buttonWidth !== 'auto') {
                this.$button.css({
                    'width' : this.options.buttonWidth,
                    'overflow' : 'hidden',
                    'text-overflow' : 'ellipsis'
                });
                this.$container.css({
                    'width': this.options.buttonWidth
                });
            }

            // Keep the tab index from the select.
            var tabindex = this.$select.attr('tabindex');
            if (tabindex) {
                this.$button.attr('tabindex', tabindex);
            }

            this.$container.prepend(this.$button);
        },

        /**
         * Builds the ul representing the dropdown menu.
         */
        buildDropdown: function() {

            // Build ul.
            this.$ul = $(this.options.templates.ul);

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }

            // Set max height of dropdown menu to activate auto scrollbar.
            if (this.options.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.$ul.css({
                    'max-height': this.options.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }

            this.$container.append(this.$ul);
        },

        /**
         * Build the dropdown options and binds all nessecary events.
         * 
         * Uses createDivider and createOptionValue to create the necessary options.
         */
        buildDropdownOptions: function() {

            this.$select.children().each($.proxy(function(index, element) {

                var $element = $(element);
                // Support optgroups and options without a group simultaneously.
                var tag = $element.prop('tagName')
                    .toLowerCase();
            
                if ($element.prop('value') === this.options.selectAllValue) {
                    return;
                }

                if (tag === 'optgroup') {
                    this.createOptgroup(element);
                }
                else if (tag === 'option') {

                    if ($element.data('role') === 'divider') {
                        this.createDivider();
                    }
                    else {
                        this.createOptionValue(element);
                    }

                }

                // Other illegal tags will be ignored.
            }, this));

            // Bind the change event on the dropdown elements.
            $('li input', this.$ul).on('change', $.proxy(function(event) {
                var $target = $(event.target);

                var checked = $target.prop('checked') || false;
                var isSelectAllOption = $target.val() === this.options.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.options.selectedClass) {
                    if (checked) {
                        $target.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                    else {
                        $target.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                // Get the corresponding option.
                var value = $target.val();
                var $option = this.getOptionByValue(value);

                var $optionsNotThis = $('option', this.$select).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($target);

                if (isSelectAllOption) {
                    if (checked) {
                        this.selectAll();
                    }
                    else {
                        this.deselectAll();
                    }
                }

                if(!isSelectAllOption){
                    if (checked) {
                        $option.prop('selected', true);

                        if (this.options.multiple) {
                            // Simply select additional option.
                            $option.prop('selected', true);
                        }
                        else {
                            // Unselect all other options and corresponding checkboxes.
                            if (this.options.selectedClass) {
                                $($checkboxesNotThis).closest('li').removeClass(this.options.selectedClass);
                            }

                            $($checkboxesNotThis).prop('checked', false);
                            $optionsNotThis.prop('selected', false);

                            // It's a single selection, so close.
                            this.$button.click();
                        }

                        if (this.options.selectedClass === "active") {
                            $optionsNotThis.closest("a").css("outline", "");
                        }
                    }
                    else {
                        // Unselect option.
                        $option.prop('selected', false);
                    }
                }

                this.$select.change();

                this.updateButtonText();
                this.updateSelectAll();

                this.options.onChange($option, checked);

                if(this.options.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('li a', this.$ul).on('mousedown', function(e) {
                if (e.shiftKey) {
                    // Prevent selecting text by Shift+click
                    return false;
                }
            });
        
            $('li a', this.$ul).on('touchstart click', $.proxy(function(event) {
                event.stopPropagation();

                var $target = $(event.target);
                
                if (event.shiftKey && this.options.multiple) {
                    if($target.is("label")){ // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)
                        event.preventDefault();
                        $target = $target.find("input");
                        $target.prop("checked", !$target.prop("checked"));
                    }
                    var checked = $target.prop('checked') || false;

                    if (this.lastToggledInput !== null && this.lastToggledInput !== $target) { // Make sure we actually have a range
                        var from = $target.closest("li").index();
                        var to = this.lastToggledInput.closest("li").index();
                        
                        if (from > to) { // Swap the indices
                            var tmp = to;
                            to = from;
                            from = tmp;
                        }
                        
                        // Make sure we grab all elements since slice excludes the last index
                        ++to;
                        
                        // Change the checkboxes and underlying options
                        var range = this.$ul.find("li").slice(from, to).find("input");
                        
                        range.prop('checked', checked);
                        
                        if (this.options.selectedClass) {
                            range.closest('li')
                                .toggleClass(this.options.selectedClass, checked);
                        }
                        
                        for (var i = 0, j = range.length; i < j; i++) {
                            var $checkbox = $(range[i]);

                            var $option = this.getOptionByValue($checkbox.val());

                            $option.prop('selected', checked);
                        }                   
                    }
                    
                    // Trigger the select "change" event
                    $target.trigger("change");
                }
                
                // Remembers last clicked option
                if($target.is("input") && !$target.closest("li").is(".multiselect-item")){
                    this.lastToggledInput = $target;
                }

                $target.blur();
            }, this));

            // Keyboard support.
            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function(event) {
                if ($('input[type="text"]', this.$container).is(':focus')) {
                    return;
                }

                if (event.keyCode === 9 && this.$container.hasClass('open')) {
                    this.$button.click();
                }
                else {
                    var $items = $(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                    if (!$items.length) {
                        return;
                    }

                    var index = $items.index($items.filter(':focus'));

                    // Navigation up.
                    if (event.keyCode === 38 && index > 0) {
                        index--;
                    }
                    // Navigate down.
                    else if (event.keyCode === 40 && index < $items.length - 1) {
                        index++;
                    }
                    else if (!~index) {
                        index = 0;
                    }

                    var $current = $items.eq(index);
                    $current.focus();

                    if (event.keyCode === 32 || event.keyCode === 13) {
                        var $checkbox = $current.find('input');

                        $checkbox.prop("checked", !$checkbox.prop("checked"));
                        $checkbox.change();
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            }, this));

            if(this.options.enableClickableOptGroups && this.options.multiple) {
                $('li.multiselect-group', this.$ul).on('click', $.proxy(function(event) {
                    event.stopPropagation();

                    var group = $(event.target).parent();

                    // Search all option in optgroup
                    var $options = group.nextUntil('li.multiselect-group');
                    var $visibleOptions = $options.filter(":visible:not(.disabled)");

                    // check or uncheck items
                    var allChecked = true;
                    var optionInputs = $visibleOptions.find('input');
                    optionInputs.each(function() {
                        allChecked = allChecked && $(this).prop('checked');
                    });

                    optionInputs.prop('checked', !allChecked).trigger('change');
               }, this));
            }
        },

        /**
         * Create an option using the given select option.
         *
         * @param {jQuery} element
         */
        createOptionValue: function(element) {
            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            var label = this.options.optionLabel(element);
            var value = $element.val();
            var inputType = this.options.multiple ? "checkbox" : "radio";

            var $li = $(this.options.templates.li);
            var $label = $('label', $li);
            $label.addClass(inputType);

            if (this.options.enableHTML) {
                $label.html(" " + label);
            }
            else {
                $label.text(" " + label);
            }
        
            var $checkbox = $('<input/>').attr('type', inputType);

            if (this.options.checkboxName) {
                $checkbox.attr('name', this.options.checkboxName);
            }
            $label.prepend($checkbox);

            var selected = $element.prop('selected') || false;
            $checkbox.val(value);

            if (value === this.options.selectAllValue) {
                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');
            }

            $label.attr('title', $element.attr('title'));

            this.$ul.append($li);

            if ($element.is(':disabled')) {
                $checkbox.attr('disabled', 'disabled')
                    .prop('disabled', true)
                    .closest('a')
                    .attr("tabindex", "-1")
                    .closest('li')
                    .addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            if (selected && this.options.selectedClass) {
                $checkbox.closest('li')
                    .addClass(this.options.selectedClass);
            }
        },

        /**
         * Creates a divider using the given select option.
         *
         * @param {jQuery} element
         */
        createDivider: function(element) {
            var $divider = $(this.options.templates.divider);
            this.$ul.append($divider);
        },

        /**
         * Creates an optgroup.
         *
         * @param {jQuery} group
         */
        createOptgroup: function(group) {
            var groupName = $(group).prop('label');

            // Add a header for the group.
            var $li = $(this.options.templates.liGroup);
            
            if (this.options.enableHTML) {
                $('label', $li).html(groupName);
            }
            else {
                $('label', $li).text(groupName);
            }
            
            if (this.options.enableClickableOptGroups) {
                $li.addClass('multiselect-group-clickable');
            }

            this.$ul.append($li);

            if ($(group).is(':disabled')) {
                $li.addClass('disabled');
            }

            // Add the options of the group.
            $('option', group).each($.proxy(function(index, element) {
                this.createOptionValue(element);
            }, this));
        },

        /**
         * Build the selct all.
         * 
         * Checks if a select all has already been created.
         */
        buildSelectAll: function() {
            if (typeof this.options.selectAllValue === 'number') {
                this.options.selectAllValue = this.options.selectAllValue.toString();
            }
            
            var alreadyHasSelectAll = this.hasSelectAll();

            if (!alreadyHasSelectAll && this.options.includeSelectAllOption && this.options.multiple
                    && $('option', this.$select).length > this.options.includeSelectAllIfMoreThan) {

                // Check whether to add a divider after the select all.
                if (this.options.includeSelectAllDivider) {
                    this.$ul.prepend($(this.options.templates.divider));
                }

                var $li = $(this.options.templates.li);
                $('label', $li).addClass("checkbox");
                
                if (this.options.enableHTML) {
                    $('label', $li).html(" " + this.options.selectAllText);
                }
                else {
                    $('label', $li).text(" " + this.options.selectAllText);
                }
                
                if (this.options.selectAllName) {
                    $('label', $li).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" />');
                }
                else {
                    $('label', $li).prepend('<input type="checkbox" />');
                }
                
                var $checkbox = $('input', $li);
                $checkbox.val(this.options.selectAllValue);

                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');

                this.$ul.prepend($li);

                $checkbox.prop('checked', false);
            }
        },

        /**
         * Builds the filter.
         */
        buildFilter: function() {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.
            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);

                if (this.$select.find('option').length >= enableFilterLength) {

                    this.$filter = $(this.options.templates.filter);
                    $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);
                    
                    // Adds optional filter clear button
                    if(this.options.includeFilterClearBtn){
                        var clearBtn = $(this.options.templates.filterClearBtn);
                        clearBtn.on('click', $.proxy(function(event){
                            clearTimeout(this.searchTimeout);
                            this.$filter.find('.multiselect-search').val('');
                            $('li', this.$ul).show().removeClass("filter-hidden");
                            this.updateSelectAll();
                        }, this));
                        this.$filter.find('.input-group').append(clearBtn);
                    }
                    
                    this.$ul.prepend(this.$filter);

                    this.$filter.val(this.query).on('click', function(event) {
                        event.stopPropagation();
                    }).on('input keydown', $.proxy(function(event) {
                        // Cancel enter key default behaviour
                        if (event.which === 13) {
                          event.preventDefault();
                        }
                        
                        // This is useful to catch "keydown" events after the browser has updated the control.
                        clearTimeout(this.searchTimeout);

                        this.searchTimeout = this.asyncFunction($.proxy(function() {

                            if (this.query !== event.target.value) {
                                this.query = event.target.value;

                                var currentGroup, currentGroupVisible;
                                $.each($('li', this.$ul), $.proxy(function(index, element) {
                                    var value = $('input', element).length > 0 ? $('input', element).val() : "";
                                    var text = $('label', element).text();

                                    var filterCandidate = '';
                                    if ((this.options.filterBehavior === 'text')) {
                                        filterCandidate = text;
                                    }
                                    else if ((this.options.filterBehavior === 'value')) {
                                        filterCandidate = value;
                                    }
                                    else if (this.options.filterBehavior === 'both') {
                                        filterCandidate = text + '\n' + value;
                                    }

                                    if (value !== this.options.selectAllValue && text) {
                                        // By default lets assume that element is not
                                        // interesting for this search.
                                        var showElement = false;

                                        if (this.options.enableCaseInsensitiveFiltering && filterCandidate.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
                                            showElement = true;
                                        }
                                        else if (filterCandidate.indexOf(this.query) > -1) {
                                            showElement = true;
                                        }

                                        // Toggle current element (group or group item) according to showElement boolean.
                                        $(element).toggle(showElement).toggleClass('filter-hidden', !showElement);
                                        
                                        // Differentiate groups and group items.
                                        if ($(element).hasClass('multiselect-group')) {
                                            // Remember group status.
                                            currentGroup = element;
                                            currentGroupVisible = showElement;
                                        }
                                        else {
                                            // Show group name when at least one of its items is visible.
                                            if (showElement) {
                                                $(currentGroup).show().removeClass('filter-hidden');
                                            }
                                            
                                            // Show all group items when group name satisfies filter.
                                            if (!showElement && currentGroupVisible) {
                                                $(element).show().removeClass('filter-hidden');
                                            }
                                        }
                                    }
                                }, this));
                            }

                            this.updateSelectAll();
                        }, this), 300, this);
                    }, this));
                }
            }
        },

        /**
         * Unbinds the whole plugin.
         */
        destroy: function() {
            this.$container.remove();
            this.$select.show();
            this.$select.data('multiselect', null);
        },

        /**
         * Refreshs the multiselect based on the selected options of the select.
         */
        refresh: function() {
            $('option', this.$select).each($.proxy(function(index, element) {
                var $input = $('li input', this.$ul).filter(function() {
                    return $(this).val() === $(element).val();
                });

                if ($(element).is(':selected')) {
                    $input.prop('checked', true);

                    if (this.options.selectedClass) {
                        $input.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                }
                else {
                    $input.prop('checked', false);

                    if (this.options.selectedClass) {
                        $input.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                if ($(element).is(":disabled")) {
                    $input.attr('disabled', 'disabled')
                        .prop('disabled', true)
                        .closest('li')
                        .addClass('disabled');
                }
                else {
                    $input.prop('disabled', false)
                        .closest('li')
                        .removeClass('disabled');
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Select all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered if
         * and only if one value is passed.
         * 
         * @param {Array} selectValues
         * @param {Boolean} triggerOnChange
         */
        select: function(selectValues, triggerOnChange) {
            if(!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }
                
                if (!this.options.multiple) {
                    this.deselectAll(false);
                }
                
                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .addClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);
                
                if (triggerOnChange) {
                    this.options.onChange($option, true);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Clears all selected items.
         */
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Deselects all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered, if
         * and only if one value is passed.
         * 
         * @param {Array} deselectValues
         * @param {Boolean} triggerOnChange
         */
        deselect: function(deselectValues, triggerOnChange) {
            if(!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .removeClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);
                
                if (triggerOnChange) {
                    this.options.onChange($option, false);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },
        
        /**
         * Selects all enabled & visible options.
         *
         * If justVisible is true or not specified, only visible options are selected.
         *
         * @param {Boolean} justVisible
         * @param {Boolean} triggerOnSelectAll
         */
        selectAll: function (justVisible, triggerOnSelectAll) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allCheckboxes = $("li input[type='checkbox']:enabled", this.$ul);
            var visibleCheckboxes = allCheckboxes.filter(":visible");
            var allCheckboxesCount = allCheckboxes.length;
            var visibleCheckboxesCount = visibleCheckboxes.length;
            
            if(justVisible) {
                visibleCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").addClass(this.options.selectedClass);
            }
            else {
                allCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).addClass(this.options.selectedClass);
            }
                
            if (allCheckboxesCount === visibleCheckboxesCount || justVisible === false) {
                $("option:enabled", this.$select).prop('selected', true);
            }
            else {
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.$select).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', true);
            }
            
            if (triggerOnSelectAll) {
                this.options.onSelectAll();
            }
        },

        /**
         * Deselects all options.
         * 
         * If justVisible is true or not specified, only visible options are deselected.
         * 
         * @param {Boolean} justVisible
         */
        deselectAll: function (justVisible) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            
            if(justVisible) {              
                var visibleCheckboxes = $("li input[type='checkbox']:not(:disabled)", this.$ul).filter(":visible");
                visibleCheckboxes.prop('checked', false);
                
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.$select).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', false);
                
                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").removeClass(this.options.selectedClass);
                }
            }
            else {
                $("li input[type='checkbox']:enabled", this.$ul).prop('checked', false);
                $("option:enabled", this.$select).prop('selected', false);
                
                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Rebuild the plugin.
         * 
         * Rebuilds the dropdown, the filter and the select all option.
         */
        rebuild: function() {
            this.$ul.html('');

            // Important to distinguish between radios and checkboxes.
            this.options.multiple = this.$select.attr('multiple') === "multiple";

            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll();
            
            if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
                this.disable();
            }
            else {
                this.enable();
            }
            
            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function(dataprovider) {
            
            var groupCounter = 0;
            var $select = this.$select.empty();
            
            $.each(dataprovider, function (index, option) {
                var $tag;
                
                if ($.isArray(option.children)) { // create optiongroup tag
                    groupCounter++;
                    
                    $tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter,
                        disabled: !!option.disabled
                    });
                    
                    forEach(option.children, function(subOption) { // add children option tags
                        $tag.append($('<option/>').attr({
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        }));
                    });
                }
                else {
                    $tag = $('<option/>').attr({
                        value: option.value,
                        label: option.label || option.value,
                        title: option.title,
                        selected: !!option.selected,
                        disabled: !!option.disabled
                    });
                }
                
                $select.append($tag);
            });
            
            this.rebuild();
        },

        /**
         * Enable the multiselect.
         */
        enable: function() {
            this.$select.prop('disabled', false);
            this.$button.prop('disabled', false)
                .removeClass('disabled');
        },

        /**
         * Disable the multiselect.
         */
        disable: function() {
            this.$select.prop('disabled', true);
            this.$button.prop('disabled', true)
                .addClass('disabled');
        },

        /**
         * Set the options.
         *
         * @param {Array} options
         */
        setOptions: function(options) {
            this.options = this.mergeOptions(options);
        },

        /**
         * Merges the given options with the default options.
         *
         * @param {Array} options
         * @returns {Array}
         */
        mergeOptions: function(options) {
            return $.extend(true, {}, this.defaults, this.options, options);
        },

        /**
         * Checks whether a select all checkbox is present.
         *
         * @returns {Boolean}
         */
        hasSelectAll: function() {
            return $('li.multiselect-all', this.$ul).length > 0;
        },

        /**
         * Updates the select all checkbox based on the currently displayed and selected checkboxes.
         */
        updateSelectAll: function() {
            if (this.hasSelectAll()) {
                var allBoxes = $("li:not(.multiselect-item):not(.filter-hidden) input:enabled", this.$ul);
                var allBoxesLength = allBoxes.length;
                var checkedBoxesLength = allBoxes.filter(":checked").length;
                var selectAllLi  = $("li.multiselect-all", this.$ul);
                var selectAllInput = selectAllLi.find("input");
                
                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                    selectAllInput.prop("checked", true);
                    selectAllLi.addClass(this.options.selectedClass);
                    this.options.onSelectAll();
                }
                else {
                    selectAllInput.prop("checked", false);
                    selectAllLi.removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Update the button text and its title based on the currently selected options.
         */
        updateButtonText: function() {
            var options = this.getSelected();
            
            // First update the displayed button text.
            if (this.options.enableHTML) {
                $('.multiselect .multiselect-selected-text', this.$container).html(this.options.buttonText(options, this.$select));
            }
            else {
                $('.multiselect .multiselect-selected-text', this.$container).text(this.options.buttonText(options, this.$select));
            }
            
            // Now update the title attribute of the button.
            $('.multiselect', this.$container).attr('title', this.options.buttonTitle(options, this.$select));
        },

        /**
         * Get all selected options.
         *
         * @returns {jQUery}
         */
        getSelected: function() {
            return $('option', this.$select).filter(":selected");
        },

        /**
         * Gets a select option by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getOptionByValue: function (value) {

            var options = $('option', this.$select);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },

        /**
         * Get the input (radio/checkbox) by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getInputByValue: function (value) {

            var checkboxes = $('li input', this.$ul);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        /**
         * Used for knockout integration.
         */
        updateOriginalOptions: function() {
            this.originalOptions = this.$select.clone()[0].options;
        },

        asyncFunction: function(callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function() {
                callback.apply(self || window, args);
            }, timeout);
        },

        setAllSelectedText: function(allSelectedText) {
            this.options.allSelectedText = allSelectedText;
            this.updateButtonText();
        }
    };

    $.fn.multiselect = function(option, parameter, extraOptions) {
        return this.each(function() {
            var data = $(this).data('multiselect');
            var options = typeof option === 'object' && option;

            // Initialize the multiselect.
            if (!data) {
                data = new Multiselect(this, options);
                $(this).data('multiselect', data);
            }

            // Call multiselect method.
            if (typeof option === 'string') {
                data[option](parameter, extraOptions);
                
                if (option === 'destroy') {
                    $(this).data('multiselect', false);
                }
            }
        });
    };

    $.fn.multiselect.Constructor = Multiselect;

    $(function() {
        $("select[data-role=multiselect]").multiselect();
    });

}(window.jQuery);

/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );

/**
 * @preserve
 * bootpag - jQuery plugin for dynamic pagination
 *
 * Copyright (c) 2015 botmonster@7items.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://botmonster.com/jquery-bootpag/
 *
 * Version:  1.0.7
 *
 */
(function($, window) {

    $.fn.bootpag = function(options){

        var $owner = this,
            settings = $.extend({
                total: 0,
                page: 1,
                maxVisible: null,
                leaps: true,
                href: 'javascript:void(0);',
                hrefVariable: '{{number}}',
                next: '&raquo;',
                prev: '&laquo;',
				firstLastUse: false,
                first: '<span aria-hidden="true">&larr;</span>',
                last: '<span aria-hidden="true">&rarr;</span>',
                wrapClass: 'pagination',
                activeClass: 'active',
                disabledClass: 'disabled',
                nextClass: 'next',
                prevClass: 'prev',
		        lastClass: 'last',
                firstClass: 'first'
            },
            $owner.data('settings') || {},
            options || {});

        if(settings.total <= 0)
            return this;

          if(!$.isNumeric(settings.maxVisible) && !settings.maxVisible){
            settings.maxVisible = parseInt(settings.total, 10);
        }

        $owner.data('settings', settings);

        function renderPage($bootpag, page){

            page = parseInt(page, 10);
            var lp,
                maxV = settings.maxVisible == 0 ? 1 : settings.maxVisible,
                step = settings.maxVisible == 1 ? 0 : 1,
                vis = Math.floor((page - 1) / maxV) * maxV,
                $page = $bootpag.find('li');
            settings.page = page = page < 0 ? 0 : page > settings.total ? settings.total : page;
            $page.removeClass(settings.activeClass);
            lp = page - 1 < 1 ? 1 :
                    settings.leaps && page - 1 >= settings.maxVisible ?
                        Math.floor((page - 1) / maxV) * maxV : page - 1;

			if(settings.firstLastUse) {
				$page
					.first()
					.toggleClass(settings.disabledClass, page === 1);
			}

			var lfirst = $page.first();
			if(settings.firstLastUse) {
				lfirst = lfirst.next();
			}

			lfirst
                .toggleClass(settings.disabledClass, page === 1)
                .attr('data-lp', lp)
                .find('a').attr('href', href(lp));

            var step = settings.maxVisible == 1 ? 0 : 1;

            lp = page + 1 > settings.total ? settings.total :
                    settings.leaps && page + 1 < settings.total - settings.maxVisible ?
                        vis + settings.maxVisible + step: page + 1;

			var llast = $page.last();
			if(settings.firstLastUse) {
				llast = llast.prev();
			}

			llast
                .toggleClass(settings.disabledClass, page === settings.total)
                .attr('data-lp', lp)
                .find('a').attr('href', href(lp));

			$page
				.last()
				.toggleClass(settings.disabledClass, page === settings.total);


            var $currPage = $page.filter('[data-lp='+page+']');

			var clist = "." + [settings.nextClass,
							   settings.prevClass,
                               settings.firstClass,
                               settings.lastClass].join(",.");
            if(!$currPage.not(clist).length){
                var d = page <= vis ? -settings.maxVisible : 0;
                $page.not(clist).each(function(index){
                    lp = index + 1 + vis + d;
                    $(this)
                        .attr('data-lp', lp)
                        .toggle(lp <= settings.total)
                        .find('a').html(lp).attr('href', href(lp));
                });
                $currPage = $page.filter('[data-lp='+page+']');
            }
            $currPage.not(clist).addClass(settings.activeClass);
            $owner.data('settings', settings);
        }

        function href(c){

            return settings.href.replace(settings.hrefVariable, c);
        }

        return this.each(function(){

            var $bootpag, lp, me = $(this),
                p = ['<ul class="', settings.wrapClass, ' bootpag">'];

            if(settings.firstLastUse){
                p = p.concat(['<li data-lp="1" class="', settings.firstClass,
                       '"><a href="', href(1), '">', settings.first, '</a></li>']);
            }
            if(settings.prev){
                p = p.concat(['<li data-lp="1" class="', settings.prevClass,
                       '"><a href="', href(1), '">', settings.prev, '</a></li>']);
            }
            for(var c = 1; c <= Math.min(settings.total, settings.maxVisible); c++){
                p = p.concat(['<li data-lp="', c, '"><a href="', href(c), '">', c, '</a></li>']);
            }
            if(settings.next){
                lp = settings.leaps && settings.total > settings.maxVisible
                    ? Math.min(settings.maxVisible + 1, settings.total) : 2;
                p = p.concat(['<li data-lp="', lp, '" class="',
                             settings.nextClass, '"><a href="', href(lp),
                             '">', settings.next, '</a></li>']);
            }
            if(settings.firstLastUse){
                p = p.concat(['<li data-lp="', settings.total, '" class="last"><a href="',
                             href(settings.total),'">', settings.last, '</a></li>']);
            }
            p.push('</ul>');
            me.find('ul.bootpag').remove();
            me.append(p.join(''));
            $bootpag = me.find('ul.bootpag');

            me.find('li').click(function paginationClick(){

                var me = $(this);
                if(me.hasClass(settings.disabledClass) || me.hasClass(settings.activeClass)){
                    return;
                }
                var page = parseInt(me.attr('data-lp'), 10);
                $owner.find('ul.bootpag').each(function(){
                    renderPage($(this), page);
                });

                $owner.trigger('page', page);
            });
            renderPage($bootpag, settings.page);
        });
    }

})(jQuery, window);

/** jQuery md5()
  * Encodes a string in MD5
  * @author Gabriele Romanato <http://blog.gabrieleromanato.com>
  * @requires jQuery 1.4+
  * Usage $.md5(string)
  */

(function($) {

	$.md5 = function (string) {

   function RotateLeft(lValue, iShiftBits) {
           return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
   }

   function AddUnsigned(lX,lY) {
           var lX4,lY4,lX8,lY8,lResult;
           lX8 = (lX & 0x80000000);
           lY8 = (lY & 0x80000000);
           lX4 = (lX & 0x40000000);
           lY4 = (lY & 0x40000000);
           lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
           if (lX4 & lY4) {
                   return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
           }
           if (lX4 | lY4) {
                   if (lResult & 0x40000000) {
                           return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                   } else {
                           return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                   }
           } else {
                   return (lResult ^ lX8 ^ lY8);
           }
   }

   function F(x,y,z) { return (x & y) | ((~x) & z); }
   function G(x,y,z) { return (x & z) | (y & (~z)); }
   function H(x,y,z) { return (x ^ y ^ z); }
   function I(x,y,z) { return (y ^ (x | (~z))); }

   function FF(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function GG(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function HH(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function II(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function ConvertToWordArray(string) {
           var lWordCount;
           var lMessageLength = string.length;
           var lNumberOfWords_temp1=lMessageLength + 8;
           var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
           var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
           var lWordArray=Array(lNumberOfWords-1);
           var lBytePosition = 0;
           var lByteCount = 0;
           while ( lByteCount < lMessageLength ) {
                   lWordCount = (lByteCount-(lByteCount % 4))/4;
                   lBytePosition = (lByteCount % 4)*8;
                   lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                   lByteCount++;
           }
           lWordCount = (lByteCount-(lByteCount % 4))/4;
           lBytePosition = (lByteCount % 4)*8;
           lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
           lWordArray[lNumberOfWords-2] = lMessageLength<<3;
           lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
           return lWordArray;
   };

   function WordToHex(lValue) {
           var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
           for (lCount = 0;lCount<=3;lCount++) {
                   lByte = (lValue>>>(lCount*8)) & 255;
                   WordToHexValue_temp = "0" + lByte.toString(16);
                   WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
           }
           return WordToHexValue;
   };

   function Utf8Encode(string) {
           string = string.replace(/\r\n/g,"\n");
           var utftext = "";

           for (var n = 0; n < string.length; n++) {

                   var c = string.charCodeAt(n);

                   if (c < 128) {
                           utftext += String.fromCharCode(c);
                   }
                   else if((c > 127) && (c < 2048)) {
                           utftext += String.fromCharCode((c >> 6) | 192);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }
                   else {
                           utftext += String.fromCharCode((c >> 12) | 224);
                           utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }

           }

           return utftext;
   };

   var x=Array();
   var k,AA,BB,CC,DD,a,b,c,d;
   var S11=7, S12=12, S13=17, S14=22;
   var S21=5, S22=9 , S23=14, S24=20;
   var S31=4, S32=11, S33=16, S34=23;
   var S41=6, S42=10, S43=15, S44=21;

   string = Utf8Encode(string);

   x = ConvertToWordArray(string);

   a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

   for (k=0;k<x.length;k+=16) {
           AA=a; BB=b; CC=c; DD=d;
           a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
           d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
           c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
           b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
           a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
           d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
           c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
           b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
           a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
           d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
           c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
           b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
           a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
           d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
           c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
           b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
           a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
           d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
           c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
           b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
           a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
           d=GG(d,a,b,c,x[k+10],S22,0x2441453);
           c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
           b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
           a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
           d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
           c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
           b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
           a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
           d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
           c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
           b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
           a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
           d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
           c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
           b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
           a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
           d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
           c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
           b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
           a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
           d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
           c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
           b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
           a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
           d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
           c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
           b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
           a=II(a,b,c,d,x[k+0], S41,0xF4292244);
           d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
           c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
           b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
           a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
           d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
           c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
           b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
           a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
           d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
           c=II(c,d,a,b,x[k+6], S43,0xA3014314);
           b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
           a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
           d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
           c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
           b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
           a=AddUnsigned(a,AA);
           b=AddUnsigned(b,BB);
           c=AddUnsigned(c,CC);
           d=AddUnsigned(d,DD);
           }

       var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

       return temp.toLowerCase();
};



})(jQuery);
/* perfect-scrollbar v0.6.5-1 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var ps = require('../main')
  , psInstances = require('../plugin/instances');

function mountJQuery(jQuery) {
  jQuery.fn.perfectScrollbar = function (settingOrCommand) {
    return this.each(function () {
      if (typeof settingOrCommand === 'object' ||
          typeof settingOrCommand === 'undefined') {
        // If it's an object or none, initialize.
        var settings = settingOrCommand;

        if (!psInstances.get(this)) {
          ps.initialize(this, settings);
        }
      } else {
        // Unless, it may be a command.
        var command = settingOrCommand;

        if (command === 'update') {
          ps.update(this);
        } else if (command === 'destroy') {
          ps.destroy(this);
        }
      }

      return jQuery(this);
    });
  };
}

if (typeof define === 'function' && define.amd) {
  // AMD. Register as an anonymous module.
  define(['jquery'], mountJQuery);
} else {
  var jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    mountJQuery(jq);
  }
}

module.exports = mountJQuery;

},{"../main":7,"../plugin/instances":18}],2:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

function oldAdd(element, className) {
  var classes = element.className.split(' ');
  if (classes.indexOf(className) < 0) {
    classes.push(className);
  }
  element.className = classes.join(' ');
}

function oldRemove(element, className) {
  var classes = element.className.split(' ');
  var idx = classes.indexOf(className);
  if (idx >= 0) {
    classes.splice(idx, 1);
  }
  element.className = classes.join(' ');
}

exports.add = function (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    oldAdd(element, className);
  }
};

exports.remove = function (element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    oldRemove(element, className);
  }
};

exports.list = function (element) {
  if (element.classList) {
    return element.classList;
  } else {
    return element.className.split(' ');
  }
};

},{}],3:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var DOM = {};

DOM.e = function (tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
};

DOM.appendTo = function (child, parent) {
  parent.appendChild(child);
  return child;
};

function cssGet(element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

function cssSet(element, styleName, styleValue) {
  if (typeof styleValue === 'number') {
    styleValue = styleValue.toString() + 'px';
  }
  element.style[styleName] = styleValue;
  return element;
}

function cssMultiSet(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val.toString() + 'px';
    }
    element.style[key] = val;
  }
  return element;
}

DOM.css = function (element, styleNameOrObject, styleValue) {
  if (typeof styleNameOrObject === 'object') {
    // multiple set with object
    return cssMultiSet(element, styleNameOrObject);
  } else {
    if (typeof styleValue === 'undefined') {
      return cssGet(element, styleNameOrObject);
    } else {
      return cssSet(element, styleNameOrObject, styleValue);
    }
  }
};

DOM.matches = function (element, query) {
  if (typeof element.matches !== 'undefined') {
    return element.matches(query);
  } else {
    if (typeof element.matchesSelector !== 'undefined') {
      return element.matchesSelector(query);
    } else if (typeof element.webkitMatchesSelector !== 'undefined') {
      return element.webkitMatchesSelector(query);
    } else if (typeof element.mozMatchesSelector !== 'undefined') {
      return element.mozMatchesSelector(query);
    } else if (typeof element.msMatchesSelector !== 'undefined') {
      return element.msMatchesSelector(query);
    }
  }
};

DOM.remove = function (element) {
  if (typeof element.remove !== 'undefined') {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

DOM.queryChildren = function (element, selector) {
  return Array.prototype.filter.call(element.childNodes, function (child) {
    return DOM.matches(child, selector);
  });
};

module.exports = DOM;

},{}],4:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var EventElement = function (element) {
  this.element = element;
  this.events = {};
};

EventElement.prototype.bind = function (eventName, handler) {
  if (typeof this.events[eventName] === 'undefined') {
    this.events[eventName] = [];
  }
  this.events[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function (eventName, handler) {
  var isHandlerProvided = (typeof handler !== 'undefined');
  this.events[eventName] = this.events[eventName].filter(function (hdlr) {
    if (isHandlerProvided && hdlr !== handler) {
      return true;
    }
    this.element.removeEventListener(eventName, hdlr, false);
    return false;
  }, this);
};

EventElement.prototype.unbindAll = function () {
  for (var name in this.events) {
    this.unbind(name);
  }
};

var EventManager = function () {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
  var ee = this.eventElements.filter(function (eventElement) {
    return eventElement.element === element;
  })[0];
  if (typeof ee === 'undefined') {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function (element, eventName, handler) {
  this.eventElement(element).unbind(eventName, handler);
};

EventManager.prototype.unbindAll = function () {
  for (var i = 0; i < this.eventElements.length; i++) {
    this.eventElements[i].unbindAll();
  }
};

EventManager.prototype.once = function (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (e) {
    ee.unbind(eventName, onceHandler);
    handler(e);
  };
  ee.bind(eventName, onceHandler);
};

module.exports = EventManager;

},{}],5:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

module.exports = (function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

},{}],6:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('./class')
  , d = require('./dom');

exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

exports.clone = function (obj) {
  if (obj === null) {
    return null;
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = this.clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = this.clone(original);
  for (var key in source) {
    result[key] = this.clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return d.matches(el, "input,[contenteditable]") ||
         d.matches(el, "select,[contenteditable]") ||
         d.matches(el, "textarea,[contenteditable]") ||
         d.matches(el, "button,[contenteditable]");
};

exports.removePsClasses = function (element) {
  var clsList = cls.list(element);
  for (var i = 0; i < clsList.length; i++) {
    var className = clsList[i];
    if (className.indexOf('ps-') === 0) {
      cls.remove(element, className);
    }
  }
};

exports.outerWidth = function (element) {
  return this.toInt(d.css(element, 'width')) +
         this.toInt(d.css(element, 'paddingLeft')) +
         this.toInt(d.css(element, 'paddingRight')) +
         this.toInt(d.css(element, 'borderLeftWidth')) +
         this.toInt(d.css(element, 'borderRightWidth'));
};

exports.startScrolling = function (element, axis) {
  cls.add(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.add(element, 'ps-' + axis);
  } else {
    cls.add(element, 'ps-x');
    cls.add(element, 'ps-y');
  }
};

exports.stopScrolling = function (element, axis) {
  cls.remove(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.remove(element, 'ps-' + axis);
  } else {
    cls.remove(element, 'ps-x');
    cls.remove(element, 'ps-y');
  }
};

exports.env = {
  isWebKit: 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: window.navigator.msMaxTouchPoints !== null
};

},{"./class":2,"./dom":3}],7:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var destroy = require('./plugin/destroy')
  , initialize = require('./plugin/initialize')
  , update = require('./plugin/update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

},{"./plugin/destroy":9,"./plugin/initialize":17,"./plugin/update":20}],8:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

module.exports = {
  wheelSpeed: 1,
  wheelPropagation: false,
  swipePropagation: true,
  minScrollbarLength: null,
  maxScrollbarLength: null,
  useBothWheelAxes: false,
  useKeyboard: true,
  suppressScrollX: false,
  suppressScrollY: false,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  stopPropagationOnClick: true
};

},{}],9:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom')
  , h = require('../lib/helper')
  , instances = require('./instances');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  d.remove(i.scrollbarX);
  d.remove(i.scrollbarY);
  d.remove(i.scrollbarXRail);
  d.remove(i.scrollbarYRail);
  h.removePsClasses(element);

  instances.remove(element);
};

},{"../lib/dom":3,"../lib/helper":6,"./instances":18}],10:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry');

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = window.Event.prototype.stopPropagation.bind;

  if (i.settings.stopPropagationOnClick) {
    i.event.bind(i.scrollbarY, 'click', stopPropagation);
  }
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var halfOfScrollbarLength = h.toInt(i.scrollbarYHeight / 2);
    var positionTop = i.railYRatio * (e.pageY - window.scrollY - pageOffset(i.scrollbarYRail).top - halfOfScrollbarLength);
    var maxPositionTop = i.railYRatio * (i.railYHeight - i.scrollbarYHeight);
    var positionRatio = positionTop / maxPositionTop;

    if (positionRatio < 0) {
      positionRatio = 0;
    } else if (positionRatio > 1) {
      positionRatio = 1;
    }

    element.scrollTop = (i.contentHeight - i.containerHeight) * positionRatio;
    updateGeometry(element);

    e.stopPropagation();
  });

  if (i.settings.stopPropagationOnClick) {
    i.event.bind(i.scrollbarX, 'click', stopPropagation);
  }
  i.event.bind(i.scrollbarXRail, 'click', function (e) {
    var halfOfScrollbarLength = h.toInt(i.scrollbarXWidth / 2);
    var positionLeft = i.railXRatio * (e.pageX - window.scrollX - pageOffset(i.scrollbarXRail).left - halfOfScrollbarLength);
    var maxPositionLeft = i.railXRatio * (i.railXWidth - i.scrollbarXWidth);
    var positionRatio = positionLeft / maxPositionLeft;

    if (positionRatio < 0) {
      positionRatio = 0;
    } else if (positionRatio > 1) {
      positionRatio = 1;
    }

    element.scrollLeft = ((i.contentWidth - i.containerWidth) * positionRatio) - i.negativeScrollAdjustment;
    updateGeometry(element);

    e.stopPropagation();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindClickRailHandler(element, i);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19}],11:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../../lib/dom')
  , h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry');

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + (deltaX * i.railXRatio);
    var maxLeft = i.scrollbarXRail.getBoundingClientRect().left + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = h.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
    element.scrollLeft = scrollLeft;
  }

  var mouseMoveHandler = function (e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    h.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = h.toInt(d.css(i.scrollbarX, 'left')) * i.railXRatio;
    h.startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + (deltaY * i.railYRatio);
    var maxTop = i.scrollbarYRail.getBoundingClientRect().top + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = h.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
    element.scrollTop = scrollTop;
  }

  var mouseMoveHandler = function (e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    h.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = h.toInt(d.css(i.scrollbarY, 'top')) * i.railYRatio;
    h.startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseScrollXHandler(element, i);
  bindMouseScrollYHandler(element, i);
};

},{"../../lib/dom":3,"../../lib/helper":6,"../instances":18,"../update-geometry":19}],12:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry');

function bindKeyboardHandler(element, i) {
  var hovered = false;
  i.event.bind(element, 'mouseenter', function () {
    hovered = true;
  });
  i.event.bind(element, 'mouseleave', function () {
    hovered = false;
  });

  var shouldPrevent = false;
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if (e.isDefaultPrevented && e.isDefaultPrevented()) {
      return;
    }

    if (!hovered) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      // go deeper if element is a webcomponent
      while (activeElement.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
      }
      if (h.isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
    case 37: // left
      deltaX = -30;
      break;
    case 38: // up
      deltaY = 30;
      break;
    case 39: // right
      deltaX = 30;
      break;
    case 40: // down
      deltaY = -30;
      break;
    case 33: // page up
      deltaY = 90;
      break;
    case 32: // space bar
      if (e.shiftKey) {
        deltaY = 90;
      } else {
        deltaY = -90;
      }
      break;
    case 34: // page down
      deltaY = -90;
      break;
    case 35: // end
      if (e.ctrlKey) {
        deltaY = -i.contentHeight;
      } else {
        deltaY = -i.containerHeight;
      }
      break;
    case 36: // home
      if (e.ctrlKey) {
        deltaY = element.scrollTop;
      } else {
        deltaY = i.containerHeight;
      }
      break;
    default:
      return;
    }

    element.scrollTop = element.scrollTop - deltaY;
    element.scrollLeft = element.scrollLeft + deltaX;
    updateGeometry(element);

    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.preventDefault();
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindKeyboardHandler(element, i);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19}],13:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry');

function bindMouseWheelHandler(element, i) {
  var shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    return [deltaX, deltaY];
  }

  function shouldBeConsumedByTextarea(deltaX, deltaY) {
    var hoveredTextarea = element.querySelector('textarea:hover');
    if (hoveredTextarea) {
      var maxScrollTop = hoveredTextarea.scrollHeight - hoveredTextarea.clientHeight;
      if (maxScrollTop > 0) {
        if (!(hoveredTextarea.scrollTop === 0 && deltaY > 0) &&
            !(hoveredTextarea.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = hoveredTextarea.scrollLeft - hoveredTextarea.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(hoveredTextarea.scrollLeft === 0 && deltaX < 0) &&
            !(hoveredTextarea.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    // FIXME: this is a quick fix for the select problem in FF and IE.
    // If there comes an effective way to deal with the problem,
    // this lines should be removed.
    if (!h.env.isWebKit && element.querySelector('select:focus')) {
      return;
    }

    var delta = getDeltaFromEvent(e);

    var deltaX = delta[0];
    var deltaY = delta[1];

    if (shouldBeConsumedByTextarea(deltaX, deltaY)) {
      return;
    }

    shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      element.scrollTop = element.scrollTop - (deltaY * i.settings.wheelSpeed);
      element.scrollLeft = element.scrollLeft + (deltaX * i.settings.wheelSpeed);
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        element.scrollTop = element.scrollTop - (deltaY * i.settings.wheelSpeed);
      } else {
        element.scrollTop = element.scrollTop + (deltaX * i.settings.wheelSpeed);
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        element.scrollLeft = element.scrollLeft + (deltaX * i.settings.wheelSpeed);
      } else {
        element.scrollLeft = element.scrollLeft - (deltaY * i.settings.wheelSpeed);
      }
      shouldPrevent = true;
    }

    updateGeometry(element);

    shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== "undefined") {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== "undefined") {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseWheelHandler(element, i);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19}],14:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('../instances')
  , updateGeometry = require('../update-geometry');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};

},{"../instances":18,"../update-geometry":19}],15:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry');

function bindSelectionHandler(element, i) {
  function getRangeNode() {
    var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  }

  var scrollingLoop = null;
  var scrollDiff = {top: 0, left: 0};
  function startScrolling() {
    if (!scrollingLoop) {
      scrollingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(scrollingLoop);
          return;
        }

        element.scrollTop = element.scrollTop + scrollDiff.top;
        element.scrollLeft = element.scrollLeft + scrollDiff.left;
        updateGeometry(element);
      }, 50); // every .1 sec
    }
  }
  function stopScrolling() {
    if (scrollingLoop) {
      clearInterval(scrollingLoop);
      scrollingLoop = null;
    }
    h.stopScrolling(element);
  }

  var isSelected = false;
  i.event.bind(i.ownerDocument, 'selectionchange', function () {
    if (element.contains(getRangeNode())) {
      isSelected = true;
    } else {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'mouseup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });

  i.event.bind(window, 'mousemove', function (e) {
    if (isSelected) {
      var mousePosition = {x: e.pageX, y: e.pageY};
      var containerGeometry = {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight
      };

      if (mousePosition.x < containerGeometry.left + 3) {
        scrollDiff.left = -5;
        h.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        h.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        h.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        h.startScrolling(element, 'y');
      } else {
        scrollDiff.top = 0;
      }

      if (scrollDiff.top === 0 && scrollDiff.left === 0) {
        stopScrolling();
      } else {
        startScrolling();
      }
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindSelectionHandler(element, i);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19}],16:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('../instances')
  , updateGeometry = require('../update-geometry');

function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    element.scrollTop = element.scrollTop - differenceY;
    element.scrollLeft = element.scrollLeft - differenceX;

    updateGeometry(element);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;
  var inGlobalTouch = false;
  var inLocalTouch = false;

  function globalTouchStart() {
    inGlobalTouch = true;
  }
  function globalTouchEnd() {
    inGlobalTouch = false;
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }
  function shouldHandle(e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }
  function touchStart(e) {
    if (shouldHandle(e)) {
      inLocalTouch = true;

      var touch = getTouch(e);

      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;

      startTime = (new Date()).getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }

      e.stopPropagation();
    }
  }
  function touchMove(e) {
    if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = (new Date()).getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPreventDefault(differenceX, differenceY)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (!inGlobalTouch && inLocalTouch) {
      inLocalTouch = false;

      clearInterval(easingLoop);
      easingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (supportsTouch) {
    i.event.bind(window, 'touchstart', globalTouchStart);
    i.event.bind(window, 'touchend', globalTouchEnd);
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  }

  if (supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(window, 'pointerdown', globalTouchStart);
      i.event.bind(window, 'pointerup', globalTouchEnd);
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(window, 'MSPointerDown', globalTouchStart);
      i.event.bind(window, 'MSPointerUp', globalTouchEnd);
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

module.exports = function (element, supportsTouch, supportsIePointer) {
  var i = instances.get(element);
  bindTouchHandler(element, i, supportsTouch, supportsIePointer);
};

},{"../instances":18,"../update-geometry":19}],17:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('../lib/class')
  , h = require('../lib/helper')
  , instances = require('./instances')
  , updateGeometry = require('./update-geometry');

// Handlers
var clickRailHandler = require('./handler/click-rail')
  , dragScrollbarHandler = require('./handler/drag-scrollbar')
  , keyboardHandler = require('./handler/keyboard')
  , mouseWheelHandler = require('./handler/mouse-wheel')
  , nativeScrollHandler = require('./handler/native-scroll')
  , selectionHandler = require('./handler/selection')
  , touchHandler = require('./handler/touch');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = h.extend(i.settings, userSettings);

  clickRailHandler(element);
  dragScrollbarHandler(element);
  mouseWheelHandler(element);
  nativeScrollHandler(element);
  selectionHandler(element);

  if (h.env.supportsTouch || h.env.supportsIePointer) {
    touchHandler(element, h.env.supportsTouch, h.env.supportsIePointer);
  }
  if (i.settings.useKeyboard) {
    keyboardHandler(element);
  }

  updateGeometry(element);
};

},{"../lib/class":2,"../lib/helper":6,"./handler/click-rail":10,"./handler/drag-scrollbar":11,"./handler/keyboard":12,"./handler/mouse-wheel":13,"./handler/native-scroll":14,"./handler/selection":15,"./handler/touch":16,"./instances":18,"./update-geometry":19}],18:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom')
  , defaultSettings = require('./default-setting')
  , EventManager = require('../lib/event-manager')
  , guid = require('../lib/guid')
  , h = require('../lib/helper');

var instances = {};

function Instance(element) {
  var i = this;

  i.settings = h.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = d.css(element, 'direction') === "rtl";
  i.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  i.scrollbarXRail = d.appendTo(d.e('div', 'ps-scrollbar-x-rail'), element);
  i.scrollbarX = d.appendTo(d.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = h.toInt(d.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : h.toInt(d.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = h.toInt(d.css(i.scrollbarXRail, 'borderLeftWidth')) + h.toInt(d.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  d.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = h.toInt(d.css(i.scrollbarXRail, 'marginLeft')) + h.toInt(d.css(i.scrollbarXRail, 'marginRight'));
  d.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = d.appendTo(d.e('div', 'ps-scrollbar-y-rail'), element);
  i.scrollbarY = d.appendTo(d.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = h.toInt(d.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : h.toInt(d.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? h.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = h.toInt(d.css(i.scrollbarYRail, 'borderTopWidth')) + h.toInt(d.css(i.scrollbarYRail, 'borderBottomWidth'));
  d.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = h.toInt(d.css(i.scrollbarYRail, 'marginTop')) + h.toInt(d.css(i.scrollbarYRail, 'marginBottom'));
  d.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  if (typeof element.dataset === 'undefined') {
    return element.getAttribute('data-ps-id');
  } else {
    return element.dataset.psId;
  }
}

function setId(element, id) {
  if (typeof element.dataset === 'undefined') {
    element.setAttribute('data-ps-id', id);
  } else {
    element.dataset.psId = id;
  }
}

function removeId(element) {
  if (typeof element.dataset === 'undefined') {
    element.removeAttribute('data-ps-id');
  } else {
    delete element.dataset.psId;
  }
}

exports.add = function (element) {
  var newId = guid();
  setId(element, newId);
  instances[newId] = new Instance(element);
  return instances[newId];
};

exports.remove = function (element) {
  delete instances[getId(element)];
  removeId(element);
};

exports.get = function (element) {
  return instances[getId(element)];
};

},{"../lib/dom":3,"../lib/event-manager":4,"../lib/guid":5,"../lib/helper":6,"./default-setting":8}],19:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('../lib/class')
  , d = require('../lib/dom')
  , h = require('../lib/helper')
  , instances = require('./instances');

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = {width: i.railXWidth};
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  d.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  d.css(i.scrollbarYRail, yRailOffset);

  d.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
  d.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
}

module.exports = function (element) {
  var i = instances.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = d.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        d.remove(rail);
      });
    }
    d.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = d.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        d.remove(rail);
      });
    }
    d.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, h.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = h.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    element.scrollLeft = 0;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, h.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = h.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    element.scrollTop = 0;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  cls[i.scrollbarXActive ? 'add' : 'remove'](element, 'ps-active-x');
  cls[i.scrollbarYActive ? 'add' : 'remove'](element, 'ps-active-y');
};

},{"../lib/class":2,"../lib/dom":3,"../lib/helper":6,"./instances":18}],20:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom')
  , h = require('../lib/helper')
  , instances = require('./instances')
  , updateGeometry = require('./update-geometry');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  d.css(i.scrollbarXRail, 'display', 'block');
  d.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = h.toInt(d.css(i.scrollbarXRail, 'marginLeft')) + h.toInt(d.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = h.toInt(d.css(i.scrollbarYRail, 'marginTop')) + h.toInt(d.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  d.css(i.scrollbarXRail, 'display', 'none');
  d.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  d.css(i.scrollbarXRail, 'display', '');
  d.css(i.scrollbarYRail, 'display', '');
};

},{"../lib/dom":3,"../lib/helper":6,"./instances":18,"./update-geometry":19}]},{},[1]);

/*! =========================================================
 * bootstrap-slider.js
 *
 * Maintainers:
 *		Kyle Kemp
 *			- Twitter: @seiyria
 *			- Github:  seiyria
 *		Rohit Kalkur
 *			- Twitter: @Rovolutionary
 *			- Github:  rovolution
 *
 * =========================================================
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


/**
 * Bridget makes jQuery widgets
 * v1.0.1
 * MIT license
 */

(function(root, factory) {
	if(typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	}
	else if(typeof module === "object" && module.exports) {
		var jQuery;
		try {
			jQuery = require("jquery");
		}
		catch (err) {
			jQuery = null;
		}
		module.exports = factory(jQuery);
	}
	else {
		root.Slider = factory(root.jQuery);
	}
}(this, function($) {
	// Reference to Slider constructor
	var Slider;


	(function( $ ) {

		'use strict';

		// -------------------------- utils -------------------------- //

		var slice = Array.prototype.slice;

		function noop() {}

		// -------------------------- definition -------------------------- //

		function defineBridget( $ ) {

			// bail if no jQuery
			if ( !$ ) {
				return;
			}

			// -------------------------- addOptionMethod -------------------------- //

			/**
			 * adds option method -> $().plugin('option', {...})
			 * @param {Function} PluginClass - constructor class
			 */
			function addOptionMethod( PluginClass ) {
				// don't overwrite original option method
				if ( PluginClass.prototype.option ) {
					return;
				}

			  // option setter
			  PluginClass.prototype.option = function( opts ) {
			    // bail out if not an object
			    if ( !$.isPlainObject( opts ) ){
			      return;
			    }
			    this.options = $.extend( true, this.options, opts );
			  };
			}


			// -------------------------- plugin bridge -------------------------- //

			// helper function for logging errors
			// $.error breaks jQuery chaining
			var logError = typeof console === 'undefined' ? noop :
			  function( message ) {
			    console.error( message );
			  };

			/**
			 * jQuery plugin bridge, access methods like $elem.plugin('method')
			 * @param {String} namespace - plugin name
			 * @param {Function} PluginClass - constructor class
			 */
			function bridge( namespace, PluginClass ) {
			  // add to jQuery fn namespace
			  $.fn[ namespace ] = function( options ) {
			    if ( typeof options === 'string' ) {
			      // call plugin method when first argument is a string
			      // get arguments for method
			      var args = slice.call( arguments, 1 );

			      for ( var i=0, len = this.length; i < len; i++ ) {
			        var elem = this[i];
			        var instance = $.data( elem, namespace );
			        if ( !instance ) {
			          logError( "cannot call methods on " + namespace + " prior to initialization; " +
			            "attempted to call '" + options + "'" );
			          continue;
			        }
			        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
			          logError( "no such method '" + options + "' for " + namespace + " instance" );
			          continue;
			        }

			        // trigger method with arguments
			        var returnValue = instance[ options ].apply( instance, args);

			        // break look and return first value if provided
			        if ( returnValue !== undefined && returnValue !== instance) {
			          return returnValue;
			        }
			      }
			      // return this if no return value
			      return this;
			    } else {
			      var objects = this.map( function() {
			        var instance = $.data( this, namespace );
			        if ( instance ) {
			          // apply options & init
			          instance.option( options );
			          instance._init();
			        } else {
			          // initialize new instance
			          instance = new PluginClass( this, options );
			          $.data( this, namespace, instance );
			        }
			        return $(this);
			      });

			      if(!objects || objects.length > 1) {
			      	return objects;
			      } else {
			      	return objects[0];
			      }
			    }
			  };

			}

			// -------------------------- bridget -------------------------- //

			/**
			 * converts a Prototypical class into a proper jQuery plugin
			 *   the class must have a ._init method
			 * @param {String} namespace - plugin name, used in $().pluginName
			 * @param {Function} PluginClass - constructor class
			 */
			$.bridget = function( namespace, PluginClass ) {
			  addOptionMethod( PluginClass );
			  bridge( namespace, PluginClass );
			};

			return $.bridget;

		}

	  	// get jquery from browser global
	  	defineBridget( $ );

	})( $ );


	/*************************************************

			BOOTSTRAP-SLIDER SOURCE CODE

	**************************************************/

	(function($) {

		var ErrorMsgs = {
			formatInvalidInputErrorMsg : function(input) {
				return "Invalid input value '" + input + "' passed in";
			},
			callingContextNotSliderInstance : "Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"
		};

		var SliderScale = {
			linear: {
				toValue: function(percentage) {
					var rawValue = percentage/100 * (this.options.max - this.options.min);
					if (this.options.ticks_positions.length > 0) {
						var minv, maxv, minp, maxp = 0;
						for (var i = 0; i < this.options.ticks_positions.length; i++) {
							if (percentage <= this.options.ticks_positions[i]) {
								minv = (i > 0) ? this.options.ticks[i-1] : 0;
								minp = (i > 0) ? this.options.ticks_positions[i-1] : 0;
								maxv = this.options.ticks[i];
								maxp = this.options.ticks_positions[i];

								break;
							}
						}
						if (i > 0) {
							var partialPercentage = (percentage - minp) / (maxp - minp);
							rawValue = minv + partialPercentage * (maxv - minv);
						}
					}

					var value = this.options.min + Math.round(rawValue / this.options.step) * this.options.step;
					if (value < this.options.min) {
						return this.options.min;
					} else if (value > this.options.max) {
						return this.options.max;
					} else {
						return value;
					}
				},
				toPercentage: function(value) {
					if (this.options.max === this.options.min) {
						return 0;
					}

					if (this.options.ticks_positions.length > 0) {
						var minv, maxv, minp, maxp = 0;
						for (var i = 0; i < this.options.ticks.length; i++) {
							if (value  <= this.options.ticks[i]) {
								minv = (i > 0) ? this.options.ticks[i-1] : 0;
								minp = (i > 0) ? this.options.ticks_positions[i-1] : 0;
								maxv = this.options.ticks[i];
								maxp = this.options.ticks_positions[i];

								break;
							}
						}
						if (i > 0) {
							var partialPercentage = (value - minv) / (maxv - minv);
							return minp + partialPercentage * (maxp - minp);
						}
					}

					return 100 * (value - this.options.min) / (this.options.max - this.options.min);
				}
			},

			logarithmic: {
				/* Based on http://stackoverflow.com/questions/846221/logarithmic-slider */
				toValue: function(percentage) {
					var min = (this.options.min === 0) ? 0 : Math.log(this.options.min);
					var max = Math.log(this.options.max);
					var value = Math.exp(min + (max - min) * percentage / 100);
					value = this.options.min + Math.round((value - this.options.min) / this.options.step) * this.options.step;
					/* Rounding to the nearest step could exceed the min or
					 * max, so clip to those values. */
					if (value < this.options.min) {
						return this.options.min;
					} else if (value > this.options.max) {
						return this.options.max;
					} else {
						return value;
					}
				},
				toPercentage: function(value) {
					if (this.options.max === this.options.min) {
						return 0;
					} else {
						var max = Math.log(this.options.max);
						var min = this.options.min === 0 ? 0 : Math.log(this.options.min);
						var v = value === 0 ? 0 : Math.log(value);
						return 100 * (v - min) / (max - min);
					}
				}
			}
		};


		/*************************************************

							CONSTRUCTOR

		**************************************************/
		Slider = function(element, options) {
			createNewSlider.call(this, element, options);
			return this;
		};

		function createNewSlider(element, options) {

			if(typeof element === "string") {
				this.element = document.querySelector(element);
			} else if(element instanceof HTMLElement) {
				this.element = element;
			}

			/*************************************************

							Process Options

			**************************************************/
			options = options ? options : {};
			var optionTypes = Object.keys(this.defaultOptions);

			for(var i = 0; i < optionTypes.length; i++) {
				var optName = optionTypes[i];

				// First check if an option was passed in via the constructor
				var val = options[optName];
				// If no data attrib, then check data atrributes
				val = (typeof val !== 'undefined') ? val : getDataAttrib(this.element, optName);
				// Finally, if nothing was specified, use the defaults
				val = (val !== null) ? val : this.defaultOptions[optName];

				// Set all options on the instance of the Slider
				if(!this.options) {
					this.options = {};
				}
				this.options[optName] = val;
			}

			function getDataAttrib(element, optName) {
				var dataName = "data-slider-" + optName.replace(/_/g, '-');
				var dataValString = element.getAttribute(dataName);

				try {
					return JSON.parse(dataValString);
				}
				catch(err) {
					return dataValString;
				}
			}

			/*************************************************

							Create Markup

			**************************************************/

			var origWidth = this.element.style.width;
			var updateSlider = false;
			var parent = this.element.parentNode;
			var sliderTrackSelection;
			var sliderTrackLow, sliderTrackHigh;
			var sliderMinHandle;
			var sliderMaxHandle;

			if (this.sliderElem) {
				updateSlider = true;
			} else {
				/* Create elements needed for slider */
				this.sliderElem = document.createElement("div");
				this.sliderElem.className = "slider";

				/* Create slider track elements */
				var sliderTrack = document.createElement("div");
				sliderTrack.className = "slider-track";

				sliderTrackLow = document.createElement("div");
				sliderTrackLow.className = "slider-track-low";

				sliderTrackSelection = document.createElement("div");
				sliderTrackSelection.className = "slider-selection";

				sliderTrackHigh = document.createElement("div");
				sliderTrackHigh.className = "slider-track-high";

				sliderMinHandle = document.createElement("div");
				sliderMinHandle.className = "slider-handle min-slider-handle";

				sliderMaxHandle = document.createElement("div");
				sliderMaxHandle.className = "slider-handle max-slider-handle";

				sliderTrack.appendChild(sliderTrackLow);
				sliderTrack.appendChild(sliderTrackSelection);
				sliderTrack.appendChild(sliderTrackHigh);

				/* Create ticks */
				this.ticks = [];
				if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
					for (i = 0; i < this.options.ticks.length; i++) {
						var tick = document.createElement('div');
						tick.className = 'slider-tick';

						this.ticks.push(tick);
						sliderTrack.appendChild(tick);
					}

					sliderTrackSelection.className += " tick-slider-selection";
				}

				sliderTrack.appendChild(sliderMinHandle);
				sliderTrack.appendChild(sliderMaxHandle);

				this.tickLabels = [];
				if (Array.isArray(this.options.ticks_labels) && this.options.ticks_labels.length > 0) {
					this.tickLabelContainer = document.createElement('div');
					this.tickLabelContainer.className = 'slider-tick-label-container';

					for (i = 0; i < this.options.ticks_labels.length; i++) {
						var label = document.createElement('div');
						label.className = 'slider-tick-label';
						label.innerHTML = this.options.ticks_labels[i];

						this.tickLabels.push(label);
						this.tickLabelContainer.appendChild(label);
					}
				}


				var createAndAppendTooltipSubElements = function(tooltipElem) {
					var arrow = document.createElement("div");
					arrow.className = "tooltip-arrow";

					var inner = document.createElement("div");
					inner.className = "tooltip-inner";

					tooltipElem.appendChild(arrow);
					tooltipElem.appendChild(inner);

				};

				/* Create tooltip elements */
				var sliderTooltip = document.createElement("div");
				sliderTooltip.className = "tooltip tooltip-main";
				createAndAppendTooltipSubElements(sliderTooltip);

				var sliderTooltipMin = document.createElement("div");
				sliderTooltipMin.className = "tooltip tooltip-min";
				createAndAppendTooltipSubElements(sliderTooltipMin);

				var sliderTooltipMax = document.createElement("div");
				sliderTooltipMax.className = "tooltip tooltip-max";
				createAndAppendTooltipSubElements(sliderTooltipMax);


				/* Append components to sliderElem */
				this.sliderElem.appendChild(sliderTrack);
				this.sliderElem.appendChild(sliderTooltip);
				this.sliderElem.appendChild(sliderTooltipMin);
				this.sliderElem.appendChild(sliderTooltipMax);

				if (this.tickLabelContainer) {
					this.sliderElem.appendChild(this.tickLabelContainer);
				}

				/* Append slider element to parent container, right before the original <input> element */
				parent.insertBefore(this.sliderElem, this.element);

				/* Hide original <input> element */
				this.element.style.display = "none";
			}
			/* If JQuery exists, cache JQ references */
			if($) {
				this.$element = $(this.element);
				this.$sliderElem = $(this.sliderElem);
			}

			/*************************************************

								Setup

			**************************************************/
			this.eventToCallbackMap = {};
			this.sliderElem.id = this.options.id;

			this.touchCapable = 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch);

			this.tooltip = this.sliderElem.querySelector('.tooltip-main');
			this.tooltipInner = this.tooltip.querySelector('.tooltip-inner');

			this.tooltip_min = this.sliderElem.querySelector('.tooltip-min');
			this.tooltipInner_min = this.tooltip_min.querySelector('.tooltip-inner');

			this.tooltip_max = this.sliderElem.querySelector('.tooltip-max');
			this.tooltipInner_max= this.tooltip_max.querySelector('.tooltip-inner');

			if (SliderScale[this.options.scale]) {
				this.options.scale = SliderScale[this.options.scale];
			}

			if (updateSlider === true) {
				// Reset classes
				this._removeClass(this.sliderElem, 'slider-horizontal');
				this._removeClass(this.sliderElem, 'slider-vertical');
				this._removeClass(this.tooltip, 'hide');
				this._removeClass(this.tooltip_min, 'hide');
				this._removeClass(this.tooltip_max, 'hide');

				// Undo existing inline styles for track
				["left", "top", "width", "height"].forEach(function(prop) {
					this._removeProperty(this.trackLow, prop);
					this._removeProperty(this.trackSelection, prop);
					this._removeProperty(this.trackHigh, prop);
				}, this);

				// Undo inline styles on handles
				[this.handle1, this.handle2].forEach(function(handle) {
					this._removeProperty(handle, 'left');
					this._removeProperty(handle, 'top');
				}, this);

				// Undo inline styles and classes on tooltips
				[this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function(tooltip) {
					this._removeProperty(tooltip, 'left');
					this._removeProperty(tooltip, 'top');
					this._removeProperty(tooltip, 'margin-left');
					this._removeProperty(tooltip, 'margin-top');

					this._removeClass(tooltip, 'right');
					this._removeClass(tooltip, 'top');
				}, this);
			}

			if(this.options.orientation === 'vertical') {
				this._addClass(this.sliderElem,'slider-vertical');

				this.stylePos = 'top';
				this.mousePos = 'pageY';
				this.sizePos = 'offsetHeight';

				this._addClass(this.tooltip, 'right');
				this.tooltip.style.left = '100%';

				this._addClass(this.tooltip_min, 'right');
				this.tooltip_min.style.left = '100%';

				this._addClass(this.tooltip_max, 'right');
				this.tooltip_max.style.left = '100%';
			} else {
				this._addClass(this.sliderElem, 'slider-horizontal');
				this.sliderElem.style.width = origWidth;

				this.options.orientation = 'horizontal';
				this.stylePos = 'left';
				this.mousePos = 'pageX';
				this.sizePos = 'offsetWidth';

				this._addClass(this.tooltip, 'top');
				this.tooltip.style.top = -this.tooltip.outerHeight - 14 + 'px';

				this._addClass(this.tooltip_min, 'top');
				this.tooltip_min.style.top = -this.tooltip_min.outerHeight - 14 + 'px';

				this._addClass(this.tooltip_max, 'top');
				this.tooltip_max.style.top = -this.tooltip_max.outerHeight - 14 + 'px';
			}

			/* In case ticks are specified, overwrite the min and max bounds */
			if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
					this.options.max = Math.max.apply(Math, this.options.ticks);
					this.options.min = Math.min.apply(Math, this.options.ticks);
			}

			if (Array.isArray(this.options.value)) {
				this.options.range = true;
			} else if (this.options.range) {
				// User wants a range, but value is not an array
				this.options.value = [this.options.value, this.options.max];
			}

			this.trackLow = sliderTrackLow || this.trackLow;
			this.trackSelection = sliderTrackSelection || this.trackSelection;
			this.trackHigh = sliderTrackHigh || this.trackHigh;

			if (this.options.selection === 'none') {
				this._addClass(this.trackLow, 'hide');
				this._addClass(this.trackSelection, 'hide');
				this._addClass(this.trackHigh, 'hide');
			}

			this.handle1 = sliderMinHandle || this.handle1;
			this.handle2 = sliderMaxHandle || this.handle2;

			if (updateSlider === true) {
				// Reset classes
				this._removeClass(this.handle1, 'round triangle');
				this._removeClass(this.handle2, 'round triangle hide');

				for (i = 0; i < this.ticks.length; i++) {
					this._removeClass(this.ticks[i], 'round triangle hide');
				}
			}

			var availableHandleModifiers = ['round', 'triangle', 'custom'];
			var isValidHandleType = availableHandleModifiers.indexOf(this.options.handle) !== -1;
			if (isValidHandleType) {
				this._addClass(this.handle1, this.options.handle);
				this._addClass(this.handle2, this.options.handle);

				for (i = 0; i < this.ticks.length; i++) {
					this._addClass(this.ticks[i], this.options.handle);
				}
			}

			this.offset = this._offset(this.sliderElem);
			this.size = this.sliderElem[this.sizePos];
			this.setValue(this.options.value);

			/******************************************

						Bind Event Listeners

			******************************************/

			// Bind keyboard handlers
			this.handle1Keydown = this._keydown.bind(this, 0);
			this.handle1.addEventListener("keydown", this.handle1Keydown, false);

			this.handle2Keydown = this._keydown.bind(this, 1);
			this.handle2.addEventListener("keydown", this.handle2Keydown, false);

			this.mousedown = this._mousedown.bind(this);
			if (this.touchCapable) {
				// Bind touch handlers
				this.sliderElem.addEventListener("touchstart", this.mousedown, false);
			}
			this.sliderElem.addEventListener("mousedown", this.mousedown, false);


			// Bind tooltip-related handlers
			if(this.options.tooltip === 'hide') {
				this._addClass(this.tooltip, 'hide');
				this._addClass(this.tooltip_min, 'hide');
				this._addClass(this.tooltip_max, 'hide');
			} else if(this.options.tooltip === 'always') {
				this._showTooltip();
				this._alwaysShowTooltip = true;
			} else {
				this.showTooltip = this._showTooltip.bind(this);
				this.hideTooltip = this._hideTooltip.bind(this);

				this.sliderElem.addEventListener("mouseenter", this.showTooltip, false);
				this.sliderElem.addEventListener("mouseleave", this.hideTooltip, false);

				this.handle1.addEventListener("focus", this.showTooltip, false);
				this.handle1.addEventListener("blur", this.hideTooltip, false);

				this.handle2.addEventListener("focus", this.showTooltip, false);
				this.handle2.addEventListener("blur", this.hideTooltip, false);
			}

			if(this.options.enabled) {
				this.enable();
			} else {
				this.disable();
			}
		}



		/*************************************************

					INSTANCE PROPERTIES/METHODS

		- Any methods bound to the prototype are considered
		part of the plugin's `public` interface

		**************************************************/
		Slider.prototype = {
			_init: function() {}, // NOTE: Must exist to support bridget

			constructor: Slider,

			defaultOptions: {
				id: "",
			  	min: 0,
				max: 10,
				step: 1,
				precision: 0,
				orientation: 'horizontal',
				value: 5,
				range: false,
				selection: 'before',
				tooltip: 'show',
				tooltip_split: false,
				handle: 'round',
				reversed: false,
				enabled: true,
				formatter: function(val) {
					if (Array.isArray(val)) {
						return val[0] + " : " + val[1];
					} else {
						return val;
					}
				},
				natural_arrow_keys: false,
				ticks: [],
				ticks_positions: [],
				ticks_labels: [],
				ticks_snap_bounds: 0,
				scale: 'linear',
				focus: false
			},

			over: false,

			inDrag: false,

			getValue: function() {
				if (this.options.range) {
					return this.options.value;
				}
				return this.options.value[0];
			},

			setValue: function(val, triggerSlideEvent, triggerChangeEvent) {
				if (!val) {
					val = 0;
				}
				var oldValue = this.getValue();
				this.options.value = this._validateInputValue(val);
				var applyPrecision = this._applyPrecision.bind(this);

				if (this.options.range) {
					this.options.value[0] = applyPrecision(this.options.value[0]);
					this.options.value[1] = applyPrecision(this.options.value[1]);

					this.options.value[0] = Math.max(this.options.min, Math.min(this.options.max, this.options.value[0]));
					this.options.value[1] = Math.max(this.options.min, Math.min(this.options.max, this.options.value[1]));
				} else {
					this.options.value = applyPrecision(this.options.value);
					this.options.value = [ Math.max(this.options.min, Math.min(this.options.max, this.options.value))];
					this._addClass(this.handle2, 'hide');
					if (this.options.selection === 'after') {
						this.options.value[1] = this.options.max;
					} else {
						this.options.value[1] = this.options.min;
					}
				}

				if (this.options.max > this.options.min) {
					this.percentage = [
						this._toPercentage(this.options.value[0]),
						this._toPercentage(this.options.value[1]),
						this.options.step * 100 / (this.options.max - this.options.min)
					];
				} else {
					this.percentage = [0, 0, 100];
				}

				this._layout();
				var newValue = this.options.range ? this.options.value : this.options.value[0];

				if(triggerSlideEvent === true) {
					this._trigger('slide', newValue);
				}
				if( (oldValue !== newValue) && (triggerChangeEvent === true) ) {
					this._trigger('change', {
						oldValue: oldValue,
						newValue: newValue
					});
				}
				this._setDataVal(newValue);

				return this;
			},

			destroy: function(){
				// Remove event handlers on slider elements
				this._removeSliderEventHandlers();

				// Remove the slider from the DOM
				this.sliderElem.parentNode.removeChild(this.sliderElem);
				/* Show original <input> element */
				this.element.style.display = "";

				// Clear out custom event bindings
				this._cleanUpEventCallbacksMap();

				// Remove data values
				this.element.removeAttribute("data");

				// Remove JQuery handlers/data
				if($) {
					this._unbindJQueryEventHandlers();
					this.$element.removeData('slider');
				}
			},

			disable: function() {
				this.options.enabled = false;
				this.handle1.removeAttribute("tabindex");
				this.handle2.removeAttribute("tabindex");
				this._addClass(this.sliderElem, 'slider-disabled');
				this._trigger('slideDisabled');

				return this;
			},

			enable: function() {
				this.options.enabled = true;
				this.handle1.setAttribute("tabindex", 0);
				this.handle2.setAttribute("tabindex", 0);
				this._removeClass(this.sliderElem, 'slider-disabled');
				this._trigger('slideEnabled');

				return this;
			},

			toggle: function() {
				if(this.options.enabled) {
					this.disable();
				} else {
					this.enable();
				}
				return this;
			},

			isEnabled: function() {
				return this.options.enabled;
			},

			on: function(evt, callback) {
				this._bindNonQueryEventHandler(evt, callback);
				return this;
			},

			getAttribute: function(attribute) {
				if(attribute) {
					return this.options[attribute];
				} else {
					return this.options;
				}
			},

			setAttribute: function(attribute, value) {
				this.options[attribute] = value;
				return this;
			},

			refresh: function() {
				this._removeSliderEventHandlers();
				createNewSlider.call(this, this.element, this.options);
				if($) {
					// Bind new instance of slider to the element
					$.data(this.element, 'slider', this);
				}
				return this;
			},

			relayout: function() {
				this._layout();
				return this;
			},

			/******************************+

						HELPERS

			- Any method that is not part of the public interface.
			- Place it underneath this comment block and write its signature like so:

			  					_fnName : function() {...}

			********************************/
			_removeSliderEventHandlers: function() {
				// Remove event listeners from handle1
				this.handle1.removeEventListener("keydown", this.handle1Keydown, false);
				this.handle1.removeEventListener("focus", this.showTooltip, false);
				this.handle1.removeEventListener("blur", this.hideTooltip, false);

				// Remove event listeners from handle2
				this.handle2.removeEventListener("keydown", this.handle2Keydown, false);
				this.handle2.removeEventListener("focus", this.handle2Keydown, false);
				this.handle2.removeEventListener("blur", this.handle2Keydown, false);

				// Remove event listeners from sliderElem
				this.sliderElem.removeEventListener("mouseenter", this.showTooltip, false);
				this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, false);
				this.sliderElem.removeEventListener("touchstart", this.mousedown, false);
				this.sliderElem.removeEventListener("mousedown", this.mousedown, false);
			},
			_bindNonQueryEventHandler: function(evt, callback) {
				if(this.eventToCallbackMap[evt]===undefined) {
					this.eventToCallbackMap[evt] = [];
				}
				this.eventToCallbackMap[evt].push(callback);
			},
			_cleanUpEventCallbacksMap: function() {
				var eventNames = Object.keys(this.eventToCallbackMap);
				for(var i = 0; i < eventNames.length; i++) {
					var eventName = eventNames[i];
					this.eventToCallbackMap[eventName] = null;
				}
			},
			_showTooltip: function() {
				if (this.options.tooltip_split === false ){
	            	this._addClass(this.tooltip, 'in');
	            	this.tooltip_min.style.display = 'none';
	            	this.tooltip_max.style.display = 'none';
		        } else {
		            this._addClass(this.tooltip_min, 'in');
		            this._addClass(this.tooltip_max, 'in');
		            this.tooltip.style.display = 'none';
		        }
				this.over = true;
			},
			_hideTooltip: function() {
				if (this.inDrag === false && this.alwaysShowTooltip !== true) {
					this._removeClass(this.tooltip, 'in');
					this._removeClass(this.tooltip_min, 'in');
					this._removeClass(this.tooltip_max, 'in');
				}
				this.over = false;
			},
			_layout: function() {
				var positionPercentages;

				if(this.options.reversed) {
					positionPercentages = [ 100 - this.percentage[0], this.percentage[1] ];
				} else {
					positionPercentages = [ this.percentage[0], this.percentage[1] ];
				}

				this.handle1.style[this.stylePos] = positionPercentages[0]+'%';
				this.handle2.style[this.stylePos] = positionPercentages[1]+'%';

				/* Position ticks and labels */
				if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
					var maxTickValue = Math.max.apply(Math, this.options.ticks);
					var minTickValue = Math.min.apply(Math, this.options.ticks);

					var styleSize = this.options.orientation === 'vertical' ? 'height' : 'width';
					var styleMargin = this.options.orientation === 'vertical' ? 'marginTop' : 'marginLeft';
					var labelSize = this.size / (this.options.ticks.length - 1);

					if (this.tickLabelContainer) {
						var extraMargin = 0;
						if (this.options.ticks_positions.length === 0) {
							this.tickLabelContainer.style[styleMargin] = -labelSize/2 + 'px';
							extraMargin = this.tickLabelContainer.offsetHeight;
						} else {
							/* Chidren are position absolute, calculate height by finding the max offsetHeight of a child */
							for (i = 0 ; i < this.tickLabelContainer.childNodes.length; i++) {
								if (this.tickLabelContainer.childNodes[i].offsetHeight > extraMargin) {
									extraMargin = this.tickLabelContainer.childNodes[i].offsetHeight;
								}
							}
						}
						if (this.options.orientation === 'horizontal') {
							this.sliderElem.style.marginBottom = extraMargin + 'px';
						}
					}
					for (var i = 0; i < this.options.ticks.length; i++) {

						var percentage = this.options.ticks_positions[i] ||
							100 * (this.options.ticks[i] - minTickValue) / (maxTickValue - minTickValue);

						this.ticks[i].style[this.stylePos] = percentage + '%';

						/* Set class labels to denote whether ticks are in the selection */
						this._removeClass(this.ticks[i], 'in-selection');
						if (!this.options.range) {
							if (this.options.selection === 'after' && percentage >= positionPercentages[0]){
								this._addClass(this.ticks[i], 'in-selection');
							} else if (this.options.selection === 'before' && percentage <= positionPercentages[0]) {
								this._addClass(this.ticks[i], 'in-selection');
							}
						} else if (percentage >= positionPercentages[0] && percentage <= positionPercentages[1]) {
							this._addClass(this.ticks[i], 'in-selection');
						}

						if (this.tickLabels[i]) {
							this.tickLabels[i].style[styleSize] = labelSize + 'px';

							if (this.options.ticks_positions[i] !== undefined) {
								this.tickLabels[i].style.position = 'absolute';
								this.tickLabels[i].style[this.stylePos] = this.options.ticks_positions[i] + '%';
								this.tickLabels[i].style[styleMargin] = -labelSize/2 + 'px';
							}
						}
					}
				}

				if (this.options.orientation === 'vertical') {
					this.trackLow.style.top = '0';
					this.trackLow.style.height = Math.min(positionPercentages[0], positionPercentages[1]) +'%';

					this.trackSelection.style.top = Math.min(positionPercentages[0], positionPercentages[1]) +'%';
					this.trackSelection.style.height = Math.abs(positionPercentages[0] - positionPercentages[1]) +'%';

					this.trackHigh.style.bottom = '0';
					this.trackHigh.style.height = (100 - Math.min(positionPercentages[0], positionPercentages[1]) - Math.abs(positionPercentages[0] - positionPercentages[1])) +'%';
				} else {
					this.trackLow.style.left = '0';
					this.trackLow.style.width = Math.min(positionPercentages[0], positionPercentages[1]) +'%';

					this.trackSelection.style.left = Math.min(positionPercentages[0], positionPercentages[1]) +'%';
					this.trackSelection.style.width = Math.abs(positionPercentages[0] - positionPercentages[1]) +'%';

					this.trackHigh.style.right = '0';
					this.trackHigh.style.width = (100 - Math.min(positionPercentages[0], positionPercentages[1]) - Math.abs(positionPercentages[0] - positionPercentages[1])) +'%';

			        var offset_min = this.tooltip_min.getBoundingClientRect();
			        var offset_max = this.tooltip_max.getBoundingClientRect();

			        if (offset_min.right > offset_max.left) {
			            this._removeClass(this.tooltip_max, 'top');
			            this._addClass(this.tooltip_max, 'bottom');
			            this.tooltip_max.style.top = 18 + 'px';
			        } else {
			            this._removeClass(this.tooltip_max, 'bottom');
			            this._addClass(this.tooltip_max, 'top');
			            this.tooltip_max.style.top = this.tooltip_min.style.top;
			        }
				}

				var formattedTooltipVal;

				if (this.options.range) {
					formattedTooltipVal = this.options.formatter(this.options.value);
					this._setText(this.tooltipInner, formattedTooltipVal);
					this.tooltip.style[this.stylePos] = (positionPercentages[1] + positionPercentages[0])/2 + '%';

					if (this.options.orientation === 'vertical') {
						this._css(this.tooltip, 'margin-top', -this.tooltip.offsetHeight / 2 + 'px');
					} else {
						this._css(this.tooltip, 'margin-left', -this.tooltip.offsetWidth / 2 + 'px');
					}

					if (this.options.orientation === 'vertical') {
						this._css(this.tooltip, 'margin-top', -this.tooltip.offsetHeight / 2 + 'px');
					} else {
						this._css(this.tooltip, 'margin-left', -this.tooltip.offsetWidth / 2 + 'px');
					}

					var innerTooltipMinText = this.options.formatter(this.options.value[0]);
					this._setText(this.tooltipInner_min, innerTooltipMinText);

					var innerTooltipMaxText = this.options.formatter(this.options.value[1]);
					this._setText(this.tooltipInner_max, innerTooltipMaxText);

					this.tooltip_min.style[this.stylePos] = positionPercentages[0] + '%';

					if (this.options.orientation === 'vertical') {
						this._css(this.tooltip_min, 'margin-top', -this.tooltip_min.offsetHeight / 2 + 'px');
					} else {
						this._css(this.tooltip_min, 'margin-left', -this.tooltip_min.offsetWidth / 2 + 'px');
					}

					this.tooltip_max.style[this.stylePos] = positionPercentages[1] + '%';

					if (this.options.orientation === 'vertical') {
						this._css(this.tooltip_max, 'margin-top', -this.tooltip_max.offsetHeight / 2 + 'px');
					} else {
						this._css(this.tooltip_max, 'margin-left', -this.tooltip_max.offsetWidth / 2 + 'px');
					}
				} else {
					formattedTooltipVal = this.options.formatter(this.options.value[0]);
					this._setText(this.tooltipInner, formattedTooltipVal);

					this.tooltip.style[this.stylePos] = positionPercentages[0] + '%';
					if (this.options.orientation === 'vertical') {
						this._css(this.tooltip, 'margin-top', -this.tooltip.offsetHeight / 2 + 'px');
					} else {
						this._css(this.tooltip, 'margin-left', -this.tooltip.offsetWidth / 2 + 'px');
					}
				}
			},
			_removeProperty: function(element, prop) {
				if (element.style.removeProperty) {
				    element.style.removeProperty(prop);
				} else {
				    element.style.removeAttribute(prop);
				}
			},
			_mousedown: function(ev) {
				if(!this.options.enabled) {
					return false;
				}

				this.offset = this._offset(this.sliderElem);
				this.size = this.sliderElem[this.sizePos];

				var percentage = this._getPercentage(ev);

				if (this.options.range) {
					var diff1 = Math.abs(this.percentage[0] - percentage);
					var diff2 = Math.abs(this.percentage[1] - percentage);
					this.dragged = (diff1 < diff2) ? 0 : 1;
				} else {
					this.dragged = 0;
				}

				this.percentage[this.dragged] = this.options.reversed ? 100 - percentage : percentage;
				this._layout();

				if (this.touchCapable) {
					document.removeEventListener("touchmove", this.mousemove, false);
					document.removeEventListener("touchend", this.mouseup, false);
				}

				if(this.mousemove){
					document.removeEventListener("mousemove", this.mousemove, false);
				}
				if(this.mouseup){
					document.removeEventListener("mouseup", this.mouseup, false);
				}

				this.mousemove = this._mousemove.bind(this);
				this.mouseup = this._mouseup.bind(this);

				if (this.touchCapable) {
					// Touch: Bind touch events:
					document.addEventListener("touchmove", this.mousemove, false);
					document.addEventListener("touchend", this.mouseup, false);
				}
				// Bind mouse events:
				document.addEventListener("mousemove", this.mousemove, false);
				document.addEventListener("mouseup", this.mouseup, false);

				this.inDrag = true;
				var newValue = this._calculateValue();

				this._trigger('slideStart', newValue);

				this._setDataVal(newValue);
				this.setValue(newValue, false, true);

				this._pauseEvent(ev);

				if (this.options.focus) {
					this._triggerFocusOnHandle(this.dragged);
				}

				return true;
			},
			_triggerFocusOnHandle: function(handleIdx) {
				if(handleIdx === 0) {
					this.handle1.focus();
				}
				if(handleIdx === 1) {
					this.handle2.focus();
				}
			},
			_keydown: function(handleIdx, ev) {
				if(!this.options.enabled) {
					return false;
				}

				var dir;
				switch (ev.keyCode) {
					case 37: // left
					case 40: // down
						dir = -1;
						break;
					case 39: // right
					case 38: // up
						dir = 1;
						break;
				}
				if (!dir) {
					return;
				}

				// use natural arrow keys instead of from min to max
				if (this.options.natural_arrow_keys) {
					var ifVerticalAndNotReversed = (this.options.orientation === 'vertical' && !this.options.reversed);
					var ifHorizontalAndReversed = (this.options.orientation === 'horizontal' && this.options.reversed);

					if (ifVerticalAndNotReversed || ifHorizontalAndReversed) {
						dir = -dir;
					}
				}

				var val = this.options.value[handleIdx] + dir * this.options.step;
				if (this.options.range) {
					val = [ (!handleIdx) ? val : this.options.value[0],
						    ( handleIdx) ? val : this.options.value[1]];
				}

				this._trigger('slideStart', val);
				this._setDataVal(val);
				this.setValue(val, true, true);

				this._trigger('slideStop', val);
				this._setDataVal(val);
				this._layout();

				this._pauseEvent(ev);

				return false;
			},
			_pauseEvent: function(ev) {
				if(ev.stopPropagation) {
					ev.stopPropagation();
				}
			    if(ev.preventDefault) {
			    	ev.preventDefault();
			    }
			    ev.cancelBubble=true;
			    ev.returnValue=false;
			},
			_mousemove: function(ev) {
				if(!this.options.enabled) {
					return false;
				}

				var percentage = this._getPercentage(ev);
				this._adjustPercentageForRangeSliders(percentage);
				this.percentage[this.dragged] = this.options.reversed ? 100 - percentage : percentage;
				this._layout();

				var val = this._calculateValue(true);
				this.setValue(val, true, true);

				return false;
			},
			_adjustPercentageForRangeSliders: function(percentage) {
				if (this.options.range) {
					var precision = this._getNumDigitsAfterDecimalPlace(percentage);
					precision = precision ? precision - 1 : 0;
					var percentageWithAdjustedPrecision = this._applyToFixedAndParseFloat(percentage, precision);
					if (this.dragged === 0 && this._applyToFixedAndParseFloat(this.percentage[1], precision) < percentageWithAdjustedPrecision) {
						this.percentage[0] = this.percentage[1];
						this.dragged = 1;
					} else if (this.dragged === 1 && this._applyToFixedAndParseFloat(this.percentage[0], precision) > percentageWithAdjustedPrecision) {
						this.percentage[1] = this.percentage[0];
						this.dragged = 0;
					}
				}
			},
			_mouseup: function() {
				if(!this.options.enabled) {
					return false;
				}
				if (this.touchCapable) {
					// Touch: Unbind touch event handlers:
					document.removeEventListener("touchmove", this.mousemove, false);
					document.removeEventListener("touchend", this.mouseup, false);
				}
                // Unbind mouse event handlers:
                document.removeEventListener("mousemove", this.mousemove, false);
                document.removeEventListener("mouseup", this.mouseup, false);

				this.inDrag = false;
				if (this.over === false) {
					this._hideTooltip();
				}
				var val = this._calculateValue(true);

				this._layout();
				this._trigger('slideStop', val);
				this._setDataVal(val);

				return false;
			},
			_calculateValue: function(snapToClosestTick) {
				var val;
				if (this.options.range) {
					val = [this.options.min,this.options.max];
			        if (this.percentage[0] !== 0){
			            val[0] = this._toValue(this.percentage[0]);
			            val[0] = this._applyPrecision(val[0]);
			        }
			        if (this.percentage[1] !== 100){
			            val[1] = this._toValue(this.percentage[1]);
			            val[1] = this._applyPrecision(val[1]);
			        }
				} else {
		            val = this._toValue(this.percentage[0]);
					val = parseFloat(val);
					val = this._applyPrecision(val);
				}

				if (snapToClosestTick) {
					var min = [val, Infinity];
					for (var i = 0; i < this.options.ticks.length; i++) {
						var diff = Math.abs(this.options.ticks[i] - val);
						if (diff <= min[1]) {
							min = [this.options.ticks[i], diff];
						}
					}
					if (min[1] <= this.options.ticks_snap_bounds) {
						return min[0];
					}
				}

				return val;
			},
			_applyPrecision: function(val) {
				var precision = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);
				return this._applyToFixedAndParseFloat(val, precision);
			},
			_getNumDigitsAfterDecimalPlace: function(num) {
				var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
				if (!match) { return 0; }
				return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
			},
			_applyToFixedAndParseFloat: function(num, toFixedInput) {
				var truncatedNum = num.toFixed(toFixedInput);
				return parseFloat(truncatedNum);
			},
			/*
				Credits to Mike Samuel for the following method!
				Source: http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
			*/
			_getPercentage: function(ev) {
				if (this.touchCapable && (ev.type === 'touchstart' || ev.type === 'touchmove')) {
					ev = ev.touches[0];
				}

				var eventPosition = ev[this.mousePos];
				var sliderOffset = this.offset[this.stylePos];
				var distanceToSlide = eventPosition - sliderOffset;
				// Calculate what percent of the length the slider handle has slid
				var percentage = (distanceToSlide / this.size) * 100;
				percentage = Math.round(percentage / this.percentage[2]) * this.percentage[2];

				// Make sure the percent is within the bounds of the slider.
				// 0% corresponds to the 'min' value of the slide
				// 100% corresponds to the 'max' value of the slide
				return Math.max(0, Math.min(100, percentage));
			},
			_validateInputValue: function(val) {
				if (typeof val === 'number') {
					return val;
				} else if (Array.isArray(val)) {
					this._validateArray(val);
					return val;
				} else {
					throw new Error( ErrorMsgs.formatInvalidInputErrorMsg(val) );
				}
			},
			_validateArray: function(val) {
				for(var i = 0; i < val.length; i++) {
					var input =  val[i];
					if (typeof input !== 'number') { throw new Error( ErrorMsgs.formatInvalidInputErrorMsg(input) ); }
				}
			},
			_setDataVal: function(val) {
				var value = "value: '" + val + "'";
				this.element.setAttribute('data', value);
				this.element.setAttribute('value', val);
                this.element.value = val;
			},
			_trigger: function(evt, val) {
				val = (val || val === 0) ? val : undefined;

				var callbackFnArray = this.eventToCallbackMap[evt];
				if(callbackFnArray && callbackFnArray.length) {
					for(var i = 0; i < callbackFnArray.length; i++) {
						var callbackFn = callbackFnArray[i];
						callbackFn(val);
					}
				}

				/* If JQuery exists, trigger JQuery events */
				if($) {
					this._triggerJQueryEvent(evt, val);
				}
			},
			_triggerJQueryEvent: function(evt, val) {
				var eventData = {
					type: evt,
					value: val
				};
				this.$element.trigger(eventData);
				this.$sliderElem.trigger(eventData);
			},
			_unbindJQueryEventHandlers: function() {
				this.$element.off();
				this.$sliderElem.off();
			},
			_setText: function(element, text) {
				if(typeof element.innerText !== "undefined") {
			 		element.innerText = text;
			 	} else if(typeof element.textContent !== "undefined") {
			 		element.textContent = text;
			 	}
			},
			_removeClass: function(element, classString) {
				var classes = classString.split(" ");
				var newClasses = element.className;

				for(var i = 0; i < classes.length; i++) {
					var classTag = classes[i];
					var regex = new RegExp("(?:\\s|^)" + classTag + "(?:\\s|$)");
					newClasses = newClasses.replace(regex, " ");
				}

				element.className = newClasses.trim();
			},
			_addClass: function(element, classString) {
				var classes = classString.split(" ");
				var newClasses = element.className;

				for(var i = 0; i < classes.length; i++) {
					var classTag = classes[i];
					var regex = new RegExp("(?:\\s|^)" + classTag + "(?:\\s|$)");
					var ifClassExists = regex.test(newClasses);

					if(!ifClassExists) {
						newClasses += " " + classTag;
					}
				}

				element.className = newClasses.trim();
			},
			_offsetLeft: function(obj){
				var offsetLeft = obj.offsetLeft;
				while((obj = obj.offsetParent) && !isNaN(obj.offsetLeft)){
					offsetLeft += obj.offsetLeft;
				}
				return offsetLeft;
			},
			_offsetTop: function(obj){
				var offsetTop = obj.offsetTop;
				while((obj = obj.offsetParent) && !isNaN(obj.offsetTop)){
					offsetTop += obj.offsetTop;
				}
				return offsetTop;
			},
		    _offset: function (obj) {
				return {
					left: this._offsetLeft(obj),
					top: this._offsetTop(obj)
				};
		    },
			_css: function(elementRef, styleName, value) {
                if ($) {
                    $.style(elementRef, styleName, value);
                } else {
                    var style = styleName.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function (all, letter) {
                        return letter.toUpperCase();
                    });
                    elementRef.style[style] = value;
                }
			},
			_toValue: function(percentage) {
				return this.options.scale.toValue.apply(this, [percentage]);
			},
			_toPercentage: function(value) {
				return this.options.scale.toPercentage.apply(this, [value]);
			}

		};

		/*********************************

			Attach to global namespace

		*********************************/
		if($) {
			var namespace = $.fn.slider ? 'bootstrapSlider' : 'slider';
			$.bridget(namespace, Slider);
		}

	})( $ );

	return Slider;
}));

!function(root, factory) {
	 if (typeof define === 'function' && define.amd) {
		 define(['jquery'], factory);
	 } else if (typeof exports === 'object') {
		 module.exports = factory(require('jquery'));
	 } else {
		 factory(root.jQuery);
	 }
}(this, function($) {

/*!
 @package noty - jQuery Notification Plugin
 @version version: 2.4.0
 @contributors https://github.com/needim/noty/graphs/contributors

 @documentation Examples and Documentation - http://needim.github.com/noty/

 @license Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php
 */

if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {
    }

    F.prototype = o;
    return new F();
  };
}

var NotyObject = {

  init: function (options) {

    // Mix in the passed in options with the default options
    this.options = $.extend({}, $.noty.defaults, options);

    this.options.layout = (this.options.custom) ? $.noty.layouts['inline'] : $.noty.layouts[this.options.layout];

    if ($.noty.themes[this.options.theme]) {
      this.options.theme = $.noty.themes[this.options.theme];
      if (this.options.theme.template)
        this.options.template = this.options.theme.template;

      if (this.options.theme.animation)
        this.options.animation = this.options.theme.animation;
    }
    else {
      this.options.themeClassName = this.options.theme;
    }

    this.options = $.extend({}, this.options, this.options.layout.options);

    if (this.options.id) {
      if ($.noty.store[this.options.id]) {
        return $.noty.store[this.options.id];
      }
    } else {
      this.options.id = 'noty_' + (new Date().getTime() * Math.floor(Math.random() * 1000000));
    }

    // Build the noty dom initial structure
    this._build();

    // return this so we can chain/use the bridge with less code.
    return this;
  }, // end init

  _build: function () {

    // Generating noty bar
    var $bar = $('<div class="noty_bar noty_type_' + this.options.type + '"></div>').attr('id', this.options.id);
    $bar.append(this.options.template).find('.noty_text').html(this.options.text);

    this.$bar = (this.options.layout.parent.object !== null) ? $(this.options.layout.parent.object).css(this.options.layout.parent.css).append($bar) : $bar;

    if (this.options.themeClassName)
      this.$bar.addClass(this.options.themeClassName).addClass('noty_container_type_' + this.options.type);

    // Set buttons if available
    if (this.options.buttons) {

      var $buttons;
      // Try find container for buttons in presented template, and create it if not found
      if (this.$bar.find('.noty_buttons').length > 0) {
        $buttons = this.$bar.find('.noty_buttons');
      } else {
        $buttons = $('<div/>').addClass('noty_buttons');
        (this.options.layout.parent.object !== null) ? this.$bar.find('.noty_bar').append($buttons) : this.$bar.append($buttons);
      }

      var self = this;

      $.each(this.options.buttons, function (i, button) {
        var $button = $('<button/>').addClass((button.addClass) ? button.addClass : 'gray').html(button.text).attr('id', button.id ? button.id : 'button-' + i)
            .attr('title', button.title)
            .appendTo($buttons)
            .on('click', function (event) {
              if ($.isFunction(button.onClick)) {
                button.onClick.call($button, self, event);
              }
            });
      });
    } else {
      // If buttons is not available, then remove containers if exist
      this.$bar.find('.noty_buttons').remove();
    }

    if (this.options.progressBar && this.options.timeout) {
      var $progressBar = $('<div/>').addClass('noty_progress_bar');
      (this.options.layout.parent.object !== null) ? this.$bar.find('.noty_bar').append($progressBar) : this.$bar.append($progressBar);
    }

    // For easy access
    this.$message     = this.$bar.find('.noty_message');
    this.$closeButton = this.$bar.find('.noty_close');
    this.$buttons     = this.$bar.find('.noty_buttons');
    this.$progressBar = this.$bar.find('.noty_progress_bar');

    $.noty.store[this.options.id] = this; // store noty for api

  }, // end _build

  show: function () {

    var self = this;

    (self.options.custom) ? self.options.custom.find(self.options.layout.container.selector).append(self.$bar) : $(self.options.layout.container.selector).append(self.$bar);

    if (self.options.theme && self.options.theme.style)
      self.options.theme.style.apply(self);

    ($.type(self.options.layout.css) === 'function') ? this.options.layout.css.apply(self.$bar) : self.$bar.css(this.options.layout.css || {});

    self.$bar.addClass(self.options.layout.addClass);

    self.options.layout.container.style.apply($(self.options.layout.container.selector), [self.options.within]);

    self.showing = true;

    if (self.options.theme && self.options.theme.style)
      self.options.theme.callback.onShow.apply(this);

    if ($.inArray('click', self.options.closeWith) > -1)
      self.$bar.css('cursor', 'pointer').on('click', function (evt) {
        self.stopPropagation(evt);
        if (self.options.callback.onCloseClick) {
          self.options.callback.onCloseClick.apply(self);
        }
        self.close();
      });

    if ($.inArray('hover', self.options.closeWith) > -1)
      self.$bar.one('mouseenter', function () {
        self.close();
      });

    if ($.inArray('button', self.options.closeWith) > -1)
      self.$closeButton.one('click', function (evt) {
        self.stopPropagation(evt);
        self.close();
      });

    if ($.inArray('button', self.options.closeWith) == -1)
      self.$closeButton.remove();

    if (self.options.callback.beforeShow)
      self.options.callback.beforeShow.apply(self);

    if (typeof self.options.animation.open == 'string') {
      self.animationTypeOpen = 'css';
      self.$bar.css('min-height', self.$bar.innerHeight());
      self.$bar.on('click', function (e) {
        self.wasClicked = true;
      });
      self.$bar.show();

      if (self.options.callback.onShow)
        self.options.callback.onShow.apply(self);

      self.$bar.addClass(self.options.animation.open).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        if (self.options.callback.afterShow) self.options.callback.afterShow.apply(self);
        self.showing = false;
        self.shown   = true;
        self.bindTimeout();
        if (self.hasOwnProperty('wasClicked')) {
          self.$bar.off('click', function (e) {
            self.wasClicked = true;
          });
          self.close();
        }
      });

    } else if (typeof self.options.animation.open == 'object' && self.options.animation.open == null) {
      self.animationTypeOpen = 'none';
      self.showing           = false;
      self.shown             = true;
      self.$bar.show();
      self.bindTimeout();

      if (self.options.callback.onShow)
        self.options.callback.onShow.apply(self);

      self.$bar.queue(function () {
        if (self.options.callback.afterShow)
          self.options.callback.afterShow.apply(self);
      });

    } else {
      self.animationTypeOpen = 'anim';

      if (self.options.callback.onShow)
        self.options.callback.onShow.apply(self);

      self.$bar.animate(
          self.options.animation.open,
          self.options.animation.speed,
          self.options.animation.easing,
          function () {
            if (self.options.callback.afterShow) self.options.callback.afterShow.apply(self);
            self.showing = false;
            self.shown   = true;
            self.bindTimeout();
          });
    }

    return this;

  }, // end show

  bindTimeout: function() {
    var self = this;
    // If noty is have a timeout option
    if (self.options.timeout) {

      if (self.options.progressBar && self.$progressBar) {
        self.$progressBar.css({
          transition: 'all 100ms linear'
        });

        self.progressPercentage = (self.$progressBar.width() / (self.options.timeout / 100));

        self.intervalId = setInterval(function() {
          self.$progressBar.width((self.$progressBar.width() - self.progressPercentage));
        }, 100);
      }

      self.queueClose(self.options.timeout);
      self.$bar.on('mouseenter', self.dequeueClose.bind(self));
      self.$bar.on('mouseleave', self.queueClose.bind(self, self.options.timeout));
    }

  },

  dequeueClose: function () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.$progressBar.css('width', '100%');
      this.intervalId = null;
    }

    if (!this.closeTimer) return;
    clearTimeout(this.closeTimer);
    this.closeTimer = null;
  },

  queueClose: function (timeout) {
    var self = this;

    if (!self.intervalId && self.options.progressBar) {
      self.intervalId = setInterval(function() {
        self.$progressBar.width((self.$progressBar.width() - self.progressPercentage));
      }, 100);
    }

    if (this.closeTimer) return;
    self.closeTimer = window.setTimeout(function () {
      self.close();
    }, timeout);
    return self.closeTimer
  },

  close: function () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;

      if (this.$progressBar) {
        this.$progressBar.css('width', '0%');
      }
    }

    if (this.closeTimer) this.dequeueClose();

    if (this.closed) return;
    if (this.$bar && this.$bar.hasClass('i-am-closing-now')) return;

    var self = this;

    if (this.showing && (this.animationTypeOpen == 'anim' || this.animationTypeOpen == 'none')) {
      self.$bar.queue(
          function () {
            self.close.apply(self);
          }
      );
      return;
    } else if (this.showing && this.animationTypeOpen == 'css') {
      self.$bar.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        self.close();
      });
    }

    if (!this.shown && !this.showing) { // If we are still waiting in the queue just delete from queue
      var queue = [];
      $.each($.noty.queue, function (i, n) {
        if (n.options.id != self.options.id) {
          queue.push(n);
        }
      });
      $.noty.queue = queue;
      return;
    }

    self.$bar.addClass('i-am-closing-now');

    if (self.options.callback.onClose) {
      self.options.callback.onClose.apply(self);
    }

    if (typeof self.options.animation.close == 'string') {
      self.$bar.removeClass(self.options.animation.open).addClass(self.options.animation.close).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        if (self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
        self.closeCleanUp();
      });

    } else if (typeof self.options.animation.close == 'object' && self.options.animation.close == null) {
      self.$bar.dequeue().hide(0, function() {
        if (self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
        self.closeCleanUp();
      });

    } else {
      self.$bar.clearQueue().stop().animate(
          self.options.animation.close,
          self.options.animation.speed,
          self.options.animation.easing,
          function () {
            if (self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
          })
          .promise().done(function () {
        self.closeCleanUp();
      });
    }

  }, // end close

  closeCleanUp: function () {

    var self = this;

    // Modal Cleaning
    if (self.options.modal) {
      $.notyRenderer.setModalCount(-1);
      if ($.notyRenderer.getModalCount() == 0 && !$.noty.queue.length) $('.noty_modal').fadeOut(self.options.animation.fadeSpeed, function () {
        $(this).remove();
      });
    }

    // Layout Cleaning
    $.notyRenderer.setLayoutCountFor(self, -1);
    if ($.notyRenderer.getLayoutCountFor(self) == 0) $(self.options.layout.container.selector).remove();

    // Make sure self.$bar has not been removed before attempting to remove it
    if (typeof self.$bar !== 'undefined' && self.$bar !== null) {

      if (typeof self.options.animation.close == 'string') {
        self.$bar.css('transition', 'all 10ms ease').css('border', 0).css('margin', 0).height(0);
        self.$bar.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
          self.$bar.remove();
          self.$bar   = null;
          self.closed = true;

          if (self.options.theme.callback && self.options.theme.callback.onClose) {
            self.options.theme.callback.onClose.apply(self);
          }

          self.handleNext();
        });
      } else {
        self.$bar.remove();
        self.$bar   = null;
        self.closed = true;

        self.handleNext();
      }
    } else {
      self.handleNext();
    }

  }, // end close clean up

  handleNext: function () {
    var self = this;

    delete $.noty.store[self.options.id]; // deleting noty from store

    if (self.options.theme.callback && self.options.theme.callback.onClose) {
      self.options.theme.callback.onClose.apply(self);
    }

    if (!self.options.dismissQueue) {
      // Queue render
      $.noty.ontap = true;

      $.notyRenderer.render();
    }

    if (self.options.maxVisible > 0 && self.options.dismissQueue) {
      $.notyRenderer.render();
    }
  },

  setText: function (text) {
    if (!this.closed) {
      this.options.text = text;
      this.$bar.find('.noty_text').html(text);
    }
    return this;
  },

  setType: function (type) {
    if (!this.closed) {
      this.options.type = type;
      this.options.theme.style.apply(this);
      this.options.theme.callback.onShow.apply(this);
    }
    return this;
  },

  setTimeout: function (time) {
    if (!this.closed) {
      var self             = this;
      this.options.timeout = time;
      self.$bar.delay(self.options.timeout).promise().done(function () {
        self.close();
      });
    }
    return this;
  },

  stopPropagation: function (evt) {
    evt = evt || window.event;
    if (typeof evt.stopPropagation !== "undefined") {
      evt.stopPropagation();
    }
    else {
      evt.cancelBubble = true;
    }
  },

  closed : false,
  showing: false,
  shown  : false

}; // end NotyObject

$.notyRenderer = {};

$.notyRenderer.init = function (options) {

  // Renderer creates a new noty
  var notification = Object.create(NotyObject).init(options);

  if (notification.options.killer)
    $.noty.closeAll();

  (notification.options.force) ? $.noty.queue.unshift(notification) : $.noty.queue.push(notification);

  $.notyRenderer.render();

  return ($.noty.returns == 'object') ? notification : notification.options.id;
};

$.notyRenderer.render = function () {

  var instance = $.noty.queue[0];

  if ($.type(instance) === 'object') {
    if (instance.options.dismissQueue) {
      if (instance.options.maxVisible > 0) {
        if ($(instance.options.layout.container.selector + ' > li').length < instance.options.maxVisible) {
          $.notyRenderer.show($.noty.queue.shift());
        }
        else {

        }
      }
      else {
        $.notyRenderer.show($.noty.queue.shift());
      }
    }
    else {
      if ($.noty.ontap) {
        $.notyRenderer.show($.noty.queue.shift());
        $.noty.ontap = false;
      }
    }
  }
  else {
    $.noty.ontap = true; // Queue is over
  }

};

$.notyRenderer.show = function (notification) {

  if (notification.options.modal) {
    $.notyRenderer.createModalFor(notification);
    $.notyRenderer.setModalCount(+1);
  }

  // Where is the container?
  if (notification.options.custom) {
    if (notification.options.custom.find(notification.options.layout.container.selector).length == 0) {
      notification.options.custom.append($(notification.options.layout.container.object).addClass('i-am-new'));
    }
    else {
      notification.options.custom.find(notification.options.layout.container.selector).removeClass('i-am-new');
    }
  }
  else {
    if ($(notification.options.layout.container.selector).length == 0) {
      $('body').append($(notification.options.layout.container.object).addClass('i-am-new'));
    }
    else {
      $(notification.options.layout.container.selector).removeClass('i-am-new');
    }
  }

  $.notyRenderer.setLayoutCountFor(notification, +1);

  notification.show();
};

$.notyRenderer.createModalFor = function (notification) {
  if ($('.noty_modal').length == 0) {
    var modal = $('<div/>').addClass('noty_modal').addClass(notification.options.theme).data('noty_modal_count', 0);

    if (notification.options.theme.modal && notification.options.theme.modal.css)
      modal.css(notification.options.theme.modal.css);

    modal.prependTo($('body')).fadeIn(notification.options.animation.fadeSpeed);

    if ($.inArray('backdrop', notification.options.closeWith) > -1)
      modal.on('click', function () {
        $.noty.closeAll();
      });
  }
};

$.notyRenderer.getLayoutCountFor = function (notification) {
  return $(notification.options.layout.container.selector).data('noty_layout_count') || 0;
};

$.notyRenderer.setLayoutCountFor = function (notification, arg) {
  return $(notification.options.layout.container.selector).data('noty_layout_count', $.notyRenderer.getLayoutCountFor(notification) + arg);
};

$.notyRenderer.getModalCount = function () {
  return $('.noty_modal').data('noty_modal_count') || 0;
};

$.notyRenderer.setModalCount = function (arg) {
  return $('.noty_modal').data('noty_modal_count', $.notyRenderer.getModalCount() + arg);
};

// This is for custom container
$.fn.noty = function (options) {
  options.custom = $(this);
  return $.notyRenderer.init(options);
};

$.noty         = {};
$.noty.queue   = [];
$.noty.ontap   = true;
$.noty.layouts = {};
$.noty.themes  = {};
$.noty.returns = 'object';
$.noty.store   = {};

$.noty.get = function (id) {
  return $.noty.store.hasOwnProperty(id) ? $.noty.store[id] : false;
};

$.noty.close = function (id) {
  return $.noty.get(id) ? $.noty.get(id).close() : false;
};

$.noty.setText = function (id, text) {
  return $.noty.get(id) ? $.noty.get(id).setText(text) : false;
};

$.noty.setType = function (id, type) {
  return $.noty.get(id) ? $.noty.get(id).setType(type) : false;
};

$.noty.clearQueue = function () {
  $.noty.queue = [];
};

$.noty.closeAll = function () {
  $.noty.clearQueue();
  $.each($.noty.store, function (id, noty) {
    noty.close();
  });
};

var windowAlert = window.alert;

$.noty.consumeAlert = function (options) {
  window.alert = function (text) {
    if (options)
      options.text = text;
    else
      options = {text: text};

    $.notyRenderer.init(options);
  };
};

$.noty.stopConsumeAlert = function () {
  window.alert = windowAlert;
};

$.noty.defaults = {
  layout      : 'topRight',
  theme       : 'relax',
  type        : 'alert',
  text        : '',
  progressBar : false,
  dismissQueue: true,
  template    : '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
  animation   : {
    open     : {height: 'toggle'},
    close    : {height: 'toggle'},
    easing   : 'swing',
    speed    : 500,
    fadeSpeed: 'fast'
  },
  timeout     : false,
  force       : false,
  modal       : false,
  maxVisible  : 5,
  killer      : false,
  closeWith   : ['click'],
  callback    : {
    beforeShow  : function () {
    },
    onShow      : function () {
    },
    afterShow   : function () {
    },
    onClose     : function () {
    },
    afterClose  : function () {
    },
    onCloseClick: function () {
    }
  },
  buttons     : false
};

$(window).on('resize', function () {
  $.each($.noty.layouts, function (index, layout) {
    layout.container.style.apply($(layout.container.selector));
  });
});

// Helpers
window.noty = function noty(options) {
  return $.notyRenderer.init(options);
};

$.noty.layouts.bottom = {
    name     : 'bottom',
    options  : {},
    container: {
        object  : '<ul id="noty_bottom_layout_container" />',
        selector: 'ul#noty_bottom_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 0,
                left         : '5%',
                position     : 'fixed',
                width        : '90%',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 9999999
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none'
    },
    addClass : ''
};

$.noty.layouts.bottomCenter = {
    name     : 'bottomCenter',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_bottomCenter_layout_container" />',
        selector: 'ul#noty_bottomCenter_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 20,
                left         : 0,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            $(this).css({
                left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px'
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};


$.noty.layouts.bottomLeft = {
    name     : 'bottomLeft',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_bottomLeft_layout_container" />',
        selector: 'ul#noty_bottomLeft_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 20,
                left         : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    left: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.bottomRight = {
    name     : 'bottomRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_bottomRight_layout_container" />',
        selector: 'ul#noty_bottomRight_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 20,
                right        : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.center = {
    name     : 'center',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_center_layout_container" />',
        selector: 'ul#noty_center_layout_container',
        style   : function() {
            $(this).css({
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            // getting hidden height
            var dupe = $(this).clone().css({visibility: "hidden", display: "block", position: "absolute", top: 0, left: 0}).attr('id', 'dupe');
            $("body").append(dupe);
            dupe.find('.i-am-closing-now').remove();
            dupe.find('li').css('display', 'block');
            var actual_height = dupe.height();
            dupe.remove();

            if($(this).hasClass('i-am-new')) {
                $(this).css({
                    left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px',
                    top : ($(window).height() - actual_height) / 2 + 'px'
                });
            }
            else {
                $(this).animate({
                    left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px',
                    top : ($(window).height() - actual_height) / 2 + 'px'
                }, 500);
            }

        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.centerLeft = {
    name     : 'centerLeft',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_centerLeft_layout_container" />',
        selector: 'ul#noty_centerLeft_layout_container',
        style   : function() {
            $(this).css({
                left         : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            // getting hidden height
            var dupe = $(this).clone().css({visibility: "hidden", display: "block", position: "absolute", top: 0, left: 0}).attr('id', 'dupe');
            $("body").append(dupe);
            dupe.find('.i-am-closing-now').remove();
            dupe.find('li').css('display', 'block');
            var actual_height = dupe.height();
            dupe.remove();

            if($(this).hasClass('i-am-new')) {
                $(this).css({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                });
            }
            else {
                $(this).animate({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                }, 500);
            }

            if(window.innerWidth < 600) {
                $(this).css({
                    left: 5
                });
            }

        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};

$.noty.layouts.centerRight = {
    name     : 'centerRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_centerRight_layout_container" />',
        selector: 'ul#noty_centerRight_layout_container',
        style   : function() {
            $(this).css({
                right        : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            // getting hidden height
            var dupe = $(this).clone().css({visibility: "hidden", display: "block", position: "absolute", top: 0, left: 0}).attr('id', 'dupe');
            $("body").append(dupe);
            dupe.find('.i-am-closing-now').remove();
            dupe.find('li').css('display', 'block');
            var actual_height = dupe.height();
            dupe.remove();

            if($(this).hasClass('i-am-new')) {
                $(this).css({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                });
            }
            else {
                $(this).animate({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                }, 500);
            }

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }

        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.inline = {
    name     : 'inline',
    options  : {},
    container: {
        object  : '<ul class="noty_inline_layout_container" />',
        selector: 'ul.noty_inline_layout_container',
        style   : function() {
            $(this).css({
                width        : '100%',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 9999999
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none'
    },
    addClass : ''
};
$.noty.layouts.top = {
    name     : 'top',
    options  : {},
    container: {
        object  : '<ul id="noty_top_layout_container" />',
        selector: 'ul#noty_top_layout_container',
        style   : function() {
            $(this).css({
                top          : 0,
                left         : '5%',
                position     : 'fixed',
                width        : '90%',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 9999999
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none'
    },
    addClass : ''
};
$.noty.layouts.topCenter = {
    name     : 'topCenter',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topCenter_layout_container" />',
        selector: 'ul#noty_topCenter_layout_container',
        style   : function() {
            $(this).css({
                top          : 20,
                left         : 0,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            $(this).css({
                left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px'
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};

$.noty.layouts.topLeft = {
    name     : 'topLeft',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topLeft_layout_container" />',
        selector: 'ul#noty_topLeft_layout_container',
        style   : function() {
            $(this).css({
                top          : 20,
                left         : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    left: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.topRight = {
    name     : 'topRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topRight_layout_container" />',
        selector: 'ul#noty_topRight_layout_container',
        style   : function() {
            $(this).css({
                top          : 20,
                right        : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.themes.bootstrapTheme = {
  name    : 'bootstrapTheme',
  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0,
      wordBreak      : 'break-all'
    }
  },
  style   : function () {

    var containerSelector = this.options.layout.container.selector;
    $(containerSelector).addClass('list-group');

    this.$closeButton.append('<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>');
    this.$closeButton.addClass('close');

    this.$bar.addClass("list-group-item").css('padding', '0px').css('position', 'relative');

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    switch (this.options.type) {
      case 'alert':
      case 'notification':
        this.$bar.addClass("list-group-item-info");
        break;
      case 'warning':
        this.$bar.addClass("list-group-item-warning");
        break;
      case 'error':
        this.$bar.addClass("list-group-item-danger");
        break;
      case 'information':
        this.$bar.addClass("list-group-item-info");
        break;
      case 'success':
        this.$bar.addClass("list-group-item-success");
        break;
    }

    this.$message.css({
      textAlign: 'center',
      padding  : '8px 10px 9px',
      width    : 'auto',
      position : 'relative'
    });
  },
  callback: {
    onShow : function () { },
    onClose: function () { }
  }
};


$.noty.themes.defaultTheme = {
  name    : 'defaultTheme',
  helpers : {
    borderFix: function () {
      if (this.options.dismissQueue) {
        var selector = this.options.layout.container.selector + ' ' + this.options.layout.parent.selector;
        switch (this.options.layout.name) {
          case 'top':
            $(selector).css({borderRadius: '0px 0px 0px 0px'});
            $(selector).last().css({borderRadius: '0px 0px 5px 5px'});
            break;
          case 'topCenter':
          case 'topLeft':
          case 'topRight':
          case 'bottomCenter':
          case 'bottomLeft':
          case 'bottomRight':
          case 'center':
          case 'centerLeft':
          case 'centerRight':
          case 'inline':
            $(selector).css({borderRadius: '0px 0px 0px 0px'});
            $(selector).first().css({'border-top-left-radius': '5px', 'border-top-right-radius': '5px'});
            $(selector).last().css({'border-bottom-left-radius': '5px', 'border-bottom-right-radius': '5px'});
            break;
          case 'bottom':
            $(selector).css({borderRadius: '0px 0px 0px 0px'});
            $(selector).first().css({borderRadius: '5px 5px 0px 0px'});
            break;
          default:
            break;
        }
      }
    }
  },
  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0
    }
  },
  style   : function () {

    this.$bar.css({
      overflow  : 'hidden',
      background: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAQAAAClM0ndAAAAhklEQVR4AdXO0QrCMBBE0bttkk38/w8WRERpdyjzVOc+HxhIHqJGMQcFFkpYRQotLLSw0IJ5aBdovruMYDA/kT8plF9ZKLFQcgF18hDj1SbQOMlCA4kao0iiXmah7qBWPdxpohsgVZyj7e5I9KcID+EhiDI5gxBYKLBQYKHAQoGFAoEks/YEGHYKB7hFxf0AAAAASUVORK5CYII=') repeat-x scroll left top #fff",
      position  : 'relative'
    });

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    this.$message.css({
      textAlign: 'center',
      padding  : '8px 10px 9px',
      width    : 'auto',
      position : 'relative'
    });

    this.$closeButton.css({
      position  : 'absolute',
      top       : 4, right: 4,
      width     : 10, height: 10,
      background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAxUlEQVR4AR3MPUoDURSA0e++uSkkOxC3IAOWNtaCIDaChfgXBMEZbQRByxCwk+BasgQRZLSYoLgDQbARxry8nyumPcVRKDfd0Aa8AsgDv1zp6pYd5jWOwhvebRTbzNNEw5BSsIpsj/kurQBnmk7sIFcCF5yyZPDRG6trQhujXYosaFoc+2f1MJ89uc76IND6F9BvlXUdpb6xwD2+4q3me3bysiHvtLYrUJto7PD/ve7LNHxSg/woN2kSz4txasBdhyiz3ugPGetTjm3XRokAAAAASUVORK5CYII=)",
      display   : 'none',
      cursor    : 'pointer'
    });

    this.$buttons.css({
      padding        : 5,
      textAlign      : 'right',
      borderTop      : '1px solid #ccc',
      backgroundColor: '#fff'
    });

    this.$buttons.find('button').css({
      marginLeft: 5
    });

    this.$buttons.find('button:first').css({
      marginLeft: 0
    });

    this.$bar.on({
      mouseenter: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 1);
      },
      mouseleave: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 0);
      }
    });

    switch (this.options.layout.name) {
      case 'top':
        this.$bar.css({
          borderRadius: '0px 0px 5px 5px',
          borderBottom: '2px solid #eee',
          borderLeft  : '2px solid #eee',
          borderRight : '2px solid #eee',
          boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
      case 'topCenter':
      case 'center':
      case 'bottomCenter':
      case 'inline':
        this.$bar.css({
          borderRadius: '5px',
          border      : '1px solid #eee',
          boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        this.$message.css({textAlign: 'center'});
        break;
      case 'topLeft':
      case 'topRight':
      case 'bottomLeft':
      case 'bottomRight':
      case 'centerLeft':
      case 'centerRight':
        this.$bar.css({
          borderRadius: '5px',
          border      : '1px solid #eee',
          boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        this.$message.css({textAlign: 'left'});
        break;
      case 'bottom':
        this.$bar.css({
          borderRadius: '5px 5px 0px 0px',
          borderTop   : '2px solid #eee',
          borderLeft  : '2px solid #eee',
          borderRight : '2px solid #eee',
          boxShadow   : "0 -2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
      default:
        this.$bar.css({
          border   : '2px solid #eee',
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
    }

    switch (this.options.type) {
      case 'alert':
      case 'notification':
        this.$bar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'});
        break;
      case 'warning':
        this.$bar.css({backgroundColor: '#FFEAA8', borderColor: '#FFC237', color: '#826200'});
        this.$buttons.css({borderTop: '1px solid #FFC237'});
        break;
      case 'error':
        this.$bar.css({backgroundColor: 'red', borderColor: 'darkred', color: '#FFF'});
        this.$message.css({fontWeight: 'bold'});
        this.$buttons.css({borderTop: '1px solid darkred'});
        break;
      case 'information':
        this.$bar.css({backgroundColor: '#57B7E2', borderColor: '#0B90C4', color: '#FFF'});
        this.$buttons.css({borderTop: '1px solid #0B90C4'});
        break;
      case 'success':
        this.$bar.css({backgroundColor: 'lightgreen', borderColor: '#50C24E', color: 'darkgreen'});
        this.$buttons.css({borderTop: '1px solid #50C24E'});
        break;
      default:
        this.$bar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'});
        break;
    }
  },
  callback: {
    onShow : function () {
      $.noty.themes.defaultTheme.helpers.borderFix.apply(this);
    },
    onClose: function () {
      $.noty.themes.defaultTheme.helpers.borderFix.apply(this);
    }
  }
};

$.noty.themes.metroui = {
  name    : 'metroui',
  helpers : {},
  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0
    }
  },
  style   : function () {

    this.$bar.css({
      overflow    : 'hidden',
      margin      : '4px 0',
      borderRadius: '0',
      position    : 'relative'
    });

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    this.$message.css({
      textAlign: 'center',
      padding  : '1.25rem',
      width    : 'auto',
      position : 'relative'
    });

    this.$closeButton.css({
      position  : 'absolute',
      top       : '.25rem', right: '.25rem',
      width     : 10, height: 10,
      background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAxUlEQVR4AR3MPUoDURSA0e++uSkkOxC3IAOWNtaCIDaChfgXBMEZbQRByxCwk+BasgQRZLSYoLgDQbARxry8nyumPcVRKDfd0Aa8AsgDv1zp6pYd5jWOwhvebRTbzNNEw5BSsIpsj/kurQBnmk7sIFcCF5yyZPDRG6trQhujXYosaFoc+2f1MJ89uc76IND6F9BvlXUdpb6xwD2+4q3me3bysiHvtLYrUJto7PD/ve7LNHxSg/woN2kSz4txasBdhyiz3ugPGetTjm3XRokAAAAASUVORK5CYII=)",
      display   : 'none',
      cursor    : 'pointer'
    });

    this.$buttons.css({
      padding        : 5,
      textAlign      : 'right',
      borderTop      : '1px solid #ccc',
      backgroundColor: '#fff'
    });

    this.$buttons.find('button').css({
      marginLeft: 5
    });

    this.$buttons.find('button:first').css({
      marginLeft: 0
    });

    this.$bar.on({
      mouseenter: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 1);
      },
      mouseleave: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 0);
      }
    });

    switch (this.options.layout.name) {
      case 'top':
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        break;
      case 'topCenter':
      case 'center':
      case 'bottomCenter':
      case 'inline':
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        this.$message.css({textAlign: 'center'});
        break;
      case 'topLeft':
      case 'topRight':
      case 'bottomLeft':
      case 'bottomRight':
      case 'centerLeft':
      case 'centerRight':
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        this.$message.css({textAlign: 'left'});
        break;
      case 'bottom':
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        break;
      default:
        this.$bar.css({
          border   : 'none',
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)"
        });
        break;
    }

    switch (this.options.type) {
      case 'alert':
      case 'notification':
        this.$bar.css({backgroundColor: '#fff', border: 'none', color: '#1d1d1d'});
        break;
      case 'warning':
        this.$bar.css({backgroundColor: '#FA6800', border: 'none', color: '#fff'});
        this.$buttons.css({borderTop: '1px solid #FA6800'});
        break;
      case 'error':
        this.$bar.css({backgroundColor: '#CE352C', border: 'none', color: '#fff'});
        this.$message.css({fontWeight: 'bold'});
        this.$buttons.css({borderTop: '1px solid #CE352C'});
        break;
      case 'information':
        this.$bar.css({backgroundColor: '#1BA1E2', border: 'none', color: '#fff'});
        this.$buttons.css({borderTop: '1px solid #1BA1E2'});
        break;
      case 'success':
        this.$bar.css({backgroundColor: '#60A917', border: 'none', color: '#fff'});
        this.$buttons.css({borderTop: '1px solid #50C24E'});
        break;
      default:
        this.$bar.css({backgroundColor: '#fff', border: 'none', color: '#1d1d1d'});
        break;
    }
  },
  callback: {
    onShow : function () {

    },
    onClose: function () {

    }
  }
};
$.noty.themes.relax = {
  name    : 'relax',
  helpers : {},
  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0
    }
  },
  style   : function () {

    this.$bar.css({
      overflow    : 'hidden',
      margin      : '4px 0',
      borderRadius: '2px',
      position    : 'relative'
    });

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    this.$message.css({
      textAlign: 'center',
      padding  : '10px',
      width    : 'auto',
      position : 'relative'
    });

    this.$closeButton.css({
      position  : 'absolute',
      top       : 4, right: 4,
      width     : 10, height: 10,
      background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAxUlEQVR4AR3MPUoDURSA0e++uSkkOxC3IAOWNtaCIDaChfgXBMEZbQRByxCwk+BasgQRZLSYoLgDQbARxry8nyumPcVRKDfd0Aa8AsgDv1zp6pYd5jWOwhvebRTbzNNEw5BSsIpsj/kurQBnmk7sIFcCF5yyZPDRG6trQhujXYosaFoc+2f1MJ89uc76IND6F9BvlXUdpb6xwD2+4q3me3bysiHvtLYrUJto7PD/ve7LNHxSg/woN2kSz4txasBdhyiz3ugPGetTjm3XRokAAAAASUVORK5CYII=)",
      display   : 'none',
      cursor    : 'pointer'
    });

    this.$buttons.css({
      padding        : 5,
      textAlign      : 'right',
      borderTop      : '1px solid #ccc',
      backgroundColor: '#fff'
    });

    this.$buttons.find('button').css({
      marginLeft: 5
    });

    this.$buttons.find('button:first').css({
      marginLeft: 0
    });

    this.$bar.on({
      mouseenter: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 1);
      },
      mouseleave: function () {
        $(this).find('.noty_close').stop().fadeTo('normal', 0);
      }
    });

    switch (this.options.layout.name) {
      case 'top':
        this.$bar.css({
          borderBottom: '2px solid #eee',
          borderLeft  : '2px solid #eee',
          borderRight : '2px solid #eee',
          borderTop   : '2px solid #eee',
          boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
      case 'topCenter':
      case 'center':
      case 'bottomCenter':
      case 'inline':
        this.$bar.css({
          border   : '1px solid #eee',
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        this.$message.css({textAlign: 'center'});
        break;
      case 'topLeft':
      case 'topRight':
      case 'bottomLeft':
      case 'bottomRight':
      case 'centerLeft':
      case 'centerRight':
        this.$bar.css({
          border   : '1px solid #eee',
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        this.$message.css({textAlign: 'left'});
        break;
      case 'bottom':
        this.$bar.css({
          borderTop   : '2px solid #eee',
          borderLeft  : '2px solid #eee',
          borderRight : '2px solid #eee',
          borderBottom: '2px solid #eee',
          boxShadow   : "0 -2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
      default:
        this.$bar.css({
          border   : '2px solid #eee',
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        });
        break;
    }

    switch (this.options.type) {
      case 'alert':
      case 'notification':
        this.$bar.css({backgroundColor: '#FFF', borderColor: '#dedede', color: '#444'});
        break;
      case 'warning':
        this.$bar.css({backgroundColor: '#FFEAA8', borderColor: '#FFC237', color: '#826200'});
        this.$buttons.css({borderTop: '1px solid #FFC237'});
        break;
      case 'error':
        this.$bar.css({backgroundColor: '#FF8181', borderColor: '#e25353', color: '#FFF'});
        this.$message.css({fontWeight: 'bold'});
        this.$buttons.css({borderTop: '1px solid darkred'});
        break;
      case 'information':
        this.$bar.css({backgroundColor: '#78C5E7', borderColor: '#3badd6', color: '#FFF'});
        this.$buttons.css({borderTop: '1px solid #0B90C4'});
        break;
      case 'success':
        this.$bar.css({backgroundColor: '#BCF5BC', borderColor: '#7cdd77', color: 'darkgreen'});
        this.$buttons.css({borderTop: '1px solid #50C24E'});
        break;
      default:
        this.$bar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'});
        break;
    }
  },
  callback: {
    onShow : function () {

    },
    onClose: function () {

    }
  }
};

$.noty.themes.semanticUI = {
  name: 'semanticUI',

  template: '<div class="ui message"><div class="content"><div class="header"></div></div></div>',

  animation: {
    open : {
      animation: 'fade',
      duration : '800ms'
    },
    close: {
      animation: 'fade left',
      duration : '800ms'
    }
  },

  modal   : {
    css: {
      position       : 'fixed',
      width          : '100%',
      height         : '100%',
      backgroundColor: '#000',
      zIndex         : 10000,
      opacity        : 0.6,
      display        : 'none',
      left           : 0,
      top            : 0
    }
  },
  style   : function () {
    this.$message = this.$bar.find('.ui.message');

    this.$message.find('.header').html(this.options.header);
    this.$message.find('.content').append(this.options.text);

    this.$bar.css({
      margin  : '0.5em',
      position: 'relative'
    });

    if (this.options.icon) {
      this.$message.addClass('icon').prepend($('<i/>').addClass(this.options.icon));
    }

    this.$progressBar.css({
      position       : 'absolute',
      left           : 0,
      bottom         : 0,
      height         : 4,
      width          : '100%',
      backgroundColor: '#000000',
      opacity        : 0.2,
      '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
      filter         : 'alpha(opacity=20)'
    });

    switch (this.options.size) {
      case 'mini':
        this.$message.addClass('mini');
        break;
      case 'tiny':
        this.$message.addClass('tiny');
        break;
      case 'small':
        this.$message.addClass('small');
        break;
      case 'large':
        this.$message.addClass('large');
        break;
      case 'big':
        this.$message.addClass('big');
        break;
      case 'huge':
        this.$message.addClass('huge');
        break;
      case 'massive':
        this.$message.addClass('massive');
        break;
    }

    switch (this.options.type) {
      case 'info':
        this.$message.addClass('info');
        break;
      case 'warning':
        this.$message.addClass('warning');
        break;
      case 'error':
        this.$message.addClass('error');
        break;
      case 'negative':
        this.$message.addClass('negative');
        break;
      case 'success':
        this.$message.addClass('success');
        break;
      case 'positive':
        this.$message.addClass('positive');
        break;
      case 'floating':
        this.$message.addClass('floating');
        break;
    }
  },
  callback: {
    onShow : function () {
      // Enable transition
      this.$bar.addClass('transition');
      // Actual transition
      this.$bar.transition(this.options.animation.open);
    },
    onClose: function () {
      this.$bar.transition(this.options.animation.close);
    }
  }
};


return window.noty;

});
/*
 * metismenu - v2.6.2
 * A jQuery menu plugin
 * https://github.com/onokumus/metisMenu#readme
 *
 * Made by Osman Nuri Okumuş <onokumus@gmail.com> (https://github.com/onokumus)
 * Under MIT License
 */

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jquery);
    global.metisMenu = mod.exports;
  }
})(this, function (_jquery) {
  'use strict';

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var MetisMenu = function ($) {

    var NAME = 'metisMenu';
    var DATA_KEY = 'metisMenu';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 350;

    var Default = {
      toggle: true,
      preventDefault: true,
      activeClass: 'active',
      collapseClass: 'collapse',
      collapseInClass: 'in',
      collapsingClass: 'collapsing'
    };

    var Event = {
      SHOW: 'show' + EVENT_KEY,
      SHOWN: 'shown' + EVENT_KEY,
      HIDE: 'hide' + EVENT_KEY,
      HIDDEN: 'hidden' + EVENT_KEY,
      CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
    };

    var transition = false;

    var TransitionEndEvent = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    function getSpecialTransitionEndEvent() {
      return {
        bindType: transition.end,
        delegateType: transition.end,
        handle: function handle(event) {
          if ($(event.target).is(this)) {
            return event.handleObj.handler.apply(this, arguments);
          }
        }
      };
    }

    function transitionEndTest() {
      if (window.QUnit) {
        return false;
      }

      var el = document.createElement('mm');

      for (var name in TransitionEndEvent) {
        if (el.style[name] !== undefined) {
          return {
            end: TransitionEndEvent[name]
          };
        }
      }

      return false;
    }

    function transitionEndEmulator(duration) {
      var _this2 = this;

      var called = false;

      $(this).one(Util.TRANSITION_END, function () {
        called = true;
      });

      setTimeout(function () {
        if (!called) {
          Util.triggerTransitionEnd(_this2);
        }
      }, duration);
    }

    function setTransitionEndSupport() {
      transition = transitionEndTest();

      if (Util.supportsTransitionEnd()) {
        $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
      }
    }

    var Util = {
      TRANSITION_END: 'mmTransitionEnd',

      triggerTransitionEnd: function triggerTransitionEnd(element) {
        $(element).trigger(transition.end);
      },
      supportsTransitionEnd: function supportsTransitionEnd() {
        return Boolean(transition);
      }
    };

    setTransitionEndSupport();

    var MetisMenu = function () {
      function MetisMenu(element, config) {
        _classCallCheck(this, MetisMenu);

        this._element = element;
        this._config = this._getConfig(config);
        this._transitioning = null;

        this.init();
      }

      _createClass(MetisMenu, [{
        key: 'init',
        value: function init() {
          var self = this;
          $(this._element).find('li.' + this._config.activeClass).has('ul').children('ul').attr('aria-expanded', true).addClass(this._config.collapseClass + ' ' + this._config.collapseInClass);

          $(this._element).find('li').not('.' + this._config.activeClass).has('ul').children('ul').attr('aria-expanded', false).addClass(this._config.collapseClass);

          $(this._element).find('li').has('ul').children('a').on(Event.CLICK_DATA_API, function (e) {
            var _this = $(this);
            var _parent = _this.parent('li');
            var _siblings = _parent.siblings('li').children('a');
            var _list = _parent.children('ul');
            if (self._config.preventDefault) {
              e.preventDefault();
            }
            if (_this.attr('aria-disabled') === 'true') {
              return;
            }
            if (_parent.hasClass(self._config.activeClass)) {
              _this.attr('aria-expanded', false);
              self._hide(_list);
            } else {
              self._show(_list);
              _this.attr('aria-expanded', true);
              if (self._config.toggle) {
                _siblings.attr('aria-expanded', false);
              }
            }

            if (self._config.onTransitionStart) {
              self._config.onTransitionStart(e);
            }
          });
        }
      }, {
        key: '_show',
        value: function _show(element) {
          if (this._transitioning || $(element).hasClass(this._config.collapsingClass)) {
            return;
          }
          var _this = this;
          var _el = $(element);

          var startEvent = $.Event(Event.SHOW);
          _el.trigger(startEvent);

          if (startEvent.isDefaultPrevented()) {
            return;
          }

          _el.parent('li').addClass(this._config.activeClass);

          if (this._config.toggle) {
            this._hide(_el.parent('li').siblings().children('ul.' + this._config.collapseInClass).attr('aria-expanded', false));
          }

          _el.removeClass(this._config.collapseClass).addClass(this._config.collapsingClass).height(0);

          this.setTransitioning(true);

          var complete = function complete() {

            _el.removeClass(_this._config.collapsingClass).addClass(_this._config.collapseClass + ' ' + _this._config.collapseInClass).height('').attr('aria-expanded', true);

            _this.setTransitioning(false);

            _el.trigger(Event.SHOWN);
          };

          if (!Util.supportsTransitionEnd()) {
            complete();
            return;
          }

          _el.height(_el[0].scrollHeight).one(Util.TRANSITION_END, complete);

          transitionEndEmulator(TRANSITION_DURATION);
        }
      }, {
        key: '_hide',
        value: function _hide(element) {

          if (this._transitioning || !$(element).hasClass(this._config.collapseInClass)) {
            return;
          }
          var _this = this;
          var _el = $(element);

          var startEvent = $.Event(Event.HIDE);
          _el.trigger(startEvent);

          if (startEvent.isDefaultPrevented()) {
            return;
          }

          _el.parent('li').removeClass(this._config.activeClass);
          _el.height(_el.height())[0].offsetHeight;

          _el.addClass(this._config.collapsingClass).removeClass(this._config.collapseClass).removeClass(this._config.collapseInClass);

          this.setTransitioning(true);

          var complete = function complete() {
            if (_this._transitioning && _this._config.onTransitionEnd) {
              _this._config.onTransitionEnd();
            }

            _this.setTransitioning(false);
            _el.trigger(Event.HIDDEN);

            _el.removeClass(_this._config.collapsingClass).addClass(_this._config.collapseClass).attr('aria-expanded', false);
          };

          if (!Util.supportsTransitionEnd()) {
            complete();
            return;
          }

          _el.height() == 0 || _el.css('display') == 'none' ? complete() : _el.height(0).one(Util.TRANSITION_END, complete);

          transitionEndEmulator(TRANSITION_DURATION);
        }
      }, {
        key: 'setTransitioning',
        value: function setTransitioning(isTransitioning) {
          this._transitioning = isTransitioning;
        }
      }, {
        key: 'dispose',
        value: function dispose() {
          $.removeData(this._element, DATA_KEY);

          $(this._element).find('li').has('ul').children('a').off('click');

          this._transitioning = null;
          this._config = null;
          this._element = null;
        }
      }, {
        key: '_getConfig',
        value: function _getConfig(config) {
          config = $.extend({}, Default, config);
          return config;
        }
      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(config) {
          return this.each(function () {
            var $this = $(this);
            var data = $this.data(DATA_KEY);
            var _config = $.extend({}, Default, $this.data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

            if (!data && /dispose/.test(config)) {
              this.dispose();
            }

            if (!data) {
              data = new MetisMenu(this, _config);
              $this.data(DATA_KEY, data);
            }

            if (typeof config === 'string') {
              if (data[config] === undefined) {
                throw new Error('No method named "' + config + '"');
              }
              data[config]();
            }
          });
        }
      }]);

      return MetisMenu;
    }();

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = MetisMenu._jQueryInterface;
    $.fn[NAME].Constructor = MetisMenu;
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return MetisMenu._jQueryInterface;
    };
    return MetisMenu;
  }(jQuery);
});

//! moment.js
//! version : 2.17.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    var k;
    for (k in obj) {
        // even if its not own property I'd still call it non-empty
        return false;
    }
    return true;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

var some$1 = some;

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

function isUndefined(input) {
    return input === void 0;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i in momentProperties) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _ordinalParseLenient.
    this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var keys$1 = keys;

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid()) {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

var indexOf$1 = indexOf;

function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return this._months;
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return this._monthsShort;
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function createDate (y, m, d, h, M, s, ms) {
    //can't just apply() to create a date:
    //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
    var date = new Date(y, m, d, h, M, s, ms);

    //the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    //the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return this._weekdays;
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    ordinalParse: defaultOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            require('./locale/' + name);
            // because defineLocale currently also sets the global locale, we
            // want to undo that for lazy loaded locales
            getSetGlobalLocale(oldLocale);
        } catch (e) { }
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys$1(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
        hooks.createFromInputFallback(config);
    }
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse)) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }

    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (input === undefined) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (typeof(input) === 'object') {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        delta, output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    if (units === 'year' || units === 'month' || units === 'quarter') {
        output = monthDiff(this, that);
        if (units === 'quarter') {
            output = output / 3;
        } else if (units === 'year') {
            output = output / 12;
        }
    } else {
        delta = this - that;
        output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
    }
    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString () {
    var m = this.clone().utc();
    if (0 < m.year() && m.year() <= 9999) {
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            return this.toDate().toISOString();
        } else {
            return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    } else {
        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 < this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$1 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$1;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;

// Year
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;

// Week Year
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter
proto.quarter = proto.quarters = getSetQuarter;

// Month
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;

// Week
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;

// Day
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;

// Hour
proto.hour = proto.hours = getSetHour;

// Minute
proto.minute = proto.minutes = getSetMinute;

// Second
proto.second = proto.seconds = getSetSecond;

// Millisecond
proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;

// Timezone
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

// Month
proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;

// Week
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports
hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function get$2 (units) {
    units = normalizeUnits(units);
    return this[units + 's']();
}

function makeGetter(name) {
    return function () {
        return this._data[name];
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    s: 45,  // seconds to minute
    m: 45,  // minutes to hour
    h: 22,  // hours to day
    d: 26,  // days to month
    M: 11   // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds < thresholds.s && ['s', seconds]  ||
            minutes <= 1           && ['m']           ||
            minutes < thresholds.m && ['mm', minutes] ||
            hours   <= 1           && ['h']           ||
            hours   < thresholds.h && ['hh', hours]   ||
            days    <= 1           && ['d']           ||
            days    < thresholds.d && ['dd', days]    ||
            months  <= 1           && ['M']           ||
            months  < thresholds.M && ['MM', months]  ||
            years   <= 1           && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    return true;
}

function humanize (withSuffix) {
    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    return (total < 0 ? '-' : '') +
        'P' +
        (Y ? Y + 'Y' : '') +
        (M ? M + 'M' : '') +
        (D ? D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? h + 'H' : '') +
        (m ? m + 'M' : '') +
        (s ? s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

// Deprecations
proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.17.1';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

return hooks;

})));

typeof JSON!="object"&&(JSON={}),function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t=="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];a&&typeof a=="object"&&typeof a.toJSON=="function"&&(a=a.toJSON(e)),typeof rep=="function"&&(a=rep.call(t,e,a));switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a)return"null";gap+=indent,u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1)u[n]=str(n,a)||"null";return i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]",gap=o,i}if(rep&&typeof rep=="object"){s=rep.length;for(n=0;n<s;n+=1)typeof rep[n]=="string"&&(r=rep[n],i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i))}else for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i));return i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}",gap=o,i}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(e,t,n){var r;gap="",indent="";if(typeof n=="number")for(r=0;r<n;r+=1)indent+=" ";else typeof n=="string"&&(indent=n);rep=t;if(!t||typeof t=="function"||typeof t=="object"&&typeof t.length=="number")return str("",{"":e});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i=="object")for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r=walk(i,n),r!==undefined?i[n]=r:delete i[n]);return reviver.call(e,t,i)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(e,t){"use strict";var n=e.History=e.History||{},r=e.jQuery;if(typeof n.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");n.Adapter={bind:function(e,t,n){r(e).bind(t,n)},trigger:function(e,t,n){r(e).trigger(t,n)},extractEventData:function(e,n,r){var i=n&&n.originalEvent&&n.originalEvent[e]||r&&r[e]||t;return i},onDomLoad:function(e){r(e)}},typeof n.init!="undefined"&&n.init()}(window),function(e,t){"use strict";var n=e.document,r=e.setTimeout||r,i=e.clearTimeout||i,s=e.setInterval||s,o=e.History=e.History||{};if(typeof o.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");o.initHtml4=function(){if(typeof o.initHtml4.initialized!="undefined")return!1;o.initHtml4.initialized=!0,o.enabled=!0,o.savedHashes=[],o.isLastHash=function(e){var t=o.getHashByIndex(),n;return n=e===t,n},o.isHashEqual=function(e,t){return e=encodeURIComponent(e).replace(/%25/g,"%"),t=encodeURIComponent(t).replace(/%25/g,"%"),e===t},o.saveHash=function(e){return o.isLastHash(e)?!1:(o.savedHashes.push(e),!0)},o.getHashByIndex=function(e){var t=null;return typeof e=="undefined"?t=o.savedHashes[o.savedHashes.length-1]:e<0?t=o.savedHashes[o.savedHashes.length+e]:t=o.savedHashes[e],t},o.discardedHashes={},o.discardedStates={},o.discardState=function(e,t,n){var r=o.getHashByState(e),i;return i={discardedState:e,backState:n,forwardState:t},o.discardedStates[r]=i,!0},o.discardHash=function(e,t,n){var r={discardedHash:e,backState:n,forwardState:t};return o.discardedHashes[e]=r,!0},o.discardedState=function(e){var t=o.getHashByState(e),n;return n=o.discardedStates[t]||!1,n},o.discardedHash=function(e){var t=o.discardedHashes[e]||!1;return t},o.recycleState=function(e){var t=o.getHashByState(e);return o.discardedState(e)&&delete o.discardedStates[t],!0},o.emulated.hashChange&&(o.hashChangeInit=function(){o.checkerFunction=null;var t="",r,i,u,a,f=Boolean(o.getHash());return o.isInternetExplorer()?(r="historyjs-iframe",i=n.createElement("iframe"),i.setAttribute("id",r),i.setAttribute("src","#"),i.style.display="none",n.body.appendChild(i),i.contentWindow.document.open(),i.contentWindow.document.close(),u="",a=!1,o.checkerFunction=function(){if(a)return!1;a=!0;var n=o.getHash(),r=o.getHash(i.contentWindow.document);return n!==t?(t=n,r!==n&&(u=r=n,i.contentWindow.document.open(),i.contentWindow.document.close(),i.contentWindow.document.location.hash=o.escapeHash(n)),o.Adapter.trigger(e,"hashchange")):r!==u&&(u=r,f&&r===""?o.back():o.setHash(r,!1)),a=!1,!0}):o.checkerFunction=function(){var n=o.getHash()||"";return n!==t&&(t=n,o.Adapter.trigger(e,"hashchange")),!0},o.intervalList.push(s(o.checkerFunction,o.options.hashChangeInterval)),!0},o.Adapter.onDomLoad(o.hashChangeInit)),o.emulated.pushState&&(o.onHashChange=function(t){var n=t&&t.newURL||o.getLocationHref(),r=o.getHashByUrl(n),i=null,s=null,u=null,a;return o.isLastHash(r)?(o.busy(!1),!1):(o.doubleCheckComplete(),o.saveHash(r),r&&o.isTraditionalAnchor(r)?(o.Adapter.trigger(e,"anchorchange"),o.busy(!1),!1):(i=o.extractState(o.getFullUrl(r||o.getLocationHref()),!0),o.isLastSavedState(i)?(o.busy(!1),!1):(s=o.getHashByState(i),a=o.discardedState(i),a?(o.getHashByIndex(-2)===o.getHashByState(a.forwardState)?o.back(!1):o.forward(!1),!1):(o.pushState(i.data,i.title,encodeURI(i.url),!1),!0))))},o.Adapter.bind(e,"hashchange",o.onHashChange),o.pushState=function(t,n,r,i){r=encodeURI(r).replace(/%25/g,"%");if(o.getHashByUrl(r))throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");if(i!==!1&&o.busy())return o.pushQueue({scope:o,callback:o.pushState,args:arguments,queue:i}),!1;o.busy(!0);var s=o.createStateObject(t,n,r),u=o.getHashByState(s),a=o.getState(!1),f=o.getHashByState(a),l=o.getHash(),c=o.expectedStateId==s.id;return o.storeState(s),o.expectedStateId=s.id,o.recycleState(s),o.setTitle(s),u===f?(o.busy(!1),!1):(o.saveState(s),c||o.Adapter.trigger(e,"statechange"),!o.isHashEqual(u,l)&&!o.isHashEqual(u,o.getShortUrl(o.getLocationHref()))&&o.setHash(u,!1),o.busy(!1),!0)},o.replaceState=function(t,n,r,i){r=encodeURI(r).replace(/%25/g,"%");if(o.getHashByUrl(r))throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");if(i!==!1&&o.busy())return o.pushQueue({scope:o,callback:o.replaceState,args:arguments,queue:i}),!1;o.busy(!0);var s=o.createStateObject(t,n,r),u=o.getHashByState(s),a=o.getState(!1),f=o.getHashByState(a),l=o.getStateByIndex(-2);return o.discardState(a,s,l),u===f?(o.storeState(s),o.expectedStateId=s.id,o.recycleState(s),o.setTitle(s),o.saveState(s),o.Adapter.trigger(e,"statechange"),o.busy(!1)):o.pushState(s.data,s.title,s.url,!1),!0}),o.emulated.pushState&&o.getHash()&&!o.emulated.hashChange&&o.Adapter.onDomLoad(function(){o.Adapter.trigger(e,"hashchange")})},typeof o.init!="undefined"&&o.init()}(window),function(e,t){"use strict";var n=e.console||t,r=e.document,i=e.navigator,s=!1,o=e.setTimeout,u=e.clearTimeout,a=e.setInterval,f=e.clearInterval,l=e.JSON,c=e.alert,h=e.History=e.History||{},p=e.history;try{s=e.sessionStorage,s.setItem("TEST","1"),s.removeItem("TEST")}catch(d){s=!1}l.stringify=l.stringify||l.encode,l.parse=l.parse||l.decode;if(typeof h.init!="undefined")throw new Error("History.js Core has already been loaded...");h.init=function(e){return typeof h.Adapter=="undefined"?!1:(typeof h.initCore!="undefined"&&h.initCore(),typeof h.initHtml4!="undefined"&&h.initHtml4(),!0)},h.initCore=function(d){if(typeof h.initCore.initialized!="undefined")return!1;h.initCore.initialized=!0,h.options=h.options||{},h.options.hashChangeInterval=h.options.hashChangeInterval||100,h.options.safariPollInterval=h.options.safariPollInterval||500,h.options.doubleCheckInterval=h.options.doubleCheckInterval||500,h.options.disableSuid=h.options.disableSuid||!1,h.options.storeInterval=h.options.storeInterval||1e3,h.options.busyDelay=h.options.busyDelay||250,h.options.debug=h.options.debug||!1,h.options.initialTitle=h.options.initialTitle||r.title,h.options.html4Mode=h.options.html4Mode||!1,h.options.delayInit=h.options.delayInit||!1,h.intervalList=[],h.clearAllIntervals=function(){var e,t=h.intervalList;if(typeof t!="undefined"&&t!==null){for(e=0;e<t.length;e++)f(t[e]);h.intervalList=null}},h.debug=function(){(h.options.debug||!1)&&h.log.apply(h,arguments)},h.log=function(){var e=typeof n!="undefined"&&typeof n.log!="undefined"&&typeof n.log.apply!="undefined",t=r.getElementById("log"),i,s,o,u,a;e?(u=Array.prototype.slice.call(arguments),i=u.shift(),typeof n.debug!="undefined"?n.debug.apply(n,[i,u]):n.log.apply(n,[i,u])):i="\n"+arguments[0]+"\n";for(s=1,o=arguments.length;s<o;++s){a=arguments[s];if(typeof a=="object"&&typeof l!="undefined")try{a=l.stringify(a)}catch(f){}i+="\n"+a+"\n"}return t?(t.value+=i+"\n-----\n",t.scrollTop=t.scrollHeight-t.clientHeight):e||c(i),!0},h.getInternetExplorerMajorVersion=function(){var e=h.getInternetExplorerMajorVersion.cached=typeof h.getInternetExplorerMajorVersion.cached!="undefined"?h.getInternetExplorerMajorVersion.cached:function(){var e=3,t=r.createElement("div"),n=t.getElementsByTagName("i");while((t.innerHTML="<!--[if gt IE "+ ++e+"]><i></i><![endif]-->")&&n[0]);return e>4?e:!1}();return e},h.isInternetExplorer=function(){var e=h.isInternetExplorer.cached=typeof h.isInternetExplorer.cached!="undefined"?h.isInternetExplorer.cached:Boolean(h.getInternetExplorerMajorVersion());return e},h.options.html4Mode?h.emulated={pushState:!0,hashChange:!0}:h.emulated={pushState:!Boolean(e.history&&e.history.pushState&&e.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(i.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(i.userAgent)),hashChange:Boolean(!("onhashchange"in e||"onhashchange"in r)||h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<8)},h.enabled=!h.emulated.pushState,h.bugs={setHash:Boolean(!h.emulated.pushState&&i.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),safariPoll:Boolean(!h.emulated.pushState&&i.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),ieDoubleCheck:Boolean(h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<7)},h.isEmptyObject=function(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0},h.cloneObject=function(e){var t,n;return e?(t=l.stringify(e),n=l.parse(t)):n={},n},h.getRootUrl=function(){var e=r.location.protocol+"//"+(r.location.hostname||r.location.host);if(r.location.port||!1)e+=":"+r.location.port;return e+="/",e},h.getBaseHref=function(){var e=r.getElementsByTagName("base"),t=null,n="";return e.length===1&&(t=e[0],n=t.href.replace(/[^\/]+$/,"")),n=n.replace(/\/+$/,""),n&&(n+="/"),n},h.getBaseUrl=function(){var e=h.getBaseHref()||h.getBasePageUrl()||h.getRootUrl();return e},h.getPageUrl=function(){var e=h.getState(!1,!1),t=(e||{}).url||h.getLocationHref(),n;return n=t.replace(/\/+$/,"").replace(/[^\/]+$/,function(e,t,n){return/\./.test(e)?e:e+"/"}),n},h.getBasePageUrl=function(){var e=h.getLocationHref().replace(/[#\?].*/,"").replace(/[^\/]+$/,function(e,t,n){return/[^\/]$/.test(e)?"":e}).replace(/\/+$/,"")+"/";return e},h.getFullUrl=function(e,t){var n=e,r=e.substring(0,1);return t=typeof t=="undefined"?!0:t,/[a-z]+\:\/\//.test(e)||(r==="/"?n=h.getRootUrl()+e.replace(/^\/+/,""):r==="#"?n=h.getPageUrl().replace(/#.*/,"")+e:r==="?"?n=h.getPageUrl().replace(/[\?#].*/,"")+e:t?n=h.getBaseUrl()+e.replace(/^(\.\/)+/,""):n=h.getBasePageUrl()+e.replace(/^(\.\/)+/,"")),n.replace(/\#$/,"")},h.getShortUrl=function(e){var t=e,n=h.getBaseUrl(),r=h.getRootUrl();return h.emulated.pushState&&(t=t.replace(n,"")),t=t.replace(r,"/"),h.isTraditionalAnchor(t)&&(t="./"+t),t=t.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),t},h.getLocationHref=function(e){return e=e||r,e.URL===e.location.href?e.location.href:e.location.href===decodeURIComponent(e.URL)?e.URL:e.location.hash&&decodeURIComponent(e.location.href.replace(/^[^#]+/,""))===e.location.hash?e.location.href:e.URL.indexOf("#")==-1&&e.location.href.indexOf("#")!=-1?e.location.href:e.URL||e.location.href},h.store={},h.idToState=h.idToState||{},h.stateToId=h.stateToId||{},h.urlToId=h.urlToId||{},h.storedStates=h.storedStates||[],h.savedStates=h.savedStates||[],h.normalizeStore=function(){h.store.idToState=h.store.idToState||{},h.store.urlToId=h.store.urlToId||{},h.store.stateToId=h.store.stateToId||{}},h.getState=function(e,t){typeof e=="undefined"&&(e=!0),typeof t=="undefined"&&(t=!0);var n=h.getLastSavedState();return!n&&t&&(n=h.createStateObject()),e&&(n=h.cloneObject(n),n.url=n.cleanUrl||n.url),n},h.getIdByState=function(e){var t=h.extractId(e.url),n;if(!t){n=h.getStateString(e);if(typeof h.stateToId[n]!="undefined")t=h.stateToId[n];else if(typeof h.store.stateToId[n]!="undefined")t=h.store.stateToId[n];else{for(;;){t=(new Date).getTime()+String(Math.random()).replace(/\D/g,"");if(typeof h.idToState[t]=="undefined"&&typeof h.store.idToState[t]=="undefined")break}h.stateToId[n]=t,h.idToState[t]=e}}return t},h.normalizeState=function(e){var t,n;if(!e||typeof e!="object")e={};if(typeof e.normalized!="undefined")return e;if(!e.data||typeof e.data!="object")e.data={};return t={},t.normalized=!0,t.title=e.title||"",t.url=h.getFullUrl(e.url?e.url:h.getLocationHref()),t.hash=h.getShortUrl(t.url),t.data=h.cloneObject(e.data),t.id=h.getIdByState(t),t.cleanUrl=t.url.replace(/\??\&_suid.*/,""),t.url=t.cleanUrl,n=!h.isEmptyObject(t.data),(t.title||n)&&h.options.disableSuid!==!0&&(t.hash=h.getShortUrl(t.url).replace(/\??\&_suid.*/,""),/\?/.test(t.hash)||(t.hash+="?"),t.hash+="&_suid="+t.id),t.hashedUrl=h.getFullUrl(t.hash),(h.emulated.pushState||h.bugs.safariPoll)&&h.hasUrlDuplicate(t)&&(t.url=t.hashedUrl),t},h.createStateObject=function(e,t,n){var r={data:e,title:t,url:n};return r=h.normalizeState(r),r},h.getStateById=function(e){e=String(e);var n=h.idToState[e]||h.store.idToState[e]||t;return n},h.getStateString=function(e){var t,n,r;return t=h.normalizeState(e),n={data:t.data,title:e.title,url:e.url},r=l.stringify(n),r},h.getStateId=function(e){var t,n;return t=h.normalizeState(e),n=t.id,n},h.getHashByState=function(e){var t,n;return t=h.normalizeState(e),n=t.hash,n},h.extractId=function(e){var t,n,r,i;return e.indexOf("#")!=-1?i=e.split("#")[0]:i=e,n=/(.*)\&_suid=([0-9]+)$/.exec(i),r=n?n[1]||e:e,t=n?String(n[2]||""):"",t||!1},h.isTraditionalAnchor=function(e){var t=!/[\/\?\.]/.test(e);return t},h.extractState=function(e,t){var n=null,r,i;return t=t||!1,r=h.extractId(e),r&&(n=h.getStateById(r)),n||(i=h.getFullUrl(e),r=h.getIdByUrl(i)||!1,r&&(n=h.getStateById(r)),!n&&t&&!h.isTraditionalAnchor(e)&&(n=h.createStateObject(null,null,i))),n},h.getIdByUrl=function(e){var n=h.urlToId[e]||h.store.urlToId[e]||t;return n},h.getLastSavedState=function(){return h.savedStates[h.savedStates.length-1]||t},h.getLastStoredState=function(){return h.storedStates[h.storedStates.length-1]||t},h.hasUrlDuplicate=function(e){var t=!1,n;return n=h.extractState(e.url),t=n&&n.id!==e.id,t},h.storeState=function(e){return h.urlToId[e.url]=e.id,h.storedStates.push(h.cloneObject(e)),e},h.isLastSavedState=function(e){var t=!1,n,r,i;return h.savedStates.length&&(n=e.id,r=h.getLastSavedState(),i=r.id,t=n===i),t},h.saveState=function(e){return h.isLastSavedState(e)?!1:(h.savedStates.push(h.cloneObject(e)),!0)},h.getStateByIndex=function(e){var t=null;return typeof e=="undefined"?t=h.savedStates[h.savedStates.length-1]:e<0?t=h.savedStates[h.savedStates.length+e]:t=h.savedStates[e],t},h.getCurrentIndex=function(){var e=null;return h.savedStates.length<1?e=0:e=h.savedStates.length-1,e},h.getHash=function(e){var t=h.getLocationHref(e),n;return n=h.getHashByUrl(t),n},h.unescapeHash=function(e){var t=h.normalizeHash(e);return t=decodeURIComponent(t),t},h.normalizeHash=function(e){var t=e.replace(/[^#]*#/,"").replace(/#.*/,"");return t},h.setHash=function(e,t){var n,i;return t!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.setHash,args:arguments,queue:t}),!1):(h.busy(!0),n=h.extractState(e,!0),n&&!h.emulated.pushState?h.pushState(n.data,n.title,n.url,!1):h.getHash()!==e&&(h.bugs.setHash?(i=h.getPageUrl(),h.pushState(null,null,i+"#"+e,!1)):r.location.hash=e),h)},h.escapeHash=function(t){var n=h.normalizeHash(t);return n=e.encodeURIComponent(n),h.bugs.hashEscape||(n=n.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),n},h.getHashByUrl=function(e){var t=String(e).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return t=h.unescapeHash(t),t},h.setTitle=function(e){var t=e.title,n;t||(n=h.getStateByIndex(0),n&&n.url===e.url&&(t=n.title||h.options.initialTitle));try{r.getElementsByTagName("title")[0].innerHTML=t.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(i){}return r.title=t,h},h.queues=[],h.busy=function(e){typeof e!="undefined"?h.busy.flag=e:typeof h.busy.flag=="undefined"&&(h.busy.flag=!1);if(!h.busy.flag){u(h.busy.timeout);var t=function(){var e,n,r;if(h.busy.flag)return;for(e=h.queues.length-1;e>=0;--e){n=h.queues[e];if(n.length===0)continue;r=n.shift(),h.fireQueueItem(r),h.busy.timeout=o(t,h.options.busyDelay)}};h.busy.timeout=o(t,h.options.busyDelay)}return h.busy.flag},h.busy.flag=!1,h.fireQueueItem=function(e){return e.callback.apply(e.scope||h,e.args||[])},h.pushQueue=function(e){return h.queues[e.queue||0]=h.queues[e.queue||0]||[],h.queues[e.queue||0].push(e),h},h.queue=function(e,t){return typeof e=="function"&&(e={callback:e}),typeof t!="undefined"&&(e.queue=t),h.busy()?h.pushQueue(e):h.fireQueueItem(e),h},h.clearQueue=function(){return h.busy.flag=!1,h.queues=[],h},h.stateChanged=!1,h.doubleChecker=!1,h.doubleCheckComplete=function(){return h.stateChanged=!0,h.doubleCheckClear(),h},h.doubleCheckClear=function(){return h.doubleChecker&&(u(h.doubleChecker),h.doubleChecker=!1),h},h.doubleCheck=function(e){return h.stateChanged=!1,h.doubleCheckClear(),h.bugs.ieDoubleCheck&&(h.doubleChecker=o(function(){return h.doubleCheckClear(),h.stateChanged||e(),!0},h.options.doubleCheckInterval)),h},h.safariStatePoll=function(){var t=h.extractState(h.getLocationHref()),n;if(!h.isLastSavedState(t))return n=t,n||(n=h.createStateObject()),h.Adapter.trigger(e,"popstate"),h;return},h.back=function(e){return e!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.back,args:arguments,queue:e}),!1):(h.busy(!0),h.doubleCheck(function(){h.back(!1)}),p.go(-1),!0)},h.forward=function(e){return e!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.forward,args:arguments,queue:e}),!1):(h.busy(!0),h.doubleCheck(function(){h.forward(!1)}),p.go(1),!0)},h.go=function(e,t){var n;if(e>0)for(n=1;n<=e;++n)h.forward(t);else{if(!(e<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(n=-1;n>=e;--n)h.back(t)}return h};if(h.emulated.pushState){var v=function(){};h.pushState=h.pushState||v,h.replaceState=h.replaceState||v}else h.onPopState=function(t,n){var r=!1,i=!1,s,o;return h.doubleCheckComplete(),s=h.getHash(),s?(o=h.extractState(s||h.getLocationHref(),!0),o?h.replaceState(o.data,o.title,o.url,!1):(h.Adapter.trigger(e,"anchorchange"),h.busy(!1)),h.expectedStateId=!1,!1):(r=h.Adapter.extractEventData("state",t,n)||!1,r?i=h.getStateById(r):h.expectedStateId?i=h.getStateById(h.expectedStateId):i=h.extractState(h.getLocationHref()),i||(i=h.createStateObject(null,null,h.getLocationHref())),h.expectedStateId=!1,h.isLastSavedState(i)?(h.busy(!1),!1):(h.storeState(i),h.saveState(i),h.setTitle(i),h.Adapter.trigger(e,"statechange"),h.busy(!1),!0))},h.Adapter.bind(e,"popstate",h.onPopState),h.pushState=function(t,n,r,i){if(h.getHashByUrl(r)&&h.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(i!==!1&&h.busy())return h.pushQueue({scope:h,callback:h.pushState,args:arguments,queue:i}),!1;h.busy(!0);var s=h.createStateObject(t,n,r);return h.isLastSavedState(s)?h.busy(!1):(h.storeState(s),h.expectedStateId=s.id,p.pushState(s.id,s.title,s.url),h.Adapter.trigger(e,"popstate")),!0},h.replaceState=function(t,n,r,i){if(h.getHashByUrl(r)&&h.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(i!==!1&&h.busy())return h.pushQueue({scope:h,callback:h.replaceState,args:arguments,queue:i}),!1;h.busy(!0);var s=h.createStateObject(t,n,r);return h.isLastSavedState(s)?h.busy(!1):(h.storeState(s),h.expectedStateId=s.id,p.replaceState(s.id,s.title,s.url),h.Adapter.trigger(e,"popstate")),!0};if(s){try{h.store=l.parse(s.getItem("History.store"))||{}}catch(m){h.store={}}h.normalizeStore()}else h.store={},h.normalizeStore();h.Adapter.bind(e,"unload",h.clearAllIntervals),h.saveState(h.storeState(h.extractState(h.getLocationHref(),!0))),s&&(h.onUnload=function(){var e,t,n;try{e=l.parse(s.getItem("History.store"))||{}}catch(r){e={}}e.idToState=e.idToState||{},e.urlToId=e.urlToId||{},e.stateToId=e.stateToId||{};for(t in h.idToState){if(!h.idToState.hasOwnProperty(t))continue;e.idToState[t]=h.idToState[t]}for(t in h.urlToId){if(!h.urlToId.hasOwnProperty(t))continue;e.urlToId[t]=h.urlToId[t]}for(t in h.stateToId){if(!h.stateToId.hasOwnProperty(t))continue;e.stateToId[t]=h.stateToId[t]}h.store=e,h.normalizeStore(),n=l.stringify(e);try{s.setItem("History.store",n)}catch(i){if(i.code!==DOMException.QUOTA_EXCEEDED_ERR)throw i;s.length&&(s.removeItem("History.store"),s.setItem("History.store",n))}},h.intervalList.push(a(h.onUnload,h.options.storeInterval)),h.Adapter.bind(e,"beforeunload",h.onUnload),h.Adapter.bind(e,"unload",h.onUnload));if(!h.emulated.pushState){h.bugs.safariPoll&&h.intervalList.push(a(h.safariStatePoll,h.options.safariPollInterval));if(i.vendor==="Apple Computer, Inc."||(i.appCodeName||"")==="Mozilla")h.Adapter.bind(e,"hashchange",function(){h.Adapter.trigger(e,"popstate")}),h.getHash()&&h.Adapter.onDomLoad(function(){h.Adapter.trigger(e,"hashchange")})}},(!h.options||!h.options.delayInit)&&h.init()}(window)

// DEBUG MODE
var DEBUGMODE = true;


//global variables

var $oDATA = {
	'messages' : {},
	'messageArchive' : {},
	'messageTimes' : {},
	'tasks' : {},
	'alerts' : {},
	'notifications' : {},
	'data' : {}
};
var updateMessages = true;
var mostRecentMsgID = 0;
var $intervals = {};
var ajaxRequests = {};
var urlParams;

$.ajaxSetup({
  headers: {
      'X-XSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
      'x-api-token' : $('meta[name="api_token"]').attr('content')
  }
});


String.prototype.ucfirst = function() {
    return this.toString().charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.ucwords = function() {
    return this.toString().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function htmlspecialchars_decode(string, quote_style) {
  //       discuss at: http://phpjs.org/functions/htmlspecialchars_decode/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      bugfixed by: Mateusz "loonquawl" Zalega
  //      bugfixed by: Onno Marsman
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //         input by: ReverseSyntax
  //         input by: Slawomir Kaniecki
  //         input by: Scott Cariss
  //         input by: Francois
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
  //        returns 1: '<p>this -> &quot;</p>'
  //        example 2: htmlspecialchars_decode("&amp;quot;");
  //        returns 2: '&quot;'

  var optTemp = 0,
    i = 0,
    noquotes = false;
  if (typeof quote_style === 'undefined') {
    quote_style = 2;
  }
  string = string.toString()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quote_style === 0) {
    noquotes = true;
  }
  if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[quote_style[i]] === 0) {
        noquotes = true;
      } else if (OPTS[quote_style[i]]) {
        optTemp = optTemp | OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
    // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"');
  }
  // Put this in last place to avoid escape being double-decoded
  string = string.replace(/&amp;/g, '&');

  return string;
}

function strtotime(text, now) {
  //  discuss at: http://phpjs.org/functions/strtotime/
  //     version: 1109.2016
  // original by: Caio Ariede (http://caioariede.com)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Caio Ariede (http://caioariede.com)
  // improved by: A. Matías Quezada (http://amatiasq.com)
  // improved by: preuter
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Mirko Faber
  //    input by: David
  // bugfixed by: Wagner B. Soares
  // bugfixed by: Artur Tchernychev
  //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
  //   example 1: strtotime('+1 day', 1129633200);
  //   returns 1: 1129719600
  //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
  //   returns 2: 1130425202
  //   example 3: strtotime('last month', 1129633200);
  //   returns 3: 1127041200
  //   example 4: strtotime('2009-05-04 08:30:00 GMT');
  //   returns 4: 1241425800

  var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

  if (!text) {
    return fail;
  }

  // Unecessary spaces
  text = text.replace(/^\s+|\s+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\t\r\n]/g, '')
    .toLowerCase();

  // in contrast to php, js Date.parse function interprets:
  // dates given as yyyy-mm-dd as in timezone: UTC,
  // dates with "." or "-" as MDY instead of DMY
  // dates with two-digit years differently
  // etc...etc...
  // ...therefore we manually parse lots of common date formats
  match = text.match(
    /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

  if (match && match[2] === match[4]) {
    if (match[1] > 1901) {
      switch (match[2]) {
      case '-':
        {
          // YYYY-M-D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case '.':
        {
          // YYYY.M.D is not parsed by strtotime()
          return fail;
        }
      case '/':
        {
          // YYYY/M/D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      }
    } else if (match[5] > 1901) {
      switch (match[2]) {
      case '-':
        {
          // D-M-YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case '.':
        {
          // D.M.YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case '/':
        {
          // M/D/YYYY
          if (match[1] > 12 || match[3] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      }
    } else {
      switch (match[2]) {
      case '-':
        {
          // YY-M-D
          if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
            return fail;
          }

          year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
          return new Date(year, parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case '.':
        {
          // D.M.YY or H.MM.SS
          if (match[5] >= 70) {
            // D.M.YY
            if (match[3] > 12 || match[1] > 31) {
              return fail;
            }

            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
          if (match[5] < 60 && !match[6]) {
            // H.MM.SS
            if (match[1] > 23 || match[3] > 59) {
              return fail;
            }

            today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
              match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
          }

          // invalid format, cannot be parsed
          return fail;
        }
      case '/':
        {
          // M/D/YY
          if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
            return fail;
          }

          year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
          return new Date(year, parseInt(match[1], 10) - 1, match[3],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case ':':
        {
          // HH:MM:SS
          if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
            return fail;
          }

          today = new Date();
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
            match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
        }
      }
    }
  }

  // other formats and "now" should be parsed by Date.parse()
  if (text === 'now') {
    return now === null || isNaN(now) ? new Date()
      .getTime() / 1000 | 0 : now | 0;
  }
  if (!isNaN(parsed = Date.parse(text))) {
    return parsed / 1000 | 0;
  }

  date = now ? new Date(now * 1000) : new Date();
  days = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6
  };
  ranges = {
    'yea': 'FullYear',
    'mon': 'Month',
    'day': 'Date',
    'hou': 'Hours',
    'min': 'Minutes',
    'sec': 'Seconds'
  };

  function lastNext(type, range, modifier) {
    var diff, day = days[range];

    if (typeof day !== 'undefined') {
      diff = day - date.getDay();

      if (diff === 0) {
        diff = 7 * modifier;
      } else if (diff > 0 && type === 'last') {
        diff -= 7;
      } else if (diff < 0 && type === 'next') {
        diff += 7;
      }

      date.setDate(date.getDate() + diff);
    }
  }

  function process(val) {
    var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
      type = splt[0],
      range = splt[1].substring(0, 3),
      typeIsNumber = /\d+/.test(type),
      ago = splt[2] === 'ago',
      num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

    if (typeIsNumber) {
      num *= parseInt(type, 10);
    }

    if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
      return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
    }

    if (range === 'wee') {
      return date.setDate(date.getDate() + (num * 7));
    }

    if (type === 'next' || type === 'last') {
      lastNext(type, range, num);
    } else if (!typeIsNumber) {
      return false;
    }

    return true;
  }

  times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
    '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
    '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
  regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

  match = text.match(new RegExp(regex, 'gi'));
  if (!match) {
    return fail;
  }

  for (i = 0, len = match.length; i < len; i++) {
    if (!process(match[i])) {
      return fail;
    }
  }

  // ECMAScript 5 only
  // if (!match.every(process))
  //    return false;

  return (date.getTime() / 1000);
}

function date(format, timestamp) {
  //  discuss at: http://phpjs.org/functions/date/
  // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  // original by: gettimeofday
  //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: MeEtc (http://yass.meetcweb.com)
  // improved by: Brad Touesnard
  // improved by: Tim Wiel
  // improved by: Bryan Elliott
  // improved by: David Randall
  // improved by: Theriault
  // improved by: Theriault
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Theriault
  // improved by: Thomas Beaucourt (http://www.webapp.fr)
  // improved by: JT
  // improved by: Theriault
  // improved by: Rafał Kukawski (http://blog.kukawski.pl)
  // improved by: Theriault
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: majak
  //    input by: Alex
  //    input by: Martin
  //    input by: Alex Wilson
  //    input by: Haravikk
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: majak
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
  // bugfixed by: Chris (http://www.devotis.nl/)
  //        note: Uses global: php_js to store the default timezone
  //        note: Although the function potentially allows timezone info (see notes), it currently does not set
  //        note: per a timezone specified by date_default_timezone_set(). Implementers might use
  //        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
  //        note: in order to adjust the dates in this function (or our other date functions!) accordingly
  //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
  //   returns 1: '09:09:40 m is month'
  //   example 2: date('F j, Y, g:i a', 1062462400);
  //   returns 2: 'September 2, 2003, 2:26 am'
  //   example 3: date('Y W o', 1062462400);
  //   returns 3: '2003 36 2003'
  //   example 4: x = date('Y m d', (new Date()).getTime()/1000);
  //   example 4: (x+'').length == 10 // 2009 01 09
  //   returns 4: true
  //   example 5: date('W', 1104534000);
  //   returns 5: '53'
  //   example 6: date('B t', 1104534000);
  //   returns 6: '999 31'
  //   example 7: date('W U', 1293750000.82); // 2010-12-31
  //   returns 7: '52 1293750000'
  //   example 8: date('W', 1293836400); // 2011-01-01
  //   returns 8: '52'
  //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
  //   returns 9: '52 2011-01-02'

  var that = this;
  var jsdate, f;
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  var txt_words = [
    'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  var formatChr = /\\?(.?)/gi;
  var formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s;
  };
  var _pad = function (n, c) {
    n = String(n);
    while (n.length < c) {
      n = '0' + n;
    }
    return n;
  };
  f = {
    // Day
    d: function () {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2);
    },
    D: function () {
      // Shorthand day name; Mon...Sun
      return f.l()
        .slice(0, 3);
    },
    j: function () {
      // Day of month; 1..31
      return jsdate.getDate();
    },
    l: function () {
      // Full day name; Monday...Sunday
      return txt_words[f.w()] + 'day';
    },
    N: function () {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7;
    },
    S: function () {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j();
      var i = j % 10;
      if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
        i = 0;
      }
      return ['st', 'nd', 'rd'][i - 1] || 'th';
    },
    w: function () {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay();
    },
    z: function () {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j());
      var b = new Date(f.Y(), 0, 1);
      return Math.round((a - b) / 864e5);
    },

    // Week
    W: function () {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
      var b = new Date(a.getFullYear(), 0, 4);
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
    },

    // Month
    F: function () {
      // Full month name; January...December
      return txt_words[6 + f.n()];
    },
    m: function () {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2);
    },
    M: function () {
      // Shorthand month name; Jan...Dec
      return f.F()
        .slice(0, 3);
    },
    n: function () {
      // Month; 1...12
      return jsdate.getMonth() + 1;
    },
    t: function () {
      // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0))
        .getDate();
    },

    // Year
    L: function () {
      // Is leap year?; 0 or 1
      var j = f.Y();
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
    },
    o: function () {
      // ISO-8601 year
      var n = f.n();
      var W = f.W();
      var Y = f.Y();
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
    },
    Y: function () {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear();
    },
    y: function () {
      // Last two digits of year; 00...99
      return f.Y()
        .toString()
        .slice(-2);
    },

    // Time
    a: function () {
      // am or pm
      return jsdate.getHours() > 11 ? 'pm' : 'am';
    },
    A: function () {
      // AM or PM
      return f.a()
        .toUpperCase();
    },
    B: function () {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2;
      // Hours
      var i = jsdate.getUTCMinutes() * 60;
      // Minutes
      // Seconds
      var s = jsdate.getUTCSeconds();
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
    },
    g: function () {
      // 12-Hours; 1..12
      return f.G() % 12 || 12;
    },
    G: function () {
      // 24-Hours; 0..23
      return jsdate.getHours();
    },
    h: function () {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2);
    },
    H: function () {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2);
    },
    i: function () {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2);
    },
    s: function () {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2);
    },
    u: function () {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6);
    },

    // Timezone
    e: function () {
      // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
      /*              return that.date_default_timezone_get();
       */
      throw 'Not supported (see source code of date() for timezone on how to add support)';
    },
    I: function () {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0);
      // Jan 1
      var c = Date.UTC(f.Y(), 0);
      // Jan 1 UTC
      var b = new Date(f.Y(), 6);
      // Jul 1
      // Jul 1 UTC
      var d = Date.UTC(f.Y(), 6);
      return ((a - c) !== (b - d)) ? 1 : 0;
    },
    O: function () {
      // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset();
      var a = Math.abs(tzo);
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
    },
    P: function () {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O();
      return (O.substr(0, 3) + ':' + O.substr(3, 2));
    },
    T: function () {
      // Timezone abbreviation; e.g. EST, MDT, ...
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr, i, os, _default;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if (that.php_js && that.php_js.default_timezone) {
        _default = that.php_js.default_timezone;
        for (abbr in tal) {
          for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === _default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
      */
      return 'UTC';
    },
    Z: function () {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60;
    },

    // Full Date/Time
    c: function () {
      // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
    },
    r: function () {
      // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
    },
    U: function () {
      // Seconds since UNIX epoch
      return jsdate / 1000 | 0;
    }
  };
  this.date = function (format, timestamp) {
    that = this;
    jsdate = (timestamp === undefined ? new Date() : // Not provided
      (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
      new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    );
    return format.replace(formatChr, formatChrCb);
  };
  return this.date(format, timestamp);
}

_log = (function(undefined) {
	var Log = Error; // does this do anything?  proper inheritance...?
	Log.prototype.write = function (args) {
		/// <summary>
		/// Paulirish-like console.log wrapper.  Includes stack trace via @fredrik SO suggestion (see remarks for sources).
		/// </summary>
		/// <param name="args" type="Array">list of details to log, as provided by `arguments`</param>
		/// <remarks>Includes line numbers by calling Error object -- see
		/// * http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
		/// * http://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
		/// * http://stackoverflow.com/a/3806596/1037948
		/// </remarks>
		
		// via @fredrik SO trace suggestion; wrapping in special construct so it stands out
		var suffix = {
				"@": (this.lineNumber
						? this.fileName + ':' + this.lineNumber + ":1" // add arbitrary column value for chrome linking
						: extractLineNumberFromStack(this.stack)
				)
			};
		
		args = args.concat([suffix]);
		// via @paulirish console wrapper
		if (console && console.log) {
			if (console.log.apply) { console.log.apply(console, args); } else { console.log(args); } // nicer display in some browsers
		}
	};
	var extractLineNumberFromStack = function (stack) {
		/// <summary>
		/// Get the line/filename detail from a Webkit stack trace.  See http://stackoverflow.com/a/3806596/1037948
		/// </summary>
		/// <param name="stack" type="String">the stack string</param>
		
		// correct line number according to how Log().write implemented
		var line = stack.split('\n')[3];
		// fix for various display text
		line = ( line.indexOf(' (') >= 0
			? line.split(' (')[1].substring(0, line.length - 1)
			: line.split('at ')[1]
			);
		return line;
	};
	
	return function (params) {
		/// <summary>
		/// Paulirish-like console.log wrapper
		/// </summary>
		/// <param name="params" type="[...]">list your logging parameters</param>
		
		// only if explicitly true somewhere
		if (typeof DEBUGMODE === typeof undefined || !DEBUGMODE) return;
		
		// call handler extension which provides stack trace
		Log().write(Array.prototype.slice.call(arguments, 0)); // turn into proper array
	};//--	fn	_log
	
})();
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
	return function( elem ) {
		return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	};
});

var bindAjaxLinks = function(){
	var pieces = window.location.href.split('/'),
		view = pieces.pop(),
		History = window.History;

	$('.sidebar').find('li.active').removeClass('active').end()
	.find('a.ajaxy').removeClass('active').each( function() {
		//console.log( $(this).attr('href') )
		if ( $(this).attr('href') === view ) {
			$(this).addClass('active')
			$(this).closest('.nav.nav-second-level').addClass('active in').parent().addClass('active')
			//console.log( $(this).closest('li').parent().closest('li').prop('outerHTML') )
		}
	})

	History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
		var currentIndex = History.getCurrentIndex();
		var internal = (History.getState().data._index == (currentIndex - 1));
		if (!!internal) {
			return
		}
		//var State = History.getState(); // Note: We are using History.getState() instead of event.state
	});

	$('a.ajaxy').off('click.custom').on('click.custom',function(e) {
		e.preventDefault();

		//determine if grabbing html or a script
		var self = $(this),
			view = self.attr('href').replace(/\.\//gi,'').replace('.html',''),
			script = ( typeof self.attr('data-script') !== 'undefined' ) ? true : false,
			//fn = (typeof self.attr('data-fn') !== 'undefined' ) ? true : false,
			ajaxVars = {},
			isFn,
			fnName,
			parts;
		var State = History.getState(); // Note: We are using History.getState() instead of event.state
		History.log(State.data, State.title, State.url);
		History.pushState({
			_index: History.getCurrentIndex()
		},'MSB IT Dashboard - ' + view.replace('-',' ').ucwords(), './' + view + '.html' );


		// determine if the view is an existing function and execute it

		parts = view.split('/');
		switch (parts.length) {
			case 1 :
				isFn = Boolean (typeof jApp.views[view] === 'function');
				if (!!isFn) {
					fnName = jApp.views[view];
				}
			break;

			case 2 :
				isFn = Boolean ( typeof jApp.views[ parts[0] ][ parts[1] ] === 'function' );
				if (!!isFn) {
					fnName = jApp.views[ parts[0] ][ parts[1] ];
				}
			break;
		}


		// grab script if it's a script
		if (!!isFn) {

			console.log('Switching to view ' + view);
			$('#page-wrapper').empty();
			$('#modal_overlay').show();

			fnName();

			$('.sidebar a').removeClass('active');
			$(self).addClass('active');
			$('#modal_overlay').fadeOut(200);
			if ( $('.sidebar').hasClass('active') ) {
				$('.sidebar-overlay').click();
			}

		} else {

			ajaxVars = (!!script) ?
			{
				 url : './includes/js/views/src/' + view.replace(/\//g,'.') + '.html.js',
				dataType : 'script',
				success : function() {
					$('.sidebar a').removeClass('active');
					$(self).addClass('active');
					$('#modal_overlay').fadeOut(200);
					bindAjaxLinks();
				}
			} : {
				url : 'index.php?controller=ajax&view=' + view,
				dataType : 'html',
				success : function(response) {
					$('#page-wrapper').html(response);
					$('.sidebar a').removeClass('active');
					$(self).addClass('active');
					$('#modal_overlay').fadeOut(200);
					if ( $('.sidebar').hasClass('active') ) {
						$('.sidebar-overlay').click();
					}
					bindAjaxLinks();
				}
			}

			//console.log(e);
			$('#modal_overlay').show();
			$('#page-wrapper').empty();
			$.ajax( ajaxVars );
		}
	});
}


$(document).ready(function() {

   bindAjaxLinks();

});

(function(d){d.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"],function(f,e){d.fx.step[e]=function(g){if(!g.colorInit){g.start=c(g.elem,e);g.end=b(g.end);g.colorInit=true}g.elem.style[e]="rgb("+[Math.max(Math.min(parseInt((g.pos*(g.end[0]-g.start[0]))+g.start[0]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[1]-g.start[1]))+g.start[1]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[2]-g.start[2]))+g.start[2]),255),0)].join(",")+")"}});function b(f){var e;if(f&&f.constructor==Array&&f.length==3){return f}if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}if(e=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)){return[parseFloat(e[1])*2.55,parseFloat(e[2])*2.55,parseFloat(e[3])*2.55]}if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}if(e=/rgba\(0, 0, 0, 0\)/.exec(f)){return a.transparent}return a[d.trim(f).toLowerCase()]}function c(g,e){var f;do{f=d.css(g,e);if(f!=""&&f!="transparent"||d.nodeName(g,"body")){break}e="backgroundColor"}while(g=g.parentNode);return b(f)}var a={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]}})(jQuery);

$(function() {

    $('#side-menu').metisMenu();

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    /* $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse')
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse')
        }

        height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    }) */
	
	$('.navbar-toggle').click( function() {
		var margin = $('#page-wrapper').css('margin-left');
		$(this).toggleClass('active');
		$('.sidebar').toggleClass('active');
		$('#page-wrapper').toggleClass('slide');
		//$('.navbar-default').toggleClass('slide');
	});
	
	$('.sidebar-overlay').click( function() {
		$('.navbar-toggle').click();
	});
	
});



/**
 * admin.contacts.html.js
 *
 * admin.contacts view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. John Smith',
			required : true,
			_label : 'Enter the person\'s full name',
			'data-validType' : 'Anything'
		}
	], fieldset_2__fields = [
		{
			name : 'users',
			type : 'array',
			_label : 'Associate one or more Usernames with this Person',
			fields : [
				{
					name : 'users',
					type : 'select',
					_label : 'Select Users',
					_labelssource : 'User.username',
					_optionssource : 'User.id',
					multiple : true
				}, {
					name : 'comment',
					placeholder : 'Comment',
				}, {
					name : 'primary_flag',
					type : 'select',
					_labelssource : 'Primary Username?|No|Yes',
					_optionssource : '|0|1',
					'data-no-bsms' : true
				}
			]
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.contacts',
		{ // grid definition
			model : 'Person',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-male',
				headerTitle : 'Manage Contacts',
				helpText : "<strong>Note:</strong> Manage Contacts Here"
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"users",
				"user_groups"
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
				"Username(s)",
				"Groups"
			],
		},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-5',
					fields : fieldset_1__fields
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-5',
					fields : fieldset_2__fields
				}
		]
	)

})(jApp);

/**
 * admin.groups.html.js
 *
 * admin.groups view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. Administrators',
			_label : 'Group Name',
			required : true,
			'data-validType' : 'Anything',
		}, {
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		}, {
			name : 'roles',
			type : 'select',
			_label : 'Assign roles/permissions to this group',
			_labelssource : 'Role.name',
			_optionssource : 'Role.id',
			multiple : true,
		}
	], fieldset_2__fields = [
		{
			name : 'servers',
			type : 'select',
			_label : 'What Servers belong to this group?',
			_labelssource : 'Server.name',
			_optionssource : 'Server.id',
			multiple : true,
		},
		{
			name : 'users',
			type : 'array',
			_label : 'What Users are in this Group?',
			fields : [
				{
					name : 'users',
					type : 'select',
					_label : 'Select Users',
					_labelssource : 'User.username',
					_optionssource : 'User.id',
					multiple : true
				}, {
					name : 'comment',
					placeholder : 'Comment',
				}, {
					name : 'primary_flag',
					type : 'select',
					_labelssource : 'Primary Group?|No|Yes',
					_optionssource : '|0|1',
					'data-no-bsms' : true
				}
			]
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.groups',
		{ // grid definition
			model : 'Group',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-users',
				headerTitle : 'Manage Groups',
				helpText : "<strong>Note:</strong> Manage Groups Here"
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"description",
				"users",
				"roles",
				"servers",
			],

			headers : [ 				// headers for table
				"ID",
				"Name",
				"Description",
				"Users",
				"Roles",
				"Servers"
			],

			templates : {
				servers : function(arr) {
					console.log('servers',arr);
					return _.get('name',arr,'fa-building-o','Server');
				}
			}
		},
		[ // colparams
			{ // fieldset
				label : 'Group Information',
				helpText : 'Please fill out the following information about the group.',
				class : 'col-lg-5',
				fields : fieldset_1__fields
			},
			{	// fieldset
				class : 'col-lg-5',
				fields : fieldset_2__fields
			}
		]
	);

})(jApp)

/**
 * admin.contacts.html.js
 *
 * admin.contacts view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			required : true,
			_label : 'Service Name',
			'data-validType' : 'Anything',
			placeholder : 'e.g. Windows Update'
		},
		{
			name : 'server_name',
			type : 'select',
			_optionssource : 'Server.name',
			_labelssource : 'Server.name',
			_firstlabel : "-All-",
			_firstoption : "All",
			_label : 'Server',
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.notificationExemptions',
	{
		model : 'NotificationExemption',
		columnFriendly : 'name',
		toggles : {
			ellipses : false
		},
		gridHeader : {
			icon : 'fa-bell-slash-o',
			headerTitle : 'Notification Exceptions',
			helpText : "<strong>Note:</strong> Notifications will not be sent for these services on the specified servers."
		},
		columns : [ 				// columns to query
			"id",
			"name",
			"server_name",
		],
		headers : [ 				// headers for table
			"ID",
			"Service",
			"Server",
		],
	},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-4',
					fields : fieldset_1__fields
				},
		]
	)

})(jApp);

/**
 * admin.contacts.html.js
 *
 * admin.contacts view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'person_id',
			type : 'select',
			required : true,
			_labelssource : 'Person.name',
			_optionssource : 'Person.id',
			_firstoption : null,
			_firstlabel : '-Choose-',
			_label : 'Contact Name',
			'data-validType' : 'select'
		},
		{
			name : 'group_id',
			type : 'select',
			required : true,
			_labelssource : 'Group.name',
			_optionssource : 'Group.id',
			_firstoption : null,
			_firstlabel : '-Choose-',
			_label : 'Limit to notifications of Group:',
			'data-validType' : 'select'
		},
		{
			name : 'notifications_enabled',
			type : 'select',
			_optionssource : [
				"None",
				"Email",
				"Text",
				"Both"
			],
			_firstlabel : "-Choose-",
			_firstoption : null,
			required : true,
			_label : 'Notifications Enabled',
			'data-validType' : 'select'
		},
		{
			name : 'email',
			type : 'textarea',
			_label : 'Enter Email Address, One Per Line',
		},
		{
			name : 'phone_number',
			type : 'textarea',
			_label : 'Enter Mobile Numbers, One Per Line',
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.notifications',
	{
		model : 'Notification',
		columnFriendly : 'name',
		toggles : {
			ellipses : false
		},
		gridHeader : {
			icon : 'fa-bell-o',
			headerTitle : 'Manage Notifications',
			helpText : "<strong>Note:</strong> Set up who will receive notifications."
		},
		columns : [ 				// columns to query
			"id",
			"person",
			"group",
			"notifications_enabled",
			"email",
			"phone_number",
		],
		headers : [ 				// headers for table
			"ID",
			"Person",
			"Group",
			"Notifications",
			"Email",
			"Phone",
		],
		templates : {
			person : function() {
				var r = jApp.activeGrid.currentRow;
				return _.get('name',r.person,'fa-male','Person');
			},
			group : function() {
				var r = jApp.activeGrid.currentRow;
				return _.get('name',r.group,'fa-users','Group');
			},
			email : function( val ) {
				return val;
			}
		},
		fn : {
			/**
			 * Mark selected applications as inactive/active
			 * @method function
			 * @return {[type]} [description]
			 */
			markNotification			: function( atts ) {
				jApp.aG().action = 'withSelectedUpdate';
				jUtility.withSelected('custom', function(ids) {
					jUtility.postJSON( {
						url : jUtility.getCurrentFormAction(),
						success : jUtility.callback.submitCurrentForm,
						data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
					});
				});
			}, // end fn
		},

		rowBtns : {
			markSelected : [
				{ label: 'Enabled Notifications...', class: 'btn btn-primary', icon : 'fa-check-square-o' },
				{
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markNotification({ 'notifications_enabled' : 'Both'})
					},
					label : 'Email &amp; Text'
				},
				{
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markNotification({ 'notifications_enabled' : 'Email'})
					},
					label : 'Email Only'
				},
				{
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markNotification({ 'notifications_enabled' : 'Text'})
					},
					label : 'Text Only'
				},
				{
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markNotification({ 'notifications_enabled' : 'None'})
					},
					label : 'None'
				},

			]
		}
	},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-4',
					fields : fieldset_1__fields
				},
		]
	)

})(jApp);

/**
 * admin.operatingSystems.html.js
 *
 * operating systems view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			required : true,
			_label : 'Enter the name of the Operating System.',
			'data-validType' : 'Anything'
		},
		{
			name : 'servers',
      _label : 'What servers have this Operating System?',
			type : 'select',
			_optionssource : 'Server.id',
			_labelssource : 'Server.name',
      multiple : true
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.operatingSystems',
		{ // grid definition
			model : 'OperatingSystem',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-windows',
				headerTitle : 'Manage Operating Systems',
				helpText : "<strong>Note:</strong> Manage Operating Systems Here"
			},
			columns : [ 				// columns to query
				"id",
				"name",
        "servers",
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
        "Servers"
			],
			templates : { 				// html template functions
        servers : function(arr) {
          return _.get('name',arr,'fa-building-o','Server')
        }
			},
		},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-3',
					fields : fieldset_1__fields
				},
		]
	)
})(jApp);

/**
 * admin.contacts.html.js
 *
 * admin.contacts view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. Document Manager',
			required : true,
			_label : 'Role Name',
			'data-validType' : 'Anything'
		},
		{
			name : 'model',
			placeholder : 'e.g. Document',
			required : true,
			_label : 'Model Name',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Descrption',
		},
	], fieldset_2__fields = [
		{
			name : 'create_enabled',
			type : 'select',
			_label : 'Create Enabled',
			_optionssource : '0|1',
			_labelssource : 'No|Yes'
		},
		{
			name : 'read_enabled',
			type : 'select',
			_label : 'Read Enabled',
			_optionssource : '0|1',
			_labelssource : 'No|Yes'
		},
		{
			name : 'update_enabled',
			type : 'select',
			_label : 'Update Enabled',
			_optionssource : '0|1',
			_labelssource : 'No|Yes'
		},
		{
			name : 'delete_enabled',
			type : 'select',
			_label : 'Delete Enabled',
			_optionssource : '0|1',
			_labelssource : 'No|Yes'
		}
	], fieldset_3__fields = [
		{
			name : 'groups',
			type : 'select',
			_label : 'Apply This Role To What Groups?',
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
			multiple : true
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.roles',
	{
		model : 'Role',
		columnFriendly : 'name',
		gridHeader : {
			icon : 'fa-briefcase',
			headerTitle : 'Manage Roles &amp; Permissions',
			helpText : "<strong>Note:</strong> Setup Roles here."
		},
		columns : [ 				// columns to query
			"id",
			"name",
			"model",
			"permissions",
			"groups",
			"group_users"
		],
		headers : [ 				// headers for table
			"ID",
			"Business Role",
			"Model Name",
			"Permissions",
			"Groups",
			"Users",
		],
	},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-4',
					fields : fieldset_1__fields
				},

				{ // fieldset
					label : 'Permissions',
					class : 'col-lg-4',
					fields : fieldset_2__fields
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-4',
					fields : fieldset_3__fields
				},
		]
	)

})(jApp);

;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	// var fieldset_1__fields = [
	// 	{
	// 		name : 'expires_at',
	// 		required : true,
	// 		type : 'datetime-local',
	// 		_label : 'When should the silenced notification expire?',
	// 	},
	// ]

	/**
	 * Add the view
	 */
	jApp.addView('admin.silencedNotifications',
		{ // grid definition
			model : 'SilencedNotification',
			columnFriendly : 'id',
			refreshInterval : 62000,
			gridHeader : {
				icon : 'fa-bell-slash-o',
				headerTitle : 'Silenced Notifications',
				helpText : "<strong>Note:</strong> Notifications will not be sent for these items."
			},
			toggles : {
				new : false,
				edit : false,
				ellipses : false,
			},
			tableBtns : {
				custom : {
					
				},
			},
			rowBtns : {
				

			},
			fn : {				   
				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp, scope = 'all', data = jApp.activeGrid.dataGrid.requestOptions.data;

					if ( !! temp.hideUpToDate ) {
						scope = 'outdated';
					}

					if ( !! temp.hideRunning ) {
						filter.push( "status <> 'Running'" );
					}

					data.scope = scope;
					data.filter = filter.join(' AND ');

				}, // end fn  
			},
			columns : [ 				// columns to query
				"id",
				"loggable",
				"expired_flag",
				"expires_at",
				"expires_at_for_humans",
			],
			headers : [ 				// headers for table
				"ID",
				"Source",
				"Expired?",
				"Expires",
				"Expires",
			],
			templates : { 				// html template functions

				expires_at : function(val) {
					return val.substr(0,16);
				},		
						
				expired_flag : function(val) {
					return _.getFlag(val,'Yes','No','danger','success');
				},

				loggable : function(val) {
					var r = jApp.activeGrid.currentRow,
						server = ( r.server != null ) ? r.server.name + ':' : '';

					return _.nameButton( r.loggable_type.split('\\').slice(1).join(':') + ':' + server + r.loggable.name,  jApp.opts().gridHeader.icon );
				},

			},
		},
		[ 
			// colparams
			// { // fieldset
			// 	label : 'Details',
			// 	helpText : 'Please fill out the form',
			// 	class : 'col-lg-5',
			// 	fields : fieldset_1__fields
			// },
		]
	)
})(jApp);

/**
 * admin.groups.html.js
 *
 * admin.groups view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'username',
			placeholder : 'e.g. jsmith',
			required : true,
			_label : 'Username',
			'data-validType' : 'Anything'
		},{
			name : 'email',
			placeholder : 'email@domain.com',
			required : true,
			_label : 'Email Address',
			'data-validType' : 'Email Address'
		}
	], fieldset_2__fields = [
		{
			name : 'groups',
			type : 'array',
			_label : 'Associate one or more Groups with this User',
			fields : [
				{
					name : 'groups[]',
					type : 'select',
					required : true,
					_firstlabel : 'None selected',
					_firstoption : -1,
					_labelssource : 'Group.name',
					_optionssource : 'Group.id',
					'data-validType' : 'select',
				},
				{
					name : 'comment',
					placeholder : 'Comment',
				},
				{
					name : 'primary_flag',
					type : 'select',
					_labelssource : 'Primary Group?|No|Yes',
					_optionssource : '|0|1',
					'data-no-bsms' : true
				}
			]
		}
	], fieldset_3__fields = [
		, {
			name : 'people_id',
			type : 'select',
			_label : 'Contact Name',
			_firstlabel : '-Choose-',
			_firstoption : 0,
			_labelssource : "Person.name",
			_optionssource : "Person.id",
			'data-validType' : 'select'
		}, {
			name : 'comment',
			_label : 'Purpose of User Account',
			placeholder : 'e.g. Admin Username'
		}, {
			name : 'primary_flag',
			type : 'select',
			_label : 'Is Primary User?',
			_labelssource : 'No|Yes',
			_optionssource : '0|1',
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.users',
	{
		model : 'User',
		columnFriendly : 'username',
		gridHeader : {
			icon : 'fa-user',
			headerTitle : 'Manage Users',
			helpText : "<strong>Note:</strong> Manage Users Here"
		},
		rowBtns : {
			custom : {
				resetPassword : { 'data-multiple' : false, 'data-permission' : 'update_enabled', type : 'button', class : 'btn btn-primary', icon : 'fa-refresh', label : 'Password Reset ...', fn : 'resetPassword'  } // etc.
			}
		},
		columns : [ 				// columns to query
			"id",
			"username",
			"person_name",
			"email",
			"groups",
			"group_roles",
		],
		headers : [ 				// headers for table
			"ID",
			"Username",
			"Name",
			"Email",
			"Groups",
			"Role (Model)",
		],
		html : {
			forms : {
				resetPassword : '<div id="div_resetFrm" class="div-btn-reset min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-yellow"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-refresh fa-fw"></i> Reset Password </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side formContainer"></div> </div> </div> </div> </div>'
			},
		},
		formDefs : {
			resetPassword : {
				table : 'User',
				pkey : 'id',
				tableFriendly : 'User Password',
				atts : { method : 'PATCH' },
				//loadExternal : false, // treat it like an externally loaded form, but specify params locally
				colParams : [{
					label : 'Reset Password',
					helpText : 'Specify a new password then confirm it to continue.',
					class : 'col-lg-3',
					fields : [
						{ type : 'hidden', readonly : 'readonly', name : 'ContactID' },
						{ type : 'password', name : 'Password1', id : 'Password1', required : 'required', 'data-validType' : 'min>=6', _label : 'New Password', placeholder : '******' },
						{ type : 'password', name : 'Password2', id : 'Password2', required : 'required', 'data-validType' : 'field==#Password1', _label : 'Confirm Password', placeholder : '******' },
					]
				}],
			}
		},
		fn : {
			resetPassword : function() {
				jUtility.actionHelper('resetPassword');
			}, //end fn
		}
	},
		[ // colparams
			{ // fieldset
				label : 'User',
				helpText : 'Please fill out the User information',
				class : 'col-lg-3',
				fields : fieldset_1__fields
			},
			{ // fieldset
				label : 'Contact',
				helpText : 'A user account can only be assigned to one person. A person can have multiple user accounts.',
				class : 'col-lg-4',
				fields : fieldset_3__fields
			},
			{	// fieldset
				class : 'col-lg-5',
				fields : fieldset_2__fields
			}
		]
	);

})(jApp)

/**
 * applications.html.js
 *
 * applications view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. Abra',
			required : true,
			_label : 'Enter the Application name',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'inactive_flag',
			type : 'select',
			_label : 'Is the application inactive?',
			_optionssource : '0|1',
			_labelssource : 'No|Yes',
		},
		{
			name : 'group_id',
			_label : 'What Group "owns" this Application?',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
		},
	], fieldset_2__fields = [
		{
			name : 'people',
			type : 'array',
			_label : 'Application Contacts',
			fields : [
				{
					name : 'people',
					type : 'select',
					_label : 'Select Contacts',
					_labelssource : 'Person.name',
					_optionssource : 'Person.id',
					multiple : true
				}, {
					name : 'contact_type',
					type : 'select',
					_optionssource : [
						'Primary',
						'Secondary',
						'Other',
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'servers',
			type : 'array',
			_label : 'Application Servers',
			fields : [
				{
					name : 'servers',
					type : 'select',
					_label : 'Select Servers',
					_labelssource : 'Server.name',
					_optionssource : 'Server.id',
					multiple : true
				}, {
					name : 'server_type',
					type : 'select',
					_optionssource : [
						'Primary Application Server',
						'Secondary Application Server',
						'Primary Database Server',
						'Secondary Database Server',
						'Primary Report Server',
						'Secondary Report Server',
						'Primary Web Server',
						'Secondary Web Server',
						'Primary DR Server',
						'Secondary DR Server',
						'Test Application Server',
						'Test Report Server',
						'Test Database Server',
						'Test Web Server',
						'Other'
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'databases',
			type : 'array',
			_label : 'Application Databases',
			fields : [
				{
					name : 'databases',
					type : 'select',
					_label : 'Select Databases',
					_labelssource : 'Database.hostname,name',
					_optionssource : 'Database.id',
					multiple : true
				}, {
					name : 'database_type',
					type : 'select',
					_optionssource : [
						'Production Database',
						'Test Database',
						'Development Database',
						'Reporting Database'
						,'DR Database'
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'tags[]',
			multiple : true,
			type : 'tokens',
			_label : 'Tags',
			_labelssource : 'Tag.name',
			_optionssource : 'Tag.id',
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('applications',
		{ // grid definition
			model : 'Application',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-cubes',
				headerTitle : 'Manage Applications',
				helpText : "<strong>Note:</strong> Manage Applications Here"
			},
			tableBtns : {
				custom : {
					toggleInactive : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Inactive',
						fn : 'toggleInactive',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				custom : {
					markSelected : [
						{ label: 'Flag Selected Applications', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markApplication( { 'inactive_flag' : 1} );
							},
							label : 'As Inactive'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markApplication({ 'inactive_flag' : 0})
							},
							label : 'As Not Inactive'
						},
					]
				},
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"owner_name",
				"description",
				"people",
				"servers",
				'tags',
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
				"Owner",
				"Description",
				"Contacts",
				"Servers",
				"Tags"
			],
			templates : { 				// html template functions

				name : function( value ) {
					var r = jApp.activeGrid.currentRow, status, className, label = '';

					if ( !! +r.inactive_flag ) {
						label = '<div class="label-sm label label-warning">Inactive</div> ';
					}

					return label + _.nameButton( value, 'fa-cubes' );
				},

				owner_name : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.owner || '', 'fa-users','Group');
				},

				servers : function(arr) {
					return _.get('name', arr, 'fa-building-o', 'Server' );
				},
			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markApplication			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp;

					if (typeof temp.hideInactive !== 'undefined' && !!temp.hideInactive) {
						filter.push('inactive_flag = 0');
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

				}, // end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleInactive : function( ) {
					jApp.activeGrid.temp.hideInactive = ( typeof jApp.activeGrid.temp.hideInactive === 'undefined')
						? true : !jApp.activeGrid.temp.hideInactive;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-5',
					fields : fieldset_1__fields
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-5',
					fields : fieldset_2__fields
				}
		]
	)
})(jApp);

/**
 * servers.html.js
 *
 * servers view definition
 */
;(function(jApp) {
	/**
	 * Add the view
	 */
	jApp.addView('approveUpdates',
		{ // grid definition
			model : 'UpdateDetail',
			filter : 'installed_flag = 0 and hidden_flag = 0 and approved_flag = 0',
			scope : 'myGroups',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-windows',
				headerTitle : 'Approve Pending Windows Updates',
				helpText : "<strong>Note:</strong> You may approve or hide updates here. Updates will not be installed until the server status is set to Ready For Updates. <a href='updates'>Install Updates</a>"
			},
			toggles : {
				new : false,
				edit : false,
				del : false,
				ellipses : false
			},
			refreshInterval : 62000,
			tableBtns : {
				custom : {
					showOnlyMyGroups : {
						type : 'button',
						class : 'btn btn-success active btn-toggle btn-showOnlyMyGroups',
						icon : 'fa-toggle-on',
						label : 'Show Only My Groups\'',
						fn : 'showOnlyMyGroups',
						'data-order' : 98
					},
					toggleProduction : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Production',
						fn : 'toggleProduction',
						'data-order' : 100
					},
					toggleNonProduction : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Non-Production',
						fn : 'toggleNonProduction',
						'data-order' : 100
					},
					toggleApproved : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Approved',
						fn : 'toggleApproved',
						'data-order' : 100
					},
					toggleUnapproved : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Unapproved',
						fn : 'toggleUnapproved',
						'data-order' : 100
					},
					toggleInstalled : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Installed',
						fn : 'toggleInstalled',
						'data-order' : 101
					},
					toggleHidden : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Hidden',
						fn : 'toggleHidden',
						'data-order' : 101
					},
					// toggleProduction : {
					// 	type : 'button',
					// 	class : 'btn btn-success active btn-toggle',
					// 	icon : 'fa-toggle-on',
					// 	label : 'Toggle Non-Production',
					// 	fn : 'toggleNonProd',
					// 	'data-order' : 100
					// },
				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Mark Selected Updates', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markUpdate( { 'approved_flag' : 1 } );
						},
						label : 'As Approved'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markUpdate({ 'approved_flag' : 0 })
						},
						label : 'As Not Approved'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markUpdate({ 'hidden_flag' : 1 })
						},
						label : 'As Hidden'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markUpdate({ 'hidden_flag' : 0 })
						},
						label : 'As Not Hidden'
					},
				]
			},
			columns : [ 				// columns to query
				"id",
				"hostname",
				"owner_name",
				"title",
				"kb_article",
				"status",
				"updated_at_for_humans"
				// "approved_flag",
				// "installed_flag",
				// "downloaded_flag",
				// "hidden_flag",
			],
			headers : [ 				// headers for table
				"ID",
				"Server",
				"Owner",
				"Update Title",
				"KB Article",
				"Status",
				"Last Modified"
				// "Approved?",
				// "Installed?",
				// "Downloaded?",
				// "Hidden?",
			],
			templates : { 				// html template functions

				status : function() {
					var r = jApp.activeGrid.currentRow,
							ret = '';

					ret += _.getFlag(r.hidden_flag,'Hidden','Not Hidden','danger','success');
					ret += _.getFlag(r.downloaded_flag,'Downloaded','Not Downloaded');
					ret += _.getFlag(r.approved_flag,'Approved','Not Approved');
					ret += _.getFlag(r.installed_flag,'Installed', 'Not Installed');

					return ret;
				},

				kb_article : function(val) {
					if ( ! val || ! val.length ) return '';
					
					var url = 'https://support.microsoft.com/en-us/kb/' + val.replace('KB','');

					return _.link( '<a target="_blank" href="' + url + '">' + val + '</a>', null, true );
				},

				approved_flag : function(val) {
					return _.getFlag(val);
				},

				installed_flag : function(val) {
					return _.getFlag(val);
				},

				downloaded_flag : function(val) {
					return _.getFlag(val);
				},

				hidden_flag : function(val) {
					return _.getFlag(val);
				},

			},

			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markUpdate			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp, scope = [];

					if (typeof temp.hideApproved === 'undefined' || !!temp.hideApproved) {
						filter.push('approved_flag = 0');
					}

					if (typeof temp.hideUnapproved === 'undefined' || !!temp.hideUnapproved) {
						filter.push('approved_flag = 1');
					}

					if (typeof temp.hideHidden === 'undefined' || !!temp.hideHidden) {
						filter.push('hidden_flag = 0');
					}

					if (typeof temp.hideInstalled === 'undefined' || !!temp.hideInstalled) {
						filter.push('installed_flag = 0');
					}

					if (typeof temp.showOnlyMyGroups === 'undefined' || !! temp.showOnlyMyGroups )
					{
						scope.push('myGroups');
					}

					switch( true ) {
						case ( ! temp.hideProduction && ! temp.hideNonProduction ) :
							scope.push('all');
						break;

						case ( ! temp.hideProduction && !! temp.hideNonProduction ) :
							scope.push('production');
						break;

						case ( !! temp.hideProduction && ! temp.hideNonProduction ) :
							scope.push('nonproduction');
						break;

						case ( !! temp.hideProduction && !! temp.hideNonProduction ) :
							scope.push('none');
						break;
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');
					jApp.activeGrid.dataGrid.requestOptions.data.scope = scope.join('_');

				}, // end fn

				toggleProduction : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideProduction = ( !!! temp.hideProduction );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleNonProduction : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideNonProduction = ( !!! temp.hideNonProduction );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleApproved : function( ) {
					jApp.activeGrid.temp.hideApproved = ( typeof jApp.activeGrid.temp.hideApproved === 'undefined')
						? false : !jApp.activeGrid.temp.hideApproved;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleUnapproved : function( ) {
					jApp.activeGrid.temp.hideUnapproved = ( typeof jApp.activeGrid.temp.hideUnapproved === 'undefined')
						? false : !jApp.activeGrid.temp.hideUnapproved;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleHidden : function( ) {
					jApp.activeGrid.temp.hideHidden = ( typeof jApp.activeGrid.temp.hideHidden === 'undefined')
						? false : !jApp.activeGrid.temp.hideHidden;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleInstalled : function( ) {
					jApp.activeGrid.temp.hideInstalled = ( typeof jApp.activeGrid.temp.hideInstalled === 'undefined')
						? false : !jApp.activeGrid.temp.hideInstalled;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				/**
				 * Show only my groups' tasks
				 * @method function
				 * @return {[type]} [description]
				 */
				showOnlyMyGroups : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.showOnlyMyGroups = ( typeof temp.showOnlyMyGroups === 'undefined' )
						? false : ! temp.showOnlyMyGroups;

					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		}
	)
})(jApp);

/**
 * databases.html.js
 *
 * databases view definition
 */

;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. LogosDB',
			required : true,
			_label : 'Enter the Database name',
			'data-validType' : 'Anything'
		},
		{
			name : 'server_id',
			type : 'select',
			_label : 'Select the Primary Database Host Server',
			required : true,
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_labelssource : 'Server.name',
			_optionssource : 'Server.id'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'ha_strategy',
			type : 'textarea',
			_label : 'High Availability Strategy',
		},
		{
			name : 'dr_strategy',
			type : 'textarea',
			_label : 'Disaster Recovery Strategy',
		},
		{
			name : 'upgrade_readiness',
			type : 'textarea',
			_label : 'SQL Server Upgrade Readiness',
		},
	],

	fieldset_2__fields = [
		{
			name : 'rpo',
			type : 'select',
			_label : 'Recovery Point Objective',
			_optionssource : [
				'-Unspecified-',
				'15 Min',
				'1 Hour',
				'1 Day',
				'1 Week'
			]
		},
		{
			name : 'rto',
			type : 'select',
			_label : 'Recovery Time Objective',
			_optionssource : [
				'-Unspecified-',
				'15 Min',
				'1 Hour',
				'1 Day',
				'1 Week'
			]
		},
		{
			name : 'production_flag',
			type : 'select',
			_label : 'Is this database in production ( say yes for prod reporting databases)?',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'inactive_flag',
			type : 'select',
			_label : 'Is this database inactive?',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'ignore_flag',
			type : 'select',
			_label : 'Ignore this database?',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
	],

	fieldset_3__fields = [
		{
			name : 'servers',
			type : 'array',
			_label : 'All Database Servers (Include the Primary Host Server)',
			fields : [
				{
					name : 'servers',
					type : 'select',
					_label : 'Select Servers',
					_labelssource : 'Server.name',
					_optionssource : 'Server.id',
					multiple : true
				}, {
					name : 'server_type',
					type : 'select',
					_optionssource : [
						'Primary Host Server',
						'Secondary Host Server',
						'Primary DR Server',
						'Secondary DR Server',
						'Reporting Server',
						'Other'
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'people',
			type : 'array',
			_label : 'Database Contacts',
			fields : [
				{
					name : 'people',
					type : 'select',
					_label : 'Select Contacts',
					_labelssource : 'Person.name',
					_optionssource : 'Person.id',
					multiple : true
				}, {
					name : 'contact_type',
					type : 'select',
					_optionssource : [
						'Primary',
						'Secondary',
						'Other',
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'applications',
			type : 'array',
			_label : 'Database Applications',
			fields : [
				{
					name : 'applications',
					type : 'select',
					_label : 'Select Applications',
					_labelssource : 'Application.name',
					_optionssource : 'Application.id',
					multiple : true
				}, {
					name : 'database_type',
					type : 'select',
					_optionssource : [
						'Production Database',
						'Test Database',
						'Development Database',
						'Reporting Database',
						'DR Database'
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'tags[]',
			multiple : true,
			type : 'tokens',
			_label : 'Tags',
			_labelssource : 'Tag.name',
			_optionssource : 'Tag.id',
		}
	];

		/**
		 * Add the view
		 * @method addView
		 * @param  {[type]} 'databases' [description]
		 * @param  {[type]} jGridDef    [description]
		 * @param  {[type]} [           					{        						label                  :             'Details' [description]
		 * @param  {[type]} helpText    :             'Please                      fill          out       the           form' [description]
		 * @param  {[type]} class       :             'col-lg-5'                   [description]
		 * @param  {[type]} fields      :             fieldset_1__fields					}     [description]
		 * @param  {[type]} {           						label   :                            '             '         [description]
		 * @param  {[type]} class       :             'col-lg-5'                   [description]
		 * @param  {[type]} fields      :             fieldset_2__fields					}			] [description]
		 */
		jApp.addView('databases',
		{
				model : 'Database',
				columnFriendly : 'name',
				filter : 'ignore_flag = 0',
				gridHeader : {
					icon : 'fa-database',
					headerTitle : 'Manage Databases',
					helpText : "<strong>Note:</strong> Manage Databases Here"
				},
				toggles : {
					ellipses : false
				},
				tableBtns : {
					custom : {
						toggleInactive : {
							type : 'button',
							class : 'btn btn-success active btn-toggle',
							icon : 'fa-toggle-on',
							label : 'Toggle Inactive',
							fn : 'toggleInactive',
							'data-order' : 100
						},
						toggleNonProd: {
							type : 'button',
							class : 'btn btn-success active btn-toggle',
							icon : 'fa-toggle-on',
							label : 'Toggle Non-Production',
							fn : 'toggleNonProd',
							'data-order' : 101
						},
						toggleIgnored: {
							type : 'button',
							class : 'btn btn-success btn-toggle',
							icon : 'fa-toggle-off',
							label : 'Toggle Ignored',
							fn : 'toggleIgnored',
							'data-order' : 102
						},
					},
				},
				rowBtns : {
					custom : {
						markSelected : [
							{ label: 'Flag Selected Databases', class: 'btn btn-primary', icon : 'fa-check-square-o' },
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
										e.preventDefault();
										jApp.activeGrid.fn.markDatabase( { 'inactive_flag' : 1} );
								},
								label : 'As Inactive'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'inactive_flag' : 0})
								},
								label : 'As Not Inactive'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'production_flag' : 1})
								},
								label : 'As Production'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'production_flag' : 0})
								},
								label : 'As Not Production'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'ignore_flag' : 1})
								},
								label : 'As Ignored'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'ignore_flag' : 0})
								},
								label : 'As Not Ignored'
							}
						]
					}
				},
				columns : [ 				// columns to query
					"id",
					"databaseName",
					"host_name",
					"description",
					"people",
					"applications",
					"servers",
					'tags',
				],
				headers : [ 				// headers for table
					"ID",
					"Database",
					"Host",
					"Description",
					"Contacts",
					"Applications",
					"Servers",
					"Tags"
				],
				templates : { 				// html template functions

					host_name : function(value) {
						var r = jApp.aG().currentRow;

						return _.get('name',r.host || '','fa-building-o','Server');
					},

					rpo : function(value) {
						var r = jApp.aG().currentRow,
							rpo = ( r.rpo != null ) ? r.rpo : '-',
							rto = ( r.rto != null ) ? r.rto : '-';

						return rpo + ' / ' + rto;
					},

					production_flag : function(value) {
						_.getFlag(value,'Production','Test','danger','success');
					},

					applications : function(arr) {
						return _.get('name', arr, 'fa-cubes', 'Application' );
					},

					servers : function(arr) {
						return _.get('name', arr, 'fa-building-o', 'Server' );
					},

				},
				fn : {
					/**
					 * Mark selected databases
					 * @method function
					 * @return {[type]} [description]
					 */
					markDatabase			: function( atts ) {
						jApp.aG().action = 'withSelectedUpdate';
						jUtility.withSelected('custom', function(ids) {
							jUtility.postJSON( {
								url : jUtility.getCurrentFormAction(),
								success : jUtility.callback.submitCurrentForm,
								data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
							});
						});
					}, // end fn

					/**
					 * Update the grid filter with the current values
					 * @method function
					 * @return {[type]} [description]
					 */
					updateGridFilter : function() {
						var filter = [], temp = jApp.activeGrid.temp;

						if (typeof temp.hideInactive !== 'undefined' && !!temp.hideInactive) {
							filter.push('inactive_flag = 0');
						}

						if (typeof temp.hideNonProd !== 'undefined' && !!temp.hideNonProd) {
							filter.push('production_flag = 1');
						}

						if (typeof temp.showIgnored === 'undefined' || !temp.showIgnored) {
							filter.push('ignore_flag = 0');
						}

						jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

					}, // end fn

					/**
					 * Toggle inactive visibility
					 * @method function
					 * @return {[type]} [description]
					 */
					toggleInactive : function( ) {
						jApp.activeGrid.temp.hideInactive = ( typeof jApp.activeGrid.temp.hideInactive === 'undefined')
							? true : !jApp.activeGrid.temp.hideInactive;
						jApp.activeGrid.fn.updateGridFilter();
						jUtility.executeGridDataRequest();
						$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					}, //end fn

					/**
					 * Toggle non-production visibility
					 * @method function
					 * @return {[type]} [description]
					 */
					toggleNonProd : function( ) {
						jApp.activeGrid.temp.hideNonProd = ( typeof jApp.activeGrid.temp.hideNonProd === 'undefined')
							? true : !jApp.activeGrid.temp.hideNonProd;
						jApp.activeGrid.fn.updateGridFilter();
						jUtility.executeGridDataRequest();
						$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					}, //end fn

					/**
					 * Toggle ignored visibility
					 * @method function
					 * @return {[type]} [description]
					 */
					toggleIgnored : function( ) {
						jApp.activeGrid.temp.showIgnored = ( typeof jApp.activeGrid.temp.showIgnored === 'undefined')
							? true : !jApp.activeGrid.temp.showIgnored;
						jApp.activeGrid.fn.updateGridFilter();
						jUtility.executeGridDataRequest();
						$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					}, //end fn
				}
			},
			[ // colparams
					{ // fieldset
						label : 'Details',
						helpText : 'Please fill out the form',
						class : 'col-lg-3',
						fields : fieldset_1__fields
					},

					{ // fieldset
						label : ' ',
						class : 'col-lg-4',
						fields : fieldset_2__fields
					},

					{ // fieldset
						label : ' ',
						class : 'col-lg-5',
						fields : fieldset_3__fields
					},
			]);

})(jApp);

/**
 * admin.operatingSystems.html.js
 *
 * operating systems view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'A unique name',
			required : true,
			_label : 'Enter the name of the Document.',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'original_file',
			type : 'file',
			_label : 'Upload XML File',
		},
		{
			name : 'person_id',
			type : 'select',
			_label : 'Document Owner',
			_firstlabel : '-Choose-',
			_firstoption : null,
			_labelssource : 'Person.name',
			_optionssource : 'Person.id',
			required : true,
			'data-validType' : 'select'
		},
		{
			name : 'tags',
      _label : 'Tags',
			type : 'tokens',
			_optionssource : 'Tag.id',
			_labelssource : 'Tag.name',
      multiple : true
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('documents',
	{
		model : 'Document',
		columnFriendly : 'name',
		gridHeader : {
			icon : 'fa-file-text-o',
			headerTitle : 'GIS Documents',
			helpText : 'Note: Create, Update, and Manage GIS documents here.'
		},
		toggles : {
			ellipses : false
		},
		columns : [ 				// columns to query
			"id",
			"name",
			"description",
			"raw_file_path",
			"parsed_file_path",
			"owner",
			"status",
			"tags"
		],
		headers : [ 				// headers for table
			"ID",
			"Title",
			"Description",
			"Original File",
			"Parsed File",
			"Owner",
			"Status",
			"Tags"
		],
		templates : { 				// html template functions

			"owner" : function(value) {
				var r = jApp.aG().currentRow;
				return _.get('name',r.owner,'fa-male','Person');
			},

			"raw_file_path" : function(value) {
				var r = jApp.aG().currentRow, v;
				if (value.length > 30) {
					v = value.substring(0,30) + '...';
				}
				return  "<a title=\"" + value + "\" href=\"documents/" + r.id + "/raw\" target=\"_blank\">" + v + '</a>';
			},

			"parsed_file_path" : function(value) {
				var r = jApp.aG().currentRow, v;
				if (value.length > 30) {
					v = value.substring(0,30) + '...';
				}
				return  "<a title=\"" + value + "\" href=\"documents/" + r.id + "/pdf\" target=\"_blank\">" + v + '</a>';
			},

		},
	},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-3',
					fields : fieldset_1__fields
				},
		]
	)
})(jApp);

/**
 * admin.groups.html.js
 *
 * admin.groups view definition
 */
;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('logs',
	{	
		model : 'LogEntry',
		columnFriendly : 'reported_at',
		filter : 'notified_at is null',
		toggles : {
			new : false,
			edit : false,
			del : false,
		},
		gridHeader : {
			icon : 'fa-list-alt',
			headerTitle : 'Logs',
			helpText : "Most recent shown first"
		},
		refreshInterval : 22000,
		order : 'latest',
		tableBtns : {
			custom : {
				toggleUnimportant : {
					type : 'button',
					class : 'btn btn-success active btn-toggle btn-toggleUnimportant',
					icon : 'fa-toggle-on',
					label : 'Toggle Low-Importance Entries',
					fn : 'toggleUnimportant',
					'data-order' : 100
				},
				toggleDashboard : {
					type : 'button',
					class : 'btn btn-success btn-toggle btn-toggleDashboard',
					icon : 'fa-toggle-off',
					label : 'Toggle Dashboard Entries',
					fn : 'toggleDashboard',
					'data-order' : 101
				},
				toggleNotified : {
					type : 'button',
					class : 'btn btn-success btn-toggle btn-toggleNotified',
					icon : 'fa-toggle-off',
					label : 'Toggle Notified Entries',
					fn : 'toggleNotified',
					'data-order' : 102
				},

			}
		},

		rowBtns : {
			updateSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-bell-slash-o',
				label : 'Silence Notifications...',
				fn : function(e) {
					e.preventDefault();
					bootbox.prompt('How many hours should the selected entries be silenced for?', function( response ) {
						if ( ! isNaN(response) ) {
							jApp.activeGrid.fn.silenceNotifications({ 'hours' : response });
						} else {
							bootbox.alert('Please enter a numeric value for hours.');
						}
					});
				},
				'data-order' : 100
			}
		},

		fn : {
			toggleUnimportant : function() {
				var temp = jApp.activeGrid.temp, 
					data = jApp.activeGrid.dataGrid.requestOptions.data;

				temp.hideUnimportant = ( !!! temp.hideUnimportant );

				data.scope = ( temp.hideUnimportant ) ? 'important' : 'all';

				jUtility.executeGridDataRequest();

				$(this).toggleClass('active')
					.find('i').toggleClass('fa-toggle-on fa-toggle-off');
			},

			toggleDashboard : function() {
				var temp = jApp.activeGrid.temp, 
					data = jApp.activeGrid.dataGrid.requestOptions.data;

				temp.toggleDashboard = ( !!! temp.toggleDashboard );

				data.scope = ( temp.toggleDashboard ) ? 'dashboard' : 'all';

				jUtility.executeGridDataRequest();

				$('.btn-toggleUnimportant').removeClass('active')
					.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');

				$(this).toggleClass('active')
					.find('i').toggleClass('fa-toggle-on fa-toggle-off');
			},

			toggleNotified : function() {
				var temp = jApp.activeGrid.temp, 
					data = jApp.activeGrid.dataGrid.requestOptions.data;

				temp.toggleNotified = ( !!! temp.toggleNotified );

				data.filter = ( temp.toggleNotified ) ? '' : 'notified_at is null';

				jUtility.executeGridDataRequest();

				$(this).toggleClass('active')
					.find('i').toggleClass('fa-toggle-on fa-toggle-off');
			},

			silenceNotifications : function( data ) {
				jApp.aG().action = 'withSelectedUpdate';
				jUtility.withSelected('custom', function(ids) {
					jUtility.postJSON( {
						url : jUtility.getCurrentFormAction(),
						success : jUtility.callback.submitCurrentForm,
						data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, data )
					});
				});
			},
		},
		
		columns : [ 				// columns to query
			"id",
			"level_name",
			"channel",
			"loggable_type",
			"message",
			"updated_at_for_humans",

		],
		headers : [ 				// headers for table
			"ID",
			"Level",
			"Channel",
			"Source",
			"Message",
			"Date Reported",
		],

		templates : {

			loggable_type : function(val) {
				var r = jApp.activeGrid.currentRow;

				return val.split('\\').slice(1).join(':') + ':' + r.loggable.name;
			},

			level_name : function(val) {
				var r = jApp.activeGrid.currentRow;

				return r.level + " " + val;
			},

			id : function(val) {
				return val;
			}
		},
	},
		[]
	);

})(jApp)

/**
 * maintenanceWindows.html.js
 *
 * applications view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'start_at',
			placeholder : 'YYYY-MM-DD HH:ii:ss',
			required : true,
			_label : 'When to start maintenance',
			'data-validType' : 'Anything'
		},
		{
			name : 'end_at',
			placeholder : 'YYYY-MM-DD HH:ii:ss',
			required : true,
			_label : 'When to end maintenance',
			'data-validType' : 'Anything'
		},
		{
			name : 'group_id',
			_label : 'What group\'s servers to target',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
		},
		{
			name : 'server_scope',
			_label : 'What servers to target',
			type : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : [
				'test',
				'prod',
				'both',
			],
		},
		
	], fieldset_2__fields = [
		{
			name : 'approve_flag',
			_label : 'Approve Updates?',
			type : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_labelssource : [ 'Yes','No' ],
			_optionssource : [ 1,0 ],
		},
		{
			name : 'install_flag',
			_label : 'Install Updates?',
			type : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_labelssource : [ 'Yes','No' ],
			_optionssource : [ 1,0 ],
		},
		{
			name : 'reboot_flag',
			_label : 'Reboot Servers?',
			type : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_labelssource : [ 'Yes','No' ],
			_optionssource : [ 1,0 ],
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('maintenanceWindows',
		{ // grid definition
			model : 'MaintenanceWindow',
			columnFriendly : 'start_at',
			scope : 'active',
			gridHeader : {
				icon : 'fa-windows',
				headerTitle : 'Manage Maintenance Windows',
				helpText : "<strong>Note:</strong> Manage Maintenance Windows Here"
			},
			tableBtns : {
				custom : {
					toggleInactive : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Inactive',
						fn : 'toggleInactive',
						'data-order' : 100
					},
					toggleExpired : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Expired',
						fn : 'toggleExpired',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				custom : {
					markSelected : [
						{ label: 'Flag Selected Maintenance Windows', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markMaintenanceWindow( { 'inactive_flag' : 1 } );
							},
							label : 'As Inactive'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markMaintenanceWindow({ 'inactive_flag' : 0 })
							},
							label : 'As Not Inactive'
						},
					]
				},
			},
			columns : [ 				// columns to query
				"id",
				"start_at",
				"end_at",
				"group",
				"server_scope",
				"approve_flag",
				"install_flag",
				"reboot_flag",
				"inactive_flag",
			],
			headers : [ 				// headers for table
				"ID",
				"Start",
				"End",
				"Group",
				"Scope",
				"Approve",
				"Install",
				"Reboot",
				"Active",
			],
			templates : { 				// html template functions

				name : function( value ) {
					var r = jApp.activeGrid.currentRow, status, className, label = '';

					if ( !! +r.inactive_flag ) {
						label = '<div class="label-sm label label-warning">Inactive</div> ';
					}

					return label + _.nameButton( value, 'fa-cubes' );
				},

				group : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.group || '', 'fa-users','Group');
				},

				approve_flag : function(val) {
					return _.getFlag(val);
				},

				install_flag : function(val) {
					return _.getFlag(val);
				},

				reboot_flag : function(val) {
					return _.getFlag(val);
				},

				inactive_flag : function(val) {
					return _.getFlag( !!! val);
				},
			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markMaintenanceWindow			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var scope, temp = jApp.activeGrid.temp;

					if (typeof temp.hideInactive == 'undefined' || !!temp.hideInactive) {
						scope = 'active';
					}

					if (typeof temp.showExpired !== 'undefined' && !!temp.showExpired ) {
						scope = 'all';
					}

					jApp.activeGrid.dataGrid.requestOptions.data.scope = scope;

				}, // end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleInactive : function( ) {
					jApp.activeGrid.temp.hideInactive = ( typeof jApp.activeGrid.temp.hideInactive === 'undefined')
						? true : !jApp.activeGrid.temp.hideInactive;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
				
				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleExpired : function( ) {
					jApp.activeGrid.temp.showExpired = ( typeof jApp.activeGrid.temp.showExpired === 'undefined')
						? true : !jApp.activeGrid.temp.showExpired;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-5',
					fields : fieldset_1__fields
				},

				{ // fieldset
					label : 'Actions to perform',
					class : 'col-lg-5',
					fields : fieldset_2__fields
				}
		]
	)
})(jApp);

/**
 * outages.html.js
 *
 * outages view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'outage_date',
			required : true,
			_label : 'Enter the date of the Outage.',
			'data-validType' : 'date_gt_2016-01-01'
		},
		{
			name : 'complete_flag',
      _label : 'Is this Outage complete?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'tasks',
			_label : 'What tasks should be peformed during this Outage?',
			type : 'select',
			_optionssource : 'OutageTask.id',
			_labelssource : 'OutageTask.name',
			multiple : true,
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('outages',
		{ // grid definition
			model : 'Outage',
			columnFriendly : 'name',
			filter : 'complete_flag = 0',
			gridHeader : {
				icon : 'fa-power-off',
				headerTitle : 'Manage Outages',
				helpText : "<strong>Note:</strong> Manage Outage Dates Here"
			},
			tableBtns : {
				custom : {
					toggleInactive : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Complete',
						fn : 'toggleComplete',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Flag Selected Outage', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markOutage( { 'complete_flag' : 1} );
						},
						label : 'As Complete'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markOutage({ 'complete_flag' : 0})
						},
						label : 'As Not Complete'
					},
				]
			},
			columns : [ 				// columns to query
				"id",
				"outage_date",
        "complete_flag",
			],
			headers : [ 				// headers for table
				"ID",
				"Outage Date",
        "Complete?"
			],
			templates : { 				// html template functions
        outage_date : function(val) {
          return _.nameButton(val,'fa-power-off');
        },

        complete_flag : function(val) {
          return _.getFlag(val,'Yes','No');
        }
			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markOutage			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp;

					if (typeof temp.showComplete === 'undefined' || ! temp.showComplete) {
						filter.push('complete_flag = 0');
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

				}, // end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleComplete : function( ) {
					jApp.activeGrid.temp.showComplete = ( typeof jApp.activeGrid.temp.showComplete === 'undefined')
						? true : !jApp.activeGrid.temp.showComplete;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-3',
					fields : fieldset_1__fields
				},
		]
	)
})(jApp);

/**
 * outageTaskDetails.html.js
 *
 * outage task details view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			_label : 'Task Name',
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'group_id',
			_label : 'What Group "owns" this Task?',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
		},
		{
			name : 'outage_id',
			type : 'select',
			_label : 'Outage Date',
			_optionssource : 'Outage.id',
			_labelssource : 'Outage.outage_date',
			_firstoption : null,
			_firstlabel : '-Choose-',
			required : true,
			'data-validType' : 'select'
		},
		{
			name : 'person_id',
			type : 'select',
			_label : 'Assignee',
			_optionssource : 'Person.id',
			_labelssource : 'Person.name',
			_firstlabel : '-Unspecified-',
			_firstoption : null
		},
		{
			name : 'status',
			type : 'select',
			_label : 'Status',
			_optionssource : [
				'New',
				'Pending',
				'In Progress',
				'Complete',
				'Restarted',
				'Flagged',
				'Skipped',
				'Other'
			]
		},
		{
			name : 'notes',
			_label : 'Notes',
			type : 'textarea'
		}
	], fieldset_2__fields = [
		{
			name : 'task_type',
			_label : 'What type of Task is this?',
			type : 'select',
			_optionssource : [
				'-Choose-',
				'Server Task',
				'Application Task',
				'Database Task',
				'Other'
			],
			required : true,
			'data-validType' : 'select',
		},
		{
			name : 'server_id',
			type : 'select',
			_label : 'Perform this task on this server.',
			_labelssource : 'Server.name',
			_optionssource : 'Server.id',
			_firstoption : null,
			_firstlabel : '-N/A-'
		},
		{
			name : 'application_id',
			type : 'select',
			_label : 'Perform this task on this application.',
			_labelssource : 'Application.name',
			_optionssource : 'Application.id',
			_firstoption : null,
			_firstlabel : '-N/A-'
		},
		{
			name : 'database_id',
			type : 'select',
			_label : 'Perform this task on this database.',
			_labelssource : 'Database.name',
			_optionssource : 'Database.id',
			_firstoption : null,
			_firstlabel : '-N/A-'
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('outageTaskDetails',
		{ // grid definition
			model : 'OutageTaskDetail',
			filter : "status not in ('Complete','Skipped') and :show__only__my__groups:",
			refreshInterval : 12000,
			model_display : 'Task',
			columnFriendly : 'name',
			toggles : {
				ellipses : false
			},
			gridHeader : {
				icon : 'fa-check-square-o',
				headerTitle : 'Manage Outage Tasks',
				helpText : "<strong>Note:</strong> Only approved updates will be installed. <a href='approveUpdates'>Approve Updates</a>"
			},
			tableBtns : {
				custom : {
					showOnlyMine : {
						type : 'button',
						class : 'btn btn-success btn-toggle btn-showOnlyMine',
						icon : 'fa-toggle-off',
						label : 'Show Only My Tasks',
						fn : 'showOnlyMine',
						'data-order' : 97
					},
					showOnlyMyGroups : {
						type : 'button',
						class : 'btn btn-success active btn-toggle btn-showOnlyMyGroups',
						icon : 'fa-toggle-on',
						label : 'Show Only My Groups\' Tasks',
						fn : 'showOnlyMyGroups',
						'data-order' : 98
					},
					showOnlyAvailable : {
						type : 'button',
						class : 'btn btn-success btn-toggle btn-showOnlyAvailable',
						icon : 'fa-toggle-off',
						label : 'Show Only Available Tasks',
						fn : 'showOnlyAvailable',
						'data-order' : 99
					},
					toggleHidden : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Hidden',
						fn : 'toggleHidden',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				custom : {
					assignToMe : {
						type : 'button',
						class : 'btn btn-primary',
						icon : 'fa-user',
						label : 'Assign Selected To Me...',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.assignToMe( { 'person_id' : ':user__person__id:'} );
						},
					},

					markServers : [
						{ label: 'Set Selected Server Status...', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer({ 'status' : 'Update Software'})
							},
							label : 'Update Agent Software'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer({ 'status' : 'Look For Updates'})
							},
							label : 'As Look For Updates'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									bootbox.confirm('Are you sure you want to begin installing updates on these servers?', function(response) {
					          if (!!response) {
					            jApp.activeGrid.fn.markServer( { 'status' : 'Ready For Updates'} );
					          }
					        });

							},
							label : 'As Ready For Updates'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer({ 'status' : 'Idle'})
							},
							label : 'As Not Ready For Updates'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								bootbox.confirm('Are you sure you want reboot these servers?', function(response) {
									if (!!response) {
										jApp.activeGrid.fn.markServer( { 'status' : 'Ready For Reboot'} );
									}
								});
							},
							label : 'As Ready For Reboot'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer( { 'status' : 'Abort Reboot'} );
							},
							label : 'As Cancel Reboot',
						},
					],

					markSelected : [
						{ label: 'Set Selected Tasks Status...', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'New'} );
							},
							label : 'As New'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Pending'} );
							},
							label : 'As Pending'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'In Progress'} );
							},
							label : 'As In Progress'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Restarted'} );
							},
							label : 'As Restarted'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Complete'} );
							},
							label : 'As Complete'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Skipped'} );
							},
							label : 'As Skipped'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Flagged'} );
							},
							label : 'As Flagged'
						},

					]
				},
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"scope",
				"outage_date",
				"task_template",
				"assignee",
				"server_updated",
				"server_status",
				"updated_at_for_humans",
				"status",

			],
			headers : [ 				// headers for table
				"ID",
				"Task Name",
				"Scope",
				"Outage Date",
				"Task Template",
        "Assignee",
				"Server Modified",
				"Server Status",
				"Task Modified",
				"Task Status",
			],
			templates : { 				// html template functions



				inactive_flag : function(val) {
          return _.getFlag(val,'Yes','No');
        },

				assignee : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name',r.assignee,'fa-male','Person');
				},

				task_template : function(val) {
					var r = jApp.activeGrid.currentRow;

					if ( r.outage_task == null ) return '';

					return _.get('name',r.outage_task,'fa-file-text-o','OutageTask');
				},

				outage_date : function() {
					var r = jApp.activeGrid.currentRow;
					return _.get('outage_date',r.outage,'fa-power-off','Outage');
				},

				scope : function() {
					var r = jApp.activeGrid.currentRow,
							ret = [];

					if ( !! r.server ) {
						ret.push(_.get('name',r.server,'fa-building-o','Server'));
					}

					if ( !! r.application ) {
						ret.push(_.get('name',r.application,'fa-cubes','Application') );
					}

					if ( !! r.database ) {
						ret.push( _.get('name',r.database,'fa-database','Database') );
					}

					ret.push('</table>');

					return ret.join(' ');
				},

				status : function(val) {
					var r = jApp.activeGrid.currentRow,
							notes = r.notes || '',
							label = val + ' ' + notes;

					switch(val) {
						case 'New' :
							return _.getLabel(label,'fa-circle-o','darkblue','white');

						case 'Pending' :
							return _.getLabel(label,'fa-pause','purple','white');

						case 'In Progress' :
							return _.getLabel(label,'fa-play','skyblue');

						case 'Restarted' :
							return _.getLabel(label,'fa-refresh','royalblue','white');

						case 'Complete' :
							return _.getLabel(label,'fa-check-square-o','lightgreen');

						case 'Skipped' :
							return _.getLabel(label,'fa-fast-forward','darkred','white');

						case 'Flagged' :
							return _.getLabel(label,'fa-flag','red','white');

					}
					return _.getLabel(label,'default');
				},

				server_status : function(val) {
					var r = jApp.activeGrid.currentRow,
							server = r.server,
							status = ( server != null ) ? server.status : ' ';

					return status || '';
				},

				server_updated : function(val) {
					var r = jApp.activeGrid.currentRow,
							server = r.server,
							updated = ( server != null ) ? server.updated_at_for_humans : ' ';

					return updated || '';
				},


			},
			fn : {

				/**
				 * Custom form bootup function
				 * @method function
				 * @return {[type]} [description]
				 */
				formBootup : function() {
					var frm = jUtility.$currentFormWrapper();
					console.log('running custom bootup function');
					frm.find('#server_id').closest('.form_element').hide();
					frm.find('#application_id').closest('.form_element').hide();
					frm.find('#database_id').closest('.form_element').hide();

					frm.find('#task_type').change( jApp.aG().fn.updateFormFields);

					jApp.aG().fn.updateFormFields();
				}, // end fn

				/**
				 * Custom getRowData callback function, runs after the row data is populated
				 * @method function
				 * @return {[type]} [description]
				 */
				getRowDataCallback : function() {
					console.log('running custom getRowData callback');
					jApp.aG().fn.updateFormFields();
				}, // end fn

				/**
				 * Update what form fields are visible
				 * @method function
				 * @return {[type]} [description]
				 */
				updateFormFields : function() {
					var frm = jUtility.$currentFormWrapper();

					if ( ! frm ) { return false; }

					switch( frm.find('#task_type').val()  ) {
						case 'Server Task' :
							frm.find('#server_id').prop('disabled',false).closest('.form_element').show();
							frm.find('#application_id').prop('disabled',true).closest('.form_element').hide();
							frm.find('#database_id').prop('disabled',true).closest('.form_element').hide();
							return true;

						case 'Application Task' :
							frm.find('#server_id').prop('disabled',true).closest('.form_element').hide();
							frm.find('#application_id').prop('disabled',false).closest('.form_element').show();
							frm.find('#database_id').prop('disabled',true).closest('.form_element').hide();
							return true;

						case 'Database Task' :
							frm.find('#server_id').prop('disabled',true).closest('.form_element').hide();
							frm.find('#application_id').prop('disabled',true).closest('.form_element').hide();
							frm.find('#database_id').prop('disabled',false).closest('.form_element').show();
							return true;

						case 'Other' :
							frm.find('#server_id').prop('disabled',false).closest('.form_element').show();
							frm.find('#application_id').prop('disabled',false).closest('.form_element').show();
							frm.find('#database_id').prop('disabled',false).closest('.form_element').show();
							return true;
					}
				}, // end fn

				/**
				 * Assign the selected tasks to me
				 * @method function
				 * @return {[type]} [description]
				 */
				assignToMe			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				markOutageTask			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				markServer			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction() + 'Servers',
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp;

					if (typeof temp.showHidden === 'undefined' || ! temp.showHidden) {
						filter.push("status not in ('Complete','Skipped')");
					}

					if (typeof temp.showOnlyAvailable !== 'undefined' && !! temp.showOnlyAvailable) {
						filter.push(":show__only__available:");
					}

					if (typeof temp.showOnlyMyGroups !== 'undefined' && !! temp.showOnlyMyGroups) {
						filter.push(":show__only__my__groups:");
					}

					if (typeof temp.showOnlyMine !== 'undefined' && !! temp.showOnlyMine) {
						filter.push("person_id = :user__person__id:");
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

				}, // end fn

				/**
				 * Show only my tasks
				 * @method function
				 * @return {[type]} [description]
				 */
				showOnlyMine : function( ) {
					jApp.activeGrid.temp.showOnlyMine = ( typeof jApp.activeGrid.temp.showOnlyMine === 'undefined')
						? true : !jApp.activeGrid.temp.showOnlyMine;

					jApp.activeGrid.temp.showOnlyAvailable = false;
					jApp.activeGrid.temp.showOnlyMyGroups = false;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					$('.btn-showOnlyAvailable').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
					$('.btn-showOnlyMyGroups').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
				}, //end fn

				/**
				 * Show only my groups' tasks
				 * @method function
				 * @return {[type]} [description]
				 */
				showOnlyMyGroups : function( ) {
					jApp.activeGrid.temp.showOnlyMyGroups = ( typeof jApp.activeGrid.temp.showOnlyMyGroups === 'undefined')
						? false : !jApp.activeGrid.temp.showOnlyMyGroups;

					jApp.activeGrid.temp.showOnlyMine = false;
					jApp.activeGrid.temp.showOnlyAvailable = false;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					$('.btn-showOnlyAvailable').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
					$('.btn-showOnlyMine').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
				}, //end fn

				/**
				 * Show only available tasks
				 * @method function
				 * @return {[type]} [description]
				 */
				showOnlyAvailable : function( ) {
					jApp.activeGrid.temp.showOnlyAvailable = ( typeof jApp.activeGrid.temp.showOnlyAvailable === 'undefined')
						? true : !jApp.activeGrid.temp.showOnlyAvailable;

					jApp.activeGrid.temp.showOnlyMine = false;
					jApp.activeGrid.temp.showOnlyMyGroups = false;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					$('.btn-showOnlyMine').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
					$('.btn-showOnlyMyGroups').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
				}, //end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleHidden : function( ) {
					jApp.activeGrid.temp.showHidden = ( typeof jApp.activeGrid.temp.showHidden === 'undefined')
						? true : !jApp.activeGrid.temp.showHidden;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		},
		[ // colparams
				{ // fieldset
					label : 'Task Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-4',
					fields : fieldset_1__fields
				},
				{ // fieldset
					label : 'Task Scope',
					helpText : 'What should the task be performed on?',
					class : 'col-lg-8',
					fields : fieldset_2__fields
				},
		]
	)
})(jApp);

/**
 * outagetasks.html.js
 *
 * outage tasks view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			required : true,
			_label : 'Enter a name for this Task.',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'group_id',
			_label : 'What Group "owns" this Task? A member of this group will perform the task.',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
		},
		{
			name : 'inactive_flag',
			_label : 'Is this Task inactive?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'scope_to_outages',
			type : 'select',
			_label : 'What Outages should this task be assigned to?',
			_labelssource : 'Outage.outage_date',
			_optionssource : 'Outage.id',
			multiple : true
		}
	], fieldset_2__fields = [
		{
			name : 'task_type',
			_label : 'What type of Task is this?',
			type : 'select',
			_optionssource : [
				'-Choose-',
				'Server Task',
				'Application Task',
				'Database Task',
				'Other'
			],
			required : true,
			'data-validType' : 'select'
		},
		{
			name : 'criteria_selection',
			_label : 'How do you want to specify the scope of this task?',
			type : 'select',
			_labelssource : [
				'Automatically, based on specified criteria',
				'Manually',
			],
			_optionssource : [
				'Automatic',
				'Manual',
			]
		},
		{
			name : 'scope_to_servers',
			type : 'select',
			_label : 'This task will be performed on these servers.',
			_labelssource : 'Server.name',
			_optionssource : 'Server.id',
			multiple : true
		},
		{
			name : 'scope_to_applications',
			type : 'select',
			_label : 'This task will be performed on these applications.',
			_labelssource : 'Application.name',
			_optionssource : 'Application.id',
			multiple : true
		},
		{
			name : 'scope_to_databases',
			type : 'select',
			_label : 'This task will be performed on these databases.',
			_labelssource : 'Database.name',
			_optionssource : 'Database.id',
			multiple : true
		},
		{
			name : 'scope_to_groups',
			type : 'select',
			_label : 'This task will be performed on Servers/Applications/Databases owned by these groups.',
			_labelssource : 'Group.name',
			_optionssource : 'Group.id',
			multiple : true
		},
		{
			name : 'scope_to_operating_systems',
			type : 'select',
			_label : 'This task will be limited to servers with these operating systems.',
			_labelssource : 'OperatingSystem.name',
			_optionssource : 'OperatingSystem.id',
			multiple : true
		},
		{
			name : 'scope_to_production_servers',
			type : 'select',
			_label : 'This task will be limited to the selected server types.',
			_labelssource : [ '-All-','Production Only','Non-Production Only' ],
			_optionssource : ['0','1','2'],
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('outageTasks',
		{ // grid definition
			model : 'OutageTask',
			filter : 'inactive_flag = 0',
			toggles : {
				ellipses : false
			},
			model_display : 'Template',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-file-text-o',
				headerTitle : 'Manage Outage Tasks Templates',
				helpText : "<strong>Note:</strong> Manage Outage Task Templates Here"
			},
			tableBtns : {
				custom : {
					toggleInactive : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Inactive',
						fn : 'toggleInactive',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Flag Selected Outage Task', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markOutageTask( { 'inactive_flag' : 1} );
						},
						label : 'As Inactive'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markOutageTask({ 'inactive_flag' : 0})
						},
						label : 'As Not Inactive'
					},
				]
			},
			columns : [ 				// columns to query
				"id",
				"name",
        "owner",
				"task_type",
				"inactive_flag",
				"scope"
			],
			headers : [ 				// headers for table
				"ID",
				"Task Name",
        "Owner",
				"Task Type",
				"Inactive?",
				"Scope"
			],
			templates : { 				// html template functions

        inactive_flag : function(val) {
          return _.getFlag(val,'Yes','No');
        },

				owner : function(val) {
					return _.get('name',val,'fa-users','Group');
				},

				scope : function() {
					var r = jApp.activeGrid.currentRow,
							ret = ['<table class="table-striped">'];

					if ( !! r.assign_to_groups && !!r.assign_to_groups.length ) {
						ret.push('<tr>');
						ret.push('<td>Assignable Groups</td>');
						ret.push('<td>' +  _.get('name',r.assign_to_groups,'fa-users','Group') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.assign_to_people && !!r.assign_to_people.length ) {
						ret.push('<tr>');
						ret.push('<td>Assignable People</td>');
						ret.push('<td>' +  _.get('name',r.assign_to_people,'fa-male','Person') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_outages && !!r.scope_to_outages.length ) {
						ret.push('<tr>');
						ret.push('<td>Outages</td>');
						ret.push('<td>' +  _.get('outage_date',r.scope_to_outages,'fa-power-off','Outage') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_servers && !!r.scope_to_servers.length ) {
						ret.push('<tr>');
						ret.push('<td>Servers</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_servers,'fa-building-o','Server') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_applications && !!r.scope_to_applications.length ) {
						ret.push('<tr>');
						ret.push('<td>Applications</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_applications,'fa-cubes','Application') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_databases && !!r.scope_to_databases.length ) {
						ret.push('<tr>');
						ret.push('<td>Databases</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_databases,'fa-database','Database') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_operating_systems && !!r.scope_to_operating_systems.length ) {
						ret.push('<tr>');
						ret.push('<td>Operating Systems</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_operating_systems,'fa-windows','OperatingSystem') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_groups && !!r.scope_to_groups.length ) {
						ret.push('<tr>');
						ret.push('<td>Objects Owned By Groups</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_groups,'fa-users','Group') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! +r.scope_to_production_servers ) {
						var tmp = ( r.scope_to_production_servers == '2' ) ? 'Non-Production Only' : 'Production Only'
						ret.push('<tr>');
						ret.push('<td>Type</td>');
						ret.push('<td>' +  tmp + '</td>' );
						ret.push('</tr>');
					}

					ret.push('</table>');

					return ret.join(' ');
				}
			},
			fn : {

				/**
				 * Custom form bootup function
				 * @method function
				 * @return {[type]} [description]
				 */
				formBootup : function() {
					var frm = jUtility.$currentFormWrapper();
					console.log('running custom bootup function');

					frm.find('#scope_to_servers').closest('.form_element').hide();
					frm.find('#scope_to_applications').closest('.form_element').hide();
					frm.find('#scope_to_databases').closest('.form_element').hide();

					frm.find('#task_type').change( jApp.aG().fn.updateFormFields);
					frm.find('#criteria_selection').change( jApp.aG().fn.updateFormFields);

					jApp.aG().fn.updateFormFields();
				}, // end fn

				/**
				 * Custom getRowData callback function, runs after the row data is populated
				 * @method function
				 * @return {[type]} [description]
				 */
				getRowDataCallback : function() {
					console.log('running custom getRowData callback');
					jApp.aG().fn.updateFormFields();
				}, // end fn

				/**
				 * Update what form fields are visible
				 * @method function
				 * @return {[type]} [description]
				 */
				updateFormFields : function() {
					var frm = jUtility.$currentFormWrapper();

					if ( ! frm ) { return false; }

					switch( frm.find('#task_type').val() + ' ' + frm.find('#criteria_selection').val()  ) {
						case 'Server Task Manual' :
							frm.find('#scope_to_servers').prop('disabled',false).closest('.form_element').show();
							frm.find('#scope_to_applications').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_databases').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_groups').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_operating_systems').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_production_servers').prop('disabled',true).closest('.form_element').hide();
							return true;

						case 'Application Task Manual' :
							frm.find('#scope_to_servers').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_applications').prop('disabled',false).closest('.form_element').show();
							frm.find('#scope_to_databases').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_groups').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_operating_systems').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_production_servers').prop('disabled',true).closest('.form_element').hide();
							return true;

						case 'Database Task Manual' :
							frm.find('#scope_to_servers').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_applications').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_databases').prop('disabled',false).closest('.form_element').show();
							frm.find('#scope_to_groups').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_operating_systems').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_production_servers').prop('disabled',true).closest('.form_element').hide();
							return true;

						case 'Other Manual' :
							frm.find('#scope_to_servers').prop('disabled',false).closest('.form_element').show();
							frm.find('#scope_to_applications').prop('disabled',false).closest('.form_element').show();
							frm.find('#scope_to_databases').prop('disabled',false).closest('.form_element').show();
							frm.find('#scope_to_groups').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_operating_systems').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_production_servers').prop('disabled',true).closest('.form_element').hide();
							return true;

						default :
							frm.find('#scope_to_servers').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_applications').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_databases').prop('disabled',true).closest('.form_element').hide();
							frm.find('#scope_to_groups').prop('disabled',false).closest('.form_element').show();
							frm.find('#scope_to_operating_systems').prop('disabled',false).closest('.form_element').show();
							frm.find('#scope_to_production_servers').prop('disabled',false).closest('.form_element').show();
							return true;
					}
				}, // end fn

				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markOutageTask			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp;

					if (typeof temp.showInactive === 'undefined' || ! temp.showInactive) {
						filter.push('inactive_flag = 0');
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

				}, // end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleInactive : function( ) {
					jApp.activeGrid.temp.showInactive = ( typeof jApp.activeGrid.temp.showInactive === 'undefined')
						? true : !jApp.activeGrid.temp.showInactive;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		},
		[ // colparams
				{ // fieldset
					label : 'Task Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-4',
					fields : fieldset_1__fields
				},
				{ // fieldset
					label : 'Task Scope',
					helpText : 'You may manually specify the scope of the task (i.e. what servers/applications/databases the task will be performed on), or specify criteria that will set the scope automatically.',
					class : 'col-lg-8',
					fields : fieldset_2__fields
				},
		]
	)
})(jApp);

/**
 * admin.groups.html.js
 *
 * admin.groups view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'username',
			placeholder : 'e.g. jsmith',
			required : true,
			_label : 'Username',
			'data-validType' : 'Anything'
		},{
			name : 'email',
			placeholder : 'email@domain.com',
			required : true,
			_label : 'Email Address',
			'data-validType' : 'Email Address'
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('profile',
	{
		model : 'Profile',
		columnFriendly : 'username',
		toggles : {
			new : false,
			del : false,
		},
		gridHeader : {
			icon : 'fa-user',
			headerTitle : 'My Profile',
			helpText : "<strong>Note:</strong> Manage your user accounts here"
		},
		rowBtns : {
			custom : {
				resetPassword : { 'data-multiple' : false, 'data-permission' : 'read_enabled', type : 'button', class : 'btn btn-primary', icon : 'fa-refresh', label : 'Password Reset ...', fn : 'resetPassword'  } // etc.
			}
		},
		columns : [ 				// columns to query
			"id",
			"username",
			"person_name",
			"email",
			"groups",
			"profile_group_roles",
		],
		headers : [ 				// headers for table
			"ID",
			"Username",
			"Name",
			"Email",
			"Groups",
			"Roles",
		],
		html : {
			forms : {
				resetPassword : '<div id="div_resetFrm" class="div-btn-reset min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-yellow"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-refresh fa-fw"></i> Reset Password </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side formContainer"></div> </div> </div> </div> </div>'
			},
		},
		templates : {
			groups : function(arr) {
        return _.get('name', arr, 'fa-users');
      },

			person_name : function() {
				var r = jApp.activeGrid.currentRow;

				return _.get('name', r.person || '','fa-male','Person');
			},
		},
		formDefs : {
			resetPassword : {
				table : 'User',
				pkey : 'id',
				tableFriendly : 'User Password',
				atts : { method : 'PATCH' },
				//loadExternal : false, // treat it like an externally loaded form, but specify params locally
				colParams : [{
					label : 'Reset Password',
					helpText : 'Specify a new password then confirm it to continue.',
					class : 'col-lg-3',
					fields : [
						{ type : 'hidden', readonly : 'readonly', name : 'ContactID' },
						{ type : 'password', name : 'Password1', id : 'Password1', required : 'required', 'data-validType' : 'min>=6', _label : 'New Password', placeholder : '******' },
						{ type : 'password', name : 'Password2', id : 'Password2', required : 'required', 'data-validType' : 'field==#Password1', _label : 'Confirm Password', placeholder : '******' },
					]
				}],
			}
		},
		fn : {
			resetPassword : function() {
				jUtility.actionHelper('resetPassword');
			}, //end fn
		}
	},
		[ // colparams
			{ // fieldset
				label : 'User',
				helpText : 'Update your information here',
				class : 'col-lg-3',
				fields : fieldset_1__fields
			}
		]
	);

})(jApp)

;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('admin.serverAgents',
	{ // grid definition
		model : 'ServerAgent',
		columnFriendly : 'version',
		refreshInterval : 17000,
		gridHeader : {
			icon : 'fa-gears',
			headerTitle : 'Server Agents',
			helpText : "<strong>Note:</strong> These values are auto-populated by the Service Monitor. "
		},
		toggles : {
			new : false,
			edit : false,
			del : false,
			ellipses : false,
		},
		tableBtns : {
			custom : {
				toggleUpToDate : {
					type : 'button',
					class : 'btn btn-success btn-toggle active',
					icon : 'fa-toggle-on',
					label : 'Toggle Up To Date',
					fn : 'toggleUpToDate',
					'data-order' : 99
				},
				toggleRunning : {
					type : 'button',
					class : 'btn btn-success btn-toggle active',
					icon : 'fa-toggle-on',
					label : 'Toggle Running',
					fn : 'toggleRunning',
					'data-order' : 100
				},
			},
		},
		rowBtns : {
			updateSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-gears',
				label : 'Update Agent Software...',
				fn : function(e) {
					e.preventDefault();
					bootbox.confirm('Are you sure you want to update the agent on the selected servers?', function( response ) {
						if ( !!response ) {
							jApp.activeGrid.fn.markServer({ 'status' : 'Update Software'})
						}
					});
				},
				'data-order' : 100
			},
			updateSql : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-gears',
				label : 'Update Sql Server Info...',
				fn : function(e) {
					e.preventDefault();
					jApp.activeGrid.fn.markServer({ 'status' : 'Refresh SQL Server'});
				},
				'data-order' : 100
			},
			runSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-play',
				label : 'Start Agent Service',
				fn : function(e) {
					e.preventDefault();
					jApp.activeGrid.fn.markServer({ 'status' : 'Start Agent'});
				},
				'data-order' : 100
			},
			stopSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-stop',
				label : 'Stop Agent Service',
				fn : function(e) {
					e.preventDefault();
					jApp.activeGrid.fn.markServer({ 'status' : 'Stop Agent'});
				},
				'data-order' : 100
			},
			restartSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-refresh',
				label : 'Restart Agent Service...',
				fn : function(e) {
					e.preventDefault();
					bootbox.confirm('Are you sure you want to restart the agent on the selected servers?', function( response ) {
						if ( !!response ) {
							jApp.activeGrid.fn.markServer({ 'status' : 'Restart Agent'});
						}
					});
				},
				'data-order' : 100
			},
			refreshServices : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-gears',
				label : 'Refresh Services',
				fn : function(e) {
					e.preventDefault();
					jApp.activeGrid.fn.markServer({ 'status' : 'Refresh Services'});
				},
				'data-order' : 100
			},

		},
		fn : {
			/**
			 * Mark selected applications as inactive/active
			 * @method function
			 * @return {[type]} [description]
			 */
			markServer			: function( atts ) {
				jApp.aG().action = 'withSelectedUpdate';
				jUtility.withSelected('custom', function(ids) {
					jUtility.postJSON( {
						url : jUtility.getCurrentFormAction(),
						success : jUtility.callback.submitCurrentForm,
						data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
					});
				});
			}, // end fn
			
			toggleUpToDate : function( ) {
				var temp = jApp.activeGrid.temp;

				temp.hideUpToDate = ( !!! temp.hideUpToDate );
				jApp.activeGrid.fn.updateGridFilter();
				jUtility.executeGridDataRequest();
				$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
			}, //end fn
			
			toggleRunning : function( ) {
				var temp = jApp.activeGrid.temp;

				temp.hideRunning = ( !!! temp.hideRunning );
				jApp.activeGrid.fn.updateGridFilter();
				jUtility.executeGridDataRequest();
				$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
			}, //end fn
			   
			/**
			 * Update the grid filter with the current values
			 * @method function
			 * @return {[type]} [description]
			 */
			updateGridFilter : function() {
				var filter = [], temp = jApp.activeGrid.temp, scope = 'all', data = jApp.activeGrid.dataGrid.requestOptions.data;

				if ( !! temp.hideUpToDate ) {
					scope = 'outdated';
				}

				if ( !! temp.hideRunning ) {
					filter.push( "status <> 'Running'" );
				}

				data.scope = scope;
				data.filter = filter.join(' AND ');

			}, // end fn  
		},
		columns : [ 				// columns to query
			"id",
			"server_name",
			"server_status",
			"version",
			"status",
		],
		headers : [ 				// headers for table
			"ID",
			"Agent",
			"Server Status",
			"Version",
			"Status",
		],
		templates : { 				// html template functions

			server_name : function(val) {
				var r = jApp.activeGrid.currentRow,
					server = r.server;

				if ( r.server_id == null || r.server_id < 1 )
				{
					return "";
				}

				return _.nameButton( r.server.name,  jApp.opts().gridHeader.icon ) + _.getFlag(r.server.production_flag, 'Prod', 'Test', 'primary','success');
			},

			server_status : function(val) {
				var r = jApp.activeGrid.currentRow;

				if ( r.server_id == null || r.server_id < 1 )
				{
					return "";
				}

				return r.server.status + ' <em>' + r.server.updated_at_for_humans + '</em>';
			},

			status : function(val) {
				var r = jApp.activeGrid.currentRow,
					status = ( val == 'Running' ) ? 1 : 0;

				return _.getFlag(status, 'Running', 'Stopped', 'success', 'danger' ) + ' <em>' + r.updated_at_for_humans + '</em>';
			},

		},
	},
		[ ]
	)
})(jApp);

;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('serverDisks',
		{ // grid definition
			model : 'ServerDisk',
			columnFriendly : 'name',
			filter : 'inactive_flag = 0',
			gridHeader : {
				icon : 'fa-files-o',
				headerTitle : 'Server Disks',
				helpText : "<strong>Note:</strong> These values are auto-populated by the Service Monitor. "
			},
			toggles : {
				new : false,
				edit : false,
				del : false,
			},
			tableBtns : {
				custom : {
					toggleInactive : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Inactive',
						fn : 'toggleInactive',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Modify Selected Disks', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markDisk( { 'inactive_flag' : 1} );
						},
						label : 'Flag As Inactive'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markDisk({ 'inactive_flag' : 0})
						},
						label : 'Flag As Active'
					},
				]
			},
			fn : {
							
				toggleUpToDate : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideUpToDate = ( !!! temp.hideUpToDate );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
				
				toggleRunning : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideRunning = ( !!! temp.hideRunning );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
				
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markDisk			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn
				   
				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp, scope = 'all', data = jApp.activeGrid.dataGrid.requestOptions.data;

					if ( !! temp.hideUpToDate ) {
						scope = 'outdated';
					}

					if ( !! temp.hideRunning ) {
						filter.push( "status <> 'Running'" );
					}

					data.scope = scope;
					data.filter = filter.join(' AND ');

				}, // end fn  
				
				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleInactive : function( ) {
					jApp.activeGrid.temp.hideInactive = ( typeof jApp.activeGrid.temp.hideInactive === 'undefined')
						? false : !jApp.activeGrid.temp.hideInactive;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn  
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"server_name",
				"free_pct",
				"free_gb",
				"used_gb",
				"size_gb",
				"inactive_flag",
				"updated_at_for_humans",
			],
			headers : [ 				// headers for table
				"ID",
				"Disk",
				"Server",
				"Percent Free",
				"Free (GB)",
				"Used (GB)",
				"Total (GB)",
				"Active",
				"Last Checkin"
			],
			templates : { 				// html template functions

				name : function(val) 
				{
					var r = jApp.activeGrid.currentRow;

					return _.nameButton( val + ' [' + r.label + ']',  jApp.opts().gridHeader.icon);
				},

				free_pct : function()
				{
					var r = jApp.activeGrid.currentRow,
						free = (r.free_gb / r.size_gb),
						bg = '#80E02C';

					switch(true) {
						case (free < .005) : 	bg = '#FE2C2B'; break;
						case (free < .01 ) :	bg = '#EB472B'; break;
						case (free < .05 ) :	bg = '#D26A2B'; break;
						case (free < .1  ) :	bg = '#BC8A2C'; break;
						case (free < .2  ) :	bg = '#A6AA2C'; break;
						case (free < .3  ) :	bg = '#9EB52C'; break;
						case (free < .4  ) :	bg = '#98BF2C'; break;
						case (free < .5  ) :	bg = '#87D42C'; break;
					}

					return '<div data-free="' + free + '" style="padding: 3px; text-align:right; width:100%;height:100%;background:' + bg + '">' + Math.round( 10000 * free ) / 100 + '</div>';
				},

				used_gb : function(val) 
				{
					return '<div class="pull-right">' + val*1 + '</div>';
				},

				free_gb : function(val) 
				{
					return '<div class="pull-right">' + val*1 + '</div>';
				},

				size_gb : function(val) 
				{
					return '<div class="pull-right">' + val*1 + '</div>';
				},

				server_name : function()
				{
					var r = jApp.activeGrid.currentRow,
						server = r.server;

					if ( server == null )
					{
						return '';
					}

					return _.nameButton( server.name, 'fa-building-o') + _.getFlag(server.production_flag, 'Prod', 'Test', 'primary','success');
				},

				inactive_flag : function(val) {
					return _.getFlag(val,'Inactive','Active','danger','success');
				}
			},
		},
		[ ]
	)
})(jApp);

;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('serverServices',
		{ // grid definition
			model : 'ServerService',
			refreshInterval : 17000,
			columnFriendly : 'name',
			filter : 'ignored_flag = 0',
			scope : 'offline',
			gridHeader : {
				icon : 'fa-gears',
				headerTitle : 'Server Services',
				helpText : "<strong>Note:</strong> These values are auto-populated by the Server Agent. "
			},
			toggles : {
				new : false,
				edit : false,
				del : false,
			},
			tableBtns : {
				custom : {
					toggleRunning : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Running',
						fn : 'toggleRunning',
						'data-order' : 100
					},
					toggleNonAuto : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Non-Auto',
						fn : 'toggleNonAuto',
						'data-order' : 101
					},
					toggleIgnored : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Ignored',
						fn : 'toggleIgnored',
						'data-order' : 102
					},
				},
			},
			rowBtns : {
				startService : {
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						bootbox.confirm('Are you sure you want to start the services on the selected servers?', function( response ) {
							if ( !!response ) {
								jApp.activeGrid.fn.markService( { 'command' : 'start' } );
							}
						});
					},
					label : 'Start Selected...',
					icon : 'fa-play',
					class : 'btn btn-primary',
				},
				refreshService : {
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markService( { 'command' : 'refresh' } );
					},
					label : 'Refresh Selected...',
					icon : 'fa-refresh',
					class : 'btn btn-primary',
				},
				markSelected : [
					{ label: 'Modify Selected Services', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							bootbox.confirm('Are you sure you want to ignore the services on the selected servers?', function( response ) {
								if ( !!response ) {
									jApp.activeGrid.fn.markService( { 'ignored_flag' : 1} );
								}
							});
						},
						label : 'Ignore Selected...'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markService( { 'ignored_flag' : 0} )
						},
						label : 'Don\'t Ignore Selected...'
					},
				]
			},
			fn : {

				toggleRunning : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.showRunning = ( !!! temp.showRunning );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
				   
				toggleNonAuto : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideNonAuto = ( !!! temp.hideNonAuto );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn  
				    
				toggleIgnored : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.showIgnored = ( !!! temp.showIgnored );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
				
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markService			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn
				   
				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp, scope = 'automatic', data = jApp.activeGrid.dataGrid.requestOptions.data;

					if ( !! temp.hideNonAuto ) {
						scope = 'active';
					}

					if ( ! temp.showRunning ) {
						scope = 'offline';
					}

					if ( ! temp.showIgnored ) {
						filter.push('ignored_flag = 0');
					}

					data.scope = scope;
					data.filter = filter.join(' AND ');

				}, // end fn  
			
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"server_name",
				"start_mode",
				"status",
				"command",
				"updated_at_for_humans",
			],
			headers : [ 				// headers for table
				"ID",
				"Service",
				"Server",
				"Start Mode",
				"Status",
				"Action",
				"Last Update"
			],
			templates : { 				// html template functions

				name : function(val) 
				{
					var r = jApp.activeGrid.currentRow;

					if ( !! r.ignored_flag )
					{
						return _.nameButton( val,  jApp.opts().gridHeader.icon) + _.getFlag(r.ignored_flag, 'Ignored', '', 'danger');
					}

					return _.nameButton( val,  jApp.opts().gridHeader.icon);

					
				},

				server_name : function()
				{
					var r = jApp.activeGrid.currentRow;
						server = r.server;

					if ( server == null )
					{
						return '';
					}

					return _.nameButton( server.name, 'fa-building-o') + _.getFlag(server.production_flag, 'Prod', 'Test', 'primary','success');
				},

				status : function( val )
				{
					switch( val.toLowerCase() )
					{
						case 'running' :
							return _.getFlag(1,'Running',null,'success');

						case 'starting' :
							return _.getFlag(1,'Starting',null,'warning');

						case 'stopped' :
							return _.getFlag(1,'Stopped',null,'danger');

						default :
							return _.getFlag(1,val,null,'info');
					}
				}
			},
		},
		[ ]
	)
})(jApp);

/**
 * servers.html.js
 *
 * servers view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. msb01sql',
			required : true,
			_label : 'Enter the Server hostname',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'cname',
			type : 'textarea',
			_label : 'Enter any CNAME(s) (aliases) for this server.',
		},
		{
			name : 'ip',
			_label : 'IP Address',
			//required : true,
			'data-validType' : 'IPV4'
		},

	],

	fieldset_2__fields = [
		{
			name : 'group_id',
			_label : 'What Group "owns" this Server?',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
		},
		{
			name : 'inactive_flag',
			_label : 'Is this server inactive?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'production_flag',
			_label : 'Is this a production server?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'windows_updatable_flag',
			_label : 'Does this server require Windows Updates?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'operating_system_id',
			_label : 'Operating System',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_optionssource : 'OperatingSystem.id',
			_labelssource : 'OperatingSystem.name',
			_firstlabel : '-Choose-',
			_firstoption : null
		},
	],

	fieldset_3__fields = [
		{
			name : 'people',
			type : 'array',
			_label : 'Server Contacts',
			fields : [
				{
					name : 'people',
					type : 'select',
					_label : 'Select Contacts',
					_labelssource : 'Person.name',
					_optionssource : 'Person.id',
					multiple : true
				}, {
					name : 'contact_type',
					type : 'select',
					_optionssource : [
						'Primary',
						'Secondary',
						'Other',
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'applications',
			type : 'array',
			_label : 'Server Applications',
			fields : [
				{
					name : 'applications',
					type : 'select',
					_label : 'Select Applications',
					_labelssource : 'Application.name',
					_optionssource : 'Application.id',
					multiple : true
				}, {
					name : 'server_type',
					type : 'select',
					_optionssource : [
						'-Select Server Type-',
						'Primary Application Server',
						'Secondary Application Server',
						'Primary Database Server',
						'Secondary Database Server',
						'Primary Report Server',
						'Secondary Report Server',
						'Primary Web Server',
						'Secondary Web Server',
						'Primary DR Server',
						'Secondary DR Server',
						'Test Application Server',
						'Test Report Server',
						'Test Database Server',
						'Test Web Server',
						'Other'
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'databases',
			type : 'array',
			_label : 'Server Databases',
			fields : [
				{
					name : 'databases',
					type : 'select',
					_label : 'Select Databases',
					_labelssource : 'Database.hostname,name',
					_optionssource : 'Database.id',
					multiple : true
				}, {
					name : 'server_type',
					type : 'select',
					_optionssource : [
						'-Select Server Type-',
						'Primary Application Server',
						'Secondary Application Server',
						'Primary Database Server',
						'Secondary Database Server',
						'Primary Report Server',
						'Secondary Report Server',
						'Primary Web Server',
						'Secondary Web Server',
						'Primary DR Server',
						'Secondary DR Server',
						'Test Application Server',
						'Test Report Server',
						'Test Database Server',
						'Test Web Server',
						'Other'
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'tags[]',
			multiple : true,
			type : 'tokens',
			_label : 'Tags',
			_labelssource : 'Tag.name',
			_optionssource : 'Tag.id',
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('servers',
		{ // grid definition
			model : 'Server',
			columnFriendly : 'name',
			filter : 'inactive_flag = 0',
			gridHeader : {
				icon : 'fa-building-o',
				headerTitle : 'Manage Servers',
				helpText : "<strong>Note:</strong> Manage Servers Here"
			},
			tableBtns : {
				custom : {
					toggleInactive : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Inactive',
						fn : 'toggleInactive',
						'data-order' : 100
					},
					toggleProduction : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Non-Production',
						fn : 'toggleNonProd',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				tagSelected : [
					{ label: 'Tag Selected Servers', class: 'btn btn-primary', icon : 'fa-tag' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							bootbox.prompt('What tag should be added to the selected servers?', function( val ) {
								jApp.activeGrid.fn.addTag({ 'tag' : val });
							});
							
						},
						label : 'Add Tag...'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							bootbox.prompt('What tag should be removed from the selected servers?', function( val ) {
								jApp.activeGrid.fn.removeTag({ 'tag' : val });
							});
							
						},
						label : 'Remove Tag...'
					},
				],

				markSelected : [
					{ label: 'Modify Selected Servers', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Update Software'})
						},
						label : 'Update Agent Software',
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Start Agent'})
						},
						label : 'Start Agent Service'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer( { 'inactive_flag' : 1} );
						},
						label : 'Flag As Inactive'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'inactive_flag' : 0})
						},
						label : 'Flag As Active'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'production_flag' : 1})
						},
						label : 'Flag As Production'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'production_flag' : 0})
						},
						label : 'Flag As Not Production'
					}
				]
			},
			columns : [ 				// columns to query
				"id",
				"serverName",
				"owner_name",
				"os",
				"ip",
				"people",
				//"applications",
				//"databases",
				'tags',
				'status',
				"agent_version",
				"agent_status",
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
				"Owner",
				"OS",
				"IP",
				"Contacts",
				//"Apps",
				//"Databases",
				"Tags",
				"Status",
				"Agent Version",
				"Agent Status",
			],
			templates : { 				// html template functions

				owner_name : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.owner, 'fa-users','Group');
				},

				applications : function(arr) {
					return _.get('name', arr, 'fa-cubes', 'Application');
				},

				databases : function(arr) {
					return _.get('name', arr, 'fa-database', 'Database');
				},

				os : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.operating_system, 'fa-windows','OperatingSystem');
				},

				ip : function( val ) {
					
					if ( val == null || ! val.length )
					{
						return '';
					}

					var ip = _.map( val.split('.'), function(part) { return ('   ' + part).slice(-3) }).join('.');
					
					return  `<div class="pull-right">${ip}</div>`;
				},

				agent_status : function() {
					var r = jApp.activeGrid.currentRow
						agent = r.agent;
					if ( agent == null ) return "";

					status = ( agent.status == 'Running' ) ? 1 : 0;

					return _.getFlag(status, 'Running', 'Stopped', 'success', 'danger' ) + ' <em>' + agent.updated_at_for_humans + '</em>';;
				},

				agent_version : function() {
					var r = jApp.activeGrid.currentRow
						agent = r.agent;
					if ( agent == null ) return "";

					return agent.version;
				},

			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markServer			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn
				
				/**
				 * Tag selected server
				 * @method function
				 * @return {[type]} [description]
				 */
				addTag			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction() + '/_addTag',
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn
				
				/**
				 * Remove Tag from selected server
				 * @method function
				 * @return {[type]} [description]
				 */
				removeTag			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction() + '/_removeTag',
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp;

					if (typeof temp.hideInactive === 'undefined' || !!temp.hideInactive) {
						filter.push('inactive_flag = 0');
					}

					if (typeof temp.hideNonProd !== 'undefined' && !!temp.hideNonProd) {
						filter.push('production_flag = 1');
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

				}, // end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleInactive : function( ) {
					jApp.activeGrid.temp.hideInactive = ( typeof jApp.activeGrid.temp.hideInactive === 'undefined')
						? false : !jApp.activeGrid.temp.hideInactive;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleNonProd : function( ) {
					jApp.activeGrid.temp.hideNonProd = ( typeof jApp.activeGrid.temp.hideNonProd === 'undefined')
						? true : !jApp.activeGrid.temp.hideNonProd;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-3',
					fields : fieldset_1__fields
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-4',
					fields : fieldset_2__fields
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-5',
					fields : fieldset_3__fields
				},
		]
	)
})(jApp);

/**
 * servers.html.js
 *
 * servers view definition
 */
;(function(jApp) {
	/**
	 * Add the view
	 */
	jApp.addView('updates',
		{ // grid definition
			model : 'WindowsUpdateServer',
			columnFriendly : 'name',
			filter : 'inactive_flag = 0 and :show__only__my__groups:',
			gridHeader : {
				icon : 'fa-building-o',
				headerTitle : 'Install Windows Updates',
				helpText : "<strong>Note:</strong> Only approved updates will be installed. <a href='approveUpdates'>Approve Updates</a>"
			},
			toggles : {
				new : false,
				edit : false,
				del : false
			},
			refreshInterval : 17000,
			tableBtns : {
				custom : {
					showOnlyMyGroups : {
						type : 'button',
						class : 'btn btn-success active btn-toggle btn-showOnlyMyGroups',
						icon : 'fa-toggle-on',
						label : 'Show Only My Groups\' Servers',
						fn : 'showOnlyMyGroups',
						'data-order' : 98
					},
					toggleUnupdatable : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Servers With No Updates',
						fn : 'toggleUnupdatable',
						'data-order' : 99
					},
					toggleProduction : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Production',
						fn : 'toggleProduction',
						'data-order' : 101
					},
					toggleNonProduction : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Non-Production',
						fn : 'toggleNonProduction',
						'data-order' : 102
					},

				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Set Selected Server Status...', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Update Software'})
						},
						label : 'Update Agent Software'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Start Agent'})
						},
						label : 'Start Agent Service'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Look For Updates'})
						},
						label : 'As Look For Updates'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								bootbox.confirm('Are you sure you want to begin installing updates on these servers?', function(response) {
				          if (!!response) {
				            jApp.activeGrid.fn.markServer( { 'status' : 'Ready For Updates'} );
				          }
				        });

						},
						label : 'As Ready For Updates'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Idle'})
						},
						label : 'As Not Ready For Updates'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							bootbox.confirm('Are you sure you want reboot these servers?', function(response) {
								if (!!response) {
									jApp.activeGrid.fn.markServer( { 'status' : 'Ready For Reboot'} );
								}
							});
						},
						label : 'As Ready For Reboot'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer( { 'status' : 'Abort Reboot'} );
						},
						label : 'As Cancel Reboot',
					},
				]
			},
			columns : [ 				// columns to query
				"id",
				"serverName",
				"owner_name",
				"os",
				"ip",
				"status",
				"approved_updates",
				"new_updates",
				"agent_version",
				"agent_status",
				"updated_at_for_humans"
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
				"Owner",
				"OS",
				"IP",
				"Status",
				"Approved Updates",
				"New Updates",
				"Agent Version",
				"Agent Status",
				"Updated"
			],
			templates : { 				// html template functions

				owner_name : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.owner, 'fa-users','Group');
				},

				os : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.operating_system, 'fa-windows','OperatingSystem');
				},

				ip : function( val ) {
					return _.map( val.split('.'), function(part) { return ('   ' + part).slice(-3) }).join('.');
				},

				agent_status : function() {
					var r = jApp.activeGrid.currentRow
						agent = r.agent;
					if ( agent == null ) return "";

					status = ( agent.status == 'Running' ) ? 1 : 0;

					return _.getFlag(status, 'Running', 'Stopped', 'success', 'danger' );
				},

				agent_version : function() {
					var r = jApp.activeGrid.currentRow
						agent = r.agent;
					if ( agent == null ) return "";

					return agent.version;
				},

			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markServer			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp, scope = 'all', data = jApp.activeGrid.dataGrid.requestOptions.data;


					filter.push('inactive_flag = 0');


					switch( true ) {
						case ( ! temp.hideProduction && ! temp.hideNonProduction ) :
							scope = 'all';
						break;

						case ( ! temp.hideProduction && !! temp.hideNonProduction ) :
							scope = 'production';
						break;

						case ( !! temp.hideProduction && ! temp.hideNonProduction ) :
							scope = 'nonproduction';
						break;

						case ( !! temp.hideProduction && !! temp.hideNonProduction ) :
							scope = 'none';
						break;
					}

					if ( typeof temp.showOnlyMyGroups === 'undefined' || !! temp.showOnlyMyGroups )
					{
						filter.push(':show__only__my__groups:');
					}

					data.filter = filter.join(' AND ');
					data.scope = scope;
					data.showUnupdatable = ( !! temp.showUnupdatable ) ? 1 : 0;

				}, // end fn

				toggleProduction : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideProduction = ( !!! temp.hideProduction );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleNonProduction : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideNonProduction = ( !!! temp.hideNonProduction );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleUnupdatable : function( ) {
					var temp = jApp.activeGrid.temp;
					temp.showUnupdatable = ( !!! temp.showUnupdatable );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				/**
				 * Show only my groups' tasks
				 * @method function
				 * @return {[type]} [description]
				 */
				showOnlyMyGroups : function( ) {
					var temp = jApp.activeGrid.temp;

					if ( typeof temp.showOnlyMyGroups === 'undefined' )
					{
						temp.showOnlyMyGroups = true;
					}

					temp.showOnlyMyGroups = ( !!! temp.showOnlyMyGroups );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		},
		[]
	)
})(jApp);

/**
 * servers.html.js
 *
 * servers view definition
 */
;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('databaseInstances',
		{ // grid definition
			model : 'DatabaseInstance',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-database',
				headerTitle : 'Manage Sql Servers',
				helpText : "<strong>Note:</strong> These values are auto-populated by the agent. "
			},
			toggles : {
				new : false,
				edit : false,
				del : false,
			},
			rowBtns : {
				updateSelected : {
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					class: 'btn btn-primary',
					type : 'button',
					icon : 'fa-gears',
					label : 'Update Sql Server Info...',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markServer({ 'status' : 'Refresh SQL Server'});
					},
					'data-order' : 100
				},
			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markServer			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"server_name",
				"owner_name",
				"sql_product",
				"sql_edition",
				"sql_version",
				"memory",
				"processors",
				"server_status",
				"updated_at_for_humans"
			],
			headers : [ 				// headers for table
				"ID",
				"Instance Name",
				"Server",
				"Owner",
				"Sql Product",
				"Edition",
				"Version",
				"Sql Ram (MB) Min-Max-Rec.Max (OS Avail/Total)",
				"Logical CPUs",
				"Server Status",
				"Updated"
			],
			templates : { 				// html template functions

				name : function(val) {
					var r = jApp.activeGrid.currentRow;

					return _.nameButton( r.server.name + '\\' + val,  jApp.opts().gridHeader.icon ) + _.getFlag(r.server.production_flag, 'Prod', 'Test', 'primary','success');
				},

				sql_product : function(val) {
					return val.replace('Microsoft ','');
				},

				sql_edition : function(val) {
					return val.replace(' Edition','');
				},

				owner_name : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.owner, 'fa-users','Group');
				},

				server_name : function( val ) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.server, 'fa-building-o', 'Server');
				},

				server_status : function() {
					var r = jApp.activeGrid.currentRow;
					return r.server.status;
				},

				memory : function() {
					var r = jApp.activeGrid.currentRow,
						os_min = 1024,
						os_max = 2047,
						rec = 0,
						bg = '#80E02C',
						os = r.total_memory - r.max_memory;

					switch (true) {
						case ( r.total_memory <= 4096  ) : os_min = 1024; os_max = 2048; break;
						case ( r.total_memory <= 16384 ) : os_min = 2048; os_max = 4096; break;
						case ( r.total_memory > 16384 ) : os_min = 4096; os_max = r.total_memory/3; break;
					}

					// get the recommended amount for sql
					rec = r.total_memory - os_min;

					// determine if there is not enough ram for the OS
					if ( ( r.total_memory - r.max_memory ) < os_min ) bg = '#f0ad4e';
					
					// determine if memory has not been configured
					if ( r.total_memory <= r.max_memory ) bg = '#d9534f';

					// determine if ram has been added and memory usage has not been reconfigured
					if ( ( r.total_memory - r.max_memory ) > os_max ) bg = '#e2f04e';
					
					return '<div style="padding: 0 6px; width:100%;height:100%;background:' + bg + '">' + 
						r.min_memory + '-' + r.max_memory + '-' + rec + ' (' + os + '/' + r.total_memory + ')</div>';
				}

			},
		},
		[ ]
	)
})(jApp);

//# sourceMappingURL=all.js.map
