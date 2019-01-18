var express = require('express');
var app = express();
var bodyParser =  require('body-parser');

const PORT = process.env.PORT || 3000;

var todoList = [];
var nextTodoId = 1;

// Middleware:
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('API root');
});

// GET /todos
app.get('/todos', function (req, res) {
    res.json(todoList);
});

// GET /todos/id
app.get('/todos/:id', function (req, res) {
    var result = todoList.find(e => e.id === parseInt(req.params.id));

    if (result) {
        res.json(result);
    } else {
        res.status(404).send();
    }
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = req.body;
    body.id = nextTodoId;
    todoList.push(body);
    nextTodoId++;
    res.json(body);
});


app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + ' ...');
});
