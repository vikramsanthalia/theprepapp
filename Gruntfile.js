module.exports = function ( grunt ) {

  grunt.loadNpmTasks('grunt-forever');

  grunt.initConfig({
    forever: {
      options: {
        index: 'server/index.js',
        logDir: 'logs'
      }
    }
  });
};
