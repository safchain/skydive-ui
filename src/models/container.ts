import Node from './node'

export default class Container {
    ID: string
    name: string
    nodes = new Array<Node>()
    containers = new Array<Container>()

    constructor(id: string, name: string) {
        this.ID = id;
        this.name = name;
    }

    addContainer(container: Container) {
        this.containers.push(container);
    }

    addNode(node: Node) {
        this.nodes.push(node);
    }
}