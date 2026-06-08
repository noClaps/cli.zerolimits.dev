// @ts-check

/**
 * @typedef {{
 *   name: string;
 *   description: string;
 *   link?: string;
 *   source: string;
 * }} Project
 *
 * @typedef {{
 *   projects: Record<string, Project>;
 *   contact: Record<string, { name: string; link: string; "link-name": string }>;
 * }} Directory
 */

/** @type {Directory} */
export const directory = await fetch("https://zerolimits.dev/data.json")
  .then((r) => r.json())
  .then((d) => {
    d.projects["zerolimits-cli"] = {
      name: "zerolimits --cli",
      description: "A CLI version of ZeroLimits.dev.",
      link: "https://cli.zerolimits.dev",
      source: "https://github.com/noClaps/cli.zerolimits.dev",
    };
    return d;
  });
