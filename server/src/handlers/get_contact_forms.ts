import { db } from '../db';
import { contactFormsTable } from '../db/schema';
import { type ContactForm } from '../schema';
import { desc } from 'drizzle-orm';

/**
 * Handler to fetch all contact form submissions
 * Returns contact forms for admin review (ordered by creation date, newest first)
 */
export const getContactForms = async (): Promise<ContactForm[]> => {
  try {
    const results = await db.select()
      .from(contactFormsTable)
      .orderBy(desc(contactFormsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch contact forms:', error);
    throw error;
  }
};