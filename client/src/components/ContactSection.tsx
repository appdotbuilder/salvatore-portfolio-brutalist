import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/utils/trpc';
import type { CreateContactFormInput } from '../../../server/src/schema';

export function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<CreateContactFormInput>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await trpc.submitContactForm.mutate(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('Errore nell\'invio del messaggio. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="contact" className="py-8 bg-black text-white">
        <div className="w-full text-center">
          <h2 className="brutal-section-title text-white mb-8 text-center">
            MESSAGGIO INVIATO!
          </h2>
          <div className="brutal-card border-white">
            <p className="brutal-text text-white text-lg">
              Grazie per avermi contattato. Ti risponderò al più presto!
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="brutal-button mt-6 bg-white text-black hover:bg-gray-200"
            >
              INVIA UN ALTRO MESSAGGIO
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-8 bg-black text-white">
      <div className="w-full">
        <h2 className="brutal-section-title text-white mb-16 text-center">
          GET IN TOUCH
        </h2>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <div className="mb-8">
              <h3 className="brutal-subtitle text-white mb-4">
                PARLIAMONE
              </h3>
              <p className="brutal-text text-gray-300 text-base leading-relaxed mb-6">
                Interessato a collaborare su un progetto? Hai domande sulle tecnologie SAP BTP o sui miei progetti? 
                Non esitare a contattarmi. Sono sempre aperto a discutere di nuove opportunità e idee innovative.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl">📧</span>
                <div>
                  <div className="brutal-text text-gray-400 text-xs">EMAIL</div>
                  <a href="mailto:salvatore@example.com" className="brutal-link text-white">
                    salvatore@example.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-2xl">💼</span>
                <div>
                  <div className="brutal-text text-gray-400 text-xs">LINKEDIN</div>
                  <a href="https://linkedin.com/in/salvatore" target="_blank" rel="noopener noreferrer" className="brutal-link text-white">
                    linkedin.com/in/salvatore
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-2xl">🚀</span>
                <div>
                  <div className="brutal-text text-gray-400 text-xs">GITHUB</div>
                  <a href="https://github.com/salvatore" target="_blank" rel="noopener noreferrer" className="brutal-link text-white">
                    github.com/salvatore
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="IL TUO NOME"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateContactFormInput) => ({ ...prev, name: e.target.value }))
                  }
                  className="brutal-input"
                  required
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="LA TUA EMAIL"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateContactFormInput) => ({ ...prev, email: e.target.value }))
                  }
                  className="brutal-input"
                  required
                />
              </div>

              <div>
                <Input
                  placeholder="OGGETTO"
                  value={formData.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateContactFormInput) => ({ ...prev, subject: e.target.value }))
                  }
                  className="brutal-input"
                  required
                />
              </div>

              <div>
                <Textarea
                  placeholder="IL TUO MESSAGGIO"
                  value={formData.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev: CreateContactFormInput) => ({ ...prev, message: e.target.value }))
                  }
                  className="brutal-input brutal-textarea"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="brutal-button bg-white text-black hover:bg-gray-200 w-full"
              >
                {isLoading ? 'INVIO IN CORSO...' : 'INVIA MESSAGGIO'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}