module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		banner: '/* <%= pkg.info.name %> - version <%= pkg.info.version %> - ' +
			'<%= grunt.template.today("dd-mm-yyyy") %>\n' +
			'<%= pkg.info.description %>\n ' +
			'- <%= pkg.info.author.email %> */\n',
		
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: ['dist/lea.min.js']
				}
			}
		},

		uglify: {
			options: {
				mangle: true,
				sourceMap: true
			},
			dist: {
				files: {
					'dist/lea.min.js': ['src/lea.js']
				}
			}
		},

		watch: {
			scripts: {
				files: ['src/*.js'],
				tasks: ['uglify']
			}
		},

		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 2,
				title: "Lea.js",
				success: true,
				duration: 2
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-notify');

	grunt.task.run('notify_hooks');
	
	grunt.registerTask('default', ['uglify','usebanner']);
}