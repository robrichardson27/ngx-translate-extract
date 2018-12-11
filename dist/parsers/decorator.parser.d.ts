import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';
import * as ts from 'typescript';
export declare class DecoratorParser extends AbstractAstParser implements ParserInterface {
    protected _sourceFile: ts.SourceFile;
    extract(contents: string, path?: string): TranslationCollection;
    protected _findCallNodes(node?: ts.Node): ts.CallExpression[];
    protected _findDecoratorNodes(node: ts.Node): ts.Decorator[];
}
