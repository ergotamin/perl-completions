"use strict";
// node.js
import * as fs from "fs";
import * as path from "path";
import * as cproc from "child_process";
// vscode
import * as vscode from "vscode";

function checkinstall(dir) {
  let module = path.join(dir, "/out", "/cpp", "/nbind.node");
  if (fs.existsSync(module) === false) {
    vscode.window.showInformationMessage(
      "Perl-Completions: Downloading/Compiling Node-Module !"
    );
    let cmd = path.join(dir, "/script", "/postinstall");
    cproc.execFileSync(cmd, [process.version]);
  }
  return;
}

export function activate(context: vscode.ExtensionContext) {
  checkinstall(context.extensionPath);

  const cpp = require("./cpp").lib;

  let functionProvider = vscode.languages.registerCompletionItemProvider(
    "perl",
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
      ) {
        let items = new Array<vscode.CompletionItem>();

        cpp.Perl.functions().forEach((elem: Array<string>) => {
          let item = new vscode.CompletionItem(
            elem[0],
            vscode.CompletionItemKind.Function
          );
          item.detail = "builtin";
          item.commitCharacters = ["\t"];
          item.documentation = new vscode.MarkdownString()
            .appendCodeblock(elem[1], "perl")
            .appendMarkdown(elem[2]);
          item.insertText = elem[0];
          items.push(item);
        });

        let list = new vscode.CompletionList(items, false);
        return list;
      }
    }
  );

  let variableProvider = vscode.languages.registerCompletionItemProvider(
    "perl",
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
      ) {
        let items = new Array<vscode.CompletionItem>();

        cpp.Perl.variables().forEach((elem: Array<string>) => {
          let item = new vscode.CompletionItem(
            elem[0],
            vscode.CompletionItemKind.Variable
          );
          item.detail = "variable";
          item.commitCharacters = ["\t"];
          item.documentation = new vscode.MarkdownString()
            .appendCodeblock(elem[1], "perl")
            .appendMarkdown(elem[2]);
          item.insertText = elem[0];
          items.push(item);
        });

        let list = new vscode.CompletionList(items, false);
        return list;
      }
    }
  );

  context.subscriptions.push(functionProvider, variableProvider);
}
