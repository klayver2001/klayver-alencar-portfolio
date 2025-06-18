"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Linkedin, Github, Mail, Send, Menu, X, ArrowUpCircle, Terminal as TerminalIcon, Sun, Moon } from 'lucide-react';

// --- HOOKS e COMPONENTES AUXILIARES ---
const useInView = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } }, options);
        let currentRef = ref.current;
        if (currentRef) { observer.observe(currentRef); }
        return () => { if (currentRef) { observer.unobserve(currentRef); } };
    }, [ref, options]);
    return [ref, isInView];
};

const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const [ref, isInView] = useInView({ threshold: 0.1 });
    const transitionStyle = { transitionDelay: `${delay}ms` };
    return (<div ref={ref as React.RefObject<HTMLDivElement>} style={transitionStyle} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>{children}</div>);
};

// --- DADOS GLOBAIS ---
const userProjects = [
  { id: "dashboard-redes", title: "Dashboard de Monitoramento de Rede", category: "Full-Stack", description: "Aplicação que consome APIs de equipamentos para exibir status em tempo real.", problem: "A equipe de redes precisava de uma forma rápida e centralizada para visualizar a saúde dos principais ativos da rede.", solution: "Desenvolvi um dashboard com Chart.js para criar gráficos dinâmicos de latência e uso de banda, com um sistema de alertas visuais.", longDescription: "Este projeto foi um mergulho profundo na integração de infraestrutura com desenvolvimento front-end. O maior desafio foi normalizar os dados de diferentes fornecedores.", technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Chart.js", "API REST"], repoUrl: "https://github.com/klayver2001/exemplo-dashboard", liveUrl: "#", gifUrl: "https://placehold.co/600x400/0ea5e9/e0f2fe?text=Projeto+1+GIF" },
  { id: "sistema-inventario", title: "Sistema de Inventário de Ativos", category: "Full-Stack", description: "Plataforma para gerenciamento de ativos de TI, com controle de alocação e histórico.", problem: "O controle de inventário era feito em planilhas, gerando inconsistências e dificuldades no rastreamento.", solution: "Criei uma aplicação full-stack que permite o cadastro de ativos via QR code, associa a um usuário e registra todo o histórico em um banco de dados PostgreSQL.", longDescription: "O foco foi a modelagem do banco de dados e a criação de uma API RESTful segura. A implementação do histórico foi crucial para fornecer uma visão clara do ciclo de vida de cada equipamento.", technologies: ["React", "Node.js", "Express", "PostgreSQL", "JWT"], repoUrl: "https://github.com/klayver2001/exemplo-inventario", gifUrl: "https://placehold.co/600x400/0ea5e9/e0f2fe?text=Projeto+2+GIF" },
  { id: "automacao-backup", title: "Automação de Backup de Switches", category: "Automação & Redes", description: "Script para automatizar o backup de configurações de centenas de switches de rede.", problem: "O processo de backup era manual, demorado e sujeito a erros humanos, colocando em risco a recuperação de desastres.", solution: "Utilizando a biblioteca Netmiko, o script se conecta via SSH a uma lista de switches, executa os comandos de backup e armazena os arquivos de configuração de forma organizada.", longDescription: "Este projeto foi meu primeiro passo para unir redes e programação de forma prática. O maior aprendizado foi o tratamento de exceções para diferentes versões de firmware dos equipamentos.", technologies: ["Python", "Netmiko", "Redes"], repoUrl: "https://github.com/klayver2001/exemplo-automacao", gifUrl: "https://placehold.co/600x400/0ea5e9/e0f2fe?text=Projeto+3+GIF" }
];
const timelineEvents = [
    { icon: null, date: "2019", title: "Início em Redes", description: "Comecei minha jornada garantindo a performance e segurança de redes corporativas, gerenciando firewalls e switches." },
    { icon: null, date: "2021", title: "Primeira Linha de Código", description: "A paixão por otimizar me levou a automatizar tarefas de rede com Python, descobrindo o poder do desenvolvimento." },
    { icon: null, date: "2023", title: "Mergulho no Full-Stack", description: "Decidi unir as duas áreas, iniciando estudos aprofundados em React, Node.js e o ecossistema JavaScript moderno." },
    { icon: null, date: "Hoje", title: "Construindo Soluções Híbridas", description: "Aplico minha visão única para criar aplicações robustas, resilientes e seguras, da infraestrutura à interface." },
];
const skillsData = {
    redes: [
        { name: "TCP/IP", description: "Análise e troubleshooting de pacotes com Wireshark." },
        { name: "Roteadores & Switches", description: "Configuração de VLANs, rotas estáticas e OSPF." },
        { name: "Firewall (PFSense)", description: "Implementação de regras de segurança e VPNs." },
        { name: "Monitoramento", description: "Criação de dashboards e alertas com Zabbix e Grafana." },
        { name: "Linux Server", description: "Administração de serviços (Apache, Nginx) e segurança." },
    ],
    web: [
        { name: "TypeScript", description: "Tipagem estática para projetos robustos em front e back-end." },
        { name: "React / Next.js", description: "Criação de UIs reativas e SSR." },
        { name: "Node.js", description: "Desenvolvimento de APIs RESTful com Express." },
        { name: "Python", description: "Automação de tarefas e scripting com Flask/Django." },
        { name: "Bancos de Dados", description: "Modelagem e queries em PostgreSQL e MongoDB." },
    ]
}

// --- COMPONENTE DO TERMINAL "KlayverOS" ---
const KlayverOS = ({ onSwitchToGui, onOpenProject }: { onSwitchToGui: () => void; onOpenProject: (id: string) => void; }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalBodyRef = useRef<HTMLDivElement>(null);
    useEffect(() => { setHistory([{ type: 'info', text: "Bem-vindo ao KlayverOS! Digite 'help' para começar." }]); inputRef.current?.focus(); }, []);
    const commands: { [key: string]: (args?: string[]) => void } = {
        help: () => setHistory(prev => [...prev, { type: 'output', text: 'Comandos disponíveis:\n  help      - Mostra esta lista de ajuda\n  whoami    - Exibe informações sobre mim\n  ls        - Lista projetos e arquivos\n  exec      - Executa um projeto (ex: exec dashboard-redes)\n  skills    - Mostra minhas habilidades técnicas\n  contact   - Mostra minhas informações de contato\n  gui       - Muda para a interface gráfica do portfólio\n  clear     - Limpa o terminal' }]),
        whoami: () => setHistory(prev => [...prev, { type: 'output', text: 'Klayver Alencar\nAnalista Híbrido (Redes + Desenvolvimento)\nApaixonado por construir soluções que unem a robustez da infraestrutura com a elegância da experiência do usuário.' }]),
        ls: () => setHistory(prev => [...prev, { type: 'output', text: `Projetos (executáveis):\n${userProjects.map(p => `  - ${p.id}`).join('\n')}\n\nOutros Comandos:\n  - skills, contact, gui, help, clear, whoami` }]),
        exec: (args) => { const projectId = args?.[0]; if (projectId && userProjects.some(p => p.id === projectId)) { onOpenProject(projectId); setHistory(prev => [...prev, { type: 'info', text: `Executando projeto: ${projectId}...` }]); } else { setHistory(prev => [...prev, { type: 'error', text: `Erro: Projeto "${projectId}" não encontrado. Use 'ls' para ver os projetos disponíveis.` }]); } },
        skills: () => setHistory(prev => [...prev, { type: 'output', text: "Habilidades:\n\n[Redes e Infraestrutura]\n  - TCP/IP, Roteadores & Switches, Firewall, VPNs, Monitoramento (Zabbix), Linux Server\n\n[Desenvolvimento Web]\n  - JavaScript (ES6+), TypeScript, React, Next.js, Node.js, Python, APIs REST, Git & GitHub" }]),
        contact: () => setHistory(prev => [...prev, { type: 'output', text: 'Você pode me encontrar em:\n  - LinkedIn: https://www.linkedin.com/in/klayveralencar/\n  - GitHub:   https://github.com/klayver2001' }]),
        gui: () => { setHistory(prev => [...prev, { type: 'info', text: 'Iniciando interface gráfica...' }]); setTimeout(onSwitchToGui, 500); },
        clear: () => setHistory([])
    };
    const handleCommand = (e: React.FormEvent) => { e.preventDefault(); const commandInput = input.trim(); const [command, ...args] = commandInput.split(/\s+/); setHistory(prev => [...prev, { type: 'input', text: commandInput }]); if (commands[command]) { commands[command](args); } else if (commandInput) { setHistory(prev => [...prev, { type: 'error', text: `Comando não encontrado: ${command}` }]); } setInput(''); };
    useEffect(() => { terminalBodyRef.current?.scrollTo(0, terminalBodyRef.current.scrollHeight); }, [history]);
    return (<div className="font-mono text-sm bg-[var(--background)] text-[var(--text-main)] w-full h-screen p-4 flex flex-col" onClick={() => inputRef.current?.focus()}><div ref={terminalBodyRef} className="flex-grow overflow-y-auto">{history.map((line, index) => (<div key={index}>{line.type === 'input' && <p><span className="text-[var(--accent)]">KlayverOS:~$</span> {line.text}</p>}{line.type === 'output' && <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{line.text}</p>}{line.type === 'info' && <p className="text-[var(--accent)]">{line.text}</p>}{line.type === 'error' && <p className="text-[var(--error)]">{line.text}</p>}</div>))}{<form onSubmit={handleCommand} className="flex items-center"><span className="text-[var(--accent)]">KlayverOS:~$</span><input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-grow bg-[var(--card)] text-[var(--text-main)] outline-none ml-2" autoComplete="off" autoFocus /></form>}</div></div>);
};

// --- COMPONENTES DA INTERFACE GRÁFICA ---
const ProjectModal = ({ project, onClose }: { project: any; onClose: () => void; }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') { onClose(); } };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[var(--card)] w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)]">{project.title}</h2>
                        <button onClick={onClose} className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors"><X size={24} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="relative mb-4 overflow-hidden rounded-md aspect-video bg-[var(--background)]">
                                <img src={project.gifUrl} alt={`Demonstração do projeto ${project.title}`} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2">Tecnologias Utilizadas</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech: string) => (
                                    <span key={tech} className="bg-[var(--background)] text-[var(--text-secondary)] text-xs px-2 py-1 rounded-md">{tech}</span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4 text-[var(--text-secondary)]">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-main)] mb-1">O Problema</h3>
                                <p>{project.problem}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-main)] mb-1">Minha Solução</h3>
                                <p>{project.solution}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-main)] mb-1">Detalhes e Aprendizados</h3>
                                <p>{project.longDescription}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GraphicalPortfolio = ({ onSwitchToCli, onOpenProject, theme, setTheme }: { onSwitchToCli: () => void; onOpenProject: (id: string) => void; theme: 'light' | 'dark'; setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>; }) => {
    const [selectedProject, setSelectedProject] = useState<any>(null);

    useEffect(() => {
        document.body.style.overflow = selectedProject ? 'hidden' : 'auto';
    }, [selectedProject]);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        window.localStorage.setItem('theme', theme);
    }, [theme]);

    // Sub-componentes para a GUI
    const ThemeSwitcher = () => (
        <button
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ background: 'none', border: 'none', padding: 8, borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            {theme === 'dark' ? <Sun size={22} color="#f5f7fa" /> : <Moon size={22} color="#232837" />}
        </button>
    );
    const AuroraBackground = () => (<div className="fixed top-0 left-0 w-full h-full -z-10" style={{opacity: 1, transition: 'opacity 500ms'}}><div className="aurora-background"></div></div>);
    const NetworkAnimation = () => (<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"><div className="network-animation"></div></div>);
    const SkillBadge = ({ skill }: { skill: {name: string, description: string} }) => (<div className="relative group"><span className="cursor-pointer bg-[var(--background)] text-[var(--accent)] text-sm font-medium me-2 px-3 py-1.5 rounded-full border border-[var(--border)]">{skill.name}</span><div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-xs bg-[var(--card)] text-[var(--text-secondary)] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-[var(--border)]">{skill.description}</div></div>);
    const GUIHeader = () => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const navLinks = [{ href: "#about", label: "Sobre" }, { href: "#projects", label: "Projetos" }, { href: "#skills", label: "Habilidades" }, { href: "#contact", label: "Contato" }];
        
        return(
            <header className="bg-[var(--background)]/80 backdrop-blur-lg sticky top-0 z-40 border-b border-[var(--border)]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0"><a href="#" className="text-2xl font-bold text-[var(--accent)] tracking-wider">KA</a></div>
                        <div className="hidden md:flex items-center gap-2">
                            <nav className="flex items-baseline space-x-2">{navLinks.map((link) => (<a key={link.href} href={link.href} className="text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-main)] px-3 py-2 rounded-md text-sm font-medium transition-colors">{link.label}</a>))}</nav>
                            <ThemeSwitcher />
                            <div className="w-px h-6 bg-[var(--border)] mx-2"></div>
                            <button onClick={onSwitchToCli} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors" aria-label="Abrir terminal"><TerminalIcon size={20} /></button>
                        </div>
                        <div className="md:hidden flex items-center gap-2">
                            <ThemeSwitcher />
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-[var(--text-secondary)]">{isMenuOpen ? <X/> : <Menu />}</button>
                        </div>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <nav className="flex flex-col items-center space-y-2 mt-4">
                             {navLinks.map((link) => (<a key={link.href} href={link.href} onClick={()=> setIsMenuOpen(false)} className="text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-main)] px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-center">{link.label}</a>))}
                             <button onClick={() => { onSwitchToCli(); setIsMenuOpen(false); }} className="text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-main)] px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-center flex items-center justify-center gap-2"><TerminalIcon size={16}/> KlayverOS</button>
                        </nav>
                    </div>
                 )}
            </header>
        );
    };

    const GUIHero = () => (<section id="home" className="relative py-24 md:py-36 overflow-hidden bg-[var(--background)]"><NetworkAnimation /><div className="container relative z-10 mx-auto text-center px-4"><AnimatedSection><h1 className="text-4xl md:text-6xl font-extrabold text-[var(--text-main)] leading-tight">Analista Híbrido: <br className="md:hidden"/> Conectando Código e Infraestrutura</h1><p className="mt-4 text-lg md:text-xl text-[var(--accent)] max-w-3xl mx-auto">Desenvolvedor & Profissional de Redes</p><p className="mt-6 text-md md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">Construo soluções digitais robustas, seguras e performáticas, unindo a infraestrutura que sustenta a web com a experiência que encanta o usuário.</p></AnimatedSection></div></section>);
    const GUIAbout = () => (<section id="about" className="py-20 bg-[var(--background)]"><div className="container mx-auto px-4 sm:px-6 lg:px-8"><AnimatedSection><div className="text-center mb-16"><h2 className="text-3xl font-bold text-[var(--text-main)]">Minha Jornada</h2><div className="w-24 h-1 bg-[var(--accent)] mx-auto mt-2"></div></div></AnimatedSection><div className="relative max-w-2xl mx-auto"><div className="absolute left-5 top-5 w-0.5 h-full bg-[var(--background)]"></div><div className="space-y-12">{timelineEvents.map((event, index) => (<AnimatedSection key={index} delay={index * 150}><div className="flex items-start pl-4"><div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-[var(--accent)] text-[var(--text-main)] rounded-full z-10 -ml-9 border-4 border-[var(--border)]"><span className="w-4 h-4 rounded-full bg-[var(--text-main)] block"></span></div><div className="ml-6"><p className="font-bold text-[var(--accent)] mb-1">{event.date} - {event.title}</p><p className="text-[var(--text-secondary)]">{event.description}</p></div></div></AnimatedSection>))}</div></div></div></section>);
    const GUISkills = () => (<section id="skills" className="py-20 bg-[var(--background)]"><div className="container mx-auto px-4 sm:px-6 lg:px-8"><AnimatedSection><div className="text-center mb-16"><h2 className="text-3xl font-bold text-[var(--text-main)]">Habilidades Técnicas</h2><div className="w-24 h-1 bg-[var(--accent)] mx-auto mt-2"></div></div></AnimatedSection><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><AnimatedSection delay={200}><div className="bg-[var(--card)] p-8 rounded-lg shadow-lg h-full border border-[var(--border)]"><h3 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center md:text-left">Redes e Infraestrutura</h3><div className="flex flex-wrap gap-x-2 gap-y-4 justify-center md:justify-start">{skillsData.redes.map(skill => <SkillBadge key={skill.name} skill={skill} />)}</div></div></AnimatedSection><AnimatedSection delay={400}><div className="bg-[var(--card)] p-8 rounded-lg shadow-lg h-full border border-[var(--border)]"><h3 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center md:text-left">Desenvolvimento Web</h3><div className="flex flex-wrap gap-x-2 gap-y-4 justify-center md:justify-start">{skillsData.web.map(skill => <SkillBadge key={skill.name} skill={skill} />)}</div></div></AnimatedSection></div></div></section>);
    const GUIProjectCard = ({ project, onOpenModal }: { project: any; onOpenModal: (project: any) => void; }) => (<div className="bg-[var(--card)] rounded-lg p-6 flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-xl hover:shadow-[var(--accent)]/10 group border border-[var(--border)]"><div className="relative mb-4 overflow-hidden rounded-md aspect-video bg-[var(--background)]"><img src={project.gifUrl} alt={`Demonstração do projeto ${project.title}`} className="w-full h-full object-cover"/></div><h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{project.title}</h3><p className="text-[var(--text-secondary)] mb-4 flex-grow">{project.description}</p><div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between"><button onClick={() => onOpenModal(project)} className="text-sm font-semibold text-[var(--accent)] hover:underline">Ver detalhes</button><div className="flex items-center gap-4"><a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"><Github size={20} /></a>{project.liveUrl && project.liveUrl !== "#" && (<a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>)}</div></div></div>);
    const GUIProjects = () => { const [activeFilter, setActiveFilter] = useState('Todos'); const projectCategories = ['Todos', 'Full-Stack', 'Automação & Redes']; const filteredProjects = activeFilter === 'Todos' ? userProjects : userProjects.filter(p => p.category === activeFilter); return (<section id="projects" className="py-20 bg-[var(--background)]"><div className="container mx-auto px-4 sm:px-6 lg:px-8"><AnimatedSection><div className="text-center mb-8"><h2 className="text-3xl font-bold text-[var(--text-main)]">Projetos</h2><div className="w-24 h-1 bg-[var(--accent)] mx-auto mt-2"></div></div></AnimatedSection><AnimatedSection delay={150}><div className="flex justify-center flex-wrap gap-2 mb-12">{projectCategories.map(cat => (<button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${activeFilter === cat ? 'bg-[var(--accent)] text-[var(--text-main)] border-[var(--accent)]' : 'bg-[var(--card)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--border)]'}`}>{cat}</button>))}</div></AnimatedSection><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">{filteredProjects.map((project, index) => (<AnimatedSection key={project.id} delay={index * 100}><GUIProjectCard project={project} onOpenModal={setSelectedProject} /></AnimatedSection>))}</div></div></section>); };
    const GUIContact = () => (<section id="contact" className="py-20 bg-[var(--background)]"><AnimatedSection><div className="container mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-12"><h2 className="text-3xl font-bold text-[var(--text-main)]">Contato</h2><div className="w-24 h-1 bg-[var(--accent)] mx-auto mt-2"></div><p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto">Pronto para construir algo incrível? Vamos conversar.</p></div><div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center"><div className="w-full md:w-2/3"><form action="mailto:klayver.alencar@hotmail.com" method="post" encType="text/plain" className="space-y-4"><input type="text" name="name" placeholder="Seu nome" required className="w-full bg-[var(--card)] border border-[var(--border)] rounded-md p-3 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow" /><input type="email" name="email" placeholder="Seu e-mail" required className="w-full bg-[var(--card)] border border-[var(--border)] rounded-md p-3 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow" /><textarea name="message" rows={5} placeholder="Sua mensagem" required className="w-full bg-[var(--card)] border border-[var(--border)] rounded-md p-3 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"></textarea><button type="submit" className="w-full bg-[var(--accent)] text-white font-bold py-3 px-6 rounded-lg hover:bg-[var(--accent-2)] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transform hover:scale-105"><Send size={18} /> Enviar Mensagem</button></form></div><div className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-5"><h3 className="text-xl text-[var(--text-main)] font-semibold">Ou me encontre em:</h3><a href="mailto:klayver.alencar@hotmail.com" className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-lg"><Mail size={24} /> <span>E-mail</span></a><a href="https://www.linkedin.com/in/klayveralencar/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-lg"><Linkedin size={24} /> <span>LinkedIn</span></a><a href="https://github.com/klayver2001" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-lg"><Github size={24} /> <span>GitHub</span></a></div></div></div></AnimatedSection></section>);
    const GUIFooter = () => (<footer className="bg-[var(--card)] border-t border-[var(--border)] py-6"><div className="container mx-auto text-center text-[var(--text-secondary)] px-4"><p>&copy; {new Date().getFullYear()} Klayver Alencar.</p><button onClick={onSwitchToCli} className="text-sm mt-2 flex items-center gap-2 mx-auto hover:text-[var(--accent)] transition-colors"><TerminalIcon size={14}/> Acessar KlayverOS</button></div></footer>);
    const GUIScrollToTop = () => {const [isVisible, setIsVisible] = useState(false);useEffect(() => {const toggleVisibility = () => {if (window.scrollY > 300) setIsVisible(true);else setIsVisible(false);};window.addEventListener('scroll', toggleVisibility);return () => window.removeEventListener('scroll', toggleVisibility);}, []);const scrollToTop = () => {window.scrollTo({ top: 0, behavior: 'smooth' });};return (<button onClick={scrollToTop} className={`fixed bottom-5 right-5 p-3 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] transition-all duration-300 z-50 shadow-2xl ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} aria-label="Voltar ao topo"><ArrowUpCircle size={24} /></button>);};

    return (
        <div className="antialiased transition-colors duration-300 bg-[var(--background)] min-h-screen w-full overflow-x-hidden">
            <AuroraBackground />
            <div className="relative z-10">
                <GUIHeader />
                <main>
                    <GUIHero />
                    <GUIAbout />
                    <GUIProjects />
                    <GUISkills />
                    <GUIContact />
                </main>
                {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
                <GUIFooter />
                <GUIScrollToTop />
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL QUE GERENCIA AS VISÕES ---
export default function App() {
    const [view, setView] = useState<'cli' | 'gui'>('gui');
    const [modalProject, setModalProject] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    // Estado de tema global para passar para GraphicalPortfolio
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem('theme');
            if (saved === 'dark' || saved === 'light') return saved;
        }
        return 'light';
    });
    useEffect(() => { setIsMounted(true); }, []);

    const handleOpenProjectFromCli = (projectId: string) => {
        const project = userProjects.find(p => p.id === projectId);
        if (project) {
            setView('gui');
            setTimeout(() => setModalProject(project), 100);
        }
    };
    
    const openProjectInGui = (project: any) => {
        setModalProject(project);
    };

    if (!isMounted) return null;
    return (
      <>
        {view === 'gui' && (
            <GraphicalPortfolio 
                onSwitchToCli={() => setView('cli')}
                onOpenProject={openProjectInGui}
                theme={theme}
                setTheme={setTheme}
            />
        )}
        {view === 'cli' && (
            <KlayverOS 
                onSwitchToGui={() => setView('gui')} 
                onOpenProject={handleOpenProjectFromCli}
            />
        )}
        {modalProject && view === 'gui' && (
            <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
        )}
      </>
    );
}
