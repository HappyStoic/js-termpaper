import FakeDatabase from "../database";
import {showTable} from "./apartementsControl";
import {hideMap, showMap} from "./map";
import {hideTodoList, showTodoList} from "./todoList";

const db = new FakeDatabase();

$('#logoutBut').on("click", () => {
    db.logout();
});

$('#changeAppartBut').on("click", () => {
    hideTodoList();
    hideMap();
    showTable();
});

$('#map-button').on("click", () => {
    if($('#map').is(":visible")){
        hideMap();
    } else {
        $('#changeAppart').hide();
        $('#createAppart').hide();
        hideTodoList();
        showMap();
    }
});

$('#todo-list-button').on("click", () => {
    hideMap();
    $('#changeAppart').hide();
    $('#createAppart').hide();
    showTodoList();
});


