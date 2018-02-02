import {
  SKFlowLayout,
  SKFlowLayoutOrientation,
  SKLink } from "./src/layout.ts";
import { SKInterface } from "./src/interface.ts";
import { SKNetworkNamespaceLayout } from "./src/netns.ts";

declare var d3: any;

var svg = d3.select("body").append("svg")
    .attr("width", 8000)
    .attr("height", 1200)
  .append("g");

var topology = new SKFlowLayout("Topology", "topology", SKFlowLayoutOrientation.Horizontal, {}, {x: 20, y: 20});
var components = [topology];

// append the rectangles for the bar chart
svg.selectAll(".bar")
  .data(components)
.enter()
  .append(function(d) {
    return d.render();
  });


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
