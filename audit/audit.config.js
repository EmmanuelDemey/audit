class ConsoleOutput  {
    convert(result) {
        console.log(JSON.stringify(result, null, 4));
    }
}


const fse = require('fs-extra');
class AstroOutput  {
    constructor(distFolder){
        this.distFolder = distFolder
    }
    convert(result) {
        fse.copySync("./template", this.distFolder, {overwrite: true})
        console.log(JSON.stringify(result, null, 4));
    }
}


module.exports = {
    githubUrl: 'https://github.com/EmmanuelDemey/audit',
    urls: ['https://www.emmanueldemey.dev/'],
    outputs: [new AstroOutput("report_emmanueldemeydev")]
}