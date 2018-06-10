export default class FakeDatabase{


    constructor() {
        Storage.prototype.setObject = function(key, value) {
            this.setItem(key, JSON.stringify(value));
        };

        Storage.prototype.getObject = function(key) {
            const value = this.getItem(key);
            return value && JSON.parse(value);
        };

        if(localStorage.getObject("users") == null){
            this.initDatabase()
        }
    }

    initDatabase(){
        const emptyObject = {};
        const emptyArray = [];
        localStorage.setObject("users", emptyObject);
        localStorage.setObject("aparts", emptyObject);
        localStorage.setObject("usersToAparts", emptyObject);
        localStorage.setObject("todos", emptyArray);
    }

    registerUser(name, password){
        let users = this._getAllUsers();
        if(users[name] !== undefined) {
            return false;
        }

        const usersToAparts = this._getAllUsersToAparts();
        usersToAparts[name] = [];

        users[name] = {'password' : password};
        localStorage.setObject("users", users);
        localStorage.setObject("usersToAparts", usersToAparts);
        return true;
    }

    loginUser(name, password){
        let users = this._getAllUsers();
        if(users[name] === undefined) return false;
        else if(users[name].password === password){
            localStorage.setObject("login", name);
            return true;
        }
        return false;
    }

    logout(){
        localStorage.removeItem("login");
        localStorage.removeItem("curApart");
    }

    isLogin(){
        return localStorage.getObject("login") !== null
    }

    registerApart(name, address){
        let allAparts = this._getAllAparts();
        if(allAparts[name] !== undefined){
            return false
        }
        this.assignApartToUser(localStorage.getObject("login"), name);
        allAparts[name] = {"address" : address};
        localStorage.setObject("aparts", allAparts);
        return true;
    }

    getAddressOfCurApart(){
        const curApart = localStorage.getObject("curApart");
        if (curApart === null) return null;
        else return this._getAllAparts()[curApart].address
    }

    getApartsOfLoggedUser(){
        const login = localStorage.getObject("login");
        const usersToAparts = this._getAllUsersToAparts();
        return usersToAparts[login];
    }

    _getAllAparts(){
        return localStorage.getObject("aparts")
    }

    _getAllUsers(){
        return localStorage.getObject("users")
    }

    _getAllUsersToAparts(){
        return localStorage.getObject("usersToAparts");
    }

    _getAllTodos(){
        return localStorage.getObject("todos");
    }

    existsUser(username){
        let users = this._getAllUsers();
        return users[username] !== undefined;

    }

    assignApartToUser(username, apartname){
        let usersToAparts = this._getAllUsersToAparts();
        let userAparts = usersToAparts[username];
        if(!userAparts.includes(apartname)){
            userAparts.push(apartname);
            localStorage.setObject("usersToAparts", usersToAparts)
        }
    }

    getAddress(apartment){
        return this._getAllAparts()[apartment].address;
    }

    createNewTodoCard(author, apart, content){
        const newCard = {"apart" : apart, "author" : author, "text" : content};
        let todos = this._getAllTodos();
        todos.push(newCard);
        localStorage.setObject("todos", todos);
    }

    getTodosInApart(apartment){
        return this._getAllTodos().filter(function(todo){
           return todo.apart === apartment;
        });
    }
}