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
        localStorage.setObject("users", emptyObject);
        localStorage.setObject("aparts", emptyObject);
        localStorage.setObject("usersToAparts", emptyObject);
        localStorage.setObject("todos", emptyObject);
    }

    registerUser(name, password){
        let users = this._getAllUsers();
        if(users[name] !== undefined) {
            return false;
        }
        users[name] = {'password' : password};
        localStorage.setObject("users", users);
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
        allAparts[name] = {"address" : address};
        localStorage.setObject("aparts", allAparts);
        return true;
    }

    getAddressOfCurApart(){
        const curApart = localStorage.getObject("curApart");
        if (curApart === null) return null;
        else return this._getAllAparts()[curApart].address
    }

    _getAllAparts(){
        return localStorage.getObject("aparts")
    }

    _getAllUsers(){
        return localStorage.getObject("users")
    }

    addApartToUser(){

    }


}