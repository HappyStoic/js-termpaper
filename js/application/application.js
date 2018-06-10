import FakeDatabase from './../database';
import {showTable} from "./apartementsControl";
import {hideMap} from "./map";
import {hideTodoList} from "./todoList";

const db = new FakeDatabase();


// Init todo comment
localStorage.removeItem("curApart");
$('#createAppart').hide();
showTable();
hideMap();
hideTodoList();