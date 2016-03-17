'use strict';

require([
    'gitbook'
], function(gitbook) {
    window.generateSnippet = (el) => {
        var snippet = el.selectedOptions[0].getAttribute('data');
        el.parentElement.parentElement.querySelector('.snippet').innerHTML = unescape(snippet);
    };
});
