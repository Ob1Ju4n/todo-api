var express = require('express');
var app = express();

const PORT = process.env.PORT || 3000;

var todoList = [{
    id: '1',
    description: 'ToDo example',
    completed: false
}, {
    id: '2',
    description: 'Second ToDo example',
    completed: false
}, {
    id: '3',
    description: 'Third ToDo example',
    completed: true
}];

app.get('/', function (req, res) {
    res.send('API root');
});

// GET /todos
app.get('/todos', function (req, res) {
    res.json(todoList);
});

// GET /todos/id
app.get('/todos/:id', function (req, res) {
    var result = todoList.find(e => e.id === req.params.id);

    if (result) {
        res.json(result);
    } else {
        res.status(404).send();
    }
});


app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + ' ...');
});
