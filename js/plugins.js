// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

$.validator.addMethod("datetime", function(value, element) {
    var d = new Date(value);
    var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/
    return this.optional(element) || (!isNaN(d.getTime()) && value.match(re));
}, "Please enter a valid date");

$.validator.addMethod("upcomingdate", function(value, element) {
    var d = new Date(value);
    var curr = new Date();
    return this.optional(element) || d.getTime() > curr.getTime();
}, "Date must be in the future");

// Place any jQuery/helper plugins in here.
$('#rental').validate({
    rules: {
        pickup_date: {
            required: true,
            datetime: true
//            upcomingdate: true
        }
    }
});

// initialize date and time fields
$('#pickup_date').datepicker({ 
    minDate: 0,
    maxDate: 30
});
$('#pickup_time').timepicker({
    'minTime': '11:00am',
    'maxTime': '6:30pm',
    'timeFormat': 'g:i A',
    'useSelect': true
});