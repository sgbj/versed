
const assert = require('assert');
const ffmpeg = require('../middleware/ffmpeg')


describe('ffmpeg', function () {
  describe('middleware', function () {
    it('should fail on missing data"', function () {
      const context = {
        input: {
          type: 'video',
          filename: 'testdata/sample_640x360.mkv',
          format: 'png',
        }
      };
      assert.throws(
        () => ffmpeg(context),
        /"data" argument/
      )
    });
  });
});