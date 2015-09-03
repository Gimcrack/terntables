$.expr[":"].contains = $.expr.createPseudo(function(arg) {
	return function( elem ) {
		return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	};
});

var bindAjaxLinks = function(){
	var pieces = window.location.href.split('/'),
		view = pieces.pop();

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