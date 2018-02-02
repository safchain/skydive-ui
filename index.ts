import {
  SKFlowLayout,
  SKFlowLayoutOrientation,
  SKLink } from "./src/layout.ts";
import { SKInterface } from "./src/interface.ts";
import { SKNetworkNamespaceLayout } from "./src/netns.ts";

declare var d3: any;

var svg = d3.select("body").append("svg")
    .attr("width", 600)
    .attr("height", 600)
  .append("g");

var topology = new SKFlowLayout("Topology", "topology", SKFlowLayoutOrientation.Horizontal, {}, {x: 20, y: 20});

var host1 = new SKNetworkNamespaceLayout("Host1", "host")

var intf1 = new SKInterface("eth0");
var intf2 = new SKInterface("eth1");
host1.addComponent(intf1);
host1.addComponent(intf2);

var host2 = new SKNetworkNamespaceLayout("Host1", "host")
var intf3 = new SKInterface("eth0");
var intf4 = new SKInterface("eth1");
host2.addComponent(intf3);
host2.addComponent(intf4);

//var link1 = new SKLink("SKLink1", "link1", intf1, intf4);
//main.addLink(link1);

var components = [topology];


topology.addComponent(host1);
topology.addComponent(host2);

// append the rectangles for the bar chart
svg.selectAll(".bar")
  .data(components)
.enter()
  .append(function(d) {
    return d.render();
  });


console.log("Started !!!!");
