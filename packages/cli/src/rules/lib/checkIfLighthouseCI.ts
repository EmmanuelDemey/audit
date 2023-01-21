import { AsyncAuditFunction } from '@audit/model';

export const checkIfLighthouseCI: AsyncAuditFunction = async (
  inquirer: any
): Promise<boolean> => {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'checkIfLighthouseCI',
      message: 'Est-ce que Lighthouse CI est mis en place ?',
      choices: ['Oui', 'Non'],
    },
  ]);
  return !answers.checkIfCI;
};
