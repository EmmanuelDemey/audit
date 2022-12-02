import { exporterLogger } from './exporter-logger';

describe('exporterLogger', () => {
  it('should work', () => {
    expect(exporterLogger()).toEqual('exporter-logger');
  });
});
