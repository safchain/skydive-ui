import Node from "./node"

export default class Link {
    ID: string
    node1: Node
    node2: Node

    constructor(id: string, node1: Node, node2: Node) {
        this.ID = id;
        this.node1 = node1;
        this.node2 = node2;
    }
}