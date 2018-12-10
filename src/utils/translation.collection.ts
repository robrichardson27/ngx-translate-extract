//TODO: Expand interface to include id, description and meaning to JSON output
import * as flat from 'flat';
import * as chalk from 'chalk';

export interface TranslationType {
	[key: string]: I18nDef | string
}

// TODO: add source and target to hold translated strings.
export interface I18nDef {
	source: string,
	target: string,
	value: string,
	id: string,
	meaning: string,
	description: string
}

export class TranslationCollection {

	public values: TranslationType = {};

	public constructor(values: TranslationType = {}) {
		this.values = values;
	}

	public add(key: string, val: I18nDef = <I18nDef> {}): TranslationCollection {
		return new TranslationCollection(Object.assign({}, this.values, { [key]: val }));
	}

	public addKeys(keys: string[]): TranslationCollection {
		//console.log('## addKeys: ', keys);
		const values = keys.reduce((results, key) => {
			results[key] = '';
			console.log(results);
			return results;
		}, <TranslationType> {});
		return new TranslationCollection(Object.assign({}, this.values, values));
	}

	public addObjectKeys(obj: I18nDef) {
		//console.log('## addObjectKeys', obj);
		let newObj: any = {};
		newObj[obj.id] = obj;
		return new TranslationCollection(Object.assign({}, this.values, newObj));
	}

	public remove(key: string): TranslationCollection {
		return this.filter(k => key !== k);
	}

	public forEach(callback: (key?: string, val?: I18nDef) => void): TranslationCollection {
		Object.keys(this.values).forEach(key => callback.call(this, key, this.values[key]));
		return this;
	}

	public filter(callback: (key?: string, val?: I18nDef) => boolean): TranslationCollection {
		let values: TranslationType = {};
		this.forEach((key: string, val: I18nDef) => {
			if (callback.call(this, key, val)) {
				values[key] = val;
			}
		});
		return new TranslationCollection(values);
	}

	public union(collection: TranslationCollection): TranslationCollection {
		return new TranslationCollection(Object.assign({}, this.values, collection.values));
	}

	public intersect(collection: TranslationCollection): TranslationCollection {
		let values: TranslationType = {};
		this.filter(key => collection.has(key))
			.forEach((key: string, val: I18nDef) => {
				values[key] = val;
			});

		return new TranslationCollection(values);
	}

	public has(key: string): boolean {
		return this.values.hasOwnProperty(key);
	}

	public get(key: string): I18nDef | string {
		return this.values[key];
	}

	public keys(): string[] {
		return Object.keys(this.values);
	}

	public count(): number {
		return Object.keys(this.values).length;
	}

	public isEmpty(): boolean {
		return Object.keys(this.values).length === 0;
	}

	public sort(compareFn?: (a: string, b: string) => number): TranslationCollection {
		let values: TranslationType = {};
		this.keys().sort(compareFn).forEach((key) => {
			values[key] = this.get(key);
		});

		return new TranslationCollection(values);
	}

	public flattenValues() {
		this.values = flat.flatten(this.values);
	}

	// public deepMerge(collection: TranslationCollection): TranslationCollection {
	// 	this._out(chalk.gray('\n----- Existing Collection -----\n'));
	// 	console.log(collection.values);
	// 	const values = this.values;
	// 	this._out(chalk.gray('\n----- This Collection -----\n'));
	// 	console.log(values);
	//
	// 	return this.merge(values, collection.values);
	// }

	// Merge a `source` object to a `target` recursively
	public merge(existingCollection: TranslationCollection): void {
		this._out(chalk.gray('\n//////////////////////////////////////\n'));

		//console.log('## TARGET', target);
		//console.log('## SOURCE', source);

		// Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
		for (let key of Object.keys(this.values)) {


			console.log(key);
			let t = flat.unflatten(this.values[key], {
				object: true
			});
			console.log('targetCollection item: ', t);
			let s: I18nDef = flat.unflatten(existingCollection.values[key], {
				object: true
			});
			if (Object.keys(t) === 'value')
			console.log('sourceCollection item: ', s);

		//	this.values[key] = existingCollection.values[key];
			//if (item.value )
			//let tObj = target

			//if (key === 'target') {
				//uflatten target key, unflatten source key
				//console.log('source: ', source[key]);
				//console.log('target: ', target[key]);

			//}
			//     if (source[key] === target[key]) {
			//         console.log('## KEY: ', key);
			//         //target['target'] = source['target'];
			//         console.log(source['target']);
			//         console.log(source);
			//         //return source;
			//     }
			// } else {
			//console.log('## TARGET: ', target);
			//console.log('## SOURCE: ', source);
			// 	if (source[key] instanceof Object && key in target) {
			//
			// 		//console.log('## TARGET: ', target);
			// 		//console.log('## SOURCE: ', source);
			// 		Object.assign(source[key], this.merge(target[key], source[key]));
			// 	}
			// }
			// }
		}
		this._out(chalk.gray('\n//////////////// target ///////////////\n'));
		console.log(this.values);
		this._out(chalk.gray('\n///////////////// source ///////////////\n'));
		console.log(existingCollection);
		// Join `target` and modified `source`

		this._out(chalk.gray('\n//////////////////////////////////////\n'));
		let c = Object.assign( this.values, existingCollection.values);
		console.log(c);

		//this.values = c;
		//return new TranslationCollection(c);
	}

	protected _out(...args: any[]): void {
		console.log.apply(this, arguments);
	}
}
