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


    ($(".todoCard")).toArray().forEach((elem) => {
        elem.addEventListener("dragstart", onStartDragging, false);
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

function showCard(author, todoText, without){
    const createdBy = "<span>" + author + "</span>";
    const text =  createdBy + "<br>" + todoText;
    const lineHtml = "<div class=\"todoCard\" draggable='true'>" + text + "</div>";

    $('#todo-list-right').append(lineHtml);
}

function onStartDragging(ev){
    ev.dataTransfer.setData("text", ev.target.innerHTML);
    console.log(ev.target.innerHTML);
}

const $binDiv = $("#bin-div");

$binDiv.get(0).addEventListener("dragover", (event) => {
    const $bin = $('#bin');
    $bin.removeClass("bin-normal");
    $bin.addClass("bin-draged-over");
    event.preventDefault();
}, false);

$binDiv.get(0).addEventListener("dragleave", (event) => {
    const $bin = $('#bin');
    $bin.removeClass("bin-draged-over");
    $bin.addClass("bin-normal");
    event.preventDefault();
}, false);

$binDiv.get(0).addEventListener("drop", (event) => {
    const $bin = $('#bin');
    $bin.removeClass("bin-draged-over");
    $bin.addClass("bin-normal");

    const toEraseList = event.dataTransfer.getData("text");
    db.eraseTodo(toEraseList, localStorage.getObject("curApart"));
    showTodoList();

    event.preventDefault();
}, false);