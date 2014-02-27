module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-env')
    grunt.loadNpmTasks('grunt-bower-requirejs');

    grunt.initConfig({
        bower: {
            target: {
                rjsConfig : '../client/js/main.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    timeout : 6000,
                    reporter: 'spec',

                    // This reporter will generate test documentation
//                    reporter: 'doc',
//                    captureFile: 'documentation.html',


                    // Require blanket wrapper here to instrument other required
                    // files on the fly.
                    //
                    // NB. We cannot require blanket directly as it
                    // detects that we are not running mocha cli and loads differently.
                    //
                    // NNB. As mocha is 'clever' enough to only run the tests once for
                    // each file the following coverage task does not actually run any
                    // tests which is why the coverage instrumentation has to be done here
                    require: '../server/config/blanket',
                    clearRequireCache: true
                },
                src: ['../server/test/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: 'coverage.html'
                },
                src: ['../server/test/**/*.js']
            }
        },

        // Watch for changes to js files and then runs the default task
        watch: {
            js : {
                options : {
                    spawn : false
                },
                files : '**/*.js',
                tasks : ['test']
            }
        },

        // Set the enviroment variables
        env: {
            test: {
                NODE_ENV: 'test'
            }
        }

    });

    // On watch events configure mochaTest to run only on the test if it is one
    // otherwise, run the whole testsuite
    var defaultSimpleSrc = grunt.config('mochaTest.simple.src');
    grunt.event.on('watch', function(action, filepath) {
        grunt.config('mochaTest.simple.src', defaultSimpleSrc);
        if (filepath.match('test/')) {
            grunt.config('mochaTest.simple.src', filepath);
        }
    });

    grunt.registerTask('default', ['watch'])
    grunt.registerTask('test', ['env:test', 'mochaTest']);
};