/* Shared translator for MissionCare Plus
   Exposes: window.Translator.init(options)
   Populates window.translations and window.currentLang
   Provides window.applyTranslations(lang) for compatibility
*/
(function(){
  const translations = {
    pt: {
      /* from index */
      emergencyAlertTitle:"Aviso Importante",
      emergencyAlertText:"Se você estiver apresentando <a href='sintomas-graves.html' class='font-bold text-red-600 underline hover:text-red-700'>SINTOMAS GRAVES</a>, não use o MissionCare Plus. Em vez disso, entre em contato com os serviços de emergência.",
      disclaimerTitle:"AVISO DE RESPONSABILIDADE",
      disclaimerP1:"O MissionCare Plus é uma ferramenta de apoio educacional. As informações aqui contidas <strong>não substituem</strong> uma consulta médica.",
      disclaimerP2:"Em caso de emergência, procure ajuda médica imediatamente.",
      mainTitle:"MissionCare Plus",
      subtitle:'"Levando cura e esperança aos confins da Terra"',
      criticalActions:"Ações Críticas",
      emergenciesTitle:"Guia de Emergências",
      emergenciesDesc:"Primeiros socorros e orientação rápida.",
      mainAttention:"Atenção Principal e Ferramentas",
      adultsTitle:"ATENÇÃO ADULTOS",
      adultsDesc:"Avalie sintomas e receba orientação.",
      pediatricsTitle:"ATENÇÃO PEDIATRIA",
      pediatricsDesc:"Cuidado especializado para crianças.",
      gobTitle: "ATENÇÃO OBSTETRÍCIA",
      gobDesc: "Triagem e suporte para Ginecologia e Obstetrícia.",
      meds:"MEDICAMENTOS",
      onlineContent:"Conteúdo atualizado disponível online",
      offlineContent:"Versão básica offline disponível",
      navHome:"Início",
      navEmergencies:"Emergências",
      navContact:"Contato",
      /* from pediatrics page */
      pageTitle: 'Triagem Pediátrica - MissionCare Plus',
      headerTitle: 'Triagem Pediátrica',
      step0_section_title: '1. Dados da Criança',
      step0_subtitle: 'Comece com as informações básicas.',
      step0_age_label: 'Qual a idade da criança?',
      child_age_placeholder: 'Ex: 2 anos, 6 meses',
      sexo_label: 'Qual o sexo da criança?',
      male: 'Masculino',
      female: 'Feminino',
      step1_section_title: '2. Queixa Principal',
      chief_complaint_label: 'Descreva a queixa principal:',
      chief_complaint_placeholder: 'Ex: Febre, tosse, dor de barriga...',
      history_label: 'Descreva a história da doença:',
      history_placeholder: 'Ex: Começou ontem com febre de 38.5°C, tosse seca e não quer comer.',
      step2_section_title: '3. Sinais Vitais (Opcional)',
      label_temperature: 'Temperatura (°C)',
      placeholder_temperature: 'Ex: 38.5',
      label_hr: 'FC (bpm)',
      placeholder_hr: 'Ex: 120',
      label_rr: 'FR (irpm)',
      placeholder_rr: 'Ex: 40',
      label_spo2: 'Sat O₂ (%)',
      placeholder_spo2: 'Ex: 98',
      step3_section_title: '4. Avaliação Geral',
      legend_general_state: 'Estado Geral',
      state_good: 'Bom',
      state_regular: 'Regular',
      state_poor: 'Ruim',
      legend_consciousness: 'Nível de Consciência',
      conscious_alert: 'Alerta',
      conscious_drowsy: 'Sonolento',
      conscious_irritable: 'Irritado',
      step4_section_title: '5. Informações Adicionais',
      observations_label: 'Observações adicionais relevantes?',
      observations_placeholder: 'Ex: Moleira alta, pele com manchas, recusa líquidos...',
      results_title: 'Análise Preliminar',
      urgency_low_label: 'Baixo Risco',
      urgency_medium_label: 'Risco Moderado',
      urgency_high_label: 'Urgência Alta',
      no_info_available: 'Nenhuma informação disponível.',
      ai_default_evaluation: 'Avaliação geral da IA.',
      recommended_conduct: 'Conduta Recomendada',
      worsening_signs: 'Sinais de Piora a Observar',
      severity_signs: 'Sinais de Gravidade Identificados',
      submit_btn_text: 'Gerar Análise',
      restart_btn_text: 'Nova Avaliação',
      analyzing_feedback: 'Analisando informações... Isso pode levar alguns segundos.',
      api_error_label: 'Ocorreu um erro ao buscar a análise.'
    },
    en: {
      /* from index */
      emergencyAlertTitle:"Important Notice",
      emergencyAlertText:"If you are experiencing <a href='sintomas-graves.html' class='font-bold text-red-600 underline hover:text-red-700'>SEVERE SYMPTOMS</a>, do not use MissionCare Plus. Instead, contact emergency services.",
      disclaimerTitle:"DISCLAIMER",
      disclaimerP1:"MissionCare Plus is an educational support tool. The information herein <strong>does not replace</strong> a medical consultation.",
      disclaimerP2:"In case of emergency, seek medical help immediately.",
      mainTitle:"MissionCare Plus",
      subtitle:'"Bringing healing and hope to the ends of the Earth"',
      criticalActions:"Critical Actions",
      emergenciesTitle:"Emergency Guide",
      emergenciesDesc:"First aid and quick guidance.",
      mainAttention:"Main Care and Tools",
      adultsTitle:"ADULT CARE",
      adultsDesc:"Evaluate symptoms and receive guidance.",
      pediatricsTitle:"PEDIATRIC CARE",
      pediatricsDesc:"Specialized care for children.",
      gobTitle: "OBSTETRIC CARE",
      gobDesc: "Triage and support for Gynecology & Obstetrics.",
      meds:"MEDICATIONS",
      onlineContent:"Updated content available online",
      offlineContent:"Basic offline version available",
      navHome:"Home",
      navEmergencies:"Emergencies",
      navContact:"Contact",
      /* from pediatrics */
      pageTitle: 'Pediatric Triage - MissionCare Plus',
      headerTitle: 'Pediatric Triage',
      step0_section_title: '1. Child Information',
      step0_subtitle: 'Start with basic information.',
      step0_age_label: "What is the child's age?",
      child_age_placeholder: 'E.g.: 2 years, 6 months',
      sexo_label: "What is the child's sex?",
      male: 'Male',
      female: 'Female',
      step1_section_title: '2. Chief Complaint',
      chief_complaint_label: 'Describe the chief complaint:',
      chief_complaint_placeholder: 'E.g.: Fever, cough, abdominal pain...',
      history_label: 'Describe the history of the illness:',
      history_placeholder: 'E.g.: Started yesterday with a 38.5°C fever, dry cough and poor intake.',
      step2_section_title: '3. Vital Signs (Optional)',
      label_temperature: 'Temperature (°C)',
      placeholder_temperature: 'E.g.: 38.5',
      label_hr: 'HR (bpm)',
      placeholder_hr: 'E.g.: 120',
      label_rr: 'RR (rpm)',
      placeholder_rr: 'E.g.: 40',
      label_spo2: 'SpO₂ (%)',
      placeholder_spo2: 'E.g.: 98',
      step3_section_title: '4. General Assessment',
      legend_general_state: 'General State',
      state_good: 'Good',
      state_regular: 'Fair',
      state_poor: 'Poor',
      legend_consciousness: 'Level of Consciousness',
      conscious_alert: 'Alert',
      conscious_drowsy: 'Drowsy',
      conscious_irritable: 'Irritable',
      step4_section_title: '5. Additional Information',
      observations_label: 'Any relevant additional observations?',
      observations_placeholder: 'E.g.: Soft spot bulging, skin mottling, refusing fluids...',
      results_title: 'Preliminary Analysis',
      urgency_low_label: 'Low Risk',
      urgency_medium_label: 'Moderate Risk',
      urgency_high_label: 'High Urgency',
      no_info_available: 'No information available.',
      ai_default_evaluation: 'General AI evaluation.',
      recommended_conduct: 'Recommended Conduct',
      worsening_signs: 'Signs of Worsening to Watch',
      severity_signs: 'Identified Severity Signs',
      submit_btn_text: 'Generate Analysis',
      restart_btn_text: 'New Assessment',
      analyzing_feedback: 'Analyzing information... This may take a few seconds.',
      api_error_label: 'An error occurred while fetching the analysis.'
    },
    es: {
      /* from index */
      emergencyAlertTitle:"Aviso Importante",
      emergencyAlertText:"Si está presentando <a href='sintomas-graves.html' class='font-bold text-red-600 underline hover:text-red-700'>SÍNTOMAS GRAVES</a>, no use MissionCare Plus. En su lugar, contacte a los servicios de emergencia.",
      disclaimerTitle:"AVISO DE RESPONSABILIDAD",
      disclaimerP1:"MissionCare Plus es una herramienta de apoyo educativo. La información aquí contenida <strong>no reemplaza</strong> una consulta médica.",
      disclaimerP2:"En caso de emergencia, busque ayuda médica de inmediato.",
      mainTitle:"MissionCare Plus",
      subtitle:'"Llevando sanación y esperanza hasta los confines de la Tierra"',
      criticalActions:"Acciones Críticas",
      emergenciesTitle:"Guía de Emergencias",
      emergenciesDesc:"Primeros auxilios y orientación rápida.",
      mainAttention:"Atención Principal y Herramientas",
      adultsTitle:"ATENCIÓN ADULTOS",
      adultsDesc:"Evalúe síntomas y reciba orientación.",
      pediatricsTitle:"ATENCIÓN PEDIATRIA",
      pediatricsDesc:"Cuidado especializado para niños.",
      gobTitle: "ATENCIÓN OBSTETRICIA",
      gobDesc: "Triaje y soporte para Ginecología y Obstetricia.",
      meds:"MEDICAMENTOS",
      onlineContent:"Contenido actualizado disponible en línea",
      offlineContent:"Versão básica sin conexión disponible",
      navHome:"Inicio",
      navEmergencies:"Emergencias",
      navContact:"Contacto",
      /* from pediatrics */
      pageTitle: 'Triaje Pediátrico - MissionCare Plus',
      headerTitle: 'Triaje Pediátrico',
      step0_section_title: '1. Datos del Niño',
      step0_subtitle: 'Comience con la información básica.',
      step0_age_label: '¿Cuál es la edad del niño?',
      child_age_placeholder: 'Ej.: 2 años, 6 meses',
      sexo_label: '¿Cuál es el sexo del niño?',
      male: 'Masculino',
      female: 'Femenino',
      step1_section_title: '2. Queja Principal',
      chief_complaint_label: 'Describa la queja principal:',
      chief_complaint_placeholder: 'Ej.: Fiebre, tos, dolor abdominal...',
      history_label: 'Describa la historia de la enfermedad:',
      history_placeholder: 'Ej.: Comenzó ayer con fiebre de 38.5°C, tos seca y rechazo a los líquidos.',
      step2_section_title: '3. Signos Vitales (Opcional)',
      label_temperature: 'Temperatura (°C)',
      placeholder_temperature: 'Ej.: 38.5',
      label_hr: 'FC (lpm)',
      placeholder_hr: 'Ej.: 120',
      label_rr: 'FR (rpm)',
      placeholder_rr: 'Ej.: 40',
      label_spo2: 'Sat O₂ (%)',
      placeholder_spo2: 'Ej.: 98',
      step3_section_title: '4. Evaluación General',
      legend_general_state: 'Estado General',
      state_good: 'Bueno',
      state_regular: 'Regular',
      state_poor: 'Malo',
      legend_consciousness: 'Nivel de Conciencia',
      conscious_alert: 'Alerta',
      conscious_drowsy: 'Somnoliento',
      conscious_irritable: 'Irritable',
      step4_section_title: '5. Información Adicional',
      observations_label: '¿Observaciones adicionales relevantes?',
      observations_placeholder: 'Ej.: Fontanela abultada, piel con manchas, rechazo a líquidos...',
      results_title: 'Análisis Preliminar',
      urgency_low_label: 'Bajo Riesgo',
      urgency_medium_label: 'Riesgo Moderado',
      urgency_high_label: 'Urgencia Alta',
      no_info_available: 'No hay información disponible.',
      ai_default_evaluation: 'Evaluación general de la IA.',
      recommended_conduct: 'Conducta Recomendada',
      worsening_signs: 'Signos de Empeoramiento a Observar',
      severity_signs: 'Signos de Gravedad Identificados',
      submit_btn_text: 'Generar Análisis',
      restart_btn_text: 'Nueva Evaluación',
      analyzing_feedback: 'Analizando la información... Esto puede tardar unos segundos.',
      api_error_label: 'Ocurrió un error al obtener el análisis.'
    }
  };

  function normalizeCode(code){
    if(!code) return 'pt';
    code = String(code).toLowerCase();
    if(code.startsWith('pt')) return 'pt';
    if(code.startsWith('es')) return 'es';
    if(code.startsWith('en')) return 'en';
    return 'pt';
  }

  function applyTranslations(lang){
    const code = normalizeCode(lang);
    const dict = translations[code] || translations['pt'];
    // update elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = dict[key] || '';
      if(!txt) return;
      const tag = el.tagName.toUpperCase();
      if(tag === 'INPUT' || tag === 'TEXTAREA'){
        el.placeholder = txt;
      } else if(tag === 'TITLE'){
        document.title = txt;
        el.textContent = txt;
      } else {
        el.innerHTML = txt;
      }
    });
    // set html lang attribute if possible
    const htmlRoot = document.getElementById('html-lang') || document.documentElement;
    htmlRoot.setAttribute('lang', code === 'pt' ? 'pt-BR' : (code === 'es' ? 'es' : 'en'));
    // update .lang-btn selected state by data-lang or id
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const raw = btn.dataset.lang || btn.getAttribute('data-lang') || btn.id || '';
      const btnCode = normalizeCode(raw);
      btn.classList.toggle('selected', btnCode === code);
      // for index page style
      btn.classList.toggle('active', btn.id === `lang-${code}`);
      btn.classList.toggle('inactive', btn.id && btn.id !== `lang-${code}`);
    });
    window.currentLang = code;
    window.translations = translations;
  }

  function init(options){
    options = options || {};
    const storageKey = options.storageKey || 'lang';
    const defaultLang = options.defaultLang || 'pt';
    // attach to window for compatibility
    window.translations = translations;
    window.applyTranslations = applyTranslations;
    window.normalizeCode = normalizeCode;
    // wire lang buttons only if not already wired
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if(btn.dataset._translatorAttached) return;
      btn.dataset._translatorAttached = '1';
      btn.addEventListener('click', () => {
        const raw = btn.dataset.lang || btn.getAttribute('data-lang') || btn.id || '';
        const code = normalizeCode(raw);
        try { localStorage.setItem(storageKey, code); } catch(e) {}
        applyTranslations(code);
      });
    });
    // determine initial lang
    const stored = localStorage.getItem(storageKey);
    let initial = stored || normalizeCode(navigator.language || navigator.userLanguage || defaultLang);
    applyTranslations(initial);
  }

  // export
  window.Translator = {
    init,
    applyTranslations,
    normalizeCode,
    translations
  };
})();
