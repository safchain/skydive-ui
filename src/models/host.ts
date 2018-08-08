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

import Node from './node'
import Intf from './intf'
import OvsBridge from './ovsbridge'
import NetNS from './netns'

export default class Host extends Node {

    intfs = new Array<Intf>()
    bridges = new Array<Node>()
    ovsBridges = new Array<OvsBridge>()
    netNSs = new Array<NetNS>()

    constructor(id: string, name: string) {
        super(id, name, "host");
    }

    addIntf(intf: Intf): void {
        this.intfs.push(intf);
        intf.parent = this;
    }

    addBridge(bridge: Node): void {
        this.bridges.push(bridge);
        bridge.parent = this;
    }

    addOvsBridge(ovsbridge: OvsBridge): void {
        this.ovsBridges.push(ovsbridge);
        ovsbridge.parent = this;
    }

    addNetNS(netns: NetNS): void {
        this.netNSs.push(netns);
        netns.parent = this;
    }
}