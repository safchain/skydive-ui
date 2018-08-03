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

import * as d3 from "d3";
import Link from "../models/link";

export enum LinkAnchor {
    Top = 1,
    Left,
    Bottom,
    Right

}

export default Vue.extend({
    template: `
        <g :id="id"></g>
    `,
    props: {
        id: {
            type: String,
            required: true
        },
        x1: {
            type: Number,
            required: true
        },
        y1: {
            type: Number,
            required: true
        },
        anchor1: {
            type: Number,
            required: true
        },
        x2: {
            type: Number,
            required: true
        },
        y2: {
            type: Number,
            required: true
        },
        anchor2: {
            type: Number,
            required: true
        },
    },

    data() {
        return {
            lineGenerator: d3.line().curve(d3.curveBasis),
            path: d3.select("#" + this.id)
        }
    },

    mounted: function() {
        this.path = d3.select("#" + this.id).append("path")
            .attr("style", "marker-start: url(#markerSquare); marker-end: url(#markerSquare);")
            .attr("d", "" + this.pathData());
    },

    watch: {
        x1: function(n: any, o: any): void {
            this.updatePath();
        },
        y1: function(n: any, o: any): void {
            this.updatePath();
        },
        x2: function(n: any, o: any): void {
            this.updatePath();
        },
        y2: function(n: any, o: any): void {
            this.updatePath();
        }
    },

    methods: {
        updatePath: function() {
            this.path
                .transition()
                .attr('d', "" + this.pathData());
        },

        controlPoint(x: number, y: number, dx: number, dy: number, anchor: LinkAnchor): [number, number] {
            if (anchor === LinkAnchor.Top) {
              return [x, y - dy];
            }
            if (anchor === LinkAnchor.Bottom) {
              return [x, y + dy];
            }
            if (anchor === LinkAnchor.Left) {
              return  [x - dx, y];
            }
            
            // right
            return [x + dx, y];
        },

        pathData: function(): string | null {
            var points: [number, number][] = [[this.x1, this.y1]];
        
            // 4 for now but could be a parameter of link.
            var dx = Math.floor((this.x2 - this.x1) / 4);
            var dy = Math.floor((this.y2 - this.y1) / 4);

            var c1 = this.controlPoint(this.x1, this.y1, dx, dy, this.anchor1);
            points.push(c1);
        
            var c2 = this.controlPoint(this.x2, this.y2, dx, dy, this.anchor2);
            points.push(c2);
        
            points.push([this.x2, this.y2]);

            return this.lineGenerator(points);
        }
    }
});