'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            target: {
                tasks: [
                    'less',
                    'jshint'
                ]
            },
            dev: {
                tasks: [
                    'watch'
                ]
            },
            options: {
                logConcurrentOutput: true
            }
        },

        less: {
            dev: {
                options: {
                    paths: ['less']
                },
                files: {
                    'css/style.css': 'less/packlist.less'
                }
            },
            production: {
                options: {
                    cleancss: true,
                    compress: true,
                    paths: ['less']
                },
                files: {
                    'css/style.min.css': 'less/packlist.less'
                }
            }
        },

        jshint: {
            options: {
                node: true,
                browser: true,
                esnext: true,
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                force: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                quotmark: 'single',
                regexp: true,
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                smarttabs: true,
                globals: {
                    chrome: true,
                    angular: true
                }
            },
            src: ['js']
        },

        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: ['css/**/*', 'js/**/*']
            },
            less: {
                files: 'less/**/*.less',
                tasks: ['less']
            },
            js: {
                files: 'js/**/*.js',
                tasks: []
            }
        }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
        'concurrent:target'
    ]);

    grunt.registerTask('dev', [
        'concurrent:dev'
    ]);

};
