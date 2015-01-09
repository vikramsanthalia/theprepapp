
var pkg = require('./package.json');

module.exports = function ( grunt ) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-remove-logging');

  //grunt.loadTasks('./tasks');


  /**
   * Holds all user configuration for the build process.
   */
  var userConfig = {
      /**
       * The `build_dir` folder is where our projects are compiled during
       * development and build.
       */
      build_dir: '_build',

      /**
       * This is a collection of file patterns that refer to our app code (the
       * stuff in `src/`). These file paths are used in the configuration of
       * build tasks. `js` is all project javascript, less tests. `htmls` contains
       * our template HTML files. `index` is just our
       * main HTML file, `less` is our main stylesheet, and `unit` contains our
       * app's unit tests.
       */
      app_files: {
        js: [ 'src/**/*.js', '!src/**/*.spec.js' ],
        jsunit: [ 'src/**/*.spec.js' ],

        coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee', '!src/assets/**/*.coffee' ],
        coffeeunit: [ 'src/**/*.spec.coffee' ],

        htmls: [ 'src/**/*.html', '!src/index.html' ],
        jade: ['src/ext/*.jade','src/ext/**/*.jade'],
        less: 'src/imports.less',

        layout: [ 'src/_layout.jade' ]
      },

      /**
       * This is a collection of files used during testing only.
       */
      test_files: {
        js: [
          'vendor/angular/angular-mocks.js'
        ]
      },

      /**
       * This is the same as `app_files`, except it contains patterns that
       * reference vendor code (`vendor/`) that we need to place into the build
       * process somewhere. While the `app_files` property ensures all
       * standardized files are collected for compilation, it is the user's job
       * to ensure non-standardized (i.e. vendor-related) files are handled
       * appropriately in `vendor_files.js`.
       *
       * The `vendor_files.js` property holds files to be automatically
       * concatenated and minified with our project source files.
       *
       * The `vendor_files.css` property holds any CSS files to be automatically
       * included in our app.
       *
       * The `vendor_files.assets` property holds any assets to be copied along
       * with our app's assets. This structure is flattened, so it is not
       * recommended that you use wildcards.
       */
      vendor_files: {
        js: [
          'vendor/angular/angular.js',
          'vendor/angular/angular-elastic.js',
          'vendor/loading-bar/loading-bar.js',
          'vendor/angular-animate/angular-animate.js',
          'vendor/angular-growl/angular-growl.js',
          'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
          'vendor/angular-ui-router/angular-ui-router.js',
          'vendor/angular-cache/angular-cache.js'
        ],
        css: [],
        assets: ['vendor/font-awesome/fonts/*.*']
      }
    };

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    module_prefix: '(function ( window, angular, undefined ) {',
    module_suffix: '})( window, window.angular );',

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          "package.json",
          "bower.json"
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          "package.json",
          "client/bower.json"
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      all: ['<%= build_dir %>'],
      dev: ['<%= build_dir %>/*', '!<%= build_dir %>/assets', '!<%= build_dir %>/*.html']
    },

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`.
     */
    copy: {
      app_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= build_dir %>/assets/',
            cwd: 'assets',
            expand: true
          }
       ]
      },
      vendor_assets: {
        files: [
          {
            src: [ '<%= vendor_files.assets %>' ],
            dest: '<%= build_dir %>/assets/',
            cwd: '.',
            expand: true,
            flatten: true
          }
       ]
      },
      appjs: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      app_html: {
        files: [
          {
            src: [ '<%= app_files.htmls %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      build_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= recess.build.dest %>'
        ],
        dest: '<%= recess.build.dest %>'
      },
      /**
       * concatinates all app files in src folder so that ngmin can be applied
       */
      appjs: {
        src: [
          '<%= build_dir %>/src/**/*.js'
        ],
        dest: '<%= build_dir %>/src.js'
      },
      /**
       * The `alljs` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      alljs: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          '<%= vendor_files.js %>',
          '<%= module_prefix %>',
          '<%= concat.appjs.dest %>',
          '<%= html2js.main.dest %>',
          '<%= module_suffix %>'
        ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    /**
     * `grunt coffee` compiles the CoffeeScript sources. To work well with the
     * rest of the build, we have a separate compilation task for sources and
     * specs so they can go to different places. For example, we need the
     * sources to live with the rest of the copied JavaScript so we can include
     * it in the final build, but we don't want to include our specs there.
     */
    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: [ '<%= app_files.coffee %>' ],
        dest: '<%= build_dir %>',
        ext: '.js'
      }
    },

    /**
     * `ng-min` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngmin: {
      compile: {
        files: [
          {
            src: [ '<%= concat.appjs.dest %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.alljs.dest %>': '<%= concat.alljs.dest %>'
        }
      }
    },

    /**
     * `recess` handles our LESS compilation and uglification automatically.
     * Only our `main.less` file is included in compilation; all other files
     * must be imported from this file.
     */
    recess: {
      build: {
        src: [ '<%= app_files.less %>' ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
        options: {
          compile: true,
          compress: false,
          noUnderscores: false,
          noIDs: false,
          zeroUnits: false
        }
      },
      compile: {
        src: [ '<%= recess.build.dest %>' ],
        dest: '<%= recess.build.dest %>',
        options: {
          compile: true,
          compress: true,
          noUnderscores: false,
          noIDs: false,
          zeroUnits: false
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        laxcomma: true,
        debug: true
      },
      globals: {}
    },

    /**
     * `coffeelint` does the same as `jshint`, but for CoffeeScript.
     * CoffeeScript is not the default in ngBoilerplate, so we're just using
     * the defaults here.
     */
    coffeelint: {
      src: {
        files: {
          src: [ '<%= app_files.coffee %>' ]
        }
      },
      test: {
        files: {
          src: [ '<%= app_files.coffeeunit %>' ]
        }
      }
    },

    jade: {
      options: {
        pretty: true
      },
      compile2html: {
        files: [
          {
            src: ['<%= app_files.jade %>'],
            cwd: '.',
            dest: '<%= build_dir %>',
            expand: true,
            ext: '.html'
          }
        ]
      },
      index: {
        options: { data: { pkg: pkg } },
        files:{ "<%= build_dir %>/index.html": "src/index.jade" }
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      main: {
        options: {
          base: '<%= build_dir %>/src',
          module: 'vizCentral.templates'
        },
        src: [ '<%= build_dir %>/src/**/*.html' ],
        dest: '<%= build_dir %>/templates.js'
      }
    },

    removelogging: {
      dist: {
        files: { '<%= concat.alljs.dest %>': '<%= concat.alljs.dest %>' }
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: 'karma-unit.js'
      },
      unit: {
        runnerPort: 9111,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true,
        forever: false
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:src', 'copy:appjs', 'concat:appjs', 'concat:alljs', 'karma:unit:run' ]
      },

      /**
       * When our CoffeeScript source files change, we want to run lint them and
       * run our unit tests.
       */
      coffeesrc: {
        files: [
          '<%= app_files.coffee %>'
        ],
        tasks: [ 'coffeelint:src', 'coffee:source', 'copy:appjs', 'concat:appjs', 'concat:alljs', 'karma:unit:run' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'assets/**/*'
        ],
        tasks: [ 'copy:app_assets' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= app_files.htmls %>'
        ],
        tasks: [ 'copy:app_html', 'html2js', 'concat:alljs' ]
      },

      /**
       * When jade files change, we need to convert to html and then to js.
       */
      jade: {
        files: [ '<%= app_files.jade %>' ],
        tasks: [ 'jade:compile2html', 'html2js', 'concat:alljs' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: [ 'src/**/*.less' ],
        tasks: [ 'recess:build', 'concat:build_css' ]
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      },

      /**
       * When a CoffeeScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      coffeeunit: {
        files: [
          '<%= app_files.coffeeunit %>'
        ],
        tasks: [ 'coffeelint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [
    'build',
    'karma:unit',
    'delta'
  ]);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'build', 'compile' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean:all', 'jade', 'copy:app_html', 'html2js', 'jshint', 'coffeelint',
    'coffee', 'recess:build',
    'copy:app_assets', 'copy:vendor_assets', 'copy:appjs', 'copy:vendorjs',
    'concat:build_css', 'concat:appjs', 'ngmin', 'concat:alljs'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'clean:dev', 'recess:compile', 'removelogging', 'uglify'
  ]);

};
