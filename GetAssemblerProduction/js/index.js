//load recipe.json in async call at the start
/*
var recipes;
$.getJSON("https://burnysc2.github.io/Factorio/Tools/GetMaterialCost/Recipes/recipes.json", function(data) { actual_JSON = data; });
*/
var recipeJson;
var recipeLoaded = false;
var entityJson;
var entityLoaded = false;
var moduleJson;
var moduleLoaded = false;

String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

function goBack() {
    window.history.back();
}

function getPastebinUrl(url) {
    var pastebinUrlArray = url.split("/")
    var pastebinId = pastebinUrlArray[pastebinUrlArray.length-1]
    var pastebinDirectUrl = "http://pastebin.com/raw/" + pastebinId
    //console.log(pastebinDirectUrl)
    return pastebinDirectUrl
}

/*
function getPastebinContent2(pastebinUrl) {
    //comment out the following when done with testing
    pastebinUrl = "https://pastebin.com/raw/f7pL929N"
    options = {
        crossDomain: true,
        url: pastebinUrl,
        method: "GET"
    }
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function() {
        console.log(x.responseText || '');
    };
    if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
}
*/

function getPastebinContent(pastebinUrl) {
    var siteContent;
    $.ajax('https://cors-anywhere.herokuapp.com/' + pastebinUrl, {
        async: false,
        // unnecessary / optional arguments:
        //method: "GET",
        //crossDomain: true,
        //headers: {'Access-Control-Allow-Origin': '*'},
        success: function(response) {
            siteContent = response;
        }
    })
    return siteContent
}

//console.log(_.last([1, 2, 3]))
function decodeBlueprint(str) {
    //var binary = Base64.decode(str.substring(1))
    var encoded = atob(str.substring(1))
    //console.log("binary", encoded)
    var decoded = pako.inflate(encoded)
    //console.log("uzip", decoded)
    var string = new TextDecoder("utf-8").decode(decoded)	  
    //console.log("string", string)
    var jsonObject = JSON.parse(string)
    //console.log("jsonObj", jsonObject)
    var jsonString = JSON.stringify(jsonObject, null, 4)
    //console.log("jsonString", jsonString)
    return jsonObject
}

function getItemCount(jsonObject){
    itemCountJson = {}
    for (let i of jsonObject.blueprint.entities){
        itemCountJson[i.name] = _.get(itemCountJson, i.name, 0) + 1
    }
    return itemCountJson
}

function getRecipeJson(url){
    if (!recipeLoaded) { // prevent it from loading more than once, and only load on button press
        jQuery.ajax({
        url: url,
        success: function(html) {
          recipeJson = html;
        },
        async:false
      });
      //console.log("Recipe Json Loaded!");
      recipeLoaded = true;        
    }
    return recipeJson
}

function getEntityJson(url){
    if (!entityLoaded) { // prevent it from loading more than once, and only load on button press
        jQuery.ajax({
        url: url,
        success: function(html) {
          entityJson = html;
        },
        async:false
      });
      //console.log("Recipe Json Loaded!");
      entityLoaded = true;        
    }
    return entityJson
}

function getModuleJson(url){
    if (!moduleLoaded) { // prevent it from loading more than once, and only load on button press
        jQuery.ajax({
        url: url,
        success: function(html) {
          moduleJson = html;
        },
        async:false
      });
      //console.log("Recipe Json Loaded!");
      moduleLoaded = true;        
    }
    return moduleJson
}

function getCraftingMachines(jsonObject){
    var entityUrl = "https://burnysc2.github.io/Factorio/Tools/GetAssemblerProduction/Entities/entities.json";
    entityJson = getEntityJson(entityUrl) 
    // identify a crafting machine by its attribute "crafting_speed
    machineTypes = _.filter(entityJson, o => _.has(o, "crafting_speed"))
    machineTypesNames = _.map(machineTypes, o => o.name) // array of machine names
    //console.log(machineTypes) // the machine types we are looking for in the blueprint string
    
    craftingMachines = _.filter(jsonObject.blueprint.entities, o => machineTypesNames.indexOf(o.name) !== -1)
    //console.log(craftingMachines) // all found machines in the blueprint that match the machine types we are looking for
    return craftingMachines
}

function getBeacons(jsonObject){
    // does same thing:
    // beacons = _.filter(jsonObject.blueprint.entities, o => _.get(o, "name", "") === "beacon")
    beacons = _.filter(jsonObject.blueprint.entities, {"name": "beacon"})
    //console.log(beacons)
    return beacons
}

function getMaxManhattanDistance(obj1, obj2){
    return _.max([Math.abs(obj1.position.x - obj2.position.x), Math.abs(obj1.position.y - obj2.position.y)])   
}

function addModuleBonus(currentMachine, moduleName, moduleCount) {
    // by default it is assumed that the bonus comes from beacon, so double module count if the bonus comes from the machine!
    // currentMachine will have to have "craftingSpeed", "productivity" and "energyEffectivity" attributes
    //var moduleUrl = "https://burnysc2.github.io/Factorio/Tools/GetAssemblerProduction/Modules/modules.json";
    //moduleJson = getModuleJson(moduleUrl)  
    
    //console.log("applying module", moduleName, "amount:", moduleCount)
    //console.log("applying", currentMachine, _.get(currentMachine, "craftingSpeed", 1), moduleCount * 0.5 * _.get(moduleJson, [moduleName, "effect", "speed", "bonus"], 0))
    currentMachine["moduleSpeedBonus"] = _.get(currentMachine, "moduleSpeedBonus", 1) + moduleCount * 0.5 * _.get(moduleJson, [moduleName, "effect", "speed", "bonus"], 0)
    currentMachine["moduleProductivityBonus"] = _.get(currentMachine, "moduleProductivityBonus", 1) + moduleCount * 0.5 * _.get(moduleJson, [moduleName, "effect", "productivity", "bonus"], 0)
    currentMachine["moduleConsumptionBonus"] = _.get(currentMachine, "moduleConsumptionBonus", 1) + moduleCount * 0.5 * _.get(moduleJson, [moduleName, "effect", "consumption", "bonus"], 0)
    //console.log("applyed", currentMachine)
    return currentMachine
}


function getMaterialFromInput(arrayOrObject) { // inputs and outputs
	if (_.isArray(arrayOrObject)) {
		return {name: arrayOrObject[0], amount: arrayOrObject[1]}
	} else if (_.isString(arrayOrObject)) {
		return {name: arrayOrObject, amount: 1}
	} else if (_.isObject(arrayOrObject)) {
		return {name: arrayOrObject.name, amount: arrayOrObject.amount}
	}
}

function getProductionOutput(craftingMachines, beacons){
    var recipeUrl = "https://burnysc2.github.io/Factorio/Tools/GetAssemblerProduction/Recipes/recipes.json";
    recipeJson = getRecipeJson(recipeUrl)  
    var entityUrl = "https://burnysc2.github.io/Factorio/Tools/GetAssemblerProduction/Entities/entities.json";
    entityJson = getEntityJson(entityUrl)  
    var moduleUrl = "https://burnysc2.github.io/Factorio/Tools/GetAssemblerProduction/Modules/modules.json";
    moduleJson = getModuleJson(moduleUrl)  
    
    machineTypes = _.filter(entityJson, o => _.has(o, "crafting_speed"))
    machineTypesWithProperties = _.map(machineTypes, o => _.pick(o, ["name", "crafting_speed", "energy_usage", "collision_box"])) // energy usage is here the amount of electricity the machine takes up
    _.forEach(machineTypesWithProperties, function(obj) {obj.size = _.round(obj.collision_box[1][0]) - _.round(obj.collision_box[0][0]) + 1})
    //console.log(machineTypesWithProperties)
    
    //machineTypes = _.filter(entityJson, o => _.has(o, "crafting_speed"))
    recipes = _.map(recipeJson, o => _.pick(o, ["name", "energy_required", "results", "ingredients", "result_count"])) //energy_required = crafting time
    
    /*Plan:
    loop through each crafting machine:
    - loop through each beacon and check if they are in range, and what modules they have
    - calculate the new crafting speed and new productivity modifier (if productivity modules available)
    - calculate the consumption
    - calculate the production
    */
    
    totalOutput = {}
    //console.log("all machines in blueprint:", craftingMachines)
    for (let machine of craftingMachines) {
        currentMachine = {}
        currentMachine["stats"] = _.find(machineTypesWithProperties, ["name", machine.name])
        currentMachine["craftingSpeed"] = currentMachine["stats"].crafting_speed
        currentMachine["moduleSpeedBonus"] = 1
        currentMachine["moduleProductivityBonus"] = 1
        currentMachine["moduleConsumptionBonus"] = 1 // energy consumption factor
        
        currentMachine["recipe"] = recipeJson[machine.recipe]
        if (currentMachine["recipe"] === undefined) {
            continue // in case of electric furnaces, pumping jacks too?
        }
        
        currentMachine["outputMultiplier"] = _.get(currentMachine["recipe"], "result_count", _.get(currentMachine["recipe"], ["normal", "result_count"], 1)) // int
        currentMachine["recipeCraftingTime"] = _.get(currentMachine["recipe"], "energy_required", _.get(currentMachine["recipe"], ["normal", "energy_required"], 1)) // int
        for (moduleName of _.keys(machine.items)){ // applying modules insite the machine
            moduleCount = machine.items[moduleName]
            currentMachine = addModuleBonus(currentMachine, moduleName, 2 * moduleCount)
        }
        
        currentMachine["output"] = _.get(currentMachine["recipe"], "result", _.get(currentMachine["recipe"], ["normal", "result"], _.get(currentMachine["recipe"], "results", ""))) // string, see oil-processing has "results" and most others have string as "result" or sometimes a "normal"->"result" lul
        currentMachine["input"] = _.get(currentMachine["recipe"], "ingredients", _.get(currentMachine["recipe"], ["normal", "ingredients"], [])) // array in form of [{"amount": 10, "name": "water"}, {}]
            
        
        //console.log(machine)
        for (let beacon of beacons) {
            if (getMaxManhattanDistance(beacon, machine) <= 4 + (currentMachine["stats"].size - 1)/2){
                //TODO: add power consumption
                for (moduleName of _.keys(beacon.items)){ // applying modules from beacons
                    moduleCount = beacon.items[moduleName]
                    currentMachine = addModuleBonus(currentMachine, moduleName, moduleCount)
                }
            }
        }
        craftsPerSecond = currentMachine["moduleSpeedBonus"] * currentMachine["craftingSpeed"] / currentMachine["recipeCraftingTime"] // does not include outputMultiplier, productivity
        //console.log("currentMachineStats:", currentMachine)
        
        // add output to totalOutput variable        
        if (_.isString(currentMachine["output"])){
            //console.log("added output (string):", currentMachine["output"], currentMachine["outputMultiplier"])
            //console.log("added output (DEBUG):", _.isString(currentMachine["output"]), currentMachine)
            totalOutput[currentMachine["output"]] = _.get(totalOutput, currentMachine["output"], 0) + craftsPerSecond * currentMachine["outputMultiplier"] * currentMachine["moduleProductivityBonus"]
        } else {
            for (let outputObj of currentMachine["output"]) {
                console.log("added output (object):", outputObj.name, outputObj.amount)
                totalOutput[outputObj.name] = _.get(totalOutput, [currentMachine["output"], "name"], 0) + craftsPerSecond * outputObj.amount * currentMachine["moduleProductivityBonus"]
            }
        }
        
        
        // add input to totalOutput variable as deficit
		for (let inputItem of currentMachine["input"]) {
			itemNameAmount = getMaterialFromInput(inputItem)
			//console.log("added input", itemNameAmount)
			//console.log("added input (array) (DEBUG):", currentMachine)
			totalOutput[itemNameAmount.name] = _.get(totalOutput, itemNameAmount.name, 0) - craftsPerSecond * itemNameAmount.amount
		}
		
        /*if (_.isArray(currentMachine["input"][0])){
            for (let inputItem of currentMachine["input"]) {
				console.log("added input (array):", inputItem[0])
				console.log("added input (array) (DEBUG):", currentMachine)
                totalOutput[inputItem[0]] = _.get(totalOutput, inputItem[0], 0) - craftsPerSecond * inputItem[1]
            }
        } else {
            for (let inputItem of currentMachine["input"]) {
				//console.log("added input (objects):", inputItem.name)
                totalOutput[inputItem.name] = _.get(totalOutput, inputItem.name, 0) - craftsPerSecond * inputItem.amount
            }
        }*/
    }    
    //console.log(totalOutput)
	if (outputScale.value === "minute"){
		for (let i of _.keys(totalOutput)){
			totalOutput[i] *= 60
		}		
		t2header.innerText = "Output per Minute:"
	} else if (outputScale.value === "hour"){
		for (let i of _.keys(totalOutput)){
			totalOutput[i] *= 3600
		}
		t2header.innerText = "Output per Hour:"
	} else {
		t2header.innerText = "Output per Second:"
	}
	
	// round results
	for (let i of _.keys(totalOutput)){
			totalOutput[i] = _.round(totalOutput[i], roundOutputPrecision.value)
	}
    return totalOutput
}

function convertItemCountToString(jsonObject, ascendingOrder=false){
    // function sorts a list of objects like [{"iron-plate": 5}, {"copper-plate": 10}]
    if (ascendingOrder){
        itemCountNamesSorted = Object.keys(jsonObject).sort(function(a,b){return jsonObject[a]-jsonObject[b]})
    } else { // descending order, largest number first
        itemCountNamesSorted = Object.keys(jsonObject).sort(function(a,b){return jsonObject[b]-jsonObject[a]})
    }    
    outputString = ""
    for (let i of itemCountNamesSorted){
        outputString += "{} {}\n".format(jsonObject[i].toString(), i)
    }	
    return outputString    
}



function myFunction() {
    // jquery -> load the field with id "t1" -> load the URL ?!
    //$("#t1").load("https://pastebin.com/raw/f7pL929N");    
    inputValue = _.trim(t1.value)
    //TODO: comment out the following when testing
    //var blueprintString = '0eNqllOFugyAUhd/l/pak6lo7X2VpFsTb9m6ABnSZaXz3gTSuqWym2y8D13M+OPfqBSrZY2tId1BegESjLZQvF7B00lz6vW5oEUqgDhUkoLnyq4YkM3gkjWaAMQHSNX5CmY7JqrRC7ig3omw8JIC6o44wwKfF8Kp7VaFxrrMWJYrOkGCKNOkTqw1J6azbxjq1c3VQ58jSLIFhejpMTcappqrb9oex/j3bItZMNXUvkeVQ5qM//B06m9HcWlSV9FTFxdndnGUR8i34R1QWQ+X3CS3Ni2Be/OadxryfZu+2V+0bF++x0PJg/0Bm0Yts41MSAV6z+mePdjNPnFGR4JK1kruBXhCvY3F3wd2jwGK9U/sJFFXvV9WhzcXDE/T8HYSrGDr2J1y6hwz+MKDpZvkdHnujucAfo17FHELZpzH/iBL4QGNDb/ZFttlm2zzdjeMX/X6KBg=='
    // ^ = https://i.imgur.com/HSIOYKg.png
    //tempUrl = "https://pastebin.com/raw/f7pL929N"
    
    //with recipe:
    //0eNptkNEKwjAMRf8lzx24qVP6KyLSdVGiW1raThyj/25bQQT3VFJy7kmyQDdMaB1xALkAacMe5GkBTzdWQ/4Ls0WQQAFHEMBqzJWhoXJ4JUY3QxRA3OMLZB3PApADBcJPTinmC09jhy41rCcIsMYnyHA2pqCqETCnZ5+yHWoqI6j+qVhjX2XWOqPRe+Jb8v95mq+nQ5WW+jfsiqCOK/D2C9tptHelHysD1oVvY9643Eb+nFLAE50v3e3x0Gzafbs97mJ8A2zxeiE=
    //https://pastebin.com/bYC57zSQ
    
    // with recipe + modules:
    // 0eNqtk9tqwzAMht9F1zY0p7bzq4wxHEftBIkTbKcsFL/75BSysqYrHbvzIfq/TxE+Q92OODiyAdQZyPTWg3o9g6ej1W06C9OAoIACdiDA6i7temqlwwNZdBNEAWQb/ASVRfGwFFs0wZGRh9FZbfCqPI9vAtAGCoQXjXkzvduxq9Fx/rqAgKH3XNTbROWgUsAESlYc3ZBj3nyVC+A1zU66OWlrsJEpaHC9Qe/JHjkq2fqUw6fNyKUnNpAdr1uUBagipiZ/iOX327uRk7uLXRmvYH5AlvmmcKd3+Nkav1j4NWoe4go1n6nZb9B8Lbp8vrVtfPwbV1nVwtLeY1e3PBLZafPBc+aiG95mwd0O1pAzI4W/TnT7pErxLyplTE9gfjDq6mkKOKHzM2y73+Wb6mWzr/jbLzi2RA8=
    // -> pic https://i.imgur.com/Mu1LIur.png
    
    //getPastebinContent(tempUrl)
    try {
        if (inputValue.indexOf("pastebin.com") !== -1){
            var pastebinUrl = getPastebinUrl(inputValue)
            blueprintString = getPastebinContent(pastebinUrl)
        } else {
            blueprintString = inputValue
        }
    }
    catch(err) {
        t2.value = "Not a valid pastebin!\nIf I am mistaken, please go to\n{}\nand paste the blueprint string instead of the pastebin.".format(getPastebinUrl(inputValue))   
        throw "Not a valid pastebin!";
    }
    
    //try {
        if (blueprintString.indexOf("404 (Not Found)") === -1){
            var jsonObject = decodeBlueprint(blueprintString)
            var beacons = getBeacons(jsonObject)
            var craftingMachines = getCraftingMachines(jsonObject)
            var productionOutput = getProductionOutput(craftingMachines, beacons)
            //var itemCount = getItemCount(jsonObject)
            //var materialCount = getMaterialCount(itemCount)
            var outputString = convertItemCountToString(productionOutput)
            t2.value = outputString
        }
        else {
            t2.value = "Not a valid pastebin!\nIf I am mistaken, please go to\n{}\nand paste the blueprint string instead of the pastebin.".format(getPastebinUrl(inputValue))
        }
    /*}
    catch(err) {
        t2.value = "Not a valid blueprint!"
    }*/
}