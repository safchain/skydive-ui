import Vue from "vue";

import NodeComponent from "./node";

export default Vue.extend({
    template: `
        <div :id="model.ID" v-bind:class="['container', clazz]" style="display: inline-block">
            <div class="header" style="text-align: center">
                <span title>This is a container {{model.name}}</span>
            </div>
            <div :id="model.ID + '-content'" v-bind:style="{display: (direction == 'horizontal' ? 'inline-flex': '')}">
                <div v-for="node in model.nodes">
                    <node-component :model="node" :onNodeDomUpdate="onNodeDomUpdate"/>
                </div>
                <div v-for="container in model.containers">
                    <container-component :model="container" :onNodeDomUpdate="onNodeDomUpdate"/>
                </div>
            </div>
        </div>
    `,

    name: 'container-component',

    methods: {
    },

    props: [
        'model',
        'onNodeDomUpdate',
        'direction',
        'clazz'
    ],

    data() {
        return {
            observer: new MutationObserver(mutations => {
                this.onNodeDomUpdate(this.model.nodes);
            }),
            contentObserver: new MutationObserver(mutations => {
                this.onNodeDomUpdate(this.model.nodes);
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

    updated: function() {
    },

    components: {
        NodeComponent
    }
});
