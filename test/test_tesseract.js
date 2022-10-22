
import assert from 'assert';
import tesseract from '../middleware/tesseract.js'


describe('tesseract', function () {
  describe('middleware', function () {
    it('should fail on missing data"', function () {
      const context = {
        input: {
          type: 'image',
          filename: 'testdata/sample_text.png',
          format: 'txt',
          ocr: true,
        }
      };
      assert.throws(
        () => tesseract(context, ()=> {
            assert.ok(false);
        }),
        /"data" argument/
      )
    });
  });
});