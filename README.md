# grunt-crontab

Grunt plugin to update system crontab

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the 
[Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a 
[Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with 
that process, you may install this plugin with this command:

```shell
npm install grunt-crontab --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-crontab');
```

## The "crontab" task

### Overview
This task will set up jobs in the system crontab. The jobs are read from file which by default is assumed to be 
called `.crontab` and located in the same directory as the `Gruntfile`.

In your project's Gruntfile, add a section named `crontab` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  crontab: {
    namespace: '<%= pkg.name %>', // must be set
    cronfile: './my-crontab' // override if necessary
  },
})
```

### Crontab File

```json
{
  "jobs": [
    {
      "command": "ls -lha", 
      "schedule": "0 7 * * *", 
      "comment": "A job"
    },
    {
      "command": "bla -lha", 
      "schedule": "0 7 * * *", 
      "comment": "Another job"
    }
  ]
}
```

This task can be run repeatedly, every time the crontab entries generated by this task will be cleaned up and recreated.

### Options

#### crontab.namespace
Type: `String`

A comment starting with this string will be added to every entry created. We use this comment to identify the jobs to
created by this module. 

#### crontab.cronfile
Type: `String`, default value: `'./.crontab'`

Path to the file that contains the crontab entries. Format as described above.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed 
functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Credits
This module is essentially a wrapper around [dachev/node-crontab](https://github.com/dachev/node-crontab)

## License
Copyright (c) 2014 Joerg Henning. Licensed under the MIT license.
