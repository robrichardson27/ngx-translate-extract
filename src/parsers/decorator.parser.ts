import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection, I18nDef } from '../utils/translation.collection';
import * as ts from 'typescript';

export class DecoratorParser extends AbstractAstParser implements ParserInterface {

	protected _sourceFile: ts.SourceFile;

	public extract(contents: string, path?: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		this._sourceFile = this._createSourceFile(path, contents);
		const decoratorNodes = this._findDecoratorNodes(this._sourceFile);
		decoratorNodes.forEach(decoratorNode => {

			const callNodes = this._findCallNodes(decoratorNode);
			callNodes.forEach(callNode => {
				const values: any = this._getCallArgStrings(callNode);
				if (values && values as I18nDef) {
					// Check for duplicates
					collection.checkForDuplicateIds(values);
					// Add i18nDef object as Translation Type
					collection = collection.addObjectKeys(values);
				}
			});
		});
		return collection;
	}

	/**
	 * Find all calls to decorator function
	 */
	protected _findCallNodes(node?: ts.Node): ts.CallExpression[] {
		if (!node) {
			node = this._sourceFile;
		}

		let callNodes = this._findNodes(node, ts.SyntaxKind.CallExpression) as ts.CallExpression[];
		callNodes = callNodes
			.filter(callNode => {
				// Only call expressions with arguments
				if (callNode.arguments.length < 1) {
					return false;
				}

				const identifier = (callNode.getChildAt(0) as ts.Identifier).text;
				if (identifier !== 'Translate') {
					return false;
				}
				return true;
			});

		return callNodes;
	}

	/**
	 * Find class nodes
	 */
	protected _findDecoratorNodes(node: ts.Node): ts.Decorator[] {
		return this._findNodes(node, ts.SyntaxKind.Decorator) as ts.Decorator[];
	}
}
