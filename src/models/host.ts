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
import OvsBridge from './ovsbridge'
import NetNS from './netns'
import Bridge from './bridge';

export default class Host extends Entity {
    unknown = new Array<Intf>();
    physIntfs = new Array<Intf>();
    virtIntfs = new Array<Intf>();
    bridges = new Array<Bridge>();
    ovsBridges = new Array<OvsBridge>();
    netNSs = new Array<NetNS>();

    constructor(id: string, name: string, metadata: any) {
        super(id, name, "host", metadata);
    }

    addIntf(intf: Intf): void {
        if (intf.type === "veth" || intf.type === "tun" || intf.type === "tap" || intf.type === "internal") {
            this.virtIntfs.push(intf);
        } else {
            this.physIntfs.push(intf);
        }
        intf.parent = this;
    }

    addBridge(bridge: Entity): void {
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

    addUnknown(un: Intf) {
        this.unknown.push(un);
    }
}