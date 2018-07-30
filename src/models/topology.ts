import Container from './container'
import Link from './link'

export default class Topology {
    ID: string
    name: string
    containers = new Array<Container>()
    links = new Array<Link>()

    constructor(id: string, name: string) {
        this.ID = id;
        this.name = name;
    }

    addContainer(container: Container) {
        this.containers.push(container);
    }

    addLink(link: Link) {
        this.links.push(link);
    }
}