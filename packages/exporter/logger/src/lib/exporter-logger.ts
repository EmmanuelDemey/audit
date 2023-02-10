import { Result } from '@audit/model';

export function exporterLogger(result: Result): void {
  console.log(JSON.stringify(result, null, 2));
}
