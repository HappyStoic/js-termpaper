import FakeDatabase from "../database";
import {showTable} from "./apartementsControl";
import {hideMap, showMap} from "./map";
import {hideTodoList, showTodoList} from "./todoList";
import {hideInvite, showInvite} from "./roommateInvite";

const db = new FakeDatabase();

$('#logoutBut').on("click", () => {
    db.logout();
});

$('#changeAppartBut').on("click", () => {
    hideTodoList();
    $('#createAppart').hide();
    hideMap();
    hideInvite();
    showTable();
});

$('#map-button').on("click", () => {
    if($('#map').is(":visible")){
        hideMap();
    } else {
        $('#changeAppart').hide();
        $('#createAppart').hide();
        hideTodoList();
        hideInvite();
        showMap();
    }
});

$('#todo-list-button').on("click", () => {
    hideMap();
    hideInvite();
    $('#changeAppart').hide();
    $('#createAppart').hide();
    showTodoList();
});

$('#addRoommateBut').on("click", () => {
    if(localStorage.getObject("curApart") === null){
        alert("Apartment has to be selected first.");
        return;
    }
    hideMap();
    hideTodoList();
    $('#changeAppart').hide();
    $('#createAppart').hide();
    showInvite();
});


