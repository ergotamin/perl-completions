"use strict";

import * as fs from "fs";
import * as path from "path";
import * as cproc from "child_process";

import { window, workspace, Disposable, ExtensionContext } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  SettingMonitor,
  ServerOptions,
  TransportKind,
  TextEdit,
  RequestType,
  TextDocumentIdentifier,
  ResponseError,
  InitializeError,
  State as ClientState,
  NotificationType
} from "vscode-languageclient";

export function activate(context: ExtensionContext) {
  let serverModule = path.join(context.extensionPath, "/out", "/server.js");
  let subModule = path.join(context.extensionPath, "/out", "/lib");

  if (fs.existsSync(subModule) === false) {
    let cmd = path.join(context.extensionPath, "/tools", "/configure.sh");
    window.showInformationMessage(
      "First start of Perl-LanguageServer... started downloading module !"
    );
    cproc.execFileSync(cmd, ["postinstall"]);
  }

  let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };

  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  let clientOptions: LanguageClientOptions = {
    documentSelector: ["perl"],
    synchronize: {
      configurationSection: "perlLanguageServer"
    }
  };

  let disposable = new LanguageClient(
    "perlLanguageServer",
    "Language Server",
    serverOptions,
    clientOptions
  ).start();

  context.subscriptions.push(disposable);
}
