"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fpnode_1 = require("./fpnode");
var FPTree = /** @class */ (function () {
    /**
     * FPTree is a frequent-pattern tree implementation. It consists in a compact
     * data structure that stores quantitative information about frequent patterns in
     * a set of transactions.
     *
     * @param  {ItemsCount} supports     The support count of each unique items to be inserted the FPTree.
     * @param  {number}     support      The minimum support of each frequent itemset we want to mine.
     */
    function FPTree(supports, _support) {
        this.supports = supports;
        this._support = _support;
        /**
         * Whether or not the tree has been built
         */
        this._isInit = false;
        /**
         * Root node of the FPTree
         */
        this.root = new fpnode_1.FPNode();
        /**
         * All first nodes (of different items) inserted in the FPTree (Heads of node-links).
         */
        this._firstInserted = {};
        /**
         * All last nodes (of different items) inserted in the FPTree (Foots of node-links).
         */
        this._lastInserted = {};
    }
    Object.defineProperty(FPTree.prototype, "headers", {
        get: function () {
            return this._headers;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Builds the tree from a set of transactions.
     *
     * @param  {T[][]}      transactions The unsorted transactions.
     * @return {FPTree<T>}               Method chaining.
     */
    FPTree.prototype.fromTransactions = function (transactions) {
        var _this = this;
        if (this._isInit)
            throw new Error('Error building the FPTree');
        // Sorting the items of each transaction by their support, descendingly.
        // Items not meeting the minimum support are pruned.
        transactions.forEach(function (transaction) {
            var items = transaction
                // Pruning.
                .filter(function (item) { return _this.supports[JSON.stringify(item)] >= _this._support; })
                // Sorting.
                .sort(function (a, b) {
                var res = _this.supports[JSON.stringify(b)] - _this.supports[JSON.stringify(a)];
                if (res == 0)
                    return JSON.stringify(b).localeCompare(JSON.stringify(a));
                return res;
            });
            // Pushing formatted transaction to the tree.
            _this._addItems(items);
        });
        // Generating headers.
        this._headers = this._getHeaderList();
        this._isInit = true;
        return this;
    };
    /**
     * Builds the tree from a set of prefix paths.
     *
     * @param  {IPrefixPath<T>[]} prefixPaths The prefix paths.
     * @return {FPTree<T>}                    Method chaining.
     */
    FPTree.prototype.fromPrefixPaths = function (prefixPaths) {
        var _this = this;
        if (this._isInit)
            throw new Error('Error building the FPTree');
        // Sorting the items of each transaction by their support, descendingly.
        // Items not meeting the minimum support are pruned.
        prefixPaths.forEach(function (prefixPath) {
            var items = prefixPath.path
                // Pruning.
                .filter(function (item) { return _this.supports[JSON.stringify(item)] >= _this._support; })
                // Sorting.
                .sort(function (a, b) {
                var res = _this.supports[JSON.stringify(b)] - _this.supports[JSON.stringify(a)];
                if (res == 0)
                    return JSON.stringify(b).localeCompare(JSON.stringify(a));
                return res;
            });
            // Pushing each prefix path to the tree.
            _this._addItems(items, prefixPath.support);
        });
        // Generating headers.
        this._headers = this._getHeaderList();
        this._isInit = true;
        return this;
    };
    /**
     * Returns a new conditional FPTree from a given item.
     * If item is not included in the current tree, or if the resulting tree is empty, returns null.
     *
     * @param  {T}         item The conditional item.
     * @return {FPTree<T>}      The result you expect.
     */
    FPTree.prototype.getConditionalFPTree = function (item) {
        var start = this._firstInserted[JSON.stringify(item)];
        // Trivial pre-condition.
        if (!start)
            return null;
        var s = this.supports[JSON.stringify(item)];
        // In order to make the conditional FPTree of the given item, we need both the prefix
        // paths of the item, as well as the support of each item which composes this sub-tree.
        var conditionalTreeSupports = {};
        // Getting all prefixPaths of the given item. On pushing a new item to a prefix path, a callback
        // function is called, allowing us to update the item support.
        var prefixPaths = this._getPrefixPaths(start, s, function (i, count) {
            conditionalTreeSupports[JSON.stringify(i)] = (conditionalTreeSupports[JSON.stringify(i)] || 0) + count;
        });
        // FP-Tree is built from the conditional tree supports and the processed prefix paths.
        var ret = new FPTree(conditionalTreeSupports, this._support).fromPrefixPaths(prefixPaths);
        // If tree is not empty, return the tree.
        if (ret.root.children.length)
            return ret;
        // Else return null.
        return null;
    };
    /**
     * Returns all the prefix paths of a given item in the tree.
     * Returns an empty array if item cannot be found in the current tree.
     *
     * @param  {T}              item The item you want the prefix paths.
     * @return {IPrefixPath<T>}      The result you expect.
     */
    FPTree.prototype.getPrefixPaths = function (item) {
        if (!this._isInit)
            throw new Error('Error building the FPTree');
        var start = this._firstInserted[JSON.stringify(item)];
        if (!start)
            return [];
        return this._getPrefixPaths(start, start.support);
    };
    /**
     * Return the prefix path of a given node.
     * Callback functions allows to keep track of items added to the prefix path.
     *
     * @param  {FPNode<T>} node             The node you want the prefix path.
     * @param  {Function}  onPushingNewItem Callback function to keep track of items added to the prefix path.
     * @return {[type]}                     The result you expect.
     */
    FPTree.prototype.getPrefixPath = function (node, onPushingNewItem) {
        if (!this._isInit)
            throw new Error('Error building the FPTree');
        var path = this._getPrefixPath(node, node.support, onPushingNewItem);
        if (path.length === 0)
            return;
        return {
            support: node.support,
            path: path
        };
    };
    /**
     * Returns whether or not this FPTree is single pathed.
     *
     * @return {boolean} The result you expect.
     */
    FPTree.prototype.isSinglePath = function () {
        if (!this._isInit)
            throw new Error('Error building the FPTree');
        if (!this.getSinglePath())
            return false;
        return true;
    };
    /**
     * Returns the single path of the tree, if it is one. Else, it returns null.
     *
     * @return {FPNode<T>[]} The result you expect.
     */
    FPTree.prototype.getSinglePath = function () {
        if (!this._isInit)
            throw new Error('Error building the FPTree');
        return this._getSinglePath(this.root);
    };
    /**
     * Inserts a sorted transaction to the FPTree.
     *
     * @param {T[]} items The set of sorted items you want to add (Either a transaction of a prefix part).
     * @param {number} prefixSupport Optional: The base support to associate with the set of items.
     */
    FPTree.prototype._addItems = function (items, prefixSupport) {
        var _this = this;
        if (prefixSupport === void 0) { prefixSupport = 1; }
        // For each transaction, we start up from the root element.
        var current = this.root;
        // Keep in mind items are sorted by their support descendingly.
        items.forEach(function (item) {
            // If current item is a child of current node, updating its support and returning the child.
            // Else creating a new item element and returing this new element.
            current = current.upsertChild(item, function (child) {
                var itemKey = JSON.stringify(item);
                // Keeping track of first and last inserted elements of this type on Node creation.
                _this._updateLastInserted(itemKey, child);
                _this._updateFirstInserted(itemKey, child);
            }, prefixSupport);
        });
    };
    /**
     * RECURSIVE CALL - Returns the prefix path of each node of the same type until there is no node-link anymore.
     *
     * @param  {FPNode<T>} node             The node of which you want the prefix path.
     * @param  {number}    count            The support of the stating node (which is node).
     * @param  {Function}  onPushingNewItem Callback function to keep track of items added to the prefix path.
     * @return {IPrefixPath<T>[]}           The result you expect.
     */
    FPTree.prototype._getPrefixPaths = function (node, count, onPushingNewItem, prefixPaths) {
        if (prefixPaths === void 0) { prefixPaths = []; }
        var prefixPath = this.getPrefixPath(node, onPushingNewItem);
        if (prefixPath)
            prefixPaths.push(prefixPath);
        if (!node.nextSameItemNode)
            return prefixPaths;
        return this._getPrefixPaths(node.nextSameItemNode, count, onPushingNewItem, prefixPaths);
    };
    /**
     * RECURSIVE CALL - Returns the prefix path (as a set of items) of the tree from a given node.
     *
     * @param  {FPNode<T>}   node               The node to start the prefix.
     * @param  {number}      count              The support of the stating node (which is node).
     * @param  {Function}    onPushingNewItem   Callback function to keep track of items added to the prefix path.
     * @return {T[]}                            The result you expect.
     */
    FPTree.prototype._getPrefixPath = function (node, count, onPushingNewItem) {
        if (node.parent && node.parent.parent) {
            if (onPushingNewItem)
                onPushingNewItem(node.parent.item, count);
            return [node.parent.item].concat(this._getPrefixPath(node.parent, count, onPushingNewItem));
        }
        return [];
    };
    /**
     * RECURSIVE CALL - Returns the single path of the tree, if it is one. Else, it returns null.
     *
     * @param  {FPNode<T>}   node          The node to test for single path.
     * @param  {FPNode<T>[]} currentPath   The current saved path.
     * @return {FPNode<T>[]}               The path to return.
     */
    FPTree.prototype._getSinglePath = function (node, currentPath) {
        if (currentPath === void 0) { currentPath = []; }
        // If current node is a tree leaf, that's a win.
        if (node.children.length == 0)
            return currentPath;
        // If it has more than child, tree has more than one single path.
        if (node.children.length > 1)
            return null;
        // Else test next child for single path.
        currentPath.push(node.children[0]);
        return this._getSinglePath(node.children[0], currentPath);
    };
    /**
     * Keep track of the each last inserted item of different types.
     *
     * @param {string}    key   The key as stringified item.
     * @param {FPNode<T>} child The child FPNode it represtents.
     */
    FPTree.prototype._updateLastInserted = function (key, child) {
        var last = this._lastInserted[key];
        if (last)
            last.nextSameItemNode = child;
        this._lastInserted[key] = child;
    };
    /**
     * Keep track of the first item of different type we inserted in the FPTree.
     *
     * @param {string}    key   The key as stringified item.
     * @param {FPNode<T>} child The child FPNode it represtents.
     */
    FPTree.prototype._updateFirstInserted = function (key, child) {
        var first = this._firstInserted[key];
        if (!first)
            this._firstInserted[key] = child;
    };
    /**
     * Returns the tree's headers as a list, sorted ASCENDINGLY by their support.
     *
     * @param  {ItemsCount} supports The support count of each items.
     * @return {T[]}                 [description]
     */
    FPTree.prototype._getHeaderList = function () {
        var _this = this;
        return Object.keys(this._firstInserted)
            .sort(function (a, b) { return _this.supports[a] - _this.supports[b]; })
            .map(function (key) { return JSON.parse(key); });
    };
    return FPTree;
}());
exports.FPTree = FPTree;
