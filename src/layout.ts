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

import debounce = require("debounce");

declare var d3: any;

export class SKLink {

  protected name: string;
  protected clazz: string;

  private component1: SKComponent;
  private component2: SKComponent;

  // relation
  container: SKContainer;

  private lineGenerator: any = d3.line().curve(d3.curveBasis);

  // svg
  protected svgG: any;
  protected svgPath: any;

  constructor(name: string, clazz: string, component1: SKComponent, component2: SKComponent) {
    this.name = name;
    this.clazz = clazz;

    this.component1 = component1;
    component1.addUpdatedListenner(this.invalidate.bind(this));

    this.component2 = component2;
    component2.addUpdatedListenner(this.invalidate.bind(this));

    var gDom =  document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svgG = d3.select(gDom).attr("class", this.clazz);

    // create the path
    this.svgPath = this.svgG.append("path")
      .attr("style", "marker-start: url(#markerSquare); marker-end: url(#markerSquare);");

    this.invalidate()
  }

  endpoint(component: SKComponent, x1: number, y1: number, side: string): Array<number> {
    var margin = 5;
    if (side === "top") {
      return [x1, y1 - component.height / 2 - margin];
    }
    if (side === "bottom") {
      return [x1, y1 + component.height / 2 + margin];
    }
    if (side === "left") {
      return  [x1 - component.width / 2 - margin, y1];
    }
    if (side === "right") {
      return [x1 + component.width / 2 + margin, y1];
    }
  }

  anchorSide(component: SKComponent, x1: number, y1: number, x2: number, y2: number): string {
    var w = component.width, h = component.height;
    var slope = (y1 - y2) / (x1 - x2);
    var hsw = slope * w / 2;
    var hsh = (h / 2) / slope;
    var hh = h / 2;
    var hw = w / 2;

    /*if (-hh <= hsw && hsw <= hh) {
      if (x1 < x2) {
        return "right";
      }
      return "left";
    }*/

    if (y1 > y2) {
      return "top";
    }
    return "bottom";
  }

  localPos(component: SKComponent): Array<number> {
    var x = component.x, y = component.y, container = component.container;

    while (container && this.container !== container) {
      x += container.x;
      y += container.y;

      container = container.container;
    }

    return [x, y];
  }

  controlPoint(x, y, dx, dy, side: string): Array<number> {
    if (side === "top") {
      return [x, y - dy];
    }
    if (side === "bottom") {
      return [x, y + dy];
    }
    if (side === "left") {
      return  [x - dx, y];
    }
    if (side === "right") {
      return [x + dx, y];
    }
  }

  interpolate(x1: number, y1: number, s1: string, x2: number, y2: number, s2: string): Array<Array<number>> {
    var points = [[x1, y1]];

    // 4 for now but could be a parameter of link.
    var dx = Math.floor((x2 - x1) / 4);
    var dy = Math.floor((y2 - y1) / 4);

    var c1 = this.controlPoint(x1, y1, dx, dy, s1);
    points.push(c1);

    var c2 = this.controlPoint(x2, y2, dx, dy, s2);
    points.push(c2);

    points.push([x2, y2]);

    return points;
  }

  invalidate(event?: SKEvent): void {
    var c1 = this.component1, c2 = this.component2;
    var p1 = this.localPos(c1);
    var p2 = this.localPos(c2);

    var s1 = this.anchorSide(c1,
      p1[0] + c1.width / 2, p1[1] + c1.height / 2,
      p2[0] + c2.width / 2, p2[1] + c2.height / 2);
    var s2 = this.anchorSide(c2,
      p2[0] + c2.width / 2, p2[1] + c2.height / 2,
      p1[0] + c1.width / 2, p1[1] + c1.height / 2);

    var e1 = this.endpoint(c1, p1[0] + c1.width / 2, p1[1] + c1.height / 2, s1);
    var e2 = this.endpoint(c2, p2[0] + c2.width / 2, p2[1] + c2.height / 2, s2);

    var points = this.interpolate(e1[0], e1[1], s1, e2[0], e2[1], s2);

    var pathData = this.lineGenerator(points);
    this.svgPath.attr('d', pathData);
  }

  render(): void {
    return this.svgG.node();
  }
}

export abstract class SKContainer extends SKComponent {

  protected components: Array<SKComponent> = new Array();
  protected links: Array<SKLink> = new Array();

  // d3 model
  protected componentD3Data: any;
  protected linkD3Data: any;

  // svg
  protected svgRect: any;
  protected svgComponent: any;
  private svgLink: any;

  notifyComponents: () => void;
  invalidateLinks: () => void;

  constructor(name: string, clazz: string) {
    super(name, clazz);

    // create the bouding box
    this.svgRect = this.svgG.append("rect")
    this.svgComponent = this.svgG.append("g");
    this.svgLink = this.svgG.append("g");

    this.componentD3Data = this.svgComponent.selectAll(".component");
    this.linkD3Data = this.svgLink.selectAll(".link");

    // debounced functions
    this.notifyComponents = debounce(this._notifyComponents.bind(this), 100);
    this.invalidateLinks = debounce(this._invalidateLinks.bind(this), 100);
  }

  addComponent(component: SKComponent): void {
    this.components.push(component);
    component.container = this;

    component.addUpdatedListenner(this.invalidate.bind(this));

    this.componentD3Data = this.componentD3Data.data(this.components);
    this.componentD3Data.exit().remove();

    var enter = this.componentD3Data.enter().append((d) => { return d.render(); });
    this.componentD3Data = enter.merge(this.componentD3Data);

    // need to be implemented by a real container
    this.invalidate();
  }

  addLink(link: SKLink): void {
    this.links.push(link);
    link.container = this;

    this.linkD3Data = this.linkD3Data.data(this.links);
    this.linkD3Data.exit().remove();

    var enter = this.linkD3Data.enter().append((d) => { return d.render(); });
    this.linkD3Data = enter.merge(this.linkD3Data);

    // need to be implemented by a real container
    this.invalidate();
  }

  // debounced
  _notifyComponents(): void {
    var event = new SKEvent(this);
    for (let component of this.components) {
      component.containerUpdated(event);
    }
  }

  // debounced
  _invalidateLinks(): void {
    for (let link of this.links) {
      link.invalidate();
    }
  }

  setSize(width: number, height: number, event?: SKEvent): void {
    super.setSize(width, height);
    this.svgRect.attr("width", this.width).attr("height", this.height);

    this.notifyComponents();
  }

  abstract invalidate(event?: SKEvent): void;
}

export enum SKFlowLayoutOrientation {
  Horizontal = 0,
  Vertical = 1,
}

// margin / padding definition
export type SKMargin = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SKPadding = {
  x?: number;
  y?: number;
};

export enum SKHorizontalAlign {
  Left = 0,
  Right = 1,
  Center = 2
}

export class SKFlowLayout extends SKContainer {

  protected orientation: SKFlowLayoutOrientation
  protected margin: SKMargin;
  protected padding: SKPadding;
  protected halign: SKHorizontalAlign;

  constructor(name: string, clazz: string, orientation: SKFlowLayoutOrientation, margin: SKMargin, padding: SKPadding, halign?: SKHorizontalAlign) {
    super(name, clazz);

    this.orientation = orientation;
    this.padding = padding;
    this.margin = margin;
    this.halign = halign || SKHorizontalAlign.Center;
  }

  setSize(width: number, height: number, event?: SKEvent): void {
    super.setSize(width, height, event);

    // align content
    if (this.halign === SKHorizontalAlign.Center) {
      var width = 0, px = this.padding.x || 0;
      for (let component of this.components) {
        width += component.width + px;
      }
      width -= px;

      var x = Math.floor((this.width - width) / 2), px = this.padding.x || 0;
      if (x <= 0) {
        return;
      }

      this.componentD3Data.each((d, i) => {
        d.setPos(x, d.y, event);
        x += d.width + px;
      });
    } else if (this.halign === SKHorizontalAlign.Left) {
      // TBD
    } else if (this.halign === SKHorizontalAlign.Right) {
      // TBD
    }
  }

  invalidate(event: SKEvent): void {
    // do not react on event that originate from myself
    if (event) {
     if (event.source === this) {
       return;
      }
    } else {
      event = new SKEvent(this);
    }

    var ml = this.margin.left || 0, mr = this.margin.right || 0;
    var mt = this.margin.top || 0, mb = this.margin.bottom || 0;

    var x = ml, y = mt || 0, width = 0, height = 0;

    var px = this.padding.x || 0, py = this.padding.x || 0;
    this.componentD3Data.each((d, i) => {
      d.setPos(x, y, event);
      if (this.orientation === SKFlowLayoutOrientation.Horizontal) {
        x += d.width + px;

        if (height < d.height) height = d.height;
        width += d.width + px;
      } else {
        y += d.height + py;

        if (width < d.width) width = d.width;
        height += d.height + py;
      }
    });

    if (this.orientation === SKFlowLayoutOrientation.Horizontal) {
      width -= px;
    } else {
      height -= py;
    }
    this.setSize(width + ml + mr, height + mt + mb, event);

    // set content width to 100%
    this.componentD3Data.each((d, i) => {
      if (this.orientation === SKFlowLayoutOrientation.Vertical) {
        if (d instanceof SKContainer) {
          d.setSize(width, d.height, event);
        }
      } else if (this.orientation === SKFlowLayoutOrientation.Horizontal) {
        // TBD
      }
    });

    // debounced
    this.invalidateLinks();
  }
}
