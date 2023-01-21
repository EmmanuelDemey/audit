import { AsyncAuditFunction, AuditResult } from '@audit/model';

export const checkIfTypescriptConstEnum: AsyncAuditFunction = async (
  inquirer: any
): Promise<AuditResult | false> => {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'checkIfTypescriptConstEnum',
      message:
        'En Typescript, utilisez-vous des const enums plutot que des enums basiques ?',
      choices: ['Oui', 'Non'],
    },
  ]);
  if (answers.checkIfTypescriptConstEnum) {
    return false;
  }
  return {
    links: ['https://ultimatecourses.com/blog/const-enums-typescript'],
  };
};
