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
    let cmd = path.join(dir, "/script", "/postinstall");
    vscode.window.showInformationMessage(
      "Perl-Completions: Downloading/Compiling Node-Module !"
    );
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

        cpp.Perl.functions().forEach(elem => {
          let item = new vscode.CompletionItem(
            elem[0],
            vscode.CompletionItemKind.Function
          );
          item.detail = "perlfunc";
          item.commitCharacters = ["\t"];

          item.documentation = elem[1];
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

        cpp.Perl.variables().forEach(name => {
          let item = new vscode.CompletionItem(
            name,
            vscode.CompletionItemKind.Variable
          );
          item.detail = "builtin variable";
          item.commitCharacters = ["\t"];
          item.documentation = new vscode.MarkdownString(
            "[about:_" + name + "_](http://perldoc.perl.org/perlvar.html)"
          );
          item.insertText = new vscode.SnippetString(name);
          items.push(item);
        });

        let list = new vscode.CompletionList(items, false);
        return list;
      }
    }
  );

  context.subscriptions.push(functionProvider, variableProvider);
}
