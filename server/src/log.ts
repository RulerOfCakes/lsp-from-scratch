import * as fs from "fs";

const logout = fs.createWriteStream("/tmp/lsp.log");

export const log = {
  write: (message: object | unknown) => {
    if (typeof message === "object") {
      logout.write(JSON.stringify(message));
    } else {
      logout.write(message);
    }
    logout.write("\n");
  },
};
