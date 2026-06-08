// @ts-check

import { fallback } from "./bin/fallback.js";
import { help } from "./bin/help.js";
import { ls } from "./bin/ls.js";
import { open } from "./bin/open.js";
import { whoami } from "./bin/whoami.js";

/** @type {string[]} */
const cmdHistory = [];
let currentPos = cmdHistory.length - 1;

const input = document.querySelector("input");
if (!input) throw new Error("Input element not found");

const log = document.getElementById("log");
if (!log) throw new Error("Log element not found");

log.innerHTML += `ZeroLimits.dev – Made by <a href="https://github.com/noClaps">noClaps</a>\n`;
log.innerHTML += `Type "help" to see all available commands.\n`;

document.addEventListener("click", (ev) => {
  if (/** @type {HTMLElement} */ (ev.target).id === "log") return;
  input.focus();
});

const Commands = {
  whoami,
  clear() {
    log.innerHTML = "";
    input.value = "";
  },
  help,
  ls,
  open,
  fallback,
};

input.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp": {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentPos >= 0) {
          input.value = cmdHistory[currentPos];
          currentPos -= 1;
        }
      }
      break;
    }

    case "ArrowDown": {
      e.preventDefault();
      if (currentPos < cmdHistory.length - 1) {
        currentPos += 1;
        input.value = cmdHistory[currentPos];
      } else {
        input.value = "";
      }

      break;
    }

    case "Enter": {
      const cmd = input.value.toLowerCase().trim();
      cmdHistory.push(cmd);
      currentPos = cmdHistory.length - 1;

      if (cmd === "clear") {
        log.innerHTML = "";
        input.value = "";
        return;
      }

      let returnVal = "";
      const command = cmd.split(" ")[0];
      const args = cmd.split(" ").slice(1);

      switch (command) {
        case "whoami": {
          returnVal = Commands.whoami();
          break;
        }
        case "clear": {
          Commands.clear();
          return;
        }
        case "help": {
          returnVal = Commands.help(args);
          break;
        }
        case "ls": {
          returnVal = Commands.ls(args);
          break;
        }
        case "open": {
          returnVal = Commands.open(args);
          break;
        }
        default:
          returnVal = Commands.fallback(cmd);
      }

      log.innerHTML += `user@zerolimits.dev / > ${input.value}\n`;
      log.innerHTML += !returnVal ? returnVal : `${returnVal}\n`;

      scrollTo(0, document.body.scrollHeight);
      input.value = "";
    }
  }
});
