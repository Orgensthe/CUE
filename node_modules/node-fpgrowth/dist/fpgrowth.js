"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var fptree_1 = require("./fptree");
var FPGrowth = /** @class */ (function (_super) {
    __extends(FPGrowth, _super);
    /**
     * FPGrowth is an algorithm for frequent item set mining and association rule
     * earning over transactional databases.
     * It was proposed by Han et al. (2000). FPGrowth is a very fast and memory efficient algorithm. It uses a special internal structure called an FP-Tree.
     *
     * @param  {number} _support 0 < _support < 1. Minimum support of itemsets to mine.
     */
    function FPGrowth(_support /*, private _confidence: number*/) {
        var _this = _super.call(this) || this;
        _this._support = _support;
        /**
         * Output of the algorithm: The mined frequent itemsets.
         */
        _this._itemsets = [];
        return _this;
    }
    /**
     * Executes the FPGrowth Algorithm.
     * You can keep track of frequent itemsets as they are mined by listening to the 'data' event on the FPGrowth object.
     * All mined itemsets, as well as basic execution stats, are returned at the end of the execution through a callback function or a Promise.
     *
     * @param  {T[][]}              transactions The transactions from which you want to mine itemsets.
     * @param  {IAprioriResults<T>} cb           Callback function returning the results.
     * @return {Promise<IAprioriResults<T>>}     Promise returning the results.
     */
    FPGrowth.prototype.exec = function (transactions, cb) {
        var _this = this;
        this._transactions = transactions;
        // Relative support.
        this._support = Math.ceil(this._support * transactions.length);
        // First scan to determine the occurence of each unique item.
        var supports = this._getDistinctItemsCount(this._transactions);
        return new Promise(function (resolve, reject) {
            // Building the FP-Tree...
            var tree = new fptree_1.FPTree(supports, _this._support).fromTransactions(_this._transactions);
            // Running the algorithm on the main tree.
            // All the frequent itemsets are returned at the end of the execution.
            var result = _this._fpGrowth(tree, _this._transactions.length);
            if (cb)
                cb(result);
            resolve(result);
        });
    };
    /**
     * RECURSIVE CALL - Returns mined itemset from each conditional sub-FPTree of the given FPtree.
     *
     * @param  {FPTree<T>}  tree          The FPTree you want to mine.
     * @param  {number}     prefixSupport The support of the FPTree's current prefix.
     * @param  {T[]}        prefix        The current prefix associated with the FPTree.
     * @return {Itemset<T>}               The mined itemsets.
     */
    FPGrowth.prototype._fpGrowth = function (tree, prefixSupport, prefix) {
        // Test whether or not the FP-Tree is single path.
        // If it is, we can short-cut the mining process pretty efficiently.
        // TODO: let singlePath: FPNode<T>[] = tree.getSinglePath();
        // TODO: if(singlePath) return this._handleSinglePath(singlePath, prefix);
        var _this = this;
        if (prefix === void 0) { prefix = []; }
        // For each header, ordered ascendingly by their support, determining the prefix paths.
        // These prefix paths represent new transactions to mine in a new FPTree.
        // If no prefix path can be mined, the algorithm stops.
        return tree.headers.reduce(function (itemsets, item) {
            var support = Math.min(tree.supports[JSON.stringify(item)], prefixSupport);
            // Array copy.
            var currentPrefix = prefix.slice(0);
            currentPrefix.push(item);
            // Prefix is a mined itemset.
            itemsets.push(_this._getFrequentItemset(currentPrefix, support));
            // Method below generates the prefix paths of the current item, as well as the support of
            // each item composing the prefix paths, and returns a new conditional FPTree if one can be created.
            var childTree = tree.getConditionalFPTree(item);
            // If a conditional tree can be mined... mine it recursively.
            if (childTree)
                return itemsets.concat(_this._fpGrowth(childTree, support, currentPrefix));
            return itemsets;
        }, []);
    };
    /**
     * Handles the mining of frequent itemsets over a single path tree.
     *
     * @param  {FPNode<T>[]} singlePath The given single path.
     * @param  {T[]}         prefix     The prefix associated with the path.
     * @return {Itemset<T>}             The mined itemsets.
     */
    FPGrowth.prototype._handleSinglePath = function (singlePath, prefix) {
        // TODO
        return [];
    };
    /**
     * Returns and emit through an event a formatted mined frequent itemset.
     *
     * @param  {T[]}        itemset The items of the frequent itemset.
     * @param  {number}     support The support of the itemset.
     * @return {Itemset<T>}         The formatted itemset.
     */
    FPGrowth.prototype._getFrequentItemset = function (itemset, support) {
        var ret = {
            items: itemset,
            support: support
        };
        this.emit('data', ret);
        return ret;
    };
    /**
     * Returns the occurence of single items in a given set of transactions.
     *
     * @param  {T[][]}      transactions The set of transaction.
     * @return {ItemsCount}              Count of items (stringified items as keys).
     */
    FPGrowth.prototype._getDistinctItemsCount = function (transactions) {
        return transactions.reduce(function (count, arr) {
            return arr.reduce(function (count, item) {
                count[JSON.stringify(item)] = (count[JSON.stringify(item)] || 0) + 1;
                return count;
            }, count);
        }, {});
    };
    return FPGrowth;
}(events_1.EventEmitter));
exports.FPGrowth = FPGrowth;
