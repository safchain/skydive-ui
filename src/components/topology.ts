/*
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import Vue from "vue";

import ResizeObserver from 'resize-observer-polyfill';

import * as _ from "lodash";
import * as d3 from "d3";

import SwitchComponent from "./switch";
import HostComponent from "./host";
import LinkComponent, { LinkAnchor } from "./link";
import TopologyModel from "../models/topology";
import LinkModel from "../models/link";
import IntfsHolderComponent from "./intfs-holder";
import Entity from "../models/entity";
import { link } from "fs";

export default Vue.extend({
    template: `
        <div class="topology" :id="id">
            <svg :id="id + '-svg'" class="links" style="pointer-events:none">
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
                <link-component v-for="link in links" :key="link.linkModel.ID" :id="link.linkModel.ID" v-bind="link" v-if="link.visible"/>
            </svg>
            <div :id="'switches-' + model.ID" class="switches">
                <switch-component v-for="sw in model.switches" :key="sw.ID" :id="sw.ID" :model="sw" :onDomUpdate="onDomUpdate" :collapsed="false"/>
            </div>
            <div :id="'hosts-' + model.ID" class="hosts">
                <host-component v-for="host in model.hosts" :key="host.ID" :id="host.ID" :model="host" :onDomUpdate="onDomUpdate" :collapsed="false"/>
            </div>
            <div :id="'unknown-' + model.ID" class="hosts">
                <intfs-holder-component :id="id + '-unknown'" :intfs="model.unknown" :onDomUpdate="onDomUpdate" :collapsed="false"/>
            </div>
        </div>
    `,

    props: {
        id: {
            type: String,
            required: true
        },
        model: {
            type: TopologyModel,
            required: true
        }
    },

    data() {
        return {
            svg: d3.select('#' + this.id + '-svg'),
            links: new Array<Link>()
        }
    },

    mounted: function() {
        this.svg = d3.select('#' + this.id + '-svg');
       
        this.resized();

        var resizeObserver = new ResizeObserver((entries, observer) => {
            this.resized();
            this.onDomUpdate();
        })

        var target = document.getElementById(this.id);
        if (target) {
            resizeObserver.observe(target);
        }

        this.updateLinks();
    },

    updated: function() {
        this.updateLinks();
    },

    methods: {
        resized: function() {
            var div = document.getElementById(this.id);
            if (!div) {
                console.error("unable to find the topology div");
                return
            }

            var width = div.offsetWidth;
            var height = div.offsetHeight;

            if (this.svg) {
                this.svg
                    .attr("width", width)
                    .attr("height", height);
            }
        },

        updateLinks: function() {
            var cmp = (l: Link, lm: LinkModel): boolean => {
                return l.linkModel.ID === lm.ID;
            }

            var toUpdate = _.intersectionWith(this.links, this.model.links, cmp);
            for (let link of toUpdate) {
                link.update();
            }

            var toDelete = _.differenceWith(this.links, this.model.links, cmp);
            for (let link of toDelete) {
                _.remove(this.links, l => { return l.linkModel.ID === link.linkModel.ID; });
            }

            var toAdd = _.differenceWith(this.model.links, this.links, (lm: LinkModel, l: Link): boolean => {
                return l.linkModel.ID === lm.ID;
            });
            for (let link of toAdd) {
                var l = new Link(link);
                this.links.push(l);
            }
        },

        onDomUpdate: function() {
            for (let link of this.links) {
                link.update();
            }
        }
    },

    components: {
        LinkComponent,
        HostComponent,
        SwitchComponent,
        IntfsHolderComponent
    }
});

class Link {
    linkModel: LinkModel;
    x1: Number = 0;
    y1: Number = 0;
    anchor1: LinkAnchor = LinkAnchor.Top;
    entity1: Entity | null = null;
    x2: Number = 0;
    y2: Number = 0;
    anchor2: LinkAnchor = LinkAnchor.Bottom;
    entity2: Entity | null = null;
    visible: Boolean = true;

    constructor(link: LinkModel) {
        this.linkModel = link;

        this.update();
    }

    anchorSide(bb: ClientRect, x1: number, y1: number, x2: number, y2: number): LinkAnchor {
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
            return LinkAnchor.Top;
        }

        return LinkAnchor.Bottom;
    }

    endpoint(bb: ClientRect, x: number, y: number, anchor: LinkAnchor): [number, number] {
        // TODO make it custom
        var margin = 5;

        if (anchor === LinkAnchor.Top) {
            return [x, y - bb.height / 2 - margin];
        }
        if (anchor === LinkAnchor.Bottom) {
            return [x, y + bb.height / 2 + margin];
        }
        if (anchor === LinkAnchor.Left) {
            return  [x - bb.width / 2 - margin, y];
        }
        
        // right
        return [x + bb.width / 2 + margin, y];
    }

    update(): void {
        var el1: HTMLElement | null = null, el2: HTMLElement | null = null;

        if (this.linkModel.entity1.isVisible()) {
            el1 = document.getElementById(this.linkModel.entity1.ID);
            this.entity1 = this.linkModel.entity1;
        } else if (this.linkModel.entity1.parent) {
            el1 = document.getElementById(this.linkModel.entity1.parent.ID);
            this.entity1 = null;
        }

        if (this.linkModel.entity2.isVisible()) {
            el2 = document.getElementById(this.linkModel.entity2.ID);
            this.entity2 = this.linkModel.entity2;
        } else if (this.linkModel.entity2.parent) {
            el2 = document.getElementById(this.linkModel.entity2.parent.ID);
            this.entity2 = null;
        }

        if (!el1 || !el2) {
            this.visible = false;
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

        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        this.x1 = e1[0] + scrollLeft;
        this.y1 = e1[1] + scrollTop;
        this.x2 = e2[0] + scrollLeft;
        this.y2 = e2[1] + scrollTop;
        this.anchor1 = a1;
        this.anchor2 = a2;
        this.visible = true;
    }
}