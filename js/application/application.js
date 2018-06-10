import FakeDatabase from './../database';
import {showTable} from "./apartementsControl";
import {hideMap} from "./map";
import {hideTodoList} from "./todoList";
import {hideInvite} from "./roommateInvite";

const db = new FakeDatabase();

//**
//* Code which is not unique enough to be in its own file
//**


// If user clicked out of certain forms then I will hide them
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

// If no user is "logged in", I will redirect him to index page, where he can sign in or register
if(localStorage.getObject("login") === null){
    window.location.replace("index.html");
}

// User is logged in. Ok, then I will hide all forms which are not supposed to be seen from the start
localStorage.removeItem("curApart");
$('#createAppart').hide();
$('#todo-creator').hide();
hideMap();
hideTodoList();
hideInvite();

// If user is not using mobile device I will show him table where he can choose apartment to adjust.
// (I won't be showing anything if he/she is using mobile device)
if (!window.matchMedia('(max-width: 600px)').matches) {
    showTable();
}
