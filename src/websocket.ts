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

import Message from "./message"

export default class WebSocketHandler {
    endpoint: string;

    private conn: WebSocket | null = null;
    private connected = false;

    private msgHandlers = new Map<string, Array<(msg: Message) => void>>();
    private disconnectHandlers = new Array<() => void>();
    private connectHandlers = new Array<() => void>();
    private errorHandlers = new Array<() => void>();

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    connect() {
        this.conn = new WebSocket(this.endpoint);
        this.conn.onopen = () => {
            this.connected = true;

            this.connectHandlers.forEach(callback => {
                callback();
            });
        };
        this.conn.onclose = () => {
            if (this.connected) {
                this.connected = false;

                this.disconnectHandlers.forEach(callback => {
                    callback();
                });
            }
        }

        this.conn.onmessage = (r) => {
            var raw = JSON.parse(r.data);
            var msg = new Message(raw.UUID, raw.Namespace, raw.Type, raw.Obj, raw.Status)

            var handlers = this.msgHandlers.get(msg.Namespace);
            if (handlers) {
                handlers.forEach(callback => {
                    callback(msg);
                });
            }
        }
        
        this.conn.onerror = () => {
            this.errorHandlers.forEach(callback => {
                callback();
            });
        }
    }

    disconnect() {
        if (this.conn) {
            this.conn.close();
        }
    }

    send(msg: Message) {
        if (this.conn) {
            this.conn.send(JSON.stringify(msg));
        }
    }

    addConnectHandler(callback: () => void) {
        this.connectHandlers.push(callback);
        
        if (this.connected) {
            callback();
        }
    }
    
    delConnectHandler(callback: () => void) {
        this.connectHandlers.splice(
        this.connectHandlers.indexOf(callback), 1);
    }
    
    addDisconnectHandler(callback: () => void) {
        this.disconnectHandlers.push(callback);
        if (!this.connected) {
            callback();
        }
    }
    
    addErrorHandler(callback: () => void) {
        this.errorHandlers.push(callback);
    }

    addMsgHandler(namespace: string, callback: (msg: Message) => void) {
        var handlers = this.msgHandlers.get(namespace);
        if (!handlers) {
            handlers = new Array<(msg: Message) => void>();
            this.msgHandlers.set(namespace, handlers);
        }
        handlers.push(callback);
    }
}