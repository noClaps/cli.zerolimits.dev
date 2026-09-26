export function help(args) {
    if (args.length > 1) {
        return `Incorrect usage of the help command. Use "help help" to see how to use this command.`;
    }

    switch (args[0]) {
        case "clear":
            return `\
Usage: clear
Clear the screen`;
        case "help":
            return `\
Usage: help [command]
Display help menu
Arguments:
  [command]  The command to list the help guide for. If this argument is not
             provided, the list of commands and their descriptions is
             displayed.`;
        case "ls":
            return `\
Usage: ls [directory] [--keys]
List contents of directory
Arguments:
  [directory]  The directory for which to list contents. If this argument is
               not provided, the contents of all directories are listed.
               Directory names end with a forward slash (/).
Options:
  --keys       Display the keys of the listed links, so that they can be used
               with the \`open\` command. The keys are displayed in
               (parentheses) at the end of the links.`;
        case "open":
            return `\
Usage: open <key> [--source]
Open link or source in a new tab
Arguments:
  <key>     The key of the link you'd like to open. This will open the link to
            the website by default, unless the project or content doesn't have a
            website or if the --source flag is used, in which case the link to
            the source will be opened. You can obtain this key from the \`ls\`
            command with the --keys flag.
Options:
  --source  Open the link to the source code, even if there is a website link
            available.`.replaceAll("<", "&lt;");
        case "whoami":
            return `\
Usage: whoami
Show details about me`;
        default:
            return `\
Commands:
  clear                    Clear the screen
  help                     Display help menu
  ls [directory] [--keys]  List contents of directory
  open <key> [--source]    Open link or source in a new tab
  whoami                   Show details about me`.replaceAll("<", "&lt;");
    }
}
