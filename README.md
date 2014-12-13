gnunet-web
==========

This is a port of the [GNUnet] secure peer-to-peer network to the browser using
HTTP for browser-to-native communication and soon [WebRTC] for
browser-to-browser communication.

Roadmap
-------
* Compile GNUnet using [emscripten].
    * gnunet-service-peerinfo.js - Done.
    * gnunet-service-transport.js - Done, with HTTP transport.
    * gnunet-service-ats.js - Done.
    * gnunet-daemon-topology.js - Done.
    * gnunet-service-core.js - Done.
    * gnunet-service-nse.js - Done.
    * gnunet-service-dht.js - Done.
    * gnunet-service-cadet.js - Done.
    * gnunet-service-datastore.js - Building with heap backend plugin.
        * Needs an [indexedDB] backend plugin.
    * gnunet-service-peerstore.js - Building with a broken [indexedDB] backend
      plugin.
    * gnunet-service-fs.js - Done.
* Write a minimal UI for the file-sharing service.
    * Search - Done.
    * Publish.
        * The user can only select one file at a time.
        * No directory support.
        * Needs indexedDB datastore backend for persistence.
        * Needs a GNUnet API change to access the File object piecewise instead
          of loading the entire thing into RAM.
    * Download.
        * No directory support.
        * Needs indexedDB support to store the file piecewise instead of
          storing the entire thing in RAM.
* Release alpha.
* Write a WebRTC transport plugin.
    * Implement [RFC3264] over GNUnet.

What You Can Do Now
-------------------

You will need to install [boot] to follow these instructions. Currently
gnunet-web only works in Chromium or Google Chrome.

### Try gnunet-web pre-alpha ###
0. Execute `./build-gnunet.sh`
1. Execute `boot development`
2. Open http://localhost:8000/

Each GNUnet service is running in its own [Web Worker] thread. The APIs used by
the services to schedule tasks, communicate with each other, and load plugins
are implemented as emscripten js libraries.

To debug a shared worker in chrome open chrome://inspect and click the
"inspect" link next to an entry in the shared workers list.

### Try out the RTCPeerConnection demo ###
0. Execute `boot development`
1. Open two browsers to http://localhost:8000/webrtc.html (let's call them Alice and Bob).
2. Alice presses "Create Offer" and waits a bit for ICE candidates to be
   collected.
3. Alice sends the Local Description to Bob.
4. Bob enters the description into the Remote Description box and presses
   "Set Remote Description as Offer".
5. Bob presses "Create Answer" and waits a bit for ICE candidates to be
   collected.
6. Bob sends the Local Description to Alice.
7. Alice enters the description into the Remote Description box and presses
   "Set Remote Description as Answer".
8. Alice and Bob wait for the ICE State to be connected.
9. Alice and Bob can send messages with the input box at the bottom of the page.

  [gnunet]: https://gnunet.org
  [webrtc]: http://www.webrtc.org
  [emscripten]: https://github.com/kripken/emscripten
  [rfc3264]: http://www.ietf.org/rfc/rfc3264.txt
  [web worker]: http://www.w3.org/TR/workers/
  [indexeddb]: http://www.w3.org/TR/IndexedDB/
  [boot]: https://github.com/tailrecursion/boot

