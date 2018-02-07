import {
  SKFlowLayout,
  SKFlowLayoutOrientation,
  SKLink } from "./src/layout.ts";
import { SKInterface } from "./src/interface.ts";
import { SKNetworkNamespace } from "./src/netns.ts";
import { SKTopology } from "./src/topology.ts";
import { SKOvsBridge, SKOvsPort } from "./src/ovs.ts";
import { SKSwitch, SKSwitchPort } from "./src/switch.ts";

declare var d3: any;

var topology = new SKTopology("body", 1800, 800);

let tor = new SKSwitch("tor1", "switch", true);
topology.addFabricComponent(tor);

for (let i = 0; i != 5; i++) {
  let host = new SKNetworkNamespace("Host" + i, "host", true);

  // add fabric port
  let port = new SKSwitchPort("Port" + i);
  tor.addPort(port);

  let eth0 = new SKInterface("eth0");
  host.addInterface(eth0);
  host.addInterface(new SKInterface("eth1"));

  topology.addLink(new SKLink("SKLink", "link", port, eth0));

  topology.addNetNs(host);

  let ns1 = new SKNetworkNamespace("NetNS 1", "netns");
  ns1.addInterface(new SKInterface("lo"));
  eth0 = new SKInterface("eth0");
  ns1.addInterface(eth0);

  let ns2 = new SKNetworkNamespace("NetNS 2", "netns");
  ns2.addInterface(new SKInterface("lo"));
  let eth1 = new SKInterface("eth1")
  ns2.addInterface(eth1);

  host.addNetNS(ns1);
  host.addNetNS(ns2);

  let obridge = new SKOvsBridge("br-int", "ovsbridge");
  let oport0 = new SKOvsPort("port0", "ovsport");
  obridge.addPort(oport0);
  let oport1 = new SKOvsPort("port1", "ovsport");
  obridge.addPort(oport1);

  host.addLink(new SKLink("SKLink", "link", oport0, eth0));
  host.addLink(new SKLink("SKLink", "link", oport1, eth1));

  host.addBridge(obridge);
}

console.log("Started !!!!");
