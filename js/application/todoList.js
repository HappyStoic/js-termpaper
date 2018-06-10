import FakeDatabase from "../database";

export {showTodoList, hideTodoList};

const db = new FakeDatabase();

function showTodoList(){
    $('#todo-list-right').html("");

    const curApart = localStorage.getObject("curApart");
    if(curApart === null) {
        $('#todo-list-layout').show();
        return;
    }

    const todos = db.getTodosInApart(localStorage.getObject("curApart"));
    todos.forEach(function(todo){
       showCard(todo.author, todo.text);
    });

    $('#todo-list-layout').show();
}

function hideTodoList(){
    $('#todo-list-layout').hide();
}

$('#plus-symbol').on("click", () => {
    if(localStorage.getObject("curApart") === null){
        alert("Apartment has to be selected first.");
        return;
    }
    $('#todo-creator').show();
});

$('#addTodoConfirm').on("click", () => {
    const $textArea = $('#todoTextArea');
    const todoText = $textArea.val().trim();
    if(todoText === "") return;

    $textArea.text("");
    const author = localStorage.getObject("login");
    db.createNewTodoCard(author, localStorage.getObject("curApart"), todoText);
    showCard(author, todoText);
    $('#todo-creator').hide();
});

function showCard(author, todoText){
    const createdBy = "<span>" + author + "</span>";
    const text =  createdBy + "<br>" + todoText;
    const lineHtml = "<div class=\"todoCard\">" + text + "</div>";

    $('#todo-list-right').append(lineHtml);
}