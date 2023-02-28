import { AsyncAuditFunction, AuditResult } from '@audit/model';

export const checkIfCountInsteadOfExist: AsyncAuditFunction = async (
  inquirer: any
): Promise<AuditResult | false> => {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'checkIfCountInsteadOfExist',
      message:
        'Avons-nous requete SQL utilisant un COUNT() et qui pourrait etre remplacée par un EXIST()',
      choices: ['Oui', 'Non'],
    },
  ]);
  if (!answers.checkIfCountInsteadOfExist) {
    return false;
  }
  return {
    links: [
      'https://blog.jooq.org/avoid-using-count-in-sql-when-you-could-use-exists/',
    ],
  };
};
