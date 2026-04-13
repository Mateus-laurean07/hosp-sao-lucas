import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const specialtiesData = [
    {
        id: "anestesiologia",
        name: "Anestesiologia",
        doctors: [
            { name: "Dr. João Silva", crm: "CRM 12345", img: "https://ui-avatars.com/api/?name=JS&background=0b5bbb&color=fff" },
            { name: "Dra. Maria Souza", crm: "CRM 54321", img: "https://ui-avatars.com/api/?name=MS&background=0b5bbb&color=fff" }
        ]
    },
    {
        id: "cardiologia",
        name: "Cardiologia",
        doctors: [
            { name: "Dr. Carlos Pereira", crm: "CRM 98765", img: "https://ui-avatars.com/api/?name=CP&background=0b5bbb&color=fff" }
        ]
    },
    { id: "cirurgia-cabeca", name: "Cirurgia de Cabeça e Pescoço", doctors: [] },
    { id: "cirurgia-geral", name: "Cirurgia Geral / Aparelho Digestivo", doctors: [] },
    { id: "cirurgia-plastica", name: "Cirurgia Plástica", doctors: [] },
    { id: "cirurgia-vascular", name: "Cirurgia Vascular", doctors: [] },
    { id: "gastro", name: "Gastroenterologia", doctors: [] },
    { id: "ginecologia", name: "Ginecologia", doctors: [] },
    { id: "mastologia", name: "Mastologia", doctors: [] },
    { id: "oftalmologia", name: "Oftalmologia", doctors: [] },
    { id: "ortopedia", name: "Ortopedia", doctors: [] },
    { id: "otorrino", name: "Otorrinolaringologia", doctors: [] },
    { id: "pneumologia", name: "Pneumologia", doctors: [] },
    { id: "urologia", name: "Urologia", doctors: [] }
];

export default function SpecialtiesViewer() {
    const [activeSpec, setActiveSpec] = useState(specialtiesData[0]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10" id="especialidades">
            {/* Sidebar List */}
            <div className="lg:col-span-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-[600px] overflow-y-auto custom-scrollbar">
                <h3 className="text-xl font-heading font-bold text-medical-dark mb-4 px-4 pt-2">Especialidades</h3>
                <div className="flex flex-col gap-1">
                    {specialtiesData.map(spec => (
                        <button
                            key={spec.id}
                            onClick={() => setActiveSpec(spec)}
                            className={`text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${activeSpec.id === spec.id
                                    ? 'bg-medical-blue text-white font-medium shadow-md'
                                    : 'hover:bg-medical-light text-slate-600 hover:text-medical-dark'
                                }`}
                        >
                            <span>{spec.name}</span>
                            <ChevronRight size={18} className={`transition-transform ${activeSpec.id === spec.id ? 'translate-x-1' : 'group-hover:translate-x-1 opacity-50'}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 bg-white p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden min-h-[500px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-medical-light/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSpec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-full z-10 relative"
                    >
                        <div className="mb-8 border-b border-gray-100 pb-6">
                            <h2 className="text-3xl font-heading font-bold text-medical-dark">{activeSpec.name}</h2>
                            <p className="text-slate-500 mt-2">Conheça nosso corpo clínico especializado.</p>
                        </div>

                        <div className="flex-grow">
                            {activeSpec.doctors && activeSpec.doctors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeSpec.doctors.map((doc, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-medical-blue/30 transition-colors">
                                            <img src={doc.img} alt={doc.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                                            <div>
                                                <h4 className="font-bold text-medical-dark">{doc.name}</h4>
                                                <p className="text-sm text-medical-accent font-medium">{doc.crm}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-2xl opacity-50">👨‍⚕️</span>
                                    </div>
                                    <p>Corpo clínico em atualização.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
