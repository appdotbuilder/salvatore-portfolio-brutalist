import { db } from '../db';
import { contactFormsTable } from '../db/schema';
import { type CreateContactFormInput, type ContactForm } from '../schema';

/**
 * Handler to process contact form submissions
 * Stores the contact form data for later review
 */
export const submitContactForm = async (input: CreateContactFormInput): Promise<ContactForm> => {
  try {
    // Insert contact form submission into database
    const result = await db.insert(contactFormsTable)
      .values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        replied: false // Default value for new submissions
      })
      .returning()
      .execute();

    const contactForm = result[0];
    return contactForm;
  } catch (error) {
    console.error('Contact form submission failed:', error);
    throw error;
  }
};