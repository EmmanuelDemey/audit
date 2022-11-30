import {AsyncAuditFunction} from "../types";

export const checkIfCi: AsyncAuditFunction = async (inquirer: any): Promise<boolean> => {
    const answers = await inquirer.prompt([{
        type: "confirm",
        name: "checkIfCI",
        message: "Une solution d'intégration continue est-elle en place ?",
        choices: ["Oui", "Non"]
    }]);
    return !answers.checkIfCI;
};
