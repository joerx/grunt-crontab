/*
 * grunt-crontab
 * git@github.com:joerx/grunt-crontab.git
 *
 * Copyright (c) 2014 Joerg Henning
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  grunt.registerTask('crontab', 'Task to update system crontab', function() {
    // get jobs
    var crontab = require('crontab');
    console.log('crontab task');
    // var done = this.async();
    // crontab.load(function(err, crontab) {
    //   console.log(crontab);
    //   crontab.jobs();
    //   done();
    // });
  });

  // // Please see the Grunt documentation for more information regarding task
  // // creation: http://gruntjs.com/creating-tasks

  // grunt.registerMultiTask('crontab', 'Grunt plugin to update system crontab', function () {

  //   // Merge task-specific and/or target-specific options with these defaults.
  //   var options = this.options({
  //     punctuation: '.',
  //     separator: ', '
  //   });

  //   // Iterate over all specified file groups.
  //   this.files.forEach(function (file) {
  //     // Concat specified files.
  //     var src = file.src.filter(function (filepath) {
  //       // Warn on and remove invalid source files (if nonull was set).
  //       if (!grunt.file.exists(filepath)) {
  //         grunt.log.warn('Source file "' + filepath + '" not found.');
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }).map(function (filepath) {
  //       // Read file source.
  //       return grunt.file.read(filepath);
  //     }).join(grunt.util.normalizelf(options.separator));

  //     // Handle options.
  //     src += options.punctuation;

  //     // Write the destination file.
  //     grunt.file.write(file.dest, src);

  //     // Print a success message.
  //     grunt.log.writeln('File "' + file.dest + '" created.');
  //   });
  // });

};
