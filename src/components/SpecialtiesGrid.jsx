import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  ChevronRight,
  MapPin,
  Link as LinkIcon,
  Stethoscope,
  User,
  Phone,
} from "lucide-react";
import {
  SyringeOutline,
  HeartOutline,
  StethoscopeOutline,
  HeartOrganOutline,
  BodyOutline,
  StomachOutline,
  FemaleReproductiveSystemOutline,
  EyeOutline,
  JointsOutline,
  EarOutline,
  KidneysOutline,
  HeadOutline,
  IntestineOutline,
} from "healthicons-react";

const specialtiesData = [
  {
    id: "anestesiologia",
    name: "Anestesiologia",
    description: "Segurança cirúrgica e bem-estar.",
    icon: SyringeOutline,
    doctors: [],
  },
  {
    id: "cardiologia",
    name: "Cardiologia",
    description: "Saúde do coração.",
    icon: HeartOutline,
    doctors: [],
  },
  {
    id: "cirurgia-geral",
    name: "Cirurgia Geral",
    description: "Procedimentos cirúrgicos diversos.",
    icon: StethoscopeOutline,
    doctors: [],
  },
  {
    id: "cirurgia-vascular",
    name: "Cirurgia Vascular",
    description: "Saúde das veias e artérias.",
    icon: HeartOrganOutline,
    doctors: [],
  },
  {
    id: "cirurgia-plastica",
    name: "Cirurgia Plástica",
    description: "Procedimentos estéticos e reparadores.",
    icon: BodyOutline,
    doctors: [],
  },
  {
    id: "gastro",
    name: "Gastroenterologia e Aparelho Digestivo",
    description: "Saúde do aparelho digestivo.",
    icon: StomachOutline,
    doctors: [],
  },
  {
    id: "ginecologia",
    name: "Ginecologia",
    description: "Saúde da mulher.",
    icon: FemaleReproductiveSystemOutline,
    doctors: [],
  },
  {
    id: "neurologia",
    name: "Neurologia",
    description: "Saúde do sistema nervoso.",
    icon: HeadOutline,
    doctors: [],
  },
  {
    id: "oftalmologia",
    name: "Oftalmologia",
    description: "Clínica ocular e cirurgias.",
    icon: EyeOutline,
    doctors: [],
  },
  {
    id: "ortopedia",
    name: "Ortopedia",
    description: "Atendimento dos ossos e articulações.",
    icon: JointsOutline,
    doctors: [],
  },
  {
    id: "otorrino",
    name: "Otorrinolaringologia",
    description: "Ouvido, nariz e garganta.",
    icon: EarOutline,
    doctors: [],
  },
  {
    id: "proctologia",
    name: "Proctologia",
    description: "Saúde do intestino e reto.",
    icon: IntestineOutline,
    doctors: [],
  },
  {
    id: "urologia",
    name: "Urologia",
    description: "Trato urinário e reprodutor.",
    icon: KidneysOutline,
    doctors: [],
  },
  {
    id: "medicina-interna",
    name: "Medicina Interna",
    description: "Cuidado clínico abrangente do adulto.",
    icon: StethoscopeOutline,
    doctors: [],
  },
];

const GlowingIcon = ({ icon: Icon }) => (
  <div className="relative flex items-center justify-center w-16 h-16 shrink-0 rounded-[1.25rem] bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-[0_4px_12px_-4px_rgba(14,165,233,0.1),_inset_0_2px_4px_rgba(255,255,255,1)] group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_-6px_rgba(14,165,233,0.15),_inset_0_2px_4px_rgba(255,255,255,1)] transition-all duration-300">
    <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-br from-medical-blue/5 to-medical-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10 text-medical-blue group-hover:text-medical-accent transition-colors duration-300 group-hover:scale-105 flex items-center justify-center w-8 h-8">
      <Icon className="w-full h-full fill-current" />
    </div>
  </div>
);

export default function SpecialtiesGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [allDoctors, setAllDoctors] = useState([]);

  useEffect(() => {
    const loadDoctors = () => {
      const saved = localStorage.getItem("hosp_doctors_db");
      if (saved) {
        setAllDoctors(JSON.parse(saved));
      } else {
        const defaultDoc = {
          id: "1",
          name: "Dra. Maria Souza",
          crm: "CRM/RS 54321",
          specialty: "Anestesiologia",
          photoUrl:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
          instagramUrl: "@dramariasouza.anestesia",
          websiteUrl: "https://dramariasouza.com.br",
          about: "Foco em bloqueios regionais e humanização.",
          address: "Av. Júlio de Castilhos, 2020 - Sala 1001",
          phone: "5554988888888",
        };
        setAllDoctors([defaultDoc]);
        localStorage.setItem("hosp_doctors_db", JSON.stringify([defaultDoc]));
      }
    };

    loadDoctors();
    console.log(
      "Médicos carregados no Site:",
      localStorage.getItem("hosp_doctors_db"),
    );

    // Escuta atualizações do Admin
    window.addEventListener("doctorsUpdated", loadDoctors);
    return () => window.removeEventListener("doctorsUpdated", loadDoctors);
  }, []);

  const specialtiesWithDoctors = useMemo(() => {
    return specialtiesData.map((spec) => ({
      ...spec,
      doctors: allDoctors
        .filter((doc) => {
          const docSpec = (doc.specialty || "").trim().toLowerCase();
          const specName = (spec.name || "").trim().toLowerCase();
          // Verifica igualdade ou se um contém o outro para ser mais flexível
          return (
            docSpec === specName ||
            docSpec.includes(specName) ||
            specName.includes(docSpec)
          );
        })
        .map((doc) => ({
          id: doc.id,
          name: doc.name,
          crm: doc.crm,
          img: doc.photoUrl || "https://via.placeholder.com/150",
          bio: doc.about,
          phone: doc.phone,
          instagram: doc.instagramUrl,
          site: doc.websiteUrl,
          address: doc.address,
        })),
    }));
  }, [allDoctors]);

  const filteredSpecialties = useMemo(() => {
    return specialtiesWithDoctors.filter(
      (spec) =>
        spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spec.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, specialtiesWithDoctors]);

  const handleWhatsApp = (phone, doctorName) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, ""); // Remove tudo que não é número
    const text = `Olá, gostaria de agendar uma consulta com ${doctorName}.`;
    const encodedText = encodeURIComponent(text);

    // Link formatado conforme solicitado
    const url = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodedText}&type=phone_number&app_absent=0`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-20 md:py-32 bg-gray-50 relative" id="especialidades">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Header and Search */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 border border-medical-blue/20 text-medical-blue font-bold px-4 py-1.5 rounded-full text-sm mb-6 bg-white shadow-sm">
            <Stethoscope size={16} /> Especialidades Médicas
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-medical-dark font-heading mb-6 tracking-tight">
            Cuidado Especializado
          </h2>

          <div className="relative max-w-xl mx-auto mt-8 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-medical-blue transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              className="w-full bg-white border-2 border-gray-200 focus:border-medical-blue text-medical-dark placeholder-slate-400 text-lg rounded-2xl py-4 pl-12 pr-4 outline-none transition-all shadow-sm focus:shadow-md"
              placeholder="Buscar especialidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpecialties.length > 0 ? (
            filteredSpecialties.map((spec) => (
              <div
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec)}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-medical-blue/20 cursor-pointer transition-all group active:scale-[0.98]"
              >
                <GlowingIcon icon={spec.icon} />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-medical-dark group-hover:text-medical-blue transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1">
                    {spec.description}
                  </p>
                </div>
                <div className="text-slate-300 group-hover:text-medical-blue group-hover:translate-x-1 transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-gray-200">
              <Search size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">
                Nenhuma especialidade encontrada para "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Modal for Doctors */}
        <AnimatePresence>
          {selectedSpecialty && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-medical-dark/70 backdrop-blur-sm"
                onClick={() => {
                  setSelectedSpecialty(null);
                  setSelectedDoctor(null);
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white w-full max-w-2xl relative z-10 overflow-hidden flex flex-col rounded-t-[32px] md:rounded-[32px] max-h-[90vh] md:max-h-[85vh] shadow-2xl"
              >
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-start justify-between bg-white sticky top-0 z-20">
                  <div className="pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-medical-blue bg-medical-light/50 p-2.5 rounded-xl border border-medical-blue/10 w-12 h-12 flex items-center justify-center">
                        {selectedSpecialty.icon &&
                          React.createElement(selectedSpecialty.icon, {
                            className: "w-7 h-7 fill-current",
                          })}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-medical-dark font-heading leading-tight">
                        {selectedSpecialty.name}
                      </h3>
                    </div>
                    {selectedDoctor ? (
                      <button
                        onClick={() => setSelectedDoctor(null)}
                        className="text-sm font-bold text-medical-blue hover:text-medical-accent flex items-center gap-1 group"
                      >
                        <ChevronRight
                          size={16}
                          className="rotate-180 group-hover:-translate-x-1 transition-transform"
                        />
                        Voltar para os médicos
                      </button>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Selecione o profissional para agendar.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSpecialty(null);
                      setSelectedDoctor(null);
                    }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-slate-500 shrink-0"
                  >
                    <X size={20} className="stroke-[2.5]" />
                  </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto bg-gray-50/50 flex-grow">
                  {!selectedDoctor ? (
                    <div className="grid grid-cols-1 gap-3">
                      {selectedSpecialty.doctors.length > 0 ? (
                        selectedSpecialty.doctors.map((doc, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedDoctor(doc)}
                            className="flex items-center gap-4 bg-white border border-gray-200 p-4 font-medium rounded-2xl hover:border-medical-blue hover:shadow-md transition-all cursor-pointer group"
                          >
                            <img
                              src={doc.img}
                              alt={doc.name}
                              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-medical-light/50 shadow-sm"
                            />
                            <div className="flex-grow">
                              <h4 className="font-bold text-lg text-medical-dark group-hover:text-medical-blue transition-colors leading-tight">
                                {doc.name}
                              </h4>
                              <p className="text-sm text-slate-500 mt-0.5">
                                {doc.crm}
                              </p>
                            </div>
                            <div className="xl:bg-medical-light/30 xl:text-medical-blue w-10 h-10 rounded-full flex items-center justify-center xl:opacity-0 group-hover:opacity-100 group-hover:bg-medical-blue group-hover:text-white transition-all shrink-0">
                              <ChevronRight size={20} />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-200">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <User size={32} />
                          </div>
                          <h4 className="font-bold text-lg text-medical-dark mb-2">
                            Corpo Clínico em Atualização
                          </h4>
                          <p className="text-slate-500 text-sm max-w-sm mx-auto">
                            Em breve disponibilizaremos a lista completa de
                            profissionais desta especialidade.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm w-full">
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                          <div className="w-32 h-32 md:w-36 md:h-36 shrink-0 rounded-[2rem] overflow-hidden shadow-md">
                            <img
                              src={selectedDoctor.img}
                              alt={selectedDoctor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow w-full">
                            <h4 className="text-2xl font-bold font-heading text-medical-dark mb-1">
                              {selectedDoctor.name}
                            </h4>
                            <p className="text-medical-blue font-bold text-sm bg-medical-light/30 inline-block px-3 py-1 rounded-full mb-4">
                              {selectedDoctor.crm}
                            </p>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                              {selectedDoctor.instagram && (
                                <a
                                  href={
                                    selectedDoctor.instagram.startsWith("http")
                                      ? selectedDoctor.instagram
                                      : `https://instagram.com/${selectedDoctor.instagram.replace("@", "")}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-3 py-1.5 rounded-lg transition-colors border border-pink-100/50"
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="2"
                                      y="2"
                                      width="20"
                                      height="20"
                                      rx="5"
                                      ry="5"
                                    ></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line
                                      x1="17.5"
                                      y1="6.5"
                                      x2="17.51"
                                      y2="6.5"
                                    ></line>
                                  </svg>
                                  {selectedDoctor.instagram.startsWith("http")
                                    ? "Instagram"
                                    : selectedDoctor.instagram}
                                </a>
                              )}
                              {selectedDoctor.site && (
                                <a
                                  href={
                                    selectedDoctor.site.startsWith("http")
                                      ? selectedDoctor.site
                                      : `https://${selectedDoctor.site}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
                                >
                                  <LinkIcon size={14} /> Website
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <hr className="my-6 border-gray-100" />

                        <div className="space-y-5 text-left">
                          <div>
                            <h5 className="font-bold text-medical-dark mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                              <User size={16} className="text-medical-blue" />{" "}
                              Sobre o Profissional
                            </h5>
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                              {selectedDoctor.bio ||
                                "Sem informações adicionais."}
                            </p>
                          </div>

                          {selectedDoctor.address && (
                            <div>
                              <h5 className="font-bold text-medical-dark mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                                <MapPin
                                  size={16}
                                  className="text-medical-blue"
                                />{" "}
                                Endereço de Atendimento
                              </h5>
                              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                {selectedDoctor.address}
                              </p>
                            </div>
                          )}

                          {selectedDoctor.phone && (
                            <div>
                              <h5 className="font-bold text-medical-dark mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                                <Phone
                                  size={16}
                                  className="text-medical-blue"
                                />{" "}
                                Telefone para Contato
                              </h5>
                              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                {selectedDoctor.phone}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <div className="bg-medical-light/20 rounded-2xl p-6 mb-6 border border-medical-blue/10">
                            <h5 className="font-bold text-medical-dark mb-4 text-sm uppercase tracking-wider">Solicitar Agendamento</h5>
                            <div className="space-y-3">
                              <input 
                                type="text" 
                                id="lead_name"
                                placeholder="Seu nome completo" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-blue outline-none text-sm transition-all"
                              />
                              <input 
                                type="tel" 
                                id="lead_phone"
                                placeholder="Seu WhatsApp (00) 00000-0000" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-blue outline-none text-sm transition-all"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              const name = document.getElementById('lead_name').value;
                              const phone = document.getElementById('lead_phone').value;
                              
                              if(!name || !phone) {
                                alert('Por favor, preencha seu nome e telefone para agendarmos seu atendimento.');
                                return;
                              }

                              // Redireciona com os dados no texto do WhatsApp
                              const customText = `Olá, meu nome é ${name} (${phone}). Gostaria de agendar uma consulta com ${selectedDoctor.name}.`;
                              const cleanPhone = selectedDoctor.phone.replace(/\D/g, "");
                              const url = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(customText)}&type=phone_number&app_absent=0`;
                              window.open(url, "_blank");
                            }}
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20 text-base"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="22"
                              height="22"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="fill-current stroke-none"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Confirmar e Agendar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
