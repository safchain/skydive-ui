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
import { SKContainer } from "./layout.ts";

declare var d3: any;

export class SKComponent {

  protected name: string;
  protected clazz: string;

  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;

  // relation
  container: SKContainer;

  // events
  protected onUpdatedListeners: Array<{(event: SKEvent): void}> = new Array();

  // svg
  protected svgG: any;

  constructor(name: string, clazz: string) {
    this.name = name;
    this.clazz = clazz;

    var gDom =  document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svgG = d3.select(gDom).attr("class", this.clazz);
  }

  render(): void {
    return this.svgG.node();
  }

  addUpdatedListenner(listener: (SKEvent) => void): void {
    this.onUpdatedListeners.push(listener);
  }

  protected notifyUpdated(event: SKEvent): void {
    for (let listener of this.onUpdatedListeners) {
      listener(event);
    }
  }

  // called by container when updated
  containerUpdated(): void {}

  setPos(x: number, y: number, event?: SKEvent): void {
    this.x = x;
    this.y = y;
    this.svgG.attr("transform", (d) => { return "translate(" + this.x + "," + this.y + ")"; })

    if (!event) {
      event = new SKEvent(this);
    }

    this.notifyUpdated(event);
  }

  setSize(width: number, height: number, event?: SKEvent): void {
    this.width = width;
    this.height = height;

    if (!event) {
      event = new SKEvent(this);
    }

    this.notifyUpdated(event);
  }
}
