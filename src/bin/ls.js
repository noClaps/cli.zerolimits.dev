import { directory } from "../script.js";

export function ls(args) {
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
Extra arguments provided: ${args.slice(1)}
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
}
