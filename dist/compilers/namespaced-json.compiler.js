"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../utils/translation.collection");
var flat = require("flat");
var I18DEF_PROPERTY_ID = 'id';
var NamespacedJsonCompiler = (function () {
    function NamespacedJsonCompiler(options) {
        this.indentation = '\t';
        this.extension = 'json';
        if (options && typeof options.indentation !== 'undefined') {
            this.indentation = options.indentation;
        }
    }
    NamespacedJsonCompiler.prototype.compile = function (collection) {
        var values = flat.unflatten(collection.values, {
            object: true
        });
        return JSON.stringify(values, null, this.indentation);
    };
    NamespacedJsonCompiler.prototype.parse = function (contents) {
        var values = this.flattenObject(JSON.parse(contents));
        return new translation_collection_1.TranslationCollection(values);
    };
    NamespacedJsonCompiler.prototype.flattenObject = function (ob) {
        var toReturn = {};
        for (var i in ob) {
            if (!ob.hasOwnProperty(i)) {
                continue;
            }
            if ((typeof ob[i]) === 'object' && !ob[i].hasOwnProperty(I18DEF_PROPERTY_ID)) {
                var flatObject = this.flattenObject(ob[i]);
                for (var x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) {
                        continue;
                    }
                    toReturn[i + '.' + x] = flatObject[x];
                }
            }
            else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    };
    return NamespacedJsonCompiler;
}());
exports.NamespacedJsonCompiler = NamespacedJsonCompiler;
//# sourceMappingURL=namespaced-json.compiler.js.map