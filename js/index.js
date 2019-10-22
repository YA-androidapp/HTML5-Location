    var map = L.map("map");
    //offline baselayer, will use offline source if available
    var baseLayer = L.tileLayer
        .offline("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "Map data {attribution.OpenStreetMap}",
            subdomains: "abc",
            minZoom: 13
        })
        .addTo(map);
    //add buttons to save tiles in area viewed
    var control = L.control.savetiles(baseLayer, {
        zoomlevels: [13, 16], //optional zoomlevels to save, default current zoomlevel
        confirm: function (layer, succescallback) {
            if (window.confirm("Save " + layer._tilesforSave.length)) {
                succescallback();
            }
        },
        confirmRemoval: function (layer, successCallback) {
            if (window.confirm("Remove all the tiles?")) {
                successCallback();
            }
        },
        saveText: '<i class="fa fa-download" aria-hidden="true" title="Save tiles"></i>',
        rmText: '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>'
    });
    control.addTo(map);
    document
        .getElementById("remove_tiles")
        .addEventListener("click", function (e) {
            control._rmTiles();
        });
    baseLayer.on("storagesize", function (e) {
        document.getElementById("storage").innerHTML = e.storagesize;
    });

    //events while saving a tile layer
    var progress;
    baseLayer.on("savestart", function (e) {
        progress = 0;
        document.getElementById("total").innerHTML = e._tilesforSave.length;
    });
    baseLayer.on("savetileend", function (e) {
        progress++;
        document.getElementById("progress").innerHTML = progress;
    });
    baseLayer.on("loadend", function (e) {
        alert("Saved all tiles");
    });
    baseLayer.on("tilesremoved", function (e) {
        alert("Removed all tiles");
    });

    map.setView({
            lat: 35.681236,
            lng: 139.767125
        },
        16
    );
    //layer switcher control
    L.control
        .layers({
            "osm (offline)": baseLayer
        })
        .addTo(map);