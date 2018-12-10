export interface TranslationType {
    [key: string]: I18nDef | string;
}
export interface I18nDef {
    source: string;
    target: string;
    value: string;
    id: string;
    meaning: string;
    description: string;
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
    get(key: string): I18nDef | string;
    keys(): string[];
    count(): number;
    isEmpty(): boolean;
    sort(compareFn?: (a: string, b: string) => number): TranslationCollection;
    flattenValues(): void;
    merge(existingCollection: TranslationCollection): void;
    protected _out(...args: any[]): void;
}
