#!/bin/bash
case ${1} in
  precompile)
    git clone --single-branch --depth 2 --ipv4 'https://github.com/ergotamin/perl-language-server.git' ./src/types \
      || exit 1
    pushd ./src/types &>/dev/zero \
      || exit 1
    npm install \
      && npm run make:all \
      && rm -rf ./{.git,node_modules,src,out,index.js,package*} \
      && mv index.d.ts ../server-interface.d.ts
    popd &>/dev/zero \
      || exit 1
    exit ${?}
    ;;
  postinstall)
    git clone --single-branch --depth 2 --ipv4 'https://github.com/ergotamin/perl-language-server.git' ./out/server-interface \
      || exit 1
    pushd ./out/interface \
      || exit 1
    npm install \
      && npm run make:node \
      && npm run make:install \
      && npm run make:clean \
      && rm -rf ./{.git,node_modules,src,out,index.d.ts,package*}
    popd &>/dev/zero \
      || exit 1
    exit $?
    ;;
  *)
    exit $?
    ;;
esac
