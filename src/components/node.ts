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

export default Vue.extend({
    template: `
        <div :id="model.ID" v-bind:class="['node', model.type]">
            {{model.name}}
        </div>
    `,

    props: [
        'model',
        'onNodeDomUpdate'
    ],

    data() {
        return {
            observer: new MutationObserver(mutations => {
                this.onNodeDomUpdate(this.model);
            }),
            resizeObserver: new ResizeObserver((entries, observer) => {
                this.onNodeDomUpdate(this.model);
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
    },

    beforeDestroy: function() {
        this.observer.disconnect();
        this.resizeObserver.disconnect();
    },

    components: {
    }
});
