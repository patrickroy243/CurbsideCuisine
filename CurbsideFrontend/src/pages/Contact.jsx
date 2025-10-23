import React, { useState, useRef } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    User,
    Building,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ExternalLink
} from 'lucide-react';
import emailjs from '@emailjs/browser';

const pageStyles = `
  @keyframes fadeInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-50px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(50px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
  .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
  .animate-pulse-scale { animation: pulse 2s ease-in-out infinite; }
  .shimmer-loading {
    background: linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px);
    background-size: 200px;
    animation: shimmer 1.5s infinite;
  }
  .gradient-bg {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0891b2 100%);
  }
  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = pageStyles;
    if (!document.head.querySelector('[data-contact-styles]')) {
        styleSheet.setAttribute('data-contact-styles', 'true');
        document.head.appendChild(styleSheet);
    }
}

const Contact = () => {
    const form = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        company: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setStatus({ type: 'error', message: 'Name is required' });
            return false;
        }
        if (!formData.email.trim()) {
            setStatus({ type: 'error', message: 'Email is required' });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setStatus({ type: 'error', message: 'Please enter a valid email address' });
            return false;
        }
        if (!formData.subject.trim()) {
            setStatus({ type: 'error', message: 'Subject is required' });
            return false;
        }
        if (!formData.message.trim()) {
            setStatus({ type: 'error', message: 'Message is required' });
            return false;
        }
        if (formData.message.trim().length < 10) {
            setStatus({ type: 'error', message: 'Message must be at least 10 characters long' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            setStatus({
                type: 'error',
                message: 'Email service is not configured. Please contact us directly at CurbsideCuisine@gmail.com'
            });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            emailjs.init(EMAILJS_PUBLIC_KEY);

            const result = await emailjs.sendForm(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                form.current,
                EMAILJS_PUBLIC_KEY
            );

            console.log('Email sent successfully:', result.text);
            setStatus({
                type: 'success',
                message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
            });

            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                phone: '',
                company: ''
            });

        } catch (error) {
            console.error('Failed to send email:', error);
            setStatus({
                type: 'error',
                message: 'Sorry, there was an error sending your message. Please try again or contact us directly at CurbsideCuisine@gmail.com'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Us",
            detail: "CurbsideCuisine@gmail.com",
            description: "Send us an email anytime",
            action: "mailto:CurbsideCuisine@gmail.com"
        },
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Call Us",
            detail: "(+64) 225064062",
            description: "Mon-Fri from 8am to 5pm",
            action: "tel:+64225064062"
        }
    ];

    const socialLinks = [
        { icon: <Facebook className="w-5 h-5" />, name: "Facebook", url: "https://facebook.com" },
        { icon: <Twitter className="w-5 h-5" />, name: "Twitter", url: "https://twitter.com" },
        { icon: <Instagram className="w-5 h-5" />, name: "Instagram", url: "https://instagram.com" },
        { icon: <Linkedin className="w-5 h-5" />, name: "LinkedIn", url: "https://linkedin.com" }
    ];

    const faqItems = [
        {
            question: "How do I register my food truck?",
            answer: "Simply create an account, verify your vendor status, and submit your food truck details through the dashboard."
        },
        {
            question: "Is there a fee to use the platform?",
            answer: "Basic listing is free! We offer premium features for enhanced visibility and analytics."
        },
        {
            question: "How do customers find my food truck?",
            answer: "Customers can search by location, cuisine type, ratings, and real-time availability on our platform."
        },
        {
            question: "Can I update my location in real-time?",
            answer: "Yes! Our platform supports real-time location updates so customers always know where to find you."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="gradient-bg text-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center animate-fadeInUp">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent">
                            Get in Touch
                        </h1>
                        <p className="text-xl md:text-2xl text-sky-100 max-w-4xl mx-auto leading-relaxed">
                            Have questions about Curbside? We're here to help you connect with amazing food trucks
                            and grow your culinary business.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="w-24 h-1 bg-gradient-to-r from-sky-300 to-cyan-300 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    <div className="lg:col-span-2 animate-slideInLeft">
                        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                            <div className="mb-10">
                                <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                                    Send us a Message
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>
                            </div>

                            {status.message && (
                                <div className={`mb-8 p-5 rounded-xl flex items-center gap-4 ${status.type === 'success'
                                    ? 'bg-green-50 text-green-800 border-2 border-green-200'
                                    : 'bg-red-50 text-red-800 border-2 border-red-200'
                                    }`}>
                                    {status.type === 'success' ? (
                                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                    )}
                                    <span className="font-medium">{status.message}</span>
                                </div>
                            )}

                            <form ref={form} onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                                                placeholder="(+64) 123-456-789"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Company/Food Truck
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                                                placeholder="Your business name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                                        Subject *
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                                            placeholder="What is this regarding?"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 resize-none text-gray-900 placeholder-gray-400"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-4 text-lg shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-[1.02] hover:shadow-xl'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            Sending Message...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-6 h-6" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="animate-slideInRight space-y-8">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                                Contact Information
                            </h3>
                            <div className="space-y-6">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-4 p-5 rounded-2xl hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 transition-all duration-300 ${info.action ? 'cursor-pointer transform hover:scale-[1.02]' : ''
                                            }`}
                                        onClick={() => info.action && window.open(info.action, '_blank')}
                                    >
                                        <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-4 rounded-2xl text-white shadow-lg">
                                            {info.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">{info.title}</h4>
                                            <p className="text-sky-600 font-semibold mb-1">{info.detail}</p>
                                            <p className="text-sm text-gray-600">{info.description}</p>
                                        </div>
                                        {info.action && (
                                            <ExternalLink className="w-5 h-5 text-gray-400 mt-2" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                                Follow Us
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-sky-600 hover:to-blue-600 hover:text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg flex items-center justify-center"
                                        title={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-6">
                                {faqItems.map((faq, index) => (
                                    <details key={index} className="group border-b border-gray-100 pb-4">
                                        <summary className="font-semibold text-gray-900 cursor-pointer py-3 list-none hover:text-sky-600 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg">{faq.question}</span>
                                                <span className="transform group-open:rotate-180 transition-transform duration-300 text-sky-600">
                                                    ▼
                                                </span>
                                            </div>
                                        </summary>
                                        <p className="text-gray-600 mt-4 leading-relaxed pl-2 border-l-4 border-sky-200">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;