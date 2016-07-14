casper.test.begin( 'Functional Testing', 3, function (test) {

	casper
		.start( 'index.html' )
		
		// Test item count
		.then( function () {

			var count = this.evaluate( function () {
				$('#list').append('<li>OK</li>')
				return $('li').length
			})

			test.assertEquals( 6, count )

		})

		// Test item content
		.then( function () {
			
			var contentLI = this.evaluate( function () {
				return $('#list li:last-child').text()
			})

			test.assertEquals( 'OK' , contentLI, 'Item content' )

		})

		// Test Ajax response
		.then( function () {

			this.click('#btn-ajax')
			this.wait(300)

		})
		.then( function () {

			var content = this.evaluate( function () {
				return $('#xhr-log').html()
			})

			test.assertEquals( '{"i":10}' , content, 'Ajax response' )

		})

		// Run Tests
		.run( function () {
			test.done()
		})

})