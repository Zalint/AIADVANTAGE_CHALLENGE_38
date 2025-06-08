// Vibe Quotes - JavaScript Logic
class VibeQuotes {
    constructor() {
        this.init();
        this.bindEvents();
        this.loadStats();
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

        // State
        this.isLoading = false;
        this.currentVibe = '';
        this.currentLanguage = 'english';
        this.maxRetries = 3;
        this.currentRetries = 0;
        this.isSpeaking = false;

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
    }

    bindEvents() {
        // Enable/disable generate button based on vibe selection
        this.vibeSelect.addEventListener('change', (e) => {
            this.currentVibe = e.target.value;
            this.generateBtn.disabled = !this.currentVibe;
            this.updateStats();
        });

        // Language selection
        this.languageSelect.addEventListener('change', (e) => {
            this.applyLanguage(e.target.value);
        });

        // Generate quote button
        this.generateBtn.addEventListener('click', () => {
            if (!this.isRateLimited()) {
                this.generateQuote();
            }
        });

        // Copy quote button
        this.copyBtn.addEventListener('click', () => {
            this.copyQuote();
        });

        // Read quote button
        this.readBtn.addEventListener('click', () => {
            this.readQuoteAloud();
        });

        // Theme toggle button
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

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

            // Store and display the quote
            this.storeQuote(vibe, quote);
            this.displayQuote(quote);
            this.updateStats();

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
            this.generateBtn.textContent = 'Generating...';
            this.quoteBox.classList.remove('show');
            this.copyBtn.classList.remove('show');
        } else {
            this.loader.classList.remove('visible');
            this.generateBtn.textContent = 'Generate Quote';
        }
    }

    displayQuote(quote) {
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
        if (!this.currentVibe) {
            this.quoteCount.textContent = '';
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
        
        if (isReading) {
            this.readBtn.textContent = '⏹️ Stop';
            this.readBtn.classList.add('reading');
            this.showMessage('Reading quote aloud...', 'info');
        } else {
            this.resetReadButton();
        }
    }

    resetReadButton() {
        this.isSpeaking = false;
        this.readBtn.textContent = '🔊 Read Aloud';
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
    }

    applyLanguage(language) {
        this.currentLanguage = language;
        this.languageSelect.value = language;
        localStorage.setItem('language', language);
        console.log('Language changed to:', language);
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vibeQuotes = new VibeQuotes();
    
    // Add development helpers to window object
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.clearQuotes = () => window.vibeQuotes.clearAllQuotes();
        window.exportQuotes = () => window.vibeQuotes.exportQuotes();
        window.resetDailyUsage = () => window.vibeQuotes.resetDailyUsage();
        console.log('Development mode: Use clearQuotes(), exportQuotes(), and resetDailyUsage() for testing');
    }
});

// Service Worker registration for offline functionality (optional)
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