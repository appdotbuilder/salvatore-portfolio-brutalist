import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { professionalInfoTable } from '../db/schema';
import { type UpdateProfessionalInfoInput } from '../schema';
import { updateProfessionalInfo } from '../handlers/update_professional_info';
import { eq } from 'drizzle-orm';

// Test data for professional info
const initialProfessionalInfo = {
  full_name: 'John Doe',
  title: 'Software Developer',
  bio: 'A passionate developer with experience in web technologies.',
  location: 'New York, USA',
  years_experience: 5,
  current_position: 'Senior Developer',
  current_company: 'Tech Corp',
  team_size: 8,
  cv_url: 'https://example.com/cv.pdf'
};

describe('updateProfessionalInfo', () => {
  beforeEach(async () => {
    await createDB();
    // Create initial professional info record
    await db.insert(professionalInfoTable)
      .values(initialProfessionalInfo)
      .execute();
  });

  afterEach(resetDB);

  it('should update specific fields and return updated record', async () => {
    const updateInput: UpdateProfessionalInfoInput = {
      full_name: 'Jane Smith',
      title: 'Senior Full Stack Developer',
      years_experience: 7
    };

    const result = await updateProfessionalInfo(updateInput);

    expect(result.full_name).toEqual('Jane Smith');
    expect(result.title).toEqual('Senior Full Stack Developer');
    expect(result.years_experience).toEqual(7);
    // Other fields should remain unchanged
    expect(result.bio).toEqual(initialProfessionalInfo.bio);
    expect(result.location).toEqual(initialProfessionalInfo.location);
    expect(result.current_position).toEqual(initialProfessionalInfo.current_position);
    expect(result.current_company).toEqual(initialProfessionalInfo.current_company);
    expect(result.team_size).toEqual(initialProfessionalInfo.team_size);
    expect(result.cv_url).toEqual(initialProfessionalInfo.cv_url);
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update nullable fields to null', async () => {
    const updateInput: UpdateProfessionalInfoInput = {
      team_size: null,
      cv_url: null
    };

    const result = await updateProfessionalInfo(updateInput);

    expect(result.team_size).toBeNull();
    expect(result.cv_url).toBeNull();
    // Other fields should remain unchanged
    expect(result.full_name).toEqual(initialProfessionalInfo.full_name);
    expect(result.title).toEqual(initialProfessionalInfo.title);
  });

  it('should update all fields at once', async () => {
    const updateInput: UpdateProfessionalInfoInput = {
      full_name: 'Alice Johnson',
      title: 'Technical Lead',
      bio: 'An experienced technical leader with expertise in cloud technologies.',
      location: 'San Francisco, USA',
      years_experience: 10,
      current_position: 'Tech Lead',
      current_company: 'Cloud Solutions Inc',
      team_size: 15,
      cv_url: 'https://example.com/new-cv.pdf'
    };

    const result = await updateProfessionalInfo(updateInput);

    expect(result.full_name).toEqual('Alice Johnson');
    expect(result.title).toEqual('Technical Lead');
    expect(result.bio).toEqual('An experienced technical leader with expertise in cloud technologies.');
    expect(result.location).toEqual('San Francisco, USA');
    expect(result.years_experience).toEqual(10);
    expect(result.current_position).toEqual('Tech Lead');
    expect(result.current_company).toEqual('Cloud Solutions Inc');
    expect(result.team_size).toEqual(15);
    expect(result.cv_url).toEqual('https://example.com/new-cv.pdf');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should persist changes to database', async () => {
    const updateInput: UpdateProfessionalInfoInput = {
      full_name: 'Bob Wilson',
      years_experience: 12
    };

    const result = await updateProfessionalInfo(updateInput);

    // Verify changes were saved to database
    const dbRecord = await db.select()
      .from(professionalInfoTable)
      .where(eq(professionalInfoTable.id, result.id))
      .execute();

    expect(dbRecord).toHaveLength(1);
    expect(dbRecord[0].full_name).toEqual('Bob Wilson');
    expect(dbRecord[0].years_experience).toEqual(12);
    expect(dbRecord[0].bio).toEqual(initialProfessionalInfo.bio); // Unchanged
    expect(dbRecord[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update timestamp even when no fields provided', async () => {
    // Get original timestamp
    const originalRecord = await db.select()
      .from(professionalInfoTable)
      .execute();
    const originalTimestamp = originalRecord[0].updated_at;

    // Wait a small amount to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const result = await updateProfessionalInfo({});

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalTimestamp.getTime());
    // All other fields should remain the same
    expect(result.full_name).toEqual(initialProfessionalInfo.full_name);
    expect(result.title).toEqual(initialProfessionalInfo.title);
  });

  it('should handle zero values correctly', async () => {
    const updateInput: UpdateProfessionalInfoInput = {
      years_experience: 0,
      team_size: 0
    };

    const result = await updateProfessionalInfo(updateInput);

    expect(result.years_experience).toEqual(0);
    expect(result.team_size).toEqual(0);
  });

  it('should throw error when no professional info record exists', async () => {
    // Clear the table
    await db.delete(professionalInfoTable).execute();

    const updateInput: UpdateProfessionalInfoInput = {
      full_name: 'Test User'
    };

    await expect(updateProfessionalInfo(updateInput))
      .rejects.toThrow(/no professional info record found/i);
  });
});