class ConsoleOutput  {
    convert(result) {
        console.log(JSON.stringify(result, null, 4));
    }
}


module.exports = {
    githubUrl: 'https://github.com/EmmanuelDemey/audit',
    urls: ['https://www.emmanueldemey.dev/'],
    outputs: [new ConsoleOutput()]
}