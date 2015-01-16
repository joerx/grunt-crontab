/*
 * Copyright (c) 2014 Joerg Henning
 * Licensed under the MIT license.
 */

'use strict';

var gruntCrontab = require('../lib/grunt-crontab');

module.exports = function (grunt) {
  grunt.registerMultiTask(
    'crontab',
    'Task to update system crontab',
    gruntCrontab.multiTask(grunt));
};
