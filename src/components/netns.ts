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

import ResizeObserver from 'resize-observer-polyfill';

import HolderComponent from "./holder";
import IntfsHolderComponent from "./intfs-holder";

import NetNsModel from "../models/netns" 

export default Vue.extend({
    extends: HolderComponent,

    template: `
        <div :id="id" v-bind:class="['container', 'netns']" style="display: inline-block">
            <div class="header" style="text-align: center" v-on:click="collapse()">
                <div class="title">{{model.name}}</div>
            </div>
            <div :id="id + '-content'" v-if="!isCollapsed" class="content" v-bind:style="{display: (direction == 'horizontal' ? 'inline-flex': '')}">
                <intfs-holder-component :id="id + '-intfs'" :intfs="model.intfs" :onDomUpdate="onDomUpdate" direction="horizontal"/>
                <intfs-holder-component :id="id + '-bridges'" :intfs="model.bridges" :onDomUpdate="onDomUpdate" direction="horizontal"/>
            </div>
        </div>
    `,

    props: {
        model: {
            type: NetNsModel,
            required: true
        }
    },

    components: {
        IntfsHolderComponent
    }
});
