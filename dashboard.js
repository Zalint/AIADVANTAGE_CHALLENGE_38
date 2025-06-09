// Dashboard JavaScript
class DashboardApp {
    constructor() {
        this.user = null;
        this.currentLanguage = 'english';
        this.currentVibe = null;
        this.isGenerating = false;
        this.isQuotesVisible = false; // Track quotes visibility state
        this.clockInterval = null; // For real-time clock
        this.userLocation = null; // Cache user location
        
        // Initialize translations
        this.translations = {
            english: {
                dashboardTitle: "✨ Vibe Quotes",
                dashboardSubtitle: "Your Personal Quote Dashboard",
                signOut: "🚪 Sign Out",
                loadingDashboard: "Loading your dashboard...",
                quoteJourney: "📊 Your Quote Journey",
                totalQuotes: "Total Quotes",
                favoriteVibe: "Favorite Vibe",
                dayStreak: "Day Streak",
                chooseVibe: "🎭 Choose Your Vibe",
                chooseVibeDesc: "Click on a vibe card to generate an inspiring quote",
                recentQuotes: "📜 Recent Quotes",
                viewAll: "View All",
                hideQuotes: "Hide Quotes",
                copyQuote: "📋 Copy Quote",
                readAloud: "🔊 Read Aloud",
                generateAnother: "✨ Generate Another",
                craftingQuote: "Crafting your perfect quote...",
                noQuotes1: "🌟 No quotes yet!",
                noQuotes2: "Generate your first quote by clicking on a vibe above.",
                copy: "📋 Copy",
                speak: "🔊 Speak",
                copied: "✅ Copied!",
                speaking: "🔊 Speaking...",
                justNow: "Just now",
                minutesAgo: "m ago",
                hoursAgo: "h ago",
                daysAgo: "d ago",
                vibes: {
                    gratitude: "Gratitude",
                    resilience: "Resilience",
                    ambition: "Ambition",
                    creativity: "Creativity",
                    serenity: "Serenity",
                    courage: "Courage",
                    wisdom: "Wisdom",
                    joy: "Joy"
                },
                vibeDescriptions: {
                    gratitude: "Appreciate life's blessings",
                    resilience: "Bounce back stronger",
                    ambition: "Reach for the stars",
                    creativity: "Unleash your imagination",
                    serenity: "Find inner peace",
                    courage: "Face your fears",
                    wisdom: "Seek deeper understanding",
                    joy: "Celebrate life's moments"
                },
                // Preferences modal translations
                quoteCustomization: "Quote Customization",
                personalizeGeneration: "Personalize your quote generation",
                addPersonalContext: "Add Personal Context",
                shareWhatsOnMind: "Share what's on your mind to get more personalized quotes",
                characters: "characters",
                longerQuotes: "Longer Quotes",
                longerQuotesDesc: "Generate multi-sentence quotes with deeper insights",
                savePreferences: "Save Preferences",
                clearContext: "Clear Context"
            },
            french: {
                dashboardTitle: "✨ Citations Vibe",
                dashboardSubtitle: "Votre Tableau de Bord Personnel de Citations",
                signOut: "🚪 Se Déconnecter",
                loadingDashboard: "Chargement de votre tableau de bord...",
                quoteJourney: "📊 Votre Parcours de Citations",
                totalQuotes: "Total Citations",
                favoriteVibe: "Humeur Favorite",
                dayStreak: "Séries de Jours",
                chooseVibe: "🎭 Choisissez Votre Humeur",
                chooseVibeDesc: "Cliquez sur une carte d'humeur pour générer une citation inspirante",
                recentQuotes: "📜 Citations Récentes",
                viewAll: "Voir Tout",
                hideQuotes: "Masquer Citations",
                copyQuote: "📋 Copier Citation",
                readAloud: "🔊 Lire à Voix Haute",
                generateAnother: "✨ Générer Autre",
                craftingQuote: "Création de votre citation parfaite...",
                noQuotes1: "🌟 Aucune citation encore!",
                noQuotes2: "Générez votre première citation en cliquant sur une humeur ci-dessus.",
                copy: "📋 Copier",
                speak: "🔊 Parler",
                copied: "✅ Copié!",
                speaking: "🔊 En train de parler...",
                justNow: "À l'instant",
                minutesAgo: "m depuis",
                hoursAgo: "h depuis",
                daysAgo: "j depuis",
                vibes: {
                    gratitude: "Gratitude",
                    resilience: "Résilience",
                    ambition: "Ambition",
                    creativity: "Créativité",
                    serenity: "Sérénité",
                    courage: "Courage",
                    wisdom: "Sagesse",
                    joy: "Joie"
                },
                vibeDescriptions: {
                    gratitude: "Appréciez les bénédictions de la vie",
                    resilience: "Rebondissez plus fort",
                    ambition: "Atteignez les étoiles",
                    creativity: "Libérez votre imagination",
                    serenity: "Trouvez la paix intérieure",
                    courage: "Affrontez vos peurs",
                    wisdom: "Cherchez une compréhension plus profonde",
                    joy: "Célébrez les moments de la vie"
                },
                // Preferences modal translations
                quoteCustomization: "Personnalisation des Citations",
                personalizeGeneration: "Personnalisez votre génération de citations",
                addPersonalContext: "Ajouter un Contexte Personnel",
                shareWhatsOnMind: "Partagez ce qui vous préoccupe pour des citations plus personnalisées",
                characters: "caractères",
                longerQuotes: "Citations Plus Longues",
                longerQuotesDesc: "Générer des citations multi-phrases avec des insights plus profonds",
                savePreferences: "Sauvegarder les Préférences",
                clearContext: "Effacer le Contexte"
            },
            german: {
                dashboardTitle: "✨ Vibe Zitate",
                dashboardSubtitle: "Ihr Persönliches Zitate-Dashboard",
                signOut: "🚪 Abmelden",
                loadingDashboard: "Lade dein Dashboard...",
                quoteJourney: "📊 Deine Zitate-Reise",
                totalQuotes: "Gesamt Zitate",
                favoriteVibe: "Lieblings-Stimmung",
                dayStreak: "Tage-Serie",
                chooseVibe: "🎭 Wähle Deine Stimmung",
                chooseVibeDesc: "Klicke auf eine Stimmungskarte, um ein inspirierendes Zitat zu generieren",
                recentQuotes: "📜 Aktuelle Zitate",
                viewAll: "Alle Anzeigen",
                hideQuotes: "Zitate Verbergen",
                copyQuote: "📋 Zitat Kopieren",
                readAloud: "🔊 Vorlesen",
                generateAnother: "✨ Anderes Generieren",
                craftingQuote: "Erstelle dein perfektes Zitat...",
                noQuotes1: "🌟 Noch keine Zitate!",
                noQuotes2: "Generiere dein erstes Zitat, indem du oben auf eine Stimmung klickst.",
                copy: "📋 Kopieren",
                speak: "🔊 Sprechen",
                copied: "✅ Kopiert!",
                speaking: "🔊 Spreche...",
                justNow: "Gerade eben",
                minutesAgo: "Min. her",
                hoursAgo: "Std. her",
                daysAgo: "T. her",
                vibes: {
                    gratitude: "Dankbarkeit",
                    resilience: "Widerstandsfähigkeit",
                    ambition: "Ehrgeiz",
                    creativity: "Kreativität",
                    serenity: "Gelassenheit",
                    courage: "Mut",
                    wisdom: "Weisheit",
                    joy: "Freude"
                },
                vibeDescriptions: {
                    gratitude: "Schätze die Segnungen des Lebens",
                    resilience: "Komm stärker zurück",
                    ambition: "Greife nach den Sternen",
                    creativity: "Entfessle deine Vorstellungskraft",
                    serenity: "Finde inneren Frieden",
                    courage: "Stelle dich deinen Ängsten",
                    wisdom: "Suche tieferes Verständnis",
                    joy: "Feiere die Momente des Lebens"
                },
                // Preferences modal translations
                quoteCustomization: "Zitat-Anpassung",
                personalizeGeneration: "Personalisieren Sie Ihre Zitatgenerierung",
                addPersonalContext: "Persönlichen Kontext Hinzufügen",
                shareWhatsOnMind: "Teilen Sie mit, was Sie beschäftigt, für personalisiertere Zitate",
                characters: "Zeichen",
                longerQuotes: "Längere Zitate",
                longerQuotesDesc: "Mehrsätzige Zitate mit tieferen Einsichten generieren",
                savePreferences: "Einstellungen Speichern",
                clearContext: "Kontext Löschen"
            },
            spanish: {
                dashboardTitle: "✨ Citas Vibe",
                dashboardSubtitle: "Tu Panel Personal de Citas",
                signOut: "🚪 Cerrar Sesión",
                loadingDashboard: "Cargando tu panel...",
                quoteJourney: "📊 Tu Viaje de Citas",
                totalQuotes: "Total Citas",
                favoriteVibe: "Vibra Favorita",
                dayStreak: "Racha de Días",
                chooseVibe: "🎭 Elige Tu Vibra",
                chooseVibeDesc: "Haz clic en una tarjeta de vibra para generar una cita inspiradora",
                recentQuotes: "📜 Citas Recientes",
                viewAll: "Ver Todo",
                hideQuotes: "Ocultar Citas",
                copyQuote: "📋 Copiar Cita",
                readAloud: "🔊 Leer en Voz Alta",
                generateAnother: "✨ Generar Otra",
                craftingQuote: "Creando tu cita perfecta...",
                noQuotes1: "🌟 ¡Aún no hay citas!",
                noQuotes2: "Genera tu primera cita haciendo clic en una vibra arriba.",
                copy: "📋 Copiar",
                speak: "🔊 Hablar",
                copied: "✅ ¡Copiado!",
                speaking: "🔊 Hablando...",
                justNow: "Ahora mismo",
                minutesAgo: "min atrás",
                hoursAgo: "h atrás",
                daysAgo: "d atrás",
                vibes: {
                    gratitude: "Gratitud",
                    resilience: "Resistencia",
                    ambition: "Ambición",
                    creativity: "Creatividad",
                    serenity: "Serenidad",
                    courage: "Coraje",
                    wisdom: "Sabiduría",
                    joy: "Alegría"
                },
                vibeDescriptions: {
                    gratitude: "Aprecia las bendiciones de la vida",
                    resilience: "Vuelve más fuerte",
                    ambition: "Alcanza las estrellas",
                    creativity: "Libera tu imaginación",
                    serenity: "Encuentra paz interior",
                    courage: "Enfrenta tus miedos",
                    wisdom: "Busca comprensión más profunda",
                    joy: "Celebra los momentos de la vida"
                },
                // Preferences modal translations
                quoteCustomization: "Personalización de Citas",
                personalizeGeneration: "Personaliza tu generación de citas",
                addPersonalContext: "Agregar Contexto Personal",
                shareWhatsOnMind: "Comparte lo que tienes en mente para citas más personalizadas",
                characters: "caracteres",
                longerQuotes: "Citas Más Largas",
                longerQuotesDesc: "Generar citas de múltiples oraciones con insights más profundos",
                savePreferences: "Guardar Preferencias",
                clearContext: "Limpiar Contexto"
            },
            portuguese: {
                dashboardTitle: "✨ Citações Vibe",
                dashboardSubtitle: "Seu Painel Pessoal de Citações",
                signOut: "🚪 Sair",
                loadingDashboard: "Carregando seu painel...",
                quoteJourney: "📊 Sua Jornada de Citações",
                totalQuotes: "Total Citações",
                favoriteVibe: "Vibe Favorita",
                dayStreak: "Sequência de Dias",
                chooseVibe: "🎭 Escolha Sua Vibe",
                chooseVibeDesc: "Clique em um cartão de vibe para gerar uma citação inspiradora",
                recentQuotes: "📜 Citações Recentes",
                viewAll: "Ver Tudo",
                hideQuotes: "Ocultar Citações",
                copyQuote: "📋 Copiar Citação",
                readAloud: "🔊 Ler em Voz Alta",
                generateAnother: "✨ Gerar Outra",
                craftingQuote: "Criando sua citação perfeita...",
                noQuotes1: "🌟 Nenhuma citação ainda!",
                noQuotes2: "Gere sua primeira citação clicando em uma vibe acima.",
                copy: "📋 Copiar",
                speak: "🔊 Falar",
                copied: "✅ Copiado!",
                speaking: "🔊 Falando...",
                justNow: "Agora mesmo",
                minutesAgo: "min atrás",
                hoursAgo: "h atrás",
                daysAgo: "d atrás",
                vibes: {
                    gratitude: "Gratidão",
                    resilience: "Resistência",
                    ambition: "Ambícia",
                    creativity: "Criatividade",
                    serenity: "Serenidade",
                    courage: "Coragem",
                    wisdom: "Sabedoria",
                    joy: "Alegria"
                },
                vibeDescriptions: {
                    gratitude: "Aprecie as bênçãos da vida",
                    resilience: "Volte mais forte",
                    ambition: "Alcance as estrelas",
                    creativity: "Liberte sua imaginação",
                    serenity: "Encontre paz interior",
                    courage: "Enfrente seus medos",
                    wisdom: "Busque compreensão mais profunda",
                    joy: "Celebre os momentos da vida"
                },
                // Preferences modal translations
                quoteCustomization: "Personalização de Citações",
                personalizeGeneration: "Personalize sua geração de citações",
                addPersonalContext: "Adicionar Contexto Pessoal",
                shareWhatsOnMind: "Compartilhe o que está em sua mente para citações mais personalizadas",
                characters: "caracteres",
                longerQuotes: "Citações Mais Longas",
                longerQuotesDesc: "Gerar citações de múltiplas frases com insights mais profundos",
                savePreferences: "Salvar Preferências",
                clearContext: "Limpar Contexto"
            },
            italian: {
                dashboardTitle: "✨ Citazioni Vibe",
                dashboardSubtitle: "Il Tuo Dashboard Personale delle Citazioni",
                signOut: "🚪 Esci",
                loadingDashboard: "Caricamento del tuo dashboard...",
                quoteJourney: "📊 Il Tuo Viaggio delle Citazioni",
                totalQuotes: "Totale Citazioni",
                favoriteVibe: "Vibe Preferita",
                dayStreak: "Serie di Giorni",
                chooseVibe: "🎭 Scegli la Tua Vibe",
                chooseVibeDesc: "Clicca su una carta vibe per generare una citazione ispiratrice",
                recentQuotes: "📜 Citazioni Recenti",
                viewAll: "Mostra Tutto",
                hideQuotes: "Nascondi Citazioni",
                copyQuote: "📋 Copia Citazione",
                readAloud: "🔊 Leggi ad Alta Voce",
                generateAnother: "✨ Genera Altra",
                craftingQuote: "Creando la tua citazione perfetta...",
                noQuotes1: "🌟 Nessuna citazione ancora!",
                noQuotes2: "Genera la tua prima citazione cliccando su una vibe sopra.",
                copy: "📋 Copia",
                speak: "🔊 Parla",
                copied: "✅ Copiato!",
                speaking: "🔊 Parlando...",
                justNow: "Proprio ora",
                minutesAgo: "min fa",
                hoursAgo: "h fa",
                daysAgo: "g fa",
                vibes: {
                    gratitude: "Gratitudine",
                    resilience: "Resistenza",
                    ambition: "Ambizione",
                    creativity: "Creatività",
                    serenity: "Serenità",
                    courage: "Coraggio",
                    wisdom: "Saggezza",
                    joy: "Gioia"
                },
                vibeDescriptions: {
                    gratitude: "Apprezza le benedizioni della vita",
                    resilience: "Torna più forte",
                    ambition: "Raggiungi le stelle",
                    creativity: "Scatena la tua immaginazione",
                    serenity: "Trova pace interiore",
                    courage: "Affronta le tue paure",
                    wisdom: "Cerca comprensione più profonda",
                    joy: "Celebra i momenti della vita"
                },
                // Preferences modal translations
                quoteCustomization: "Personalizzazione Citazioni",
                personalizeGeneration: "Personalizza la tua generazione di citazioni",
                addPersonalContext: "Aggiungi Contesto Personale",
                shareWhatsOnMind: "Condividi cosa hai in mente per citazioni più personalizzate",
                characters: "caratteri",
                longerQuotes: "Citazioni Più Lunghe",
                longerQuotesDesc: "Genera citazioni multi-frase con intuizioni più profonde",
                savePreferences: "Salva Preferenze",
                clearContext: "Cancella Contesto"
            },
            slovak: {
                dashboardTitle: "✨ Vibe Citáty",
                dashboardSubtitle: "Váš Osobný Dashboard Citátov",
                signOut: "🚪 Odhlásiť sa",
                loadingDashboard: "Načítava sa váš dashboard...",
                quoteJourney: "📊 Vaša Cesta Citátov",
                totalQuotes: "Celkom Citátov",
                favoriteVibe: "Obľúbená Nálada",
                dayStreak: "Série Dní",
                chooseVibe: "🎭 Vyberte Si Vašu Náladu",
                chooseVibeDesc: "Kliknite na kartu nálady na vygenerovanie inšpiratívneho citátu",
                recentQuotes: "📜 Nedávne Citáty",
                viewAll: "Zobraziť Všetko",
                hideQuotes: "Skryť Citáty",
                copyQuote: "📋 Kopírovať Citát",
                readAloud: "🔊 Čítať Nahlas",
                generateAnother: "✨ Generovať Iný",
                craftingQuote: "Vytvára sa váš dokonalý citát...",
                noQuotes1: "🌟 Zatiaľ žiadne citáty!",
                noQuotes2: "Vygenerujte svoj prvý citát kliknutím na náladu vyššie.",
                copy: "📋 Kopírovať",
                speak: "🔊 Hovoriť",
                copied: "✅ Skopírované!",
                speaking: "🔊 Hovorí...",
                justNow: "Práve teraz",
                minutesAgo: "min dozadu",
                hoursAgo: "h dozadu",
                daysAgo: "d dozadu",
                vibes: {
                    gratitude: "Vďačnosť",
                    resilience: "Odolnosť",
                    ambition: "Ambícia",
                    creativity: "Kreativita",
                    serenity: "Pokoj",
                    courage: "Odvaha",
                    wisdom: "Múdrosť",
                    joy: "Radosť"
                },
                vibeDescriptions: {
                    gratitude: "Oceňte požehnania života",
                    resilience: "Vráťte sa silnejší",
                    ambition: "Siahajte za hviezdami",
                    creativity: "Uvoľnite svoju predstavivosť",
                    serenity: "Nájdite vnútorný pokoj",
                    courage: "Čeľte svojim strachom",
                    wisdom: "Hľadajte hlbšie porozumenie",
                    joy: "Oslavujte životné okamihy"
                },
                // Preferences modal translations
                quoteCustomization: "Prispôsobenie Citátov",
                personalizeGeneration: "Prispôsobte si generovanie citátov",
                addPersonalContext: "Pridať Osobný Kontext",
                shareWhatsOnMind: "Zdieľajte, čo máte na mysli pre viac personalizované citáty",
                characters: "znakov",
                longerQuotes: "Dlhšie Citáty",
                longerQuotesDesc: "Generovať viacvetné citáty s hlbšími poznatkami",
                savePreferences: "Uložiť Nastavenia",
                clearContext: "Vymazať Kontext"
            }
        };
        
        this.init();
    }

    async init() {
        // Check authentication status
        await this.checkAuthStatus();
        
        // Initialize language
        this.initLanguage();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Apply saved theme
        this.applyTheme();
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/.netlify/functions/auth-user', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    this.user = data.user;
                    await this.updateUserInterface(data);
                    this.hideDashboardLoader();
                } else {
                    // Redirect to home if not authenticated
                    window.location.href = '/';
                }
            } else {
                throw new Error('Authentication check failed');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            // Redirect to home on error
            window.location.href = '/';
        }
    }

    async updateUserInterface(data) {
        // Update user info in header
        document.getElementById('user-name').textContent = data.user.name;
        
        // Handle avatar URL safely
        const avatarElement = document.getElementById('user-avatar');
        if (data.user.avatarUrl && data.user.avatarUrl !== 'null') {
            avatarElement.src = data.user.avatarUrl;
            avatarElement.style.display = 'block';
        } else {
            avatarElement.style.display = 'none';
        }
        
        // Update stats
        document.getElementById('total-quotes').textContent = data.stats.totalQuotes;
        
        // Find favorite vibe
        let favoriteVibe = 'gratitude'; // default
        if (data.stats.vibeStats.length > 0) {
            favoriteVibe = data.stats.vibeStats[0].vibe;
            document.getElementById('favorite-vibe').textContent = 
                favoriteVibe.charAt(0).toUpperCase() + favoriteVibe.slice(1);
        }
        
        // Calculate streak (simplified - just days since account creation)
        const streakDays = Math.floor((new Date() - new Date(data.user.created_at)) / (1000 * 60 * 60 * 24)) || 1;
        document.getElementById('streak-days').textContent = streakDays;
        
        // Update vibe cards with stats
        this.updateVibeCards(data.stats.vibeStats);
        
        // Generate and display AI-powered welcome message
        await this.updateWelcomeMessage(data.user.name, data.stats.totalQuotes, streakDays, favoriteVibe);
        
        // Initialize real-time information
        this.initRealTimeInfo();
        
        // Initialize recent quotes section (hidden by default)
        this.initializeRecentQuotes();
        
        // Show dashboard sections
        document.getElementById('welcome-message').style.display = 'block';
        document.getElementById('user-stats').style.display = 'block';
        document.getElementById('vibe-section').style.display = 'block';
        document.getElementById('recent-quotes').style.display = 'block';
    }

    initializeRecentQuotes() {
        const recentQuotesList = document.getElementById('recent-quotes-list');
        recentQuotesList.style.display = 'none';
        recentQuotesList.innerHTML = ''; // Clear any existing content
        this.isQuotesVisible = false;
        this.updateViewAllButton();
    }

    async updateWelcomeMessage(userName, totalQuotes, streakDays, favoriteVibe) {
        const now = new Date();
        const hour = now.getHours();
        
        // Determine time of day
        let timeOfDay = 'morning';
        if (hour >= 12 && hour < 17) {
            timeOfDay = 'afternoon';
        } else if (hour >= 17 && hour < 21) {
            timeOfDay = 'evening';
        } else if (hour >= 21 || hour < 5) {
            timeOfDay = 'night';
        }
        
        try {
            // Call AI to generate personalized welcome message
            const response = await fetch('/.netlify/functions/generate-welcome-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    userName,
                    totalQuotes,
                    favoriteVibe,
                    streakDays,
                    language: this.currentLanguage,
                    timeOfDay
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Update the DOM with AI-generated message
                document.getElementById('welcome-title').textContent = data.title;
                document.getElementById('welcome-subtitle').textContent = data.subtitle;
                console.log('AI-generated welcome message:', data);
            } else {
                // Fallback to default message if AI fails
                this.setFallbackWelcomeMessage(userName, totalQuotes, streakDays, favoriteVibe, timeOfDay);
            }
        } catch (error) {
            console.error('Error generating AI welcome message:', error);
            // Fallback to default message
            this.setFallbackWelcomeMessage(userName, totalQuotes, streakDays, favoriteVibe, timeOfDay);
        }
        
        // Update stats (these don't need AI)
        document.getElementById('welcome-quotes-count').textContent = totalQuotes;
        document.getElementById('welcome-streak').textContent = streakDays;
        
        // Update mini-stat labels with translations
        const t = this.translations[this.currentLanguage] || this.translations.english;
        const miniStatLabels = document.querySelectorAll('.mini-stat-label');
        if (miniStatLabels[0]) miniStatLabels[0].textContent = t.totalQuotes || 'Quotes';
        if (miniStatLabels[1]) miniStatLabels[1].textContent = t.dayStreak || 'Day Streak';
    }

    setFallbackWelcomeMessage(userName, totalQuotes, streakDays, favoriteVibe, timeOfDay) {
        const t = this.translations[this.currentLanguage] || this.translations.english;
        
        // Simple fallback greeting
        const greetings = {
            'morning': t.greetings?.morning || 'Good morning',
            'afternoon': t.greetings?.afternoon || 'Good afternoon', 
            'evening': t.greetings?.evening || 'Good evening',
            'night': t.greetings?.night || 'Good evening'
        };
        
        const emojis = {
            'morning': '🌅',
            'afternoon': '☀️',
            'evening': '🌅',
            'night': '🌙'
        };
        
        const greeting = greetings[timeOfDay];
        const emoji = emojis[timeOfDay];
        
        // Simple subtitle based on stats
        let subtitle = '';
        if (totalQuotes === 0) {
            subtitle = `Welcome! Ready for your first ${favoriteVibe} quote?`;
        } else {
            subtitle = `${totalQuotes} quotes and counting! More ${favoriteVibe}?`;
        }
        
        document.getElementById('welcome-title').textContent = `${greeting}, ${userName}! ${emoji}`;
        document.getElementById('welcome-subtitle').textContent = subtitle;
    }

    updateVibeCards(vibeStats) {
        const vibeCards = document.querySelectorAll('.vibe-card');
        const vibeStatsMap = {};
        
        // Create a map for easy lookup
        vibeStats.forEach(stat => {
            vibeStatsMap[stat.vibe] = stat.quote_count;
        });
        
        vibeCards.forEach(card => {
            const vibe = card.dataset.vibe;
            const count = vibeStatsMap[vibe] || 0;
            const countElement = card.querySelector('.quote-count');
            countElement.textContent = `${count} quote${count !== 1 ? 's' : ''}`;
        });
    }

    hideDashboardLoader() {
        document.getElementById('dashboard-loader').style.display = 'none';
    }

    initEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Language selection
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.applyLanguage(e.target.value);
        });

        // Sign out
        document.getElementById('sign-out-btn').addEventListener('click', async () => {
            await this.signOut();
        });

        // Vibe card clicks
        document.querySelectorAll('.vibe-card').forEach(card => {
            card.addEventListener('click', () => {
                const vibe = card.dataset.vibe;
                this.generateQuote(vibe);
            });
        });

        // Quote actions
        document.getElementById('copy-quote-btn').addEventListener('click', () => {
            this.copyQuote();
        });

        document.getElementById('read-quote-btn').addEventListener('click', () => {
            this.readQuote();
        });

        document.getElementById('generate-another-btn').addEventListener('click', () => {
            if (this.currentVibe) {
                this.generateQuote(this.currentVibe);
            }
        });

        // View All Quotes button
        document.getElementById('view-all-quotes').addEventListener('click', async () => {
            await this.toggleRecentQuotes();
        });

        // Date filtering
        document.getElementById('filter-quotes-btn').addEventListener('click', async () => {
            await this.filterQuotesByDate();
        });

        document.getElementById('clear-filter-btn').addEventListener('click', async () => {
            await this.clearDateFilter();
        });

        // Preferences Modal
        document.getElementById('preferences-toggle').addEventListener('click', () => {
            this.openPreferencesModal();
        });

        document.getElementById('close-preferences-modal').addEventListener('click', () => {
            this.closePreferencesModal();
        });

        document.getElementById('preferences-overlay').addEventListener('click', () => {
            this.closePreferencesModal();
        });

        // User Preferences
        this.initUserPreferences();
    }

    async generateQuote(vibe) {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.currentVibe = vibe;
        
        // Get context and log it
        const context = this.getContext();
        console.log('🚀 Starting quote generation for vibe:', vibe);
        console.log('📤 Context being sent to backend:', JSON.stringify(context, null, 2));
        
        // Update UI
        this.showQuoteDisplay();
        this.showQuoteLoader(vibe);
        
        try {
            const requestBody = {
                vibe: vibe,
                language: this.currentLanguage,
                context: context
            };
            
            console.log('📡 Full request body:', JSON.stringify(requestBody, null, 2));
            
            const response = await fetch('/.netlify/functions/getBestQuote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            console.log('📥 Response received from backend:', data);
            
            if (data.error) {
                throw new Error(data.message || data.error);
            }

            // Display the quote
            this.displayQuote(data);
            
            // Refresh user stats after generating a quote
            setTimeout(() => this.refreshStats(), 1000);

        } catch (error) {
            console.error('❌ Error generating quote:', error);
            this.showError(error.message);
        } finally {
            this.isGenerating = false;
        }
    }

    showQuoteDisplay() {
        document.getElementById('quote-display').style.display = 'block';
        document.getElementById('quote-display').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }

    showQuoteLoader(vibe) {
        const vibeAvatars = {
            'gratitude': '🙏',
            'resilience': '💪',
            'ambition': '🚀',
            'creativity': '🎨',
            'serenity': '🧘',
            'courage': '⚡',
            'wisdom': '🦉',
            'joy': '😊'
        };

        document.getElementById('quote-loader').style.display = 'block';
        document.getElementById('quote-content').style.display = 'none';
        document.getElementById('vibe-avatar').textContent = vibeAvatars[vibe] || '🤔';
    }

    displayQuote(data) {
        // Hide loader, show content
        document.getElementById('quote-loader').style.display = 'none';
        document.getElementById('quote-content').style.display = 'flex';
        
        // Update quote content
        document.getElementById('quote-vibe-badge').textContent = data.vibe.charAt(0).toUpperCase() + data.vibe.slice(1);
        document.getElementById('generated-quote').textContent = data.quote;
        
        // Store the current quote for copying and reading
        this.currentQuote = data.quote;
    }

    showError(message) {
        document.getElementById('quote-loader').style.display = 'none';
        document.getElementById('quote-content').style.display = 'flex';
        
        document.getElementById('quote-vibe-badge').textContent = 'Error';
        document.getElementById('generated-quote').textContent = message;
        
        this.currentQuote = null;
    }

    async refreshStats() {
        try {
            const response = await fetch('/.netlify/functions/auth-user', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    // Store current quotes visibility state
                    const wasQuotesVisible = this.isQuotesVisible;
                    const recentQuotesList = document.getElementById('recent-quotes-list');
                    const existingQuotes = recentQuotesList.innerHTML;
                    
                    // Update user info and stats only
                    document.getElementById('user-name').textContent = data.user.name;
                    
                    // Handle avatar URL safely
                    const avatarElement = document.getElementById('user-avatar');
                    if (data.user.avatarUrl && data.user.avatarUrl !== 'null') {
                        avatarElement.src = data.user.avatarUrl;
                        avatarElement.style.display = 'block';
                    } else {
                        avatarElement.style.display = 'none';
                    }
                    
                    document.getElementById('total-quotes').textContent = data.stats.totalQuotes;
                    
                    // Find favorite vibe
                    if (data.stats.vibeStats.length > 0) {
                        const favoriteVibe = data.stats.vibeStats[0];
                        document.getElementById('favorite-vibe').textContent = 
                            favoriteVibe.vibe.charAt(0).toUpperCase() + favoriteVibe.vibe.slice(1);
                    }
                    
                    // Update vibe cards with stats
                    this.updateVibeCards(data.stats.vibeStats);
                    
                    // Restore quotes state if they were visible
                    if (wasQuotesVisible) {
                        this.loadRecentQuotes();
                    } else {
                        // Keep quotes hidden and ensure state is correct
                        this.isQuotesVisible = false;
                        this.updateViewAllButton();
                    }
                }
            }
        } catch (error) {
            console.error('Error refreshing stats:', error);
        }
    }

    copyQuote() {
        if (this.currentQuote) {
            const t = this.translations[this.currentLanguage] || this.translations.english;
            navigator.clipboard.writeText(this.currentQuote).then(() => {
                const btn = document.getElementById('copy-quote-btn');
                const originalText = btn.textContent;
                btn.textContent = t.copied;
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        }
    }

    readQuote() {
        if (this.currentQuote && 'speechSynthesis' in window) {
            const t = this.translations[this.currentLanguage] || this.translations.english;
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(this.currentQuote);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Try to set appropriate language
            const langMap = {
                'english': 'en-US',
                'french': 'fr-FR',
                'german': 'de-DE',
                'spanish': 'es-ES',
                'portuguese': 'pt-PT',
                'italian': 'it-IT',
                'slovak': 'sk-SK'
            };
            
            utterance.lang = langMap[this.currentLanguage] || 'en-US';
            
            const btn = document.getElementById('read-quote-btn');
            const originalText = btn.textContent;
            btn.textContent = t.speaking;
            
            utterance.onend = () => {
                btn.textContent = originalText;
            };
            
            utterance.onerror = () => {
                btn.textContent = originalText;
            };
            
            window.speechSynthesis.speak(utterance);
        }
    }

    async signOut() {
        try {
            const response = await fetch('/.netlify/functions/auth-logout', {
                method: 'GET',
                credentials: 'include'
            });
            
            // Redirect to home regardless of response
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out error:', error);
            // Still redirect on error
            window.location.href = '/';
        }
    }

    getContext() {
        console.log('🔍 Collecting user context...');
        const context = {};
        
        // Add holiday context if applicable
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        
        // Simple holiday detection
        if (month === 12 && day >= 20) {
            context.holiday = 'Christmas season';
            console.log('🎄 Holiday detected:', context.holiday);
        } else if (month === 1 && day === 1) {
            context.holiday = 'New Year';
            console.log('🎊 Holiday detected:', context.holiday);
        } else if (month === 2 && day === 14) {
            context.holiday = 'Valentine\'s Day';
            console.log('💕 Holiday detected:', context.holiday);
        } else if (month === 10 && day === 31) {
            context.holiday = 'Halloween';
            console.log('🎃 Holiday detected:', context.holiday);
        } else {
            console.log('📅 No holiday detected for current date');
        }

        // Add user preferences if available
        const contextInput = document.getElementById('user-context');
        const longerQuotesToggle = document.getElementById('longer-quotes');
        
        if (contextInput && contextInput.value.trim()) {
            context.userContext = contextInput.value.trim();
            console.log('✅ User context found:', context.userContext);
            console.log('📏 User context length:', context.userContext.length + ' characters');
        } else {
            console.log('❌ No user context provided');
        }
        
        if (longerQuotesToggle && longerQuotesToggle.checked) {
            context.longerQuotes = true;
            console.log('✅ Longer quotes preference: ENABLED');
        } else {
            console.log('📝 Longer quotes preference: DISABLED (standard length)');
        }
        
        console.log('📋 Final context object:', context);
        return context;
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    applyTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    async loadRecentQuotes(startDate = null, endDate = null) {
        try {
            let url = '/.netlify/functions/get-user-quotes?limit=20';
            
            // Add date parameters if provided
            if (startDate) {
                url += `&startDate=${startDate}`;
            }
            if (endDate) {
                url += `&endDate=${endDate}`;
            }
            
            const response = await fetch(url, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const quotes = await response.json();
                this.displayRecentQuotes(quotes);
                this.isQuotesVisible = true;
                this.updateViewAllButton();
            } else {
                console.error('Failed to load recent quotes');
            }
        } catch (error) {
            console.error('Error loading recent quotes:', error);
        }
    }

    displayRecentQuotes(quotes) {
        const recentQuotesList = document.getElementById('recent-quotes-list');
        const t = this.translations[this.currentLanguage] || this.translations.english;
        
        if (quotes.length === 0) {
            recentQuotesList.innerHTML = `
                <div class="no-quotes-message">
                    <p>No quotes found for the selected date range.</p>
                    <p>Try adjusting your date filters or generate more quotes!</p>
                </div>
            `;
        } else {
            recentQuotesList.innerHTML = quotes.map(quote => `
                <div class="quote-item">
                    <div class="quote-header">
                        <span class="quote-vibe">${quote.vibe.charAt(0).toUpperCase() + quote.vibe.slice(1)}</span>
                        <span class="quote-date">${this.formatDate(quote.created_at)}</span>
                    </div>
                    <blockquote class="quote-text">${quote.quote_text}</blockquote>
                    <div class="quote-actions">
                        <button class="action-btn small" onclick="navigator.clipboard.writeText('${quote.quote_text.replace(/'/g, "\\'")}')">
                            ${t.copy}
                        </button>
                        <button class="action-btn small" onclick="window.dashboardApp.speakQuote('${quote.quote_text.replace(/'/g, "\\'")}')">
                            ${t.speak}
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Show the quotes list
        recentQuotesList.style.display = 'grid';
        this.isQuotesVisible = true;
        this.updateViewAllButton();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const t = this.translations[this.currentLanguage] || this.translations.english;
        
        if (diffInSeconds < 60) return t.justNow;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}${t.minutesAgo}`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}${t.hoursAgo}`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}${t.daysAgo}`;
        
        return date.toLocaleDateString();
    }

    speakQuote(text) {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech not supported in your browser.');
        }
    }

    async toggleRecentQuotes() {
        const recentQuotesList = document.getElementById('recent-quotes-list');
        
        if (this.isQuotesVisible) {
            // Hide quotes
            recentQuotesList.style.display = 'none';
            this.isQuotesVisible = false;
            this.updateViewAllButton();
        } else {
            // Show quotes - load them if not loaded, or just show existing ones
            if (recentQuotesList.innerHTML.trim() === '') {
                await this.loadRecentQuotes();
            } else {
                recentQuotesList.style.display = 'grid';
                this.isQuotesVisible = true;
                this.updateViewAllButton();
            }
        }
    }

    updateViewAllButton() {
        const button = document.getElementById('view-all-quotes');
        const t = this.translations[this.currentLanguage] || this.translations.english;
        if (button) {
            button.textContent = this.isQuotesVisible ? t.hideQuotes : t.viewAll;
        }
    }

    resetQuotesState() {
        const recentQuotesList = document.getElementById('recent-quotes-list');
        if (recentQuotesList) {
            recentQuotesList.style.display = 'none';
            recentQuotesList.innerHTML = '';
        }
        this.isQuotesVisible = false;
        this.updateViewAllButton();
    }

    initLanguage() {
        // Load saved language or default to English
        const savedLanguage = localStorage.getItem('language') || 'english';
        this.currentLanguage = savedLanguage;
        
        // Set the language select to the saved value
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = savedLanguage;
        }
        
        // Apply the language
        this.applyLanguage(savedLanguage);
    }

    applyLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('language', language);
        
        // Update language selector
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = language;
        }
        
        // Translate UI elements
        this.translateUI(language);
        
        // Update header date with new language
        if (this.clockInterval) {
            this.updateHeaderDate();
        }
        
        console.log('Dashboard language changed to:', language);
    }

    translateUI(language) {
        const t = this.translations[language] || this.translations.english;
        
        try {
            // Update header
            const dashboardTitle = document.querySelector('.dashboard-title');
            const dashboardSubtitle = document.querySelector('.dashboard-subtitle');
            if (dashboardTitle) dashboardTitle.textContent = t.dashboardTitle;
            if (dashboardSubtitle) dashboardSubtitle.textContent = t.dashboardSubtitle;
            
            // Update sign out button
            const signOutBtn = document.getElementById('sign-out-btn');
            if (signOutBtn) signOutBtn.textContent = t.signOut;
            
            // Update loading text
            const dashboardLoader = document.querySelector('.dashboard-loader p');
            if (dashboardLoader) dashboardLoader.textContent = t.loadingDashboard;
            
            // Update stats section
            const quoteJourneyTitle = document.querySelector('.stats-header h2');
            if (quoteJourneyTitle) quoteJourneyTitle.textContent = t.quoteJourney;
            
            const statLabels = document.querySelectorAll('.stat-label');
            if (statLabels[0]) statLabels[0].textContent = t.totalQuotes;
            if (statLabels[1]) statLabels[1].textContent = t.favoriteVibe;
            if (statLabels[2]) statLabels[2].textContent = t.dayStreak;
            
            // Update vibe section
            const vibeTitle = document.querySelector('.section-header h2');
            const vibeDesc = document.querySelector('.section-header p');
            if (vibeTitle) vibeTitle.textContent = t.chooseVibe;
            if (vibeDesc) vibeDesc.textContent = t.chooseVibeDesc;
            
            // Update vibe cards
            document.querySelectorAll('.vibe-card').forEach(card => {
                const vibe = card.dataset.vibe;
                const vibeTitle = card.querySelector('.vibe-title');
                const vibeDescription = card.querySelector('.vibe-description');
                const quoteCount = card.querySelector('.quote-count');
                
                if (vibeTitle && t.vibes[vibe]) {
                    vibeTitle.textContent = t.vibes[vibe];
                }
                if (vibeDescription && t.vibeDescriptions[vibe]) {
                    vibeDescription.textContent = t.vibeDescriptions[vibe];
                }
                
                // Update quote count text (preserve the number)
                if (quoteCount) {
                    const currentText = quoteCount.textContent;
                    const number = currentText.match(/\d+/)?.[0] || '0';
                    const count = parseInt(number);
                    quoteCount.textContent = `${count} ${count === 1 ? (language === 'french' ? 'citation' : language === 'german' ? 'Zitat' : language === 'spanish' ? 'cita' : language === 'portuguese' ? 'citação' : language === 'italian' ? 'citazione' : language === 'slovak' ? 'citát' : 'quote') : (language === 'french' ? 'citations' : language === 'german' ? 'Zitate' : language === 'spanish' ? 'citas' : language === 'portuguese' ? 'citações' : language === 'italian' ? 'citazioni' : language === 'slovak' ? 'citáty' : 'quotes')}`;
                }
            });
            
            // Update quote actions
            const copyBtn = document.getElementById('copy-quote-btn');
            const readBtn = document.getElementById('read-quote-btn');
            const generateBtn = document.getElementById('generate-another-btn');
            
            if (copyBtn) copyBtn.textContent = t.copyQuote;
            if (readBtn) readBtn.textContent = t.readAloud;
            if (generateBtn) generateBtn.textContent = t.generateAnother;
            
            // Update loader text
            const loaderText = document.getElementById('loader-text');
            if (loaderText) loaderText.textContent = t.craftingQuote;
            
            // Update recent quotes section
            const recentQuotesTitle = document.querySelector('#recent-quotes .section-header h2');
            if (recentQuotesTitle) recentQuotesTitle.textContent = t.recentQuotes;
            
            const viewAllBtn = document.getElementById('view-all-quotes');
            if (viewAllBtn) {
                viewAllBtn.textContent = this.isQuotesVisible ? t.hideQuotes : t.viewAll;
            }
            
            // Update page title
            document.title = `${t.dashboardTitle} - Dashboard`;
            
            // Update preferences modal elements
            const modalTitle = document.querySelector('.modal-header h2');
            const modalSubtitle = document.querySelector('.modal-header p');
            const contextSectionTitle = document.querySelector('.context-section h3');
            const contextSectionDesc = document.querySelector('.context-section p');
            const contextCounter = document.getElementById('context-counter');
            const longerQuotesLabel = document.querySelector('.toggle-section h3');
            const longerQuotesDesc = document.querySelector('.toggle-section p');
            const saveBtn = document.getElementById('save-preferences-btn');
            const clearBtn = document.getElementById('clear-context-btn');
            
            if (modalTitle) modalTitle.textContent = t.quoteCustomization;
            if (modalSubtitle) modalSubtitle.textContent = t.personalizeGeneration;
            if (contextSectionTitle) contextSectionTitle.textContent = t.addPersonalContext;
            if (contextSectionDesc) contextSectionDesc.textContent = t.shareWhatsOnMind;
            if (longerQuotesLabel) longerQuotesLabel.textContent = t.longerQuotes;
            if (longerQuotesDesc) longerQuotesDesc.textContent = t.longerQuotesDesc;
            if (saveBtn) saveBtn.textContent = `💾 ${t.savePreferences}`;
            if (clearBtn) clearBtn.textContent = `🗑️ ${t.clearContext}`;
            
            // Update character counter text
            if (contextCounter) {
                const currentCount = contextCounter.textContent.match(/\d+/)?.[0] || '0';
                contextCounter.innerHTML = `${currentCount}/200 ${t.characters}`;
            }
            
        } catch (error) {
            console.error('Dashboard translation error:', error);
        }
    }

    async filterQuotesByDate() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        // Validate dates
        if (startDate && endDate && startDate > endDate) {
            alert('Start date cannot be after end date');
            return;
        }
        
        // Show loading state
        const filterBtn = document.getElementById('filter-quotes-btn');
        const originalText = filterBtn.textContent;
        filterBtn.textContent = '⏳ Filtering...';
        filterBtn.disabled = true;
        
        try {
            await this.loadRecentQuotes(startDate, endDate);
            
            // Update UI to show filtering is active
            if (startDate || endDate) {
                const recentQuotesTitle = document.querySelector('#recent-quotes .section-header h2');
                let filterText = '📜 Recent Quotes';
                if (startDate && endDate) {
                    filterText += ` (${startDate} to ${endDate})`;
                } else if (startDate) {
                    filterText += ` (from ${startDate})`;
                } else if (endDate) {
                    filterText += ` (until ${endDate})`;
                }
                recentQuotesTitle.textContent = filterText;
            }
        } catch (error) {
            console.error('Error filtering quotes:', error);
            alert('Error filtering quotes. Please try again.');
        } finally {
            filterBtn.textContent = originalText;
            filterBtn.disabled = false;
        }
    }

    async clearDateFilter() {
        // Clear date inputs
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';
        
        // Reset title
        const recentQuotesTitle = document.querySelector('#recent-quotes .section-header h2');
        recentQuotesTitle.textContent = '📜 Recent Quotes';
        
        // Reload all quotes
        if (this.isQuotesVisible) {
            await this.loadRecentQuotes();
        }
    }

    // Real-time information methods
    initRealTimeInfo() {
        // Start the clock for header date
        this.startHeaderClock();
    }

    startHeaderClock() {
        this.updateHeaderDate();
        // Update every minute for the header date
        this.clockInterval = setInterval(() => {
            this.updateHeaderDate();
        }, 60000);
    }

    updateHeaderDate() {
        const now = new Date();
        
        // Format date based on current language
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        // Get language locale
        const localeMap = {
            'english': 'en-US',
            'french': 'fr-FR',
            'german': 'de-DE',
            'spanish': 'es-ES',
            'portuguese': 'pt-PT',
            'italian': 'it-IT',
            'slovak': 'sk-SK'
        };
        
        const locale = localeMap[this.currentLanguage] || 'en-US';
        const formattedDate = now.toLocaleDateString(locale, dateOptions);
        
        document.getElementById('header-date').textContent = formattedDate;
    }

    // Cleanup method
    destroy() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }
    }

    // User Preferences
    initUserPreferences() {
        const contextInput = document.getElementById('user-context');
        const contextCounter = document.getElementById('context-counter');
        const saveBtn = document.getElementById('save-preferences-btn');
        const clearBtn = document.getElementById('clear-context-btn');
        const longerQuotesToggle = document.getElementById('longer-quotes');

        if (!contextInput || !contextCounter || !saveBtn || !clearBtn || !longerQuotesToggle) {
            return; // Elements not found, preferences section probably not loaded
        }

        // Character counter for context input
        contextInput.addEventListener('input', () => {
            const length = contextInput.value.length;
            const t = this.translations[this.currentLanguage] || this.translations.english;
            contextCounter.innerHTML = `${length}/200 ${t.characters}`;
            
            // Update counter color based on limit
            if (length > 180) {
                contextCounter.style.color = '#ef4444'; // Red when approaching limit
            } else if (length > 150) {
                contextCounter.style.color = '#f59e0b'; // Orange when getting close
            } else {
                contextCounter.style.color = 'rgba(255, 255, 255, 0.6)'; // Default
            }
        });

        // Save preferences
        saveBtn.addEventListener('click', async () => {
            await this.saveUserPreferences();
        });

        // Clear context
        clearBtn.addEventListener('click', async () => {
            await this.clearUserContext();
        });

        // Load existing preferences
        this.loadUserPreferences();
    }

    async loadUserPreferences() {
        try {
            const response = await fetch('/.netlify/functions/user-preferences', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const preferences = data.preferences;

                // Update UI with loaded preferences
                const contextInput = document.getElementById('user-context');
                const longerQuotesToggle = document.getElementById('longer-quotes');
                const contextCounter = document.getElementById('context-counter');

                if (contextInput && preferences.custom_context) {
                    contextInput.value = preferences.custom_context;
                    if (contextCounter) {
                        const t = this.translations[this.currentLanguage] || this.translations.english;
                        contextCounter.innerHTML = `${preferences.custom_context.length}/200 ${t.characters}`;
                    }
                }

                if (longerQuotesToggle) {
                    longerQuotesToggle.checked = preferences.longer_quotes || false;
                }
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
        }
    }

    async saveUserPreferences() {
        const contextInput = document.getElementById('user-context');
        const longerQuotesToggle = document.getElementById('longer-quotes');
        const saveBtn = document.getElementById('save-preferences-btn');

        if (!contextInput || !longerQuotesToggle || !saveBtn) {
            return;
        }

        // Validate context length
        if (contextInput.value.length > 200) {
            alert('Custom context must be 200 characters or less.');
            return;
        }

        // Show loading state
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '💾 Saving...';
        saveBtn.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/user-preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    customContext: contextInput.value.trim() || null,
                    longerQuotes: longerQuotesToggle.checked
                })
            });

            if (response.ok) {
                const data = await response.json();
                saveBtn.textContent = '✅ Saved!';
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                }, 2000);
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save preferences');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            saveBtn.textContent = '❌ Error';
            alert('Failed to save preferences: ' + error.message);
            setTimeout(() => {
                saveBtn.textContent = originalText;
            }, 2000);
        } finally {
            saveBtn.disabled = false;
        }
    }

    async clearUserContext() {
        const contextInput = document.getElementById('user-context');
        const contextCounter = document.getElementById('context-counter');
        const clearBtn = document.getElementById('clear-context-btn');

        if (!contextInput || !clearBtn) {
            return;
        }

        if (!confirm('Are you sure you want to clear your personal context?')) {
            return;
        }

        // Show loading state
        const originalText = clearBtn.textContent;
        clearBtn.textContent = '🗑️ Clearing...';
        clearBtn.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/user-preferences', {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                contextInput.value = '';
                if (contextCounter) {
                    contextCounter.textContent = '0';
                    contextCounter.style.color = 'rgba(255, 255, 255, 0.6)';
                }
                clearBtn.textContent = '✅ Cleared!';
                setTimeout(() => {
                    clearBtn.textContent = originalText;
                }, 2000);
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to clear context');
            }
        } catch (error) {
            console.error('Error clearing context:', error);
            clearBtn.textContent = '❌ Error';
            alert('Failed to clear context: ' + error.message);
            setTimeout(() => {
                clearBtn.textContent = originalText;
            }, 2000);
        } finally {
            clearBtn.disabled = false;
        }
    }

    openPreferencesModal() {
        document.getElementById('preferences-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closePreferencesModal() {
        document.getElementById('preferences-modal').style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardApp = new DashboardApp();
}); 