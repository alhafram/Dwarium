/* ============ */

function leadingZero(num, size) {
	var s = num.toString();
	if (!size) size = 2;
	while (s.length < size) s = '0' + s;
	return s;
}

function forumPostRate(e, obj) {
	$.Event(e).preventDefault();
	$.ajax({
		url: $(obj).attr('href'),
		type: 'POST',
		cache: false,
		success: function(r) {
			if (r.status == 0) {
				$(obj).closest('.post-rating, .topic-rating').replaceWith(r.html)
			} else {
				alert(r.error);
			}
			if (r.message) {
				commonMessage(r.message);
			}
		}
	});
}

function forumPostReply(event, object) {
	$.Event(event).preventDefault();

	$.ajax({
		'url': $(object).attr('href'),
		'type': 'POST',
		'cache': false,
		'data': {'ajax': 1},
		'success': function(response) {
			$('#comment-form-body').val($('#comment-form-body').val() + response);
			$.scrollTo('#comment-form-body', 300);
		}
	});
}

function reportCreate(event, object, message) {
	$.Event(event).preventDefault();

	if ($(object).hasClass('disabled')) {
		return;
	}
	if (confirm(message)) {
		$.ajax({
			'url': $(object).attr('href'),
			'type': 'POST',
			'cache': false,
			'data': {'ajax': 1},
			'beforeSend': function() {
				commonAjaxStart()
			},
			'success': function(response) {
				commonMessage(response.message);
				$(object).addClass('disabled');
			},
			'complete': function() {
				commonAjaxStop();
			}
		});
	}
}

function pollAction(event, object) {
	$.Event(event).preventDefault();

	var data = $(object).serialize();

	if (data) {
		$.ajax({
			'url': $(object).attr('href'),
			'type': 'POST',
			'cache': false,
			'data': 'ajax=1&' + data,
			'beforeSend': function() {
				commonAjaxStart()
			},
			'success': function(response) {
				commonMessage(response.message);
				if (response.status) {
					$('#poll-' + $(object).data('id')).replaceWith(response.html);
					jsMacrosApply('#poll-' + $(object).data('id'));
					$('#poll-' + $(object).data('id')).find('a[rel*="colorbox"]').colorbox({
						rel: 'colorbox',
						current: 'Изображение {current} из {total}',
						fixed: true,
						maxWidth: ($(window).width() - 20),
						maxHeight: ($(window).height() - 20)
					});
				}
				$(object).addClass('disabled');
			},
			'complete': function() {
				commonAjaxStop();
			}
		});
	}

	return false;
}

var __commonAjaxRequest = 0;

function commonAjaxStart() {
	__commonAjaxRequest++;
	var $ajax = $('#ajax');
	if ($ajax.length < 1) {
		$ajax = $('<div></div>', {'id': 'ajax'}).css({'background': '#F00', 'border-radius': '5px', 'width': '32px', 'height': '32px', 'position': 'fixed', 'left': '10px', 'top': '10px'});
		$ajax.appendTo($('body'));
	}
	$ajax.show();
}

function commonAjaxStop() {
	__commonAjaxRequest--;
	if (__commonAjaxRequest < 1) {
		$('#ajax').fadeOut();
	}
}

function commonMessage(message, timeout) {
	var $messageBlock = $('#ajaxMessage');
	timeout = timeout || 5000;
	if ($messageBlock.length < 1) {
		$messageBlock = $('<div></div>', {'id': 'ajaxMessage', 'class': 'b-ajax-message'});
		$messageBlock.appendTo($('body'));
	}
	var $message = $('<div></div>', {'class': 'b-ajax-message__item', 'text': message});
	$message.appendTo($messageBlock);
	setTimeout(function() {$message.fadeOut().remove()}, timeout)
}

/**
* Opens and centers popup block
*
* @author r.berezkin
*
* @param string popup - popup block in jquery format or DOM-node
* @param string shader (optional) - shader block in jquery format or DOM-node
* @param number interval (optional) - animation interval
*
* @return bool
*/
function openPopup(popup, shader, interval) {
	var $popup = $(popup),
	$shader = !shader ? $('.b-popup-shader') : $(shader),
	interval = (interval === undefined) ? 500 : parseInt(interval),
	$close = $popup.find('span[data-button="close"]');

	if (!$popup[0]) {
		if (console.error) {
			console.error('No popup found');
			return false;
		}
	}

	$popup.css({
		'display': 'block',
		'margin-left': '-' + ($popup.width() / 2) + 'px',
		'margin-top': '-' + ($popup.height() / 2) + 'px'
	});

	$shader.fadeIn(interval);

	$close.on('click', function() {
		closePopup($popup, $shader, interval);
	});

	$shader.on('click', function() {
		closePopup($popup, $shader, interval);
	});

	$(document).on('keyup', function(e) {
		if (e.keyCode == 27) {
			closePopup($popup, $shader, interval);
		}
	});

	return false;
}

/**
* Closes popup block
*
* @author r.berezkin
*
* @param string popup - popup block in jquery format or DOM-node
* @param string shader (optional) - shader block in jquery format or DOM-node
* @param number interval (optional) - animation interval
*
* @return bool
*/
function closePopup(popup, shader, interval) {
	var $popup = $(popup),
	$shader = !shader ? $('.b-popup-shader') : $(shader),
	interval = (interval === undefined) ? 500 : parseInt(interval);

	if (!$popup[0]) {
		if (console.error) {
			console.error('No popup found');
			return false;
		}
	}

	$popup.hide();
	$shader.fadeOut(interval);

	$(document).unbind('keyup');

	return false;
}

/**
* Change popup block
*
* @author a.schneider
*
* @param string popup1 - first popup block in jquery format or DOM-node
* @param string popup2 - second popup block in jquery format or DOM-node
* @param string shader (optional) - shader block in jquery format or DOM-node
*
* @return bool
*/
function changePopup(popup1, popup2, shader) {
	closePopup(popup1, shader, 0);

	return openPopup(popup2, shader, 0);
}

/**
* Check text length in form field
*
* @author r.berezkin
*
* @param {String|Object} field Field selector in jQuery format
* @param {Number} min Minimum text length
* @param {String} errorMsg Error message to show
*
* @returns {Boolean}
*/
function checkTextLength(field, min, errorMsg) {
	if (!$.fn) {
		if (console.error) {
			console.error('No jQuery detected');
		}

		return false;
	}

	var $field = $(field),
		value = $field.val();

	// check if we are dealing with sceditor plugin
	if ($field.hasClass('SCEditor') && $.fn.sceditor) {
		value = $($field).sceditor('instance').val();
	}

	if (value.length < min) {
		if (errorMsg) {
			commonError(field + '__error', errorMsg);
		}

		return false;
	}

	return true;
}

/**
* Wrap element in frame
*
* @author r.berezkin
*
* @param {String | Object} elem jQuery selector or DOM-node
*
* @returns {Boolean}
*/
function wrapElement(elem) {
	if (!$.fn) {
		if (console.error) {
			console.error('No jQuery detected');
		}

		return false;
	}

	var $elem = $(elem),
		wrapper = $elem[0].className.split(' '),
		wrappers = {
			block1: function(elem, isInline) {
				var $wrap = $('<div class="b-common-inner-block"><div class="b-common-inner-block__cont b-common-typography nomargin" /></div>');

				$wrap.append('<span class="b-common-inner-block__tl" />');
				$wrap.append('<span class="b-common-inner-block__tr" />');
				$wrap.append('<span class="b-common-inner-block__bl" />');
				$wrap.append('<span class="b-common-inner-block__br" />');
				$wrap.append('<span class="b-common-inner-block__l" />');
				$wrap.append('<span class="b-common-inner-block__r" />');
				$wrap.append('<span class="b-common-inner-block__t" />');
				$wrap.append('<span class="b-common-inner-block__b" />');

				if (isInline) {
					$wrap.css({
						'display': 'inline-block',
						'padding': '2px 2px 4px'
					});
				}

				if (elem.data('width')) {
					$wrap.css({
						'width': elem.data('width')
					});
				}

				elem.wrap($wrap);

				return true;
			},
			block2: function(elem, isInline) {
				var $wrap = $('<div class="b-banner-frame b-banner-frame_2"><div class="b-banner-frame__cont b-common-typography nomargin" /></div>');

				$wrap.append('<span class="b-banner-frame__tl b-banner-frame__tl-2" />');
				$wrap.append('<span class="b-banner-frame__tr b-banner-frame__tr-2" />');
				$wrap.append('<span class="b-banner-frame__bl b-banner-frame__bl-2" />');
				$wrap.append('<span class="b-banner-frame__br b-banner-frame__br-2" />');
				$wrap.append('<span class="b-banner-frame__l b-banner-frame__l-2" />');
				$wrap.append('<span class="b-banner-frame__r b-banner-frame__r-2" />');
				$wrap.append('<span class="b-banner-frame__t b-banner-frame__t-2" />');
				$wrap.append('<span class="b-banner-frame__b b-banner-frame__b-2" />');

				if (isInline) {
					$wrap.css({
						'display': 'inline-block'
					});
				} else {
					$wrap.css({
						'padding': '12px'
					});
				}

				if (elem.data('width')) {
					$wrap.css({
						'width': elem.data('width')
					});
				}

				elem.wrap($wrap);

				return true;
			},
			block3: function(elem, isInline) {
				var $wrap = $('<div class="b-common-block"><div class="b-common-block__cont b-common-typography nomargin" /></div>');

				$wrap.append('<span class="b-common-block__bl" />');
				$wrap.append('<span class="b-common-block__br" />');
				$wrap.append('<span class="b-common-block__l" />');
				$wrap.append('<span class="b-common-block__r" />');
				$wrap.append('<span class="b-common-block__t b-common-block__t_2" />');
				$wrap.append('<span class="b-common-block__b" />');
				$wrap.append('<span class="b-common-block__header-decor-l" />');
				$wrap.append('<span class="b-common-block__header-decor-r" />');

				$wrap.append('<span class="b-common-block__header"><span class="b-common-block__header-inner"><span data-font="PTSans">' + (elem.data('header') ? elem.data('header') : '') + '</span></span></span>');

				if (isInline) {
					$wrap.css({
						'display': 'inline-block'
					}).find('.b-common-block__bgr').css({
						'padding': '0'
					});
				}

				elem.css({
					padding: '10px'
				});

				if (elem.data('width')) {
					$wrap.css({
						'width': elem.data('width')
					});
				}

				elem.wrap($wrap);

				return true;
			},
			block4: function(elem, isInline) {
				var $wrap = $('<div class="b-news-footer"><div class="b-news-footer__cont b-common-typography nomargin" /></div>');

				$wrap.append('<span class="b-news-footer__tl" />');
				$wrap.append('<span class="b-news-footer__tr" />');
				$wrap.append('<span class="b-news-footer__bl" />');
				$wrap.append('<span class="b-news-footer__br" />');
				$wrap.append('<span class="b-news-footer__t" />');
				$wrap.append('<span class="b-news-footer__b" />');
				$wrap.append('<span class="b-news-footer__ct" />');
				$wrap.append('<span class="b-news-footer__cb" />');

				if (isInline) {
					$wrap.css({
						'display': 'inline-block',
						'padding': '6px 2px 6px 1px'
					}).find('.b-news-footer__cont').css({
						'padding': '0 3px'
					});
				}

				if (elem.data('width')) {
					$wrap.css({
						'width': elem.data('width')
					});
				}

				elem.wrap($wrap);

				return true;
			},
			block5: function(elem, isInline) {
				var $wrap = $('<div class="b-common-img"><div class="b-common-img__cont b-common-typography nomargin" /></div>');

				$wrap.append('<span class="b-common-img__tl" />');
				$wrap.append('<span class="b-common-img__tr" />');
				$wrap.append('<span class="b-common-img__bl" />');
				$wrap.append('<span class="b-common-img__br" />');
				$wrap.append('<span class="b-common-img__l" />');
				$wrap.append('<span class="b-common-img__r" />');
				$wrap.append('<span class="b-common-img__t" />');
				$wrap.append('<span class="b-common-img__b" />');

				if (!isInline) {
					$wrap.css({
						'display': 'block'
					});
				}

				if (elem.data('width')) {
					$wrap.css({
						'width': elem.data('width')
					});
				}

				elem.wrap($wrap);

				return true;
			}
		};

	$elem.css({
		'display': 'block'
	});

	if (wrapper.length === 1) {
		return wrappers[wrapper[0]]($elem, false);
	}

	return wrappers[wrapper[0]]($elem, true);
}

/**
* Show error message for specified field
*
* @author r.berezkin
*
* @param {String|Object} field Field selector in jQuery format
* @param {String} msg Text message to show
*
* @returns {Boolean}
*/
function commonError(field, msg) {
	if (!$.fn) {
		if (console.error) {
			console.error('No jQuery detected');
		}

		return false;
	}

	$(field).show(0).html(msg);

	return true;
}

/**
* Fixes -webkit-autofill style issue in Goole Chrome browser
* (https://code.google.com/p/chromium/issues/detail?id=1334)
*
* @return void
*/
function fixYellow() {
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
		$.each($("input[type=text], input[type=password]"), function() {
			$(this).clone(true).appendTo($(this).parent());
			$(this).remove();
		});
	}
}

/**
* Equal columns heights
*/
function equalHeights() {
	var colLeft = $('.b-column-left').find('.b-main-frame__cont'),
		colRight = $('.b-column-right').find('.b-main-frame__cont');

	if (colLeft.innerHeight() > colRight.innerHeight()) {
		colRight.css('minHeight', colLeft.innerHeight() + 'px');
	}
}

function likeCreate(e, id) {
	$.Event(e).preventDefault();
	$.ajax({
		url: DIR_PUBLIC+'/like.php?action=create',
		data: {id: id, sid: window.sid},
		type: 'POST',
		cache: false,
		success: function(response) {
			if (response.status == 0) {
				$('.b-macro-like.js-like-'+id).html(response.html);
			} else {
				alert(response.error);
			}
			if (response.message) {
				commonMessage(response.message);
			}
		}
	});
}

function confirmCreate(e, id, choice) {
	$.Event(e).preventDefault();
	$.ajax({
		url: DIR_PUBLIC+'/confirm.php?action=create',
		data: {id: id, choice: choice, sid: window.sid},
		type: 'POST',
		cache: false,
		success: function(response) {
			if (response.status == 0) {
				$('.b-macro-confirm.js-confirm-'+id).html(response.html);
			} else {
				alert(response.error);
			}
			if (response.message) {
				commonMessage(response.message);
			}
		}
	});
}

function addFlash(id, url) {
	if (swfobject) {
		swfobject.embedSWF(url, id, '670', '250', '9.0.0', 'expressInstall.swf', {}, {'wmode': 'opaque'}, {});
	}
}

function removeFlash(parent, id) {
	if (swfobject) {
		swfobject.removeSWF(id);
		
		parent.append('<div id="' + id + '" />');
	}
}

// DOM-ready
$(function() {
	var lH_t = $(window).height() / 2 + 50;
	var lH_b = $(window).height() / 2 - 50;
	var $goTop = $('#go-top').css('lineHeight', lH_t+'px'),
		$goBottom = $('#go-bottom').css('lineHeight', lH_b+'px'),
		$reportMisspell = $('#report-misspell');
	var $document = $(document);

	var dw = $document.width();
	var w = (dw <= 1024 ? 50 : (dw <= 1680 ? 100 : 150));
	$goTop.width(w);
	$goBottom.width(w);

	$goTop.on('click', function() {
		$document.scrollTop(0);
	});

	$goBottom.on('click', function() {
		$document.scrollTop($(document).height());
	});

	$document.on('scroll', function() {
		if ($document.scrollTop() > 0) {
			if (window.content_id) {
				$reportMisspell.fadeIn();
			}
		} else {
			if (window.content_id) {
				$reportMisspell.fadeOut();
			}
		}
	});
	
	$(window).on('resize', function() {
		var lH_t = $(window).height() / 2 + 50;
		var lH_b = $(window).height() / 2 - 50;
		var $goTop = $('#go-top').css('lineHeight', lH_t+'px'),
			$goBottom = $('#go-bottom').css('lineHeight', lH_b+'px');
	});

	/* Form elements placeholder */
	if ($.fn.rPlaceholder) {
		$('input, textarea').rPlaceholder({
			pClassPrefix: 'b-input-paceholder'
		});
	}

	/* Wrap elements */
	$('.block1, .block2, .block3, .block4, .block5').each(function() {
		wrapElement(this);
	});

	/* Scrollbar */
	if ($.fn.rScrollbar) {
		$('*[data-scroll]').each(function() {
			var $this = $(this),
				$thisHTrack = $this.nextAll('div[data-scroll-track="horizontal"]').first(),
				$thisHBar = $thisHTrack.find('div[data-scroll-bar="horizontal"]');

			$this.rScrollbar({
				trackH: {
					track: $thisHTrack,
					bar: $thisHBar
				}
			});
		});
	}

	/* Media carousel */
	if ($.fn.carouFredSel) {
		$('div[data-media-scroller]').children(':first').children().on('click', function() {
			var $allChilds = $('div[data-media-scroller]').children(':first').children(),
				index = $allChilds.index(this);

			$('div[data-media-carousel]').trigger('slideTo', index);
		});

		if ($('div[data-media-carousel]').length > 0) $('div[data-media-carousel]').carouFredSel({
			items: 1,
			circular: false,
			infinite: false,

			auto: {
				play: false
			},

			prev: {
				button: '.b-big-image-gallery__arr-l',
				onBefore: function(data) {
					var $scroller = $('div[data-media-scroller]'),
						$container = $scroller.children(':first'),
						itemWidth = $container.children(':first').outerWidth(true),
						currentItem = $(this).triggerHandler('currentPosition');

					$container.children().removeClass('active').eq(currentItem).addClass('active');
					$scroller.scrollLeft(itemWidth * currentItem).rScrollbar('update');
				}
			},

			next: {
				button: '.b-big-image-gallery__arr-r',
				onBefore: function(data) {
					var $scroller = $('div[data-media-scroller]'),
						$container = $scroller.children(':first'),
						itemWidth = $container.children(':first').outerWidth(true),
						currentItem = $(this).triggerHandler('currentPosition');

					$container.children().removeClass('active').eq(currentItem).addClass('active');
					$scroller.scrollLeft(itemWidth * currentItem).rScrollbar('update');
				}
			}
		});
	}

	/* Toggle */
	$('*[data-toggle]').hide(0);

	$('*[data-toggle-button]').on('click', function() {
		var $this = $(this),
			containerNubmer = $this.data('toggle-button'),
			$container = $('*[data-toggle="' + containerNubmer + '"]');

		if ($container.is(':visible')) {
			$container.hide(0);
			$this.removeClass('open');
			$this.parent().css('margin-bottom', '0');
		} else {
			$container.show(0);
			$this.addClass('open');
			$this.parent().css('margin-bottom', '10px');
		}

		return false;
	});

	if ($.fn.colorbox) {
		// init colorbox plugin
		$('a[rel*="colorbox"]').colorbox({
			rel: 'colorbox',
			current: 'Изображение {current} из {total}',
			fixed: true,
			maxWidth: ($(window).width() - 20),
			maxHeight: ($(window).height() - 20)
		});
	}

	var like_ids = [];
	var $likes = $('.b-macro-like');
	$likes.each(function(i, item) {
		if ($(item).data('id')) {
			like_ids.push($(item).data('id'));
		}
	});
	
	if (like_ids.length > 0) {
		var array_unique = function(ids) {
			return ids.reduce(function(p, c) {
				if (p.indexOf(c) < 0) p.push(c);
				return p;
			}, []);
		}
		like_ids = array_unique(like_ids);
		$.ajax({
			url: DIR_PUBLIC+'/like.php?action=view',
			type: 'GET',
			data: 'id='+like_ids.join(','),
			cache: false,
			success: function(response) {
				$likes.each(function(i, item) {
					if (response.likes[item.getAttribute('data-id')]) {
						$(item).html(response.likes[item.getAttribute('data-id')]);
					}
				});
			}
		});
	}

	var confirm_ids = [];
	var $confirms = $('.b-macro-confirm');
	$confirms.each(function(i, item) {
		if ($(item).data('id')) {
			confirm_ids.push($(item).data('id'));
		}
	});
	if (confirm_ids.length > 0) {
		var array_unique = function(ids) {
			return ids.reduce(function(p, c) {
				if (p.indexOf(c) < 0) p.push(c);
				return p;
			}, []);
		}
		confirm_ids = array_unique(confirm_ids);
		$.ajax({
			url: DIR_PUBLIC+'/confirm.php?action=view',
			type: 'GET',
			data: 'id='+confirm_ids.join(','),
			cache: false,
			success: function(response) {
				$confirms.each(function(i, item) {
					if (response.confirms[item.getAttribute('data-id')]) {
						$(item).html(response.confirms[item.getAttribute('data-id')]);
					}
				});
			}
		});
	}
	
	/* Commercial
	==========================================================================*/
	var commercialTabs = $('[data-tab]'),
		activeTabs = $('.active[data-tab-switch]').length;
	
	$('[data-role="toggleButton"]').on('click', function(e) {
		$(this).closest('[data-role="toggle"]').toggleClass('active');
		
		e.preventDefault();
	}).on('selectstart', function(e) {
		e.preventDefault();
	});
	
	$('[data-tab-switch]').on('click', function(e) {
		var self = $(this);
		
		self.addClass('active').siblings().removeClass('active');
	});
	
	$('.b-popular-sevices a').on('click', function(e) {
		var $this = $(this),
			link = $this.attr('href').split('#')[1],
			$item = $('a[name="' + link + '"]').closest('div[data-tab]'),
			$tab = $('[data-tab-switch="' + $item.data('tab') + '"]');
			
		if (!$tab.hasClass('active')) {
			$tab.addClass('active');
			commercialTabs.eq($item.data('tab') - 1).addClass('active');
			
			activeTabs++;
		}
	});
	
	// Gallery
	// =========================================================================
	$('.b-gallery').each(function() {
		var $gallery = $(this),
		
			$items = $gallery.find('div[data-item]'),
		
			$itemPrev = $gallery.find('.b-gallery__item-prev div'),
			$itemNext = $gallery.find('.b-gallery__item-next div'),
			$itemCurrent = $gallery.find('.b-gallery__item-current-inner'),
			
			$btnPrev = $gallery.find('.b-gallery__btn.prev'),
			$btnNext = $gallery.find('.b-gallery__btn.next'),
			
			current = 1,
			
			params = {
				
			};
		
		$gallery.data('params', params);
		
		$itemPrev.html($items.eq(current - 1).html());
		$itemNext.html($items.eq(current + 1).html());
		$itemCurrent.html($items.eq(current).html());
		
		$btnNext.on('click', function(e) {
			var prev = 0,
				next = 0;
				
			current++;
	
			if (current > $items.length - 1) {
				current = 0;
			}
	
			prev = current - 1;
	
			if (prev < 0) {
				prev = $items.length - 1;
			}
	
			next = current + 1;
	
			if (next > $items.length - 1) {
				next = 0;
			}
			
			$itemPrev.html($items.eq(prev).html());
			$itemNext.html($items.eq(next).html());
			$itemCurrent.html($items.eq(current).html());
			
			e.preventDefault();
		});
		
		$btnPrev.on('click', function(e) {
			var prev = 0,
				next = 0;
	
			current--;
	
			if (current < 0) {
				current = $items.length - 1;
			}
	
			prev = current - 1;
	
			if (prev < 0) {
				prev = $items.length - 1;
			}
	
			next = current + 1;
	
			if (next > $items.length - 1) {
				next = 0;
			}
			
			$itemPrev.html($items.eq(prev).html());
			$itemNext.html($items.eq(next).html());
			$itemCurrent.html($items.eq(current).html());
			
			e.preventDefault();
		});
	});
	// =========================================================================
	
	if ($('#servicesCarousel').length > 0) $('#servicesCarousel').carouFredSel({
		items: 1,
		
		pagination: {
			container: '.b-top-carousel__pages',
			
			anchorBuilder: function(nr, item) {
				return '<a href="#' + nr + '"></a>';
			}
		},
		
		prev: {
			button: '.b-top-carousel__prev'
		},
		
		next: {
			button: '.b-top-carousel__next'
		},
		
		scroll: {
			items: 1,
			duration: 500,
			timeoutDuration: $('#servicesCarousel').find('.b-top-carousel__item').eq(0).data('pause'),
			pauseOnHover: true,
			
			onBefore: function(data) {
				var current = data.items.visible.eq(0),
					
					id = current.attr('id').split('_')[1],
					url = current.data('banner');
				
				addFlash('b_' + id, url);
			},
			
			onAfter: function(data) {
				var prev = data.items.old.eq(0),
					current = data.items.visible.eq(0),
					id = prev.attr('id').split('_')[1];
				
				removeFlash(prev, 'b_' + id);
				
				if (current.data('pause') && current.data('pause') > 0) {
					$(this).triggerHandler('configuration').auto.timeoutDuration = current.data('pause');
				}
			}
		}
	});
	// =========================================================================
	
	// Form validation & file upload
	// =========================================================================
	if ($.validate) $.validate();

	if ($.fn.fileupload) {
		$('form').fileupload({
			url: '//operator.mail.ru/support/upload.php',
			dataType: 'json',
			autoUpload: true,

			add: function (e, data) {
				$(this).append('<div class="b-common-form-shade" />');
				data.submit();
			},

			done: function (e, data) {
				var $form = $(this),
					$files, $filenames;

				if (!$form.find('input[name=form\\[files\\]]').length) {
					$form.append($('<input />', {"name": "form[files]", "value": "", "type": "hidden"}));
				}

				$files = $form.find('input[name=form\\[files\\]]');
				var value = $files.val();

				if (value.length) {
					value = $.parseJSON(value);
				} else {
					value = {"files": []};
				}

				$.each(data.response().result.files, function (i) {
					if (!data.response().result.files[i].error) {
						value.files.push(data.response().result.files[i])
					}
				});

				if (value && value.files && value.files.length) {
					$filenames = $form.find('.b-common-file .b-common-file__files');
					$filenames.empty();
					
					for (var i = 0; i < value.files.length; i++) {
						$filenames.append('<span class="b-common-file__filename" data-name="' + value.files[i].md5name + '">' + value.files[i].name + ' <i class="b-common-file__delete"></i></span>');
					}
				}

				$files.val(JSON.stringify(value));
			},

			fail: function (e, data) {
				$(this).find('.b-common-form-shade').remove();
				//$(this).find('.b-common-file .b-common-field span').html('Ошибка загрузки');
			},

			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total);

				if (progress === 1) {
					$(this).find('.b-common-form-shade').remove();
				}
			}
		});
		
		$(document).on('click', '.b-common-file__delete', function() {
			var $this = $(this),
				$parent = $this.closest('.b-common-file__files'),
				$files = $this.closest('form').find('input[name="form\\[files\\]"]'),
				
				filesJSON = $files.val(),
				md5name = $this.parent().data('name'),
				
				obj, i;
			
			filesJSON = $.parseJSON(filesJSON);
			
			for (i = 0; i < filesJSON['files'].length; i++) {
				obj = filesJSON['files'][i];
				
				if (obj.md5name === md5name) {
					filesJSON['files'].splice(i, 1);
					$files.val(JSON.stringify(filesJSON));
					
					$this.parent().remove();
					
					break;
				}
			}
		});
	}
	
	/*========================================================================*/

	$('.post-rate-users').on('click', function() {
		var $this = $(this);

		if ($this.data('init')) {
			return;
		}

		$.get('post.php?action=rate_list&id=' + $this.data('post-id'))
		.done(function(r) {
			$this.replaceWith($(r).data('init', 1))
		});
	});

	$('.forum-actions-button').on('click', function(e) {
		e.preventDefault();

		var $this = $(this);
		var p = $this.position();
		var $m = $this.next();

		$m.show().css({left: p.left - $m.width() + $this.width(), top: p.top + $this.height()});

		$(document).bind('mousedown', function(e) {
			if ($(e.target).parents('.forum-actions').length == 0) {
				$m.hide();
				$(document).unbind('mousedown');
			}
		});
	});

	$('.forum-post-mood').find('a.forum-post-mood__link').on('click', function(e) {
		e.preventDefault();

		var $this = $(this);

		if ($this.hasClass('done')) {
			return;
		}

		$.get($this.attr('href'), {ajax: 1})
			.done(function(r) {
				if (r && r.status == 0) {
					$this.closest('.forum-post-mood').replaceWith(r.html);
				} else {
					commonMessage('error');
				}
			});
	});

	if (window.content_id) {
		$(document).on('keyup', function (e) {
			if (e.ctrlKey && e.keyCode == 13) {
				var text = '';
				if (document.selection && document.selection.createRange)
					text = document.selection.createRange().text;
				else if (window.getSelection) {
					text = window.getSelection() + '';
				}

				text = $.trim(text);
				if (text.length > 0 && text.length < 10) {
					alert('Слишком короткий фрагмент. (10 знаков мин.)')
				} else if (text.length > 300) {
					alert('Слишком длинный фрагмент. (300 знаков макс.)');
				} else if (text.length > 0) {
					orphusShow({id: 'orphus', title: 'Сообщение об опечатке на сайте', body: text});
				}
			}
		});
		$(document).on('submit', '#orphus form', function(e) {
			e.preventDefault();
			$.post($(this).attr('action'), $(this).serialize())
				.done(function(r) {
					orphusHide();
					commonMessage(r.message);
				});
		});
	}
});

function orphusHide(e) {
	if (!e || e.type == 'click' || e.keyCode == 27) {
		$('#orphus').remove();
		$('#overlay').unbind('click', orphusHide).hide();
		$(document).unbind('keydown', orphusHide);
		$(document).unbind('selectstart', orphusSelectStart);
	}
}

function orphusShow(data) {
	clearSelection();

	var id = data.id || 'b-message';
	var $m = $('<div></div>', {"class": "b-message", "id": id});

	$m.append($('<div />', {"class": 'b-message__close', "text": 'X'}));
	$m.append($('<div />', {"class": 'b-message__title', "text": data.title ? data.title : ' '}));
	$m.append($('<div />', {"class": 'b-message__body', "html": data.body.replace(/\n/, '<br>')}));
	$m.append($('<div />', {"class": 'b-message__footer', "html": '<form action="?action=report" method="post"><input type="hidden" name="id" value="'+content_id+'"><input type="hidden" name="sid" value="'+sid+'"><input type="hidden" name="form[body]" value="'+data.body+'"><input type="submit" value="отправить"></form>'}));

	$('body').append($m);
	$m.css({marginTop: -$m.height() / 2 + 'px'});

	$('#'+id).find('.b-message__close').on('click', orphusHide);

	$('#overlay').bind('click', orphusHide).fadeIn();
	$(document).bind('keydown', orphusHide);
	$(document).bind('selectstart', '#orphus', orphusSelectStart);
}

function orphusSelectStart(e) {
	e.preventDefault();
}

function clearSelection() {
	if (document.selection) {
		document.selection.empty();
	} else if (window.getSelection) {
		window.getSelection().removeAllRanges();
	}
}

function leading_zero(num, size) {
	var s = num.toString();
	if (!size) size = 2;
	while (s.length < size) s = '0' + s;
	return s;
}

function time_now(event, holder, field, inf, timestamp) {
	event.preventDefault();
	if (timestamp) {
		var d = new Date(timestamp);
	} else {
		var d = new Date();
	}
	var $fields = $('#'+holder).children('input:text');
	$fields.filter('[name="form['+field+'][y]"]').val(inf ? 0 : leading_zero(d.getFullYear()));
	$fields.filter('[name="form['+field+'][m]"]').val(inf ? 0 : leading_zero(d.getMonth()+1));
	$fields.filter('[name="form['+field+'][d]"]').val(inf ? 0 : leading_zero(d.getDate()));
	$fields.filter('[name="form['+field+'][h]"]').val(inf ? 0 : leading_zero(d.getHours()));
	$fields.filter('[name="form['+field+'][i]"]').val(inf ? 0 : leading_zero(d.getMinutes()));
}

function showConfirm(object, event, id) {
	$.Event(event).preventDefault();
	var $$ = $(object);
	if ($$.hasClass('disabled')) {
		return;
	}
	$('.b-system-confirm:visible').hide();
	if ($('#confirm-'+id).length) {
		$('#confirm-'+id).fadeIn();
		return;
	}
	$$.addClass('disabled');
	$.ajax({
		url: $$.attr('href'),
		type: 'GET',
		data: {ajax: 1},
		cache: false,
		success: function(r) {
			if (r.status == 0) {
				var $block = $(r.html).attr('id', 'confirm-'+id);

				$block.hide().appendTo('body');
				$block.fadeIn();

				var p = $$.position();
				var h = $block.height();
				var w = $block.width();

				$block.css({left: p.left - w + 'px', top: p.top - h / 2 + $$.height() / 2 + 'px'});
			} else if (r.message) {
				alert(r.message);
			}
		}
	}).done(function() {
		$$.removeClass('disabled');
	});
}

function showPage(object, event, id) {
	$.Event(event).preventDefault();
	var $$ = $(object);
	if ($$.hasClass('disabled')) {
		return;
	}
	$('.b-system-confirm:visible').hide();
	if ($('#page-'+id).length) {
		$('#page-'+id).fadeIn();
		return;
	}
	$$.addClass('disabled');
	$.ajax({
		url: $$.attr('href'),
		type: 'GET',
		data: {ajax: 1},
		cache: false,
		success: function(r) {
			var $block = $(r.html).attr('id', 'page-'+id);

			$block.hide().appendTo('body');
			$block.fadeIn();

			var p = $$.position();
			var h = $block.height();
			var w = $block.width();

//			$block.css({left: p.left - w + 'px', top: p.top - h / 2 + $$.height() / 2 + 'px'});
		}
	}).done(function() {
		$$.removeClass('disabled');
	});
}

function showMessage(data) {
	var $m = $('<div></div>', {"class": "b-message"});

	for (var i in data) {
		if (data[i].time) {
			var d = new Date(data[i].time*1000);
			var date = '';
			date += (d.getDay() < 10 ? '0' : '') + d.getDay()+'/';
			date += (d.getMonth() < 10 ? '0' : '') + d.getMonth()+'/';
			date += d.getFullYear() + ' ';
			date += (d.getHours() < 10 ? '0' : '') + d.getHours()+':';
			date += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
			$m.append($('<div />', {"class": 'b-message__date', "text": date}));
		}
		$m.append($('<div />', {"class": 'b-message__title', "text": data[i].title ? data[i].title : ''}));
		$m.append($('<div />', {"class": 'b-message__body', "html": data[i].body.replace(/\n/, '<br>')}));
	}

	$('#overlay').fadeIn();
	$('body').append($m);
	$m.css({marginTop: -$m.height() / 2 + 'px'});

	var __hide = function(e) {
		if (e.type == 'click' || e.keyCode == 27) {
			$m.remove();
			$('#overlay').hide();
			$(document).unbind('keydown click', __hide);
		}
	};

	$(document).bind('keydown click', __hide);
}

function doPost(actionUrl, params) {
	var newF = document.createElement("form");
	newF.action = actionUrl.replace(/&amp;/, '&');
	newF.method = 'POST';
	var parms = params.split('&');
	for (var i=0; i<parms.length; i++) {
		var pos = parms[i].indexOf('=');
		if (pos > 0) {
			var key = parms[i].substring(0,pos);
			var val = parms[i].substring(pos+1);
			var newH = document.createElement("input");
			newH.name = key;
			newH.type = 'hidden';
			newH.value = val;
			newF.appendChild(newH);
		}
	}
	document.getElementsByTagName('body')[0].appendChild(newF);
	newF.submit();
}
