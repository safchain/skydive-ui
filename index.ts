import {
  SKFlowLayout,
  SKFlowLayoutOrientation,
  SKLink } from "./src/layout.ts";
import { SKInterface } from "./src/interface.ts";
import { SKNetworkNamespaceLayout } from "./src/netns.ts";
import { SKTopology } from "./src/topology.ts";

declare var d3: any;

var topology = new SKTopology("body", 1800, 800);

for (let i = 0; i != 1; i++) {
  let host = new SKNetworkNamespaceLayout("Host" + i, "host", true);
  let eth0 = new SKInterface("eth0");
  host.addComponent(eth0);
  host.addComponent(new SKInterface("eth1"));

  topology.addComponent(host);

  let ns1 = new SKNetworkNamespaceLayout("NetNS 1", "netns");
  ns1.addComponent(new SKInterface("lo"));
  ns1.addComponent(new SKInterface("eth0"));

  let ns2 = new SKNetworkNamespaceLayout("NetNS 2", "netns");
  ns2.addComponent(new SKInterface("lo"));
  let eth1 = new SKInterface("eth1")
  ns2.addComponent(eth1);

  host.addComponent(ns1);
  host.addComponent(ns2);

  host.addLink(new SKLink("SKLink", "link", eth0, eth1));
}

console.log("Started !!!!");
