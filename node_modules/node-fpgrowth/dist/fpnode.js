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
