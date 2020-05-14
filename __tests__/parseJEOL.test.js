import { Rutin } from 'jeol-data-test';

import { parseJEOL } from '../src';

describe('parse a 1D (parseJEOL)', () => {
  it('parse a proton', () => {
    let parsed = parseJEOL(Rutin.experiment.proton);
    expect(parsed.info.nucleus[0]).toStrictEqual('1H');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
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
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(3.27145728);
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(3.27155712);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
  });

  it('parse a carbon', () => {
    let parsed = parseJEOL(Rutin.experiment.carbon);
    expect(parsed.info.nucleus[0]).toStrictEqual('13C');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);
  });
});

describe('parse a 2D (parseJEOL)', () => {
  it('parse an HMBC', () => {
    let parsed = parseJEOL(Rutin.experiment.hmbc);
    expect(parsed.info.dataDimension).toStrictEqual(2);
    expect(parsed.info.nucleus[0]).toStrictEqual('1H');
    expect(parsed.info.nucleus[1]).toStrictEqual('13C');
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(4096);
    expect(parsed.info.dataPoints[1]).toStrictEqual(512);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Real_Complex');
    expect(parsed.data.re).toHaveLength(512);
    expect(parsed.data.im).toHaveLength(512);
  });

  it('parse an HSQC', () => {
    let parsed = parseJEOL(Rutin.experiment.hsqc);
    expect(parsed.info.dataDimension).toStrictEqual(2);
    expect(parsed.info.nucleus[0]).toStrictEqual('1H');
    expect(parsed.info.nucleus[1]).toStrictEqual('13C');
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(4096);
    expect(parsed.info.dataPoints[1]).toStrictEqual(256);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re.re).toHaveLength(256);
    expect(parsed.data.re.im).toHaveLength(256);
    expect(parsed.data.im.re).toHaveLength(256);
    expect(parsed.data.im.im).toHaveLength(256);
  });

  it('parse a COSY', () => {
    let parsed = parseJEOL(Rutin.experiment.cosy);
    expect(parsed.info.dataDimension).toStrictEqual(2);
    expect(parsed.info.nucleus[0]).toStrictEqual('1H');
    expect(parsed.info.nucleus[1]).toStrictEqual('1H');
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(5120);
    expect(parsed.info.dataPoints[1]).toStrictEqual(512);
    expect(parsed.info.frequency[1].magnitude).toStrictEqual(399782198.37825);
    expect(parsed.info.frequency[1].unit).toStrictEqual('Hertz');
    expect(parsed.info.frequencyOffset[1].magnitude).toStrictEqual(5);
    expect(parsed.info.frequencyOffset[1].unit).toStrictEqual('Ppm');
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(
      0.9306112000000001,
    );
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      5501.760563380281,
    );
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      1.0745626100352113,
    );
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Real_Complex');
    expect(parsed.headers.dataAxisType[1]).toStrictEqual('Real_Complex');
    expect(parsed.data.re).toHaveLength(512);
    expect(parsed.data.im).toHaveLength(512);
  });
});

describe('parse a 1D (processed)', () => {
  it('parse a processed proton', () => {
    let parsed = parseJEOL(Rutin.experiment.processedProton);
    expect(parsed.info.nucleus[0]).toStrictEqual('Proton');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.field.magnitude).toStrictEqual(399.7925601540468);
    expect(parsed.info.dataPoints[0]).toStrictEqual(262144);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(399782198.37825);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      7494.00479616307,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(8.74512384);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.11434943841801559,
    );
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(399782198.37825);
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(6);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(262144);
    expect(parsed.data.im).toHaveLength(262144);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Ppm');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(26215);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(235929);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(13.498044630825031);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(-1.4980446308250324);
  });
});
