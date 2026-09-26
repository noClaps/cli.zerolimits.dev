import { directory } from "../script.js";

export function ls(args) {
    if (args.length > 2) return `Incorrect usage of the ls command. Use "help ls" to see how to use this command.`;

    let showKeys = false;
    const idx = args.findIndex(a => a === "--keys");
    if (idx !== -1) {
        showKeys = true;
        args.splice(idx, 1);
    }
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
