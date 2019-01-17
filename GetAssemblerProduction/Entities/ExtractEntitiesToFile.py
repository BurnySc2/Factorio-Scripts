
import os
import re
import base64
import zlib
import json
import time
from slpp import slpp as lua # https://github.com/SirAnthony/slpp


def convertLuaTableToJson(luaTable):
    if luaTable.startswith("data:extend("):
        luaTable = luaTable[len("data:extend(") : -1]
    pythonJson = lua.decode(luaTable)
    return pythonJson

def readLuaFile(filePath):    
    start = "data:extend\("
    end = "\)"
    # inBetween = "\{(\s*\{(.)+\},?\s*)+\}"
    inBetween = "(\s*.+\s*)+"
    regexSearchString = "({}{}{})".format(start, inBetween, end)
    reSearch = re.compile(regexSearchString)
    with open(filePath) as file:
        content = file.read()
        results = reSearch.findall(content)
        if results == []:
            return []
        foundData = [x[0] for x in results][0]
        return foundData

def readLuaToJson(factorioPath, relPath, filenamesContain = ["entities"]):
    returnList = []
    for fileName in os.listdir(os.path.join(factorioPath, relPath)):
        if len(filenamesContain) > 0 and filenamesContain[0] not in fileName: #TODO:
            continue
        filePath = os.path.join(factorioPath, relPath, fileName)
        fileContents = readLuaFile(filePath)
        if fileContents == []:
            continue
        jsonData = convertLuaTableToJson(fileContents)
        returnList.extend(jsonData)
    returnList = [x for x in returnList if type(x) == type({})]
    returnJson = {x.get("name", "noName"): x for x in returnList}
    return returnJson


if __name__ == "__main__":
    factorioPath = r"C:\Program Files (x86)\Steam\SteamApps\common\Factorio"
    path = os.path.dirname(__file__)

    # recipeRelPath = r"data\base\prototypes\recipe"
    # entityRelPath = r"data\base\prototypes\entity"
    # graphicsRelPath = r"data\base\graphics\entity"
    # cacheRelPath = "cache"

    # # make cache directory
    # if not os.path.isdir(os.path.join(path, cacheRelPath)):
    #     os.makedirs(os.path.join(path, cacheRelPath))

    # # saving entities to entities.json, acts like "caching"    
    # if os.path.isfile(os.path.join(path, cacheRelPath, "entities.json")):
    #     with open(os.path.join(path, cacheRelPath, "entities.json")) as f:
    #         entityJson = json.load(f)
    # else:
    #     entityJson = readLuaToJson(factorioPath, entityRelPath, filenamesContain = ["entities"])
    #     with open(os.path.join(path, cacheRelPath, "entities.json"), "w") as f:
    #         json.dump(entityJson, f, indent=4)

    entityRelPath = r"data\base\prototypes\entity"
    if os.path.isfile(os.path.join(path, "entities.json")):
        # with open(os.path.join(path, cacheRelPath, "recipes.json")) as f:
        #     recipeJson = json.load(f)
        pass
    else:
        entityJson = readLuaToJson(factorioPath, entityRelPath, filenamesContain = [])
        with open(os.path.join(path, "entities.json"), "w") as f:
            json.dump(entityJson, f, indent=4)