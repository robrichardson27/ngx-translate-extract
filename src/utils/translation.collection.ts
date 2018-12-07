//TODO: Expand interface to include id, description and meaning to JSON output
export interface TranslationType {
	[key: string]: I18nDef | string
}

export interface I18nDef {
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
		console.log(collection.values);
		console.log(this.values);
		return new TranslationCollection(this._mergeDeep({}, this.values, collection.values));
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

	/**
	 * Simple object check.
	 * @param item
	 * @returns {boolean}
	 */
	private _isObject(item: any): any {
		return (item && typeof item === 'object' && !Array.isArray(item));
	}

	/**
	 * Deep merge two objects.
	 * target = extracted collection
	 * ...sources = existing collection
	 */
	private _mergeDeep(target: any, ...sources: any[]): any {
		if (!sources.length) {
			return target;
		}
		const source = sources.shift();

		if (this._isObject(target) && this._isObject(source)) {
			for (const key in source) {
				if (this._isObject(source[key])) {
					if (!target[key]) {
						Object.assign(target, { [key]: {} });
					}
					this._mergeDeep(target[key], source[key]);
				} else {
					console.log('#################');
					console.log('{ [', key, ']: ', source[key], ' }');
					Object.assign(target, { [key]: source[key] });
				}
			}
		}

		return this._mergeDeep(target, ...sources);
	}
}
