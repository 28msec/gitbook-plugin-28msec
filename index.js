(function () {
    'use strict';

    var fs = require('fs');
    var _ = require('lodash');
    var URL = require('url');

    var api = require('swagger-aggregated.json');

    var operations = {
        "get:/api/entities": "listEntities",
        "get:/api/filings": "listFilings",
        "get:/api/periods": "listPeriods",
        "get:/api/sections": "listSections",
        "get:/api/components": "listComponents",
        "get:/api/facttable-for-component": "listFactTable",
        "get:/api/spreadsheet-for-component": "spreadsheetForComponent",
        "get:/api/modelstructure-for-component": "listModelStructure",
        "get:/api/facttable-for-report": "listFactTableForReport",
        "get:/api/spreadsheet-for-report": "listSpreadsheetForReport",
        "get:/api/facts": "listFacts",
        "get:/api/labels": "listLabels",
        "get:/api/report-elements": "listReportElements"
    };

    var curlSnippet = (method, url) => {
        return `curl -X ${method} &quot;<a href="${url}" target="_blank">${url}</a>&quot;`;
    };

    var jsSnippet = (method, url) => {
        var u = URL.parse(url, true);
        var op = operations[method.toLowerCase() + ':' + u.pathname.substring('/v1/_queries/public'.length)];
        _.forEach(api.paths, path => {
            _.forEach(path, o => {
                if(o.operationId === op) {
                    console.log(o);
                }
            });
        });
        return `API.${op}({
    ${_.map(u.query, (value, key) => { return `'${key}': '${value}'`; }).join(',\n    ')}
})`;
    };

    var csharpSnippet = (endpoint, method, url) => {
        var u = URL.parse(url, true);
        var op = operations[method.toLowerCase() + ':' + u.pathname.substring('/v1/_queries/public'.length)];
        return `CellStore.Client.ApiClient client = new CellStore.Client.ApiClient(&quot;${endpoint}&quot;);
CellStore.Api.DataApi api = new CellStore.Api.DataApi(client);

api.${op[0].toUpperCase() + op.substring(1)}(
    ${_.map(u.query, (value, key) => { return key + ': "' + value + '"'; }).join(',\n    ')}
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
