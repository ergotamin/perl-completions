#!/bin/bash
find $@ -type f -name '*.pm' -or -name '*.pod' \
  | ./pltags.pl -f /tmp/tags -a -v -R -L - && rm /tmp/tags*
