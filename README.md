# Insomnia Plugin - Atlassian ASAP/SLAUTH Token Generator

This is a plugin for [Insomnia](https://insomnia.rest) that enables you to generate Atlassian SLAUTH or ASAP tokens.
Commands are executed using `child_process`.`exec`. ie., equivalent to `/bin/sh` `<cmd-specified>`

## Installation

Install the `insomnia-plugin-atlassian-asap-slauth` plugin from Preferences > Plugins. or copying contents inside plugin folder.

## Usage
Insert function either in headers or body either by typing `ctrl + space` or start type `{{`

- Choose your token type
- Fill mandatory or conditional mandatory fields depending on your token type

See screenshot below
![Screenshot](https://github.com/usrivastava92/insomnia-plugin-atlassian-asap-slauth/blob/master/example.png)
