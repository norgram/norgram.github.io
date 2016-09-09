/**
* @fileoverview Provides helper functions to Google Analytics
<<<<<<< HEAD
*   Usage Examples:
*       Track page view:
*           GoogleAnalytics.trackPage("myIntroPage");
*       
*       Track an Event:
*           GoogleAnalytics.trackEvent("Videos", "Play", "Gone With the Wind");
=======
*   Usage Examples:
*       Track a Page:
*           GoogleAnalytics.trackPage("Intro")
*       
*       Track an Event:
*           GoogleAnalytics.trackEvent("Videos", "Play", "Gone With the Wind");
>>>>>>> Framework optimizations - v2
*           GoogleAnalytics.trackEvent("Videos", "Pause", "Gone With the Wind");
*           GoogleAnalytics.trackEvent("Videos", "Stop", "Gone With the Wind");
*       
*       Track Social Event:
*           GoogleAnalytics.trackSocialEvent("Facebook", "Like");
* 
* @dependencies That Google Analytics tracking code is imported in the "head" section
* @author Anders
* @browsers: All (however only tested in: IE7+, FF3.6+, Chrome 11+, Safari 5+)
* 
* Based on:
* https://developers.google.com/analytics/devguides/collection/gajs/
*/

var GoogleAnalytics = {};
/**
* Tracks either a custom page - or if you do not pass in any parameters in it tracks the current page (including the hash)
* @param {string} opt_trackPageName Optional: Pass in a specific page name - if not it tracks the current page you are on (including the hash tag)
*/
GoogleAnalytics.trackPage = function(opt_trackPageName) 
{
    if (opt_trackPageName === null) {
        opt_trackPageName = location.pathname + location.search + location.hash;
    }
    _gaq.push(["_trackPageview",  opt_trackPageName]);
};

/**
* Track an Event
* @param {string} category The name you supply for the group of objects you want to track.
* @param {string} action A string that is uniquely paired with each category, and commonly used to define the type of user interaction for the web object. 
* @param {string} opt_label An optional string to provide additional dimensions to the event data. 
* @param {string} opt_value An integer that you can use to provide numerical data about the user event.
* @param {string} opt_noninteraction A boolean that when set to true, indicates that the event hit will not be used in bounce-rate calculation.
* 
* https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
*/
GoogleAnalytics.trackEvent = function(category, action, opt_label, opt_value, opt_noninteraction)
{
    if (opt_noninteraction === null) {
        opt_noninteraction = false;
    }
    _gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
}; 

/**
* Track a Social Event
* @param {string} network Required. A string representing the social network being tracked (e.g. Facebook, Twitter, LinkedIn) The name you supply for the group of objects you want to track.
* @param {string} socialAction Required. A string representing the social action being tracked (e.g. Like, Share, Tweet)
* @param {string} opt_target Optional. A string representing the URL (or resource) which receives the action. For example, if a user clicks the Like button on a page on a site, the the opt_target might be set to the title of the page, or an ID used to identify the page in a content management system. In many cases, the page you Like is the same page you are on. So if this parameter is undefined, or omitted, the tracking code defaults to using document.location.href.
* @param {string} opt_pagePath Optional. A string representing the page by path (including parameters) from which the action occurred. For example, if you click a Like button on http://developers.google.com/analytics/devguides/, then opt_pagePath should be set to /analytics/devguides. Almost always, the path of the page is the source of the social action. So if this parameter is undefined or omitted, the tracking code defaults to using location.pathname plus location.search. You generally only need to set this if you are tracking virtual pageviews by modifying the optional page path parameter with the Google Analytics _trackPageview method.
* 
* https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingSocial
*/
GoogleAnalytics.trackSocialEvent = function(network, socialAction, opt_target, opt_pagePath) 
{
    _gaq.push(['_trackSocial', network, socialAction, opt_target, opt_pagePath]);
};
