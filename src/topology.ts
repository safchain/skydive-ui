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

import { SKEvent } from "./event.ts";
import { SKComponent } from "./component.ts";
import {
  SKFlowLayout,
  SKFlowLayoutOrientation,
  SKMargin,
  SKPadding} from "./layout.ts";

declare var d3: any;

export class SKTopology extends SKFlowLayout {

  // svg
  protected svg: any;

  constructor(selector, width: number, height: number) {
    super("Topology", "topology", SKFlowLayoutOrientation.Horizontal, {}, {x: 20, y: 20})

    this.svg = d3.select(selector)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.addDropShadowDefs();

    this.svg.node().appendChild(this.render());
  }

  private addDropShadowDefs(): void {
    var defs = this.svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "130%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 4)
        .attr("result", "blur");

    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 1)
        .attr("dy", 2)
        .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
  }

  setSize(width: number, height: number, event?: SKEvent): void {
    // do not react on event that originate from containers
    if (event && event.source === this) {
      return;
    }

    this.svg.attr('width', width);
    this.svg.attr('height', height);
  }
}