import path from "path";

export let w1Directory = '/sys/bus/w1/devices/w1_bus_master1';

/**
 * Advanced usage. Set the base path for the 1-wire bus.
 * Defaults to _/sys/bus/w1/devices/w1_bus_master1_ on a Raspberry Pi.
 * @param path The base path for the 1-wire bus
 */
export const setW1Directory = (path:string): void => {
  w1Directory = path;
};

export function sensorFilename(id: string) {
  return path.join(w1Directory, id, 'w1_slave');
}
