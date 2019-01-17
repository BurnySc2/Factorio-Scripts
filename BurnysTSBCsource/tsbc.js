"use strict";
// Automatically convert typescript file to javascript on save using task watcher in VScode:
// https://stackoverflow.com/questions/29996145/visual-studio-code-compile-on-save
// Minify output javascript
// https://www.minifier.org/
// Minify HTML
// (better:) http://minifycode.com/html-minifier/
// or
// https://www.willpeavy.com/minifier/
// Elements that are visible when a certain "blueprint type" is selected
let changeVisibilityElements = ["rowsequential", "stationname", "rowtraintype", "rowinsertertype", "rowchesttype", "rowbelttype", "rowrefill", "rowfluidside", "rowgreenwire", "rowredwire", "rowlamps", "rowstacker", "rowtrainstopcondition"];
let elementsInLoading = new Set(["rowsequential", "stationname", "rowtraintype", "rowinsertertype", "rowchesttype", "rowbelttype", "rowrefill", "rowgreenwire", "rowredwire", "rowlamps", "rowtrainstopcondition"]);
let elementsInUnloading = new Set(["rowsequential", "stationname", "rowtraintype", "rowinsertertype", "rowchesttype", "rowbelttype", "rowrefill", "rowgreenwire", "rowredwire", "rowlamps", "rowtrainstopcondition"]);
let elementsInFluidLoading = new Set(["rowsequential", "stationname", "rowfluidside", "rowtraintype", "rowrefill", "rowgreenwire", "rowredwire", "rowlamps", "rowtrainstopcondition"]);
let elementsInFluidUnloading = new Set(["rowsequential", "stationname", "rowfluidside", "rowtraintype", "rowrefill", "rowgreenwire", "rowredwire", "rowlamps", "rowtrainstopcondition"]);
let elementsInStacker = new Set(["rowtraintype", "rowstacker"]);
let blueprinttypeDict = {
    "loading": elementsInLoading,
    "unloading": elementsInUnloading,
    "fluidloading": elementsInFluidLoading,
    "fluidunloading": elementsInFluidUnloading,
    "stacker": elementsInStacker
};
window.onload = function () {
    // let websiteArgs = window.location.href.split("?")
    // if (websiteArgs.length > 1) {
    //     let params = websiteArgs[1].split("&")
    //     let paramsValue: any = {}
    //     params.forEach(element => {
    //         let keyValue = element.split("=")
    //         if (keyValue.length == 2) {
    //             paramsValue[keyValue[0]] = keyValue[1]
    //         }
    //     });
    //     console.log(params);
    //     console.log(paramsValue);          
    // }
    updateVisibility();
    updateVisibilityRequesterChest();
    updateVisibilityFilters();
    updateVisibilitySequential();
};
function updateVisibility() {
    // This function is called when "blueprint type" is changed - this means it hides certain rows and only shows those that affect the blueprint outcome, e.g. there are no inserters for a stacker
    let blueprinttypeElement = document.getElementById("blueprinttype");
    let selectedOption = blueprinttypeElement.selectedOptions[0].value;
    let selectedSet = blueprinttypeDict[selectedOption];
    for (let elementId of changeVisibilityElements) {
        let element = document.getElementById(elementId);
        if (selectedSet.has(elementId)) {
            element.classList.remove("hidden");
        }
        else {
            element.classList.add("hidden");
        }
    }
}
function updateVisibilityBeltsOptions() {
    let beltsEnabledElement = document.getElementById("beltsenabled");
    let beltsEnabled = beltsEnabledElement.checked;
    let elementsToHide = ["belttypetooltip", "sidetobeusedtooltip", "beltflowdirectiontooltip", "belttype", "sidetobeused", "beltflowdirection"];
    elementsToHide.forEach(id => {
        let element = document.getElementById(id);
        if (beltsEnabled) {
            element.classList.remove("hidden");
        }
        else {
            element.classList.add("hidden");
        }
    });
}
function updateVisibilityRequesterChest() {
    // This function shows / hides the requester chests, because there can be 12 entries
    let chestTypeElement = document.getElementById("chesttype");
    let chestType = chestTypeElement.value;
    let maxVisible = 0;
    if (["logistic-chest-requester", "logistic-chest-buffer"].indexOf(chestType) > -1) {
        maxVisible = 1;
    }
    for (let i = 1; i <= 12; i++) {
        let requestItemElementName = "request" + i.toString() + "item";
        let requestItemElement = document.getElementById(requestItemElementName);
        if (requestItemElement.value !== "") {
            maxVisible = i + 1;
        }
    }
    for (let i = 1; i <= 12; i++) {
        let requestItemElementName = "request" + i.toString() + "item";
        let requestAmountElementName = "request" + i.toString() + "amount";
        let requestItemElement = document.getElementById(requestItemElementName);
        let requestAmountElement = document.getElementById(requestAmountElementName);
        if (i <= maxVisible) {
            requestItemElement.classList.remove("hidden");
            requestAmountElement.classList.remove("hidden");
        }
        else {
            requestItemElement.classList.add("hidden");
            requestAmountElement.classList.add("hidden");
        }
    }
}
function updateVisibilityFilters() {
    // This function shows / hides the filters from filter inserters, because there can be 5 entries and they dont need to be displayed if the filters arent active
    let filtersEnabledElement = document.getElementById("usefilters");
    let filtersEnabled = filtersEnabledElement.checked;
    let maxVisible = 0;
    if (filtersEnabled) {
        maxVisible = 1;
    }
    for (let i = 1; i <= 5; i++) {
        let filterXElementName = "filter" + i.toString();
        let filterXElement = document.getElementById(filterXElementName);
        if (filterXElement.value !== "") {
            maxVisible = i + 1;
        }
    }
    for (let i = 1; i <= 5; i++) {
        let filterXElementName = "filter" + i.toString();
        let filterXElement = document.getElementById(filterXElementName);
        if (i <= maxVisible) {
            filterXElement.classList.remove("hidden");
        }
        else {
            filterXElement.classList.add("hidden");
        }
    }
}
function updateVisibilitySequential() {
    let sequentialEnabledElement = document.getElementById("sequentialenabled");
    let elements = ["sequentialamount", "sequentialamounttooltip", "sequentialbeltsalltheway", "sequentialbeltsallthewaytooltip"];
    elements.forEach(elementId => {
        let element = document.getElementById(elementId);
        if (sequentialEnabledElement.checked) {
            element.classList.remove("hidden");
        }
        else {
            element.classList.add("hidden");
        }
    });
}
function copyToClipboard() {
    // The "copy to clipboard" button functionality
    let outputElement = document.getElementById("blueprintoutput");
    let copyclipboardbutton = document.getElementById("copyclipboardbutton");
    let text1 = "Copied!";
    let text2 = "It is already in clipboard!";
    if (copyclipboardbutton.getAttribute("download") === "") {
        if (outputElement.value !== text1 && outputElement.value !== text2) {
            outputElement.select();
            document.execCommand("copy");
            outputElement.value = text1;
        }
        else if (outputElement.value === text1) {
            outputElement.value = text2;
        }
        // Uncomment to unselect blueprint string after copying
        // outputElement.setSelectionRange(0, 0)
    }
    else {
        console.log("Starting download of blueprint string");
        // javascript download manager: http://danml.com/download.html
        download(copyclipboardbutton.getAttribute("download"), "blueprint_string.txt", "text/plain");
        copyclipboardbutton.setAttribute("download", "");
    }
}
function generateBlueprint() {
    // The "generate blueprint" button functionality
    let blueprinttypeElement = document.getElementById("blueprinttype");
    let selectedOption = blueprinttypeElement.selectedOptions[0].value;
    var blueprinttypeDict = {
        "loading": parseLoadingStation,
        "unloading": parseUnloadingStation,
        "fluidloading": parseFluidLoadingStation,
        "fluidunloading": parseFluidUnloadingStation,
        "stacker": parseStacker
    };
    // Check if sequential is enabled
    let sequentialEnabledElement = document.getElementById("sequentialenabled");
    let sequentialAmountElement = document.getElementById("sequentialamount");
    let sequentialAmount = parseFloat(sequentialAmountElement.value);
    let trainStopsAmount = 1;
    if (sequentialEnabledElement.checked && sequentialAmount > 1) {
        trainStopsAmount = sequentialAmount;
    }
    let generateFunction = blueprinttypeDict[selectedOption];
    console.time("Blueprint Generation Time");
    let blueprint = generateFunction(trainStopsAmount);
    console.timeEnd("Blueprint Generation Time");
    // This is the blueprint image that is being generated (up to 4 icons)
    let blueprintJson = { "blueprint": {
            "icons": [
                {
                    "signal": {
                        "type": "item",
                        "name": "train-stop"
                    },
                    "index": 1
                },
                {
                    "signal": {
                        "type": "item",
                        "name": "rail-signal"
                    },
                    "index": 2
                }
            ],
            "entities": blueprint,
            "item": "blueprint",
            "label": "BurnysTSBC",
            "version": 68722819072,
        } };
    // console.log(JSON.stringify(blueprintJson))
    console.time("Encoding Blueprint to Blueprint String");
    let base64blueprint = encode(blueprintJson);
    console.timeEnd("Encoding Blueprint to Blueprint String");
    console.time("Putting string in text box");
    let outputElement = document.getElementById("blueprintoutput");
    let copyclipboardbutton = document.getElementById("copyclipboardbutton");
    // if (base64blueprint.length < 10) {
    if (base64blueprint.length < 1000000) {
        outputElement.value = base64blueprint;
        copyclipboardbutton.setAttribute("download", "");
        copyclipboardbutton.innerText = "Copy to Clipboard";
    }
    else {
        outputElement.value = "Blueprint too big ... preparing download instead";
        copyclipboardbutton.setAttribute("download", base64blueprint);
        let sizeInMb = Math.round(base64blueprint.length / Math.pow(2, 20));
        copyclipboardbutton.innerText = "Download " + sizeInMb.toString() + " MB blueprint string";
    }
    console.timeEnd("Putting string in text box");
    // console.log(base64blueprint)
    // calculateAndOutputBlueprintInformation()
    // console.log(decode(base64blueprint))
    // console.log(JSON.stringify(decode(base64blueprint)))
}
function parseLoadingStation(trainStopsAmount) {
    console.log("Generating loading station");
    let blueprint = [];
    // createPolesLamps(blueprint)
    for (let trainStopIndex = 0; trainStopIndex < trainStopsAmount; trainStopIndex++) {
        createStationTracks(blueprint, trainStopIndex, trainStopsAmount);
        createRefuelChest(blueprint, trainStopIndex, trainStopsAmount);
        createChestsInserters(blueprint, trainStopIndex, true);
        createBeltLayout(blueprint, trainStopIndex, trainStopsAmount, true);
    }
    // createSplitters(blueprint)
    // createBelts(blueprint)
    return blueprint;
}
function parseUnloadingStation(trainStopsAmount) {
    console.log("Generating unloading station");
    let blueprint = [];
    for (let trainStopIndex = 0; trainStopIndex < trainStopsAmount; trainStopIndex++) {
        createStationTracks(blueprint, trainStopIndex, trainStopsAmount);
        createRefuelChest(blueprint, trainStopIndex, trainStopsAmount);
        createChestsInserters(blueprint, trainStopIndex, false);
        createBeltLayout(blueprint, trainStopIndex, trainStopsAmount, false);
    }
    return blueprint;
}
function parseFluidLoadingStation(trainStopsAmount) {
    console.log("Generating fluid loading station");
    let blueprint = [];
    for (let trainStopIndex = 0; trainStopIndex < trainStopsAmount; trainStopIndex++) {
        createStationTracks(blueprint, trainStopIndex, trainStopsAmount);
        createRefuelChest(blueprint, trainStopIndex, trainStopsAmount);
        createPumpsAndStorageTanks(blueprint, trainStopIndex, true);
    }
    return blueprint;
}
function parseFluidUnloadingStation(trainStopsAmount) {
    console.log("Generating fluid unloading station");
    let blueprint = [];
    for (let trainStopIndex = 0; trainStopIndex < trainStopsAmount; trainStopIndex++) {
        createStationTracks(blueprint, trainStopIndex, trainStopsAmount);
        createRefuelChest(blueprint, trainStopIndex, trainStopsAmount);
        createPumpsAndStorageTanks(blueprint, trainStopIndex, false);
    }
    return blueprint;
}
function parseStacker(trainStopsAmount) {
    console.log("Generating stacker");
    let blueprint = [];
    createStacker(blueprint);
    return blueprint;
}
function calculateAndOutputBlueprintInformation() {
    // TODO: export unloading / loading speeds about inserters from train and to belt
    console.log("Generating blueprint information");
}
function placeItem(bp, itemName, x, y, direction = 0) {
    // Inserts a new entity into blueprint
    let newEntry = {
        "entity_number": bp.length + 1,
        "name": itemName,
        "position": {
            "x": x,
            "y": y
        },
    };
    if (direction > 0) {
        newEntry.direction = direction;
    }
    bp.push(newEntry);
}
function placeTrainStop(bp, itemName, x, y, railSignals, trainStopsAmount) {
    // An extra function just to pass the station name and handle enabled-condition
    let stationNameElement = document.getElementById("stationname");
    let stationName = stationNameElement.value;
    let stationEnabledCondition = document.getElementById("trainstopconditionenabled").checked;
    let greenWire = document.getElementById("greenwire").checked;
    let redWire = document.getElementById("redwire").checked;
    let willPlaceDecider = stationEnabledCondition && (greenWire || redWire);
    let stationIsConditionEnabled = 0 < trainStopsAmount || willPlaceDecider;
    let newEntry = {};
    if (stationIsConditionEnabled) {
        newEntry = {
            "entity_number": bp.length + 1,
            "name": itemName,
            "position": {
                "x": x,
                "y": y
            },
        };
        if (stationName !== "" || trainStopsAmount > 1) {
            newEntry.station = stationName !== "" ? stationName : "TSBC-sequential-station";
        }
        newEntry.control_behavior = {
            "circuit_condition": {
                "first_signal": {
                    "type": "virtual",
                    "name": "signal-red"
                },
                "constant": 0,
                "comparator": ">"
            },
            "circuit_enable_disable": true,
        };
        if (!willPlaceDecider && 0 < railSignals.length) {
            newEntry.connections = {
                "1": {
                    "green": [
                        {
                            "entity_id": railSignals[railSignals.length - 1].entity_number
                        }
                    ]
                }
            };
            railSignals[railSignals.length - 1].control_behavior = {
                "circuit_read_signal": true
            };
            railSignals[railSignals.length - 1].connections = {
                "1": {
                    "green": [
                        {
                            "entity_id": newEntry.entity_number
                        }
                    ]
                }
            };
        }
        else if (willPlaceDecider) {
            // Dont have to initialize connection to decider because the decider will handle that part
        }
    }
    else {
        newEntry = {
            "entity_number": bp.length + 1,
            "name": itemName,
            "position": {
                "x": x,
                "y": y
            },
        };
        if (stationName !== "") {
            newEntry.station = stationName;
        }
    }
    bp.push(newEntry);
}
function placeDecider(bp, itemName, x, y, direction) {
    let stationEnabledCondition = document.getElementById("trainstopconditionenabled").checked;
    let greenWire = document.getElementById("greenwire").checked;
    let redWire = document.getElementById("redwire").checked;
    let willPlaceDecider = stationEnabledCondition && (greenWire || redWire);
    if (!willPlaceDecider) {
        return;
    }
    let comparatorType = document.getElementById("trainstopconditioncomparator").selectedOptions[0].value;
    let trainStopConditionAmount = parseFloat(document.getElementById("trainstopconditionamount").value);
    let trainStop = bp[bp.length - 1];
    let newEntry = {
        "entity_number": bp.length + 1,
        "name": "decider-combinator",
        "position": {
            "x": x,
            "y": y
        },
        "control_behavior": {
            "decider_conditions": {
                "first_signal": {
                    "type": "virtual",
                    "name": comparatorType === ">" ? "signal-anything" : "signal-everything"
                },
                "constant": trainStopConditionAmount,
                "comparator": comparatorType,
                // Do NOT allow custom output signal setting because it would get too complicated for the html display
                "output_signal": {
                    "type": "virtual",
                    "name": "signal-red"
                },
                "copy_count_from_input": false
            }
        },
        // Connection to the train stop
        "connections": {
            "2": {}
        }
    };
    trainStop.connections = {
        "1": {}
    };
    if (greenWire) {
        newEntry.connections["2"]["green"] = [{ "entity_id": trainStop.entity_number }];
        trainStop.connections["1"]["green"] = [{ "entity_id": newEntry.entity_number }];
    }
    if (redWire && !greenWire) {
        newEntry.connections["2"]["red"] = [{ "entity_id": trainStop.entity_number }];
        trainStop.connections["1"]["red"] = [{ "entity_id": newEntry.entity_number }];
    }
    bp.push(newEntry);
}
function connectWireWithDecider(bp, rightChests, leftChests, trainStopIndex) {
    let stationEnabledCondition = document.getElementById("trainstopconditionenabled").checked;
    let greenWire = document.getElementById("greenwire").checked;
    let redWire = document.getElementById("redwire").checked;
    let willPlaceDecider = stationEnabledCondition && (greenWire || redWire);
    if (!willPlaceDecider) {
        return;
    }
    let placeRightSide = shouldPlaceRightSide();
    let placeLeftSide = shouldPlaceLeftSide();
    let polesLeft = [];
    let polesRight = [];
    let deciders = [];
    bp.forEach(entity => {
        if (entity.name === "medium-electric-pole") {
            if (0 < entity.position.x) {
                polesRight.push(entity);
            }
            else {
                polesLeft.push(entity);
            }
        }
        else if (entity.name === "decider-combinator") {
            deciders.push(entity);
        }
    });
    // Sort by y-coordinate, ascending
    let decider = deciders[trainStopIndex];
    polesLeft.sort(compareY);
    polesRight.sort(compareY);
    rightChests.sort(compareY);
    leftChests.sort(compareY);
    let polesCorrectSide = polesRight;
    let firstChest = rightChests[0];
    if (!placeRightSide) {
        firstChest = leftChests[0];
        polesCorrectSide = polesLeft;
    }
    let previousPole = undefined;
    // Only use one side of the poles to form connection between chest and decider
    polesCorrectSide.forEach(pole => {
        if (firstChest.position.y < pole.position.y) {
            if (greenWire) {
                connectTwoItemsWithWire(previousPole, firstChest, "green");
            }
            if (redWire && !greenWire) {
                connectTwoItemsWithWire(previousPole, firstChest, "red");
            }
            // break the foreach loop
            return;
        }
        if (decider.position.y < pole.position.y) {
            if (previousPole === undefined) {
                if (greenWire) {
                    connectTwoItemsWithWire(decider, pole, "green");
                }
                if (redWire && !greenWire) {
                    connectTwoItemsWithWire(decider, pole, "red");
                }
            }
            else {
                if (greenWire) {
                    connectTwoItemsWithWire(pole, previousPole, "green");
                }
                if (redWire && !greenWire) {
                    connectTwoItemsWithWire(pole, previousPole, "red");
                }
            }
            previousPole = pole;
        }
    });
}
function placeInserter(bp, itemName, x, y, direction, filters) {
    // Inserts a new entity into blueprint
    let newEntry = {};
    newEntry = {
        "entity_number": bp.length + 1,
        "name": itemName,
        "position": {
            "x": x,
            "y": y
        },
    };
    if (filters.length > 0) {
        newEntry.filters = filters;
    }
    if (direction > 0) {
        newEntry.direction = direction;
    }
    bp.push(newEntry);
}
function getRequesterChestRequester(itemName, itemAmount, index = 1) {
    return {
        "index": index,
        "name": itemName,
        "count": itemAmount > 0 ? itemAmount : 1,
    };
}
function placeRefuelChest(bp, itemName, x, y) {
    let fuelTypeElement = document.getElementById("fueltype");
    let fuelTypeAmountElement = document.getElementById("refillamount");
    let fuelType = fuelTypeElement.value;
    let fuelTypeAmount = Math.max(0, parseFloat(fuelTypeAmountElement.value));
    let newEntry = {
        "entity_number": bp.length + 1,
        "name": itemName,
        "position": {
            "x": x,
            "y": y
        },
        "request_filters": [getRequesterChestRequester(fuelType, fuelTypeAmount)]
    };
    bp.push(newEntry);
}
function placeChest(bp, itemName, x, y, requests, limit = -1, greenWire = false, redWire = false, orientation = 0) {
    // Inserts a new entity into blueprint
    let newEntry = {
        "entity_number": bp.length + 1,
        "name": itemName,
        "position": {
            "x": x,
            "y": y
        },
    };
    // Trying to minimize blueprint json by only optionally adding these items to object
    if (greenWire || redWire) {
        let connections = [{}];
        if (greenWire) {
            connections[0].green = [];
        }
        if (redWire) {
            connections[0].red = [];
        }
        newEntry.connections = connections;
    }
    if (requests.length > 0) {
        newEntry.request_filters = requests;
    }
    if (limit > -1) {
        newEntry.bar = limit;
    }
    if (orientation > 0) {
        newEntry.direction = orientation;
    }
    bp.push(newEntry);
}
function getTrainLength(correctOddValue = false) {
    const locomotive_length = 6;
    const cargo_length = 6;
    const space_between_trains = 1;
    let locos = parseFloat(document.getElementById("amountlocomotives").value);
    let cargos = parseFloat(document.getElementById("amountcargowagons").value);
    let doubleHeaded = document.getElementById("traintype").checked;
    let locosTotal = doubleHeaded ? locos * 2 : locos;
    let totalLength = locosTotal * locomotive_length + cargos * cargo_length + space_between_trains * (locosTotal + cargos - 1);
    if (correctOddValue) {
        return totalLength + totalLength % 2;
    }
    return totalLength;
}
function getYoffset(trainStopIndex) {
    let doubleHeaded = document.getElementById("traintype").checked;
    let doubleHeadedSubtract = doubleHeaded ? -2 : 0;
    return trainStopIndex * (getTrainLength(true) + 6 + doubleHeadedSubtract);
}
function shouldPlaceRightSide() {
    let stationTypeElement = document.getElementById("blueprinttype");
    let stationType = stationTypeElement.selectedOptions[0].value;
    let sideUsed = document.getElementById("sidetobeused").selectedOptions[0].value;
    let fluidSideUsed = document.getElementById("fluidsidetobeused").selectedOptions[0].value;
    let placeRightSide = (["loading", "unloading"].indexOf(stationType) > -1 && ["right", "both"].indexOf(sideUsed) > -1 || ["fluidloading", "fluidunloading"].indexOf(stationType) > -1 && ["right"].indexOf(fluidSideUsed) > -1);
    return placeRightSide;
}
function shouldPlaceLeftSide() {
    let stationTypeElement = document.getElementById("blueprinttype");
    let stationType = stationTypeElement.selectedOptions[0].value;
    let sideUsed = document.getElementById("sidetobeused").selectedOptions[0].value;
    let fluidSideUsed = document.getElementById("fluidsidetobeused").selectedOptions[0].value;
    let placeLeftSide = (["loading", "unloading"].indexOf(stationType) > -1 && ["left", "both"].indexOf(sideUsed) > -1 || ["fluidloading", "fluidunloading"].indexOf(stationType) > -1 && ["left"].indexOf(fluidSideUsed) > -1);
    return placeLeftSide;
}
function createStationTracks(bp, trainStopIndex, trainStopsAmount) {
    // Places train tracks start at north (with station) going towards south
    const rail_size = 2;
    let offsetY = getYoffset(trainStopIndex);
    // Place rails
    let doubleHeaded = document.getElementById("traintype").checked;
    // let doubleHeadedInt = doubleHeaded ? 2 : 0
    let trainLength = getTrainLength();
    let startTrainTracksOffset = trainStopsAmount > 1 || !doubleHeaded ? -2 : 0;
    for (let i = -2 + startTrainTracksOffset; i < trainLength + 2; i += rail_size) {
        placeItem(bp, "straight-rail", -0.5, i + offsetY);
    }
    let railSignals = [];
    // Put signals
    if (trainStopsAmount > 1) {
        // For sequential stations
        // Place front signal - is chain signal if its the first train station, else normal signal
        if (trainStopIndex === 0) {
            placeItem(bp, "rail-chain-signal", 1.5, -4.5, 4);
        }
        else {
            placeItem(bp, "rail-signal", 1.5, -4.5 + offsetY, 4);
            railSignals.push(bp[bp.length - 1]);
        }
        // If its the last train station, place a signal at the back
        if (trainStopIndex === trainStopsAmount - 1) {
            placeItem(bp, "rail-signal", 1.5, trainLength + offsetY, 4);
        }
    }
    else {
        // For non sequential stations
        placeItem(bp, "rail-signal", 1.5, trainLength, 4);
        if (doubleHeaded) {
            placeItem(bp, "rail-chain-signal", -1.5, trainLength, 0);
        }
        else {
            placeItem(bp, "rail-chain-signal", 1.5, -4.5, 4);
        }
    }
    // Place train stop
    placeTrainStop(bp, "train-stop", 1.5, -2.5 + offsetY, railSignals, trainStopsAmount);
    placeDecider(bp, "decider-combinator", 1.5, 2 + offsetY, 0);
    let lampnearpoles = document.getElementById("lampnearpoles").checked;
    let placeRightSide = shouldPlaceRightSide();
    let placeLeftSide = shouldPlaceLeftSide();
    // Place more poles to connect the sequential stations
    if (trainStopIndex > 0) {
        // Double headed trains need an extra pole
        if (placeRightSide) {
            placeItem(bp, "medium-electric-pole", 1.5, -0.5 + offsetY);
            if (lampnearpoles) {
                placeItem(bp, "small-lamp", 2.5, -0.5 + offsetY);
            }
            if (doubleHeaded) {
                placeItem(bp, "medium-electric-pole", 1.5, -6.5 + offsetY);
                if (lampnearpoles) {
                    placeItem(bp, "small-lamp", 2.5, -6.5 + offsetY);
                }
            }
        }
        if (placeLeftSide) {
            placeItem(bp, "medium-electric-pole", -1.5, -0.5 + offsetY);
            if (lampnearpoles) {
                placeItem(bp, "small-lamp", -2.5, -0.5 + offsetY);
            }
            if (doubleHeaded) {
                placeItem(bp, "medium-electric-pole", -1.5, -6.5 + offsetY);
                if (lampnearpoles) {
                    placeItem(bp, "small-lamp", -2.5, -6.5 + offsetY);
                }
            }
        }
    }
}
function createRefuelChest(bp, trainStopIndex, trainStopsAmount) {
    let refillBoolean = document.getElementById("refill").checked;
    let offsetY = getYoffset(trainStopIndex);
    const locomotive_length = 6;
    const cargo_length = 6;
    const space_between_trains = 1;
    let trainLength = getTrainLength();
    let placedRefuelChestsTop = 0;
    let placedRefuelChestsBottom = 0;
    let locos = parseFloat(document.getElementById("amountlocomotives").value);
    let cargos = parseFloat(document.getElementById("amountcargowagons").value);
    let doubleHeaded = document.getElementById("traintype").checked;
    let lampnearpoles = document.getElementById("lampnearpoles").checked;
    let stationEnabledCondition = document.getElementById("trainstopconditionenabled").checked;
    // Create offset if "left" side was chosen instead of "right" or "both" (right side will be prefered in "both" case) - this will change the position of the refill chest and inserters
    let leftSideInserterOffset = 0;
    let leftSideChestOffset = 0;
    let leftSideDirection = 0;
    if (!shouldPlaceRightSide()) {
        leftSideInserterOffset = -3;
        leftSideChestOffset = -5;
        leftSideDirection = 4;
    }
    const pole_lamp_distance_from_tracks = 0;
    let startOffset = -2;
    let endOffset = -3;
    // Which side the poles are used is based on the station type and its side used
    // e.g. loading + right side used
    // e.g. fluid unloading + right fluid side used
    let placeRightSide = shouldPlaceRightSide();
    let placeLeftSide = shouldPlaceLeftSide();
    // This condition figures out if we only use the top side for poles
    // - refuel at station is enabled
    // - station enabled-condition is enabled and its not the first station
    // - station enabled-condition is enabled
    let polesTopUsed = refillBoolean || 1 < trainStopsAmount && 1 < trainStopIndex || stationEnabledCondition;
    let refuelInsertersTopUsed = refillBoolean;
    // This condition figures out if we also use the bottom side for poles
    // - refuel at station is enabled and train is double headed
    // - station enabled-condition is enabled and its a sequence station and its not the last train
    let polesBottomUsed = refillBoolean && doubleHeaded || stationEnabledCondition && trainStopIndex !== trainStopsAmount;
    let refuelInsertersBottomUsed = refillBoolean && doubleHeaded;
    // Place TOP side inserter + refuel chest + poles
    for (let i = startOffset; i < locos * (locomotive_length + space_between_trains) + endOffset; i++) {
        if ((i + 4) % 7 == 0) {
            if (placedRefuelChestsTop < locos) {
                // Place inserter and logistic chest for refueling
                if (refuelInsertersTopUsed) {
                    placeItem(bp, "inserter", 1.5 + leftSideInserterOffset, i + 0.5 + offsetY, (2 + leftSideDirection) % 8);
                    placeRefuelChest(bp, "logistic-chest-requester", 2.5 + leftSideChestOffset, i + 0.5 + offsetY);
                }
                // If station is right (or both) sided, place poles and lamp on right (or both) side
                if (placeRightSide && polesTopUsed) {
                    if (placedRefuelChestsTop < locos - 1 || cargos == 0) {
                        placeItem(bp, "medium-electric-pole", 1.5 + pole_lamp_distance_from_tracks, i + 1.5 + offsetY);
                        if (lampnearpoles) {
                            placeItem(bp, "small-lamp", 2.5 + pole_lamp_distance_from_tracks, i + 1.5 + offsetY);
                        }
                    }
                }
                // If station is left (or both) sided, place poles and lamp on left (or both) side
                if (placeLeftSide && polesTopUsed) {
                    if (placedRefuelChestsTop < locos - 1) {
                        placeItem(bp, "medium-electric-pole", -1.5 - pole_lamp_distance_from_tracks, i + 1.5 + offsetY);
                        if (lampnearpoles) {
                            placeItem(bp, "small-lamp", -2.5 - pole_lamp_distance_from_tracks, i + 1.5 + offsetY);
                        }
                    }
                }
            }
            placedRefuelChestsTop += 1;
        }
    }
    if (polesBottomUsed || refuelInsertersBottomUsed) {
        for (let i = startOffset + (locos + cargos) * (cargo_length + space_between_trains); i < trainLength + cargo_length; i++) {
            if ((i + 2) % 7 == 0) {
                if (placedRefuelChestsBottom < locos) {
                    if (refuelInsertersBottomUsed) {
                        placeItem(bp, "inserter", 1.5 + leftSideInserterOffset, i + 0.5 + offsetY, (2 + leftSideDirection) % 8);
                        placeRefuelChest(bp, "logistic-chest-requester", 2.5 + leftSideChestOffset, i + 0.5 + offsetY);
                    }
                    // If station is right (or both) sided, place poles and lamp on right (or both) side
                    if (placeRightSide && polesBottomUsed) {
                        if (placedRefuelChestsBottom < locos - 1) {
                            placeItem(bp, "medium-electric-pole", 1.5 + pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
                            if (lampnearpoles) {
                                placeItem(bp, "small-lamp", 2.5 + pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
                            }
                        }
                    }
                    // If station is left (or both) sided, place poles and lamp on left (or both) side
                    if (placeLeftSide && polesBottomUsed) {
                        if (placedRefuelChestsBottom < locos - 1) {
                            placeItem(bp, "medium-electric-pole", -1.5 - pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
                            if (lampnearpoles) {
                                placeItem(bp, "small-lamp", -2.5 - pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
                            }
                        }
                    }
                }
                placedRefuelChestsBottom += 1;
            }
        }
    }
}
function createChestsInserters(bp, trainStopIndex, loading = true) {
    const locomotive_length = 6;
    const cargo_length = 6;
    const space_between_trains = 1;
    let offsetY = getYoffset(trainStopIndex);
    let locos = parseFloat(document.getElementById("amountlocomotives").value);
    let cargos = parseFloat(document.getElementById("amountcargowagons").value);
    let doubleHeaded = document.getElementById("traintype").checked;
    let doubleHeadedInt = doubleHeaded ? 1 : 0;
    let lampnearpoles = document.getElementById("lampnearpoles").checked;
    let locosTotal = doubleHeaded ? locos * 2 : locos;
    let inserterType = document.getElementById("insertertype").selectedOptions[0].value;
    let useFiltersElement = document.getElementById("usefilters");
    let useFilters = useFiltersElement.checked;
    let filterInserters = {
        "inserter": "filter-inserter",
        "fast-inserter": "filter-inserter",
        "stack-inserter": "filter-inserter",
    };
    if (useFilters) {
        inserterType = filterInserters[inserterType];
    }
    let beltsEnabled = document.getElementById("beltsenabled").checked;
    let greenWire = document.getElementById("greenwire").checked;
    let redWire = document.getElementById("redwire").checked;
    let chestType = document.getElementById("chesttype").selectedOptions[0].value;
    let chestlimit = parseFloat(document.getElementById("chestlimit").value);
    let trainLength = getTrainLength();
    let orientation4 = loading ? 0 : 4;
    const pole_lamp_distance_from_tracks = 0;
    let filters = [];
    if (useFilters) {
        for (let i = 1; i <= 5; i++) {
            let thisFilterElement = document.getElementById("filter" + i.toString());
            let thisFilter = thisFilterElement.value;
            if (thisFilter !== "") {
                filters.push({
                    "index": i,
                    "name": thisFilter,
                });
            }
        }
    }
    let requests = [];
    if (["logistic-chest-requester", "logistic-chest-buffer"].indexOf(chestType) > -1) {
        for (let i = 1; i <= 12; i++) {
            let requestItemElementName = "request" + i.toString() + "item";
            let requestAmountElementName = "request" + i.toString() + "amount";
            let requestItemElement = document.getElementById(requestItemElementName);
            let requestAmountElement = document.getElementById(requestAmountElementName);
            let requestItem = requestItemElement.value;
            let requestAmount = parseFloat(requestAmountElement.value);
            if (requestItem !== "" && requestAmount > 0) {
                let newEntry = getRequesterChestRequester(requestItem, requestAmount, i);
                requests.push(newEntry);
            }
        }
    }
    let startOffset = -2 + locos * (locomotive_length + space_between_trains);
    let endOffset = -3 - (locos * doubleHeadedInt) * (locomotive_length + space_between_trains);
    let rightChests = [];
    let leftChests = [];
    let useRightSide = shouldPlaceRightSide();
    let useLeftSide = shouldPlaceLeftSide();
    for (let i = 0 + startOffset; i < trainLength + endOffset; i += cargo_length + space_between_trains) {
        if (useRightSide) {
            if (i == startOffset) {
                placeItem(bp, "medium-electric-pole", 1.5 + pole_lamp_distance_from_tracks, i - 0.5 + offsetY);
                if (lampnearpoles) {
                    placeItem(bp, "small-lamp", 2.5 + pole_lamp_distance_from_tracks, i - 0.5 + offsetY);
                }
            }
            placeItem(bp, "medium-electric-pole", 1.5 + pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
            if (lampnearpoles) {
                placeItem(bp, "small-lamp", 2.5 + pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
            }
        }
        if (useLeftSide) {
            if (i == startOffset) {
                placeItem(bp, "medium-electric-pole", -1.5 - pole_lamp_distance_from_tracks, i - 0.5 + offsetY);
                if (lampnearpoles) {
                    placeItem(bp, "small-lamp", -2.5 - pole_lamp_distance_from_tracks, i - 0.5 + offsetY);
                }
            }
            placeItem(bp, "medium-electric-pole", -1.5 - pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
            if (lampnearpoles) {
                placeItem(bp, "small-lamp", -2.5 - pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
            }
        }
        for (let j = 0; j < 6; j++) {
            if (useRightSide) {
                placeInserter(bp, inserterType, 1.5, i + j + 0.5 + offsetY, 2 + orientation4, filters);
                placeChest(bp, chestType, 2.5, i + j + 0.5 + offsetY, requests, chestlimit, greenWire, redWire);
                rightChests.push(bp[bp.length - 1]);
                if (beltsEnabled) {
                    placeInserter(bp, inserterType, 3.5, i + j + 0.5 + offsetY, 2 + orientation4, filters);
                }
            }
            if (useLeftSide) {
                // if (["left", "both"].indexOf(sideUsed) > -1) {
                placeInserter(bp, inserterType, -1.5, i + j + 0.5 + offsetY, 6 - orientation4, filters);
                placeChest(bp, chestType, -2.5, i + j + 0.5 + offsetY, requests, chestlimit, greenWire, redWire);
                leftChests.push(bp[bp.length - 1]);
                if (beltsEnabled) {
                    placeInserter(bp, inserterType, -3.5, i + j + 0.5 + offsetY, 6 - orientation4, filters);
                }
            }
        }
    }
    addGreenWire(rightChests, leftChests);
    addRedWire(rightChests, leftChests);
    connectWireWithDecider(bp, rightChests, leftChests, trainStopIndex);
}
function createBeltLayout(bp, trainStopIndex, trainStopsAmount, loading = true) {
    let beltsEnabledElement = document.getElementById("beltsenabled");
    let beltsEnabled = beltsEnabledElement.checked;
    if (!beltsEnabled) {
        return;
    }
    let offsetY = getYoffset(trainStopIndex);
    const locomotive_length = 6;
    const cargo_length = 6;
    const space_between_trains = 1;
    let beltTypeElement = document.getElementById("belttype");
    let beltType = beltTypeElement.value;
    let sideUsedElement = document.getElementById("sidetobeused");
    let sideUsed = sideUsedElement.value;
    let beltFlowDirectionElement = document.getElementById("beltflowdirection");
    let beltFlowDirection = beltFlowDirectionElement.value;
    let locos = parseFloat(document.getElementById("amountlocomotives").value);
    let cargos = parseFloat(document.getElementById("amountcargowagons").value);
    let doubleHeaded = document.getElementById("traintype").checked;
    let doubleHeadedInt = doubleHeaded ? 1 : 0;
    let splitterTypes = {
        "transport-belt": "splitter",
        "fast-transport-belt": "fast-splitter",
        "express-transport-belt": "express-splitter",
    };
    let splitterType = splitterTypes[beltType];
    let trainLength = getTrainLength();
    let middleOfTrain = trainLength / 2;
    let startOffset = -2 + locos * (locomotive_length + space_between_trains);
    let endOffset = -3 - (locos * doubleHeadedInt) * (locomotive_length + space_between_trains);
    let orientation2 = loading ? 0 : 2;
    let orientation4 = loading ? 0 : 4;
    let orientation6 = loading ? 0 : 6;
    // Contains x and y coordinates where the belt layout needs to pick up from
    // e.g. [[4.5, 20], [4.5, 27]] etc
    // Required for the "belt flow" front / right / side
    let splitterOutput = [];
    let useRightSide = shouldPlaceRightSide();
    let useLeftSide = shouldPlaceLeftSide();
    // Basic layout
    for (let i = 0 + startOffset; i < trainLength + endOffset; i += cargo_length + space_between_trains) {
        for (let j = 0; j < 6; j++) {
            if (useRightSide) {
                // if (["right", "both"].indexOf(sideUsed) > -1) {
                // Splitters
                if (j % 6 == 0) {
                    placeItem(bp, splitterType, 5.5, j + i + 3 + offsetY, 6 - orientation4);
                    // Insert splitter output positions where they should be picked up from
                    if (["front"].indexOf(beltFlowDirection) > -1) {
                        splitterOutput.push([6.5, j + i + 2.5 + offsetY]);
                    }
                    if (["back"].indexOf(beltFlowDirection) > -1) {
                        splitterOutput.push([6.5, j + i + 3.5 + offsetY]);
                    }
                    if (["side"].indexOf(beltFlowDirection) > -1) {
                        if (i + j < middleOfTrain) {
                            splitterOutput.push([6.5, j + i + 3.5 + offsetY]);
                        }
                        else {
                            splitterOutput.push([6.5, j + i + 2.5 + offsetY]);
                        }
                    }
                }
                // Belts north of splitter
                if (j < 2) {
                    placeItem(bp, beltType, 4.5, j + i + 0.5 + offsetY, 0 + orientation4);
                }
                // Belts next to splitter
                if (j == 2) {
                    placeItem(bp, beltType, 4.5, j + i + 0.5 + offsetY, 0 + orientation2);
                }
                if (j == 3) {
                    placeItem(bp, beltType, 4.5, j + i + 0.5 + offsetY, 4 - orientation2);
                }
                // Belts south of splitter
                if (3 < j) {
                    placeItem(bp, beltType, 4.5, j + i + 0.5 + offsetY, 4 - orientation4);
                }
            }
            if (useLeftSide) {
                // if (["left", "both"].indexOf(sideUsed) > -1) {
                // Splitters
                if (j % 6 == 0) {
                    placeItem(bp, splitterType, -5.5, j + i + 3 + offsetY, 2 + orientation4);
                    // Insert splitter output positions where they should be picked up from
                    if (["front"].indexOf(beltFlowDirection) > -1) {
                        splitterOutput.push([-6.5, j + i + 2.5 + offsetY]);
                    }
                    if (["back"].indexOf(beltFlowDirection) > -1) {
                        splitterOutput.push([-6.5, j + i + 3.5 + offsetY]);
                    }
                    if (["side"].indexOf(beltFlowDirection) > -1) {
                        if (i + j < middleOfTrain) {
                            splitterOutput.push([-6.5, j + i + 3.5 + offsetY]);
                        }
                        else {
                            splitterOutput.push([-6.5, j + i + 2.5 + offsetY]);
                        }
                    }
                }
                // Belts north of splitter
                if (j < 2) {
                    placeItem(bp, beltType, -4.5, j + i + 0.5 + offsetY, 0 + orientation4);
                }
                // Belts next to splitter
                if (j == 2) {
                    placeItem(bp, beltType, -4.5, j + i + 0.5 + offsetY, 0 + orientation6);
                }
                if (j == 3) {
                    placeItem(bp, beltType, -4.5, j + i + 0.5 + offsetY, 4 + orientation2);
                }
                // Belts south of splitter
                if (3 < j) {
                    placeItem(bp, beltType, -4.5, j + i + 0.5 + offsetY, 4 - orientation4);
                }
            }
        }
    }
    createBeltFlow(bp, splitterOutput, trainStopIndex, trainStopsAmount, loading);
}
function compare(a, b) {
    // For the sort function in "createBeltFlow"
    // Sorts to (0, 0) if belt flow is front
    // Sorts to (0, middleOfTrain) if belt flow is side
    // Sorts to (0, trainLength) if belt flow is back
    let beltFlowDirectionElement = document.getElementById("beltflowdirection");
    let beltFlowDirection = beltFlowDirectionElement.value;
    let trainLength = getTrainLength();
    let middleOfTrain = trainLength / 2;
    let targetX = 0;
    let targetY = 0;
    if (beltFlowDirection === "front") {
        targetY = 0;
    }
    else if (beltFlowDirection === "side") {
        targetY = middleOfTrain;
    }
    else if (beltFlowDirection === "back") {
        targetY = 99999;
    }
    let x0 = a[0];
    let y0 = a[1];
    let x1 = b[0];
    let y1 = b[1];
    let distance0squared = Math.pow(y0 - targetY, 2) + Math.pow(x0 - targetX, 2);
    let distance1squared = Math.pow(y1 - targetY, 2) + Math.pow(x1 - targetX, 2);
    if (distance0squared === distance1squared) {
        return 0;
    }
    return distance0squared < distance1squared ? -1 : 1;
}
function getTargetYLine(splitterOutput) {
    let beltFlowDirectionElement = document.getElementById("beltflowdirection");
    let beltFlowDirection = beltFlowDirectionElement.value;
    // let trainLength = getTrainLength()
    // let middleOfTrain = trainLength / 2
    let targetY = 0;
    if (beltFlowDirection === "front") {
        targetY = 9999999;
    }
    else {
        targetY = -999999;
    }
    splitterOutput.forEach(element => {
        if (beltFlowDirection === "front") {
            if (element[1] < targetY) {
                targetY = element[1];
            }
        }
        if (beltFlowDirection === "back") {
            if (targetY < element[1]) {
                targetY = element[1];
            }
        }
    });
    return targetY;
}
function sign(a) {
    if (a === 0) {
        return 0;
    }
    return a > 0 ? 1 : -1;
}
function getBeltPath(startLocation, targetX, targetY, loading, beltFlowDirection) {
    // let beltFlowDirectionElement = document.getElementById("beltflowdirection") as HTMLSelectElement
    // let beltFlowDirection = beltFlowDirectionElement.value
    let startX = startLocation[0];
    let startY = startLocation[1];
    let currentPath = [];
    if (beltFlowDirection === "front") {
        let horizontalDirection = loading ? 6 : 2;
        let cornerDirection = loading ? 6 : 0;
        let verticalDirection = loading ? 4 : 0;
        // Mirror belts for west side
        if (Math.sign(startX) < 0) {
            if ([2, 6].indexOf(cornerDirection) > -1) {
                cornerDirection = (cornerDirection + 4) % 8;
            }
            if ([2, 6].indexOf(horizontalDirection) > -1) {
                horizontalDirection = (horizontalDirection + 4) % 8;
            }
        }
        for (let y = startY; y >= targetY; y--) {
            if (y == startY) {
                currentPath.push([targetX, y, cornerDirection]);
            }
            else {
                currentPath.push([targetX, y, verticalDirection]);
            }
        }
        for (let x = startX; Math.abs(x) < Math.abs(targetX); x += Math.sign(startX)) {
            currentPath.push([x, startY, horizontalDirection]);
        }
    }
    if (beltFlowDirection === "back") {
        let horizontalDirection = loading ? 6 : 2;
        let cornerDirection = loading ? 6 : 4;
        let verticalDirection = loading ? 0 : 4;
        // Mirror belts for west side
        if (Math.sign(startX) < 0) {
            if ([2, 6].indexOf(cornerDirection) > -1) {
                cornerDirection = (cornerDirection + 4) % 8;
            }
            if ([2, 6].indexOf(horizontalDirection) > -1) {
                horizontalDirection = (horizontalDirection + 4) % 8;
            }
        }
        for (let y = startY; y <= targetY; y++) {
            if (y == startY) {
                currentPath.push([targetX, y, cornerDirection]);
            }
            else {
                currentPath.push([targetX, y, verticalDirection]);
            }
        }
        for (let x = startX; Math.abs(x) < Math.abs(targetX); x += Math.sign(startX)) {
            currentPath.push([x, startY, horizontalDirection]);
            if (horizontalDirection === 6) {
            }
        }
    }
    return currentPath;
}
function createBeltFlow(bp, splitterOutput, trainStopIndex, trainStopsAmount, loading = true) {
    let beltFlowDirectionElement = document.getElementById("beltflowdirection");
    let beltFlowDirection = beltFlowDirectionElement.value;
    let beltTypeElement = document.getElementById("belttype");
    let beltType = beltTypeElement.value;
    // let sideUsedElement = document.getElementById("sidetobeused") as HTMLSelectElement
    // let sideUsed = sideUsedElement.value
    let sequentialBeltsGoAllTheWayElement = document.getElementById("sequentialbeltsalltheway");
    let sequentialBeltsGoAllTheWay = sequentialBeltsGoAllTheWayElement.checked;
    // let trainLength = getTrainLength()
    let cargos = parseFloat(document.getElementById("amountcargowagons").value);
    // console.log("unsorted", splitterOutput);
    splitterOutput.sort(compare);
    // console.log("sorted", splitterOutput);
    // let targetY = splitterOutput[splitterOutput.length-1][1]
    let targetY = getTargetYLine(splitterOutput);
    let offsetX = -0.5;
    // Correction since sequential implementation 
    let targetYCorrection = 0;
    let targetXCorrection = 0;
    if (beltFlowDirection === "front") {
        if (sequentialBeltsGoAllTheWay) {
            targetYCorrection = targetY - getYoffset(trainStopIndex);
        }
        else {
            targetYCorrection = targetY;
        }
    }
    if (beltFlowDirection === "back") {
        if (sequentialBeltsGoAllTheWay) {
            let offsetY = getYoffset(trainStopsAmount - 1) - getYoffset(trainStopIndex);
            targetYCorrection = targetY + offsetY; // + Math.sign(trainStopIndex) * 4 + 2 * Math.sign(trainStopIndex)
        }
        else {
            targetYCorrection = targetY;
        }
    }
    let bothSidesUsed = shouldPlaceRightSide() && shouldPlaceLeftSide();
    splitterOutput.forEach(element => {
        if (beltFlowDirection === "front") {
            if (sequentialBeltsGoAllTheWay) {
                targetXCorrection = element[0] + Math.sign(element[0]) * Math.round(offsetX) + Math.sign(element[0]) * (trainStopIndex * cargos);
            }
            else {
                targetXCorrection = element[0] + Math.sign(element[0]) * Math.round(offsetX);
            }
        }
        else if (beltFlowDirection === "back") {
            if (sequentialBeltsGoAllTheWay) {
                targetXCorrection = element[0] + Math.sign(element[0]) * (Math.round(offsetX) + cargos * (trainStopsAmount - trainStopIndex - 1));
            }
            else {
                targetXCorrection = element[0] + Math.sign(element[0]) * (Math.round(offsetX));
            }
        }
        let beltPath = getBeltPath(element, targetXCorrection, targetYCorrection, loading, beltFlowDirection);
        beltPath.forEach(pos => {
            placeItem(bp, beltType, pos[0], pos[1], pos[2]);
        });
        if (!bothSidesUsed) {
            // if (["left", "right"].indexOf(sideUsed) > -1) {
            offsetX += 1;
        }
        else {
            offsetX += 0.5;
        }
    });
}
function compareY(a, b) {
    if (a.position.y == b.position.y) {
        return 0;
    }
    return a.position.y < b.position.y ? -1 : 1;
}
function connectTwoItemsWithWire(item1, item2, wireColor) {
    if (item1.connections === undefined) {
        item1.connections = {
            "1": {
                "green": [],
                "red": []
            }
        };
    }
    else if (item1.connections["1"] === undefined) {
        item1.connections["1"] = {
            "green": [],
            "red": []
        };
    }
    if (item2.connections === undefined) {
        item2.connections = {
            "1": {
                "green": [],
                "red": []
            }
        };
    }
    else if (item2.connections["1"] === undefined) {
        item2.connections["1"] = {
            "green": [],
            "red": []
        };
    }
    if (wireColor === "green") {
        item1.connections["1"].green.push({
            "entity_id": item2.entity_number,
            "circuit_id": 1
        });
        item2.connections["1"].green.push({
            "entity_id": item1.entity_number,
            "circuit_id": 1
        });
    }
    else if (wireColor === "red") {
        item1.connections["1"].red.push({
            "entity_id": item2.entity_number,
            "circuit_id": 1
        });
        item2.connections["1"].red.push({
            "entity_id": item1.entity_number,
            "circuit_id": 1
        });
    }
}
function addGreenWire(rightChests, leftChests) {
    let greenWire = document.getElementById("greenwire").checked;
    if (!greenWire) {
        return;
    }
    let greenWireSidesElement = document.getElementById("greenwiresides");
    let greenWireConnectSides = greenWireSidesElement.checked;
    rightChests.sort(compareY);
    leftChests.sort(compareY);
    // Add connection between left and right chests
    if (greenWireConnectSides && rightChests.length > 0 && leftChests.length > 0) {
        let rightFirst = rightChests[0];
        let leftFirst = leftChests[0];
        rightFirst.connections[0].green.push({
            "entity_id": leftFirst.entity_number,
            "circuit_id": 1
        });
        leftFirst.connections[0].green.push({
            "entity_id": rightFirst.entity_number,
            "circuit_id": 1
        });
    }
    // Add connection to all chests on right side (excluding refuel chests)
    let lastChest = {};
    let i = 0;
    rightChests.forEach(thisChest => {
        if (i > 0) {
            thisChest.connections[0].green.push({
                "entity_id": lastChest.entity_number,
                "circuit_id": 1
            });
            lastChest.connections[0].green.push({
                "entity_id": thisChest.entity_number,
                "circuit_id": 1
            });
        }
        lastChest = thisChest;
        i += 1;
    });
    // Add connection all chests on left side (excluding refuel chests)
    lastChest = {};
    i = 0;
    leftChests.forEach(thisChest => {
        if (i > 0) {
            thisChest.connections[0].green.push({
                "entity_id": lastChest.entity_number,
                "circuit_id": 1
            });
            lastChest.connections[0].green.push({
                "entity_id": thisChest.entity_number,
                "circuit_id": 1
            });
        }
        lastChest = thisChest;
        i += 1;
    });
}
function addRedWire(rightChests, leftChests) {
    let redWire = document.getElementById("redwire").checked;
    if (!redWire) {
        return;
    }
    let redWireSidesElement = document.getElementById("redwiresides");
    let redWireConnectSides = redWireSidesElement.checked;
    rightChests.sort(compareY);
    leftChests.sort(compareY);
    // Add connection between left and right chests
    if (redWireConnectSides && rightChests.length > 0 && leftChests.length > 0) {
        let rightFirst = rightChests[0];
        let leftFirst = leftChests[0];
        rightFirst.connections[0].red.push({
            "entity_id": leftFirst.entity_number,
            "circuit_id": 1
        });
        leftFirst.connections[0].red.push({
            "entity_id": rightFirst.entity_number,
            "circuit_id": 1
        });
    }
    // Add connection to all chests on right side (excluding refuel chests)
    let lastChest = {};
    let i = 0;
    rightChests.forEach(thisChest => {
        if (i > 0) {
            thisChest.connections[0].red.push({
                "entity_id": lastChest.entity_number,
                "circuit_id": 1
            });
            lastChest.connections[0].red.push({
                "entity_id": thisChest.entity_number,
                "circuit_id": 1
            });
        }
        lastChest = thisChest;
        i += 1;
    });
    // Add connection all chests on left side (excluding refuel chests)
    lastChest = {};
    i = 0;
    leftChests.forEach(thisChest => {
        if (i > 0) {
            thisChest.connections[0].red.push({
                "entity_id": lastChest.entity_number,
                "circuit_id": 1
            });
            lastChest.connections[0].red.push({
                "entity_id": thisChest.entity_number,
                "circuit_id": 1
            });
        }
        lastChest = thisChest;
        i += 1;
    });
}
function createPumpsAndStorageTanks(bp, trainStopIndex, loading = true) {
    const locomotive_length = 6;
    const cargo_length = 6;
    const space_between_trains = 1;
    let locos = parseFloat(document.getElementById("amountlocomotives").value);
    let cargos = parseFloat(document.getElementById("amountcargowagons").value);
    let doubleHeaded = document.getElementById("traintype").checked;
    let doubleHeadedInt = doubleHeaded ? 1 : 0;
    let trainLength = getTrainLength();
    let lampnearpoles = document.getElementById("lampnearpoles").checked;
    let sideUsed = document.getElementById("fluidsidetobeused").selectedOptions[0].value;
    let connectTanks = document.getElementById("fluidconnecttanks").checked;
    let offsetY = getYoffset(trainStopIndex);
    let greenWire = document.getElementById("greenwire").checked;
    let redWire = document.getElementById("redwire").checked;
    const pole_lamp_distance_from_tracks = 0;
    let orientation4 = loading ? 0 : 4;
    let startOffset = -2 + locos * (locomotive_length + space_between_trains);
    let endOffset = -3 - (locos * doubleHeadedInt) * (locomotive_length + space_between_trains);
    let rightChests = [];
    let leftChests = [];
    let useRightSide = shouldPlaceRightSide();
    let useLeftSide = shouldPlaceLeftSide();
    for (let i = 0 + startOffset; i < trainLength + endOffset; i += cargo_length + space_between_trains) {
        if (["right", "both"].indexOf(sideUsed) > -1) {
            if (i == startOffset) {
                placeItem(bp, "medium-electric-pole", 1.5 + pole_lamp_distance_from_tracks, i - 0.5 + offsetY);
                if (lampnearpoles) {
                    placeItem(bp, "small-lamp", 2.5 + pole_lamp_distance_from_tracks + offsetY, i - 0.5);
                }
            }
            placeItem(bp, "medium-electric-pole", 1.5 + pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
            if (lampnearpoles) {
                placeItem(bp, "small-lamp", 2.5 + pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
            }
        }
        if (["left", "both"].indexOf(sideUsed) > -1) {
            if (i == startOffset) {
                placeItem(bp, "medium-electric-pole", -1.5 - pole_lamp_distance_from_tracks, i - 0.5 + offsetY);
                if (lampnearpoles) {
                    placeItem(bp, "small-lamp", -2.5 - pole_lamp_distance_from_tracks, i - 0.5 + offsetY);
                }
            }
            placeItem(bp, "medium-electric-pole", -1.5 - pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
            if (lampnearpoles) {
                placeItem(bp, "small-lamp", -2.5 - pole_lamp_distance_from_tracks, i + 6.5 + offsetY);
            }
        }
        if (useRightSide) {
            // if (["right", "both"].indexOf(sideUsed) > -1) {
            placeItem(bp, "pump", 2, i + 0.5 + offsetY, (6 + orientation4) % 8);
            placeChest(bp, "storage-tank", 4.5, i + 1.5 + offsetY, [], -1, greenWire, redWire, 0);
            rightChests.push(bp[bp.length - 1]);
            if (connectTanks && i != startOffset) {
                placeItem(bp, "pipe", 3.5, i - 0.5 + offsetY);
            }
            placeChest(bp, "storage-tank", 4.5, i + 4.5 + offsetY, [], -1, greenWire, redWire, 2);
            rightChests.push(bp[bp.length - 1]);
            placeItem(bp, "pump", 2, i + 5.5 + offsetY, (6 + orientation4) % 8);
        }
        if (useLeftSide) {
            // if (["left", "both"].indexOf(sideUsed) > -1) {
            placeItem(bp, "pump", -2, i + 0.5 + offsetY, 2 + orientation4);
            placeChest(bp, "storage-tank", -4.5, i + 1.5 + offsetY, [], -1, greenWire, redWire, 2);
            rightChests.push(bp[bp.length - 1]);
            if (connectTanks && i != startOffset) {
                placeItem(bp, "pipe", -3.5, i - 0.5 + offsetY);
            }
            placeChest(bp, "storage-tank", -4.5, i + 4.5 + offsetY, [], -1, greenWire, redWire, 0);
            rightChests.push(bp[bp.length - 1]);
            placeItem(bp, "pump", -2, i + 5.5 + offsetY, 2 + orientation4);
        }
    }
    addGreenWire(rightChests, leftChests);
    addRedWire(rightChests, leftChests);
    connectWireWithDecider(bp, rightChests, leftChests, trainStopIndex);
}
function createStacker(bp) {
    let lanesElement = document.getElementById("stackerparallel");
    let diagonalElement = document.getElementById("stackerdiagonal");
    let leftRightElement = document.getElementById("stackerleftright");
    let lanes = parseFloat(lanesElement.value);
    let diagonal = diagonalElement.checked;
    let leftRight = leftRightElement.checked;
    const locomotive_length = 6;
    const cargo_length = 6;
    const space_between_trains = 1;
    let locos = parseFloat(document.getElementById("amountlocomotives").value);
    let cargos = parseFloat(document.getElementById("amountcargowagons").value);
    let doubleHeaded = document.getElementById("traintype").checked;
    let doubleHeadedInt = doubleHeaded ? 1 : 0;
    let totalLength = locos * (1 + doubleHeadedInt) + cargos;
    // Copy pasted from my mod
    if (diagonal) {
        if (!leftRight) {
            let loopX = totalLength * 5 - 4;
            let startX = 10;
            let startY = -20;
            let offsetEndX = -(loopX + 10);
            let offsetEndY = loopX + 24;
            let trainIsOddInt = totalLength % 2;
            // Front straights
            placeItem(bp, "straight-rail", startX, startY, 0);
            placeItem(bp, "straight-rail", startX, startY + 2, 0);
            // Front curve
            placeItem(bp, "curved-rail", startX - 1, startY + 7, 5);
            placeItem(bp, "rail-chain-signal", startX - 2.5, startY + 11.5, 5);
            // Diagonal rails       
            for (let x = 6; x >= 4 - loopX; x -= 2) {
                placeItem(bp, "straight-rail", x, -x - 2, 7);
                placeItem(bp, "straight-rail", x, -x - 4, 3);
            }
            // placeItem(bp, "straight-rail", 6, -6, 7)
            // placeItem(bp, "straight-rail", 6, -8, 3)
            // // ...
            // placeItem(bp, "straight-rail", -12, -10, 7)
            // placeItem(bp, "straight-rail", -12, -8, 3)
            // Back curve
            placeItem(bp, "curved-rail", startX + offsetEndX + trainIsOddInt + 1, startY + offsetEndY - 7 - trainIsOddInt, 1);
            placeItem(bp, "rail-signal", startX + offsetEndX + 3.5 + trainIsOddInt, startY + offsetEndY - 8.5 - trainIsOddInt, 5);
            // Back straights
            placeItem(bp, "straight-rail", startX + offsetEndX + trainIsOddInt, startY + offsetEndY - 2 - trainIsOddInt);
            placeItem(bp, "straight-rail", startX + offsetEndX + trainIsOddInt, startY + offsetEndY - trainIsOddInt);
        }
        else {
            let loopX = totalLength * 5 - 4;
            let startX = -10;
            let startY = -20;
            let offsetEndX = loopX + 10;
            let offsetEndY = loopX + 24;
            let trainIsOddInt = totalLength % 2;
            // Front straights
            placeItem(bp, "straight-rail", startX + 12, startY + 12, 0);
            placeItem(bp, "straight-rail", startX + 12, startY + 14, 0);
            // Front curve
            placeItem(bp, "curved-rail", startX + 13, startY + 19, 4);
            placeItem(bp, "rail-chain-signal", startX + 20 - 4.5, startY + 20.5, 3);
            // Diagonal rails  
            for (let x = -6; x >= -4 - loopX; x -= 2) {
                placeItem(bp, "straight-rail", -x, -x - 2, 1);
                placeItem(bp, "straight-rail", -x, -x - 4, 5);
            }
            // Back curve
            placeItem(bp, "curved-rail", startX + offsetEndX + 7 - trainIsOddInt, startY + offsetEndY + 1 - trainIsOddInt, 0);
            placeItem(bp, "rail-signal", startX + offsetEndX + 5.5 - trainIsOddInt, startY + offsetEndY - 3.5 - trainIsOddInt, 3);
            // Back straights
            placeItem(bp, "straight-rail", startX + offsetEndX + 8 - trainIsOddInt, startY + offsetEndY + 6 - trainIsOddInt);
            placeItem(bp, "straight-rail", startX + offsetEndX + 8 - trainIsOddInt, startY + offsetEndY + 8 - trainIsOddInt);
        }
        let count = bp.length;
        for (let lane = 1; lane < lanes; lane++) {
            for (let item = 0; item < count; item++) {
                let thisItem = bp[bp.length - count];
                bp.push({
                    "entity_number": bp.length + 1,
                    "name": thisItem.name,
                    "position": {
                        "x": thisItem.position.x,
                        "y": thisItem.position.y + 4,
                    },
                    "direction": thisItem.direction,
                });
            }
        }
    }
    else {
        if (!leftRight) {
            let loopX = totalLength * 7;
            let trainIsOddInt = totalLength % 2;
            // Front diagonals
            placeItem(bp, "straight-rail", -6, -10, 1);
            placeItem(bp, "straight-rail", -6, -12, 5);
            placeItem(bp, "straight-rail", -4, -8, 1);
            placeItem(bp, "straight-rail", -4, -10, 5);
            // Front curve
            placeItem(bp, "curved-rail", -1, -5, 0);
            // Straight rails
            placeItem(bp, "rail-chain-signal", 1.5, -1.5, 4);
            for (let y = 0; y <= loopX; y += 2) {
                placeItem(bp, "straight-rail", 0, y);
                placeItem(bp, "straight-rail", 0, y);
            }
            // Back curve
            placeItem(bp, "rail-signal", 1.5, loopX + 1.5 - trainIsOddInt, 4);
            placeItem(bp, "curved-rail", 1, loopX + 5 - trainIsOddInt, 4);
            // Back diagonals
            placeItem(bp, "straight-rail", 4, loopX + 10 - trainIsOddInt, 1);
            placeItem(bp, "straight-rail", 4, loopX + 8 - trainIsOddInt, 5);
            placeItem(bp, "straight-rail", 6, loopX + 12 - trainIsOddInt, 1);
            placeItem(bp, "straight-rail", 6, loopX + 10 - trainIsOddInt, 5);
        }
        else {
            let loopX = totalLength * 7;
            let trainIsOddInt = totalLength % 2;
            // Front diagonals
            placeItem(bp, "straight-rail", 6, -10, 7);
            placeItem(bp, "straight-rail", 6, -12, 3);
            placeItem(bp, "straight-rail", 4, -8, 7);
            placeItem(bp, "straight-rail", 4, -10, 3);
            // Front curve
            placeItem(bp, "curved-rail", 1, -5, 1);
            // Straight rails
            placeItem(bp, "rail-chain-signal", 1.5, -1.5, 4);
            for (let y = 0; y <= loopX; y += 2) {
                placeItem(bp, "straight-rail", 0, y);
                placeItem(bp, "straight-rail", 0, y);
            }
            // Back curve
            placeItem(bp, "rail-signal", 1.5, loopX + 1.5 - trainIsOddInt, 4);
            placeItem(bp, "curved-rail", -1, loopX + 5 - trainIsOddInt, 5);
            // Back diagonals
            placeItem(bp, "straight-rail", -4, loopX + 10 - trainIsOddInt, 7);
            placeItem(bp, "straight-rail", -4, loopX + 8 - trainIsOddInt, 3);
            placeItem(bp, "straight-rail", -6, loopX + 12 - trainIsOddInt, 7);
            placeItem(bp, "straight-rail", -6, loopX + 10 - trainIsOddInt, 3);
        }
        let count = bp.length;
        for (let lane = 1; lane < lanes; lane++) {
            for (let item = 0; item < count; item++) {
                let thisItem = bp[bp.length - count];
                bp.push({
                    "entity_number": bp.length + 1,
                    "name": thisItem.name,
                    "position": {
                        "x": thisItem.position.x + 4 * (!leftRight ? 1 : -1),
                        "y": thisItem.position.y + 4,
                    },
                    "direction": thisItem.direction,
                });
            }
        }
    }
}
