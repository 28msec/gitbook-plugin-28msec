(function () {
    'use strict';

    var fs = require('fs');

    var envs = {
        secxbrl: {
            projectName: 'secxbrl',
            token: 'c3049752-4d35-43da-82a2-f89f1b06f7a4'
        },
        edinet: {
            projectName: 'edinet',
            token: 'c3049752-4d35-43da-82a2-f89f1b06f7a4'
        }
    };

    module.exports = {
        book: {
            assets: '.',
            css: [ 'plugin.css' ]
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
                    var url = req.url.replace(/{{projectName}}/g, env.projectName);
                    return `<div class="example">
    <p>${req.name}</p>
    <a href="${url.replace(/{{token}}/g, env.token)}" target="_blank">${url.replace(/&?\??token={{token}}/g, '')}</a>
                    </div>`;
                }
            }
        }
    };
}());
