export interface TranslationType {
    [key: string]: I18nDef;
}
export interface I18nLocation {
    sourcefile: string;
    linenumber: number;
}
export interface I18nDef {
    target: string;
    value: string;
    id: string;
    meaning: string;
    description: string;
    location: I18nLocation;
}
export declare class TranslationCollection {
    values: TranslationType;
    constructor(values?: TranslationType);
    add(key: string, val?: I18nDef): TranslationCollection;
    addKeys(keys: string[]): TranslationCollection;
    addObjectKeys(obj: I18nDef): TranslationCollection;
    remove(key: string): TranslationCollection;
    forEach(callback: (key?: string, val?: I18nDef) => void): TranslationCollection;
    filter(callback: (key?: string, val?: I18nDef) => boolean): TranslationCollection;
    union(collection: TranslationCollection): TranslationCollection;
    intersect(collection: TranslationCollection): TranslationCollection;
    has(key: string): boolean;
    get(key: string): I18nDef;
    keys(): string[];
    count(): number;
    isEmpty(): boolean;
    sort(compareFn?: (a: string, b: string) => number): TranslationCollection;
    merge(existingCollection: TranslationCollection): TranslationCollection;
    checkForDuplicateIds(newValue: I18nDef): void;
    protected _update(existingValues: TranslationType): TranslationType;
    protected _printSource(key: string, value: I18nDef): void;
    protected _out(...args: any[]): void;
}
