import os, json
# recipe.json from:
# https://github.com/kevinta893/factorio-recipes-json


inputPath = "recipes.json"
outputPath = "datalist.html"

with open(inputPath, "r") as f:
    jsonContent = json.load(f)

allItems = set()
for item in jsonContent:
    # add item
    if "id" in item:
        # if item["id"] not in allItems:
        #     print("Adding {}".format(item["id"]))
        allItems.add(item["id"])
    # add ingredient item names
    if "recipe" in item:
        if "ingredients" in item["recipe"]:
            for ingredient in item["recipe"]["ingredients"]:
                if "id" in ingredient:
                    allItems.add(ingredient["id"])

stringStart = """<datalist id="factorioitems">"""
stringEnd = """</datalist>"""
options = ["""\t<option value="{0}">{0}</option>""".format(element) for element in sorted(allItems)]
optionsString = "\n".join(options)
outputPathPrepared = "\n".join([stringStart, optionsString, stringEnd])

with open(outputPath, "w") as f:
    f.write(outputPathPrepared)