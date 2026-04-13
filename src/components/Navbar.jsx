import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Clock, MapPin, FileText } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };

        // Check for admin session
        const session = sessionStorage.getItem('hosp_admin_session');
        setIsLoggedIn(session === 'active');

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('hosp_admin_session');
        window.location.href = '/admin';
    };

    const navLinks = [
        { name: 'Início', href: '/' },
        { name: 'Sobre Nós', href: '/sobre' },
        { name: 'Especialidades', href: '/#especialidades' },
        { name: 'Corpo Clínico', href: '/#especialidades' },
        { name: 'Ouvidoria', href: '/ouvidoria' },
    ];

    return (
        <header className="relative w-full z-50 flex flex-col">
            {/* Top Bar - Classic Medical Theme Feature */}
            <div className="hidden md:flex bg-slate-100 text-slate-600 py-2 border-b border-gray-200 text-xs font-medium">
                <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 flex justify-between items-center">
                    <div class="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-medical-blue" />
                            <span>Avenida Barão do Rio Branco, 1751 - Marau, RS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-medical-blue" />
                            <span>hsl@hsaolucas.com.br</span>
                        </div>
                        {isLoggedIn && (
                            <div className="flex items-center gap-2 border-l border-slate-300 pl-6 ml-2">
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-red-500 font-bold hover:text-red-700 transition-colors uppercase tracking-wider text-[11px]"
                                >
                                    <X size={14} /> Sair do Painel
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-medical-blue" />
                            <span>Hospital Dia - Atendimento Agendado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-medical-blue" />
                            <span className="font-bold text-medical-dark">(54) 3342-9292</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div
                className={`w-full transition-all duration-300 bg-white ${isScrolled ? 'fixed top-0 shadow-lg py-3' : 'relative py-4 lg:py-6'
                    }`}
            >
                <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 flex justify-between items-center">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src="/images/Logo Sao Lucas Horizontal Azul.png"
                            alt="Hospital São Lucas Logo"
                            className="h-10 md:h-12 w-auto object-contain"
                        />
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-[14px] xl:text-[15px] font-semibold text-medical-dark hover:text-medical-blue transition-colors uppercase tracking-wide whitespace-nowrap"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="hidden xl:flex items-center gap-3">
                            <a
                                href="#"
                                className="flex items-center gap-3 bg-medical-blue hover:bg-[#0369a1] transition-colors text-white px-5 py-2 rounded-lg group whitespace-nowrap shadow-md"
                            >
                                <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                                    <FaWhatsapp size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase font-semibold text-white/80 leading-tight">Atendimento</span>
                                    <span className="text-sm font-bold leading-tight">WhatsApp</span>
                                </div>
                            </a>
                            <a
                                href="https://pacs.centrodediagnostico.com.br/login?sck=e770e96a-ff2b-409b-864c-9ac8ebe63167&fbclid=fb.1.1772804051509.PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnGW-poWmv1ujaKhqdoC445OxF78bC1EIRPhyGx9kgtiiKW_641-pLTViakuE_aem_1LmkSldQZqjj763PuUQ9Iw&fbp=fb.1.1762970748586.4616594142"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-white border-2 border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white transition-colors px-5 py-1.5 rounded-lg group whitespace-nowrap shadow-sm"
                            >
                                <div className="bg-medical-blue/10 group-hover:bg-white/20 p-2 rounded-full transition-colors group-hover:scale-110">
                                    <FileText size={20} className="text-medical-blue group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase font-semibold opacity-80 leading-tight">Resultado de</span>
                                    <span className="text-sm font-bold leading-tight">Exames</span>
                                </div>
                            </a>
                        </div>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-medical-dark rounded-md hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-[70px] left-0 w-full bg-white shadow-2xl lg:hidden flex flex-col border-t border-gray-100 z-40 overflow-hidden"
                    >
                        <div className="py-2 px-6 flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border-b border-gray-100">
                            <Clock size={14} className="text-medical-blue" />
                            <span>Hospital Dia</span>
                        </div>
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="py-4 px-6 text-medical-dark font-bold uppercase text-sm border-b border-gray-50 hover:bg-gray-50"
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="p-6 flex flex-col gap-3">
                            <a
                                href="#"
                                className="flex items-center justify-center gap-3 bg-medical-blue text-white py-3.5 rounded-lg shadow-md hover:bg-[#0369a1] transition-colors"
                            >
                                <FaWhatsapp size={22} className="text-white" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase font-semibold text-white/80 leading-tight">Atendimento</span>
                                    <span className="text-sm font-bold leading-tight">WhatsApp</span>
                                </div>
                            </a>
                            <a
                                href="https://pacs.centrodediagnostico.com.br/login?sck=e770e96a-ff2b-409b-864c-9ac8ebe63167&fbclid=fb.1.1772804051509.PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnGW-poWmv1ujaKhqdoC445OxF78bC1EIRPhyGx9kgtiiKW_641-pLTViakuE_aem_1LmkSldQZqjj763PuUQ9Iw&fbp=fb.1.1762970748586.4616594142"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 bg-white border-2 border-medical-blue text-medical-blue py-3 rounded-lg shadow-sm hover:bg-medical-blue hover:text-white transition-colors group"
                            >
                                <FileText size={22} className="text-medical-blue group-hover:text-white transition-colors" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase font-semibold opacity-80 leading-tight">Resultado de</span>
                                    <span className="text-sm font-bold leading-tight">Exames</span>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
