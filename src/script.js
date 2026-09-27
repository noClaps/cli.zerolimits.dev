const directory = await fetch("https://zerolimits.dev/data.json").then((r) => r.json());

const cmdHistory = [];
let currentPos = cmdHistory.length - 1;

const input = document.querySelector("input");
if (!input) throw new Error("Input element not found");

const log = document.getElementById("log");
if (!log) throw new Error("Log element not found");

document.addEventListener("click", (ev) => {
    if (ev.target.id !== "log") input.focus();
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
    ls(args) {
        if (args.includes("-h") || args.includes("--help")) return `\
Usage: ls [directory] [--keys]
List contents of directory
Arguments:
  [directory]  The directory for which to list contents. If this argument is
               not provided, the contents of all directories are listed.
               Directory names end with a forward slash (/).
Options:
  --keys       Display the keys of the listed links so that they can be used
               with the open command. The keys are displayed in (parentheses)
               at the end of the links.
  -h, --help   Show this help and exit.`;

        const unknownFlags = args.filter(a => a.startsWith("-") && !["-h", "--help", "--keys"].includes(a));
        if (unknownFlags.length > 0) return `\
Unknown flags: ${unknownFlags.join(" ")}
Usage: ls [directory] [--keys]
See ls --help for more details.`;

        let showKeys = false;
        const idx = args.findIndex(a => a === "--keys");
        if (idx !== -1) {
            showKeys = true;
            args.splice(idx, 1);
        }
        if (args.length > 1) return `\
Extra arguments provided: ${args.slice(1).join(" ")}
Usage: ls [directory] [--keys]
See ls --help for more details.`;

        let arg = args[0];

        let contactList = "";
        const contacts = directory.contact;
        Object.keys(contacts).forEach((key, i) => {
            const contact = contacts[key];
            if (i > 0) contactList += "\n";
            contactList += i === Object.keys(contacts).length - 1 ? "└" : "├";
            contactList += `── ${contact.name} - <a href="${contact.link}">${contact["link-name"]}</a>`;
            if (showKeys) contactList += ` (${key})`;
        });

        let projectsList = "";
        const projects = directory.projects;
        Object.keys(projects).forEach((key, i) => {
            const project = projects[key];
            if (i > 0) projectsList += "\n";
            projectsList += i === Object.keys(projects).length - 1 ? "└" : "├";
            projectsList += `── ${project.name} - `;
            if (project.link) projectsList += `<a href="${project.link}">Link</a> - `;
            projectsList += `<a href="${project.source}">Source</a>`
            if (showKeys) projectsList += ` (${key})`;
            projectsList += `\n${i === Object.keys(projects).length - 1 ? " " : "│"}   ${project.description}`;
        });

        if (!arg) return `\
contact/
${contactList}
projects/
${projectsList}`;

        arg = arg.replace(/^\/*|\/*$/g, "");
        if (arg === "contact") return `contact/\n${contactList}`;
        if (arg === "projects") return `projects/\n${projectsList}`;

        return `${arg}: Directory not found`;
    },
    open(args) {
        if (args.includes("-h") || args.includes("--help")) return `\
Usage: open <key> [--source]
Open link or source in a new tab
Arguments:
  <key>       The key of the link you'd like to open. This will open the link
              to the website by default, unless the project doesn't have a
              website or if the --source flag is used, in which case the link
              to the source will be opened. You can obtain this key from the ls
              command with the --keys flag.
Options:
  --source    Open the link to the source code, even if there is a website link
              available. This flag cannot be used with a contact key.
  -h, --help  Show this help and exit.`.replaceAll("<", "&lt;");

        const unknownFlag = args.filter(a => a.startsWith("-") && !["-h", "--help", "--source"].includes(a));
        if (unknownFlag.length > 0) return `\
Unknown flags: ${unknownFlag.join(" ")}
Usage: open <key> [--source]
See open --help for more details.`.replaceAll("<", "&lt;");

        if (args.length < 1) return `\
Missing required argument: <key>
Usage: open <key> [--source]
See open --help for more details.`.replaceAll("<", "&lt;");

        let openSource = false;
        const idx = args.findIndex(a => a === "--source");
        if (idx !== -1) {
            openSource = true;
            args.splice(idx, 1);
        }

        if (args.length < 1) return `\
Missing required argument: <key>
Usage: open <key> [--source]
See open --help for more details.`.replaceAll("<", "&lt;");
        if (args.length > 1) return `\
Extra arguments provided: ${args.slice(1).join(" ")}
Usage: open <key> [--source]
See open --help for more details.`.replaceAll("<", "&lt;");

        const key = args[0];

        const projects = directory.projects;
        if (key in projects) {
            if (openSource || !projects[key].link) {
                window.open(projects[key].source, "_blank");
                return;
            }

            window.open(projects[key].link, "_blank");
            return;
        }

        const contact = directory.contact;
        if (key in contact) {
            if (openSource) return "--source flag cannot be used with a contact key.";

            window.open(contact[key].link, "_blank");
            return;
        }

        return `${key}: Unknown key. Use \`ls --keys\` to see available keys.`;
    },
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
                const command = argv[0];
                if (directory.projects[command]) {
                    const project = directory.projects[command];
                    returnVal = `\
${project.name} - ${project.link ? `<a href="${project.link}">Link</a> - ` : ""}<a href="${project.source}">Source</a>
${project.description}`;
                }
                else if (directory.contact[command]) {
                    const contact = directory.contact[command];
                    returnVal = `${contact.name} - <a href="${contact.link}">${contact["link-name"]}</a>`;
                }
                else if (command === "") returnVal = "";
                else returnVal = "Not a valid command.";
            }
            if (returnVal) log.innerHTML += `${returnVal}\n`;

            scrollTo({ top: document.body.scrollHeight });
            input.value = "";
        }
    }
});
