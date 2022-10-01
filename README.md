# Insomnia Plugin - Atlassian ASAP/SLAUTH Token Generator

![Build Status](https://img.shields.io/github/workflow/status/usrivastava92/insomnia-plugin-atlassian-asap-slauth/Node.js%20CI)
![License](https://img.shields.io/github/license/usrivastava92/insomnia-plugin-atlassian-asap-slauth)
[![](https://img.shields.io/npm/v/insomnia-plugin-atlassian-asap-slauth.svg)](https://www.npmjs.com/package/insomnia-plugin-atlassian-asap-slauth)
[![](https://img.shields.io/badge/insomnia-install%20plugin-purple.svg?color=6a57d5)](https://insomnia.rest/plugins/insomnia-plugin-atlassian-asap-slauth)
![Downloads](https://img.shields.io/npm/dm/insomnia-plugin-atlassian-asap-slauth)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=alert_status)](https://sonarcloud.io/dashboard?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)

This is a plugin for [Insomnia](https://insomnia.rest) that enables you to generate Atlassian SLAUTH or ASAP tokens.
The plugin generates ASAP/SLAUTH tokens using  `atlas` CLI and commands are executed using `child_process`.`exec`.

## Installation

Go to _Insomnia > Preferences > Plugins_, type in `insomnia-plugin-atlassian-asap-slauth` and click Install Plugin.

## Usage
Insert function either in headers or body either by typing `ctrl + space` or start typing `{{asap/`

- Choose your token type
- Fill mandatory or conditional mandatory fields depending on your token type

See screenshot below
![Screenshot](https://github.com/usrivastava92/insomnia-plugin-atlassian-asap-slauth/blob/master/example.png?raw=true)
