(function($, window) {

	window.norgram = {

		boot: function() {
			this.bindMenu();
			this.bindCopyColorLinks();
			this.setupWOW();
			this.handleHeaderCssClass();
			this.hookUpPlugins();
		},

		bindMenu: function() {
			var $body = $("body"),
				$menu = $("#menu"), 
				$menuList = $("ol.menu-list"),
				toggleMenu = function() {
				if ($body.hasClass("menu-open")) {
					$body.addClass("menu-hiding");

					$menu.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
						$body.removeClass("menu-hiding");
					});
				}

				$body.toggleClass("menu-open");
			};

			$("#menu-button").click(toggleMenu);

			$("#menu").on("click", "a", function (event) {
				toggleMenu();

				$menuList.find("li.active").removeClass("active");
				$(event.currentTarget).parent().addClass("active");
			});
		},

		bindCopyColorLinks: function() {
			new Clipboard("a.copy-color", {
					text: function(trigger) {
							return trigger.innerText;
					}
			});

			$("div.section-color-table").on("click", "a.copy-color", function(event) {
				$(event.currentTarget).data("bs.tooltip").$tip.find(".tooltip-inner").text("  Copied!  ");
			});
		},

		setupWOW: function() {
			var wow = new WOW(
			{
				boxClass:     'wow',      // animated element css class (default is wow)
				animateClass: 'animated', // animation css class (default is animated)
				offset:       0,          // distance to the element when triggering the animation (default is 0)
				mobile:       true,       // trigger animations on mobile devices (default is true)
				live:         true,       // act on asynchronously loaded content (default is true)
				callback:     function(box) {
					// the callback is fired every time an animation is started
					// the argument that is passed in is the DOM node being animated
				},
				scrollContainer: null // optional scroll container selector, otherwise use window
			});
			wow.init();
		},

		handleHeaderCssClass: function() {
			var $body = $("body"),
				$hero = $("section.section-hero:first"),
				$sections = $body.find("section"),
				$currentSection,
				handleHeader = function() {
					if ($hero.length > 0) {
						requestAnimationFrame(function() {
							var overHero = window.scrollY < $hero.offset().top + $hero.height();

							$body.toggleClass("over-hero", overHero);
						});
					}
				};

			$(window).scroll(handleHeader);

			handleHeader();
		},

		hookUpPlugins: function() {
			$("a.copy-color").tooltip({
				placement: "right",
				container: "body",
				title: "Click to copy"
			});
		}

	};

	$(document).ready(function() {
		norgram.boot();
	});

})(jQuery, window);