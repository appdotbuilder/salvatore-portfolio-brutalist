import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { professionalInfoTable } from '../db/schema';
import { getProfessionalInfo } from '../handlers/get_professional_info';
import { type NewProfessionalInfo } from '../db/schema';

// Test data for professional info
const testProfessionalInfo: NewProfessionalInfo = {
  full_name: 'John Doe',
  title: 'Senior Developer',
  bio: 'Experienced developer with expertise in full stack development.',
  location: 'New York, USA',
  years_experience: 5,
  current_position: 'Lead Developer',
  current_company: 'Tech Corp',
  team_size: 8,
  cv_url: 'https://example.com/cv.pdf'
};

const secondProfessionalInfo: NewProfessionalInfo = {
  full_name: 'Jane Smith',
  title: 'Senior Full Stack Developer',
  bio: 'Full stack developer with 7 years of experience.',
  location: 'San Francisco, USA',
  years_experience: 7,
  current_position: 'Tech Lead',
  current_company: 'Startup Inc',
  team_size: 12,
  cv_url: null
};

describe('getProfessionalInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no professional info exists', async () => {
    const result = await getProfessionalInfo();
    expect(result).toBeNull();
  });

  it('should return professional info when it exists', async () => {
    // Insert test data
    await db.insert(professionalInfoTable)
      .values(testProfessionalInfo)
      .execute();

    const result = await getProfessionalInfo();

    expect(result).not.toBeNull();
    expect(result!.full_name).toBe('John Doe');
    expect(result!.title).toBe('Senior Developer');
    expect(result!.bio).toBe('Experienced developer with expertise in full stack development.');
    expect(result!.location).toBe('New York, USA');
    expect(result!.years_experience).toBe(5);
    expect(result!.current_position).toBe('Lead Developer');
    expect(result!.current_company).toBe('Tech Corp');
    expect(result!.team_size).toBe(8);
    expect(result!.cv_url).toBe('https://example.com/cv.pdf');
    expect(result!.id).toBeDefined();
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return the most recent professional info when multiple records exist', async () => {
    // Insert first record
    await db.insert(professionalInfoTable)
      .values(testProfessionalInfo)
      .execute();

    // Wait a small amount to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Insert second record (more recent)
    await db.insert(professionalInfoTable)
      .values(secondProfessionalInfo)
      .execute();

    const result = await getProfessionalInfo();

    expect(result).not.toBeNull();
    expect(result!.full_name).toBe('Jane Smith');
    expect(result!.title).toBe('Senior Full Stack Developer');
    expect(result!.current_company).toBe('Startup Inc');
    expect(result!.team_size).toBe(12);
    expect(result!.cv_url).toBeNull();
  });

  it('should handle professional info with null values correctly', async () => {
    const infoWithNulls: NewProfessionalInfo = {
      full_name: 'Test User',
      title: 'Developer',
      bio: 'Simple bio',
      location: 'Remote',
      years_experience: 3,
      current_position: 'Junior Developer',
      current_company: 'Remote Company',
      team_size: null,
      cv_url: null
    };

    await db.insert(professionalInfoTable)
      .values(infoWithNulls)
      .execute();

    const result = await getProfessionalInfo();

    expect(result).not.toBeNull();
    expect(result!.full_name).toBe('Test User');
    expect(result!.team_size).toBeNull();
    expect(result!.cv_url).toBeNull();
    expect(result!.years_experience).toBe(3);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should verify data is correctly saved in database', async () => {
    await db.insert(professionalInfoTable)
      .values(testProfessionalInfo)
      .execute();

    // Verify data was saved correctly by querying directly
    const dbResult = await db.select()
      .from(professionalInfoTable)
      .execute();

    expect(dbResult).toHaveLength(1);
    expect(dbResult[0].full_name).toBe('John Doe');
    expect(dbResult[0].years_experience).toBe(5);
    expect(dbResult[0].team_size).toBe(8);
    expect(dbResult[0].updated_at).toBeInstanceOf(Date);

    // Now test the handler
    const handlerResult = await getProfessionalInfo();
    expect(handlerResult!.id).toBe(dbResult[0].id);
    expect(handlerResult!.full_name).toBe(dbResult[0].full_name);
    expect(handlerResult!.updated_at.getTime()).toBe(dbResult[0].updated_at.getTime());
  });
});