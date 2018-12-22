#!/bin/bash
case ${1} in
  precompile)
    git clone --single-branch --depth 2 --ipv4 'https://github.com/ergotamin/perl-completions-cpp-node.git' ./tmp \
      || exit 1
    pushd ./tmp &>/dev/zero \
      || exit 1
    npm install \
      && npm run make:all \
      && rm -rf ./{node_modules,out,src,package*,.git*}
    popd &>/dev/zero \
      || exit 1
    mv ./tmp ./src/cpp.node
    exit ${?}
    ;;
  postinstall)
    EXTENSION_PATH=$($(command -v dirname) "$(dirname ${0})")
    pushd "${EXTENSION_PATH}" &>/dev/zero \
      || exit 1
    git clone --single-branch --depth 2 --ipv4 'https://github.com/ergotamin/perl-completions-cpp-node.git' ./tmp \
      || exit 1
    pushd ./tmp \
      || exit 1
    npm install \
      && npm run make:node \
      && npm run make:install \
      && mv ./nbind.node ./../out/cpp.node/nbind.node
    popd &>/dev/zero \
      || exit 1
      rm -rf ./tmp
    popd &>/dev/zero \
      || exit 1
    exit $?
    ;;
  *)
    exit $?
    ;;
esac
