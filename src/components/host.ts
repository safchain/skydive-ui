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

import Vue from "vue";

import * as HostImg from '../../assets/img/host.png';
import * as NetNSImg from '../../assets/img/ns.png';

import HolderComponent from "./holder";
import IntfsHolderComponent from "./intfs-holder";
import OvsBridgeComponent from "./ovsbridge";
import NetNsComponent from "./netns";

import HostModel from "../models/host"

export default Vue.extend({
    extends: HolderComponent,

    template: `
        <div :id="id" v-bind:class="['container', model.type]">
            <div class="header" style="text-align: center" v-on:click="collapse()">
                <div class="title">
                    <img :src="hostImg" width="18" height="18"/>
                    {{model.name}}
                </div>
            </div>
            <div :id="id + '-content'" class="content" v-if="!isCollapsed" v-bind:style="{display: (direction == 'horizontal' ? 'inline-flex': '')}">
                <intfs-holder-component :id="id + '-phys-intfs'" :intfs="model.physIntfs" :onDomUpdate="onDomUpdate" direction="horizontal"/>
                <intfs-holder-component :id="id + '-bridges'" :intfs="model.bridges" :onDomUpdate="onDomUpdate" direction="horizontal"/>
                <div v-if="model.ovsBridges.length" class="ovsbridges">
                  <ovs-bridge-component v-for="bridge in model.ovsBridges" :key="bridge.ID" :id="bridge.ID" :model="bridge" :onDomUpdate="onDomUpdate" :collapsed="false"/>
                </div>
                <intfs-holder-component :id="id + '-virt-intfs'" :intfs="model.virtIntfs" :onDomUpdate="onDomUpdate" direction="horizontal"/>
                <div v-if="model.netNSs.length" class="netnss">
                    <div class="header" style="text-align: center">
                        <div class="title">
                            <img :src="netNSImg" width="18" height="18"/>
                            Containers
                        </div>
                    </div>
                    <net-ns-component v-for="netns in model.netNSs" :key="netns.ID" :id="netns.ID" :model="netns" :onDomUpdate="onDomUpdate" :collapsed="false"/>
                </div>
            </div>
        </div>
    `,

    props: {
        model: {
            type: HostModel,
            required: true
        }
    },

    data() {
        return {
            netNSImg: NetNSImg,
            hostImg: HostImg
        }
    },

    components: {
        OvsBridgeComponent,
        NetNsComponent,
        IntfsHolderComponent
    }
});
