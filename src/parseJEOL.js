import { IOBuffer } from 'iobuffer';

/**
 * A parser for 1D and 2D JDL NMR Files
 * @param {File} file - a file object pointing to a JDL file
 * @return {Object} - an Object with converted data
 */
export function parseJEOL(file) {
  const buffer = new IOBuffer(file);
  buffer.setBigEndian();

  let byte;
  let header = {
    fileIdentifier: buffer.readChars(8),
    endian: endianness[buffer.readInt8()],
    majorVersion: buffer.readUint8(),
    minorVersion: buffer.readUint16(),
    dataDimensionNumber: buffer.readUint8(),
  };

  header.dataDimensionExist = buffer
    .readByte()
    .toString(2)
    .split('')
    .map((x) => Boolean(Number(x)));

  byte = buffer.readByte();
  header.dataType = dataTypeTable[byte >> 6];
  header.dataFormat = dataFormatTable[byte & 0b00111111];
  header.dataInstrument = instrumentTable[buffer.readInt8()];
  header.translate = getUint8Array(buffer, 8);
  header.dataAxisType = getUint8Array(buffer, 8).map(
    (x) => dataAxisTypeTable[x],
  );

  header.dataUnits = getUnit(buffer, 8);
  header.title = getString(buffer, 124);

  let byteArray = [];
  for (byte in getUint8Array(buffer, 4)) {
    byteArray.push(dataAxisRangedTable[byte >> 4]);
    byteArray.push(dataAxisRangedTable[byte & 0b00001111]);
  }

  header.dataAxisRanged = byteArray;
  header.dataPoints = getUint32Array(buffer, 8);
  header.dataOffsetStart = getUint32Array(buffer, 8);
  header.dataOffsetStop = getUint32Array(buffer, 8);
  header.dataAxisStart = getFloat64Array(buffer, 8);
  header.dataAxisStop = getFloat64Array(buffer, 8);

  byteArray = new Uint8Array(4);
  for (let i = 0; i < 4; i++) {
    byteArray[i] = buffer.readByte();
  }
  let year = 1990 + (byteArray[0] >> 1);
  let month = ((byteArray[0] << 3) & 0b00001000) + (byteArray[1] >> 5);
  let day = byteArray[2] & 0b00011111;
  header.creationTime = { year, month, day };

  for (let i = 0; i < 4; i++) {
    byteArray[i] = buffer.readByte();
  }
  year = 1990 + (byteArray[0] >> 1);
  month = ((byteArray[0] << 3) & 0b00001000) + (byteArray[1] >> 5);
  day = byteArray[2] & 0b00011111;
  header.revisionTime = { year, month, day };

  header.nodeName = getString(buffer, 16);
  header.site = getString(buffer, 128);
  header.author = getString(buffer, 128);
  header.comment = getString(buffer, 128);

  let dataAxisTitles = [];
  for (let i = 0; i < 8; i++) {
    dataAxisTitles.push(getString(buffer, 32));
  }
  header.dataAxisTitles = dataAxisTitles;

  header.baseFreq = getFloat64Array(buffer, 8);
  header.zeroPoint = getFloat64Array(buffer, 8);
  header.reversed = getBooleanArray(buffer, 8);
  buffer.skip(3);
  header.annotationOK = Boolean(buffer.readByte() >> 7);
  header.historyUsed = buffer.readUint32();
  header.historyLength = buffer.readUint32();
  header.paramStart = buffer.readUint32();
  header.paramLength = buffer.readUint32();
  header.ListStart = getUint32Array(buffer, 8);
  header.ListLength = getUint32Array(buffer, 8);
  header.dataStart = buffer.readUint32();
  header.dataLength = (buffer.readUint32() << 32) | buffer.readUint32();
  header.contextStart = (buffer.readUint32() << 32) | buffer.readUint32();
  header.contextLength = buffer.readUint32();
  header.annoteStart = (buffer.readUint32() << 32) | buffer.readUint32();
  header.annoteLength = buffer.readUint32();
  header.totalSize = (buffer.readUint32() << 32) | buffer.readUint32();
  header.unitLocation = getUint8Array(buffer, 8);

  let compoundUnit = [];
  for (let i = 0; i < 2; i++) {
    let unit = [];
    let scaler = buffer.readInt16();
    for (let j = 0; j < 5; j++) {
      byte = buffer.readInt16();
      unit.push(byte);
    }
    compoundUnit.push({ scaler, unit });
  }
  header.compoundUnit = compoundUnit;

  if (header.endian === 'littleEndian') {
    buffer.setLittleEndian();
  }
  buffer.seek(header.paramStart);

  let parameters = {
    parameterSize: buffer.readUint32(),
    lowIndex: buffer.readUint32(),
    highIndex: buffer.readUint32(),
    totalSize: buffer.readUint32(),
  };
  let paramArray = [];
  for (let p = 0; p < parameters.highIndex + 1; p++) {
    buffer.skip(4);
    let scaler = buffer.readInt16();
    let unit = getUnit(buffer, 5);
    buffer.skip(16);
    let valueType = valueTypeTable[buffer.readInt32()];
    buffer.seek(buffer.offset - 20);
    let value;
    switch (valueType) {
      case 'String':
        value = getParamName(buffer, 16);
        break;
      case 'Integer':
        value = buffer.readInt32();
        buffer.skip(12);
        break;
      case 'Float':
        value = buffer.readFloat64();
        buffer.skip(8);
        break;
      case 'Complex':
        value.Real = buffer.readFloat64();
        value.Imag = buffer.readFloat64();
        break;
      case 'Infinity':
        value = buffer.readInt32();
        buffer.skip(12);
        break;
      default:
        buffer.skip(16);
        break;
    }
    buffer.skip(4);
    let name = getParamName(buffer, 28);
    paramArray.push({ name, scaler, unit, value, valueType });
  }
  parameters.paramArray = paramArray;

  buffer.seek(header.dataStart);
  if (header.endian === 'littleEndian') {
    buffer.setLittleEndian();
  }

  let data = [];
  let dataSectionCount = 1;
  let realComplex = 0;
  for (let type of header.dataAxisType) {
    if ((type === 'Real_Complex') & (realComplex === 0)) {
      dataSectionCount += 1;
      realComplex += 1;
    }
    if (type === 'Complex') {
      dataSectionCount *= 2;
    }
  }

  if (header.dataFormat === 'One_D') {
    for (let s = 0; s < dataSectionCount; s++) {
      let section;
      if (header.dataType === '32Bit Float') {
        section = getFloat32Array(buffer, header.dataPoints[0]);
      } else if (header.dataType === '64Bit Float') {
        section = getFloat64Array(buffer, header.dataPoints[0]);
      }
      if (s === 0) data.re = section;
      if (s === 1) data.im = section;
    }
  }

  if (header.dataFormat === 'Two_D') {
    let me = 32;
    let dim1 = header.dataPoints[0];
    let dim2 = header.dataPoints[1];
    // console.log(
    //   `dim1: ${dim1},
    // dim2: ${dim2},
    // total: ${dim1 * dim2},
    // total(byte): ${dim1 * dim2 * 8},
    // total(length): ${dim1 * dim2 * 8 * dataSectionCount}
    // m size: ${dim1 / me} / ${dim2 / me}`,
    // );
    let I = dim2 / me;
    let J = dim1 / me;

    for (let s = 0; s < dataSectionCount; s++) {
      let section;
      for (let i = 0; i < I; i++) {
        let row = [];
        for (let j = 0; j < J; j++) {
          for (let k = 0; k < me; k++) {
            if (j === 0) {
              if (header.dataType === '32Bit Float') {
                row[k] = getFloat32Array(buffer, me);
              } else if (header.dataType === '64Bit Float') {
                row[k] = getFloat64Array(buffer, me);
              }
            } else {
              if (header.dataType === '32Bit Float') {
                row[k] = row[k].concat(getFloat32Array(buffer, me));
              } else if (header.dataType === '64Bit Float') {
                row[k] = row[k].concat(getFloat64Array(buffer, me));
              }
            }
          }
        }
        if (i === 0) {
          section = row;
        } else {
          section = section.concat(row);
        }
      }
      if (dataSectionCount === 2) {
        if (s === 0) data.re = section;
        if (s === 1) data.im = section;
      }
      if (dataSectionCount === 4) {
        if (s === 0) data.reRe = section;
        if (s === 1) data.reIm = section;
        if (s === 2) data.imRe = section;
        if (s === 3) data.imIm = section;
      }
    }
  }
  // console.log(getPar(parameters, 'X_DOMAIN').value);

  let nucleus = [];
  let acquisitionTime = [];
  let spectralWidth = [];
  let resolution = [];
  let frequency = [];
  let frequencyOffset = [];
  if ((header.dataFormat === 'One_D') | (header.dataFormat === 'Two_D')) {
    nucleus.push(getPar(parameters, 'X_DOMAIN').value);
    acquisitionTime.push(getMagnitude(parameters, 'x_acq_time'));
    spectralWidth.push(getMagnitude(parameters, 'X_SWEEP'));
    resolution.push(getMagnitude(parameters, 'X_RESOLUTION'));
    frequency.push(getMagnitude(parameters, 'X_FREQ'));
    frequencyOffset.push(getMagnitude(parameters, 'X_OFFSET'));
  }
  if (header.dataFormat === 'Two_D') {
    nucleus.push(getPar(parameters, 'Y_DOMAIN').value);
    acquisitionTime.push(getMagnitude(parameters, 'y_acq_time'));
    spectralWidth.push(getMagnitude(parameters, 'Y_SWEEP'));
    resolution.push(getMagnitude(parameters, 'Y_RESOLUTION'));
    frequency.push(getMagnitude(parameters, 'Y_FREQ'));
    frequencyOffset.push(getMagnitude(parameters, 'X_OFFSET'));
  }
  console.log(frequencyOffset);

  let digest = {
    dataDimension: header.dataDimensionNumber,
    nucleus: nucleus,
    nucleii: header.dataAxisTitles.slice(0, header.dataDimensionNumber),
    dataSections: dataSectionCount,
    field: {
      magnitude: getPar(parameters, 'field_strength').value * 42.577478518,
      unit: 'MHz',
    },
    solvent: getPar(parameters, 'solvent').value,
    dataPoints: header.dataPoints.slice(0, header.dataDimensionNumber),
    experiment: getPar(parameters, 'experiment').value,
    sampleName: getPar(parameters, 'sample_id').value,
    temperature: getMagnitude(parameters, 'temp_get'),
    digitalFilter: getPar(parameters, 'FILTER_FACTOR').value,
    decimationRate: getPar(parameters, 'decimation_rate').value,
    acquisitionTime: acquisitionTime,
    spectralWidth: spectralWidth,
    // spectralWidthClipped: {
    //   magnitude: getPar(parameters, 'X_SWEEP_CLIPPED').value,
    //   unit: 'Hz',
    // },
    resolution: resolution,
    frequency: frequency,
    frequencyOffset: frequencyOffset,
    headers: header,
    parameters: parameters,
    data: data,
  };
  return digest;
}

const endianness = {
  0: 'bigEndian',
  1: 'littleEndian',
};

const instrumentTable = {
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

const dataTypeTable = {
  0: '64Bit Float',
  1: '32Bit Float',
  2: 'Reserved',
  3: 'Reserved',
};

const dataFormatTable = {
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

const dataAxisTypeTable = {
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

const prefixTable = {
  '-8': 'Yotta',
  '-6': 'Exa',
  '-7': 'Zetta',
  '-5': 'Pecta',
  '-4': 'Tera',
  '-3': 'Giga',
  '-2': 'Mega',
  '-1': 'Kilo',
  '0': 'None',
  '1': 'Milli',
  '2': 'Micro',
  '3': 'Nano',
  '4': 'Pico',
  '5': 'Femto',
  '6': 'Atto',
  '7': 'Zepto',
};

const unitPrefixTable = {
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

const baseTable = {
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

const dataAxisRangedTable = {
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

const valueTypeTable = {
  0: 'String',
  1: 'Integer',
  2: 'Float',
  3: 'Complex',
  4: 'Infinity',
};

function getPar(param, searchStr) {
  return param.paramArray.find((o) => o.name === searchStr);
}

function getMagnitude(param, searchStr) {
  let par = getPar(param, searchStr);
  let unit = par.unit[0].base;
  let unitMult = unitPrefixTable[par.unit[0].prefix];
  let magnitude = par.value * 10 ** unitMult;
  return { magnitude, unit };
}

function getUnit(buffer, size) {
  let unit = [];
  for (let i = 0; i < size; i++) {
    let byte = buffer.readByte();
    let prefix = prefixTable[byte >> 4];
    let power = byte & 0b00001111;
    let base = baseTable[buffer.readInt8()];
    unit.push({ prefix, power, base });
  }
  return unit;
}

function getString(buffer, size) {
  let string = [];
  for (let i = 0; i < size; i++) {
    let char = buffer.readChar();
    if (char !== '\u0000') {
      string.push(char);
    }
  }
  return string.join('');
}

function getParamName(buffer, size) {
  let string = [];
  for (let i = 0; i < size; i++) {
    let char = buffer.readChar();
    if (char !== ' ') {
      string.push(char);
    }
  }
  return string.join('');
}

function getUint32Array(buffer, size) {
  let double = [];
  for (let i = 0; i < size; i++) {
    double.push(buffer.readUint32());
  }
  return double;
}

function getFloat64Array(buffer, size) {
  let double = [];
  for (let i = 0; i < size; i++) {
    double.push(buffer.readFloat64());
  }
  return double;
}

function getFloat32Array(buffer, size) {
  let double = [];
  for (let i = 0; i < size; i++) {
    double.push(buffer.readFloat32());
  }
  return double;
}

function getUint8Array(buffer, size) {
  let double = [];
  for (let i = 0; i < size; i++) {
    double.push(buffer.readUint8());
  }
  return double;
}

function getBooleanArray(buffer, size) {
  let bool = [];
  for (let i = 0; i < size; i++) {
    bool.push(buffer.readBoolean());
  }
  return bool;
}
