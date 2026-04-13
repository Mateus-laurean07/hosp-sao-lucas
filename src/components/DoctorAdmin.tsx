import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronRight, ChevronLeft, MapPin, Link as LinkIcon, User, Phone, Plus, Pencil, Trash2, Instagram, Camera, AlertCircle } from 'lucide-react';
import {
    SyringeOutline, HeartOutline, StethoscopeOutline,
    HeartOrganOutline, BodyOutline, StomachOutline,
    FemaleReproductiveSystemOutline, EyeOutline, JointsOutline,
    EarOutline, KidneysOutline,
    HeadOutline, IntestineOutline
} from 'healthicons-react';

interface Doctor {
    id: string;
    name: string;
    crm: string;
    specialty: string;
    photoUrl: string;
    instagramUrl: string;
    websiteUrl: string;
    about: string;
    address: string;
    phone: string;
}

interface Specialty {
    id: string;
    name: string;
    description: string;
    icon: React.FC<any>;
}

const specialtiesData: Specialty[] = [
    { id: "anestesiologia", name: "Anestesiologia", description: "Segurança cirúrgica e bem-estar.", icon: SyringeOutline },
    { id: "cardiologia", name: "Cardiologia", description: "Saúde do coração.", icon: HeartOutline },
    { id: "cirurgia-geral", name: "Cirurgia Geral", description: "Procedimentos cirúrgicos diversos.", icon: StethoscopeOutline },
    { id: "cirurgia-vascular", name: "Cirurgia Vascular", description: "Saúde das veias e artérias.", icon: HeartOrganOutline },
    { id: "cirurgia-plastica", name: "Cirurgia Plástica", description: "Procedimentos estéticos e reparadores.", icon: BodyOutline },
    { id: "gastro", name: "Gastroenterologia e Aparelho Digestivo", description: "Saúde do aparelho digestivo.", icon: StomachOutline },
    { id: "ginecologia", name: "Ginecologia", description: "Saúde da mulher.", icon: FemaleReproductiveSystemOutline },
    { id: "neurologia", name: "Neurologia", description: "Saúde do sistema nervoso.", icon: HeadOutline },
    { id: "oftalmologia", name: "Oftalmologia", description: "Clínica ocular e cirurgias.", icon: EyeOutline },
    { id: "ortopedia", name: "Ortopedia", description: "Atendimento dos ossos e articulações.", icon: JointsOutline },
    { id: "otorrino", name: "Otorrinolaringologia", description: "Ouvido, nariz e garganta.", icon: EarOutline },
    { id: "proctologia", name: "Proctologia", description: "Saúde do intestino e reto.", icon: IntestineOutline },
    { id: "urologia", name: "Urologia", description: "Trato urinário e reprodutor.", icon: KidneysOutline },
];

const GlowingIcon: React.FC<{ icon: React.FC<any> }> = ({ icon: Icon }) => (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0 rounded-[1.25rem] bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-sm transition-all duration-300 pointer-events-none group-hover:-translate-y-1">
        <Icon className="w-8 h-8 fill-current text-medical-blue group-hover:text-medical-accent transition-colors duration-300" />
    </div>
);

const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
};

export default function DoctorAdmin() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
    const [selectedDoctorView, setSelectedDoctorView] = useState<Doctor | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Deletion Modal state
    const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auth state
    const handleLogout = () => {
        sessionStorage.removeItem('hosp_admin_session');
        window.location.href = '/admin';
    };

    // Initial formData
    const initialFormState: Doctor = { id: '', name: '', crm: '', specialty: '', photoUrl: '', instagramUrl: '', websiteUrl: '', about: '', address: '', phone: '' };
    const [formData, setFormData] = useState<Doctor>(initialFormState);

    useEffect(() => {
        const saved = localStorage.getItem('hosp_doctors_db');
        if (saved) {
            setDoctors(JSON.parse(saved));
        } else {
            const defaultDoc: Doctor = { id: '1', name: 'Dra. Maria Souza', crm: 'CRM/RS 54321', specialty: 'Anestesiologia', photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop', instagramUrl: '@dramariasouza.anestesia', websiteUrl: 'https://dramariasouza.com.br', about: 'Foco em bloqueios regionais e humanização.', address: 'Av. Júlio de Castilhos, 2020 - Sala 1001', phone: '(55) 98888-8888' };
            saveDocs([defaultDoc]);
        }
    }, []);

    const saveDocs = (newDocs: Doctor[]) => {
        console.log("Admin salvando médicos:", newDocs);
        setDoctors(newDocs);
        localStorage.setItem('hosp_doctors_db', JSON.stringify(newDocs));
        // Dispara um evento global para notificar outros componentes que os dados mudaram
        window.dispatchEvent(new Event('doctorsUpdated'));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'phone' ? formatPhone(value) : value 
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (localStorage has ~5MB limit, Base64 adds ~33% overhead)
            if (file.size > 1.5 * 1024 * 1024) {
                alert('A imagem é muito grande. Por favor, escolha uma imagem com menos de 1.5MB para garantir o salvamento.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, photoUrl: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Ensure photoUrl is not empty or handle specifically
        let finalDoc: Doctor;
        let newDocs: Doctor[];

        if (formData.id) {
            finalDoc = { ...formData };
            newDocs = doctors.map(d => d.id === formData.id ? finalDoc : d);
            // Update the view if we are looking at this doctor
            if (selectedDoctorView?.id === formData.id) {
                setSelectedDoctorView(finalDoc);
            }
        } else {
            finalDoc = { ...formData, id: Date.now().toString() };
            newDocs = [...doctors, finalDoc];
        }

        saveDocs(newDocs);
        setIsFormOpen(false);
    };

    const confirmDelete = () => {
        if (!doctorToDelete) return;
        const newDocs = doctors.filter(d => d.id !== doctorToDelete);
        saveDocs(newDocs);
        if (selectedDoctorView?.id === doctorToDelete) setSelectedDoctorView(null);
        setDoctorToDelete(null);
    };

    const openForm = (specName: string = '', doc: Doctor | null = null, e: React.MouseEvent | null = null) => {
        if (e) e.stopPropagation();
        if (doc) {
            setFormData({ ...doc }); // Copy of doctor data
        } else {
            setFormData({ ...initialFormState, specialty: specName });
        }
        setIsFormOpen(true);
    };

    const filteredDoctors = useMemo(() => {
        if (!selectedSpecialty) return [];
        return doctors.filter(d => d.specialty.toLowerCase() === selectedSpecialty.name.toLowerCase());
    }, [doctors, selectedSpecialty]);

    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center p-4 py-12 font-sans relative">
            <div className={`w-full ${!selectedSpecialty ? 'max-w-6xl' : 'max-w-3xl'} z-10 transition-all duration-500`}>
                
                {/* 1. GRID DE ESPECIALIDADES */}
                {!selectedSpecialty && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-12">
                            <div className="text-left">
                                <h2 className="text-3xl md:text-5xl font-bold text-[#073a78] mb-4 font-heading leading-tight">Painel Administrativo</h2>
                                <p className="text-slate-500 font-medium">Controle de profissionais do Hospital São Lucas.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {specialtiesData.map((spec) => (
                                <div key={spec.id} onClick={() => setSelectedSpecialty(spec)} className="bg-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-xl border border-gray-100 cursor-pointer transition-all group active:scale-95 shadow-sm">
                                    <GlowingIcon icon={spec.icon} />
                                    <div className="flex-grow min-w-0">
                                        <h3 className="text-[17px] font-bold text-[#073a78] group-hover:text-[#0b5bbb] transition-colors truncate">{spec.name}</h3>
                                        <p className="text-sm text-slate-400 font-medium">{doctors.filter(d => d.specialty.toLowerCase() === spec.name.toLowerCase()).length} médicos</p>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-200 group-hover:text-[#0b5bbb] group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. ESPECIALIDADE CONTEÚDO */}
                {selectedSpecialty && (
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 border border-gray-100">
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-start justify-between bg-white sticky top-0 z-20">
                            <div className="pr-4 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-medical-blue bg-medical-light/50 p-2.5 rounded-2xl border border-medical-blue/10 w-12 h-12 flex items-center justify-center shrink-0">
                                        <selectedSpecialty.icon className="w-7 h-7 fill-current" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[#073a78] font-heading leading-tight truncate">{selectedSpecialty.name}</h3>
                                </div>
                                {selectedDoctorView ? (
                                    <button onClick={() => setSelectedDoctorView(null)} className="text-sm font-bold text-[#0b5bbb] hover:text-[#073a78] flex items-center gap-1 group transition-all">
                                        <ChevronLeft size={16} className="group-hover:-translate-x-1" />
                                        Voltar à listagem
                                    </button>
                                ) : (
                                    <p className="text-sm text-slate-400 font-semibold flex items-center gap-4">
                                        <span>Gestão do Corpo Clínico</span>
                                        <button onClick={() => setSelectedSpecialty(null)} className="text-xs font-bold text-[#0b5bbb] hover:underline underline-offset-2 tracking-tight">Especialidades</button>
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {!selectedDoctorView && (
                                    <button onClick={() => openForm(selectedSpecialty.name)} className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0b5bbb] text-white rounded-xl font-bold hover:bg-[#073a78] transition-all shadow-md shadow-blue-500/20 active:scale-95 text-sm">
                                        <Plus size={18} /> Novo Médico
                                    </button>
                                )}
                                <button onClick={() => { setSelectedSpecialty(null); setSelectedDoctorView(null); }} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Corpo (Lista ou Perfil) */}
                        <div className="p-6 md:p-8 bg-gray-50/30 min-h-[450px]">
                            {!selectedDoctorView ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {filteredDoctors.length > 0 ? (
                                        filteredDoctors.map((doc) => (
                                            <div key={doc.id} onClick={() => setSelectedDoctorView(doc)} className="flex items-center gap-4 bg-white border border-gray-100 p-4 font-medium rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group relative shadow-sm">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-slate-50 bg-slate-100 shrink-0 shadow-inner">
                                                    {doc.photoUrl ? (
                                                        <img src={doc.photoUrl} alt={doc.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={28} /></div>
                                                    )}
                                                </div>
                                                <div className="flex-grow min-w-0 pr-16">
                                                    <h4 className="font-bold text-lg text-[#073a78] group-hover:text-[#0b5bbb] transition-colors leading-tight truncate">{doc.name}</h4>
                                                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">{doc.crm}</p>
                                                </div>
                                                
                                                <div className="absolute right-4 flex gap-1">
                                                    <button onClick={(e) => openForm(selectedSpecialty.name, doc, e)} className="p-2.5 bg-blue-50 text-[#0b5bbb] hover:bg-[#0b5bbb] hover:text-white rounded-xl transition-all active:scale-90" title="Editar"><Pencil size={18} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); setDoctorToDelete(doc.id); }} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-90" title="Excluir"><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-24 text-center opacity-70">
                                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 mb-5 shadow-sm border border-slate-50"><User size={40} /></div>
                                            <h4 className="text-[#073a78] font-bold text-xl mb-1">Nenhum profissional listado</h4>
                                            <p className="text-slate-400 text-sm font-medium">Adicione médicos para esta especialidade.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-5 text-left">
                                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm w-full relative">
                                        <div className="absolute top-8 right-8 flex gap-2">
                                            <button onClick={() => openForm(selectedSpecialty.name, selectedDoctorView)} className="p-3 bg-blue-50 text-[#0b5bbb] rounded-2xl hover:bg-blue-100 transition-colors" title="Editar"><Pencil size={20} /></button>
                                            <button onClick={() => setDoctorToDelete(selectedDoctorView.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors" title="Deletar"><Trash2 size={20} /></button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start text-center sm:text-left mb-10">
                                            <div className="w-40 h-40 md:w-52 md:h-52 shrink-0 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-50">
                                                {selectedDoctorView.photoUrl ? (
                                                    <img src={selectedDoctorView.photoUrl} alt={selectedDoctorView.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200"><User size={60} /></div>
                                                )}
                                            </div>
                                            <div className="flex-grow pt-4">
                                                <h4 className="text-4xl font-extrabold font-heading text-[#073a78] mb-3 tracking-tight">{selectedDoctorView.name}</h4>
                                                <div className="inline-block px-5 py-2 bg-[#f0f7ff] text-[#0b5bbb] rounded-full font-black text-sm border border-blue-50 shadow-sm mb-8 tracking-widest">{selectedDoctorView.crm}</div>

                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                                    {selectedDoctorView.instagramUrl && (
                                                        <a 
                                                            href={selectedDoctorView.instagramUrl.startsWith('http') ? selectedDoctorView.instagramUrl : `https://instagram.com/${selectedDoctorView.instagramUrl.replace('@', '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-[13px] font-bold text-pink-600 bg-pink-50 px-5 py-2.5 rounded-2xl border border-pink-100/50 shadow-sm hover:bg-pink-100 transition-colors"
                                                        >
                                                            <Instagram size={18} /> {selectedDoctorView.instagramUrl.startsWith('http') ? 'Instagram' : selectedDoctorView.instagramUrl}
                                                        </a>
                                                    )}
                                                    {selectedDoctorView.websiteUrl && (
                                                        <a 
                                                            href={selectedDoctorView.websiteUrl.startsWith('http') ? selectedDoctorView.websiteUrl : `https://${selectedDoctorView.websiteUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-600 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-100 transition-colors"
                                                        >
                                                            <LinkIcon size={18} /> Website
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-10 border-t border-gray-100 pt-12">
                                            <div>
                                                <h5 className="font-black text-[#073a78] mb-4 text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <User size={16} className="text-[#0b5bbb]" /> SOBRE O PROFISSIONAL
                                                </h5>
                                                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                                    {selectedDoctorView.about || 'A equipe do Hospital São Lucas ainda não informou os dados biográficos deste profissional.'}
                                                </p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-12">
                                                <div>
                                                    <h5 className="font-black text-[#073a78] mb-4 text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <MapPin size={16} className="text-[#0b5bbb]" /> ENDEREÇO CLÍNICA
                                                    </h5>
                                                    <p className="text-slate-700 text-[15px] font-bold leading-relaxed">
                                                        {selectedDoctorView.address || 'Consultar na recepção do Hospital.'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h5 className="font-black text-[#073a78] mb-4 text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Phone size={16} className="text-[#0b5bbb]" /> CONTATO AGENDAMENTO
                                                    </h5>
                                                    <p className="text-slate-700 text-[15px] font-bold leading-relaxed tracking-wider">
                                                        {selectedDoctorView.phone || 'Não informado.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. FORMULÁRIO (ADD/EDIT) */}
                <AnimatePresence>
                    {isFormOpen && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#073a78]/70 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
                            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-white w-full max-w-xl rounded-[3rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative z-10 border-t-[10px] border-[#0b5bbb] text-left max-h-[92vh] overflow-y-auto custom-scrollbar">
                                <button onClick={() => setIsFormOpen(false)} className="absolute top-8 right-8 p-2.5 hover:bg-slate-50 rounded-full text-slate-400 transition-all active:rotate-90"><X size={26} /></button>
                                
                                <div className="mb-10">
                                    <h3 className="text-3xl font-black text-[#073a78] leading-tight font-heading tracking-tight">{formData.id ? 'Editar Profissional' : 'Novo Cadastro'}</h3>
                                    <div className="inline-block mt-2 px-3 py-1 bg-blue-50 text-[#0b5bbb] text-[11px] font-black uppercase tracking-widest rounded-lg border border-blue-100">{formData.specialty}</div>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-7">
                                    {/* Upload Area */}
                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center transition-all hover:border-[#0b5bbb]/30 group">
                                        <div className="relative mb-5">
                                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2.25rem] overflow-hidden bg-white shadow-xl border-4 border-white relative group-hover:scale-105 transition-transform">
                                                {formData.photoUrl ? (
                                                    <img src={formData.photoUrl} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50"><User size={40} /></div>
                                                )}
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-[#073a78]/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                                                    <Camera size={28} className="mb-1" />
                                                    <span className="text-[10px] uppercase font-black">Alterar</span>
                                                </button>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0b5bbb] rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white pointer-events-none">
                                                <Plus size={20} />
                                            </div>
                                        </div>
                                        
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                        
                                        <div className="w-full">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 block">Link da Imagem ou Caminho Local</label>
                                            <input 
                                                name="photoUrl" 
                                                value={formData.photoUrl.startsWith('data:') ? '✓ Arquivo carregado com sucesso' : formData.photoUrl} 
                                                onChange={handleInputChange} 
                                                className={`w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:border-[#0b5bbb] outline-none transition-all ${formData.photoUrl.startsWith('data:') ? 'text-green-600' : 'text-slate-600'}`} 
                                                placeholder="https://exemplo.com/foto.jpg" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5"><label className="text-[11px] font-black uppercase text-slate-700 ml-1 tracking-tight">Nome Completo</label><input required name="name" value={formData.name} onChange={handleInputChange} className="w-full p-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0b5bbb] focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="Ex: Dra. Maria Souza" /></div>
                                        <div className="space-y-1.5"><label className="text-[11px] font-black uppercase text-slate-700 ml-1 tracking-tight">CRM / UF</label><input required name="crm" value={formData.crm} onChange={handleInputChange} className="w-full p-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0b5bbb] focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="Ex: CRM/RS 12345" /></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5"><label className="text-[11px] font-black uppercase text-slate-700 ml-1 tracking-tight">Perfil Instagram</label><input name="instagramUrl" value={formData.instagramUrl} onChange={handleInputChange} className="w-full p-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0b5bbb] focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="@dramaria_cardiologia" /></div>
                                        <div className="space-y-1.5"><label className="text-[11px] font-black uppercase text-slate-700 ml-1 tracking-tight">Telefone / Whats</label><input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0b5bbb] focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="(54) 00000-0000" /></div>
                                    </div>

                                    <div className="space-y-1.5"><label className="text-[11px] font-black uppercase text-slate-700 ml-1 tracking-tight">Website ou Link Externo</label><input name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} className="w-full p-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0b5bbb] focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="https://www.dramaria.com.br" /></div>
                                    <div className="space-y-1.5"><label className="text-[11px] font-black uppercase text-slate-700 ml-1 tracking-tight">Biografia do Profissional</label><textarea name="about" value={formData.about} onChange={handleInputChange} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-[#0b5bbb] focus:bg-white outline-none transition-all h-32 font-semibold text-slate-700 resize-none shadow-sm leading-relaxed" placeholder="Fale um pouco sobre a formação e experiência do médico..." /></div>
                                    <div className="space-y-1.5"><label className="text-[11px] font-black uppercase text-slate-700 ml-1 tracking-tight">Endereço de Atendimento</label><input name="address" value={formData.address} onChange={handleInputChange} className="w-full p-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0b5bbb] focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="Ex: Av. Principal, 123 - Sala 45" /></div>

                                    <div className="flex gap-4 pt-6 sticky bottom-0 bg-white/90 backdrop-blur-sm mt-4 border-t border-slate-50 py-4">
                                        <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-5 bg-slate-100 font-black text-slate-500 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Cancelar</button>
                                        <button type="submit" className="flex-1 py-5 bg-[#0b5bbb] text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-[#073a78] transition-all uppercase tracking-widest text-xs active:scale-[0.98]">Salvar Profissional</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* MODAL DE DELETAR */}
                <AnimatePresence>
                    {doctorToDelete && (
                        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#073a78]/80 backdrop-blur-md" onClick={() => setDoctorToDelete(null)} />
                            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white max-w-sm w-full rounded-[3rem] p-10 text-center relative z-10 shadow-2xl overflow-hidden border-t-8 border-red-500">
                                <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-red-500 animate-pulse">
                                    <AlertCircle size={48} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-black text-[#073a78] mb-4 tracking-tight">Confirmar Exclusão?</h3>
                                <p className="text-slate-500 font-bold mb-10 leading-relaxed text-sm">
                                    O registro deste médico será removido permanentemente de todos os sistemas do Hospital São Lucas.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <button onClick={confirmDelete} className="w-full py-5 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 shadow-xl shadow-red-500/30 transition-all uppercase tracking-widest text-[11px] active:scale-95">
                                        Sim, Excluir Profissional
                                    </button>
                                    <button onClick={() => setDoctorToDelete(null)} className="w-full py-5 bg-slate-50 text-slate-400 font-bold rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[11px]">
                                        Manter Cadastro
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
}
