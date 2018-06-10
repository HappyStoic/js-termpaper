import FakeDatabase from "../database";
import {showTable} from "./apartementsControl";
import {hideMap, showMap} from "./map";
import {hideTodoList, showTodoList} from "./todoList";
import {hideInvite, showInvite} from "./roommateInvite";

const db = new FakeDatabase();

//**
//* This file handles clicking on navigation buttons on navigation top bar
//* Basically on every click all not needed elements are hidden and the required one is shown - see below.
//**

$('#logoutBut').on("click", () => {
    db.logout();
});

// Shows form to choose current apartment to adjust.
$('#changeAppartBut').on("click", () => {
    hideTodoList();
    $('#createAppart').hide();
    hideMap();
    hideInvite();
    showTable();
});

$('#map-button').on("click", () => {
    // This button works as toggle.
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
    // I cannot add roommate to <non> apartment
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


