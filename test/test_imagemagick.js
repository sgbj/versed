
import assert from 'assert';
import imagemagick from '../middleware/imagemagick.js'


describe('imagemagick', function () {
  describe('middleware', function () {
    it('should fail on missing data"', function () {
      const context = {
        input: {
          type: 'image',
          filename: 'testdata/sample_text.png',
          format: 'jpg',
        }
      };
      assert.throws(
        () => imagemagick(context, ()=> {
            assert.ok(false);
        }),
        /"data" argument/
      )
    });
  });
});