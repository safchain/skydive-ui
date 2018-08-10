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

 import { Node, Edge } from './graph'

export enum MessageType {
    SyncRequest = "SyncRequest",
    SyncReply = "SyncReply"
}

export default class Message {
    UUID: string;
    Namespace: string;
    Type: string;
    Status: number | undefined;
    Obj: Object;
    
    constructor(UUID: string, namespace: string, type: string, obj: Object, status?: number) {
        this.UUID = UUID;
        this.Type = type;
        this.Namespace = namespace;
        this.Obj = obj;
        this.Status = status;
    }
}

export class SyncReply {
    Nodes: Array<Node> = new Array<Node>();
    Edges: Array<Edge> = new Array<Edge>();
}