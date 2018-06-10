import FakeDatabase from './../database';
import {showTable} from "./apartementsControl";
import {hideMap} from "./map";
import {hideTodoList} from "./todoList";
import {hideInvite} from "./roommateInvite";

const db = new FakeDatabase();


$("body").get(0).addEventListener("click", function(e){

    const $target = $(e.target);
    if (!$target.closest("#appartementForm").length) {
        $('#changeAppart').hide();
    }

    if (!$target.closest("#appartCreateForm").length) {
        $('#createAppart').hide();
    }

    if (!$target.closest("#inviteForm").length){
        $('#inviteRoommate-layout').hide()
    }

    if ($('#todo-creator-form').is(":visible") && !$target.closest("#todo-creator-form").length){
        $('#todo-creator').hide()
    }
}, true);


if(localStorage.getObject("login") === null){
    window.location.replace("index.html");
}

// Init todo comment
localStorage.removeItem("curApart");
$('#createAppart').hide();
$('#todo-creator').hide();
hideMap();
hideTodoList();
hideInvite();
showTable();