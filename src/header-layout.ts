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
import { SKInterface } from "./interface.ts";
import {
  SKFlowLayout,
  SKFlowLayoutOrientation,
  SKMargin,
  SKPadding} from "./layout.ts";

declare var d3: any;

export class title extends SKComponent {

  protected img: string;

  // svg obj
  private svgText: any;

  constructor(name: string, clazz: string = "sk-layout-header-title") {
    super(name, clazz);

    this.name = name;
    this.clazz = clazz;

    this.svgText = this.svgG
      .append("text")
      .attr("text-anchor", "middle")
      .attr('visibility', 'hidden')
      .text(this.name);

    // hack to detect the size once added to the DOM
    var detectSize = () => {
      setTimeout(() => {
        var bb = this.svgText.node().getBBox();
        if (bb.width === 0) {
          return detectSize();
        }

        var width = bb.width, height = bb.height;
        if (this.width > width) {
          width = this.width;
        }
        if (this.height > height) {
          height = this.height;
        }
        this.setSize(width, height + 10);
      }, 100);
    };
    detectSize();
  }

  containerUpdated(event?: SKEvent): void {
    this.setSize(this.container.width, this.height);

    this.svgText
      .attr('visibility', 'visible')
      .attr('x', this.width / 2)
      .attr('y', 20);
  }
}

export class header extends SKFlowLayout {

  containerUpdated(): void {
    this.width = this.container.width;

    this.setSize(this.width, this.height);
  }
}

export class SKHeaderLayout extends SKFlowLayout {

  constructor(name: string, clazz: string, dropShadow?: boolean) {
    super(name, clazz, SKFlowLayoutOrientation.Vertical, {top: 0, bottom: 0}, {});

    if (dropShadow) {
      this.svgRect
        .style("filter", "url(#drop-shadow)");
    }

    var titleContainer = new header(
      "header", "sk-layout-header", SKFlowLayoutOrientation.Horizontal, {}, {});
    titleContainer.addComponent(new title(this.name));

    super.addComponent(titleContainer);
  }
}
