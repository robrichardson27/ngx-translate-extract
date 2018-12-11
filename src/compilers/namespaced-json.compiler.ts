import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';

import * as flat from 'flat';
const I18DEF_PROPERTY_ID = 'id';

export class NamespacedJsonCompiler implements CompilerInterface {

	public indentation: string = '\t';

	public extension = 'json';

	public constructor(options?: any) {
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
	}

	public compile(collection: TranslationCollection): string {
		const values: {} = flat.unflatten(collection.values, {
			object: true
		});
		return JSON.stringify(values, null, this.indentation);
	}

	public parse(contents: string): TranslationCollection {
		const values = this.flattenObject(JSON.parse(contents));
		return new TranslationCollection(values);
	}

	/**
	 * Flatten name-space JSON down to i18nDef object structure.
	 * @param ob
	 */
	private flattenObject(ob: any) {
		let toReturn: any = {};

		for (let i in ob) {
			if (!ob.hasOwnProperty(i)) {
				continue;
			}
			if ((typeof ob[i]) === 'object' && !ob[i].hasOwnProperty(I18DEF_PROPERTY_ID)) {
				let flatObject = this.flattenObject(ob[i]);
				for (let x in flatObject) {
					if (!flatObject.hasOwnProperty(x)){
						continue;
					}
					toReturn[i + '.' + x] = flatObject[x];
				}
			} else {
				toReturn[i] = ob[i];
			}
		}
		return toReturn;
	}
}
