import FakeDatabase from "../database";

export {showTable}

const db = new FakeDatabase();

//**
//* File handling form which allows user to choose apartment he wants to adjust or to show form to create a new apartment.
//* Always only one form of these is visible (!!!)
//**

function addTableRecord(name, address){
    const lineHtml = "<tr>\n" +
        "                    <td>" + name + "</td>\n" +
        "                    <td>" + address + "</td>\n" +
        "                </tr>";
    $('#apartTable').append(lineHtml);
}

// Show table with all apartments which are linked with logged user
function showTable(){
    $('#apartTable').html("");
    const allAparts = db.getApartsOfLoggedUser();

    allAparts.forEach((apartName) => {
        addTableRecord(apartName, db.getAddress(apartName))
    });
    $('#changeAppart').show();
}

$('#createAppartBut').on("click", () => {
    $('#changeAppart').hide();
    $('#createAppart').show();
});

$('#backToTable').on("click", () => {
    $('#createAppart').hide();
    showTable();
});


// Creating new apartment.
$('#submitApart').on("click", () => {
    const name = $('#apartname').val().trim();
    const address = $('#apartaddress').val().trim();
    if(name === "" || address === ""){
        $('#errorCreatingApart').text("All fields must be filled.")
    }

    if(db.registerApart(name, address)){
        showTable();
        $('#createAppart').hide();
    } else {
        $('#errorCreatingApart').text("Apartement with such name already exists.")
    }
});

// Choosing current apartment from table
$('#apartTable').on("click", (e) => {
    const clickedName = $(e.target).parent().children().get(0).innerText;
    localStorage.setObject("curApart", clickedName);
    $('#changeAppart').hide();
    $('#curApartBar').text(clickedName);
});
