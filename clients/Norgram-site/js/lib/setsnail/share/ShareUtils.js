ShareUtils = {};

ShareUtils.tweet = function(text, url) {
	var encodedURL = 'http://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
	if (!window.open(encodedURL, "tweetFollow", "width=550,height=420,toolbar=no")) {
        window.location.href = encodedURL;
    }
};

ShareUtils.facebook = function(url) {
	// url = "http://54.76.200.144/#/blog/blog-post-1";
	window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), "fbShare", "width=550,height=420,toolbar=yes");

};

ShareUtils.mail = function(url, subject, message) {
	window.open("mailto:?subject=" + subject + "&body=" + message, "_parent");
};

