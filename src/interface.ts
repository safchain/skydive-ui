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
import * as intfImg from "../assets/img/intf.png";

declare var d3: any;

export class SKInterface extends SKComponent {

  protected img: string;

  // svg obj
  private svgImg: any;

  constructor(name: string, clazz: string = "sk-interface") {
    super(name, clazz);

    this.name = name;
    this.clazz = clazz;

    this.svgImg = this.svgG.append("image")
      .attr("xlink:href", intfImg)
      .attr("width", "32px")
      .attr("height", "32px");

    this.svgG.append("text")
      .attr("y", 52)
      .text(this.name);

    this.setSize(32, 56);
  }
}
