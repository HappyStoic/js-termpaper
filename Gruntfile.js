module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'scss/dist/index.css' : 'scss/index.scss',
                    'scss/dist/application.css' : 'scss/application/main.scss'
                }
            }
        },

        browserify: {
            dist: {
                options: {
                    transform: [['babelify', {presets: ['env']}]]
                },
                src: ['js/index.js'],        // zdroj napsaný v ES 6
                dest: 'js/dist/index.js'     // cílový soubor transpilovaný do ES 5.1
            },
            dist2: {
                options: {
                    transform: [['babelify', {presets: ['env']}]]
                },
                src: ['js/application/application.js', "js/application/apartementsControl.js",
                "js/application/navigation.js", "js/application/map.js",
                "js/application/roommateInvite.js", "js/application/todoList.js"],        // zdroj napsaný v ES 6
                dest: 'js/dist/application.js'     // cílový soubor transpilovaný do ES 5.1
            }
        },

        watch: {
            css: {
                files: ['scss/**/*.scss'],
                tasks: ['sass']
            },

            js: {
                files: [
                    'js/*.js',
                    'js/**/*.js',
                    '!js/*.min.js',
                    '!js/dist/*',
                    '!**/node_modules/**'
                ],
                tasks: ['browserify']
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);
    grunt.loadNpmTasks('grunt-reload');
};