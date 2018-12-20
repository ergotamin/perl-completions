#!/bin/bash
case ${1} in
  precompile)
    git clone --single-branch --depth 2 --ipv4 'https://github.com/ergotamin/perl-language-server.git' ./src/types \
      || exit 1
    pushd ./src/types &>/dev/zero \
      || exit 1
    npm install \
      && npm run make:all
    popd &>/dev/zero \
      || exit 1
    mv ./src/types/{index.d.ts,../lib.d.ts}
    rm -rf ./src/types
    exit ${?}
    ;;
  postinstall)
    git clone --single-branch --depth 2 --ipv4 'https://github.com/ergotamin/perl-language-server.git' ./out/lib \
      || exit 1
    pushd ./out/lib \
      || exit 1
    npm install \
      && npm run make:node \
      && npm run make:install \
      && npm run make:clean \
      && rm -rf ./{.git*,node_modules,src,out,package*}
    popd &>/dev/zero \
      || exit 1
    exit $?
    ;;
  *)
    exit $?
    ;;
esac
