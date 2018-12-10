"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../utils/translation.collection");
var flat = require("flat");
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
        return new translation_collection_1.TranslationCollection(JSON.parse(contents));
    };
    NamespacedJsonCompiler.prototype._out = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(this, arguments);
    };
    return NamespacedJsonCompiler;
}());
exports.NamespacedJsonCompiler = NamespacedJsonCompiler;
//# sourceMappingURL=namespaced-json.compiler.js.map