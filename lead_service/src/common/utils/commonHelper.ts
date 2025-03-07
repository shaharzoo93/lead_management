import { ResponseTypeEnum } from './constant/apiResponseTypeEnum.js';
import pkg from 'jstoxml';
const { toXML } = pkg;
import _ from 'lodash';

export class CommonHelper {

  static GetResponseByResponseType<T>(responseType: ResponseTypeEnum, data: T) {
    if (responseType == ResponseTypeEnum.XML) {
      return CommonHelper.OBJtoXML(data);
    }
    return data;
  }

  static OBJtoXML(obj: any) {
    // return toXML(obj, {});
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += '<' + prop + '>';
          xml += CommonHelper.OBJtoXML(new Object(obj[prop][array]));
          xml += '</' + prop + '>';
        }
      } else if (typeof obj[prop] == 'object') {
        xml += CommonHelper.OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : '</' + prop + '>';
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml;
  }

  static NormalizeTagsData = (requestTags: any) => {
    for (const tags of requestTags) {
      for (const record of tags) {
        const values = Object.values(record);
        const total = <number>values.reduce((accumulator: any, value: any) => {
          return parseFloat(accumulator) + parseFloat(value);
        }, 0);

        if (total != 100) {
          for (const gas in record) {
            record[gas] = (record[gas] / <number>total) * 100;
          }
        }
      }
    }
    return requestTags;
  };

  static TransformColumnSchemaToRowSchema(data: any): { [key: string]: number }[][] {
    var keys = _.keys(data);
    var arrays = _.values(data);
    var arrayOfPropertyLists = _.zip.apply(_, arrays);

    var arrayOfObjects = _.map(arrayOfPropertyLists, function (list) {
      var data = [];
      var obj: any = {};

      _.each(keys, function (key, i) {
        obj[key] = list[i];
      });
      data.push(obj);

      return data;
    });

    return arrayOfObjects;
  }
}
