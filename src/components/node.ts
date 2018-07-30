import Vue from "vue";

export default Vue.extend({
    template: `
        <div :id="model.ID" class="node">
            This is an node {{model.name}}
        </div>
    `,
    props: [
        'model', 
        'onNodeDomUpdate'
    ],

    data() {
        return {
            observer: new MutationObserver(mutations => {
                console.log(mutations);
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
    },

    components: {
    }
});
