import { experiments } from 'jeol-data-test';

import { parseJEOL } from '../src';

describe('parse a 1D (parseJEOL)', () => {
  it('parse a proton', () => {
    let parsed = parseJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_qHNMR_400MHz_Jeol.jdf'],
    );
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

    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(32767);
  });

  it('parse a carbon', () => {
    let parsed = parseJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_13CNMR_400MHz_Jeol.jdf'],
    );
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
    let parsed = parseJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_HMBC_400MHz_Jeol.jdf'],
    );
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
    let parsed = parseJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_HSQC_400MHz_Jeol.jdf'],
    );
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
    let parsed = parseJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_COSY_400MHz_Jeol.jdf'],
    );
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
    let parsed = parseJEOL(
      experiments['8PA_SynLK_5360u150uDMSO_snc1811_qH_SpinOn-1-2.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('Proton');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.field.magnitude).toStrictEqual(9.389766);
    expect(parsed.info.dataPoints[0]).toStrictEqual(262144);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(399782198.37825);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      7494.00479616307,
    );
    expect(parsed.info.spectralWidthClipped[0].magnitude).toStrictEqual(
      5995.203836930457,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(8.74512384);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.11434943841801559,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(6);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(262144);
    expect(parsed.data.im).toHaveLength(262144);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Ppm');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(26215);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(235929);

    let diff =
      parsed.headers.dataOffsetStart[0] - parsed.headers.dataOffsetStop[0];
    expect(diff).toStrictEqual(-209714);

    let clipped =
      (parsed.info.dataPoints[0] *
        parsed.info.spectralWidthClipped[0].magnitude) /
      parsed.info.spectralWidth[0].magnitude;

    expect(clipped).toBeCloseTo(209715, 0);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(13.498044630825031);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(-1.4980446308250324);
    expect(parsed.info.probeId).toStrictEqual(3448);
  });

  it('parse a processed proton 2', () => {
    let parsed = parseJEOL(
      experiments['8PA_SynLK_5360u150uDMSO_snc1811_qH_spinOff-1-2.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('Proton');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.field.magnitude).toStrictEqual(9.389766);
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
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(5);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(262144);
    expect(parsed.data.im).toHaveLength(262144);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Ppm');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(26215);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(235929);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(12.498044630825033);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(-2.498044630825032);
  });

  it('PM032109_5000u200u_01172018bzhou_qH-1-1.jdf', () => {
    let parsed = parseJEOL(
      experiments['PM032109_5000u200u_01172018bzhou_qH-1-1.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('1H');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.field.magnitude).toStrictEqual(9.389766);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(399782198.37825);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      7494.00479616307,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(4.37256192);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.22869887683603118,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(5);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(32767);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(4.37242848);
  });

  it('PM032220_3000U200U_Bin_180218_qH-1-1.jdf', () => {
    let parsed = parseJEOL(
      experiments['PM032220_3000U200U_Bin_180218_qH-1-1.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('1H');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.field.magnitude).toStrictEqual(9.389766);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(399782198.37825);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      7494.00479616307,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(4.37256192);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.22869887683603118,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(5);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(32767);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(4.37242848);
  });
});

describe('parse more', () => {
  it('parse 11_pm033220_400JEOL_278Kcarbon_.jdf', () => {
    let parsed = parseJEOL(experiments['11_pm033220_400JEOL_278Kcarbon_.jdf']);
    expect(parsed.info.nucleus[0]).toStrictEqual('Carbon13');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(100525303.3251654);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      31565.656565656565,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(1.03809024);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.9633073903093434,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(100);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(32767);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(1.03805856);
  });

  it('12_pm033236_400JEOL_278k carbon_C.jdf', () => {
    let parsed = parseJEOL(
      experiments['12_pm033236_400JEOL_278k carbon_C.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('Carbon13');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(65536);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(100525303.3251654);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      31565.656565656565,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(2.07618048);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.4816536951546717,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(100);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(65536);
    expect(parsed.data.im).toHaveLength(65536);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(65535);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(2.0761488);
  });

  it('13_pm032839_400JEOL_278k carbon_C.jdf', () => {
    let parsed = parseJEOL(
      experiments['13_pm032839_400JEOL_278k carbon_C.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('Carbon13');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(65536);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(100525303.3251654);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      31565.656565656565,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(2.07618048);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.4816536951546717,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(100);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(65536);
    expect(parsed.data.im).toHaveLength(65536);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(65535);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(2.0761488);
  });

  it('14_400JEOL_PM033228 278K_C.jdf', () => {
    let parsed = parseJEOL(experiments['14_400JEOL_PM033228 278K_C.jdf']);
    expect(parsed.info.nucleus[0]).toStrictEqual('Carbon13');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(65536);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(100525303.3251654);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      31565.656565656565,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(2.07618048);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.4816536951546717,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(100);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(65536);
    expect(parsed.data.im).toHaveLength(65536);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(65535);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(2.0761488);
  });

  it('16_pm031642_400JEOL_278k_C.jdf', () => {
    let parsed = parseJEOL(experiments['16_pm031642_400JEOL_278k_C.jdf']);
    expect(parsed.info.nucleus[0]).toStrictEqual('Carbon13');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(65536);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(100525303.3251654);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      31565.656565656565,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(2.07618048);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.4816536951546717,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(100);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(65536);
    expect(parsed.data.im).toHaveLength(65536);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(65535);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(2.0761488);
  });

  it('PM031528 255K_400JEOL_C.jdf', () => {
    let parsed = parseJEOL(experiments['PM031528 255K_400JEOL_C.jdf']);
    expect(parsed.info.nucleus[0]).toStrictEqual('Carbon13');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(65536);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(100525303.3251654);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      31565.656565656565,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(2.07618048);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.4816536951546717,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(100);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(65536);
    expect(parsed.data.im).toHaveLength(65536);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(65535);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(2.0761488);
  });

  it('PM032220_3000U200U_MeOD_18224Bin_qC-2-1.jdf', () => {
    let parsed = parseJEOL(
      experiments['PM032220_3000U200U_MeOD_18224Bin_qC-2-1.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('13C');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.field.magnitude).toStrictEqual(9.389766);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(100525303.3251654);
    expect(parsed.info.spectralWidth[0].magnitude).toStrictEqual(
      31565.656565656565,
    );
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(1.03809024);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.info.resolution[0].magnitude).toStrictEqual(
      0.9633073903093434,
    );
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(100);
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);

    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
    expect(parsed.headers.dataOffsetStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataOffsetStop[0]).toStrictEqual(32767);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(1.03805856);
  });
});

describe('parse EC=8C', () => {
  it('parse a proton', () => {
    let parsed = parseJEOL(
      experiments['EC=8C_5m200u_MeOD_bzhou21_20190228_qH-1-1.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('Proton');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(399782198.37825);
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(5);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(4.37242848);
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(4.37256192);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
  });

  it('parse a carbon', () => {
    let parsed = parseJEOL(
      experiments['EC=8C_5m200u_MeOD_bzhou21_20190228_qCarbon-1-1.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('Carbon13');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);
  });

  it('parse an HMBC', () => {
    let parsed = parseJEOL(
      experiments['EC=8C_5m200u_MeOD_bzhou21_20190228_HMBCabs-1-1.jdf'],
    );
    expect(parsed.info.dataDimension).toStrictEqual(2);
    expect(parsed.info.nucleus[0]).toStrictEqual('Proton');
    expect(parsed.info.nucleus[1]).toStrictEqual('Carbon13');
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(2048);
    expect(parsed.info.dataPoints[1]).toStrictEqual(256);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Real_Complex');
    expect(parsed.data.re).toHaveLength(256);
    expect(parsed.data.im).toHaveLength(256);
  });

  it('parse an HSQC', () => {
    let parsed = parseJEOL(
      experiments['EC=8C_5m200u_MeOD_bzhou21_20190228__HSQC-1-1.jdf'],
    );
    expect(parsed.info.dataDimension).toStrictEqual(2);
    expect(parsed.info.nucleus[0]).toStrictEqual('Proton');
    expect(parsed.info.nucleus[1]).toStrictEqual('Carbon13');
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(1024);
    expect(parsed.info.dataPoints[1]).toStrictEqual(256);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re.re).toHaveLength(256);
    expect(parsed.data.re.im).toHaveLength(256);
    expect(parsed.data.im.re).toHaveLength(256);
    expect(parsed.data.im.im).toHaveLength(256);
  });
});

describe('parse EC=8EC', () => {
  it('parse a proton', () => {
    let parsed = parseJEOL(
      experiments['EC=8EC_2m200u_MeOD_bzhou21_20190328_qH-1-1.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('Proton');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(parsed.info.frequency[0].magnitude).toStrictEqual(399782198.37825);
    expect(parsed.info.frequencyOffset[0].magnitude).toStrictEqual(5);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);
    expect(parsed.headers.dataAxisStart[0]).toStrictEqual(0);
    expect(parsed.headers.dataAxisStop[0]).toStrictEqual(4.37242848);
    expect(parsed.info.acquisitionTime[0].magnitude).toStrictEqual(4.37256192);
    expect(parsed.info.acquisitionTime[0].unit).toStrictEqual('Second');
    expect(parsed.headers.dataUnits[0].base).toStrictEqual('Second');
  });

  it('parse a carbon', () => {
    let parsed = parseJEOL(
      experiments['EC=8EC_2m200u_MeOD_bzhou21_20190328_qC-1-1.jdf'],
    );
    expect(parsed.info.nucleus[0]).toStrictEqual('Carbon13');
    expect(parsed.info.dataDimension).toStrictEqual(1);
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(32768);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re).toHaveLength(32768);
    expect(parsed.data.im).toHaveLength(32768);
  });

  it('parse an HMBC', () => {
    let parsed = parseJEOL(
      experiments['EC=8EC_2m200u_MeOD_bzhou21_20190328_HMBC-ABS-1-1.jdf'],
    );
    expect(parsed.info.dataDimension).toStrictEqual(2);
    expect(parsed.info.nucleus[0]).toStrictEqual('Proton');
    expect(parsed.info.nucleus[1]).toStrictEqual('Carbon13');
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(2048);
    expect(parsed.info.dataPoints[1]).toStrictEqual(256);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Real_Complex');
    expect(parsed.data.re).toHaveLength(256);
    expect(parsed.data.im).toHaveLength(256);
  });

  it('parse an HSQC', () => {
    let parsed = parseJEOL(
      experiments['EC=8EC_2m200u_MeOD_bzhou21_20190328_HSQC-1-1.jdf'],
    );
    expect(parsed.info.dataDimension).toStrictEqual(2);
    expect(parsed.info.nucleus[0]).toStrictEqual('Proton');
    expect(parsed.info.nucleus[1]).toStrictEqual('Carbon13');
    expect(parsed.info.dataSections).toStrictEqual(['re', 'im']);
    expect(parsed.info.dataPoints[0]).toStrictEqual(1024);
    expect(parsed.info.dataPoints[1]).toStrictEqual(256);
    expect(typeof parsed.headers).toBe('object');
    expect(typeof parsed.parameters).toBe('object');
    expect(parsed.headers.dataAxisType[0]).toStrictEqual('Complex');
    expect(parsed.data.re.re).toHaveLength(256);
    expect(parsed.data.re.im).toHaveLength(256);
    expect(parsed.data.im.re).toHaveLength(256);
    expect(parsed.data.im.im).toHaveLength(256);
  });
});
