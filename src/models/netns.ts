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

import Entity from './entity'
import Intf from './intf'
import Bridge from './bridge'

export default class NetNS extends Entity {
    intfs = new Array<Intf>();
    bridges = new Array<Bridge>();

    constructor(id: string, name: string, metadata: any) {
       super(id, name, "bridge", metadata)
    }

    addIntf(intf: Entity): void {
        this.intfs.push(intf);
        intf.parent = this;
    }

    addBridge(bridge: Bridge): void {
        this.bridges.push(bridge);
        bridge.parent = this;
    }
}