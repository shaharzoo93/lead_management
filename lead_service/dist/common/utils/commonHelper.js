"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonHelper = void 0;
const apiResponseTypeEnum_js_1 = require("./constant/apiResponseTypeEnum.js");
const jstoxml_1 = __importDefault(require("jstoxml"));
const { toXML } = jstoxml_1.default;
const lodash_1 = __importDefault(require("lodash"));
class CommonHelper {
    static GetResponseByResponseType(responseType, data) {
        if (responseType == apiResponseTypeEnum_js_1.ResponseTypeEnum.XML) {
            return CommonHelper.OBJtoXML(data);
        }
        return data;
    }
    static OBJtoXML(obj) {
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
            }
            else if (typeof obj[prop] == 'object') {
                xml += CommonHelper.OBJtoXML(new Object(obj[prop]));
            }
            else {
                xml += obj[prop];
            }
            xml += obj[prop] instanceof Array ? '' : '</' + prop + '>';
        }
        var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
        return xml;
    }
    static NormalizeTagsData = (requestTags) => {
        for (const tags of requestTags) {
            for (const record of tags) {
                const values = Object.values(record);
                const total = values.reduce((accumulator, value) => {
                    return parseFloat(accumulator) + parseFloat(value);
                }, 0);
                if (total != 100) {
                    for (const gas in record) {
                        record[gas] = (record[gas] / total) * 100;
                    }
                }
            }
        }
        return requestTags;
    };
    static TransformColumnSchemaToRowSchema(data) {
        var keys = lodash_1.default.keys(data);
        var arrays = lodash_1.default.values(data);
        var arrayOfPropertyLists = lodash_1.default.zip.apply(lodash_1.default, arrays);
        var arrayOfObjects = lodash_1.default.map(arrayOfPropertyLists, function (list) {
            var data = [];
            var obj = {};
            lodash_1.default.each(keys, function (key, i) {
                obj[key] = list[i];
            });
            data.push(obj);
            return data;
        });
        return arrayOfObjects;
    }
}
exports.CommonHelper = CommonHelper;
