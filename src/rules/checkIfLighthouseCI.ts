import {AsyncAuditFunction} from "../types";
import {Inquirer} from "inquirer";

export const checkIfLighthouseCI: AsyncAuditFunction = async (inquirer: Inquirer): Promise<boolean> => {
    const answers = await inquirer.prompt([{
        type: "confirm",
        name: "checkIfLighthouseCI",
        message: "Est-ce que Lighthouse CI est mis en place ?",
        choices: ["Oui", "Non"]
    }]);
    return !answers.checkIfCI;
};
