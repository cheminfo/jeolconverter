import { join } from 'path';

import { parseJEOL } from '../parseJEOL';

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
    expect(data.nucleus[0]).toStrictEqual('Proton');
    expect(data.dataDimension).toStrictEqual(1);
    expect(data.section).toStrictEqual(2);
    expect(data.dataPoints[0]).toStrictEqual(32768);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(data.data.Re).toHaveLength(32768);
    expect(data.data.Im).toHaveLength(32768);
  });

  it('parse a carbon', () => {
    let data = parseJEOL(readFileSync(join(dirName, carbon)));
    expect(data.nucleus[0]).toStrictEqual('Carbon13');
    expect(data.dataDimension).toStrictEqual(1);
    expect(data.section).toStrictEqual(2);
    expect(data.dataPoints[0]).toStrictEqual(32768);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(data.data.Re).toHaveLength(32768);
    expect(data.data.Im).toHaveLength(32768);
  });
});

describe('parse a 2D (parseJEOL)', () => {
  it('parse an HMBC', () => {
    let data = parseJEOL(readFileSync(join(dirName, hmbc)));
    expect(data.dataDimension).toStrictEqual(2);
    expect(data.nucleus[0]).toStrictEqual('Proton');
    expect(data.nucleus[1]).toStrictEqual('Carbon13');
    expect(data.section).toStrictEqual(2);
    expect(data.dataPoints[0]).toStrictEqual(4096);
    expect(data.dataPoints[1]).toStrictEqual(512);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Real_Complex');
    expect(data.data.Re).toHaveLength(512);
    expect(data.data.Im).toHaveLength(512);
  });

  it('parse an HSQC', () => {
    let data = parseJEOL(readFileSync(join(dirName, hsqc)));
    expect(data.dataDimension).toStrictEqual(2);
    expect(data.nucleus[0]).toStrictEqual('Proton');
    expect(data.nucleus[1]).toStrictEqual('Carbon13');
    expect(data.section).toStrictEqual(4);
    expect(data.dataPoints[0]).toStrictEqual(4096);
    expect(data.dataPoints[1]).toStrictEqual(256);
    expect(typeof data.headers).toBe('object');
    expect(typeof data.parameters).toBe('object');
    expect(data.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(data.data.ReRe).toHaveLength(256);
    expect(data.data.ReIm).toHaveLength(256);
    expect(data.data.ImRe).toHaveLength(256);
    expect(data.data.ImIm).toHaveLength(256);
  });
});
