import { join } from 'path';

import { parseJEOL } from '../src/parseJEOL';

const { readFileSync } = require('fs');

const proton = 'Rutin_3080ug200uL_DMSOd6_qHNMR_400MHz_Jeol.jdf';
const carbon = 'Rutin_3080ug200uL_DMSOd6_13CNMR_400MHz_Jeol.jdf';
const cosy = 'Rutin_3080ug200uL_DMSOd6_COSY_400MHz_Jeol.jdf';
const hsqc = 'Rutin_3080ug200uL_DMSOd6_HSQC_400MHz_Jeol.jdf';
const hmbc = 'Rutin_3080ug200uL_DMSOd6_HMBC_400MHz_Jeol.jdf';

const dirName = join(__dirname, '../data/Rutin_NMRdata_400MHz_DMSOd6_Jeol/');

describe('parse a 1D (parseJEOL)', () => {
  it('parse a proton', () => {
    let data = parseJEOL(readFileSync(join(dirName, proton)));
    expect(data.nucleus[0]).toStrictEqual('1H');
    expect(data.dataDimension).toStrictEqual(1);
    expect(data.dataSections).toStrictEqual(2);
    expect(data.dataPoints[0]).toStrictEqual(32768);
    expect(data.frequency[0].magnitude).toStrictEqual(399782198.37825);
    expect(data.frequencyOffset[0].magnitude).toStrictEqual(8.999999999999998);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(data.data.re).toHaveLength(32768);
    expect(data.data.im).toHaveLength(32768);
  });

  it('parse a carbon', () => {
    let data = parseJEOL(readFileSync(join(dirName, carbon)));
    expect(data.nucleus[0]).toStrictEqual('13C');
    expect(data.dataDimension).toStrictEqual(1);
    expect(data.dataSections).toStrictEqual(2);
    expect(data.dataPoints[0]).toStrictEqual(32768);
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
    expect(data.dataDimension).toStrictEqual(2);
    expect(data.nucleus[0]).toStrictEqual('1H');
    expect(data.nucleus[1]).toStrictEqual('13C');
    expect(data.dataSections).toStrictEqual(2);
    expect(data.dataPoints[0]).toStrictEqual(4096);
    expect(data.dataPoints[1]).toStrictEqual(512);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Real_Complex');
    expect(data.data.re).toHaveLength(512);
    expect(data.data.im).toHaveLength(512);
  });

  it('parse an HSQC', () => {
    let data = parseJEOL(readFileSync(join(dirName, hsqc)));
    expect(data.dataDimension).toStrictEqual(2);
    expect(data.nucleus[0]).toStrictEqual('1H');
    expect(data.nucleus[1]).toStrictEqual('13C');
    expect(data.dataSections).toStrictEqual(4);
    expect(data.dataPoints[0]).toStrictEqual(4096);
    expect(data.dataPoints[1]).toStrictEqual(256);
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
    console.log(data);
    expect(data.dataDimension).toStrictEqual(2);
    expect(data.nucleus[0]).toStrictEqual('1H');
    expect(data.nucleus[1]).toStrictEqual('1H');
    expect(data.dataSections).toStrictEqual(2);
    expect(data.dataPoints[0]).toStrictEqual(5120);
    expect(data.dataPoints[1]).toStrictEqual(512);
    expect(data.frequency[1].magnitude).toStrictEqual(399782198.37825);
    expect(data.frequency[1].unit).toStrictEqual('Hertz');
    expect(data.frequencyOffset[1].magnitude).toStrictEqual(5);
    expect(data.frequencyOffset[1].unit).toStrictEqual('Ppm');
    expect(data.acquisitionTime[0].magnitude).toStrictEqual(0.9306112000000001);
    expect(data.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(data.spectralWidth[0].magnitude).toStrictEqual(5501.760563380281);
    expect(data.resolution[0].magnitude).toStrictEqual(1.0745626100352113);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Real_Complex');
    expect(data.headers.dataAxisType[1]).toStrictEqual('Real_Complex');
    expect(data.data.re).toHaveLength(512);
    expect(data.data.im).toHaveLength(512);
  });
});
