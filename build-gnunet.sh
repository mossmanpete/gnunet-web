#!/bin/sh -e

mkdir -p assets/js
cd gnunet-build
export PATH="$PATH":"$(pwd)/scripts"
build
cp sysroot/var/lib/gnunet/hostlist ../assets/
cp sysroot/var/lib/gnunet/js/* ../assets/js/
mv ../assets/js/client-lib.js ../src/js/

# vim: set expandtab ts=2 sw=2:
