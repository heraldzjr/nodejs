const todoListEl = $('#my-todo-list');

const drawList = function () {
    const searchText = $('#searchbox').val();
    $.ajax({
        url: "/todos",
        type: 'get',
        dataType: 'json',
        data: {
            searchtext: searchText
        },
        success: function (todos) {
            $('#my-todo-list').html('');
            todos.forEach(function (todoItem) {
                const li = $('<li id='+todoItem.id+'><input type = checkbox>' + todoItem.message + '<button class="delete">X</button></li>');
                const input = li.find('input');
                input.prop('checked', todoItem.completed);
                $('#my-todo-list').append(li);
            });
        },
        error: function (data) {
            alert('Error searching');
        }
    });
}

const addToDo = function () {
    const saveText = $('#savebox').val();
    $('#savebox').val('');
    $.ajax({
        url: "/todos",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({
            message: saveText,
            completed: false
        }),
        success: function (todos) {
            drawList();
        },
        error: function (data) {
            alert('Error');
        }
    });
}

const deleteItem = function (todoItemID) {
    $.ajax({
        url     : "/todos/" + todoItemID,
        type    : 'delete',
        success : function(data) {
            drawList();
        },
        error   : function(data) {
            alert('Error deleting the item');
        }
    });
}

const updateList = function (todoItemID) {
    $.ajax({
        url     : "/todos/" + todoItemID,
        type    : 'put',
        success : function(data) {
            drawList();
        },
        error   : function(data) {
            alert('Error updating the item');
        }
    });
}

drawList();

$('#searchbut').on('click', function () {
    drawList();
});
$('#savebut').on('click', function () {
    addToDo();
});
$('ul').on('click','.delete', function (event) {
    deleteItem($(this).parent().attr('id'));
});
$('ul').on('change','input', function (event) {
    updateList($(this).parent().attr('id'));
});
