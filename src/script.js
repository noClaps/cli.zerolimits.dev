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
    clear(args) {
        if (args.includes("-h") || args.includes("--help")) return `\
Usage: clear
Clear the screen
Options:
  -h, --help  Show this help and exit.`;
        const unknownFlags = args.filter(a => a.startsWith("-") && !["-h", "--help"].includes(a));
        if (unknownFlags.length > 0) return `\
Unknown flags: ${unknownFlags.join(" ")}
Usage: clear
See clear --help for more details`;
        if (args.length > 0) return `\
Extra arguments provided: ${args.join(" ")}
Usage: clear
See clear --help for more details`;
        log.innerHTML = "";
        input.value = "";
    },
    help,
    ls,
    open,
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

            log.innerHTML += `user@zerolimits.dev / > ${input.value}\n`;
            let returnVal = "";
            const argv = cmd.split(" ");

            if (Object.keys(Commands).includes(argv[0])) {
                returnVal = Commands[argv[0]](argv.slice(1));
            } else {
                returnVal = fallback(argv[0]);
            }
            if (returnVal) log.innerHTML += `${returnVal}\n`;

            scrollTo({ top: document.body.scrollHeight });
            input.value = "";
        }
    }
});
