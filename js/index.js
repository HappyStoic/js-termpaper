window.location.hash = '#intro';

function showErrorUnderSignIn(text){
    $('#errorSignIn').text(text);
}

function showErrorUnderSignUp(text){
    $('#errorSignUp').text(text);
}

function signInButtonClicked(){
    const username = $('#usernameLogin').val();
    const password = $('#passwordLogin').val();


    //TODO error all fields must be filled
    showErrorUnderSignIn("Error clicking on button sign in")
}

function signUpButtonClicked(){
    const username = $('#usernameRegister').val();
    const password1 = $('#passwordRegister1').val();
    const password2 = $('#passwordRegister2').val();

    if(password1 !== password2){
        showErrorUnderSignUp("Provided passwords are not the same.");
        return;
    }

    showErrorUnderSignUp("Error clicking on button sign up");
}

$('#signInButton').on("click", () => signInButtonClicked());
$('#signUpButton').on("click", () => signUpButtonClicked());