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

import * as OvsBridgeImg from '../../assets/img/ovsbridge.png';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faAngleDown);

import IntfComponent from "./intf";
import HolderComponent from "./holder";
import IntfsHolderComponent from "./intfs-holder";

import OvsBridgeModel from "../models/ovsbridge";

import * as Common from './common'

export default Vue.extend({
    extends: HolderComponent,

    template: `
        <div :id="id" v-bind:class="['container', 'ovsbridge']" style="display: inline-block">
            <div class="header" style="text-align: center">
                <div class="actions">
                    <div class="collapsable" :class="{'collapsed': isCollapsed}" v-on:click="collapse()">
                        <font-awesome-icon icon="angle-down"/>
                    </div>
                </div>
                <div class="title">
                    <img :src="ovsBridgeImg" width="18" height="18"/>
                    {{model.name}}
                </div>
            </div>
            <div :id="id + '-content'" v-if="!isCollapsed" class="content">
                <intfs-holder-component :id="id + '-ports'" :intfs="ports" :onDomUpdate="onDomUpdate" direction="horizontal" class="ovs-ports"/>
                <intfs-holder-component v-if="intfs.length" :id="id + '-intfs'" :intfs="intfs" :onDomUpdate="onDomUpdate" direction="horizontal" class="ovs-intfs"/>
            </div>
        </div>
    `,

    props: {
        model: {
            type: OvsBridgeModel,
            required: true
        }
    },

    computed: {
        intfs: function () {
            return Common.sortIntfByName( this.model.intfs.slice());
        },
        ports: function() {
            return Common.sortIntfByName( this.model.ports.slice());
        }
    },

    data() {
        return {
            ovsBridgeImg: OvsBridgeImg 
        }
    },

    components: {
        FontAwesomeIcon,
        IntfComponent,
        IntfsHolderComponent
    }
});
