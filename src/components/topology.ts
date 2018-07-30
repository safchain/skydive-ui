import Vue from "vue";

import * as _ from "lodash";

import ContainerComponent from "./container";
import LinkComponent from "./link";
import TopologyModel from "../models/topology";
import LinkModel from "../models/link";
import NodeModel from "../models/node";

declare var d3: any;

enum Anchor {
    Left = 1,
    Top,
    Right,
    Bottom
}

export default Vue.extend({
    template: `
        <div class="topology" ref="topology">
            <svg :id="'svg-' + model.ID" class="links">
                <defs>
                    <marker id="markerSquare"
                        markerWidth="7"
                        markerHeight="7"
                        refX="4"
                        refY="4">
                        <rect x="1" y="1" width="5" height="5" 
                            style="stroke: none; fill: #000000;"/>
                    </marker>
                </defs>
                <g v-for="link in links">
                    {{link}}
                    <link-component :x1="link.x1" :y1="link.y1" :x2="link.x2" :y2="link.y2"/>
                </g>
            </svg>
            <div :id="model.ID">
                This is a topology {{model.name}}
                <div v-for="container in model.containers">
                    <container-component :model="container" :onNodeDomUpdate="onNodeDomUpdate"/>
                </div>
            </div>
        </div>
    `,

    props: ['model'],


    data() {
        return {
            svg: null,
            links: new Array<Link>(),
            nodeLinks: new Map<string, Array<Link>>()
        }
    },

    created: function() {
        console.log(this.model.links);
    },

    mounted: function() {
        this.svg = d3.select('#svg-' + this.model.ID);

        this.updateLinks();
    },

    updated: function() {
        this.updateLinks();
    },

    methods: {
        updateNodeLinkMap: function(link: Link) {
            var links = this.nodeLinks.get(link.linkModel.node1.ID);
            if (!links) {
                links = new Array<Link>();
                this.nodeLinks.set(link.linkModel.node1.ID, links);
            }
            links.push(link);

            links = this.nodeLinks.get(link.linkModel.node2.ID);
            if (!links) {
                links = new Array<Link>();
                this.nodeLinks.set(link.linkModel.node2.ID, links);
            }
            links.push(link);
        },

        updateLinks: function() {
            for (let l of this.model.links) {
                let updated = this.links.some(link => {
                    if (link.linkModel.ID === l.ID) {
                        link.update();
                        return true;
                    }
                    return false;
                });
                if (!updated) {
                    var link = new Link(l);
                    this.links.push(link)

                    this.updateNodeLinkMap(link);
                }
                console.log(this.links);
            }
        },

        onNodeDomUpdate: function(nodes: Array<NodeModel>) {
            for (let node of nodes) {
                var links = this.nodeLinks.get(node.ID)
                if (links) {
                    for (let link of links) {
                        link.update();
                    }
                }
            }
        }
    },

    components: {
        ContainerComponent,
        LinkComponent
    }
});

class Link {
    linkModel: LinkModel;
    x1: number = 0;
    y1: number = 0;
    x2: number = 0;
    y2: number = 0;

    constructor(link: LinkModel) {
        this.linkModel = link;

        this.update();
    }

    anchorSide(bb: ClientRect, x1: number, y1: number, x2: number, y2: number): Anchor {
        var w = bb.width, h = bb.height;
        var slope = (y1 - y2) / (x1 - x2);
        var hsw = slope * w / 2;
        var hsh = (h / 2) / slope;
        var hh = h / 2;
        var hw = w / 2;
    
        //if (-hh <= hsw && hsw <= hh) {
         // if (x1 < x2) {
         //   return "right";
         // }
         // return "left";
        //}
    
        if (y1 > y2) {
            return Anchor.Top;
        }

        return Anchor.Bottom;
    }

    endpoint(bb: ClientRect, x1: number, y1: number, anchor: Anchor): Array<number> {
        // TODO make it custom
        var margin = 5;
        
        if (anchor === Anchor.Top) {
            return [x1, y1 - bb.height / 2 - margin];
        }
        if (anchor === Anchor.Bottom) {
            return [x1, y1 + bb.height / 2 + margin];
        }
        if (anchor === Anchor.Left) {
            return  [x1 - bb.width / 2 - margin, y1];
        }
        
        // right
        return [x1 + bb.width / 2 + margin, y1];
    }

    update(): void {
        var el1 = document.getElementById(this.linkModel.node1.ID);
        var el2 = document.getElementById(this.linkModel.node2.ID);
        if (!el1 || !el2) {
            return;
        }

        var bb1 = el1.getBoundingClientRect();
        var bb2 = el2.getBoundingClientRect();
    
        var a1 = this.anchorSide(bb1,
            bb1.left + bb1.width / 2, bb1.top + bb1.height / 2,
            bb2.left + bb2.width / 2, bb2.top + bb2.height / 2);
        var a2 = this.anchorSide(bb2,
            bb2.left + bb2.width / 2, bb2.top + bb2.height / 2,
            bb1.left + bb1.width / 2, bb1.top + bb1.height / 2);
    
        var e1 = this.endpoint(bb1, bb1.left + bb1.width / 2, bb1.top + bb1.height / 2, a1);
        var e2 = this.endpoint(bb2, bb2.left + bb2.width / 2, bb2.top + bb2.height / 2, a2);
    
        this.x1 = e1[0];
        this.y1 = e1[1];
        this.x2 = e2[0];
        this.y2 = e2[1];
    }
}