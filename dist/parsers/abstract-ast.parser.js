"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var AbstractAstParser = (function () {
    function AbstractAstParser() {
    }
    AbstractAstParser.prototype._createSourceFile = function (path, contents) {
        return ts.createSourceFile(path, contents, null, false);
    };
    AbstractAstParser.prototype._getCallArgStrings = function (callNode) {
        if (!callNode.arguments.length) {
            return;
        }
        var firstArg = callNode.arguments[0];
        switch (firstArg.kind) {
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.FirstTemplateToken:
                return [firstArg.text];
            case ts.SyntaxKind.ArrayLiteralExpression:
                return firstArg.elements
                    .map(function (element) { return element.text; });
            case ts.SyntaxKind.ObjectLiteralExpression:
                var i18nDef_1 = {};
                firstArg.forEachChild(function (node) {
                    var key = node.getChildAt(0).text;
                    var value = node.getChildAt(2).text;
                    if (key === 'id') {
                        i18nDef_1.id = value;
                    }
                    else if (key === 'value') {
                        i18nDef_1.value = value;
                    }
                    else if (key === 'meaning') {
                        i18nDef_1.meaning = value;
                    }
                    else if (key === 'description') {
                        i18nDef_1.description = value;
                    }
                });
                if (!i18nDef_1.id) {
                    console.log("WARNING: No id identified for " + firstArg);
                }
                return i18nDef_1;
            case ts.SyntaxKind.Identifier:
                console.log('WARNING: We cannot extract variable values passed to TranslateService (yet)');
                break;
            default:
                console.log("SKIP: Unknown argument type: '" + this._syntaxKindToName(firstArg.kind) + "'", firstArg);
        }
    };
    AbstractAstParser.prototype._findNodes = function (node, kind) {
        var _this = this;
        var childrenNodes = node.getChildren(this._sourceFile);
        var initialValue = node.kind === kind ? [node] : [];
        return childrenNodes.reduce(function (result, childNode) {
            return result.concat(_this._findNodes(childNode, kind));
        }, initialValue);
    };
    AbstractAstParser.prototype._syntaxKindToName = function (kind) {
        return ts.SyntaxKind[kind];
    };
    AbstractAstParser.prototype._printAllChildren = function (sourceFile, node, depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        console.log(new Array(depth + 1).join('----'), "[" + node.kind + "]", this._syntaxKindToName(node.kind), "[pos: " + node.pos + "-" + node.end + "]", ':\t\t\t', node.getFullText(sourceFile).trim());
        depth++;
        node.getChildren(sourceFile).forEach(function (childNode) { return _this._printAllChildren(sourceFile, childNode, depth); });
    };
    return AbstractAstParser;
}());
exports.AbstractAstParser = AbstractAstParser;
//# sourceMappingURL=abstract-ast.parser.js.map