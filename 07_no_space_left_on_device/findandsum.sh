#!/bin/bash

echo -n "$1,"
find $1 -type f -exec stat -f%z {} \; | awk '{b+=$1} END {print b}'
