var fs = require('fs');
var _ = require('lodash');

module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('./package.json');

  var namespace = grunt.config.get('crontab.namespace') || pkg.name;
  var cronfile = grunt.config.get('crontab.cronfile') || './.crontab';

  namespace || grunt.fail.warn('crontab.namespace not set');
  cronfile || grunt.fail.warn('crontab.cronfile not set');
  grunt.file.exists(cronfile) || grunt.fail.warn(cronfile + ' does not exist');

  /**
   * Remove cronjobs from given crontab
   */
  function clean(crontab) {
    crontab.jobs({comment: new RegExp('^' + namespace)}).forEach(crontab.remove.bind(crontab));
  }

  /**
   * Read cronjobs from job definition file and write them into given crontab
   */
  function create(crontab) {
    var jobs = readCronFile(cronfile);
    jobs.forEach(function(def) {
      validateJob(def);
      var comment = namespace + (def.comment ? ' - ' + def.comment : '');
      grunt.log.writeln('Create', def.schedule, def.command, '#' + comment);
      crontab.create(def.command, def.schedule, comment);
    });
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

  return {
    clean: clean,
    create: create
  }
}
