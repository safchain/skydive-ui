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

import { v4 } from "uuid";

import WebSocketHandler from "./websocket"
import Message, { MessageType, SyncReply } from "./message"
import Topology from "./models/topology";
import Host from "./models/host";
import NetNS from "./models/netns";
import OvsBridge from "./models/ovsbridge";
import Bridge from "./models/bridge";
import Intf from "./models/intf";
import Entity from "./models/entity";
import OvsPort from "./models/ovsport";

export class Node {
    ID: string = "";
    Host: string = "";
    Metadata: {Type: string, Name: string} = {Type: "", Name: ""};
}

export class Edge {
    ID: string = "";
    Host: string = "";
    Parent: string = "";
    Child: string = "";
    parentNode: Node = new Node();
    childNode: Node = new Node();
    Metadata: {Type: string, RelationType: string} = {Type: "", RelationType: ""};
}

// shorter id
function modelID(id: string): string {
    return 'entity-' + id.split("-")[0];
}

export default class Graph {
    private nodes = new Map<String, Node>();
    private edges = new Map<String, Edge>();

    // cache to access directly to container objects
    private idToEntity = new Map<string, Entity>();

    topology = new Topology(modelID(v4()), "Network topology");

    subscribe(ws: WebSocketHandler) {
        ws.addMsgHandler("Graph", msg => {
            this.msgHandler(msg)
        });
    }

    // this method handles nodes and does the appropriate thing to translate graph
    // to model.
    private addNode(node: Node) {
        this.nodes.set(node.ID, node);

        switch (node.Metadata.Type) {
            case "host":
                var host = new Host(modelID(node.ID), node.Metadata.Name);
                this.idToEntity.set(node.ID, host);

                this.topology.addHost(host);
                break;
            case "ovsbridge":
                var ovsbridge = new OvsBridge(modelID(node.ID), node.Metadata.Name);
                this.idToEntity.set(node.ID, ovsbridge);
                break;
            case "netns":
                var netns = new NetNS(modelID(node.ID), node.Metadata.Name);
                this.idToEntity.set(node.ID, netns);
                break;
            case "bridge":
                var bridge = new Bridge(modelID(node.ID), node.Metadata.Name);
                this.idToEntity.set(node.ID, bridge);
                break;
            // ignore ofrule
            case "ofrule":
                break;
            default:
                var intf = new Intf(modelID(node.ID), node.Metadata.Name, node.Metadata.Type);
                this.idToEntity.set(node.ID, intf);        
        }
    }

    private handleHostOwnership(edge: Edge) {
        var childNode = edge.childNode;

        var entity = this.idToEntity.get(edge.parentNode.ID);
        if (!entity) {
            console.error("host node not found in the model " + edge.parentNode.ID);
            return;
        }
        var host = entity as Host;

        entity = this.idToEntity.get(edge.childNode.ID);
        if (!entity) {
            console.error("child node not found in the model " + edge.childNode.ID);
            return;
        }

        switch (childNode.Metadata.Type) {
            case "netns":
                host.addNetNS(entity as NetNS);
                break;
            case "ovsbridge":
                host.addOvsBridge(entity as OvsBridge);
                break;
            case "bridge":
                host.addBridge(entity as Bridge);
                break;
            default:
                host.addIntf(entity  as Intf);
        }
    }

    private handleNetNSOwnership(edge: Edge) {
        var childNode = edge.childNode;

        var entity = this.idToEntity.get(edge.parentNode.ID);
        if (!entity) {
            console.error("netns node not found in the model " + edge.parentNode.ID);
            return;
        }
        var netns = entity as NetNS;

        entity = this.idToEntity.get(edge.childNode.ID);
        if (!entity) {
            console.error("child node not found in the model " + edge.childNode.ID);
            return;
        }

        switch (childNode.Metadata.Type) {
            case "bridge":
                netns.addBridge(entity as Bridge);
                break;
            default:
                netns.addIntf(entity as Intf);
        }
    }


    private handleOvsBridgeOwnership(edge: Edge) {
        var childNode = edge.childNode;

        // ignore ofrule
        if (childNode.Metadata.Type === "ofrule") {
            return;
        }

        var entity = this.idToEntity.get(edge.parentNode.ID);
        if (!entity) {
            console.error("ovsbridge node not found in the model " + edge.parentNode.ID);
            return;
        }
        var ovsbridge = entity as OvsBridge;

        entity = this.idToEntity.get(edge.childNode.ID);
        if (!entity) {
            console.error("child node not found in the model " + edge.childNode.ID);
            return;
        }

        switch (childNode.Metadata.Type) {
            case "ovsport":
                ovsbridge.addPort(entity as OvsPort);
                break;
            default:
                ovsbridge.addIntf(entity as Intf);
        }
    }

    // this method handles edges and does the appropriate thing to translate graph
    // to model.
    private addEdge(edge: Edge) {
        this.edges.set(edge.ID, edge);

        if (edge.Metadata.RelationType === "ownership") {
            switch (edge.parentNode.Metadata.Type) {
                case "host":
                    this.handleHostOwnership(edge);
                    break;
                case "netns":
                    this.handleNetNSOwnership(edge);
                    break;
                case "ovsbridge":
                    this.handleOvsBridgeOwnership(edge);
                    break;                      
            }
        } else {
            
        }
    }

    msgHandler(msg: Message) {
        switch(msg.Type) {
            case MessageType.SyncReply:
                var g = msg.Obj as SyncReply;
              
                // first add all nodes
                for (let node of g.Nodes) {
                    this.addNode(node);
                }

                for (let edge of g.Edges) {
                    var parentNode = this.nodes.get(edge.Parent);
                    if (!parentNode) {
                        console.error("parent node not found with ID: " + edge.Parent);
                        continue;
                    }
                    var childNode = this.nodes.get(edge.Child);
                    if (!childNode) {
                        console.error("child node not found with ID: " + edge.Child);
                        continue;
                    }

                    edge.parentNode = parentNode;
                    edge.childNode = childNode;

                    this.addEdge(edge);
                }
        }
    }
}