(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.showTable = undefined;

var _database = require("../database");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.showTable = showTable;


var db = new _database2.default();

function addTableRecord(name, address) {
    var lineHtml = "<tr>\n" + "                    <td>" + name + "</td>\n" + "                    <td>" + address + "</td>\n" + "                </tr>";
    $('#apartTable').append(lineHtml);
}

function showTable() {
    $('#apartTable').html("");
    var allAparts = db.getApartsOfLoggedUser();

    allAparts.forEach(function (apartName) {
        addTableRecord(apartName, db.getAddress(apartName));
    });
    $('#changeAppart').show();
}

$('#createAppartBut').on("click", function () {
    $('#changeAppart').hide();
    $('#createAppart').show();
});

$('#backToTable').on("click", function () {
    $('#createAppart').hide();
    showTable();
});

$('#submitApart').on("click", function () {
    var name = $('#apartname').val().trim();
    var address = $('#apartaddress').val().trim();
    if (name === "" || address === "") {
        $('#errorCreatingApart').text("All fields must be filled.");
    }

    if (db.registerApart(name, address)) {
        showTable();
        $('#createAppart').hide();
    } else {
        $('#errorCreatingApart').text("Apartement with such name already exists.");
    }
});

$('#apartTable').on("click", function (e) {
    var clickedName = $(e.target).parent().children().get(0).innerText;
    localStorage.setObject("curApart", clickedName);
    $('#changeAppart').hide();
    $('#curApartBar').text(clickedName);

    //TODO jestli je neco ukazano z predchoziho bytu, tak to schovej
});

},{"../database":7}],2:[function(require,module,exports){
"use strict";

var _database = require("./../database");

var _database2 = _interopRequireDefault(_database);

var _apartementsControl = require("./apartementsControl");

var _map = require("./map");

var _todoList = require("./todoList");

var _roommateInvite = require("./roommateInvite");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = new _database2.default();

$("body").get(0).addEventListener("click", function (e) {

    var $target = $(e.target);
    if (!$target.closest("#appartementForm").length) {
        $('#changeAppart').hide();
    }

    if (!$target.closest("#appartCreateForm").length) {
        $('#createAppart').hide();
    }

    if (!$target.closest("#inviteForm").length) {
        $('#inviteRoommate-layout').hide();
    }

    if ($('#todo-creator-form').is(":visible") && !$target.closest("#todo-creator-form").length) {
        $('#todo-creator').hide();
    }
}, true);

if (localStorage.getObject("login") === null) {
    window.location.replace("index.html");
}

// Init todo comment
localStorage.removeItem("curApart");
$('#createAppart').hide();
$('#todo-creator').hide();
(0, _map.hideMap)();
(0, _todoList.hideTodoList)();
(0, _roommateInvite.hideInvite)();
(0, _apartementsControl.showTable)();

},{"./../database":7,"./apartementsControl":1,"./map":3,"./roommateInvite":5,"./todoList":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hideMap = exports.showMap = undefined;

var _database = require('../database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.showMap = showMap;
exports.hideMap = hideMap;


var db = new _database2.default();
var mapLoadedAlready = false; // Initial variable to describe state
var mapForApart = null; // If curApart is different -> I need to reload map
var defaultCoords = { x: 14.41790, y: 50.12655 }; // Coords for center of Prague

function showMap() {
    if (!mapLoadedAlready || mapForApart !== getCurApartment()) {
        initMap();
    } else {
        $('#map').show();
    }
}

function initMap() {
    var curAddress = db.getAddressOfCurApart();
    if (curAddress === null) {
        Loader.async = true;
        Loader.load(null, null, createMap(defaultCoords));
        return;
    }

    new SMap.Geocoder(curAddress, response);
}

function createMap(coords) {
    $('#map').show();

    var center = SMap.Coords.fromWGS84(coords.x, coords.y);
    var m = new SMap(JAK.gel("map"), center, 13);

    m.addControl(new SMap.Control.Sync({ bottomSpace: 0 }));
    m.addDefaultControls();
    m.addDefaultLayer(SMap.DEF_BASE).enable();

    // If I'm showing valid user address, I add mark pointer on the map
    if (coords !== defaultCoords) {
        var layer = new SMap.Layer.Marker();
        m.addLayer(layer);
        layer.enable();

        var options = {};
        var marker = new SMap.Marker(center, "Address", options);
        layer.addMarker(marker);
    }

    mapLoadedAlready = true;
    mapForApart = getCurApartment();
}

function response(geocoder) {
    if (!geocoder.getResults()[0].results.length) {
        alert("Not valid address. Showing Prague.");
        Loader.async = true;
        Loader.load(null, null, createMap(defaultCoords));
        return;
    }
    try {
        var res = geocoder.getResults()[0].results;
        var resultCoords = void 0;

        var data = [];
        var item = res.shift();
        resultCoords = { x: item.coords.x, y: item.coords.y };
        data.push(item.label + " (" + item.coords.toWGS84(2).reverse().join(", ") + ")");

        alert(data.join("\n"));

        Loader.async = true;
        Loader.load(null, null, createMap(resultCoords));
    } catch (e) {
        alert("Some error occurred. Showing Prague.");
        Loader.async = true;
        Loader.load(null, null, createMap(defaultCoords));
    }
}

function getCurApartment() {
    return localStorage.getObject("curApart");
}

function hideMap() {
    $('#map').hide();
}

},{"../database":7}],4:[function(require,module,exports){
"use strict";

var _database = require("../database");

var _database2 = _interopRequireDefault(_database);

var _apartementsControl = require("./apartementsControl");

var _map = require("./map");

var _todoList = require("./todoList");

var _roommateInvite = require("./roommateInvite");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = new _database2.default();

$('#logoutBut').on("click", function () {
    db.logout();
});

$('#changeAppartBut').on("click", function () {
    (0, _todoList.hideTodoList)();
    $('#createAppart').hide();
    (0, _map.hideMap)();
    (0, _roommateInvite.hideInvite)();
    (0, _apartementsControl.showTable)();
});

$('#map-button').on("click", function () {
    if ($('#map').is(":visible")) {
        (0, _map.hideMap)();
    } else {
        $('#changeAppart').hide();
        $('#createAppart').hide();
        (0, _todoList.hideTodoList)();
        (0, _roommateInvite.hideInvite)();
        (0, _map.showMap)();
    }
});

$('#todo-list-button').on("click", function () {
    (0, _map.hideMap)();
    (0, _roommateInvite.hideInvite)();
    $('#changeAppart').hide();
    $('#createAppart').hide();
    (0, _todoList.showTodoList)();
});

$('#addRoommateBut').on("click", function () {
    if (localStorage.getObject("curApart") === null) {
        alert("Apartment has to be selected first.");
        return;
    }
    (0, _map.hideMap)();
    (0, _todoList.hideTodoList)();
    $('#changeAppart').hide();
    $('#createAppart').hide();
    (0, _roommateInvite.showInvite)();
});

},{"../database":7,"./apartementsControl":1,"./map":3,"./roommateInvite":5,"./todoList":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hideInvite = exports.showInvite = undefined;

var _database = require('../database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.showInvite = showInvite;
exports.hideInvite = hideInvite;


var db = new _database2.default();

function showInvite() {
    $('#inviteRoommate-layout').show();
}

function hideInvite() {
    $('#inviteRoommate-layout').hide();
}

$('#addRoommateConfirm').on("click", function () {
    var roommateName = $('#roommateName').val().trim();

    if (roommateName === "") {
        $('#errorInvitingRoommate').text("Field must be filled.");
    } else if (!db.existsUser(roommateName)) {
        $('#errorInvitingRoommate').text("Such user does not exist.");
    } else {
        db.assignApartToUser(roommateName, localStorage.getObject("curApart"));
        hideInvite();
    }
});

},{"../database":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hideTodoList = exports.showTodoList = undefined;

var _database = require("../database");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.showTodoList = showTodoList;
exports.hideTodoList = hideTodoList;


var db = new _database2.default();

function showTodoList() {
    $('#todo-list-right').html("");

    var curApart = localStorage.getObject("curApart");
    if (curApart === null) {
        $('#todo-list-layout').show();
        return;
    }

    var todos = db.getTodosInApart(localStorage.getObject("curApart"));
    todos.forEach(function (todo) {
        showCard(todo.author, todo.text);
    });

    $(".todoCard").toArray().forEach(function (elem) {
        elem.addEventListener("dragstart", onStartDragging, false);
    });

    $('#todo-list-layout').show();
}

function hideTodoList() {
    $('#todo-list-layout').hide();
}

$('#plus-symbol').on("click", function () {
    if (localStorage.getObject("curApart") === null) {
        alert("Apartment has to be selected first.");
        return;
    }
    $('#todo-creator').show();
});

$('#addTodoConfirm').on("click", function () {
    var $textArea = $('#todoTextArea');
    var todoText = $textArea.val().trim();
    if (todoText === "") return;

    $textArea.text("");
    var author = localStorage.getObject("login");
    db.createNewTodoCard(author, localStorage.getObject("curApart"), todoText);
    showCard(author, todoText);
    $('#todo-creator').hide();
});

function showCard(author, todoText, without) {
    var createdBy = "<span>" + author + "</span>";
    var text = createdBy + "<br>" + todoText;
    var lineHtml = "<div class=\"todoCard\" draggable='true'>" + text + "</div>";

    $('#todo-list-right').append(lineHtml);
}

function onStartDragging(ev) {
    ev.dataTransfer.setData("text", ev.target.innerHTML);
    console.log(ev.target.innerHTML);
}

var $binDiv = $("#bin-div");

$binDiv.get(0).addEventListener("dragover", function (event) {
    var $bin = $('#bin');
    $bin.removeClass("bin-normal");
    $bin.addClass("bin-draged-over");
    event.preventDefault();
}, false);

$binDiv.get(0).addEventListener("dragleave", function (event) {
    var $bin = $('#bin');
    $bin.removeClass("bin-draged-over");
    $bin.addClass("bin-normal");
    event.preventDefault();
}, false);

$binDiv.get(0).addEventListener("drop", function (event) {
    var $bin = $('#bin');
    $bin.removeClass("bin-draged-over");
    $bin.addClass("bin-normal");

    var toEraseList = event.dataTransfer.getData("text");
    db.eraseTodo(toEraseList, localStorage.getObject("curApart"));
    showTodoList();

    event.preventDefault();
}, false);

},{"../database":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FakeDatabase = function () {
    function FakeDatabase() {
        _classCallCheck(this, FakeDatabase);

        Storage.prototype.setObject = function (key, value) {
            this.setItem(key, JSON.stringify(value));
        };

        Storage.prototype.getObject = function (key) {
            var value = this.getItem(key);
            return value && JSON.parse(value);
        };

        if (localStorage.getObject("users") == null) {
            this.initDatabase();
        }
    }

    _createClass(FakeDatabase, [{
        key: "initDatabase",
        value: function initDatabase() {
            var emptyObject = {};
            var emptyArray = [];
            localStorage.setObject("users", emptyObject);
            localStorage.setObject("aparts", emptyObject);
            localStorage.setObject("usersToAparts", emptyObject);
            localStorage.setObject("todos", emptyArray);
        }
    }, {
        key: "registerUser",
        value: function registerUser(name, password) {
            var users = this._getAllUsers();
            if (users[name] !== undefined) {
                return false;
            }

            var usersToAparts = this._getAllUsersToAparts();
            usersToAparts[name] = [];

            users[name] = { 'password': password };
            localStorage.setObject("users", users);
            localStorage.setObject("usersToAparts", usersToAparts);
            return true;
        }
    }, {
        key: "loginUser",
        value: function loginUser(name, password) {
            var users = this._getAllUsers();
            if (users[name] === undefined) return false;else if (users[name].password === password) {
                localStorage.setObject("login", name);
                return true;
            }
            return false;
        }
    }, {
        key: "logout",
        value: function logout() {
            localStorage.removeItem("login");
            localStorage.removeItem("curApart");
        }
    }, {
        key: "isLogin",
        value: function isLogin() {
            return localStorage.getObject("login") !== null;
        }
    }, {
        key: "registerApart",
        value: function registerApart(name, address) {
            var allAparts = this._getAllAparts();
            if (allAparts[name] !== undefined) {
                return false;
            }
            this.assignApartToUser(localStorage.getObject("login"), name);
            allAparts[name] = { "address": address };
            localStorage.setObject("aparts", allAparts);
            return true;
        }
    }, {
        key: "getAddressOfCurApart",
        value: function getAddressOfCurApart() {
            var curApart = localStorage.getObject("curApart");
            if (curApart === null) return null;else return this._getAllAparts()[curApart].address;
        }
    }, {
        key: "getApartsOfLoggedUser",
        value: function getApartsOfLoggedUser() {
            var login = localStorage.getObject("login");
            var usersToAparts = this._getAllUsersToAparts();
            return usersToAparts[login];
        }
    }, {
        key: "_getAllAparts",
        value: function _getAllAparts() {
            return localStorage.getObject("aparts");
        }
    }, {
        key: "_getAllUsers",
        value: function _getAllUsers() {
            return localStorage.getObject("users");
        }
    }, {
        key: "_getAllUsersToAparts",
        value: function _getAllUsersToAparts() {
            return localStorage.getObject("usersToAparts");
        }
    }, {
        key: "_getAllTodos",
        value: function _getAllTodos() {
            return localStorage.getObject("todos");
        }
    }, {
        key: "existsUser",
        value: function existsUser(username) {
            var users = this._getAllUsers();
            return users[username] !== undefined;
        }
    }, {
        key: "assignApartToUser",
        value: function assignApartToUser(username, apartname) {
            var usersToAparts = this._getAllUsersToAparts();
            var userAparts = usersToAparts[username];
            if (!userAparts.includes(apartname)) {
                userAparts.push(apartname);
                localStorage.setObject("usersToAparts", usersToAparts);
            }
        }
    }, {
        key: "getAddress",
        value: function getAddress(apartment) {
            return this._getAllAparts()[apartment].address;
        }
    }, {
        key: "createNewTodoCard",
        value: function createNewTodoCard(author, apart, content) {
            var newCard = { "apart": apart, "author": author, "text": content };
            var todos = this._getAllTodos();
            todos.push(newCard);
            localStorage.setObject("todos", todos);
        }
    }, {
        key: "getTodosInApart",
        value: function getTodosInApart(apartment) {
            return this._getAllTodos().filter(function (todo) {
                return todo.apart === apartment;
            });
        }
    }, {
        key: "eraseTodo",
        value: function eraseTodo(text, apart) {
            var content = text.substring(text.indexOf("<br>") + 4, text.length);
            var author = $(text).filter("span").get(0).innerText;

            var todos = this._getAllTodos();
            for (var i = 0; i < todos.length; i++) {
                var todo = todos[i];
                if (todo.apart === apart && todo.author === author && todo.text === content) {
                    todos.splice(i, 1);
                    break;
                }
            }
            localStorage.setObject("todos", todos);
        }
    }]);

    return FakeDatabase;
}();

exports.default = FakeDatabase;

},{}]},{},[2,1,4,3,5,6]);
