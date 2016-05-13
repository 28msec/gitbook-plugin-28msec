(function () {
    'use strict';

    var fs = require('fs');
    var _ = require('lodash');
    var URL = require('url');

    var curlSnippet = (method, url) => {
        return `curl -X ${method} &quot;<a href="${url}" target="_blank">${url}</a>&quot;`;
    };

    var envs = {
        secxbrl: {
            endpoint: 'http://secxbrl.28.io/v1',
            token: 'c3049752-4d35-43da-82a2-f89f1b06f7a4'
        },
        edinet: {
            endpoint: 'http://edinet.28.io/v1',
            token: 'c3049752-4d35-43da-82a2-f89f1b06f7a4'
        }
    };

    module.exports = {
        book: {
            assets: '.',
            css: [ 'plugin.css' ],
            js: [
                'plugin.js'
            ]
        },
        blocks: {
            example: {
                process: function(block){
                    var args = block.kwargs;
                    var collection = JSON.parse(fs.readFileSync(args.collection, 'utf-8'));
                    var env = envs[args.env];
                    var req = collection.requests.filter(function(request){
                        return request.id === args.id;
                    })[0];
                    var method = req.method;
                    var url = req.url.replace(/{{endpoint}}/g, env.endpoint).replace(/{{token}}/g, env.token);
                    return `<div class="example">
    <p>${req.name}</p>
 <!--p>
 <select onchange="generateSnippet(this)">
 <option value="curl" data="${escape(curlSnippet(method, url))}">cURL</option>
 <option value="js" data="${escape(jsSnippet(method, url))}">JavaScript</option>
 <option value="csharp" data="${escape(csharpSnippet(env.endpoint, method, url))}">C#</option>
 </select>
 </p-->
    <pre class="snippet">${curlSnippet(method, url)}</pre>
                    </div>`;
                }
            }
        }
    };
}());

/*

 */
