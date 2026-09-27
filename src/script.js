import { fallback } from "./bin/fallback.js";
import { help } from "./bin/help.js";
import { ls } from "./bin/ls.js";
import { open } from "./bin/open.js";

export const directory = await fetch("https://zerolimits.dev/data.json").then((r) => r.json());

const cmdHistory = [];
let currentPos = cmdHistory.length - 1;

const input = document.querySelector("input");
if (!input) throw new Error("Input element not found");

const log = document.getElementById("log");
if (!log) throw new Error("Log element not found");

document.addEventListener("click", (ev) => {
    if (ev.target.id === "log") return;
    input.focus();
});

const Commands = {
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

            let returnVal = "";
            const argv = cmd.split(" ");

            switch (argv[0]) {
                case "clear": {
                    Commands.clear();
                    return;
                }
                case "help": {
                    returnVal = Commands.help(argv.slice(1));
                    break;
                }
                case "ls": {
                    returnVal = Commands.ls(argv.slice(1));
                    break;
                }
                case "open": {
                    returnVal = Commands.open(argv.slice(1));
                    break;
                }
                default:
                    returnVal = Commands.fallback(argv[0]);
            }

            log.innerHTML += `user@zerolimits.dev / > ${input.value}\n`;
            if (returnVal) log.innerHTML += `${returnVal}\n`;

            scrollTo({ top: document.body.scrollHeight });
            input.value = "";
        }
    }
});
