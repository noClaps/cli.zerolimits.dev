// @ts-check

import { directory } from "../directory.js";

/**
 * @param {string} command
 */
export function fallback(command) {
  if (directory.projects[command]) {
    const project = directory.projects[command];
    return `${project.name} - ${project.link ? `<a href="${project.link}">Link</a> - ` : ""}<a href="${project.source}">Source</a>`;
  }

  if (directory.contact[command]) {
    const contact = directory.contact[command];
    return `${contact.name} - <a href="${contact.link}">${contact.linkName}</a>`;
  }

  if (command === "") return "";

  return `Not a valid command. Type "help" to see all available commands.`;
}
