(function () {
    'use strict';

    var fs = require('fs');

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
    <p>
        <select onchange="generateSnippet(this, '${method}', '${url}')">
            <option value="curl">cURL</option>
            <option value="js">JavaScript</option>
            <option value="csharp">C#</option>
        </select>
    </p>
    <pre class="snippet">curl -X ${method} '<a href="${url}" target="_blank">${url}</a>'</pre>
    <div class="postman-run-button" data-postman-action="collection/import" data-postman-var-1="d7a107824b4f4517d21b"></div>
                    </div>`;
                }
            }
        }
    };
}());
