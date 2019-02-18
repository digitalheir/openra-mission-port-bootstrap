const mapOptionsFieldsObj = {
    Cheats: "",
    Crates: "",
    Fog: "",
    Shroud: "",
    AllyBuildRadius: "",
    FragileAlliances: "",
    StartingCash: "",
    TechLevel: "",
    ConfigurableStartingUnits: "",
    Difficulties: "",
};

export class MapOptions {
    public Cheats: boolean;
    public Crates: boolean;
    public Fog: boolean;
    public Shroud: boolean;
    public AllyBuildRadius: boolean;
    public FragileAlliances: boolean;
    public StartingCash: number;
    public TechLevel: string;
    public ConfigurableStartingUnits: boolean = true;
    public Difficulties: string[] = [];
}

export const mapOptionsFields = Object.keys(mapOptionsFieldsObj);