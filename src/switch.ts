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

declare var d3: any;

export class SKSwitchPort extends SKInterface {}

export class SKSwitch extends SKHeaderLayout {

  private layerMargin: SKMargin = {left: 20, right: 20, top: 10, bottom: 10};
  private layerPadding: SKPadding = {x: 20, y: 20};

  private ports: SKFlowLayout = new SKFlowLayout(
    "ports", "sk-switch-ports", SKFlowLayoutOrientation.Horizontal, this.layerMargin, this.layerPadding);

  constructor(name: string, clazz: string = "switch", dropShadow?: boolean) {
    super(name, clazz, dropShadow);

    super.addComponent(this.ports);
  }

  addComponent(component: SKComponent): void {
    throw new Error("private");
  }

  addPort(port: SKSwitchPort): void {
    this.ports.addComponent(port);
  }
}
