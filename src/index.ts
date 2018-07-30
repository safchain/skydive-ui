import Vue from "vue";

import TopologyComponent from "./components/topology";
import Topology from "./models/topology";
import Container from "./models/container";
import Node from "./models/node";
import Link from "./models/link";

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <topology-component name="big one" :model="model" />
    </div>
    `,
    data: {
        model: new Topology("TOPO1", "Skydive topology")
    },

    created: function() {
        var ct1 = new Container("CT1", "container 1");
        var ct2 = new Container("CT2", "container 2");

        var ct11 = new Container("CT11", "container 11");
        ct1.addContainer(ct11);
        ct11.addNode(new Node("N11_1", "node 11"))

        var n1_1 = new Node("N1_1", "node 1");
        var n1_2 = new Node("N1_2", "node 2");
        ct1.addNode(n1_1);
        ct1.addNode(n1_2);

        var n2_1 = new Node("N2_1", "node 1");
        var n2_2 = new Node("N2_2", "node 2");
        ct2.addNode(n2_1);
        ct2.addNode(n2_2);

        this.model.addContainer(ct1);
        this.model.addContainer(ct2);

        this.model.addLink(new Link("L1", n1_1, n2_2));

        var self = this;
        setTimeout(function() {
            var n1_3 = new Node("N1_3", "node 3");
            ct1.addNode(n1_3);

            self.model.addLink(new Link("L2", n1_3, n2_1));
        }, 5000);
    },

    components: {
        TopologyComponent
    }
});