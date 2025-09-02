import { db } from '../db';
import { professionalInfoTable } from '../db/schema';
import { type UpdateProfessionalInfoInput, type ProfessionalInfo } from '../schema';
import { eq } from 'drizzle-orm';

/**
 * Handler to update professional information
 * Updates the about section data with new information
 */
export const updateProfessionalInfo = async (input: UpdateProfessionalInfoInput): Promise<ProfessionalInfo> => {
  try {
    // First, check if there's an existing record (there should be only one)
    const existingRecords = await db.select()
      .from(professionalInfoTable)
      .execute();

    if (existingRecords.length === 0) {
      throw new Error('No professional info record found to update');
    }

    // Use the first (and should be only) record's ID
    const recordId = existingRecords[0].id;

    // Build update object with only provided fields
    const updateData: Partial<typeof professionalInfoTable.$inferInsert> = {
      updated_at: new Date() // Always update the timestamp
    };

    // Add provided fields to update data
    if (input.full_name !== undefined) updateData.full_name = input.full_name;
    if (input.title !== undefined) updateData.title = input.title;
    if (input.bio !== undefined) updateData.bio = input.bio;
    if (input.location !== undefined) updateData.location = input.location;
    if (input.years_experience !== undefined) updateData.years_experience = input.years_experience;
    if (input.current_position !== undefined) updateData.current_position = input.current_position;
    if (input.current_company !== undefined) updateData.current_company = input.current_company;
    if (input.team_size !== undefined) updateData.team_size = input.team_size;
    if (input.cv_url !== undefined) updateData.cv_url = input.cv_url;

    // Update the record
    const result = await db.update(professionalInfoTable)
      .set(updateData)
      .where(eq(professionalInfoTable.id, recordId))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Professional info update failed:', error);
    throw error;
  }
};