'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        src: {
            bowerDir: 'bower_components',
            bowerJson: grunt.file.readJSON('bower.json'),
            css: 'css',
            cssWatch: ['css/*.css'],
            js: 'app/js',
            jsWatch: ['<%= src.js %>/packlist/*.js'],
            less: 'app/less',
            lessWatch: ['<%= src.less %>/**/*.less']
        },

        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                dest: '<%= src.js %>/packlist.js',
                src: [
                    '<%= src.js %>/app/app.js'
                ]
            },
            angular: {
                dest: '<%= src.js %>/lib/angular.js',
                src: [
                    '<%= src.bowerDir %>/angular/angular.js'
                ]
            }
        },

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
                    paths: ['<%= src.less %>']
                },
                files: {
                    'css/style.css': '<%= src.less %>/packlist.less'
                }
            },
            production: {
                options: {
                    cleancss: true,
                    compress: true,
                    paths: ['less']
                },
                files: {
                    'css/style.min.css': '<%= src.less %>/packlist.less'
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
            src: ['<%= src.js %>']
        },

        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: ['css/**/*', 'js/**/*']
            },
            less: {
                files: '<%= src.less %>/**/*.less',
                tasks: ['less']
            },
            js: {
                files: '<%= src.js %>/**/*.js',
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
