module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		banner: '/*\n' +
			' * <%= pkg.name %> - version <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
			' * <%= pkg.description %>\n' +
			' * Author: <%= pkg.author %>\n' +
			' * Homepage: <%= pkg.homepage %>\n' +
			' */',
		
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

		replace: {
			dist: {
				src: ['dist/lea.min.js'],
				overwrite: true,
				replacements: [
					{
						from: '{{version}}',
						to: '<%= pkg.version %>'
					},
					{
						from: '{{homepage}}',
						to: '<%= pkg.homepage %>'
					}
				]
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
				tasks: ['uglify','usebanner','replace']
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
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-notify');

	grunt.task.run('notify_hooks');
	
	grunt.registerTask('default', ['uglify','usebanner','replace']);
}