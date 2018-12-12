import * as chalk from 'chalk';

export interface TranslationType {
	[key: string]: I18nDef
}

export interface I18nLocation {
	sourcefile: string,
	linenumber: number
}

export interface I18nDef {
	target: string,
	value: string,
	id: string,
	meaning: string,
	description: string,
	location: I18nLocation
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
		const values = keys.reduce((results, key) => {
			results[key] = null;
			return results;
		}, <TranslationType> {});
		return new TranslationCollection(Object.assign({}, this.values, values));
	}

	public addObjectKeys(obj: I18nDef) {
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

	public get(key: string): I18nDef {
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

	public merge(existingCollection: TranslationCollection): TranslationCollection {
		existingCollection.values = this._update(existingCollection.values);
		return new TranslationCollection(Object.assign({}, this.values, existingCollection.values));
	}

	/**
	 * Check parsed collection does not have duplicate ids so that translations cannot be overridden.
	 */
	public checkForDuplicateIds(newValue: I18nDef) {
		this.forEach((key, value) => {
			if (key === newValue.id) {
				this._out(chalk.red('- ERROR: Duplicate IDs found in source.'));
				this._printSource(key, value);
				this._out(chalk.green('- Translation files have not been updated, goodbye.\n'));
				process.exit(-1);
			}
		});
	}

	protected _update(existingValues: TranslationType): TranslationType {
		this.forEach((key, value) => {
			if (existingValues.hasOwnProperty(key)) {
				const existingValue = existingValues[key];

				if (value.value !== existingValue.value) {
					this._out(chalk.yellow('- WARNING: Value has changed for a translated string, now missing a translation.'));
					this._printSource(key, value);
					existingValue.target = '';
					existingValue.value = value.value;
				}
				if (existingValue.description !== value.description) {
					this._out(chalk.dim('- INFORMATION: Description has changed for a translated string.'));
					this._printSource(key, value);
					existingValue.description = value.description;
				}
				if (existingValue.meaning !== value.meaning) {
					this._out(chalk.dim('- INFORMATION: Meaning has changed for a translated string.'));
					this._printSource(key, value);
					existingValue.meaning = value.meaning;
				}

				existingValues[key] = existingValue;
			}
		});
		return existingValues;
	}

	protected _printSource(key: string, value: I18nDef) {
		this._out(chalk.bold('  source: %s line: %d id: %s'), value.location.sourcefile, value.location.linenumber, key);
	}

	protected _out(...args: any[]): void {
		console.log.apply(this, arguments);
	}
}
