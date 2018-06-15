import FakeDatabase from "../database";

export {showTodoList, hideTodoList};

const db = new FakeDatabase();

//**
//* File handling javascript functionality of to-do cards including its drag and drop functions.
//**

// Show all to-do list which are linked with current apartment being adjusted.
function showTodoList(){
    $('#todo-list-right').html("");

    const curApart = localStorage.getObject("curApart");
    if(curApart === null) {
        // If apartment is not yet chosen, show only layout.
        $('#todo-list-layout').show();
        return;
    }

    const todos = db.getTodosInApart(localStorage.getObject("curApart"));
    todos.forEach(function(todo){
       showCard(todo.author, todo.text);
    });


    // Every to-do card has dragStart event listener
    ($(".todoCard")).toArray().forEach((elem) => {
        elem.addEventListener("dragstart", onStartDragging, false);
    });


    $('#todo-list-layout').show();
}

function hideTodoList(){
    $('#todo-list-layout').hide();
}

// User wants to add new to-do card
$('#plus-symbol').on("click", () => {
    if(localStorage.getObject("curApart") === null){
        alert("Apartment has to be selected first.");
        return;
    }
    $('#todo-creator').show();
});

// User is creating new to-do card
$('#addTodoConfirm').on("click", () => {
    const $textArea = $('#todoTextArea');
    const todoText = $textArea.val().trim();
    if(todoText === "") return;

    $textArea.val('');
    const author = localStorage.getObject("login");
    db.createNewTodoCard(author, localStorage.getObject("curApart"), todoText);
    showCard(author, todoText);
    $('#todo-creator').hide();
});

// Show certain card in table
function showCard(author, todoText){
    const createdBy = "<span>" + author + "</span>";
    const text =  createdBy + "<br>" + todoText;
    const lineHtml = "<div class=\"todoCard\" draggable='true'>" + text + "</div>";

    $('#todo-list-right').append(lineHtml);

    const allCards = ($(".todoCard")).toArray();
    allCards[allCards.length-1].addEventListener("dragstart", onStartDragging, false);
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