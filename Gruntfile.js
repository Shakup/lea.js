module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		banner: '/*!\n' +
			' * <%= pkg.name %> - version <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
			' * <%= pkg.author %>\n' +
			' */',
		
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: ['./dist/*.js']
				}
			}
		},

		browserify: {
			dist: {
				files: {
					'./build/lea.js': ['./src/lea.js']
				}
			}
		},

		babel: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {'./build/lea.js': './build/lea.js'}
			}
		},

		umd: {
			all: {
				options: {
					src: './build/lea.js',
					dest: './dist/lea.js'
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
					'./dist/lea.min.js': ['./dist/lea.js']
				}
			}
		},

		watch: {
			scripts: {
				files: ['src/lea.js', '!src/_*.js'],
				tasks: ['browserify', 'babel', 'umd', 'uglify', 'usebanner']
			}
		},

		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 2,
				title: '<%= pkg.name %>',
				success: true,
				duration: 1
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-umd');

	grunt.task.run('notify_hooks');
	
	grunt.registerTask('default', ['browserify', 'babel', 'umd', 'uglify', 'usebanner']);

}