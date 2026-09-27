import { directory } from "../script.js";

export function open(args) {
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

    const unknownFlag = args.filter(a => a.startsWith("-") && a !== "-h" && a !== "--help" && a !== "--source");
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
Extra arguments provided: ${args.slice(1)}
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
}
