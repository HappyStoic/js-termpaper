import FakeDatabase from './../database';
import {showTable} from "./apartementsControl";
import {hideMap} from "./map";

const db = new FakeDatabase();


// Init todo comment
localStorage.removeItem("curApart");
$('#createAppart').hide();
showTable();
hideMap();