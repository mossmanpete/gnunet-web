// pre.js - linked into each gnunet-web service
// Copyright (C) 2013  David Barksdale <amatus@amatus.name>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var WorkerMessageQueue = [];
function flush_worker_message_queue(f) {
  WorkerMessageQueue.forEach(f);
  WorkerMessageQueue = [];
}
gnunet_prerun = function() {
  ENV.GNUNET_PREFIX = "/.";
  if (ENVIRONMENT_IS_WORKER) {
    Module['print'] = function(x) {
      WorkerMessageQueue.push(x);
    };
    Module['printErr'] = Module['print'];
  }
}
if (typeof(Module) === "undefined") Module = { preRun: [] };
Module.preRun.push(gnunet_prerun);

// list of functions to call when a window is connected
var deferred_for_window = [];
// a map of window index to port
var windows = {};
// next available index
var next_window = 1;
onconnect = function(ev) {
  ev.ports[0].onmessage = get_message;
  ev.ports[0]._name = next_window;
  windows[next_window] = ev.ports[0];
  next_window++;
  deferred_for_window.forEach(function(fn) {
    fn(ev.ports[0]);
  });
  deferred_for_window = [];
};

// do to window now or defer for later
function do_to_window(fn) {
  for (var w in windows) {
    fn(w);
    return;
  }
  deferred_for_window.push(fn);
}

function get_message(ev) {
  if ('stdout' == ev.data.type) {
    var channel = new MessageChannel();
    Module['print'] = function(x) { channel.port1.postMessage(x); };
    flush_worker_message_queue(Module.print);
    ev.target.postMessage({type: 'stdout', port: channel.port2},
                          [channel.port2]);
  } else if ('connect' == ev.data.type) {
  } else if ('message' == ev.data.type) {
    var stack = Runtime.stackSave();
    var message = allocate(ev.data.array, 'i8', ALLOC_STACK);
    var size = getValue(message, 'i8') << 8 | getValue(message + 1, 'i8');
    var type = getValue(message + 2, 'i8') << 8 | getValue(message + 3, 'i8');
    var handler = SERVERS.handlers[type];
    Module.print("Got message of type " + type + " size " + size + " from "
        + ev.target._name);
    if (typeof handler === 'undefined') {
      Module.print("But I don't know what to do with it");
    } else {
      if (handler.expected_size == 0 || handler.expected_size == size) {
        Runtime.dynCall('viii', handler.callback,
            [handler.callback_cls, ev.target._name, message]);
      } else {
        Module.print("But I was expecting size " + handler.expected_size);
      }
    }
    Runtime.stackRestore(stack);
  }
}

// Ask a window to connect us to a service
function client_connect(service_name, message_port) {
  do_to_window(function(w) {
    w.postMessage({'type': 'client_connect',
      'service_name': service_name,
      'message_port': message_port}, [message_port]);
  });
}

// vim: set expandtab ts=2 sw=2:
