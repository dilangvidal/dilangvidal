'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Send, Linkedin, Github, Mail as MailIcon } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { personalInfo } from '@/constants/data';
import type { ContactFormData } from '@/types';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<FormStatus>('idle');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Error al enviar');
            }

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <SectionWrapper id="contact">
            <span className="section-label">
                <MailIcon size={16} />
                Contacto
            </span>
            <h2 className="section-title">¿Trabajamos juntos?</h2>
            <p className="section-subtitle">
                Estoy abierto a colaborar en proyectos desafiantes, arquitecturas modernas y mentorías técnicas.
            </p>

            <div className="contact-grid">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Nombre
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message" className="form-label">
                            Mensaje
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Cuéntame sobre tu proyecto..."
                            rows={5}
                        />
                    </div>

                    {status === 'success' && (
                        <div className="form-message success">
                            ✓ ¡Mensaje enviado correctamente! Te responderé pronto.
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="form-message error">
                            Error al enviar el mensaje. Inténtalo de nuevo o escríbeme directamente.
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary form-submit"
                        disabled={status === 'sending'}
                    >
                        <Send size={16} />
                        {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
                    </button>
                </form>

                <div className="contact-info">
                    <p className="contact-info-text">
                        También puedes contactarme directamente a través de mis redes profesionales.
                        Respondo en menos de 24 horas.
                    </p>
                    <div className="contact-links">
                        <a
                            href={personalInfo.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            <Linkedin size={20} />
                            <div>
                                <span className="contact-link-label">LinkedIn</span>
                                <span className="contact-link-value">dilangvidal</span>
                            </div>
                        </a>
                        <a
                            href={personalInfo.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            <Github size={20} />
                            <div>
                                <span className="contact-link-label">GitHub</span>
                                <span className="contact-link-value">dilangvidal</span>
                            </div>
                        </a>
                        <a href={`mailto:${personalInfo.email}`} className="contact-link">
                            <MailIcon size={20} />
                            <div>
                                <span className="contact-link-label">Email</span>
                                <span className="contact-link-value">{personalInfo.email}</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
