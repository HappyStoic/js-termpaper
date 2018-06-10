import FakeDatabase from "../database";
export {showMap, hideMap}

const db = new FakeDatabase();
let mapLoadedAlready = false; // Initial variable to describe state
let mapForApart = null;  // If curApart is different -> I need to reload map
const defaultCoords = {x: 14.41790, y: 50.12655}; // Coords for center of Prague

function showMap(){
    if(!mapLoadedAlready || mapForApart !== getCurApartment()){
        initMap();
    } else {
        $('#map').show();
    }
}

function initMap(){
    const curAddress = db.getAddressOfCurApart();
    if(curAddress === null) {
        Loader.async = true;
        Loader.load(null, null, createMap(defaultCoords));
        return;
    }

    new SMap.Geocoder(curAddress, response);
}

function createMap(coords){
    $('#map').show();

    const center = SMap.Coords.fromWGS84(coords.x, coords.y);
    const m = new SMap(JAK.gel("map"), center, 13);

    m.addControl(new SMap.Control.Sync({bottomSpace:0}));
    m.addDefaultControls();
    m.addDefaultLayer(SMap.DEF_BASE).enable();

    // If I'm showing valid user address, I add mark pointer on the map
    if(coords !== defaultCoords){
        const layer = new SMap.Layer.Marker();
        m.addLayer(layer);
        layer.enable();

        const options = {};
        const marker = new SMap.Marker(center, "Address", options);
        layer.addMarker(marker);
    }

    mapLoadedAlready  = true;
    mapForApart = getCurApartment();
}

function response(geocoder) {
    if (!geocoder.getResults()[0].results.length) {
        alert("Not valid address. Showing Prague.");
        Loader.async = true;
        Loader.load(null, null, createMap(defaultCoords));
        return;
    }
    try{
        let res = geocoder.getResults()[0].results;
        let resultCoords;

        let data = [];
        const item = res.shift();
        resultCoords = {x: item.coords.x, y: item.coords.y};
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

function getCurApartment(){
    return localStorage.getObject("curApart");
}

function hideMap(){
    $('#map').hide();
}