import path from "path";
import fs from "fs";
import glob from "glob";

const loadResources = () => {
    const models = glob.sync(`${__dirname}/models/**/*.*`);
    const textures = glob.sync(`${__dirname}/textures/**/*.*`);

    //import matcapBeigeSource from '../models/matcaps/beige.png'   
    const modelImports = models.map((filename: string) => {
        const objName = "model_" + filename
        .replace(/^.*models\//, "")
        .replace(/\..+$/, "")
        .replace(/\//gim,"_");
        
        const filePath = filename.replace(/^.*models\//, "./models/")
        
        return {
            obj: `{ name: "${objName}", source: ${objName}Source, type: "model" },`,
            importString: `import ${objName}Source from "${filePath}";`
        };
    });
  
    const textureImports = textures.map((filename: string) => {
        const objName = "texture_" + filename
        .replace(/^.*textures\//, "")
        .replace(/\..+$/, "")
        .replace(/\//gim,"_");
        
        const filePath = filename.replace(/^.*textures\//, "./textures/")
        
        return {
            obj: `{ name: "${objName}", source: ${objName}Source, type: "texture" },`,
            importString: `import ${objName}Source from "${filePath}";`
        };
    });

    const result = `
    ${modelImports.map((obj) => obj.importString).join("\n")}

    ${textureImports.map((obj) => obj.importString).join("\n")}
    
    export default {
        models: [
            ${modelImports.map((obj) => obj.obj).join("\n\t")}
        ],
        textures: [
            ${textureImports.map((obj) => obj.obj).join("\n\t")}
        ]
    }`;

    return result;
}

export default loadResources;