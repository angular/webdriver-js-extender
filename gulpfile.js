'use strict';

const gulp = require('gulp');
const spawn = require('child_process').spawn;
const gulpClangFormat = require('gulp-clang-format');
const clangFormat = require('clang-format');

function runSpawn(task, opt_arg) {;
  return spawn(task, opt_arg, {stdio: 'inherit'});
};

function copy() {
  return gulp.src(['package.json', 'built/lib/**/*'], {base: '.'})
      .pipe(gulp.dest('dist'));
}

function formatEnforce() {
  return gulp.src(['lib/**/*.ts']).pipe(
    gulpClangFormat.checkFormat('file', clangFormat, {verbose: true, fail: true}));
}

function format() {
  return gulp.src(['lib/**/*.ts'], { base: '.' }).pipe(
    gulpClangFormat.format('file', clangFormat)).pipe(gulp.dest('.'));
}

function build() {
  return runSpawn(process.execPath, ['node_modules/typescript/bin/tsc']);
}

function test() {
  return runSpawn(process.execPath, ['node_modules/jasmine/bin/jasmine.js']);
}

module.exports = {
  'format:enforce': formatEnforce,
  prepublish: gulp.series(format, build, copy),
  test: gulp.series(build, test),
};
