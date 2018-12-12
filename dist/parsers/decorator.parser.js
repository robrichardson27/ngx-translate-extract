"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_ast_parser_1 = require("./abstract-ast.parser");
var translation_collection_1 = require("../utils/translation.collection");
var ts = require("typescript");
var DecoratorParser = (function (_super) {
    __extends(DecoratorParser, _super);
    function DecoratorParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DecoratorParser.prototype.extract = function (contents, path) {
        var _this = this;
        var collection = new translation_collection_1.TranslationCollection();
        this._sourceFile = this._createSourceFile(path, contents);
        var decoratorNodes = this._findDecoratorNodes(this._sourceFile);
        decoratorNodes.forEach(function (decoratorNode) {
            var callNodes = _this._findCallNodes(decoratorNode);
            callNodes.forEach(function (callNode) {
                var values = _this._getCallArgStrings(callNode);
                if (values && values) {
                    collection.checkForDuplicateIds(values);
                    values.location = _this._getSourceFileLocation(callNode);
                    collection = collection.addObjectKeys(values);
                }
            });
        });
        return collection;
    };
    DecoratorParser.prototype._findCallNodes = function (node) {
        if (!node) {
            node = this._sourceFile;
        }
        var callNodes = this._findNodes(node, ts.SyntaxKind.CallExpression);
        callNodes = callNodes
            .filter(function (callNode) {
            if (callNode.arguments.length < 1) {
                return false;
            }
            var identifier = callNode.getChildAt(0).text;
            if (identifier !== 'Translate') {
                return false;
            }
            return true;
        });
        return callNodes;
    };
    DecoratorParser.prototype._findDecoratorNodes = function (node) {
        return this._findNodes(node, ts.SyntaxKind.Decorator);
    };
    return DecoratorParser;
}(abstract_ast_parser_1.AbstractAstParser));
exports.DecoratorParser = DecoratorParser;
//# sourceMappingURL=decorator.parser.js.map