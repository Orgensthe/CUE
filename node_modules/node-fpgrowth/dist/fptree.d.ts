import { FPNode } from './fpnode';
export interface IPrefixPath<T> {
    path: T[];
    support: number;
}
export interface ItemsCount {
    [stringifiedItem: string]: number;
}
export declare class FPTree<T> {
    readonly supports: ItemsCount;
    private _support;
    /**
     * Whether or not the tree has been built
     */
    private _isInit;
    /**
     * Root node of the FPTree
     */
    readonly root: FPNode<T>;
    /**
     * Headers table of the FPTree, ordered ASCENDINGLY by their support.
     */
    private _headers;
    readonly headers: T[];
    /**
     * All first nodes (of different items) inserted in the FPTree (Heads of node-links).
     */
    private _firstInserted;
    /**
     * All last nodes (of different items) inserted in the FPTree (Foots of node-links).
     */
    private _lastInserted;
    /**
     * FPTree is a frequent-pattern tree implementation. It consists in a compact
     * data structure that stores quantitative information about frequent patterns in
     * a set of transactions.
     *
     * @param  {ItemsCount} supports     The support count of each unique items to be inserted the FPTree.
     * @param  {number}     support      The minimum support of each frequent itemset we want to mine.
     */
    constructor(supports: ItemsCount, _support: number);
    /**
     * Builds the tree from a set of transactions.
     *
     * @param  {T[][]}      transactions The unsorted transactions.
     * @return {FPTree<T>}               Method chaining.
     */
    fromTransactions(transactions: T[][]): FPTree<T>;
    /**
     * Builds the tree from a set of prefix paths.
     *
     * @param  {IPrefixPath<T>[]} prefixPaths The prefix paths.
     * @return {FPTree<T>}                    Method chaining.
     */
    fromPrefixPaths(prefixPaths: IPrefixPath<T>[]): FPTree<T>;
    /**
     * Returns a new conditional FPTree from a given item.
     * If item is not included in the current tree, or if the resulting tree is empty, returns null.
     *
     * @param  {T}         item The conditional item.
     * @return {FPTree<T>}      The result you expect.
     */
    getConditionalFPTree(item: T): FPTree<T>;
    /**
     * Returns all the prefix paths of a given item in the tree.
     * Returns an empty array if item cannot be found in the current tree.
     *
     * @param  {T}              item The item you want the prefix paths.
     * @return {IPrefixPath<T>}      The result you expect.
     */
    getPrefixPaths(item: T): IPrefixPath<T>[];
    /**
     * Return the prefix path of a given node.
     * Callback functions allows to keep track of items added to the prefix path.
     *
     * @param  {FPNode<T>} node             The node you want the prefix path.
     * @param  {Function}  onPushingNewItem Callback function to keep track of items added to the prefix path.
     * @return {[type]}                     The result you expect.
     */
    getPrefixPath(node: FPNode<T>, onPushingNewItem?: (item: T, count: number) => void): IPrefixPath<T>;
    /**
     * Returns whether or not this FPTree is single pathed.
     *
     * @return {boolean} The result you expect.
     */
    isSinglePath(): boolean;
    /**
     * Returns the single path of the tree, if it is one. Else, it returns null.
     *
     * @return {FPNode<T>[]} The result you expect.
     */
    getSinglePath(): FPNode<T>[];
    /**
     * Inserts a sorted transaction to the FPTree.
     *
     * @param {T[]} items The set of sorted items you want to add (Either a transaction of a prefix part).
     * @param {number} prefixSupport Optional: The base support to associate with the set of items.
     */
    private _addItems(items, prefixSupport?);
    /**
     * RECURSIVE CALL - Returns the prefix path of each node of the same type until there is no node-link anymore.
     *
     * @param  {FPNode<T>} node             The node of which you want the prefix path.
     * @param  {number}    count            The support of the stating node (which is node).
     * @param  {Function}  onPushingNewItem Callback function to keep track of items added to the prefix path.
     * @return {IPrefixPath<T>[]}           The result you expect.
     */
    private _getPrefixPaths(node, count, onPushingNewItem?, prefixPaths?);
    /**
     * RECURSIVE CALL - Returns the prefix path (as a set of items) of the tree from a given node.
     *
     * @param  {FPNode<T>}   node               The node to start the prefix.
     * @param  {number}      count              The support of the stating node (which is node).
     * @param  {Function}    onPushingNewItem   Callback function to keep track of items added to the prefix path.
     * @return {T[]}                            The result you expect.
     */
    private _getPrefixPath(node, count, onPushingNewItem?);
    /**
     * RECURSIVE CALL - Returns the single path of the tree, if it is one. Else, it returns null.
     *
     * @param  {FPNode<T>}   node          The node to test for single path.
     * @param  {FPNode<T>[]} currentPath   The current saved path.
     * @return {FPNode<T>[]}               The path to return.
     */
    private _getSinglePath(node, currentPath?);
    /**
     * Keep track of the each last inserted item of different types.
     *
     * @param {string}    key   The key as stringified item.
     * @param {FPNode<T>} child The child FPNode it represtents.
     */
    private _updateLastInserted(key, child);
    /**
     * Keep track of the first item of different type we inserted in the FPTree.
     *
     * @param {string}    key   The key as stringified item.
     * @param {FPNode<T>} child The child FPNode it represtents.
     */
    private _updateFirstInserted(key, child);
    /**
     * Returns the tree's headers as a list, sorted ASCENDINGLY by their support.
     *
     * @param  {ItemsCount} supports The support count of each items.
     * @return {T[]}                 [description]
     */
    private _getHeaderList();
}
