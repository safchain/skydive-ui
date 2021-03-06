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
import { SKHeaderLayout } from "./header-layout.ts";
import { SKBridge } from "./bridge.ts";
import {
  SKOvsPort,
  SKOvsBridge} from "./ovs.ts";

declare var d3: any;

export class SKNetworkNamespace extends SKHeaderLayout {

  private layerMargin: SKMargin = {left: 20, right: 20, top: 20, bottom: 20};
  private layerPadding: SKPadding = {x: 20, y: 20};

  protected layer1: SKFlowLayout = new SKFlowLayout(
    "layer1", "sk-netns-layer1", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);
  protected layer2: SKFlowLayout = new SKFlowLayout(
    "layer2", "sk-netns-layer2", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);
  protected layer3: SKFlowLayout = new SKFlowLayout(
    "layer3", "sk-netns-layer3", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);
  protected layer4: SKFlowLayout = new SKFlowLayout(
    "layer4", "sk-netns-layer4", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);

  constructor(name: string, clazz: string, dropShadow?: boolean) {
    super(name, clazz, dropShadow);

    super.addComponent(this.layer1);
    super.addComponent(this.layer2);
    super.addComponent(this.layer3);
    super.addComponent(this.layer4);
  }

  addComponent(component: SKComponent): void {
    throw new Error("private");
  }

  addInterface(intf: SKInterface): void {
    this.layer1.addComponent(intf);
  }

  addBridge(bridge: SKBridge): void {
    this.layer2.addComponent(bridge);
  }

  addNetNS(netns: SKNetworkNamespace): void {
    this.layer4.addComponent(netns);
  }
}
