'use strict';
const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const todos = [
    {
        id: Math.random() + '',
        message: 'Do morning exercises',
        completed: false
    },
    {
        id: Math.random() + '',
        message: 'Buy a gift for mum',
        completed: false
    },
    {
        id: Math.random() + '',
        message: 'Do homework',
        completed: false
    }
];

const server = http.createServer(function (req, res) {
    const filePath = './public' + req.url;

    fs.readFile(filePath, function (err, data) {
        if (err) {
            res.statusCode = 404;
            res.end('Page not found');
        }
        res.statusCode = 200;
        res.end(data);
    });
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;
    if (method == 'GET') {
        if (req.url.indexOf('/todos') === 0) {
            let localTodos = todos;
            res.setHeader('Content-Type', 'application/json');

            if (parsedQuery.searchtext) {
                localTodos = localTodos.filter(function (obj) {
                    return obj.message.toLowerCase().indexOf(parsedQuery.searchtext.toLowerCase()) >= 0;
                });
            }
            return res.end(JSON.stringify(localTodos));
        }
    }
    if (method == 'POST') {
        if (req.url.indexOf('/todos') === 0) {
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);
                if (jsonObj.message) {
                    jsonObj.id = Math.random() + '';
                    todos[todos.length] = jsonObj;

                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify(todos));
                }
            });
            return;
        }
    }
    if (method === 'DELETE') {
        if (req.url.indexOf('/todos/') === 0) {
            let id = req.url.substr(7);
            for (let i = 0; i < todos.length; i++) {
                if (id === todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }
    if (method === 'PUT') {
        if (req.url.indexOf('/todos/') === 0) {
            let id = req.url.substr(7);
            for (let i = 0; i < todos.length; i++) {
                if (id === todos[i].id) {
                    todos[i].completed = !todos[i].completed;
                    res.statusCode = 200;
                    return res.end('Successfully updated');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found and can therefore not be updated');
        }
    }
});
server.listen(3001);
