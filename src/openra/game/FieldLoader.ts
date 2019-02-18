import {MiniYaml} from "../MiniYaml";
import {ConcurrentCache} from "./primitives/ConcurrentCache";

export class FieldLoader {
    static readonly TypeLoadInfo: ConcurrentCache<string, FieldLoadInfo[]> = new ConcurrentCache(FieldLoader.BuildTypeLoadInfo);

    static Load(self: any, my: MiniYaml) {
        const typeName: string | undefined = self.GetType();
        if (!typeName) throw new Error("No type was specified");
        const loadInfo = this.TypeLoadInfo.get(typeName);
        const missing: string[] = [];

        let md: Map<string, MiniYaml> = null;

        for (const fli of loadInfo) {
            let val: any = undefined;

            if (md == null)
                md = my.ToDictionaryS();
            if (fli.Loader != null) {
                if (!fli.Attribute.Required || md.has(fli.YamlName))
                    val = fli.Loader(my);
                else {
                    missing.push(fli.YamlName);
                    continue;
                }
            } else {
                const v = this.TryGetValueFromYaml(fli.YamlName, fli.fieldName, md);
                if (v === undefined) {
                    if (fli.Attribute.Required) missing.push(fli.YamlName);
                    continue;
                }
            }
            fli.Field.SetValue(self, val);
        }

        if (missing.length > 0)
            throw new Error("Missing fields: " + missing);
    }

    static TryGetValueFromYaml(yamlName: string, field: string, md: Map<string, MiniYaml>): any {
        const yaml: MiniYaml | undefined = md.get(yamlName);
        if (!yaml) return false;
        return this.GetValue(field, yaml);
    }

    static GetValue(fieldName: string, yaml: MiniYaml): any {
        switch (fieldName) {
            default:
                throw new Error(`Don't know how to handle field name ${fieldName}`);
        }
    }

    static GetValue_(fieldName: string, value: string): any {
        return this.GetValue(fieldName, new MiniYaml(value));
    }

    static GetTypeLoadInfo(typeName: string, includePrivateByDefault: boolean = false) {
        return this.TypeLoadInfo[typeName].Where(fli => includePrivateByDefault || fli.Field.IsPublic || (fli.Attribute.Serialize && !fli.Attribute.IsDefault));
    }

    static BuildTypeLoadInfo(type: string): FieldLoadInfo[] {
        const ret: FieldLoadInfo[] = [];

        throw Error("Not implemented");
        // foreach (var ff in type.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)){
        // var field = ff;
        //
        // var sa = field.GetCustomAttributes<SerializeAttribute>(false).DefaultIfEmpty(SerializeAttribute.Default).First();
        // if (!sa.Serialize)
        // continue;
        //
        // var yamlName = !sa.YamlName ? field.Name : sa.YamlName;
        //
        // var loader = sa.GetLoader(type);
        // if (loader == null && sa.FromYamlKey)
        // loader = yaml => GetValue(yamlName, field.FieldType, yaml, field);
        //
        // var fli = new FieldLoadInfo(field, sa, yamlName, loader);
        // ret.Add(fli);
        // }
        //
        // return ret.ToArray();
    }

    static LoadField(target: any, key0: string, value: string) {
        //const Flags = BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance;
        const key = key0.trim();

        //var fieldValue = target[key];
        // if (fieldValue) {
        // var sa = field.GetCustomAttributes<SerializeAttribute>(false).DefaultIfEmpty(SerializeAttribute.Default).First();
        //if (!sa.FromYamlKey)
        target[key] = this.GetValue_(key, value);
        return;
        //}
        // var prop = target.GetType().GetProperty(key, Flags);
        // if (prop != null)
        // {
        //     var sa = prop.GetCustomAttributes<SerializeAttribute>(false).DefaultIfEmpty(SerializeAttribute.Default).First();
        //     if (!sa.FromYamlKey)
        //         prop.SetValue(target, GetValue(prop.Name, prop.PropertyType, value, prop), null);
        //     return;
        // }
        // UnknownFieldAction(key, target.GetType());
    }
}

export class FieldLoadInfo {
    readonly fieldName: string;
    readonly Attribute: SerializeAttribute;
    readonly YamlName: string;
    readonly Loader: (MiniYaml) => any | undefined;
    Field = {
        SetValue: (self: any, value: any) => self[this.fieldName] = value,
        GetValue: (self: any,) => self[this.fieldName],
    };

    constructor(field: string, attr: SerializeAttribute, yamlName: string, loader?: (MiniYaml) => any) {
        this.fieldName = field;
        this.Attribute = attr;
        this.YamlName = yamlName;
        this.Loader = loader;
    }
}

export class SerializeAttribute {
    public static readonly Default: SerializeAttribute = new SerializeAttribute(true);

    get IsDefault(): boolean {
        return this == SerializeAttribute.Default;
    }

    readonly Serialize: boolean;
    YamlName: string;
    Loader: string;
    FromYamlKey: boolean;
    DictionaryFromYamlKey: boolean;
    Required: boolean;
    AllowEmptyEntries: boolean;

    constructor(serialize: boolean = true, required: boolean = false, allowEmptyEntries: boolean = false) {
        this.Serialize = serialize;
        this.Required = required;
        this.AllowEmptyEntries = allowEmptyEntries;
    }

    GetLoader(type: string): (MiniYaml) => any | undefined {
        // const Flags:BindingFlags  = BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.FlattenHierarchy;

        if (!this.Loader) {
            const method = type[this.Loader]; // , Flags);
            if (!method)
                throw new Error(`${type} does not specify a loader function '${this.Loader}'`);

            return method as (MiniYaml) => any;
            //Delegate.CreateDelegate(typeof(Func<MiniYaml, object>), method);
        }
        return undefined;
    }
}