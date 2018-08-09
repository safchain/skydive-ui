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

import NodeModel from "../models/node";

export default Vue.extend({
    template: `
        <div :id="id" class="container" style="display: inline-block">
            <div :id="id + '-content'" class="content" v-bind:style="{display: (direction == 'horizontal' ? 'inline-flex': '')}">
            </div>
        </div>
    `,

    name: 'holder-component',

    props: {
        id: {
            type: String,
            required: true
        },
        onDomUpdate: {
            type: Function,
            required: true
        },
        direction: {
            type: String
        },
        collapsed: {
            type: Boolean,
            default: false
        },
        model: {
            type: NodeModel
        }
    },

    data() {
        return {
            observer: new MutationObserver(mutations => {
                this.onDomUpdate();
            }),
            contentObserver: new MutationObserver(mutations => {
                this.onDomUpdate();
            }),
            resizeObserver: new ResizeObserver((entries, observer) => {
                this.onDomUpdate();
            }),
            isCollapsed: this.model ? this.model.collapsed : this.collapsed
        }
    },

    methods: {
        collapse: function() {
            this.isCollapsed = !this.isCollapsed
            if (this.model) {
                this.model.collapsed = this.isCollapsed;
            }
        }
    },

    created: function() {
        this.isCollapsed = this.collapsed;
        if (this.model) {
            this.model.collapsed = this.isCollapsed;
        }
    },

    mounted: function() {
        var target = document.getElementById(this.id);
        if (target) {
            this.observer.observe(target, { 
                characterData: true,
                attributes: true,
                childList: true 
            });
            this.resizeObserver.observe(target);
        } else {
            console.log(this.id);
        }
        
        var target = document.getElementById(this.id + '-content');
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
});
