import { IOBuffer } from 'iobuffer';

import * as table from './conversionTables';
import {
  getPar,
  getMagnitude,
  getParamName,
  getArray,
  getUnit,
  getString,
} from './utils';

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
    endian: table.endianness[buffer.readInt8()],
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
  header.dataType = table.dataTypeTable[byte >> 6];
  header.dataFormat = table.dataFormatTable[byte & 0b00111111];
  header.dataInstrument = table.instrumentTable[buffer.readInt8()];
  header.translate = getArray(buffer, 8, 'readUint8');
  header.dataAxisType = getArray(buffer, 8, 'readUint8').map(
    (x) => table.dataAxisTypeTable[x],
  );

  header.dataUnits = getUnit(buffer, 8);
  header.title = getString(buffer, 124);

  let byteArray = [];
  for (byte in getArray(buffer, 4, 'readUint8')) {
    byteArray.push(table.dataAxisRangedTable[byte >> 4]);
    byteArray.push(table.dataAxisRangedTable[byte & 0b00001111]);
  }

  header.dataAxisRanged = byteArray;
  header.dataPoints = getArray(buffer, 8, 'readUint32');
  header.dataOffsetStart = getArray(buffer, 8, 'readUint32');
  header.dataOffsetStop = getArray(buffer, 8, 'readUint32');
  header.dataAxisStart = getArray(buffer, 8, 'readFloat64');
  header.dataAxisStop = getArray(buffer, 8, 'readFloat64');

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

  header.baseFreq = getArray(buffer, 8, 'readFloat64');
  header.zeroPoint = getArray(buffer, 8, 'readFloat64');
  header.reversed = getArray(buffer, 8, 'readBoolean');
  buffer.skip(3);
  header.annotationOK = Boolean(buffer.readByte() >> 7);
  header.historyUsed = buffer.readUint32();
  header.historyLength = buffer.readUint32();
  header.paramStart = buffer.readUint32();
  header.paramLength = buffer.readUint32();
  header.ListStart = getArray(buffer, 8, 'readUint32');
  header.ListLength = getArray(buffer, 8, 'readUint32');
  header.dataStart = buffer.readUint32();
  header.dataLength = (buffer.readUint32() << 32) | buffer.readUint32();
  header.contextStart = (buffer.readUint32() << 32) | buffer.readUint32();
  header.contextLength = buffer.readUint32();
  header.annoteStart = (buffer.readUint32() << 32) | buffer.readUint32();
  header.annoteLength = buffer.readUint32();
  header.totalSize = (buffer.readUint32() << 32) | buffer.readUint32();
  header.unitLocation = getArray(buffer, 8, 'readUint8');

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
    let valueType = table.valueTypeTable[buffer.readInt32()];
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
        section = getArray(buffer, header.dataPoints[0], 'readFloat32');
      } else if (header.dataType === '64Bit Float') {
        section = getArray(buffer, header.dataPoints[0], 'readFloat64');
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
                row[k] = getArray(buffer, me, 'readFloat32');
              } else if (header.dataType === '64Bit Float') {
                row[k] = getArray(buffer, me, 'readFloat64');
              }
            } else {
              if (header.dataType === '32Bit Float') {
                row[k] = row[k].concat(getArray(buffer, me, 'readFloat32'));
              } else if (header.dataType === '64Bit Float') {
                row[k] = row[k].concat(getArray(buffer, me, 'readFloat64'));
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
