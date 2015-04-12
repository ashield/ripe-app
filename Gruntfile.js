module.exports = function(grunt) { 
	grunt.initConfig({ 
		pkg: grunt.file.readJSON('package.json'),
		sass: {
		  all: {
		  	options: {
		  		sourcemap: 'none'
		  	},
		    files: [{
		      expand: true,
		      cwd: 'public/sass',
		      src: ['**/*.scss'],
		      dest: 'public/stylesheets',
		      ext: '.css'
		    }]
		  }
		},
		watch: {
			css: {
				files: 'public/sass/*.scss',
				tasks: ['sass']
			}
		} 
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.registerTask('default',['watch']);

}