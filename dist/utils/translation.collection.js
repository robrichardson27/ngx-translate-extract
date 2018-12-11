"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var TranslationCollection = (function () {
    function TranslationCollection(values) {
        if (values === void 0) { values = {}; }
        this.values = {};
        this.values = values;
    }
    TranslationCollection.prototype.add = function (key, val) {
        if (val === void 0) { val = {}; }
        return new TranslationCollection(Object.assign({}, this.values, (_a = {}, _a[key] = val, _a)));
        var _a;
    };
    TranslationCollection.prototype.addKeys = function (keys) {
        var values = keys.reduce(function (results, key) {
            results[key] = null;
            return results;
        }, {});
        return new TranslationCollection(Object.assign({}, this.values, values));
    };
    TranslationCollection.prototype.addObjectKeys = function (obj) {
        var newObj = {};
        newObj[obj.id] = obj;
        return new TranslationCollection(Object.assign({}, this.values, newObj));
    };
    TranslationCollection.prototype.remove = function (key) {
        return this.filter(function (k) { return key !== k; });
    };
    TranslationCollection.prototype.forEach = function (callback) {
        var _this = this;
        Object.keys(this.values).forEach(function (key) { return callback.call(_this, key, _this.values[key]); });
        return this;
    };
    TranslationCollection.prototype.filter = function (callback) {
        var _this = this;
        var values = {};
        this.forEach(function (key, val) {
            if (callback.call(_this, key, val)) {
                values[key] = val;
            }
        });
        return new TranslationCollection(values);
    };
    TranslationCollection.prototype.union = function (collection) {
        return new TranslationCollection(Object.assign({}, this.values, collection.values));
    };
    TranslationCollection.prototype.intersect = function (collection) {
        var values = {};
        this.filter(function (key) { return collection.has(key); })
            .forEach(function (key, val) {
            values[key] = val;
        });
        return new TranslationCollection(values);
    };
    TranslationCollection.prototype.has = function (key) {
        return this.values.hasOwnProperty(key);
    };
    TranslationCollection.prototype.get = function (key) {
        return this.values[key];
    };
    TranslationCollection.prototype.keys = function () {
        return Object.keys(this.values);
    };
    TranslationCollection.prototype.count = function () {
        return Object.keys(this.values).length;
    };
    TranslationCollection.prototype.isEmpty = function () {
        return Object.keys(this.values).length === 0;
    };
    TranslationCollection.prototype.sort = function (compareFn) {
        var _this = this;
        var values = {};
        this.keys().sort(compareFn).forEach(function (key) {
            values[key] = _this.get(key);
        });
        return new TranslationCollection(values);
    };
    TranslationCollection.prototype.merge = function (existingCollection) {
        existingCollection.values = this._update(existingCollection.values);
        return new TranslationCollection(Object.assign({}, this.values, existingCollection.values));
    };
    TranslationCollection.prototype.checkForDuplicateIds = function (newValue) {
        for (var _i = 0, _a = Object.keys(this.values); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key === newValue.id) {
                this._out(chalk.red('- ERROR: Duplicate IDs found in source. ID: %s'), key);
                this._out(chalk.green('- Translation files have not been updated, goodbye.\n'));
                process.exit(-1);
            }
        }
    };
    TranslationCollection.prototype._out = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(this, arguments);
    };
    TranslationCollection.prototype._update = function (flattenedValues) {
        for (var _i = 0, _a = Object.keys(this.values); _i < _a.length; _i++) {
            var key = _a[_i];
            if (flattenedValues.hasOwnProperty(key)) {
                if (this.values[key].value !== flattenedValues[key].value) {
                    this._out(chalk.yellow('- WARNING: Value changed for ID: %s, now missing a translation!'), this.values[key].id);
                    flattenedValues[key].target = '';
                    flattenedValues[key].value = this.values[key].value;
                }
                if (flattenedValues[key].description !== this.values[key].description) {
                    this._out(chalk.dim('- description changed for ID: %s'), this.values[key].id);
                    flattenedValues[key].description = this.values[key].description;
                }
                if (flattenedValues[key].meaning !== this.values[key].meaning) {
                    this._out(chalk.dim('- meaning changed for ID: %s'), this.values[key].id);
                    flattenedValues[key].meaning = this.values[key].meaning;
                }
            }
        }
        return flattenedValues;
    };
    return TranslationCollection;
}());
exports.TranslationCollection = TranslationCollection;
//# sourceMappingURL=translation.collection.js.map