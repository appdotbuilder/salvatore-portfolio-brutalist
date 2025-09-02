import { type ContactForm } from '../schema';

/**
 * Handler to fetch all contact form submissions
 * Returns contact forms for admin review (ordered by creation date, newest first)
 */
export const getContactForms = async (): Promise<ContactForm[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all contact form submissions from the database.
    // Should return all contact forms ordered by created_at DESC for admin review
    
    return [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            subject: "Project Inquiry",
            message: "Hello, I would like to discuss a potential project...",
            created_at: new Date(),
            replied: false
        }
    ];
};