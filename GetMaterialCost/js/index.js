//load recipe.json in async call at the start
/*
var recipes;
$.getJSON("https://burnysc2.github.io/Factorio/Tools/GetMaterialCost/Recipes/recipes.json", function(data) { actual_JSON = data; });
*/
var recipeJson;
var recipeLoaded = false;

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

function getMaterialCount(jsonObject){
    var recipeUrl = "https://burnysc2.github.io/Factorio/Tools/GetMaterialCost/Recipes/recipes.json";
    recipeJson = getRecipeJson(recipeUrl)    
    //console.log(recipeJson)
    //console.log(JSON.stringify(jsonObject))
    // initially, jsonObject contains itemnames as keys and number of items of that type as values
    // e.g. jsonObject = {"transport-belt": 30, "fast-inserter": 15}
    var materialsJson = jsonObject;
    var materialsJsonOld = {};
    var completeMaterialsJson = {};    
    while (! _.isEqual(materialsJson, materialsJsonOld)) {
        materialsJsonOld = materialsJson
        jsonObject = materialsJson
        materialsJson = {}
        // now we loop through all the items of jsonObject and put the ingredients in materialsJson
        // if the item in jsonObject is already a base level ingredient, we put it in completeMaterialJson
        for (let itemName of _.keys(jsonObject)){      
            // get the list of ingredients, default = []
            itemRecipe = _.get(recipeJson, [itemName, "ingredients"], _.get(recipeJson, [itemName, "normal", "ingredients"], []))
            if (itemRecipe.length > 0) {
                // if list of ingredients is not empty (meaning, if it isnt iron-ore or some base level material), we add the materials to the new jsonObject
                recipeResultCount = _.get(recipeJson, [itemName, "result_count"], _.get(recipeJson, [itemName, "normal", "result_count"], 1))
                console.log(recipeJson[itemName], itemRecipe)
                for (let material of itemRecipe){
                     materialName = _.get(material, "name", material[0])  // the ingredient name
                     materialCount = _.get(material, "amount", material[1]) / recipeResultCount // the ingredient count
                    if (materialName === undefined){
                        console.log("BUG:", itemName, materialName, jsonObject[itemName])
                    }
                     materialsJson[materialName] = _.get(materialsJson, materialName, 0) + materialCount * jsonObject[itemName] // stored material count + this item material count * amount of items in the blueprint
                }
            } // if it doesnt have a recipe, then add it to the list of items
            else {
                // the raw ingredients in the blueprint:
                //console.log(itemName, jsonObject[itemName])
                completeMaterialsJson[itemName] = _.get(completeMaterialsJson, itemName, 0) + jsonObject[itemName] // stored ingredient plus the current ingredient
            }
        }
    }
    // the finished raw material list as jsonObject:
    //console.log(JSON.stringify(completeMaterialsJson))
    return completeMaterialsJson
}

function convertItemCountToString(jsonObject){
    itemCountNamesDescending = Object.keys(jsonObject).sort(function(a,b){return jsonObject[b]-jsonObject[a]})
    outputString = ""
    for (let i of itemCountNamesDescending){
        outputString += "{} {}\n".format(jsonObject[i].toString(), i)
    }
    return outputString    
}



function myFunction() {
    // jquery -> load the field with id "t1" -> load the URL ?!
    //$("#t1").load("https://pastebin.com/raw/f7pL929N");    
    inputValue = _.trim(t1.value)
    //TODO: comment out the following when testing
    //var blueprintString = '0eNqd1V9vgyAQAPCvstyzLsV/7XzfJ9jjsizY3ppL8CRAl5nG7z6sS7tG0lKfDKf8kIODIzTqgNoQO6iPQNuOLdTvR7C0Z6nGmOs1Qg3ksIUEWLZjyzqUbYq8J0YYEiDe4Q/UYvhIANmRI5ycU6P/5EPboPEfnIUvaV3qjGSrO+PSBpXzvO6s79vxOLD30nUCvX/kfogdGdxO74ohmcnZWW46Uj4yx4rncuKyay4LcHl4qnNURJNFJFlEi+VZJLZoXHDW1cSJa64KcNWyxRH3F2e9TM7uy5v4FERk4GXRf0YkQKwWyasI+VJSmnRoh5Z/VKjzpWpsK5VKUfmxDG1T3amQVdyw8vgKjNjbonisAmPI8qEKjBGrx/KX30jfshqJOBnFZpE8Kz5/tJ8ugfrfnZGAkl7xsbcxo0+vjGbf+/A3GjuV2WadrcqszEU1DL8NhSDK'
    //tempUrl = "https://pastebin.com/raw/f7pL929N"
    //https://pastebin.com/bYC57zSQ
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
    
    try {
        if (blueprintString.indexOf("404 (Not Found)") === -1){
            var jsonObject = decodeBlueprint(blueprintString)
            var itemCount = getItemCount(jsonObject)
            var materialCount = getMaterialCount(itemCount)
            var outputString = convertItemCountToString(materialCount)
            t2.value = outputString
        }
        else {
            t2.value = "Not a valid pastebin!\nIf I am mistaken, please go to\n{}\nand paste the blueprint string instead of the pastebin.".format(getPastebinUrl(inputValue))
        }
    }
    catch(err) {
        t2.value = "Not a valid blueprint!"
    }
}