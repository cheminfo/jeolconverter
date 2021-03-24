export const endianness = {
  0: 'bigEndian',
  1: 'littleEndian',
};

export const instrumentTable = {
  0: 'NONE',
  1: 'GSX',
  2: 'ALPHA',
  3: 'ECLIPSE',
  4: 'MASS_SPEC',
  5: 'COMPILER',
  6: 'OTHER_NMR',
  7: 'UNKNOWN',
  8: 'GEMINI',
  9: 'UNITY',
  10: 'ASPECT',
  11: 'UX',
  12: 'FELIX',
  13: 'LAMBDA',
  14: 'GE_1280',
  15: 'GE_OMEGA',
  16: 'CHEMAGNETICS',
  17: 'CDFF',
  18: 'GALACTIC',
  19: 'TRIAD',
  20: 'GENERIC_NMR',
  21: 'GAMMA',
  22: 'JCAMP_DX',
  23: 'AMX',
  24: 'DMX',
  25: 'ECA',
  26: 'ALICE',
  27: 'NMR_PIPE',
  28: 'SIMPSON',
};

export const dataTypeTable = {
  0: '64Bit Float',
  1: '32Bit Float',
  2: 'Reserved',
  3: 'Reserved',
};

export const dataFormatTable = {
  1: 'One_D',
  2: 'Two_D',
  3: 'Three_D',
  4: 'Four_D',
  5: 'Five_D',
  6: 'Six_D',
  7: 'Seven_D',
  8: 'Eight_D',
  9: 'not for NMR data formats',
  10: 'not for NMR data formats',
  11: 'not for NMR data formats',
  12: 'Small_Two_D',
  13: 'Small_Three_D',
  14: 'Small_Four_D',
};

export const dataAxisTypeTable = {
  0: 'None', //Axis is not used.
  1: 'Real', //Axis has real data only, no imaginary.
  2: 'TPPI',
  3: 'Complex',
  4: 'Real_Complex',
  /* Axis should be accessed as complex when it is the major axis,
            accessed as real otherwise.  This is only valid when all axes in
            use have this setting.*/
  5: 'Envelope',
  /* Behaves the same way as a Real_Complex dimension but the data
        has different meaning.  Instead of being treated as real and
        imaginary parts of a complex number, the data should be treated as minimum and maximum parts of a projection.  This is used
        for the data that results from an envelope projection.*/
};

export const prefixTable = {
  '-8': 'Yotta',
  '-6': 'Exa',
  '-7': 'Zetta',
  '-5': 'Pecta',
  '-4': 'Tera',
  '-3': 'Giga',
  '-2': 'Mega',
  '-1': 'Kilo',
  0: 'None',
  1: 'Milli',
  2: 'Micro',
  3: 'Nano',
  4: 'Pico',
  5: 'Femto',
  6: 'Atto',
  7: 'Zepto',
};

export const unitPrefixTable = {
  Yotta: 24,
  Exa: 21,
  Zetta: 18,
  Pecta: 15,
  Tera: 12,
  Giga: 9,
  Mega: 6,
  Kilo: 3,
  None: 0,
  Milli: -3,
  Micro: -6,
  Nano: -9,
  Pico: -12,
  Femto: -15,
  Atto: -18,
  Zepto: -21,
};

export const baseTable = {
  0: 'None',
  1: 'Abundance',
  2: 'Ampere',
  3: 'Candela',
  4: 'Celsius',
  5: 'Coulomb',
  6: 'Degree',
  7: 'Electronvolt',
  8: 'Farad',
  9: 'Sievert',
  10: 'Gram',
  11: 'Gray',
  12: 'Henry',
  13: 'Hertz',
  14: 'Kelvin',
  15: 'Joule',
  16: 'Liter',
  17: 'Lumen',
  18: 'Lux',
  19: 'Meter',
  20: 'Mole',
  21: 'Newton',
  22: 'Ohm',
  23: 'Pascal',
  24: 'Percent',
  25: 'Point',
  26: 'Ppm',
  27: 'Radian',
  28: 'Second',
  29: 'Siemens',
  30: 'Steradian',
  31: 'Tesla',
  32: 'Volt',
  33: 'Watt',
  34: 'Weber',
  35: 'Decibel',
  36: 'Dalton',
  37: 'Thompson',
  38: 'Ugeneric', // Treated as None, but never displayed',
  39: 'LPercent ', // Treated as percent for display, but different for comparison',
  40: 'PPT', // Parts per trillion (Private, do not use)',
  41: 'PPB ', // Parts per billion (Private, do not use)',
  42: 'Index',
};

export const dataAxisRangedTable = {
  0: 'Ranged',
  /* The ruler for the axis ranges from Data_Axis_Start[n] to
        Data_Axis_Stop[n] with a step function of
            (Data_Axis_Stop[n] - Data_Axis_Start[n]) /
            (Data_Offset_Stop[n] - Data_Offset_Start[n]) */
  1: 'Listed', // (deprecated)
  /* The ruler for the axis is a list of doubles stored in the
        List Section.  Values in the ruler may be anything.*/
  2: 'Sparse',
  /*The ruler for the axis is a list of doubles stored in the
        List Section.  Values in the rulers must be strictly monotonically
        increasing or decreasing.*/
  3: 'Listed',
  /* The ruler for the axis is a list of doubles stored in the
        List Section.  Values in the rulers do not fit definition of Sparse.*/
};

export const valueTypeTable = {
  0: 'String',
  1: 'Integer',
  2: 'Float',
  3: 'Complex',
  4: 'Infinity',
};
