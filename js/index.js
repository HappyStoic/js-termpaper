import FakeDatabase from './database';

(function(){
    const database = new FakeDatabase();

    if(database.isLogin()){
        window.location.replace("application.html");
    } else {
        window.location.hash = '#intro';
    }

    function showErrorUnderSignIn(text){
        $('#errorSignIn').text(text);
    }

    function showErrorUnderSignUp(text){
        $('#errorSignUp').text(text);
    }

    $('#signInButton').on("click", () => signInButtonClicked());
    $('#signUpButton').on("click", () => signUpButtonClicked());

    function signInButtonClicked(){
        const username = $('#usernameLogin').val().trim();
        const password = $('#passwordLogin').val().trim();

        if(username === "" || password === ""){
            showErrorUnderSignIn("All fields must be filled.");

        } else if(!database.loginUser(username, password)){
            showErrorUnderSignIn("Input wrong username or password.");

        } else {
            window.location.replace("application.html");
        }
    }

    function signUpButtonClicked(){
        const username = $('#usernameRegister').val().trim();
        const password1 = $('#passwordRegister1').val().trim();
        const password2 = $('#passwordRegister2').val().trim();

        if(username === "" || password1 === "" || password2 === ""){
            showErrorUnderSignUp("All fields must be filled.");
            return;
        }
        if(password1 !== password2){
            showErrorUnderSignUp("Provided passwords are not the same.");
            return;
        }
        if(database.registerUser(username, password1)){
            window.location.hash = '#signinPart'
        } else {
            showErrorUnderSignUp("Username already exists.");
        }
    }
})();