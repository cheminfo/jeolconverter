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
 * @param {ArrayBuffer} buffer - a buffer object containing the JDL file
 * @return {Object} - an Object with converted data
 */
export function parseJEOL(buffer) {
  let ioBuffer = new IOBuffer(buffer);
  ioBuffer.setBigEndian();

  // read header section
  let byte;
  let header = {};
  let byteArray = [];

  header.fileIdentifier = ioBuffer.readChars(8);
  header.endian = table.endianness[ioBuffer.readInt8()];
  header.majorVersion = ioBuffer.readUint8();
  header.minorVersion = ioBuffer.readUint16();
  header.dataDimensionNumber = ioBuffer.readUint8();

  header.dataDimensionExist = ioBuffer
    .readByte()
    .toString(2)
    .split('')
    .map((x) => Boolean(Number(x)));

  byte = ioBuffer.readByte();
  header.dataType = table.dataTypeTable[byte >> 6];
  header.dataFormat = table.dataFormatTable[byte & 0b00111111];
  header.dataInstrument = table.instrumentTable[ioBuffer.readInt8()];
  header.translate = getArray(ioBuffer, 8, 'readUint8');
  header.dataAxisType = getArray(ioBuffer, 8, 'readUint8').map(
    (x) => table.dataAxisTypeTable[x],
  );

  header.dataUnits = getUnit(ioBuffer, 8);
  header.title = getString(ioBuffer, 124);

  for (byte in getArray(ioBuffer, 4, 'readUint8')) {
    byteArray.push(table.dataAxisRangedTable[byte >> 4]);
    byteArray.push(table.dataAxisRangedTable[byte & 0b00001111]);
  }

  header.dataAxisRanged = byteArray;
  header.dataPoints = getArray(ioBuffer, 8, 'readUint32');
  header.dataOffsetStart = getArray(ioBuffer, 8, 'readUint32');
  header.dataOffsetStop = getArray(ioBuffer, 8, 'readUint32');
  header.dataAxisStart = getArray(ioBuffer, 8, 'readFloat64');
  header.dataAxisStop = getArray(ioBuffer, 8, 'readFloat64');

  byteArray = new Uint8Array(4);
  for (let i = 0; i < 4; i++) {
    byteArray[i] = ioBuffer.readByte();
  }
  let year = 1990 + (byteArray[0] >> 1);
  let month = ((byteArray[0] << 3) & 0b00001000) + (byteArray[1] >> 5);
  let day = byteArray[2] & 0b00011111;
  header.creationTime = { year, month, day };

  for (let i = 0; i < 4; i++) {
    byteArray[i] = ioBuffer.readByte();
  }
  year = 1990 + (byteArray[0] >> 1);
  month = ((byteArray[0] << 3) & 0b00001000) + (byteArray[1] >> 5);
  day = byteArray[2] & 0b00011111;
  header.revisionTime = { year, month, day };

  header.nodeName = getString(ioBuffer, 16);
  header.site = getString(ioBuffer, 128);
  header.author = getString(ioBuffer, 128);
  header.comment = getString(ioBuffer, 128);

  let dataAxisTitles = [];
  for (let i = 0; i < 8; i++) {
    dataAxisTitles.push(getString(ioBuffer, 32));
  }
  header.dataAxisTitles = dataAxisTitles;

  header.baseFreq = getArray(ioBuffer, 8, 'readFloat64');
  header.zeroPoint = getArray(ioBuffer, 8, 'readFloat64');
  header.reversed = getArray(ioBuffer, 8, 'readBoolean');
  ioBuffer.skip(3);
  header.annotationOK = Boolean(ioBuffer.readByte() >> 7);
  header.historyUsed = ioBuffer.readUint32();
  header.historyLength = ioBuffer.readUint32();
  header.paramStart = ioBuffer.readUint32();
  header.paramLength = ioBuffer.readUint32();
  header.ListStart = getArray(ioBuffer, 8, 'readUint32');
  header.ListLength = getArray(ioBuffer, 8, 'readUint32');
  header.dataStart = ioBuffer.readUint32();
  header.dataLength = (ioBuffer.readUint32() << 32) | ioBuffer.readUint32();
  header.contextStart = (ioBuffer.readUint32() << 32) | ioBuffer.readUint32();
  header.contextLength = ioBuffer.readUint32();
  header.annoteStart = (ioBuffer.readUint32() << 32) | ioBuffer.readUint32();
  header.annoteLength = ioBuffer.readUint32();
  header.totalSize = (ioBuffer.readUint32() << 32) | ioBuffer.readUint32();
  header.unitLocation = getArray(ioBuffer, 8, 'readUint8');

  let compoundUnit = [];
  for (let i = 0; i < 2; i++) {
    let unit = [];
    let scaler = ioBuffer.readInt16();
    for (let j = 0; j < 5; j++) {
      byte = ioBuffer.readInt16();
      unit.push(byte);
    }
    compoundUnit.push({ scaler, unit });
  }
  header.compoundUnit = compoundUnit;

  // section parameters (param header and array)
  if (header.endian === 'littleEndian') {
    ioBuffer.setLittleEndian();
  }
  ioBuffer.seek(header.paramStart);

  let parameters = {
    parameterSize: ioBuffer.readUint32(),
    lowIndex: ioBuffer.readUint32(),
    highIndex: ioBuffer.readUint32(),
    totalSize: ioBuffer.readUint32(),
  };
  let paramArray = [];
  for (let p = 0; p < parameters.highIndex + 1; p++) {
    ioBuffer.skip(4);
    let scaler = ioBuffer.readInt16();
    let unit = getUnit(ioBuffer, 5);
    ioBuffer.skip(16);
    let valueType = table.valueTypeTable[ioBuffer.readInt32()];
    ioBuffer.seek(ioBuffer.offset - 20);
    let value;
    switch (valueType) {
      case 'String':
        value = getParamName(ioBuffer, 16);
        break;
      case 'Integer':
        value = ioBuffer.readInt32();
        ioBuffer.skip(12);
        break;
      case 'Float':
        value = ioBuffer.readFloat64();
        ioBuffer.skip(8);
        break;
      case 'Complex':
        value.Real = ioBuffer.readFloat64();
        value.Imag = ioBuffer.readFloat64();
        break;
      case 'Infinity':
        value = ioBuffer.readInt32();
        ioBuffer.skip(12);
        break;
      default:
        ioBuffer.skip(16);
        break;
    }
    ioBuffer.skip(4);
    let name = getParamName(ioBuffer, 28);
    paramArray.push({ name, scaler, unit, value, valueType });
  }
  parameters.paramArray = paramArray;

  // data section
  ioBuffer.seek(header.dataStart);
  if (header.endian === 'littleEndian') {
    ioBuffer.setLittleEndian();
  }

  let data = {};
  let dataSectionCount = 1;
  let realComplex = 0;
  for (let type of header.dataAxisType) {
    if (type === 'Real_Complex' && realComplex === 0) {
      dataSectionCount += 1;
      realComplex += 1;
    }
    if (type === 'Complex') {
      dataSectionCount *= 2;
    }
  }

  if (header.dataFormat !== 'One_D' && header.dataFormat !== 'Two_D') {
    throw new Error('Only One_D and two_D data formats are implemented yet');
  }

  if (header.dataFormat === 'One_D') {
    for (let s = 0; s < dataSectionCount; s++) {
      let section;
      if (header.dataType === '32Bit Float') {
        section = getArray(ioBuffer, header.dataPoints[0], 'readFloat32');
      } else if (header.dataType === '64Bit Float') {
        section = getArray(ioBuffer, header.dataPoints[0], 'readFloat64');
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
    // `dim1: ${dim1},
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
                row[k] = getArray(ioBuffer, me, 'readFloat32');
              } else if (header.dataType === '64Bit Float') {
                row[k] = getArray(ioBuffer, me, 'readFloat64');
              }
            } else {
              if (header.dataType === '32Bit Float') {
                row[k] = row[k].concat(getArray(ioBuffer, me, 'readFloat32'));
              } else if (header.dataType === '64Bit Float') {
                row[k] = row[k].concat(getArray(ioBuffer, me, 'readFloat64'));
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
        if (s === 0) {
          data.re = {};
          data.re.re = section;
        }
        if (s === 1) data.re.im = section;
        if (s === 2) {
          data.im = {};
          data.im.re = section;
        }
        if (s === 3) data.im.im = section;
      }
    }
  }

  // format output
  let nucleus = [];
  let acquisitionTime = [];
  let spectralWidth = [];
  let spectralWidthClipped = [];
  let resolution = [];
  let originFrequency = [];
  let frequencyOffset = [];
  let dataUnits = [];
  if (header.dataFormat === 'One_D' || header.dataFormat === 'Two_D') {
    nucleus.push(getPar(parameters, 'X_DOMAIN').value);
    acquisitionTime.push(getMagnitude(parameters, 'x_acq_time'));
    spectralWidth.push(getMagnitude(parameters, 'X_SWEEP'));
    spectralWidthClipped.push(getMagnitude(parameters, 'X_SWEEP_CLIPPED'));
    resolution.push(getMagnitude(parameters, 'X_RESOLUTION'));
    originFrequency.push(getMagnitude(parameters, 'X_FREQ'));
    frequencyOffset.push(getMagnitude(parameters, 'X_OFFSET'));
    dataUnits.push(header.dataUnits[0].base);
  }
  if (header.dataFormat === 'Two_D') {
    nucleus.push(getPar(parameters, 'Y_DOMAIN').value);
    acquisitionTime.push(getMagnitude(parameters, 'y_acq_time'));
    spectralWidth.push(getMagnitude(parameters, 'Y_SWEEP'));
    resolution.push(getMagnitude(parameters, 'Y_RESOLUTION'));
    originFrequency.push(getMagnitude(parameters, 'Y_FREQ'));
    frequencyOffset.push(getMagnitude(parameters, 'Y_OFFSET'));
    dataUnits.push(header.dataUnits[1].base);
  }

  let digest = {
    info: {
      sampleName: getPar(parameters, 'sample_id').value,
      creationTime: header.creationTime,
      revisionTime: header.revisionTime,
      author: header.author,
      comment: header.comment,
      solvent: getPar(parameters, 'solvent').value,
      temperature: getMagnitude(parameters, 'temp_get'),
      probeName: getPar(parameters, 'probe_id').value,
      fieldStrength: getMagnitude(parameters, 'field_strength'),
      experiment: getPar(parameters, 'experiment').value,
      dimension: header.dataDimensionNumber,
      nucleus: nucleus,
      pulseStrength90: 1 / (4 * getMagnitude(parameters, 'X90').magnitude),
      numberOfScans: getPar(parameters, 'SCANS').value,
      relaxationTime: getMagnitude(parameters, 'relaxation_delay'),
      dataPoints: header.dataPoints.slice(0, header.dataDimensionNumber),
      dataOffsetStart: header.dataOffsetStart,
      dataOffsetStop: header.dataOffsetStop,
      dataUnits: dataUnits,
      dataSections: Object.keys(data),
      originFrequency,
      frequencyOffset,
      acquisitionTime,
      spectralWidth,
      spectralWidthClipped,
      dataAxisStart: header.dataAxisStart,
      dataAxisStop: header.dataAxisStop,
      resolution: resolution,
      digitalFilter: getPar(parameters, 'FILTER_FACTOR').value,
      decimationRate: getPar(parameters, 'decimation_rate').value,
      paramList: JSON.stringify(parameters.paramArray.map((par) => par.name)),
    },

    headers: header,
    parameters: parameters,
    data: data,
  };
  return digest;
}
