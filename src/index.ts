import Vue from "vue";

import TopologyComponent from "./components/topology";
import Topology from "./models/topology";
import Host from "./models/host";
import Intf from "./models/intf";
import OvsBridge from "./models/ovsbridge";
import OvsPort from "./models/ovsport";
import NetNS from "./models/netns";

import Link from "./models/link";

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <topology-component name="big one" :model="model" />
    </div>
    `,
    data: {
        model: new Topology("TOPO1", "Skydive topology"),
    },

    created: function() {
        for (let i = 0; i != 2; i++) {
            var host1 = new Host("HOST1", "host " + i);
            this.model.addHost(host1);

            var intf_eth0 = new Intf("INTF_ETH0_" + i, "eth0", "device")
            host1.addIntf(intf_eth0);
            host1.addIntf(new Intf("INTF_ETH1_" + i, "eth1", "device"));

            var ovs1 = new OvsBridge("OVS_" + i, "br-int");
            var port1 = new OvsPort("PORT1_0_" + i, "tap123456");
            ovs1.addPort(port1);
            var port2 = new OvsPort("PORT1_1_" + i, "tap098765");
            ovs1.addPort(port2);

            var port_eth0 = new OvsPort("PORT_ETH0_" + i, "eth0")
            
            ovs1.addPort(port_eth0);

            host1.addOvsBridge(ovs1);

            this.model.addLink(new Link("INTF_PORT_" + i, intf_eth0, port_eth0, "layer2"));

            var netns1 = new NetNS("NS1" + i, "dhcp");
            var ns1_eth0 = new Intf("NS1_ETH0_" + i, "eth0", "veth");
            netns1.addIntf(ns1_eth0);
            var ns1_lo = new Intf("NS1_LO_" + i, "lo", "loopback");
            netns1.addIntf(ns1_lo);
            host1.addNetNS(netns1);

            this.model.addLink(new Link("PORT_INTF", port1, ns1_eth0, "layer2"))

            var netns2 = new NetNS("NS2" + i, "router");
            var ns2_eth0 = new Intf("NS2_ETH0_" + i, "eth0", "veth");
            netns2.addIntf(ns2_eth0);
            var ns2_lo = new Intf("NS2_LO_" + i, "lo", "loopback");
            netns2.addIntf(ns2_lo);
            host1.addNetNS(netns2);

            this.model.addLink(new Link("PORT_INTF", port2, ns2_eth0, "layer2"))
        }
    },

    components: {
        TopologyComponent
    }
});