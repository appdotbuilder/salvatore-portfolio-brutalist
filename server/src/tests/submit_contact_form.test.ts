import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactFormsTable } from '../db/schema';
import { type CreateContactFormInput } from '../schema';
import { submitContactForm } from '../handlers/submit_contact_form';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateContactFormInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Portfolio Inquiry',
  message: 'I am interested in discussing a potential project opportunity with you.'
};

describe('submitContactForm', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact form submission', async () => {
    const result = await submitContactForm(testInput);

    // Validate returned contact form data
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.subject).toEqual('Portfolio Inquiry');
    expect(result.message).toEqual('I am interested in discussing a potential project opportunity with you.');
    expect(result.replied).toBe(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact form submission to database', async () => {
    const result = await submitContactForm(testInput);

    // Query database to verify submission was stored
    const contactForms = await db.select()
      .from(contactFormsTable)
      .where(eq(contactFormsTable.id, result.id))
      .execute();

    expect(contactForms).toHaveLength(1);
    expect(contactForms[0].name).toEqual('John Doe');
    expect(contactForms[0].email).toEqual('john.doe@example.com');
    expect(contactForms[0].subject).toEqual('Portfolio Inquiry');
    expect(contactForms[0].message).toEqual('I am interested in discussing a potential project opportunity with you.');
    expect(contactForms[0].replied).toBe(false);
    expect(contactForms[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle long messages correctly', async () => {
    const longMessageInput: CreateContactFormInput = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      subject: 'Complex Project Discussion',
      message: 'This is a very detailed message about a complex project that requires extensive explanation of requirements, timelines, budget considerations, technical specifications, and various other important details that need to be communicated effectively to ensure proper understanding of the scope and expectations for the proposed collaboration. The message continues with more details about the specific technologies we would like to use, the target audience, and the expected deliverables for this comprehensive project proposal.'
    };

    const result = await submitContactForm(longMessageInput);

    expect(result.name).toEqual('Jane Smith');
    expect(result.message).toEqual(longMessageInput.message);
    expect(result.message.length).toBeGreaterThan(10); // Minimum message length from schema
    expect(result.replied).toBe(false);
  });

  it('should handle email addresses with various formats', async () => {
    const emailTestCases = [
      'test@domain.com',
      'user.name@company.co.uk',
      'developer+portfolio@tech-startup.io'
    ];

    for (const email of emailTestCases) {
      const input: CreateContactFormInput = {
        name: 'Test User',
        email: email,
        subject: 'Email Format Test',
        message: 'Testing different email formats for contact form submission.'
      };

      const result = await submitContactForm(input);
      
      expect(result.email).toEqual(email);
      expect(result.name).toEqual('Test User');
      expect(result.replied).toBe(false);
      
      // Verify it was saved to database
      const saved = await db.select()
        .from(contactFormsTable)
        .where(eq(contactFormsTable.id, result.id))
        .execute();
        
      expect(saved).toHaveLength(1);
      expect(saved[0].email).toEqual(email);
    }
  });

  it('should create multiple independent contact form submissions', async () => {
    const input1: CreateContactFormInput = {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      subject: 'First Inquiry',
      message: 'This is the first contact form submission for testing multiple entries.'
    };

    const input2: CreateContactFormInput = {
      name: 'Bob Williams',
      email: 'bob@example.com',
      subject: 'Second Inquiry',
      message: 'This is the second contact form submission to ensure independence.'
    };

    const result1 = await submitContactForm(input1);
    const result2 = await submitContactForm(input2);

    // Verify both submissions have unique IDs
    expect(result1.id).not.toEqual(result2.id);
    
    // Verify both submissions are correctly stored
    expect(result1.name).toEqual('Alice Johnson');
    expect(result1.email).toEqual('alice@example.com');
    expect(result2.name).toEqual('Bob Williams');
    expect(result2.email).toEqual('bob@example.com');

    // Verify both are in database
    const allForms = await db.select()
      .from(contactFormsTable)
      .execute();

    expect(allForms).toHaveLength(2);
    
    const form1 = allForms.find(form => form.id === result1.id);
    const form2 = allForms.find(form => form.id === result2.id);
    
    expect(form1).toBeDefined();
    expect(form2).toBeDefined();
    expect(form1!.name).toEqual('Alice Johnson');
    expect(form2!.name).toEqual('Bob Williams');
  });
});