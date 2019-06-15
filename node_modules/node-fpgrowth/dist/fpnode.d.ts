export declare class FPNode<T> {
    readonly item: T;
    readonly parent: FPNode<T>;
    /**
     * Support of the FPNode. (a.k.a. "count" as defined by Han).
     */
    support: number;
    /**
     * nextSameItemNode (a.k.a. "Node-link" as defined by Han):
     * Links to the next node in the FP-tree carrying the same
     * item, or null if there is none.
     */
    nextSameItemNode: FPNode<T>;
    /**
     * PUBLIC READONLY. Children of the FPNode in an array. Empty array if there is none.
     */
    private _children;
    readonly children: FPNode<T>[];
    /**
     * FPNode composes an FPTree and represents a given item a item-prefix subtree.
     * It keeps track of its parent if it has any, and lists his children FPNodes.
     *
     * @param  {T}         item   The item it represents.
     * @param  {FPNode<T>} parent His parent, if it has any.
     */
    constructor(item?: T, parent?: FPNode<T>);
    /**
     * Adds a given item to its current children FPNodes.
     * If no child yet represents the given item, it creates a new node.
     *
     * @param  {T}         item       The item to add as a children.
     * @param  {FPNode<T>} onNewChild Callback function to call if a child is actually created for the first time. It helps keeping track of Node-Links
     * @return {[type]}               The FPNode representing the given item.
     */
    upsertChild(item: T, onNewChild?: (child: FPNode<T>) => void, support?: number): FPNode<T>;
    /**
     * Returns the child FPNode representing a given item, if any. Returns undefined if it does not exist.
     *
     * @param  {T}         item The item.
     * @return {FPNode<T>}      The FPNode you expect, or undefined.
     */
    getChild(item: T): FPNode<T>;
}
