const reStripExtension = /\.[^.]+$/;
export const Path = {
    GetFileNameWithoutExtension: (str:string) => {
        return str.replace(reStripExtension, "");
    }
};