/**
 * @author nstCactus
 * @date 08/10/2020 02:33
 */
const ds18b20 = require('../dist');
const assert = require('assert');
const path = require('path');

describe('ds18b20', function () {
  describe('#list()', function () {
    it('should return the id of sensors know by the 1-wire bus master', async function () {
      // noinspection ES6MissingAwait
      for (const { dir, expected } of [
        //@formatter:off
        { dir: '0-devices',  expected: [] },
        { dir: 'no-devices', expected: [] },
        { dir: '1-device',   expected: [ '28-011111111111' ] },
        { dir: '6-devices',  expected: [ '28-011111111111', '28-022222222222', '28-033333333333', '28-044444444444', '28-055555555555', '28-066666666666' ] },
        //@formatter:on
      ]) {
        ds18b20.setW1Directory(path.join(__dirname, `data/${dir}`));
        let sensorIds = await ds18b20.list();
        assert.deepStrictEqual(sensorIds, expected);
      }
    });
  });

  describe('#read()', function () {
    it('should return the value read from the sensor if it is valid', async function () {
      for (const { dir, id, expected } of [
        //@formatter:off
        { dir: '1-device',  id: '28-011111111111', expected: 11.111 },
        { dir: '2-devices', id: '28-011111111111', expected: 22.221 },
        { dir: '2-devices', id: '28-022222222222', expected: 22.222 },
        { dir: '6-devices', id: '28-011111111111', expected: 66.661 },
        { dir: '6-devices', id: '28-022222222222', expected: 66.662 },
        { dir: '6-devices', id: '28-033333333333', expected: 66.663 },
        { dir: '6-devices', id: '28-044444444444', expected: 66.664 },
        { dir: '6-devices', id: '28-055555555555', expected: 66.665 },
        { dir: '6-devices', id: '28-066666666666', expected: 66.666 },
        //@formatter:on
      ]) {
        ds18b20.setW1Directory(path.join(__dirname, `data/${dir}`));
        let value = await ds18b20.read(id);
        assert.strictEqual(value, expected);
      }
    });

    it('should return a value with the correct amount of decimals.', async function () {
      for (const { dir, id, precision, expected } of [
        //@formatter:off
        { dir: '1-device',  id: '28-011111111111', precision: 0,  expected: 11 },
        { dir: '2-devices', id: '28-011111111111', precision: 1,  expected: 22.2 },
        { dir: '2-devices', id: '28-022222222222', precision: 2,  expected: 22.22 },
        { dir: '6-devices', id: '28-011111111111', precision: 2,  expected: 66.66 },
        { dir: '6-devices', id: '28-022222222222', precision: 0,  expected: 67 },
        { dir: '6-devices', id: '28-033333333333', precision: 2,  expected: 66.66 },
        { dir: '6-devices', id: '28-044444444444', precision: 2,  expected: 66.66 },
        { dir: '6-devices', id: '28-055555555555', precision: 2,  expected: 66.67 },
        { dir: '6-devices', id: '28-066666666666', precision: -1, expected: 70 },
        //@formatter:on
      ]) {
        ds18b20.setW1Directory(path.join(__dirname, `data/${dir}`));
        let value = await ds18b20.read(id, precision);
        assert.strictEqual(value, expected);
      }
    });

    it('should return null the value could not be read.', async function () {
      for (const { dir, id } of [
        //@formatter:off
        { dir: '0-devices',                id: '28-011111111111' },
        { dir: '1-device-crc-zero',        id: '28-011111111111' },
        { dir: '1-device-no',              id: '28-011111111111' },
        { dir: '1-device-invalid-content', id: '28-011111111111' },
        { dir: 'no-devices',               id: '28-011111111111' },
        //@formatter:on
      ]) {
        ds18b20.setW1Directory(path.join(__dirname, `data/${dir}`));
        let value = await ds18b20.read(id);
        assert.strictEqual(value, null);
      }
    });
  });
});
