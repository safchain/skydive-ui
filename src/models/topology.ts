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
import Switch from './switch'
import Host from './host'
import Link from './link'

export default class Topology extends Entity {
    switches = new Array<Switch>();
    hosts = new Array<Host>();
    links = new Array<Link>();

    constructor(id: string, name: string) {
       super(id, name, "topology");
    }

    addSwitch(sw: Switch) {
        this.switches.push(sw);
    }

    addHost(host: Host) {
        this.hosts.push(host);
    }

    addLink(link: Link) {
        this.links.push(link);
    }
}