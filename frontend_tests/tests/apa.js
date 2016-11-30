//var helloWorld = require('../../resources/assets/js/scripts/karma_test.js');

/*describe("Hello world", function() {
  it("says hello", function() {
    expect(helloWorld()).toEqual("Hello world!");
  });
});*/

describe('JavaScript addition operator', function () {
    it('adds two numbers together', function () {
    	var result = helloWorld(1,2);
        expect(result).toEqual(3);
    });
});