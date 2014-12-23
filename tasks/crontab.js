/*
 * Copyright (c) 2014 Joerg Henning
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  var crontab = require('crontab');
  var gruntCrontab = require('../lib/grunt-crontab')(grunt);

  grunt.registerTask('crontab', 'Task to update system crontab', function() {
    var done = this.async();
    crontab.load(function(err, ct) {
      gruntCrontab.clean(ct);
      gruntCrontab.create(ct);
      ct.save(done);
    });
  });

};
