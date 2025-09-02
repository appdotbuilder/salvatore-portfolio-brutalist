import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactFormsTable } from '../db/schema';
import { type CreateContactFormInput } from '../schema';
import { getContactForms } from '../handlers/get_contact_forms';

// Test contact form inputs
const testContactForm1: CreateContactFormInput = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'Hello, I would like to discuss a potential project with you. Please contact me back.'
};

const testContactForm2: CreateContactFormInput = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  subject: 'Collaboration Request',
  message: 'Hi there! I saw your portfolio and would love to collaborate on an upcoming project.'
};

const testContactForm3: CreateContactFormInput = {
  name: 'Bob Wilson',
  email: 'bob@company.com',
  subject: 'Job Opportunity',
  message: 'We have an exciting opportunity at our company and think you would be a great fit.'
};

describe('getContactForms', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no contact forms exist', async () => {
    const result = await getContactForms();
    
    expect(result).toEqual([]);
  });

  it('should fetch single contact form', async () => {
    // Create a contact form
    await db.insert(contactFormsTable)
      .values(testContactForm1)
      .execute();

    const result = await getContactForms();
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('John Doe');
    expect(result[0].email).toEqual('john@example.com');
    expect(result[0].subject).toEqual('Project Inquiry');
    expect(result[0].message).toEqual(testContactForm1.message);
    expect(result[0].replied).toEqual(false); // Default value
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should fetch multiple contact forms ordered by created_at DESC', async () => {
    // Create contact forms with slight delays to ensure different timestamps
    await db.insert(contactFormsTable)
      .values(testContactForm1)
      .execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactFormsTable)
      .values(testContactForm2)
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactFormsTable)
      .values(testContactForm3)
      .execute();

    const result = await getContactForms();
    
    expect(result).toHaveLength(3);
    
    // Verify ordering (newest first)
    expect(result[0].name).toEqual('Bob Wilson'); // Last created
    expect(result[1].name).toEqual('Jane Smith'); // Second created
    expect(result[2].name).toEqual('John Doe'); // First created
    
    // Verify all fields are present
    result.forEach(form => {
      expect(form.id).toBeDefined();
      expect(form.name).toBeDefined();
      expect(form.email).toBeDefined();
      expect(form.subject).toBeDefined();
      expect(form.message).toBeDefined();
      expect(form.created_at).toBeInstanceOf(Date);
      expect(typeof form.replied).toBe('boolean');
    });
  });

  it('should include replied status correctly', async () => {
    // Create a contact form and mark as replied
    const insertResult = await db.insert(contactFormsTable)
      .values({
        ...testContactForm1,
        replied: true
      })
      .returning()
      .execute();

    // Create another form that remains unreplied
    await db.insert(contactFormsTable)
      .values(testContactForm2)
      .execute();

    const result = await getContactForms();
    
    expect(result).toHaveLength(2);
    
    // Find the replied form
    const repliedForm = result.find(form => form.name === 'John Doe');
    const unrepliedForm = result.find(form => form.name === 'Jane Smith');
    
    expect(repliedForm?.replied).toEqual(true);
    expect(unrepliedForm?.replied).toEqual(false);
  });

  it('should handle forms with long messages correctly', async () => {
    const longMessage = 'This is a very long message that exceeds normal length. '.repeat(20);
    
    await db.insert(contactFormsTable)
      .values({
        ...testContactForm1,
        message: longMessage
      })
      .execute();

    const result = await getContactForms();
    
    expect(result).toHaveLength(1);
    expect(result[0].message).toEqual(longMessage);
    expect(result[0].message.length).toBeGreaterThan(100);
  });

  it('should verify date ordering with multiple entries created over time', async () => {
    const forms = [testContactForm1, testContactForm2, testContactForm3];
    const createdIds = [];
    
    // Create forms with small delays to ensure different timestamps
    for (const form of forms) {
      const result = await db.insert(contactFormsTable)
        .values(form)
        .returning()
        .execute();
      createdIds.push(result[0].id);
      
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 5));
    }

    const fetchedForms = await getContactForms();
    
    expect(fetchedForms).toHaveLength(3);
    
    // Verify that timestamps are in descending order
    for (let i = 0; i < fetchedForms.length - 1; i++) {
      expect(fetchedForms[i].created_at.getTime())
        .toBeGreaterThanOrEqual(fetchedForms[i + 1].created_at.getTime());
    }
    
    // Verify the order matches our expectations (newest first)
    expect(fetchedForms[0].id).toEqual(createdIds[2]); // Last created
    expect(fetchedForms[1].id).toEqual(createdIds[1]); // Second created  
    expect(fetchedForms[2].id).toEqual(createdIds[0]); // First created
  });
});