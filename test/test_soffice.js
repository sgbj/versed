
import assert from 'assert';
import soffice from '../middleware/soffice.js'


describe('soffice', function () {
  describe('middleware', function () {
    it('should fail on missing data"', function () {
      const context = {
        input: {
          type: 'docx',
          filename: 'testdata/file-sample_100kB.docx',
          format: 'pdf',
        }
      };
      assert.throws(
        () => soffice(context, ()=> {
            assert.ok(false);
        }),
        /"data" argument/
      )
    });
  });
});