'use strict';

require([
    'gitbook'
], function(gitbook) {


    gitbook.events.bind('start', function() {//e, config) {
        (function (p,o,s,t,m,a,n) {
            !p[s] && (p[s] = function () { (p[t] || (p[t] = [])).push(arguments); });
            !o.getElementById(s+t) && o.getElementsByTagName('head')[0].appendChild((
                (n = o.createElement('script')),
                    (n.id = s+t), (n.async = 1), (n.src = m), n
            ));
        }(window, document, '_pm', 'PostmanRunObject', 'https://run.pstmn.io/button.js'));
    });

    window.generateSnippet = (el) => {
        var snippet = el.selectedOptions[0].getAttribute('data');
        el.parentElement.parentElement.querySelector('.snippet').innerHTML = unescape(snippet);
    };

    //gitbook.events.bind("page.change", resetDisqus);
});
