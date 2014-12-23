'use strict';

var grunt = require('grunt');
var sinon = require('sinon');
var path = require('path');
var gruntCrontab = require('../lib/grunt-crontab');


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var mock;
var namespace = grunt.config('crontab.namespace');

function testGruntWarn(test, fn) {
  test.expect(1);
  var spy = sinon.stub(grunt.fail, 'warn');
  fn();
  test.equal(spy.callCount, 1);
  grunt.fail.warn.restore();
}

exports.crontab = {
  setUp: function (done) {
    mock = sinon.stub({
      remove: function(job) {},
      create: function(cmd, schedule, comment) {},
      jobs: function(options) {},
      save: function(cb) {}
    });
    done();
  },
  'should register task with grunt': function(test) {
    test.expect(1);
    test.ok(grunt.task.exists('crontab'));
    test.done();
  },

  'will remove old cronjobs': function (test) {
    test.expect(2);
    mock.jobs.returns(['one', 'two']);

    gruntCrontab(grunt).clean(mock);
    test.equal(mock.jobs.callCount, 1);
    test.equal(mock.remove.callCount, 2);
    test.done();
  },

  'will use namespace for getting jobs': function(test) {
    test.expect(1);
    mock.jobs.returns(['one', 'two']);

    var regex = new RegExp('^' + namespace);

    gruntCrontab(grunt).clean(mock);
    test.deepEqual(mock.jobs.firstCall.args[0], {comment: regex});
    test.done();
  },

  'will create cronjobs from file': function(test) {
    test.expect(4);
    var backup = grunt.config.get('crontab.cronfile');
    grunt.config.set('crontab.cronfile', './test/fixtures/.mycrontab');

    gruntCrontab(grunt).create(mock);

    test.equal(mock.create.callCount, 4);
    test.equal(mock.create.firstCall.args[0], 'pwd');
    test.equal(mock.create.firstCall.args[1], '0 7 * * *');
    test.equal(mock.create.firstCall.args[2], namespace + ' A job');

    grunt.config.set('crontab.cronfile', backup);
    test.done();
  },

  'will create cronjobs from default file': function(test) {
    test.expect(4);
    var backup = grunt.config.get('crontab.cronfile');
    grunt.config.set('crontab.cronfile', undefined);

    gruntCrontab(grunt).create(mock);

    test.equal(mock.create.callCount, 2);
    test.equal(mock.create.firstCall.args[0], 'ls -lha');
    test.equal(mock.create.firstCall.args[1], '0 7 * * *');
    test.equal(mock.create.firstCall.args[2], namespace + ' A job');

    grunt.config.set('crontab.cronfile', backup);
    test.done();
  },

  'will fail if config file was not found': function(test) {
    var backup = grunt.config.get('crontab.cronfile');
    grunt.config.set('crontab.cronfile', './filedoesnotexistatall');

    testGruntWarn(test, gruntCrontab.bind(null, grunt));

    grunt.config.set('crontab.cronfile', backup);
    test.done();
  },

  'will fail if namespace config is missing': function(test) {
    var backup = grunt.config.get('crontab.namespace');
    grunt.config.set('crontab.namespace', undefined);

    testGruntWarn(test, gruntCrontab.bind(null, grunt));

    grunt.config.set('crontab.namespace', backup);
    test.done();
  }
};
