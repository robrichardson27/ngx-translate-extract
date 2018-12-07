"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            results[key] = '';
            console.log(results);
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
        return new TranslationCollection(this._mergeDeep({}, this.values, collection.values));
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
    TranslationCollection.prototype._isObject = function (item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    };
    TranslationCollection.prototype._mergeDeep = function (target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        if (!sources.length) {
            return target;
        }
        var source = sources.shift();
        if (this._isObject(target) && this._isObject(source)) {
            for (var key in source) {
                if (this._isObject(source[key])) {
                    console.log('## TARGET KEY: ', target[key]);
                    if (!target[key]) {
                        Object.assign(target, (_a = {}, _a[key] = {}, _a));
                    }
                    this._mergeDeep(target[key], source[key]);
                }
                else {
                    Object.assign(target, (_b = {}, _b[key] = source[key], _b));
                }
            }
        }
        return this._mergeDeep.apply(this, [target].concat(sources));
        var _a, _b;
    };
    return TranslationCollection;
}());
exports.TranslationCollection = TranslationCollection;
//# sourceMappingURL=translation.collection.js.map