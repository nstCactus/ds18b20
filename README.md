# @nstcactus/ds18b20

Yet another package to read temperatures from a ds18b20 sensor on the Raspberry
Pi.


## Why another package?

The other packages I found are old, have bugs and/or try to do too much.
Plus I needed an excuse to practice TypeScript and test-driven development!


## API

### `list()`

````js
/**
 * List ds18b20 sensor ids.
 * @return An array of sensor ids
 */
async function list(): Promise<string[]> {}
````

### `read()`

````js
/**
 * Read the temperature from the sensor having the given id.
 * @param id        The id of the sensor to read from
 * @param precision The number of decimal places
 * @return          The current temperature or null if an error has occurred
 */
async function read(id: string, precision: number = Infinity): Promise<number|null> {}
````

### `setW1Directory()`
````js
/**
 * Advanced usage. Set the base path for the 1-wire bus.
 * Defaults to _/sys/bus/w1/devices/w1_bus_master1_ on a Raspberry Pi.
 * @param path The base path for the 1-wire bus
 */
function setW1Directory(path:string): void {}
````


## Example

Output the value read from all sensors:

````js
const ds18b20 = require('@nstcactus/ds18b20');

const sensors = ds18b20.list();
sensors.forEach(async (id) => {
  const temperature = await ds18b20.read(id, 2);
  console.log(`${id}: ${temperature}ºC`);
});

// Or
sensors.forEach(id => {
  ds18b20.read(id, 2).then(temperature => {
    console.log(`${id}: ${temperature}ºC`);
  });
});
````
