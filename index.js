(function () {
    'use strict';

    var fs = require('fs');
    var _ = require('lodash');
    var URL = require('url');

    var api = require('./swagger-aggregated.json');

    var curlSnippet = (method, url) => {
        return `curl -X ${method} &quot;<a href="${url}" target="_blank">${url}</a>&quot;`;
    };

    var serializeJSValue = (param, value) => {
        if(_.isArray(value)) {
            return value.map(v => serializeJSValue(v));
        } else {
            try {
                return JSON.parse(value);
            } catch(e) {
                return value;
            }
        }
    };

    var jsSnippet = (method, url) => {
        var u = URL.parse(url, true);
        var resource = api.paths[u.pathname.substring('/v1/_queries/public'.length)];
        var op = resource[method.toLowerCase()];
        return `API.${op.operationId}({
        ${op.parameters
            .filter(param => !param['x-exclude-from-bindings'])
            .filter(param => u.query[param.name])
            .map(param => `'${param.name}': ${JSON.stringify(serializeJSValue(param, u.query[param.name]))}`).join(',\n     ')}
})`;
    };

    var csharpSnippet = (endpoint, method, url) => {
        var u = URL.parse(url, true);
        var resource = api.paths[u.pathname.substring('/v1/_queries/public'.length)];
        var op = resource[method.toLowerCase()];
        return `CellStore.Client.ApiClient client = new CellStore.Client.ApiClient(&quot;${endpoint}&quot;);
CellStore.Api.DataApi api = new CellStore.Api.DataApi(client);

api.${op.operationId[0].toUpperCase() + op.operationId.substring(1)}(${op.parameters
            .filter(param => !param['x-exclude-from-bindings'])
            .filter(param => u.query[param.name])
            .map(param => `${param.name}: ${JSON.stringify(serializeJSValue(param, u.query[param.name]))}`).join(',\n     ')}
)`;
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
 <p>
 <select onchange="generateSnippet(this)">
 <option value="curl" data="${escape(curlSnippet(method, url))}">cURL</option>
 <option value="js" data="${escape(jsSnippet(method, url))}">JavaScript</option>
 <option value="csharp" data="${escape(csharpSnippet(env.endpoint, method, url))}">C#</option>
 </select>
 </p>
    <pre class="snippet">${curlSnippet(method, url)}</pre>
                    </div>`;
                }
            }
        }
    };
}());

/*

 */
