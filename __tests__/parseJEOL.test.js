import { Rutin } from 'jeol-data-test';

import { parseJEOL } from '../src/index';

describe('parse a 1D (parseJEOL)', () => {
  it('parse a proton', () => {
    let parsed = parseJEOL(Rutin.experiment.proton);
    expect(parsed.info.nucleus[0]).toStrictEqual('1H');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(2);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(399782198.37825);
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(
      8.999999999999998,
    );
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);
  });

  it('parse a carbon', () => {
    let data = parseJEOL(Rutin.experiment.carbon);
    expect(data.info.nucleus[0]).toStrictEqual('13C');
    expect(data.info.dataDimension).toStrictEqual(1);
    expect(data.info.dataSections).toStrictEqual(2);
    expect(data.info.dataPoints[0]).toStrictEqual(32768);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(data.data.re).toHaveLength(32768);
    expect(data.data.im).toHaveLength(32768);
  });
});

describe('parse a 2D (parseJEOL)', () => {
  it('parse an HMBC', () => {
    let data = parseJEOL(Rutin.experiment.hmbc);
    expect(data.info.dataDimension).toStrictEqual(2);
    expect(data.info.nucleus[0]).toStrictEqual('1H');
    expect(data.info.nucleus[1]).toStrictEqual('13C');
    expect(data.info.dataSections).toStrictEqual(2);
    expect(data.info.dataPoints[0]).toStrictEqual(4096);
    expect(data.info.dataPoints[1]).toStrictEqual(512);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Real_Complex');
    expect(data.data.re).toHaveLength(512);
    expect(data.data.im).toHaveLength(512);
  });

  it('parse an HSQC', () => {
    let data = parseJEOL(Rutin.experiment.hsqc);
    expect(data.info.dataDimension).toStrictEqual(2);
    expect(data.info.nucleus[0]).toStrictEqual('1H');
    expect(data.info.nucleus[1]).toStrictEqual('13C');
    expect(data.info.dataSections).toStrictEqual(4);
    expect(data.info.dataPoints[0]).toStrictEqual(4096);
    expect(data.info.dataPoints[1]).toStrictEqual(256);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(data.data.reRe).toHaveLength(256);
    expect(data.data.reIm).toHaveLength(256);
    expect(data.data.imRe).toHaveLength(256);
    expect(data.data.imIm).toHaveLength(256);
  });

  it('parse a COSY', () => {
    let data = parseJEOL(Rutin.experiment.cosy);
    expect(data.info.dataDimension).toStrictEqual(2);
    expect(data.info.nucleus[0]).toStrictEqual('1H');
    expect(data.info.nucleus[1]).toStrictEqual('1H');
    expect(data.info.dataSections).toStrictEqual(2);
    expect(data.info.dataPoints[0]).toStrictEqual(5120);
    expect(data.info.dataPoints[1]).toStrictEqual(512);
    expect(data.info.frequency[1].magnitude).toStrictEqual(399782198.37825);
    expect(data.info.frequency[1].unit).toStrictEqual('Hertz');
    expect(data.info.frequencyOffset[1].magnitude).toStrictEqual(5);
    expect(data.info.frequencyOffset[1].unit).toStrictEqual('Ppm');
    expect(data.info.acquisitionTime[0].magnitude).toStrictEqual(
      0.9306112000000001,
    );
    expect(data.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(data.info.spectralWidth[0].magnitude).toStrictEqual(
      5501.760563380281,
    );
    expect(data.info.resolution[0].magnitude).toStrictEqual(1.0745626100352113);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Real_Complex');
    expect(data.headers.dataAxisType[1]).toStrictEqual('Real_Complex');
    expect(data.data.re).toHaveLength(512);
    expect(data.data.im).toHaveLength(512);
  });
});
