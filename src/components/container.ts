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

import NodeComponent from "./node";
import IntfComponent from "./intf";
import NodeModel from "../models/node";
import ContainerModel from "../models/container";

export default Vue.extend({
    template: `
        <div :id="model.ID" v-bind:class="['container', model.type]" style="display: inline-block">
            <div class="header" style="text-align: center">
                <div class="title">This is a container {{model.name}}</div>
            </div>
            <div :id="model.ID + '-content'" class="content" v-bind:style="{display: (direction == 'horizontal' ? 'inline-flex': '')}">
                <div v-for="node in model.nodes">
                    <intf-component v-if="node.type == 'device'" :model="node" :onNodeDomUpdate="onNodeDomUpdate"/>
                    <node-component v-else :model="node" :onNodeDomUpdate="onNodeDomUpdate"/>
                </div>
                <div v-for="container in model.containers">
                    <container-component :model="container" :onContainerDomUpdate="onContainerDomUpdate"/>
                </div>
            </div>
        </div>
    `,

    name: 'container-component',

    props: {
        model: {
            type: ContainerModel,
            required: true
        },
        onContainerDomUpdate: {
            type: Object,
            required: true
        },
        direction: {
            type: String
        }
    },

    data() {
        return {
            observer: new MutationObserver(mutations => {
                this.onContainerDomUpdate(this.model.nodes);
            }),
            contentObserver: new MutationObserver(mutations => {
                this.onContainerDomUpdate(this.model.nodes);
            }),
            resizeObserver: new ResizeObserver((entries, observer) => {
                this.onContainerDomUpdate(this.model.nodes);
            })
        }
    },

    mounted: function() {
        var target = document.getElementById(this.model.ID);
        if (target) {
            this.observer.observe(target, { 
                characterData: true,
                attributes: true,
                childList: true 
            });
            this.resizeObserver.observe(target);
        }
        
        var target = document.getElementById(this.model.ID + '-content');
        if (target) {
            this.contentObserver.observe(target, { 
                characterData: true,
                attributes: true,
                childList: true 
            });
        }
    },

    beforeDestroy: function() {
        this.observer.disconnect();
        this.contentObserver.disconnect();
        this.resizeObserver.disconnect();
    },

    methods: {
        onNodeDomUpdate: function(node: NodeModel) {
            this.onContainerDomUpdate(this.model.nodes);
        }
    },

    components: {
        NodeComponent,
        IntfComponent
    }
});
