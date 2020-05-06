import { join } from 'path';

import { parseJEOL } from '../src/index';

const { readFileSync } = require('fs');

const proton = 'Rutin_3080ug200uL_DMSOd6_qHNMR_400MHz_Jeol.jdf';
const carbon = 'Rutin_3080ug200uL_DMSOd6_13CNMR_400MHz_Jeol.jdf';
const cosy = 'Rutin_3080ug200uL_DMSOd6_COSY_400MHz_Jeol.jdf';
const hsqc = 'Rutin_3080ug200uL_DMSOd6_HSQC_400MHz_Jeol.jdf';
const hmbc = 'Rutin_3080ug200uL_DMSOd6_HMBC_400MHz_Jeol.jdf';

const dirName = join(__dirname, '../data/Rutin_NMRdata_400MHz_DMSOd6_Jeol/');

describe('parse a 1D (parseJEOL)', () => {
  it('parse a proton', () => {
    let parsed = parseJEOL(readFileSync(join(dirName, proton)));
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
    let data = parseJEOL(readFileSync(join(dirName, carbon)));
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
    let data = parseJEOL(readFileSync(join(dirName, hmbc)));
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
    let data = parseJEOL(readFileSync(join(dirName, hsqc)));
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
    let data = parseJEOL(readFileSync(join(dirName, cosy)));
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
