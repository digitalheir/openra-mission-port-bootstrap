import {isRectangle} from "../../system/Rectangle";
import {getArrayRank, isArray} from "../../system/Array";
import {MiniYaml} from "../MiniYaml";
import {MapOptions, mapOptionsFields} from "./MapOptions";
import {createMiniYamlNode, MiniYamlNode} from "../MiniYamlNode";
import {PlayerReference, playerReferenceFields} from "./map/PlayerReference";

interface TypeLoadInfo {
    YamlName: string;
    fieldValue: string;
}

export function createTypeLoadInfo(YamlName: string, fieldValue: string): TypeLoadInfo {
    return {
        YamlName, fieldValue
    }
}

function filterDifferingFields(fieldNames, o: any, from: any): MiniYamlNode[] {
    return fieldNames
        .map(k => {
            const formatValue = FieldSaver.FormatValue(o[k]);
            return formatValue !== FieldSaver.FormatValue(from[k]) ? createMiniYamlNode(k, formatValue) : undefined;
        })
        .filter(o => o !== undefined);
}

export class FieldSaver {
    static SaveDifferencesOptions(o: MapOptions, from: MapOptions): MiniYaml {
        return new MiniYaml(null, filterDifferingFields(mapOptionsFields, o, from));
    }

    static SaveDifferencesPlayerReference(o: PlayerReference, from: PlayerReference): MiniYaml {
        return new MiniYaml(null, filterDifferingFields(playerReferenceFields, o, from));
    }

    static FormatValue(v: any): string {
        if (v === null || v === undefined) return "";

        // // Color.ToString() does the wrong thing; force it to format as rgb[a] hex
        // if (t == typeof(Color)) {
        // return HSLColor.ToHexString((Color)v);
        // }

// // HSLColor.ToString() does the wrong thing; force it to format as rgb[a] hex
// if (t == typeof(HSLColor)) {
//     return ((HSLColor)v).ToHexString();
// }

// if (t == typeof(ImageFormat))
// {
//     return ((ImageFormat)v).ToString();
// }

        if (isRectangle(v)) {
            return `${v.X},${v.Y},${v.Width},${v.Height}`;
        }

// if (t.IsGenericType && t.GetGenericTypeDefinition() == typeof(BitSet<>))
// {
//     return ((IEnumerable<string>)v).Select(FormatValue).JoinWith(", ");
// }

        if (isArray(v) && getArrayRank(v) === 1) {
            return v.map(this.FormatValue).join(", ");
            // return ((Array)v).Cast<object>().Select(FormatValue).JoinWith(", ");
        }

// if (t.IsGenericType && t.GetGenericTypeDefinition() == typeof(HashSet<>))
// {
//     return ((System.Collections.IEnumerable)v).Cast<object>().Select(FormatValue).JoinWith(", ");
// }

// // This is only for documentation generation
// if (t.IsGenericType && t.GetGenericTypeDefinition() == typeof(Dictionary<,>))
// {
//     var result = "";
//     var dict = (System.Collections.IDictionary)v;
//     foreach (var kvp in dict)
//     {
//         var key = ((System.Collections.DictionaryEntry)kvp).Key;
//         var value = ((System.Collections.DictionaryEntry)kvp).Value;
//
//         var formattedKey = FormatValue(key);
//         var formattedValue = FormatValue(value);
//
//         result += "{0}: {1}{2}".F(formattedKey, formattedValue, Environment.NewLine);
//     }
//
//     return result;
// }

// if (t.IsGenericType && t.GetGenericTypeDefinition() == typeof(Primitives.Cache<,>))
// return ""; // TODO

// if (t == typeof(DateTime))
//     return ((DateTime)v).ToString("yyyy-MM-dd HH-mm-ss", CultureInfo.InvariantCulture);

// // Try the TypeConverter
// var conv = TypeDescriptor.GetConverter(t);
// if (conv.CanConvertTo(typeof(string)))
// {
//     try
//     {
//         return conv.ConvertToInvariantString(v);
//     }
//     catch
//     {
//     }
// }

        const typeOf = typeof v;
        switch (typeOf) {
            case "string":
                return v;
            case "number":
            case "boolean":
                return v.toString();
        }
        if(isArray(v))
            return JSON.stringify(v);
        throw new Error(v);
        return v.toString();
    }
}