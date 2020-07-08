import * as table from './conversionTables';

export function getPar(param, searchStr) {
  return param.paramArray.find((o) => o.name === searchStr) || '';
}

export function getDigitalFilter(param) {
  const orders = param.paramArray.find((e) => e.name === 'orders');
  const factors = param.paramArray.find((e) => e.name === 'factors');
  const sweep = param.paramArray.find((e) => e.name === 'X_SWEEP');
  const acqTime = param.paramArray.find((e) => e.name === 'x_acq_time');
  const nbPoints = param.paramArray.find((e) => e.name === 'X_POINTS');
  const s = parseInt(orders.value.slice(0, 1), 10);
  const jump = orders.value.slice(1).length / s;

  let arg = 0;
  let factorNumber = new Int8Array(s);
  let offsetO = 1;
  let offsetF = 0;
  for (let i = 0; i < s; i++) {
    factorNumber[i] = parseInt(factors.value.slice(offsetF, offsetF + 1), 10);
    offsetF += 1;
  }

  for (let i = 0; i < s; i++) {
    let productorial = 1;
    for (let j = i; j < s; j++) {
      productorial *= factorNumber[j];
    }
    arg +=
      (parseInt(orders.value.slice(offsetO, offsetO + jump), 10) - 1) /
      productorial;
    offsetO += jump;
  }
  arg /= 2;

  const delaySec = arg / sweep.value;
  return (delaySec / acqTime.value) * (nbPoints.value - 1);
}

export function getMagnitude(param, searchStr) {
  let par = getPar(param, searchStr) || 'NA';
  if (par === 'NA') {
    return { magnitude: 'NA', unit: 'NA' };
  }
  let unit = par.unit[0].base;
  let unitMult = table.unitPrefixTable[par.unit[0].prefix];
  let magnitude = par.value * 10 ** unitMult;
  return { magnitude, unit };
}

export function getUnit(buffer, size) {
  let unit = [];
  for (let i = 0; i < size; i++) {
    let byte = buffer.readByte();
    let prefix = table.prefixTable[byte >> 4];
    let power = byte & 0b00001111;
    let base = table.baseTable[buffer.readInt8()];
    unit.push({ prefix, power, base });
  }
  return unit;
}

export function getString(buffer, size) {
  let string = [];
  for (let i = 0; i < size; i++) {
    let char = buffer.readChar();
    if (char !== '\u0000') {
      string.push(char);
    }
  }
  return string.join('');
}

export function getParamName(buffer, size) {
  let string = [];
  for (let i = 0; i < size; i++) {
    let char = buffer.readChar();
    if (char !== ' ') {
      string.push(char);
    }
  }
  return string.join('');
}

export function getArray(buffer, size, format) {
  let double = [];
  for (let i = 0; i < size; i++) {
    switch (format) {
      case 'readUint32':
        double.push(buffer.readUint32());
        break;
      case 'readFloat64':
        double.push(buffer.readFloat64());
        break;
      case 'readFloat32':
        double.push(buffer.readFloat32());
        break;
      case 'readUint8':
        double.push(buffer.readUint8());
        break;
      case 'readBoolean':
        double.push(buffer.readBoolean());
        break;
      default:
        break;
    }
  }
  return double;
}
