var express = require('express');
var app = express();
var bodyParser =  require('body-parser');
var _ = require('underscore');

const PORT = process.env.PORT || 3000;

var todoList = [];
var nextTodoId = 1;

// Middleware:
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('API root');
});

// GET /todos Accepts query params
app.get('/todos', function (req, res) {
    var queryParams = _.pick(req.query, 'completed');
    var filteredToDos = todoList;
    console.log(JSON.stringify(queryParams));

    if (queryParams.hasOwnProperty('completed') && queryParams.completed.toLowerCase() === 'true') {
        filteredToDos = _.where(filteredToDos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed.toLowerCase() === 'false') {
        filteredToDos = _.where(filteredToDos, {completed: false});
    }

    res.json(filteredToDos);
});


// GET /todos/id
app.get('/todos/:id', function (req, res) {
    // var result = todoList.find(e => e.id === parseInt(req.params.id));
    var result = _.findWhere(todoList, {id: parseInt(req.params.id)});

    if (result) {
        res.json(result);
    } else {
        res.status(404).send();
    }
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    if (!(_.isBoolean(body.completed) && (_.isString(body.description) && body.description.trim().length > 0))) {
        return res.status(400).send();
    }

    body.id = nextTodoId;
    body.description = body.description.trim();

    todoList.push(body);
    nextTodoId++;
    res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var deleted = _.findWhere(todoList, {id: parseInt(req.params.id, 10)});

    if (deleted) {
        todoList = _.without(todoList, deleted);
        res.json(deleted);
    } else {
        res.status(404).json({error: 'Resource could not be found'}).send();
    }
});


// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    var targetToDo = _.findWhere(todoList, {id: parseInt(req.params.id, 10)});
    var validAttributes = {};

    if (!targetToDo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')){
        // Errors
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        // Errors
        return res.status(400).send();
    }

    _.extend(targetToDo, validAttributes);

    return res.json(targetToDo);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + ' ...');
});
