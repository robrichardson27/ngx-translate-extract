import * as ts from 'typescript';
import { I18nDef } from '../utils/translation.collection';
export declare abstract class AbstractAstParser {
    protected _sourceFile: ts.SourceFile;
    protected _createSourceFile(path: string, contents: string): ts.SourceFile;
    protected _getCallArgStrings(callNode: ts.CallExpression): string[] | I18nDef;
    protected _findNodes(node: ts.Node, kind: ts.SyntaxKind): ts.Node[];
    protected _syntaxKindToName(kind: ts.SyntaxKind): string;
    protected _printAllChildren(sourceFile: ts.SourceFile, node: ts.Node, depth?: number): void;
}
