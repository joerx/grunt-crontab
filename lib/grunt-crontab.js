var fs = require('fs');

module.exports = function(grunt) {

  var namespace = grunt.config.get('crontab.namespace');
  var cronfile = grunt.config.get('crontab.cronfile') || './.crontab';

  namespace || grunt.fail.warn('crontab.namespace not set');
  cronfile || grunt.fail.warn('crontab.cronfile not set');
  grunt.file.exists(cronfile) || grunt.fail.warn(cronfile + ' does not exist');

  function clean(crontab) {
    crontab.jobs({comment: new RegExp('^' + namespace)}).forEach(crontab.remove.bind(crontab));
  }

  function create(crontab) {
    var jobs = grunt.file.readJSON(cronfile).jobs;
    jobs.forEach(function(def) {
      validateJob(def);
      var comment = namespace + (def.comment ? ' - ' + def.comment : '');
      grunt.log.writeln('Create', def.schedule, def.command, '#' + comment);
      crontab.create(def.command, def.schedule, comment);
    });
  }

  function validateJob(def) {
    if (!def.command) {
      throw new Exception('Command is missing');
    }
    if (!def.schedule) {
      throw new Exception('Schedule is missing');
    }
  }

  function readCronFile(path, done) {
    fs.readFile(path, function(err, content) {
      if (err) return done(err);
      return done(null, JSON.parse(content).jobs);
    });
  }

  return {
    clean: clean,
    create: create
  }
}
