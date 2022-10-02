# Insomnia Plugin - Atlassian ASAP/SLAUTH Token Generator

[![Build Status](https://img.shields.io/github/workflow/status/usrivastava92/insomnia-plugin-atlassian-asap-slauth/Node.js%20CI)](https://github.com/usrivastava92/insomnia-plugin-atlassian-asap-slauth/actions)
[![License](https://img.shields.io/github/license/usrivastava92/insomnia-plugin-atlassian-asap-slauth)](https://github.com/usrivastava92/insomnia-plugin-atlassian-asap-slauth/blob/master/LICENSE)
[![Insomnia Plugin Hub](https://img.shields.io/badge/insomnia-install%20plugin-purple.svg?color=6a57d5)](https://insomnia.rest/plugins/insomnia-plugin-atlassian-asap-slauth)
[![Downloads](https://img.shields.io/npm/dm/insomnia-plugin-atlassian-asap-slauth)](https://www.npmjs.com/package/insomnia-plugin-atlassian-asap-slauth)
[![SonarCloud Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=alert_status)](https://sonarcloud.io/dashboard?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
[![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=coverage)](https://sonarcloud.io/component_measures?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=new_coverage&view=list)

## Intro

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

## Sonar

[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=ncloc)](https://sonarcloud.io/dashboard?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=security_rating)](https://sonarcloud.io/dashboard?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
[![SonarCloud Bugs](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=bugs)](https://sonarcloud.io/component_measures/metric/reliability_rating/list?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
[![SonarCloud Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=vulnerabilities)](https://sonarcloud.io/component_measures/metric/security_rating/list?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=code_smells)](https://sonarcloud.io/dashboard?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=usrivastava92_insomnia-plugin-atlassian-asap-slauth&metric=sqale_index)](https://sonarcloud.io/dashboard?id=usrivastava92_insomnia-plugin-atlassian-asap-slauth)
