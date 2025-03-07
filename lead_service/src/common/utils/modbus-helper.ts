export class ModbusHelper {
  static getDataType(tag_type: string) {
    let dataType;
    switch (tag_type) {
      case 'Float3412':
        dataType = 'FLT32';
        break;
      case 'UInt16':
        dataType = 'UINT16';
        break;
      case 'UInt32':
        dataType = 'UINT32';
        break;
      case 'Int32':
        dataType = 'INT32';
        break;
      case 'Int16':
        dataType = 'INT16';
        break;
      case 'boolean':
        dataType = 'boolean';
        break;
      default:
        dataType = 'FLT32';
    }
    return dataType;
  }

  static getEndianness(tag_type: string) {
    let endianness;
    switch (tag_type) {
      case 'Float3412':
        endianness = 'Little-Endian';
        break;
      case 'UInt32':
      case 'Int32':
        endianness = 'Big-Endian';
        break;
      default:
        endianness = 'Little-Endian';
    }
    return endianness;
  }

  static getFunctionCode(tag_type: string) {
    if (tag_type.toLowerCase() == 'boolean') return 1;
    else return 3;
  }
}
