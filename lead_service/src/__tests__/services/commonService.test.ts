import { jest } from '@jest/globals';
import { CommonService } from '../../services/commonService.js';
import { LeadRepository } from '../../repositories/leadRepository.js';

describe('CommonService.ts tests', () => {
  let service: CommonService;

  beforeEach(() => {
    let leadRepositoryMock: LeadRepository = {
      DeleteAllAsync: jest.fn().mockImplementation((): Promise<void> => Promise.resolve()),
      CreateTableAsync: jest.fn().mockImplementation((): Promise<void> => Promise.resolve()),
      DropTableAsync: jest.fn().mockImplementation((): Promise<void> => Promise.resolve()),
    } as unknown as LeadRepository;
    
    service = new CommonService(
      leadRepositoryMock,
    );
  });

  it('it should Create All If not exists', async () => {
    // WHEN
    const tags = await service.CreateAllTableIfNotExistAsync();
    // THEN
    expect(tags).toBeUndefined();
  });

  it('it should Delete Table If Exists', async () => {
    // WHEN
    const tags = await service.DeleteAllTableIfExistAsync(true);
    // THEN
    expect(tags).toBeUndefined();
  });

  it('it should Delete Table Data If Exists', async () => {
    // WHEN
    const tags = await service.DeleteAllTableIfExistAsync();
    // THEN
    expect(tags).toBeUndefined();
  });
});
