var fs = require('fs');
var _ = require('lodash');
var crontab = require('crontab');

var gruntCrontab = module.exports = function gruntCrontab(grunt, options) {

  options = options || {};

  var pkg = grunt.file.readJSON('./package.json');
  var target = options.target || 'default';
  var namespace = options.namespace || pkg.name + '.' + options.target;
  var cronfile = options.cronfile || './.crontab';

  namespace || grunt.fail.warn('crontab.namespace not set');
  cronfile || grunt.fail.warn('crontab.cronfile not set');
  grunt.file.exists(cronfile) || grunt.fail.warn(cronfile + ' does not exist');

  /**
   * Remove cronjobs from given crontab
   */
  function setup(done) {
    crontab.load(function(err, ct) {
      if (err) return done(err);
      clean(ct);
      load(ct);
      ct.save(done);
    });
  }

  function load(ct) {
    var jobs = readCronFile(cronfile);
    jobs.forEach(function(def) {
      validateJob(def);
      var comment = namespace + (def.comment ? ' - ' + def.comment : '');
      grunt.log.writeln('Create', def.schedule, def.command, '#' + comment);
      ct.create(def.command, def.schedule, comment);
    });
  }

  function clean(ct) {
    ct.jobs({comment: new RegExp('^' + namespace)}).forEach(ct.remove.bind(ct));
  }

  /**
   * Validate a job definition. Throw exception if validation fails
   */
  function validateJob(def) {
    if (!def.command) {
      throw new Exception('Command is missing');
    }
    if (!def.schedule) {
      throw new Exception('Schedule is missing');
    }
  }

  /**
   * Read cronjob definition file from disk.
   */
  function readCronFile(cronfile) {
    var substitutes = {
      project: {
        baseDir: process.cwd()
      },
      pkg: pkg
    }
    var content = _.template(grunt.file.read(cronfile), substitutes);
    return JSON.parse(content).jobs;
  }

  function task() {

  }

  return {
    setup: setup
  }
}

module.exports.multiTask = function(grunt) {
  return function() {
    var options = this.data;
    options.target = this.target;
    gruntCrontab(grunt, options).setup(this.async());
  }
}
