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
      api_error_label: 'Ocorreu um erro ao buscar a análise.',
      /* Additional merged keys from other pages (contatos, sintomas-graves, adult triage, GOB, medicamentos) */
      'contatos.titulo': 'Contato e Suporte',
      'mission.tagline': '"Levando cura e esperança aos confins da Terra"',
      'contact.how_to_contact': 'Como entrar em contato',
      'whatsapp.emergency_title': 'Contato de Emergência',
      'whatsapp.desc': 'Apenas para casos graves e urgentes.',
      'whatsapp.emergency_btn': 'Abrir WhatsApp de Emergência',
      'whatsapp.offline_title': 'Você está offline. Para emergências:',
      'whatsapp.offline_info_label': 'Ligue para:',
      'whatsapp.copy_btn': 'Copiar Número',
      'email.title': 'Email Geral',
      'email.desc': 'Para dúvidas, sugestões e informações gerais.',
      'social.title': 'Siga-nos nas redes sociais',
      'social.offline_info': 'Conecte-se conosco quando estiver online para receber encorajamento e notícias.',
      'feedback.close_button': 'Fechar',
      'nav.home': 'Início',
      'offline.indicator': 'Modo Offline',
      'offline.mode_alert': 'Modo Offline ativado. Algumas funcionalidades podem estar limitadas.',
      // sintomas-graves keys
      'sintomas.pageTitle': 'Sintomas Graves - MissionCare Plus',
      'sintomas.headerTitle': 'Informação de Segurança',
      'sintomas.mainTitle': 'Quando NÃO usar o MissionCare Plus',
      'sintomas.subtitle': 'O avaliador de sintomas não é adequado se você tiver:',
      'sintomas.symptom1': "Qualquer <strong class='font-semibold'>dor forte ou apertada no peito</strong>, especialmente se associada a palidez ou suor (isto pode ser indicativo de um ataque cardíaco).",
      'sintomas.symptom2': "<strong class='font-semibold'>Queda de um lado do rosto</strong> e/ou fraqueza nos braços ou dificuldade para falar.",
      'sintomas.symptom3': "Súbito início de <strong class='font-semibold'>confusão, sonolência ou desorientação</strong>.",
      'sintomas.symptom4': "Grave <strong class='font-semibold'>dificuldade em respirar</strong>.",
      'sintomas.symptom5': "Qualquer <strong class='font-semibold'>sangramento não controlado</strong>.",
      'sintomas.symptom6': "<strong class='font-semibold'>Convulsões</strong>.",
      'sintomas.symptom7': "<strong class='font-semibold'>Inchaço rápido e repentino</strong> de qualquer parte do rosto ou corpo.",
      'sintomas.symptom8': "Se você está <strong class='font-semibold'>pensando em se machucar</strong> ou acabar com sua vida.",
      'sintomas.symptom9': "<strong class='font-semibold'>Queimaduras e ferimentos graves</strong>, como após um acidente.",
      'sintomas.finalWarning': 'Se você tiver algum destes sintomas, ligue para o número de emergência local ou visite a unidade de saúde mais próxima.',
      'sintomas.navBack': 'Voltar',
      'sintomas.navHome': 'Início',
      'sintomas.emergencyNumbers': 'Números de Emergência:',
      'sintomas.offline.mode': 'Modo Offline ativado. Informações de emergência estão disponíveis abaixo.',
      // GOB and adult/anamnese merged keys
      'gob.app_title': 'Triagem Gineco-Obstetrícia (GOB) — MissionCare Plus',
      'gob.main_title': 'Triagem Gineco-Obstetrícia',
      'gob.subtitle': 'Ferramenta de apoio à decisão. <strong>Não substitui uma consulta médica.</strong>',
      'gob.select_profile_title': '1. Selecione o Perfil da Paciente',
      'gob.profile_gestante': 'Gestante',
      'gob.profile_puerpera': 'Puérpera',
      'gob.profile_puerpera_subtitle': '(até 42 dias pós-parto)',
      'gob.profile_nao_gravida': 'Não Grávida',
      'gob.card_profile': 'Perfil',
      'gob.card_gestational_age': 'Idade Gestacional',
      'gob.change_profile': 'Trocar Perfil',
      'gob.vitals_title': 'Sinais Vitais (Opcional)',
      'gob.symptoms_title': 'Sinais e Sintomas de Alerta',
      'gob.analyze_button': 'Analisar Sinais',
      'gob.result_advice_title': 'Aconselhamento e Plano de Ação:',
      'gob.emergency_button': '🚨 COMUNICAR EMERGÊNCIA',
      // adult anamnesis
      'adult.pageTitle': 'Anamnese Simplificada - MissionCare Plus',
      'adult.headerTitle': 'Anamnese Adulto',
      'adult.emergencyWarning': 'ATENÇÃO: EM CASO DE EMERGÊNCIA, PROCURE AJUDA IMEDIATAMENTE.',
      'adult.q1Title': '1. Qual o principal problema ou sintoma?',
      'adult.q1Placeholder': 'Ex: Dor de cabeça forte, febre alta...',
      'adult.q2Title': '2. Quando exatamente os sintomas começaram?',
      'adult.q2Placeholder': 'Ex: Há 3 dias, ontem à noite',
      'adult.q3Title': '3. Os sintomas estão melhorando, piorando ou iguais?',
      'adult.q3Opt1': 'Melhorando',
      'adult.q3Opt2': 'Piorando',
      'adult.q3Opt3': 'Permanecem Iguais',
      'adult.resultsTitle': 'Recomendações da Análise',
      // medicamentos page small keys
      'medicamentos.titulo': 'Guia de Medicamentos',
      'medicamentos.main.title': 'Medicamentos Essenciais em Campo',
      'medicamentos.main.subtitle': 'Guia de referência para adultos.',
      'disclaimer.title': '⚠️ AVISO IMPORTANTE SOBRE O USO DE MEDICAMENTOS',
      'disclaimer.subtitle': 'DECLARAÇÃO DE ISENÇÃO DE RESPONSABILIDADE',
      'disclaimer.p1': 'As informações contidas nesta página destinam-se exclusivamente a profissionais de saúde devidamente capacitados e atuantes em missões médicas e contextos clínicos supervisionados.',
      'disclaimer.p2': 'O uso inadequado de medicamentos pode resultar em efeitos adversos graves, intoxicações, falhas terapêuticas, agravamento de quadros clínicos ou até óbito.',
      'disclaimer.accept_button': 'Concordo e Continuar',
      'update.checking': 'Verificando atualizações...',
      'update.success': 'Dados atualizados com sucesso!',
      'update.error': 'Erro ao atualizar dados. Tente novamente mais tarde.',
      'update.offline': 'Você está offline. Conecte-se à internet para atualizar.',
      'justificativa.label': 'Justificativa:',
      'dose_pediatrica.label': 'Dose Pediátrica:'
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
      api_error_label: 'An error occurred while fetching the analysis.',
      /* Merged additional keys for English */
      'contatos.titulo': 'Contact and Support',
      'mission.tagline': '"Bringing healing and hope to the ends of the Earth"',
      'contact.how_to_contact': 'How to contact us',
      'whatsapp.emergency_title': 'Emergency Contact',
      'whatsapp.desc': 'For severe and urgent cases only.',
      'whatsapp.emergency_btn': 'Open Emergency WhatsApp',
      'whatsapp.offline_title': 'You are offline. For emergencies:',
      'whatsapp.offline_info_label': 'Call:',
      'whatsapp.copy_btn': 'Copy Number',
      'email.title': 'General Email',
      'email.desc': 'For questions, suggestions, and general information.',
      'social.title': 'Follow us on social media',
      'social.offline_info': 'Connect with us when you are online to receive encouragement and news.',
      'feedback.close_button': 'Close',
      'nav.home': 'Home',
      'offline.indicator': 'Offline Mode',
      'offline.mode_alert': 'Offline mode activated. Some features may be limited.',
      // sintomas-graves
      'sintomas.pageTitle': 'Severe Symptoms - MissionCare Plus',
      'sintomas.headerTitle': 'Safety Information',
      'sintomas.mainTitle': 'When NOT to use MissionCare Plus',
      'sintomas.subtitle': 'The symptom checker is not suitable if you have:',
      'sintomas.symptom1': "Any <strong class='font-semibold'>severe or squeezing chest pain</strong>, especially if associated with paleness or sweating (this may indicate a heart attack).",
      'sintomas.symptom2': "<strong class='font-semibold'>Drooping of one side of the face</strong> and/or weakness in the arms or difficulty speaking.",
      'sintomas.symptom3': "Sudden onset of <strong class='font-semibold'>confusion, drowsiness or disorientation</strong>.",
      'sintomas.symptom4': "Severe <strong class='font-semibold'>difficulty breathing</strong>.",
      'sintomas.symptom5': "Any <strong class='font-semibold'>uncontrolled bleeding</strong>.",
      'sintomas.symptom6': "<strong class='font-semibold'>Seizures</strong>.",
      'sintomas.symptom7': "<strong class='font-semibold'>Rapid and sudden swelling</strong> of any part of the face or body.",
      'sintomas.symptom8': "If you are <strong class='font-semibold'>thinking of harming yourself</strong> or ending your life.",
      'sintomas.symptom9': "<strong class='font-semibold'>Severe burns and injuries</strong>, such as after an accident.",
      'sintomas.finalWarning': 'If you have any of these symptoms, call your local emergency number or visit the nearest health unit.',
      // GOB / adult / meds
      'gob.app_title': 'Obstetric & Gynecological Triage — MissionCare Plus',
      'gob.main_title': 'Obstetric & Gynecological Triage',
      'gob.subtitle': 'Decision support tool. <strong>Does not replace a medical consultation.</strong>',
      'gob.select_profile_title': '1. Select Patient Profile',
      'gob.profile_gestante': 'Pregnant',
      'gob.profile_puerpera': 'Postpartum',
      'gob.profile_puerpera_subtitle': '(up to 42 days postpartum)',
      'adult.pageTitle': 'Simplified Anamnesis - MissionCare Plus',
      'adult.headerTitle': 'Adult Anamnesis',
      'adult.emergencyWarning': 'ATTENTION: IN CASE OF EMERGENCY, SEEK HELP IMMEDIATELY.',
      'adult.q1Title': '1. What is the main problem or symptom?',
      'adult.q1Placeholder': 'E.g.: Severe headache, high fever...',
      'medicamentos.titulo': 'Medication Guide',
      'medicamentos.main.title': 'Essential Field Medications',
      'medicamentos.main.subtitle': 'Reference guide for adults.',
      'disclaimer.title': '⚠️ IMPORTANT DISCLAIMER REGARDING MEDICATION USE',
      'disclaimer.subtitle': 'DISCLAIMER STATEMENT',
      'disclaimer.accept_button': 'Agree and Continue',
      'update.checking': 'Checking for updates...',
      'update.success': 'Data updated successfully!',
      'update.error': 'Error updating data. Please try again later.',
      'update.offline': 'You are offline. Connect to the internet to update.',
      'justificativa.label': 'Justification:',
      'dose_pediatrica.label': 'Pediatric Dose:'
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
      api_error_label: 'Ocurrió un error al obtener el análisis.',
      /* Merged additional keys for Spanish */
      'contatos.titulo': 'Contacto y Soporte',
      'mission.tagline': '"Llevando sanación y esperanza hasta los confines de la Tierra"',
      'contact.how_to_contact': 'Cómo contactarnos',
      'whatsapp.emergency_title': 'Contacto de Emergencia',
      'whatsapp.desc': 'Solo para casos graves y urgentes.',
      'whatsapp.emergency_btn': 'Abrir WhatsApp de Emergencia',
      'whatsapp.offline_title': 'Estás desconectado. Para emergencias:',
      'whatsapp.offline_info_label': 'Llame a:',
      'whatsapp.copy_btn': 'Copiar Número',
      'email.title': 'Correo General',
      'email.desc': 'Para dudas, sugerencias e información general.',
      'social.title': 'Síganos en redes sociales',
      'social.offline_info': 'Conéctese con nosotros cuando esté en línea para recibir aliento y noticias.',
      'feedback.close_button': 'Cerrar',
      'nav.home': 'Inicio',
      'offline.indicator': 'Modo Offline',
      'offline.mode_alert': 'Modo sin conexión activado. Algunas funcionalidades pueden estar limitadas.',
      // sintomas-graves
      'sintomas.pageTitle': 'Síntomas Graves - MissionCare Plus',
      'sintomas.headerTitle': 'Información de Seguridad',
      'sintomas.mainTitle': 'Cuándo NO usar MissionCare Plus',
      'sintomas.subtitle': 'El evaluador de síntomas no es adecuado si usted tiene:',
      'sintomas.symptom1': "Cualquier <strong class='font-semibold'>dolor fuerte u opresivo en el pecho</strong>, especialmente si se asocia con palidez o sudor (esto puede ser indicativo de un ataque cardíaco).",
      'sintomas.symptom2': "<strong class='font-semibold'>Caída de un lado de la cara</strong> y/o debilidad en los brazos o dificultad para hablar.",
      'sintomas.symptom3': "Inicio súbito de <strong class='font-semibold'>confusión, somnolencia o desorientación</strong>.",
      'sintomas.symptom4': "Grave <strong class='font-semibold'>dificultad para respirar</strong>.",
      'sintomas.symptom5': "Cualquier <strong class='font-semibold'>sangrado no controlado</strong>.",
      'sintomas.symptom6': "<strong class='font-semibold'>Convulsiones</strong>.",
      'sintomas.symptom7': "<strong class='font-semibold'>Hinchazón rápida y repentina</strong> de cualquier parte de la cara o el cuerpo.",
      'sintomas.symptom8': "Si está <strong class='font-semibold'>pensando en hacerse daño</strong> o terminar con su vida.",
      'sintomas.symptom9': "<strong class='font-semibold'>Quemaduras y heridas graves</strong>, como después de un accidente.",
      'sintomas.finalWarning': 'Si tiene alguno de estos síntomas, llame al número de emergencia local o visite el centro de salud más cercano.',
      // GOB/adult/meds
      'gob.app_title': 'Triaje Obstétrico y Ginecológico — MissionCare Plus',
      'gob.main_title': 'Triaje Obstétrico y Ginecológico',
      'gob.subtitle': 'Herramienta de apoyo a la decisión. <strong>No reemplaza una consulta médica.</strong>',
      'adult.pageTitle': 'Anamnesis Simplificada - MissionCare Plus',
      'adult.headerTitle': 'Anamnesis Adulto',
      'adult.emergencyWarning': 'ATENCIÓN: EN CASO DE EMERGENCIA, BUSQUE AYUDA INMEDIATAMENTE.',
      'medicamentos.titulo': 'Guía de Medicamentos',
      'medicamentos.main.title': 'Medicamentos Esenciales en Campo',
      'medicamentos.main.subtitle': 'Guía de referencia para adultos.',
      'disclaimer.title': '⚠️ AVISO IMPORTANTE SOBRE EL USO DE MEDICAMENTOS',
      'disclaimer.subtitle': 'DECLARACIÓN DE EXENCIÓN DE RESPONSABILIDAD',
      'disclaimer.accept_button': 'Acepto y Continuar',
      'update.checking': 'Verificando actualizaciones...',
      'update.success': '¡Datos actualizados con éxito!',
      'update.error': 'Error al actualizar datos. Inténtelo de nuevo más tarde.',
      'update.offline': 'Estás offline. Conéctese a internet para actualizar.',
      'justificativa.label': 'Justificación:',
      'dose_pediatrica.label': 'Dosis Pediátrica:'
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
