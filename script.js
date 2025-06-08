// Vibe Quotes - JavaScript Logic
class VibeQuotes {
    constructor() {
        console.log('VibeQuotes constructor called');
        
        // Authentication state
        this.user = null;
        this.isAuthenticated = false;
        
        // Initialize translations
        this.translations = {
            english: {
                title: "✨ Vibe Quotes",
                subtitle: "Generate inspiring quotes that match your vibe",
                chooseVibe: "Choose your vibe:",
                selectVibe: "Select a vibe...",
                generateBtn: "Generate Quote",
                generating: "Generating...",
                copyBtn: "📋 Copy Quote",
                readBtn: "🔊 Read Aloud",
                stopBtn: "⏹️ Stop",
                welcomeTitle: "Welcome to Vibe Quotes!",
                welcomeText: "Choose your vibe above and generate your first inspiring quote. Our AI will create personalized quotes that match your mood and energy.",
                feature1: "8 unique vibes to choose from",
                feature2: "Available in 7 languages", 
                feature3: "Text-to-speech support",
                feature4: "Sign in to save your favorite quotes",
                historyBtn: "📜 Previous Quotes",
                historyTitle: "Quote History",
                historyEmpty1: "No quotes yet!",
                historyEmpty2: "Generate your first quote to see it here.",
                footerText: "Powered by AI • Built with ❤️",
                vibes: {
                    gratitude: "🙏 Gratitude",
                    resilience: "💪 Resilience", 
                    ambition: "🚀 Ambition",
                    creativity: "🎨 Creativity",
                    serenity: "🧘 Serenity",
                    courage: "⚡ Courage",
                    wisdom: "🦉 Wisdom",
                    joy: "😊 Joy"
                }
            },
            french: {
                title: "✨ Citations Vibe",
                subtitle: "Générez des citations inspirantes qui correspondent à votre humeur",
                chooseVibe: "Choisissez votre humeur:",
                selectVibe: "Sélectionnez une humeur...",
                generateBtn: "Générer Citation",
                generating: "Génération...",
                copyBtn: "📋 Copier Citation",
                readBtn: "🔊 Lire à Voix Haute",
                stopBtn: "⏹️ Arrêter",
                welcomeTitle: "Bienvenue sur Citations Vibe!",
                welcomeText: "Choisissez votre humeur ci-dessus et générez votre première citation inspirante. Notre IA créera des citations personnalisées qui correspondent à votre humeur et votre énergie.",
                feature1: "8 ambiances uniques au choix",
                feature2: "Disponible en 7 langues",
                feature3: "Support de synthèse vocale",
                feature4: "Connectez-vous pour sauvegarder vos citations favorites",
                historyBtn: "📜 Citations Précédentes",
                historyTitle: "Historique des Citations",
                historyEmpty1: "Aucune citation encore!",
                historyEmpty2: "Générez votre première citation pour la voir ici.",
                footerText: "Alimenté par IA • Construit avec ❤️",
                vibes: {
                    gratitude: "🙏 Gratitude",
                    resilience: "💪 Résilience",
                    ambition: "🚀 Ambition", 
                    creativity: "🎨 Créativité",
                    serenity: "🧘 Sérénité",
                    courage: "⚡ Courage",
                    wisdom: "🦉 Sagesse",
                    joy: "😊 Joie"
                }
            },
            german: {
                title: "✨ Vibe Zitate",
                subtitle: "Generiere inspirierende Zitate, die zu deiner Stimmung passen",
                chooseVibe: "Wähle deine Stimmung:",
                selectVibe: "Wähle eine Stimmung...",
                generateBtn: "Zitat Generieren",
                generating: "Generierung...",
                copyBtn: "📋 Zitat Kopieren",
                readBtn: "🔊 Vorlesen",
                stopBtn: "⏹️ Stopp",
                welcomeTitle: "Willkommen bei Vibe Zitate!",
                welcomeText: "Wähle deine Stimmung oben und generiere dein erstes inspirierendes Zitat. Unsere KI erstellt personalisierte Zitate, die zu deiner Stimmung und Energie passen.",
                feature1: "8 einzigartige Stimmungen zur Auswahl",
                feature2: "Verfügbar in 7 Sprachen",
                feature3: "Text-zu-Sprache Unterstützung",
                historyBtn: "📜 Vorherige Zitate",
                historyTitle: "Zitat Historie",
                historyEmpty1: "Noch keine Zitate!",
                historyEmpty2: "Generiere dein erstes Zitat, um es hier zu sehen.",
                footerText: "Angetrieben von KI • Mit ❤️ gebaut",
                vibes: {
                    gratitude: "🙏 Dankbarkeit",
                    resilience: "💪 Widerstandsfähigkeit",
                    ambition: "🚀 Ehrgeiz",
                    creativity: "🎨 Kreativität", 
                    serenity: "🧘 Gelassenheit",
                    courage: "⚡ Mut",
                    wisdom: "🦉 Weisheit",
                    joy: "😊 Freude"
                }
            },
            spanish: {
                title: "✨ Citas Vibe",
                subtitle: "Genera citas inspiradoras que coincidan con tu vibra",
                chooseVibe: "Elige tu vibra:",
                selectVibe: "Selecciona una vibra...",
                generateBtn: "Generar Cita",
                generating: "Generando...",
                copyBtn: "📋 Copiar Cita",
                readBtn: "🔊 Leer en Voz Alta",
                stopBtn: "⏹️ Parar",
                welcomeTitle: "¡Bienvenido a Citas Vibe!",
                welcomeText: "Elige tu vibra arriba y genera tu primera cita inspiradora. Nuestra IA creará citas personalizadas que coincidan con tu estado de ánimo y energía.",
                feature1: "8 vibras únicas para elegir",
                feature2: "Disponible en 7 idiomas",
                feature3: "Soporte de texto a voz",
                historyBtn: "📜 Citas Anteriores",
                historyTitle: "Historial de Citas",
                historyEmpty1: "¡Aún no hay citas!",
                historyEmpty2: "Genera tu primera cita para verla aquí.",
                footerText: "Impulsado por IA • Construido con ❤️",
                vibes: {
                    gratitude: "🙏 Gratitud",
                    resilience: "💪 Resistencia",
                    ambition: "🚀 Ambición",
                    creativity: "🎨 Creatividad",
                    serenity: "🧘 Serenidad", 
                    courage: "⚡ Coraje",
                    wisdom: "🦉 Sabiduría",
                    joy: "😊 Alegría"
                }
            },
            portuguese: {
                title: "✨ Citações Vibe",
                subtitle: "Gere citações inspiradoras que combinam com sua vibe",
                chooseVibe: "Escolha sua vibe:",
                selectVibe: "Selecione uma vibe...",
                generateBtn: "Gerar Citação",
                generating: "Gerando...",
                copyBtn: "📋 Copiar Citação",
                readBtn: "🔊 Ler em Voz Alta",
                stopBtn: "⏹️ Parar",
                welcomeTitle: "Bem-vindo às Citações Vibe!",
                welcomeText: "Escolha sua vibe acima e gere sua primeira citação inspiradora. Nossa IA criará citações personalizadas que combinam com seu humor e energia.",
                feature1: "8 vibes únicas para escolher",
                feature2: "Disponível em 7 idiomas",
                feature3: "Suporte de texto para fala",
                historyBtn: "📜 Citações Anteriores",
                historyTitle: "Histórico de Citações",
                historyEmpty1: "Nenhuma citação ainda!",
                historyEmpty2: "Gere sua primeira citação para vê-la aqui.",
                footerText: "Alimentado por IA • Construído com ❤️",
                vibes: {
                    gratitude: "🙏 Gratidão",
                    resilience: "💪 Resistência",
                    ambition: "🚀 Ambição",
                    creativity: "🎨 Criatividade",
                    serenity: "🧘 Serenidade",
                    courage: "⚡ Coragem",
                    wisdom: "🦉 Sabedoria",
                    joy: "😊 Alegria"
                }
            },
            italian: {
                title: "✨ Citazioni Vibe",
                subtitle: "Genera citazioni ispiratrici che si adattano alla tua vibe",
                chooseVibe: "Scegli la tua vibe:",
                selectVibe: "Seleziona una vibe...",
                generateBtn: "Genera Citazione",
                generating: "Generazione...",
                copyBtn: "📋 Copia Citazione",
                readBtn: "🔊 Leggi ad Alta Voce",
                stopBtn: "⏹️ Ferma",
                welcomeTitle: "Benvenuto in Citazioni Vibe!",
                welcomeText: "Scegli la tua vibe sopra e genera la tua prima citazione ispiratrice. La nostra IA creerà citazioni personalizzate che si adattano al tuo umore ed energia.",
                feature1: "8 vibe uniche tra cui scegliere",
                feature2: "Disponibile in 7 lingue",
                feature3: "Supporto di sintesi vocale",
                historyBtn: "📜 Citazioni Precedenti",
                historyTitle: "Cronologia Citazioni",
                historyEmpty1: "Nessuna citazione ancora!",
                historyEmpty2: "Genera la tua prima citazione per vederla qui.",
                footerText: "Alimentato da IA • Costruito con ❤️",
                vibes: {
                    gratitude: "🙏 Gratitudine",
                    resilience: "💪 Resistenza",
                    ambition: "🚀 Ambizione",
                    creativity: "🎨 Creatività",
                    serenity: "🧘 Serenità",
                    courage: "⚡ Coraggio",
                    wisdom: "🦉 Saggezza",
                    joy: "😊 Gioia"
                }
            },
            slovak: {
                title: "✨ Vibe Citáty",
                subtitle: "Generujte inšpiratívne citáty, ktoré sa hodia k vašej nálade",
                chooseVibe: "Vyberte si vašu náladu:",
                selectVibe: "Vyberte náladu...",
                generateBtn: "Generovať Citát",
                generating: "Generovanie...",
                copyBtn: "📋 Kopírovať Citát",
                readBtn: "🔊 Čítať Nahlas",
                stopBtn: "⏹️ Zastaviť",
                welcomeTitle: "Vitajte v Vibe Citátoch!",
                welcomeText: "Vyberte si vašu náladu vyššie a vygenerujte váš prvý inšpiratívny citát. Naša AI vytvorí personalizované citáty, ktoré sa hodia k vašej nálade a energii.",
                feature1: "8 jedinečných nálad na výber",
                feature2: "Dostupné v 7 jazykoch",
                feature3: "Podpora syntézy reči",
                historyBtn: "📜 Predchádzajúce Citáty",
                historyTitle: "História Citátov",
                historyEmpty1: "Zatiaľ žiadne citáty!",
                historyEmpty2: "Vygenerujte váš prvý citát, aby ste ho tu videli.",
                footerText: "Poháňané AI • Postavené s ❤️",
                vibes: {
                    gratitude: "🙏 Vďačnosť",
                    resilience: "💪 Odolnosť",
                    ambition: "🚀 Ambícia",
                    creativity: "🎨 Kreativita",
                    serenity: "🧘 Pokoj",
                    courage: "⚡ Odvaha",
                    wisdom: "🦉 Múdrosť",
                    joy: "😊 Radosť"
                }
            }
        };
        
        this.init();
        this.bindEvents();
        this.loadStats();
        this.preloadedQuotes = new Map(); // Cache for preloaded quotes
        this.userPatterns = this.loadUserPatterns();
        console.log('VibeQuotes constructor completed');
    }

    init() {
        // DOM elements
        this.vibeSelect = document.getElementById('vibe-select');
        this.languageSelect = document.getElementById('language-select');
        this.generateBtn = document.getElementById('generate-btn');
        this.loader = document.getElementById('loader');
        this.quoteBox = document.getElementById('quote-box');
        this.copyBtn = document.getElementById('copy-btn');
        this.readBtn = document.getElementById('read-btn');
        this.quoteCount = document.getElementById('quote-count');
        this.quoteContainer = document.querySelector('.quote-container');
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.vibeAvatar = document.getElementById('vibe-avatar');
        this.loaderText = document.getElementById('loader-text');
        this.welcomeMessage = document.getElementById('welcome-message');
        
        // Authentication elements
        this.guestButtons = document.getElementById('guest-buttons');
        this.userMenu = document.getElementById('user-menu');
        this.userAvatar = document.getElementById('user-avatar');
        this.userName = document.getElementById('user-name');
        this.viewDashboardBtn = document.getElementById('view-dashboard');
        this.signOutBtn = document.getElementById('sign-out-btn');
        
        // History elements
        this.historyToggle = document.getElementById('history-toggle');
        this.historyPanel = document.getElementById('history-panel');
        this.historyList = document.getElementById('history-list');
        this.clearHistoryBtn = document.getElementById('clear-history');

        // State
        this.isLoading = false;
        this.currentVibe = '';
        this.currentLanguage = 'english';
        this.maxRetries = 3;
        this.currentRetries = 0;
        this.isSpeaking = false;
        this.isHistoryVisible = false;
        this.hasGeneratedQuote = false;

        // Rate limiting
        this.lastRequestTime = 0;
        this.requestCooldown = 0; // Disabled for testing (was 60000 = 1 minute)
        
        // Daily usage tracking
        this.dailyUsage = {
            used: 0,
            limit: 100,
            remaining: 100,
            resetTime: null
        };
        this.loadDailyUsage();
        
        // Theme management
        this.initTheme();
        
        // Language management
        this.initLanguage();
        
        // Authentication management
        this.initAuthentication();
        
        // History management
        this.quoteHistory = this.loadQuoteHistory();
        this.displayHistory();
        
        // Set initial vibe from dropdown value only if it exists
        this.currentVibe = this.vibeSelect ? this.vibeSelect.value : '';
        
        // Check if user has generated quotes before and show welcome message if needed
        this.checkWelcomeStatus();
        
        // Vibe avatars and messages
        this.vibeAvatars = {
            'gratitude': { avatar: '🙏', message: 'Finding grateful wisdom...' },
            'resilience': { avatar: '💪', message: 'Channeling inner strength...' },
            'ambition': { avatar: '🚀', message: 'Reaching for the stars...' },
            'creativity': { avatar: '🎨', message: 'Painting with imagination...' },
            'serenity': { avatar: '🧘‍♀️', message: 'Finding peaceful thoughts...' },
            'courage': { avatar: '🦁', message: 'Summoning brave hearts...' },
            'wisdom': { avatar: '🧙‍♂️', message: 'Consulting ancient wisdom...' },
            'joy': { avatar: '😊', message: 'Spreading happy vibes...' }
        };

        // Initialize contextual data
        this.userContext = {
            timezone: null,
            season: null,
            holiday: null
        };
        this.initializeContext();
        
        console.log('Init completed. currentVibe:', this.currentVibe, 'vibeSelect.value:', this.vibeSelect.value);
    }

    bindEvents() {
        // Enable/disable generate button based on vibe selection
        if (this.vibeSelect) {
            this.vibeSelect.addEventListener('change', (e) => {
                this.currentVibe = e.target.value;
                if (this.generateBtn) {
                    this.generateBtn.disabled = !this.currentVibe;
                }
                this.updateStats();
                
                // Show welcome message if no vibe is selected
                if (!this.currentVibe) {
                    this.showWelcomeMessage();
                    if (this.quoteBox) {
                        this.quoteBox.classList.remove('show');
                    }
                    if (this.copyBtn) {
                        this.copyBtn.style.display = 'none';
                    }
                    if (this.readBtn) {
                        this.readBtn.style.display = 'none';
                    }
                }
            });
        }

        // Language selection
        if (this.languageSelect) {
            this.languageSelect.addEventListener('change', (e) => {
                this.applyLanguage(e.target.value);
            });
        }

        // Generate quote button
        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => {
                if (!this.isRateLimited()) {
                    this.generateQuote();
                }
            });
        }

        // Copy quote button
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => {
                this.copyQuote();
            });
        }

        // Read quote button
        if (this.readBtn) {
            this.readBtn.addEventListener('click', () => {
                this.readQuoteAloud();
            });
        }

        // Theme toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // History toggle button
        if (this.historyToggle) {
            this.historyToggle.addEventListener('click', () => {
                this.toggleHistory();
            });
        }

        // Clear history button
        if (this.clearHistoryBtn) {
            this.clearHistoryBtn.addEventListener('click', () => {
                this.clearHistory();
            });
        }

        // Authentication event listeners
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.showLoginModal();
            });
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                this.showSignupModal();
            });
        }

        // Modal close buttons
        const closeLoginModal = document.getElementById('close-login-modal');
        const closeSignupModal = document.getElementById('close-signup-modal');
        
        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', () => {
                this.hideModal('login-modal');
            });
        }
        
        if (closeSignupModal) {
            closeSignupModal.addEventListener('click', () => {
                this.hideModal('signup-modal');
            });
        }

        // Modal form switch buttons
        const switchToSignup = document.getElementById('switch-to-signup');
        const switchToLogin = document.getElementById('switch-to-login');
        
        if (switchToSignup) {
            switchToSignup.addEventListener('click', () => {
                this.hideModal('login-modal');
                this.showSignupModal();
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', () => {
                this.hideModal('signup-modal');
                this.showLoginModal();
            });
        }

        // Form submissions
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get('email');
                const password = formData.get('password');
                
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Logging in...';
                submitBtn.disabled = true;
                
                await this.handleLogin(email, password);
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const name = formData.get('name');
                const email = formData.get('email');
                const password = formData.get('password');
                
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Creating Account...';
                submitBtn.disabled = true;
                
                await this.handleSignup(name, email, password);
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        }

        // Close modals when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        if (this.viewDashboardBtn) {
            this.viewDashboardBtn.addEventListener('click', () => {
                window.location.href = '/dashboard.html';
            });
        }

        if (this.signOutBtn) {
            this.signOutBtn.addEventListener('click', () => {
                this.signOut();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.generateBtn.disabled && !this.isLoading) {
                if (!this.isRateLimited()) {
                    this.generateQuote();
                }
            }
            if (e.key === 'c' && e.ctrlKey && this.quoteBox.textContent) {
                this.copyQuote();
                e.preventDefault();
            }
            if (e.key === 'h' && e.ctrlKey) {
                this.toggleHistory();
                e.preventDefault();
            }
        });

        // Close history panel when clicking outside (on mobile)
        document.addEventListener('click', (e) => {
            if (this.isHistoryVisible && 
                !this.historyPanel.contains(e.target) && 
                !this.historyToggle.contains(e.target) &&
                window.innerWidth <= 768) {
                this.toggleHistory();
            }
        });
    }

    isRateLimited() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.requestCooldown) {
            const remainingTime = Math.ceil((this.requestCooldown - timeSinceLastRequest) / 1000);
            this.showMessage(`Please wait ${remainingTime} seconds before generating another quote.`, 'warning');
            return true;
        }
        
        return false;
    }

    async generateQuote() {
        if (this.isLoading || !this.currentVibe) return;
        
        const selectedVibe = this.vibeSelect.value;
        const selectedLanguage = this.languageSelect.value;
        const cacheKey = `${selectedVibe}-${selectedLanguage}`;
        
        // Check if we have a preloaded quote for this combination
        if (this.preloadedQuotes.has(cacheKey)) {
            const cached = this.preloadedQuotes.get(cacheKey);
            // Use cached quote if it's less than 2 minutes old
            if (Date.now() - cached.timestamp < 2 * 60 * 1000) {
                this.preloadedQuotes.delete(cacheKey); // Remove from cache after use
                this.displayQuoteWithData(cached.data);
                this.updateUserPatterns(selectedVibe, selectedLanguage);
                this.preloadNextQuote(); // Preload another quote
                return;
            } else {
                this.preloadedQuotes.delete(cacheKey); // Remove stale cache
            }
        }

        this.currentRetries = 0;
        await this.attemptGenerateQuote();
    }

    async attemptGenerateQuote() {
        this.setLoadingState(true);
        this.lastRequestTime = Date.now();

        try {
            // Prepare context for more personalized quotes
            const requestBody = {
                vibe: this.currentVibe,
                language: this.currentLanguage,
                context: {
                    holiday: this.userContext.holiday
                }
            };

            const response = await fetch('/.netlify/functions/getBestQuote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                // Handle rate limiting specifically
                if (response.status === 429) {
                    this.updateDailyUsage(data);
                    this.showRateLimitMessage(data);
                    return;
                }
                throw new Error(data.error);
            }

            const { quote, vibe, usage } = data;

            // Update daily usage tracking
            if (usage) {
                this.updateDailyUsage(usage);
            } else {
                // If no usage data from server, increment locally
                this.incrementDailyUsage();
            }

            // Check for duplicates
            if (this.isDuplicateQuote(vibe, quote)) {
                this.currentRetries++;
                
                if (this.currentRetries < this.maxRetries) {
                    console.log(`Duplicate quote detected, retrying... (${this.currentRetries}/${this.maxRetries})`);
                    setTimeout(() => this.attemptGenerateQuote(), 1000);
                    return;
                } else {
                    console.log('Max retries reached, displaying quote anyway');
                }
            }

            // Store and display the quote with full data
            this.storeQuote(vibe, quote);
            this.displayQuoteWithData(data);
            
            // Add to history
            this.addToHistory(quote, vibe, this.currentLanguage);
            
            this.updateStats();

            // After successful quote generation, add:
            this.updateUserPatterns(vibe, this.currentLanguage);
            this.preloadNextQuote(); // Preload next likely quote

        } catch (error) {
            console.error('Error generating quote:', error);
            this.showMessage('Sorry, there was an error generating your quote. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        document.body.classList.toggle('loading', loading);
        
        const t = this.translations[this.currentLanguage] || this.translations.english;
        
        if (loading) {
            // Update avatar and message based on current vibe
            if (this.currentVibe && this.vibeAvatars[this.currentVibe]) {
                this.vibeAvatar.textContent = this.vibeAvatars[this.currentVibe].avatar;
                
                // Add contextual information to the message
                let message = this.vibeAvatars[this.currentVibe].message;
                if (this.userContext.holiday) {
                    message += ` (${this.userContext.holiday} edition)`;
                }
                
                this.loaderText.textContent = message;
            } else {
                this.vibeAvatar.textContent = '🤔';
                this.loaderText.textContent = 'Crafting your perfect quote...';
            }
            
            this.loader.classList.add('visible');
            this.generateBtn.textContent = t.generating;
            this.quoteBox.classList.remove('show');
            this.copyBtn.classList.remove('show');
        } else {
            this.loader.classList.remove('visible');
            this.generateBtn.textContent = t.generateBtn;
        }
    }

    displayQuote(quote) {
        // Hide welcome message on first quote
        if (!this.hasGeneratedQuote) {
            this.hideWelcomeMessage();
            this.hasGeneratedQuote = true;
        }

        // Add shimmer effect
        this.quoteContainer.classList.add('shimmer');
        
        setTimeout(() => {
            this.quoteBox.textContent = quote;
            this.quoteBox.classList.add('show');
            this.copyBtn.classList.add('show');
            this.readBtn.classList.add('show');
            this.copyBtn.style.display = 'block';
            this.readBtn.style.display = 'block';
            this.quoteContainer.classList.remove('shimmer');
        }, 300);
    }

    // Update displayQuote to handle full response data
    displayQuoteWithData(data) {
        // Add shimmer effect
        this.quoteContainer.classList.add('shimmer');
        
        setTimeout(() => {
            if (!data?.quote) {
                this.checkWelcomeStatus();
            } else {
                this.hideWelcomeMessage();
                this.hasGeneratedQuote = true;
                this.quoteBox.textContent = data.quote;
                
                // Apply background image if available
                if (data.backgroundImage) {
                    this.applyBackgroundImage(data.backgroundImage);
                }
                
                this.quoteBox.classList.add('show');
                this.copyBtn.classList.add('show');
                this.readBtn.classList.add('show');
                this.copyBtn.style.display = 'block';
                this.readBtn.style.display = 'block';
            }
            this.quoteContainer.classList.remove('shimmer');
        }, 300);
    }

    applyBackgroundImage(imageUrl) {
        // Create a subtle overlay background
        this.quoteContainer.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${imageUrl})`;
        this.quoteContainer.style.backgroundSize = 'cover';
        this.quoteContainer.style.backgroundPosition = 'center';
        this.quoteContainer.style.backgroundRepeat = 'no-repeat';
        
        // For dark theme, use darker overlay
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                      (!document.documentElement.getAttribute('data-theme') && 
                       window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDark) {
            this.quoteContainer.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${imageUrl})`;
        }
        
        // Add subtle animation
        this.quoteContainer.classList.add('has-background');
    }

    isDuplicateQuote(vibe, quote) {
        const storedQuotes = this.getStoredQuotes();
        return storedQuotes[vibe] && storedQuotes[vibe].includes(quote);
    }

    storeQuote(vibe, quote) {
        const storedQuotes = this.getStoredQuotes();
        
        if (!storedQuotes[vibe]) {
            storedQuotes[vibe] = [];
        }
        
        if (!storedQuotes[vibe].includes(quote)) {
            storedQuotes[vibe].push(quote);
            localStorage.setItem('vibeQuotes', JSON.stringify(storedQuotes));
        }
    }

    getStoredQuotes() {
        try {
            return JSON.parse(localStorage.getItem('vibeQuotes')) || {};
        } catch (error) {
            console.error('Error parsing stored quotes:', error);
            return {};
        }
    }

    updateStats() {
        if (!this.currentVibe || !this.quoteCount) {
            return;
        }

        const storedQuotes = this.getStoredQuotes();
        const count = storedQuotes[this.currentVibe] ? storedQuotes[this.currentVibe].length : 0;
        
        const vibeStats = count > 0 
            ? `You have ${count} quote${count === 1 ? '' : 's'} for ${this.currentVibe}`
            : `No quotes yet for ${this.currentVibe}`;
            
        const dailyStats = `Daily usage: ${this.dailyUsage.used}/${this.dailyUsage.limit} (${this.dailyUsage.remaining} remaining)`;
        
        this.quoteCount.innerHTML = `
            <div>${vibeStats}</div>
            <div style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.8rem;"></div>
        `;
    }

    loadStats() {
        // Display total quotes on load
        const storedQuotes = this.getStoredQuotes();
        const totalQuotes = Object.values(storedQuotes).reduce((sum, quotes) => sum + quotes.length, 0);
        
        if (totalQuotes > 0) {
            console.log(`Loaded ${totalQuotes} quotes from previous sessions`);
        }
    }

    async copyQuote() {
        if (!this.quoteBox.textContent) return;

        try {
            await navigator.clipboard.writeText(this.quoteBox.textContent);
            
            // Visual feedback
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '✅ Copied!';
            this.copyBtn.classList.add('copied');
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.classList.remove('copied');
            }, 2000);
            
            this.showMessage('Quote copied to clipboard!', 'success');
            
        } catch (error) {
            console.error('Failed to copy quote:', error);
            
            // Fallback for older browsers
            this.fallbackCopyText(this.quoteBox.textContent);
        }
    }

    async readQuoteAloud() {
        if (!this.quoteBox.textContent) return;

        // Check if speech synthesis is supported
        if (!('speechSynthesis' in window)) {
            this.showMessage('Text-to-speech is not supported in your browser.', 'error');
            return;
        }

        try {
            // Stop any currently playing speech
            if (this.isSpeaking) {
                speechSynthesis.cancel();
                this.resetReadButton();
                return;
            }

            const text = this.quoteBox.textContent;
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configure voice settings
            this.configureVoice(utterance);
            
            // Update button state
            this.setReadingState(true);
            
            // Handle speech events
            utterance.onend = () => {
                this.setReadingState(false);
            };
            
            utterance.onerror = (error) => {
                console.error('Speech synthesis error:', error);
                this.setReadingState(false);
                this.showMessage('Failed to read quote aloud.', 'error');
            };
            
            // Start speaking
            speechSynthesis.speak(utterance);
            
        } catch (error) {
            console.error('Error reading quote aloud:', error);
            this.showMessage('Failed to read quote aloud.', 'error');
            this.setReadingState(false);
        }
    }

    configureVoice(utterance) {
        // Language mapping for better voice selection
        const languageVoiceMap = {
            'english': 'en-US',
            'french': 'fr-FR',
            'german': 'de-DE',
            'spanish': 'es-ES',
            'portuguese': 'pt-PT',
            'italian': 'it-IT',
            'slovak': 'sk-SK'
        };

        const targetLang = languageVoiceMap[this.currentLanguage] || 'en-US';
        utterance.lang = targetLang;
        
        // Voice settings
        utterance.rate = 0.9; // Slightly slower for better comprehension
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a native voice for the language
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.startsWith(targetLang.split('-')[0])
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
    }

    setReadingState(isReading) {
        this.isSpeaking = isReading;
        const t = this.translations[this.currentLanguage] || this.translations.english;
        
        if (isReading) {
            this.readBtn.textContent = t.stopBtn;
            this.readBtn.classList.add('reading');
            this.showMessage('Reading quote aloud...', 'info');
        } else {
            this.resetReadButton();
        }
    }

    resetReadButton() {
        this.isSpeaking = false;
        const t = this.translations[this.currentLanguage] || this.translations.english;
        this.readBtn.textContent = t.readBtn;
        this.readBtn.classList.remove('reading');
    }

    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showMessage('Quote copied to clipboard!', 'success');
        } catch (error) {
            console.error('Fallback copy failed:', error);
            this.showMessage('Failed to copy quote. Please select and copy manually.', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    showMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.getElementById('message');
        
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                max-width: 300px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }

        // Set message type styles
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            warning: '#ed8936',
            info: '#4299e1'
        };

        messageEl.style.backgroundColor = colors[type] || colors.info;
        messageEl.textContent = message;
        
        // Show message
        requestAnimationFrame(() => {
            messageEl.style.transform = 'translateX(0)';
        });

        // Auto hide after 3 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    // Utility method to clear stored quotes (for testing)
    clearAllQuotes() {
        localStorage.removeItem('vibeQuotes');
        this.updateStats();
        
        // If no history either, show welcome message again
        if (this.quoteHistory.length === 0) {
            this.hasGeneratedQuote = false;
            this.showWelcomeMessage();
            
            // Hide quote display elements
            this.quoteBox.classList.remove('show');
            this.copyBtn.classList.remove('show');
            this.readBtn.classList.remove('show');
            this.copyBtn.style.display = 'none';
            this.readBtn.style.display = 'none';
        }
        
        console.log('All stored quotes cleared');
    }

    // Utility method to export quotes
    exportQuotes() {
        const quotes = this.getStoredQuotes();
        const dataStr = JSON.stringify(quotes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'vibe-quotes-export.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }

    initTheme() {
        // Check for saved theme preference or default to 'auto'
        const savedTheme = localStorage.getItem('theme') || 'auto';
        this.applyTheme(savedTheme);
        
        // Listen for system theme changes if using auto
        if (savedTheme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (localStorage.getItem('theme') === 'auto') {
                    this.applyTheme('auto');
                }
            });
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme;
        
        if (!currentTheme || currentTheme === 'auto') {
            // If auto or no theme, switch to opposite of system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            newTheme = prefersDark ? 'light' : 'dark';
        } else if (currentTheme === 'light') {
            newTheme = 'dark';
        } else {
            newTheme = 'light';
        }
        
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    applyTheme(theme) {
        if (theme === 'auto') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        
        // Update toggle icon - ensure it's always correct
        const isDark = theme === 'dark' || 
                      (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        // Make sure we have the theme icon element before setting
        if (this.themeIcon) {
            this.themeIcon.textContent = isDark ? '☀️' : '🌙';
        }
    }

    initLanguage() {
        // Check for saved language preference or default to 'english'
        const savedLanguage = localStorage.getItem('language') || 'english';
        this.currentLanguage = savedLanguage;
        this.languageSelect.value = savedLanguage;
        
        // Delay translation until after all initialization is complete
        setTimeout(() => {
            this.translateUI(savedLanguage);
        }, 50);
    }

    applyLanguage(language) {
        this.currentLanguage = language;
        this.languageSelect.value = language;
        localStorage.setItem('language', language);
        
        // Translate UI elements
        this.translateUI(language);
        
        console.log('Language changed to:', language);
    }

    translateUI(language) {
        const t = this.translations[language] || this.translations.english;
        
        // Add safety checks for all elements
        try {
            // Update title and subtitle
            const title = document.querySelector('.title');
            const subtitle = document.querySelector('.subtitle');
            if (title) title.textContent = t.title;
            if (subtitle) subtitle.textContent = t.subtitle;
            
            // Update form labels and buttons
            const label = document.querySelector('.label');
            const selectOption = document.querySelector('.select option[value=""]');
            if (label) label.textContent = t.chooseVibe;
            if (selectOption) selectOption.textContent = t.selectVibe;
            if (this.generateBtn) {
                this.generateBtn.textContent = this.isLoading ? t.generating : t.generateBtn;
            }
            
            // Update vibe options
            Object.keys(t.vibes).forEach(vibe => {
                const option = document.querySelector(`.select option[value="${vibe}"]`);
                if (option) {
                    option.textContent = t.vibes[vibe];
                }
            });
            
            // Update action buttons only if they exist and are visible
            if (this.copyBtn && this.copyBtn.style.display !== 'none') {
                this.copyBtn.textContent = t.copyBtn;
            }
            if (this.readBtn && this.readBtn.style.display !== 'none') {
                this.readBtn.textContent = this.isSpeaking ? t.stopBtn : t.readBtn;
            }
            
            // Update welcome message
            const welcomeTitle = document.querySelector('.welcome-title');
            const welcomeText = document.querySelector('.welcome-text');
            const featureSpans = document.querySelectorAll('.welcome-feature span:not(.feature-icon)');
            
            if (welcomeTitle) welcomeTitle.textContent = t.welcomeTitle;
            if (welcomeText) welcomeText.textContent = t.welcomeText;
            if (featureSpans[0]) featureSpans[0].textContent = t.feature1;
            if (featureSpans[1]) featureSpans[1].textContent = t.feature2;
            if (featureSpans[2]) featureSpans[2].textContent = t.feature3;
            
            // Update history section
            const historyText = document.querySelector('.history-text');
            const historyHeader = document.querySelector('.history-header h3');
            if (historyText) historyText.textContent = t.historyBtn;
            if (historyHeader) historyHeader.textContent = t.historyTitle;
            
            // Update history empty state if visible
            const historyEmpty = document.querySelector('.history-empty');
            if (historyEmpty && this.quoteHistory && this.quoteHistory.length === 0) {
                historyEmpty.innerHTML = `
                    <p>${t.historyEmpty1}</p>
                    <p>${t.historyEmpty2}</p>
                `;
            }
            
            // Update footer
            const footer = document.querySelector('.footer p');
            if (footer) footer.textContent = t.footerText;
            
            // Update page title
            if (document.title) {
                document.title = t.title + " - AI Inspirational Quote Generator";
            }
        } catch (error) {
            console.error('Translation error:', error);
            // Don't break the app if translation fails
        }
    }

    async initializeContext() {
        // Get user's timezone for reference
        this.userContext.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Detect current season and holidays
        this.updateSeasonalContext();
        
        console.log('Seasonal context:', this.userContext);
    }

    updateSeasonalContext() {
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const day = now.getDate();
        
        // Detect season (Northern Hemisphere - can be adjusted for Southern)
        if (month === 12 || month <= 2) {
            this.userContext.season = 'winter';
        } else if (month >= 3 && month <= 5) {
            this.userContext.season = 'spring';
        } else if (month >= 6 && month <= 8) {
            this.userContext.season = 'summer';
        } else {
            this.userContext.season = 'autumn';
        }

        // Detect holidays and special occasions
        this.userContext.holiday = this.detectHoliday(month, day);
    }

    detectHoliday(month, day) {
        const holidays = {
            'Christmas': { month: 12, day: 25 },
            'Christmas Season': { month: 12, dayRange: [20, 31] },
            'New Year': { month: 1, day: 1 },
            'New Year Season': { month: 1, dayRange: [1, 7] },
            'Valentine\'s Day': { month: 2, day: 14 },
            'Spring Equinox': { month: 3, dayRange: [19, 21] },
            'Easter Season': { month: 4, dayRange: [1, 30] }, // Approximate
            'Mother\'s Day': { month: 5, dayRange: [8, 14] }, // Second Sunday
            'Father\'s Day': { month: 6, dayRange: [15, 21] }, // Third Sunday
            'Summer Solstice': { month: 6, dayRange: [20, 22] },
            'Independence Day': { month: 7, day: 4 },
            'Back to School': { month: 9, dayRange: [1, 15] },
            'Autumn Equinox': { month: 9, dayRange: [21, 23] },
            'Halloween': { month: 10, day: 31 },
            'Thanksgiving': { month: 11, dayRange: [22, 28] },
            'Winter Solstice': { month: 12, dayRange: [20, 22] }
        };

        for (const [holiday, date] of Object.entries(holidays)) {
            if (date.month === month) {
                if (date.day && date.day === day) {
                    return holiday;
                } else if (date.dayRange && day >= date.dayRange[0] && day <= date.dayRange[1]) {
                    return holiday;
                }
            }
        }

        return null;
    }

    loadDailyUsage() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const stored = JSON.parse(localStorage.getItem('dailyUsage')) || {};
            
            // Reset if it's a new day
            if (stored.date !== today) {
                this.dailyUsage = {
                    used: 0,
                    limit: 100,
                    remaining: 100,
                    resetTime: null,
                    date: today
                };
                this.saveDailyUsage();
            } else {
                this.dailyUsage = { ...stored };
            }
        } catch (error) {
            console.error('Error loading daily usage:', error);
            this.resetDailyUsage();
        }
    }

    saveDailyUsage() {
        try {
            localStorage.setItem('dailyUsage', JSON.stringify(this.dailyUsage));
        } catch (error) {
            console.error('Error saving daily usage:', error);
        }
    }

    updateDailyUsage(usageData) {
        // Handle successful response with usage object
        if (usageData.daily !== undefined) {
            this.dailyUsage.used = usageData.daily;
        }
        // Handle rate limit response with direct values
        if (usageData.usage !== undefined) {
            this.dailyUsage.used = usageData.usage;
        }
        
        if (usageData.limit !== undefined) {
            this.dailyUsage.limit = usageData.limit;
        }
        if (usageData.remaining !== undefined) {
            this.dailyUsage.remaining = usageData.remaining;
        }
        if (usageData.resetTime) {
            this.dailyUsage.resetTime = usageData.resetTime;
        }
        
        this.dailyUsage.date = new Date().toISOString().split('T')[0];
        this.saveDailyUsage();
        this.updateStats();
    }

    incrementDailyUsage() {
        this.dailyUsage.used++;
        this.dailyUsage.remaining = Math.max(0, this.dailyUsage.limit - this.dailyUsage.used);
        this.dailyUsage.date = new Date().toISOString().split('T')[0];
        this.saveDailyUsage();
        this.updateStats();
    }

    resetDailyUsage() {
        const today = new Date().toISOString().split('T')[0];
        this.dailyUsage = {
            used: 0,
            limit: 100,
            remaining: 100,
            resetTime: null,
            date: today
        };
        this.saveDailyUsage();
    }

    showRateLimitMessage(data) {
        const resetTime = new Date(data.resetTime);
        const resetTimeStr = resetTime.toLocaleTimeString();
        
        this.showMessage(
            `Daily limit of ${data.limit} requests reached. Try again tomorrow at ${resetTimeStr}.`,
            'warning'
        );
    }

    async preloadNextQuote() {
        try {
            // Predict next likely vibe based on user patterns
            const predictedVibe = this.predictNextVibe();
            const currentLanguage = this.languageSelect.value;
            
            // Don't preload if we already have this combination cached
            const cacheKey = `${predictedVibe}-${currentLanguage}`;
            if (this.preloadedQuotes.has(cacheKey)) {
                return;
            }

            // Preload in background
            const response = await fetch('/.netlify/functions/getBestQuote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vibe: predictedVibe,
                    language: currentLanguage
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.preloadedQuotes.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
                
                // Clean old cached quotes (older than 5 minutes)
                this.cleanPreloadCache();
            }
        } catch (error) {
            console.log('Preload failed silently:', error);
        }
    }

    predictNextVibe() {
        // Simple prediction based on user's most used vibes
        const vibeUsage = this.userPatterns.vibeFrequency || {};
        const sortedVibes = Object.entries(vibeUsage)
            .sort(([,a], [,b]) => b - a)
            .map(([vibe]) => vibe);
        
        // Return most used vibe, or random if no history
        return sortedVibes[0] || this.getRandomVibe();
    }

    getRandomVibe() {
        const vibes = ['gratitude', 'resilience', 'ambition', 'creativity', 'serenity', 'courage', 'wisdom', 'joy'];
        return vibes[Math.floor(Math.random() * vibes.length)];
    }

    cleanPreloadCache() {
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        for (const [key, value] of this.preloadedQuotes.entries()) {
            if (value.timestamp < fiveMinutesAgo) {
                this.preloadedQuotes.delete(key);
            }
        }
    }

    loadUserPatterns() {
        try {
            return JSON.parse(localStorage.getItem('userPatterns')) || {
                vibeFrequency: {},
                languagePreference: 'en',
                averageReadingTime: 0,
                usageHours: []
            };
        } catch {
            return {
                vibeFrequency: {},
                languagePreference: 'en',
                averageReadingTime: 0,
                usageHours: []
            };
        }
    }

    updateUserPatterns(vibe, language) {
        // Track vibe usage
        this.userPatterns.vibeFrequency[vibe] = (this.userPatterns.vibeFrequency[vibe] || 0) + 1;
        
        // Track language preference
        this.userPatterns.languagePreference = language;
        
        // Track usage hour
        const currentHour = new Date().getHours();
        this.userPatterns.usageHours.push(currentHour);
        
        // Keep only last 50 usage hours
        if (this.userPatterns.usageHours.length > 50) {
            this.userPatterns.usageHours = this.userPatterns.usageHours.slice(-50);
        }
        
        // Save to localStorage
        localStorage.setItem('userPatterns', JSON.stringify(this.userPatterns));
    }

    // History Management Methods
    loadQuoteHistory() {
        try {
            return JSON.parse(localStorage.getItem('quoteHistory')) || [];
        } catch (error) {
            console.error('Error loading quote history:', error);
            return [];
        }
    }

    saveQuoteHistory() {
        try {
            localStorage.setItem('quoteHistory', JSON.stringify(this.quoteHistory));
        } catch (error) {
            console.error('Error saving quote history:', error);
        }
    }

    addToHistory(quote, vibe, language) {
        const historyItem = {
            id: Date.now(),
            quote: quote,
            vibe: vibe,
            language: language,
            timestamp: new Date().toISOString(),
            formattedTime: this.formatTimeAgo(new Date())
        };

        // Add to beginning of array
        this.quoteHistory.unshift(historyItem);
        
        // Keep only last 10 quotes
        if (this.quoteHistory.length > 10) {
            this.quoteHistory = this.quoteHistory.slice(0, 10);
        }

        this.saveQuoteHistory();
        this.displayHistory();
    }

    displayHistory() {
        // Check if history elements exist (they don't on the main page)
        if (!this.historyList) {
            return;
        }
        
        if (this.quoteHistory.length === 0) {
            this.historyList.innerHTML = `
                <div class="history-empty">
                    <p>No quotes yet!</p>
                    <p>Generate your first quote to see it here.</p>
                </div>
            `;
            return;
        }

        this.historyList.innerHTML = this.quoteHistory
            .map(item => this.createHistoryItemHTML(item))
            .join('');

        // Add event listeners to history items
        this.attachHistoryItemListeners();
    }

    createHistoryItemHTML(item) {
        const vibeEmojis = {
            'gratitude': '🙏',
            'resilience': '💪', 
            'ambition': '🚀',
            'creativity': '🎨',
            'serenity': '🧘‍♀️',
            'courage': '⚡',
            'wisdom': '🦉',
            'joy': '😊'
        };

        return `
            <div class="history-item" data-id="${item.id}">
                <div class="history-item-header">
                    <div class="history-vibe">
                        ${vibeEmojis[item.vibe] || '✨'} ${item.vibe}
                    </div>
                    <div class="history-time">${item.formattedTime}</div>
                </div>
                <p class="history-quote">${item.quote}</p>
                <div class="history-actions">
                    <button class="history-action-btn copy" data-action="copy">
                        📋 Copy
                    </button>
                    <button class="history-action-btn speak" data-action="speak">
                        🔊 Speak
                    </button>
                </div>
            </div>
        `;
    }

    attachHistoryItemListeners() {
        const historyItems = this.historyList.querySelectorAll('.history-item');
        
        historyItems.forEach(item => {
            const itemId = item.dataset.id;
            const historyData = this.quoteHistory.find(h => h.id == itemId);
            
            if (!historyData) return;

            // Click to load quote
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.history-actions')) {
                    this.loadHistoryQuote(historyData);
                }
            });

            // Action buttons
            const copyBtn = item.querySelector('[data-action="copy"]');
            const speakBtn = item.querySelector('[data-action="speak"]');

            copyBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyHistoryQuote(historyData.quote);
            });

            speakBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.speakHistoryQuote(historyData.quote, historyData.language);
            });
        });
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    }

    toggleHistory() {
        // Check if history elements exist
        if (!this.historyPanel || !this.historyToggle) {
            return;
        }
        
        this.isHistoryVisible = !this.isHistoryVisible;
        
        if (this.isHistoryVisible) {
            this.historyPanel.classList.add('visible');
            this.historyToggle.classList.add('active');
            // Update relative times when opening
            this.updateHistoryTimes();
        } else {
            this.historyPanel.classList.remove('visible');
            this.historyToggle.classList.remove('active');
        }
    }

    updateHistoryTimes() {
        this.quoteHistory.forEach(item => {
            item.formattedTime = this.formatTimeAgo(new Date(item.timestamp));
        });
        this.displayHistory();
    }

    clearHistory() {
        if (this.quoteHistory.length === 0) return;
        
        if (confirm('Are you sure you want to clear all quote history?')) {
            this.quoteHistory = [];
            this.saveQuoteHistory();
            this.displayHistory();
            this.showMessage('Quote history cleared!', 'success');
            
            // Check if we should show welcome message again
            const hasStoredQuotes = Object.keys(this.getStoredQuotes()).length > 0;
            if (!hasStoredQuotes) {
                this.hasGeneratedQuote = false;
                this.showWelcomeMessage();
                
                // Hide quote display elements only if they exist
                if (this.quoteBox) {
                    this.quoteBox.classList.remove('show');
                }
                if (this.copyBtn) {
                    this.copyBtn.classList.remove('show');
                    this.copyBtn.style.display = 'none';
                }
                if (this.readBtn) {
                    this.readBtn.classList.remove('show');
                    this.readBtn.style.display = 'none';
                }
            }
        }
    }

    loadHistoryQuote(historyData) {
        // Set the vibe and language to match the historical quote
        this.vibeSelect.value = historyData.vibe;
        this.languageSelect.value = historyData.language;
        this.currentVibe = historyData.vibe;
        this.currentLanguage = historyData.language;
        
        // Display the quote
        this.displayQuote(historyData.quote);
        
        // Update button states
        this.generateBtn.disabled = false;
        
        // Update stats
        this.updateStats();
        
        // Show success message
        this.showMessage('Quote loaded from history!', 'success');
        
        // Close history panel on mobile
        if (window.innerWidth <= 768) {
            this.toggleHistory();
        }
    }

    async copyHistoryQuote(quote) {
        try {
            await navigator.clipboard.writeText(quote);
            this.showMessage('Quote copied from history!', 'success');
        } catch (error) {
            console.error('Failed to copy quote:', error);
            this.fallbackCopyText(quote);
        }
    }

    speakHistoryQuote(quote, language) {
        if (!('speechSynthesis' in window)) {
            this.showMessage('Text-to-speech not supported in your browser.', 'error');
            return;
        }

        // Stop any currently playing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(quote);
        
        // Language mapping for better voice selection
        const languageVoiceMap = {
            'english': 'en-US',
            'french': 'fr-FR',
            'german': 'de-DE',
            'spanish': 'es-ES',
            'portuguese': 'pt-PT',
            'italian': 'it-IT',
            'slovak': 'sk-SK'
        };

        utterance.lang = languageVoiceMap[language] || 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        speechSynthesis.speak(utterance);
        this.showMessage('Playing quote from history!', 'info');
    }

    checkWelcomeStatus() {
        console.log('checkWelcomeStatus called, currentVibe:', this.currentVibe);
        
        // Always show welcome message if no vibe is selected, regardless of history
        if (!this.currentVibe || this.currentVibe === '') {
            console.log('No vibe selected, showing welcome message');
            this.hasGeneratedQuote = false;
            this.showWelcomeMessage();
            // Also hide quote elements when showing welcome
            this.quoteBox.classList.remove('show');
            this.copyBtn.style.display = 'none';
            this.readBtn.style.display = 'none';
            return;
        }
        
        console.log('Vibe selected:', this.currentVibe);
        // Check if user has generated quotes before by looking at history or stored quotes
        const hasHistory = this.quoteHistory.length > 0;
        const hasStoredQuotes = Object.keys(this.getStoredQuotes()).length > 0;
        
        if (hasHistory || hasStoredQuotes) {
            this.hasGeneratedQuote = true;
            this.hideWelcomeMessage();
        } else {
            this.hasGeneratedQuote = false;
            this.showWelcomeMessage();
        }
    }

    showWelcomeMessage() {
        console.log('showWelcomeMessage called, welcomeMessage element:', this.welcomeMessage);
        if (this.welcomeMessage) {
            console.log('Removing hidden class and setting display to flex');
            this.welcomeMessage.classList.remove('hidden');
            this.welcomeMessage.style.display = 'flex';
            console.log('Welcome message classes after show:', this.welcomeMessage.className);
            console.log('Welcome message style after show:', this.welcomeMessage.style.display);
        }
    }

    hideWelcomeMessage() {
        if (this.welcomeMessage) {
            this.welcomeMessage.classList.add('hidden');
            setTimeout(() => {
                this.welcomeMessage.style.display = 'none';
            }, 500); // Wait for animation to complete
        }
    }

    // Authentication Methods
    async initAuthentication() {
        try {
            // Check if user is already authenticated
            const response = await fetch('/.netlify/functions/auth-user', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    // Only redirect if we're on the main page and user is authenticated
                    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                        console.log('User already authenticated, redirecting to dashboard');
                        window.location.href = '/dashboard.html';
                        return;
                    } else {
                        // We're on the dashboard, update the UI
                        this.updateAuthenticationState(data.user);
                    }
                } else {
                    this.showAuthButtons();
                }
            } else {
                this.showAuthButtons();
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            this.showAuthButtons();
        }
    }

    updateAuthenticationState(user) {
        this.user = user;
        this.isAuthenticated = true;
        
        // Update UI to show user info
        if (this.userName) this.userName.textContent = user.name;
        
        // Show user menu, hide auth buttons
        if (this.userMenu) this.userMenu.style.display = 'flex';
        if (this.guestButtons) this.guestButtons.style.display = 'none';
        
        console.log('User authenticated:', user.name);
    }

    showAuthButtons() {
        this.user = null;
        this.isAuthenticated = false;
        
        // Show auth buttons, hide user menu
        if (this.guestButtons) this.guestButtons.style.display = 'flex';
        if (this.userMenu) this.userMenu.style.display = 'none';
    }

    // Modal Methods
    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    showSignupModal() {
        const modal = document.getElementById('signup-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }

    // Authentication API calls
    async handleLogin(email, password) {
        try {
            const response = await fetch('/.netlify/functions/auth-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.updateAuthenticationState(data.user);
                this.hideModal('login-modal');
                this.showMessage('Welcome back! Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after successful login
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
                
                return true;
            } else {
                this.showMessage(data.error || 'Login failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Login failed. Please try again.', 'error');
            return false;
        }
    }

    async handleSignup(name, email, password) {
        try {
            const response = await fetch('/.netlify/functions/auth-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.updateAuthenticationState(data.user);
                this.hideModal('signup-modal');
                this.showMessage('Welcome to Vibe Quotes! Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after successful signup
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
                
                return true;
            } else {
                this.showMessage(data.error || 'Signup failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showMessage('Signup failed. Please try again.', 'error');
            return false;
        }
    }

    async signOut() {
        try {
            const response = await fetch('/.netlify/functions/auth-logout', {
                method: 'GET',
                credentials: 'include'
            });
            
            // Update UI regardless of response
            this.showAuthButtons();
            this.showMessage('Signed out successfully', 'success');
            
            // Optionally reload the page to reset state
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error('Sign out error:', error);
            // Still update UI on error
            this.showAuthButtons();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing VibeQuotes');
    window.vibeQuotes = new VibeQuotes();
    
    // Force check welcome status after initialization
    setTimeout(() => {
        console.log('Force checking welcome status after init');
        console.log('Current vibe value:', window.vibeQuotes.vibeSelect.value);
        console.log('Current vibe state:', window.vibeQuotes.currentVibe);
        window.vibeQuotes.checkWelcomeStatus();
    }, 100);
    
    // Add development helpers to window object
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.clearQuotes = () => window.vibeQuotes.clearAllQuotes();
        window.exportQuotes = () => window.vibeQuotes.exportQuotes();
        window.resetDailyUsage = () => window.vibeQuotes.resetDailyUsage();
        window.clearHistory = () => window.vibeQuotes.clearHistory();
        window.exportHistory = () => {
            const history = window.vibeQuotes.quoteHistory;
            const dataStr = JSON.stringify(history, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'quote-history-export.json';
            link.click();
            URL.revokeObjectURL(url);
        };
        window.resetToWelcome = () => {
            // Clear all localStorage data
            localStorage.removeItem('vibeQuotes');
            localStorage.removeItem('quoteHistory');
            localStorage.removeItem('dailyUsage');
            localStorage.removeItem('userPatterns');
            
            // Reset app state
            window.vibeQuotes.quoteHistory = [];
            window.vibeQuotes.hasGeneratedQuote = false;
            
            // Hide quote elements
            window.vibeQuotes.quoteBox.classList.remove('show');
            window.vibeQuotes.copyBtn.classList.remove('show');
            window.vibeQuotes.readBtn.classList.remove('show');
            window.vibeQuotes.copyBtn.style.display = 'none';
            window.vibeQuotes.readBtn.style.display = 'none';
            
            // Force show welcome message
            window.vibeQuotes.showWelcomeMessage();
            window.vibeQuotes.displayHistory();
            window.vibeQuotes.updateStats();
            
            console.log('Complete reset to welcome state');
        };
        
        window.forceShowWelcome = () => {
            window.vibeQuotes.showWelcomeMessage();
            console.log('Forced welcome message to show');
        };
        
        console.log('Development mode: Use clearQuotes(), exportQuotes(), resetDailyUsage(), clearHistory(), exportHistory(), resetToWelcome(), and forceShowWelcome() for testing');
    }
});

// Service Worker registration for offline functionality (optional)
// Temporarily disabled during development to prevent caching issues
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/ 