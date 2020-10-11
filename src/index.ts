import path from 'path';
import fs from 'fs';
import roundTo from 'round-to';
import {sensorFilename, w1Directory} from './utils';

export { setW1Directory } from './utils';

const W1_MASTER = 'w1_master_slaves';

/**
 * List ds18b20 sensor ids.
 * @return An array of sensor ids
 */
export async function list(): Promise<string[]>
{
  const filePath = path.join(w1Directory, W1_MASTER);
  const rawData = await fs.readFileSync(filePath, { encoding: 'utf8' });

  if (rawData.length === 0) {
    return [];
  }

  const sensorIds = rawData.split('\n');
  sensorIds.pop(); // Remove the last item as it's empty

  // Check if slaves have a corresponding file
  const promises = sensorIds.map(sensorId => new Promise((resolve, reject) => {
    fs.access(sensorFilename(sensorId), fs.constants.R_OK, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(sensorId);
    });
  }));

  // @ts-ignore
  const results = await Promise.allSettled(promises);
  return results.reduce((validSensorIds: string[], result: any) => {
    if (result.value) {
      validSensorIds.push(result.value);
    }

    return validSensorIds;
  }, []);
}

/**
 * Read the temperature from the sensor having the given id.
 * @param id The id of the sensor to read from
 * @param precision The number of decimal places
 * @return The current temperature or null if an error has occurred
 * @error Error If no sensor with the given id could be found
 * @error Error If the CRC check failed
 * @error Error If the sensor has been disconnected
 * @error Error If the value could not be parsed
 */
export async function read(id: string, precision: number = Infinity): Promise<number|null>
{
  try{
    const content = await fs.readFileSync(sensorFilename(id), 'utf8');
    const lines = content.split('\n');

    // crc=00 indicates the sensor has been disconnected
    if (lines[0].indexOf('crc=00') >= 0) {
      return null;
    }

    if (lines[0].indexOf('YES') === -1) {
      return null;
    }

    const result = content.match(/t=(-?\d+)$/m);
    if (result === null) {
      return null;
    }

    let temperature = parseInt(result[1], 10) / 1000;
    temperature = roundTo(temperature, precision);

    return temperature;
  } catch (error) {
    return null;
  }
}
