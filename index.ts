import {
  SKFlowLayout,
  SKFlowLayoutOrientation,
  SKLink } from "./src/layout.ts";
import { SKInterface } from "./src/interface.ts";
import { SKNetworkNamespaceLayout } from "./src/netns.ts";
import { SKTopology } from "./src/topology.ts";

declare var d3: any;

var topology = new SKTopology("body", 1800, 800);

for (let i = 0; i != 100; i++) {
  let host1 = new SKNetworkNamespaceLayout("Host" + i, "host")

  let intf1 = new SKInterface("eth0");
  let intf2 = new SKInterface("eth1");
  host1.addComponent(intf1);
  host1.addComponent(intf2);

  topology.addComponent(host1);
}

//var link1 = new SKLink("SKLink1", "link1", intf1, intf4);
//main.addLink(link1);

console.log("Started !!!!");
