import * as fs from "fs";
import * as path from "path";

export const getReadmeMetadata = (baseDir: string) => {
    return fs.existsSync(path.resolve(baseDir, 'README.md'));
}
