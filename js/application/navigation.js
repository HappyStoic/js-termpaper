import FakeDatabase from "../database";
import {showTable} from "./apartementsControl";
import {hideMap, showMap} from "./map";

const db = new FakeDatabase();

$('#logoutBut').on("click", () => {
    db.logout();
});

$('#changeAppartBut').on("click", () => {
    hideMap();
    showTable();
});

$('#map-button').on("click", () => {
   showMap();
});

// $('#curApartBar').popover({trigger: 'manual'}).on('hover', showPop());
//
// function showPop(){
//     if ($('#curApartBar').data('state') === 'hover') {
//         $('#curApartBar').popover('show');
//     }
// }


