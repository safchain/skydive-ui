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
import { SKNetworkNamespace } from "./netns.ts";

declare var d3: any;

export class SKTopology extends SKFlowLayout {

  private layerMargin: SKMargin = {left: 20, right: 20, top: 20, bottom: 20};
  private layerPadding: SKPadding = {x: 20, y: 20};

  protected layer1: SKFlowLayout = new SKFlowLayout(
    "layer1", "sk-topology-layer1", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);
  protected layer2: SKFlowLayout = new SKFlowLayout(
    "layer2", "sk-topology-layer2", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);

  // svg
  protected svg: any;

  constructor(selector, width: number, height: number) {
    super("Topology", "topology", SKFlowLayoutOrientation.Vertical, {left: 20, top: 20, right: 20, bottom: 20}, {x: 20, y: 20})

    this.svg = d3.select(selector)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.addDropShadowDefs();

    this.svg.node().appendChild(this.render());

    super.addComponent(this.layer1);
    super.addComponent(this.layer2);
  }

  private addDropShadowDefs(): void {
    var defs = this.svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "130%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 5)
        .attr("result", "blur");

    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 0)
        .attr("dy", 3)
        .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    var marker = defs.append("marker")
      .attr("id", "markerSquare")
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("refX", 4)
      .attr("refY", 4);

    marker.append("rect")
      .attr("x", 1)
      .attr("y", 1)
      .attr("width", 5)
      .attr("height", 5)
      .attr("style", "stroke: none; fill: #000000;");
  }

  setSize(width: number, height: number, event?: SKEvent): void {
    // do not react on event that originate from containers
    if (event && event.source === this) {
      return;
    }

    this.svg.attr('width', width);
    this.svg.attr('height', height);
  }

  addComponent(component: SKComponent): void {
    throw new Error("private");
  }

  addFabricComponent(component: SKComponent): void {
    this.layer1.addComponent(component);
  }

  addNetNs(netns: SKNetworkNamespace): void {
    this.layer2.addComponent(netns);
  }
}
