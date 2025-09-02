import { db } from '../db';
import { professionalInfoTable } from '../db/schema';
import { type ProfessionalInfo } from '../schema';
import { desc } from 'drizzle-orm';

/**
 * Handler to fetch professional information for the about section
 * Returns the current professional profile data
 */
export const getProfessionalInfo = async (): Promise<ProfessionalInfo | null> => {
  try {
    // Query the most recent professional info record
    const result = await db.select()
      .from(professionalInfoTable)
      .orderBy(desc(professionalInfoTable.updated_at))
      .limit(1)
      .execute();

    if (result.length === 0) {
      return null;
    }

    const info = result[0];
    return {
      id: info.id,
      full_name: info.full_name,
      title: info.title,
      bio: info.bio,
      location: info.location,
      years_experience: info.years_experience,
      current_position: info.current_position,
      current_company: info.current_company,
      team_size: info.team_size,
      cv_url: info.cv_url,
      updated_at: info.updated_at
    };
  } catch (error) {
    console.error('Failed to fetch professional info:', error);
    throw error;
  }
};