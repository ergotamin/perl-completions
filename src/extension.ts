"use strict";
// node.js
import * as fs from "fs";
import * as path from "path";
import * as cproc from "child_process";
// vscode
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let cppModule = path.join(context.extensionPath, "/out", "/lib");

  if (fs.existsSync(cppModule) === false) {
    let cmd = path.join(context.extensionPath, "/tools", "/configure.sh");
    vscode.window.showInformationMessage(
      "First start of Perl-Completions... started downloading module !"
    );
    cproc.execFileSync(cmd, ["postinstall"]);
  }

  const cpp = require("./cpp.node");

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

        cpp.Perl.functions().forEach((name, idx, array) => {
          let item = new vscode.CompletionItem(
            name,
            vscode.CompletionItemKind.Function
          );
          item.detail = "function";
          item.commitCharacters = ["\t"];
          if (name.startsWith("-")) {
            item.documentation = new vscode.MarkdownString(
              "Press `TAB` to get **" + name + "**"
            );
            item.insertText = new vscode.SnippetString(name + " ");
          } else {
            item.documentation = new vscode.MarkdownString(
              "Press `TAB` to get **" + name + "**(...)"
            );
            item.insertText = new vscode.SnippetString(name + "(${1})");
          }
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
          item.detail = "variable";
          item.commitCharacters = ["\t"];
          item.documentation = new vscode.MarkdownString(
            "Press `TAB` to get **" + name + "**"
          );
          item.insertText = new vscode.SnippetString(name + " ");
          items.push(item);
        });

        let list = new vscode.CompletionList(items, false);
        return list;
      }
    }
  );

  let syntaxProvider = vscode.languages.registerCompletionItemProvider("perl", {
    provideCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position,
      token: vscode.CancellationToken,
      context: vscode.CompletionContext
    ) {
      let items = new Array<vscode.CompletionItem>();

      cpp.Perl.syntax().forEach(name => {
        let item = new vscode.CompletionItem(
          name,
          vscode.CompletionItemKind.Keyword
        );
        if (name.startsWith("_")) {
          item.documentation = new vscode.MarkdownString(
            "Press `TAB` to get **" + name + "**"
          );
          item.insertText = new vscode.SnippetString(name);
        } else {
          item.documentation = new vscode.MarkdownString(
            "Press `TAB` to get **" + name + "**(...)"
          );
          item.insertText = new vscode.SnippetString(name + "(${1})");
        }
        items.push(item);
      });

      let list = new vscode.CompletionList(items, false);
      return list;
    }
  });

  let handleProvider = vscode.languages.registerCompletionItemProvider("perl", {
    provideCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position,
      token: vscode.CancellationToken,
      context: vscode.CompletionContext
    ) {
      let items = new Array<vscode.CompletionItem>();

      cpp.Perl.constants().forEach(name => {
        let item = new vscode.CompletionItem(
          name,
          vscode.CompletionItemKind.Constant
        );
        item.detail = "I/O constant";
        item.commitCharacters = ["\t"];
        item.documentation = new vscode.MarkdownString(
          "Press `TAB` to get **" + name + "**"
        );
        item.insertText = new vscode.SnippetString(name);
        items.push(item);
      });

      let list = new vscode.CompletionList(items, false);
      return list;
    }
  });

  context.subscriptions.push(
    functionProvider,
    variableProvider,
    syntaxProvider,
    handleProvider
  );
}
