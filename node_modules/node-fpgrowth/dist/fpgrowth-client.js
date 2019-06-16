(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fpgrowth = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./fptree":3,"events":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FPNode = /** @class */ (function () {
    /**
     * FPNode composes an FPTree and represents a given item a item-prefix subtree.
     * It keeps track of its parent if it has any, and lists his children FPNodes.
     *
     * @param  {T}         item   The item it represents.
     * @param  {FPNode<T>} parent His parent, if it has any.
     */
    function FPNode(item, parent) {
        if (item === void 0) { item = null; }
        if (parent === void 0) { parent = null; }
        this.item = item;
        this.parent = parent;
        /**
         * Support of the FPNode. (a.k.a. "count" as defined by Han).
         */
        this.support = 1;
        /**
         * nextSameItemNode (a.k.a. "Node-link" as defined by Han):
         * Links to the next node in the FP-tree carrying the same
         * item, or null if there is none.
         */
        this.nextSameItemNode = null;
        /**
         * PUBLIC READONLY. Children of the FPNode in an array. Empty array if there is none.
         */
        this._children = [];
    }
    Object.defineProperty(FPNode.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a given item to its current children FPNodes.
     * If no child yet represents the given item, it creates a new node.
     *
     * @param  {T}         item       The item to add as a children.
     * @param  {FPNode<T>} onNewChild Callback function to call if a child is actually created for the first time. It helps keeping track of Node-Links
     * @return {[type]}               The FPNode representing the given item.
     */
    FPNode.prototype.upsertChild = function (item, onNewChild, support) {
        if (support === void 0) { support = 1; }
        var child = this.getChild(item);
        // If no child exists, creating a new node.
        if (!child) {
            child = new FPNode(item, this);
            child.support = support;
            this._children.push(child);
            // Calls callback function if any.
            if (onNewChild)
                onNewChild(child);
        }
        // Else, increment the support of the child.
        else
            child.support += support;
        return child;
    };
    /**
     * Returns the child FPNode representing a given item, if any. Returns undefined if it does not exist.
     *
     * @param  {T}         item The item.
     * @return {FPNode<T>}      The FPNode you expect, or undefined.
     */
    FPNode.prototype.getChild = function (item) {
        return this._children.find(function (child) { return child.item == item; });
    };
    return FPNode;
}());
exports.FPNode = FPNode;

},{}],3:[function(require,module,exports){
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

},{"./fpnode":2}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}]},{},[1])(1)
});
