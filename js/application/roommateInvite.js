import FakeDatabase from "../database";

export {showInvite, hideInvite}

const db = new FakeDatabase();

function showInvite(){
    $('#inviteRoommate-layout').show();
}

function hideInvite(){
    $('#inviteRoommate-layout').hide();
}

$('#addRoommateConfirm').on("click", () => {
    const roommateName = $('#roommateName').val().trim();

    if(roommateName === ""){
        $('#errorInvitingRoommate').text("Field must be filled.")
    } else if (!db.existsUser(roommateName)){
        $('#errorInvitingRoommate').text("Such user does not exist.")
    } else {
        db.assignApartToUser(roommateName, localStorage.getObject("curApart"));
        hideInvite();
    }
});