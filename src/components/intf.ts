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

import * as IntfImg from '../../assets/img/intf.png';

import EntityComponent from './entity'

import IntfModel from '../models/intf'

export default Vue.extend({
    extends: EntityComponent,

    template: `
        <div :id="id" :class="['node', model.type, model.metadata.State, highlighted]" v-on:mouseover="mouseOver" v-on:mouseout="mouseOut">
            <img :src="intfImg" width="32" height="32"/><br/>
            <span class="intf-name">{{model.name}}</span>
        </div>
    `,

    props: {
        model: {
            type: IntfModel,
            required: true
        }
    },

    computed: {
        highlighted: function() {
            return this.model.highlighted ? 'highlighted' : '';
        }
    },

    data() {
        return {
            intfImg: IntfImg
        }
    },

    methods: {
        mouseOver: function() {
            this.model.highlighted = true;
        },

        mouseOut: function() {
            this.model.highlighted = false;
        }
    }
});
