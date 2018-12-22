// import nbind-module
import * as nbind from "nbind";
// export the nbind.node-library
export const lib = nbind.init<typeof nbind.Binding>(__dirname).lib;
