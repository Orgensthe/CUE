/// <reference types="node" />
import { EventEmitter } from 'events';
export interface IFPGrowthEvents<T> {
    on(event: 'data', listener: (itemset: Itemset<T>) => void): this;
    on(event: string, listener: Function): this;
}
export interface Itemset<T> {
    items: T[];
    support: number;
}
export declare class FPGrowth<T> extends EventEmitter implements IFPGrowthEvents<T> {
    private _support;
    /**
     * The transactions from which you want to mine itemsets.
     */
    private _transactions;
    /**
     * Output of the algorithm: The mined frequent itemsets.
     */
    private _itemsets;
    /**
     * FPGrowth is an algorithm for frequent item set mining and association rule
     * earning over transactional databases.
     * It was proposed by Han et al. (2000). FPGrowth is a very fast and memory efficient algorithm. It uses a special internal structure called an FP-Tree.
     *
     * @param  {number} _support 0 < _support < 1. Minimum support of itemsets to mine.
     */
    constructor(_support: number);
    /**
     * Executes the FPGrowth Algorithm.
     * You can keep track of frequent itemsets as they are mined by listening to the 'data' event on the FPGrowth object.
     * All mined itemsets, as well as basic execution stats, are returned at the end of the execution through a callback function or a Promise.
     *
     * @param  {T[][]}              transactions The transactions from which you want to mine itemsets.
     * @param  {IAprioriResults<T>} cb           Callback function returning the results.
     * @return {Promise<IAprioriResults<T>>}     Promise returning the results.
     */
    exec(transactions: T[][], cb?: (result: Itemset<T>[]) => any): Promise<Itemset<T>[]>;
    /**
     * RECURSIVE CALL - Returns mined itemset from each conditional sub-FPTree of the given FPtree.
     *
     * @param  {FPTree<T>}  tree          The FPTree you want to mine.
     * @param  {number}     prefixSupport The support of the FPTree's current prefix.
     * @param  {T[]}        prefix        The current prefix associated with the FPTree.
     * @return {Itemset<T>}               The mined itemsets.
     */
    private _fpGrowth(tree, prefixSupport, prefix?);
    /**
     * Handles the mining of frequent itemsets over a single path tree.
     *
     * @param  {FPNode<T>[]} singlePath The given single path.
     * @param  {T[]}         prefix     The prefix associated with the path.
     * @return {Itemset<T>}             The mined itemsets.
     */
    private _handleSinglePath(singlePath, prefix);
    /**
     * Returns and emit through an event a formatted mined frequent itemset.
     *
     * @param  {T[]}        itemset The items of the frequent itemset.
     * @param  {number}     support The support of the itemset.
     * @return {Itemset<T>}         The formatted itemset.
     */
    private _getFrequentItemset(itemset, support);
    /**
     * Returns the occurence of single items in a given set of transactions.
     *
     * @param  {T[][]}      transactions The set of transaction.
     * @return {ItemsCount}              Count of items (stringified items as keys).
     */
    private _getDistinctItemsCount(transactions);
}
