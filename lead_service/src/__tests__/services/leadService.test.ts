import { jest } from '@jest/globals';
import { LeadService } from '../../services/leadService.js';
import { LeadModel } from '../../models/leadModel.js';
import { LeadRepository } from '../../repositories/leadRepository.js';
import { LeadStatusEnum } from '../../enum/status.enum.js';

describe('LeadService.ts tests', () => {
  let service: LeadService;

  let leadData: LeadModel[] = [
    {
      row_id: 1,
      name: 'Lead1',
      email_address: 'a@a.com',
      created_at: new Date(2025, 1, 1),
            status:LeadStatusEnum.New
    },
  ];

  beforeEach(() => {
    let LeadRepositoryMock: LeadRepository = {
      InsertAsync: jest.fn().mockImplementation((): Promise<number> => Promise.resolve(1)),     
      GetAllAsync: jest.fn().mockImplementation((): Promise<LeadModel[]> => Promise.resolve(leadData)),
    } as unknown as LeadRepository;

    service = new LeadService(LeadRepositoryMock);
  });

  it('it should Save Lead Master Successfully', async () => {
    // GIVEN
    let model: LeadModel = {
      name: 'Lead1',
      email_address: 'a@a.com',
      status:LeadStatusEnum.New
    };
    // WHEN
    const tags = await service.AddAsync(model);
    // THEN
    expect(tags).toBe(1);
    expect(tags).toEqual(1);
  });

  it('it should Get All Lead Master Data', async () => {
    // GIVEN

    // WHEN
    const tags = await service.GetAllAsync();
    // THEN
    expect(tags.length).toBe(1);
    expect(tags[0]).toEqual(leadData[0]);
  });
});
