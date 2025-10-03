# 🚀 Portfolio Tracker - Modern Investment Portfolio Manager

A sophisticated, mobile-first portfolio tracking application built with Vue 3, featuring stunning glassmorphism design and comprehensive investment tracking capabilities.

![Portfolio Tracker](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-FF6B35?style=for-the-badge&logo=pwa&logoColor=white)

## ✨ Features

### 🎨 Premium Design System
- **Glassmorphism UI**: Cutting-edge glass-effect cards with backdrop blur
- **Modern Dark Theme**: Sophisticated dark color scheme with gradients
- **Swipe Navigation**: Touch-friendly portfolio value switching
- **Smooth Animations**: Fluid transitions and delightful micro-interactions
- **Mobile-First Responsive**: Optimized for mobile, beautiful on all devices

### 💎 Advanced Investment Tracking
- **Multi-Asset Portfolio**: Gold (22/24 Ayar, Çeyrek, Tam), Silver, USD, EUR
- **Smart Asset Grouping**: Automatic consolidation of same asset types
- **Multi-Currency Views**: Instantly switch between TL, USD, EUR, Gold equivalent
- **Transaction History**: Complete audit trail of all portfolio changes
- **Real-time Calculations**: Live portfolio value updates across all currencies

### 🔧 Technical Excellence
- **Vue 3 Composition API**: Latest Vue.js with modern reactivity
- **Vuex State Management**: Predictable state container
- **Modular SCSS + TailwindCSS**: Scalable styling architecture
- **PWA Capabilities**: Install as native app, offline support
- **Local Storage Persistence**: Zero-latency data access

### 📱 User Experience
- **Bottom Navigation**: Native mobile app feel
- **Modal Interactions**: Smooth asset addition workflow
- **Settings Panel**: Price transparency and data management
- **Swipe Gestures**: Natural touch interactions
- **Sticky Header**: Always accessible actions

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vue 3** | ^3.5.22 | Progressive JavaScript framework |
| **Vite** | ^7.1.7 | Next-generation build tool |
| **Vuex** | ^4.1.0 | State management pattern |
| **Vue Router** | ^4.5.1 | Single-page application routing |
| **SCSS** | ^1.93.2 | CSS preprocessor |
| **TailwindCSS** | ^4.1.13 | Utility-first CSS framework |
| **Axios** | ^1.12.2 | HTTP client for API calls |
| **PWA Plugin** | ^1.0.3 | Progressive web app features |

## 📁 Project Structure

```
src/
├── components/              # Reusable Vue components
│   ├── AddItemModal.vue        # Asset addition modal
│   ├── PortfolioSection.vue    # Main portfolio display
│   ├── HistorySection.vue      # Transaction history
│   ├── SettingsSection.vue     # App settings
│   └── ...
├── pages/                   # Page components
│   └── Home.vue               # Main application page
├── store/                   # Vuex store
│   └── index.js               # Centralized state management
├── styles/                  # SCSS modules
│   ├── _variables.scss        # Design system variables
│   ├── _base.scss            # Base styles
│   ├── _components.scss      # Component styles
│   └── _utilities.scss       # Utility classes
└── router/                  # Vue Router
    └── index.js              # Route definitions
```

## 🛠️ Development Setup

### Prerequisites
- Node.js ^20.19.0 || >=22.12.0
- npm or yarn package manager

### Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/esatakpunar/portfolio-tracker.git

# Navigate to project directory
cd portfolio-tracker

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot-reload
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Core Features

### Portfolio Management
- ➕ **Add Assets**: Quick modal-based asset addition
- 🔄 **Auto-Grouping**: Same asset types automatically consolidated
- 🗑️ **Remove Assets**: Simple deletion with confirmation
- 💱 **Multi-Currency**: TL, USD, EUR, Gold equivalent views

### User Interface
- 📱 **Mobile-First**: Designed for mobile, enhanced for desktop
- ⚡ **Swipe Navigation**: Touch-friendly value switching
- 🎨 **Glassmorphism**: Modern glass-effect design
- 🔄 **Smooth Transitions**: Fluid animations throughout

### Data Management
- 💾 **Local Storage**: Persistent data without server
- 📊 **Transaction History**: Complete audit trail
- ⚙️ **Settings Panel**: Price view and data management
- 🔄 **Reset Capability**: Clean slate option

## 🚀 Roadmap

### Near Term (1-2 weeks)
- [ ] Real-time price API integration  
- [ ] Asset editing functionality
- [ ] Data export (CSV/JSON)
- [ ] Theme switcher

### Medium Term (1-2 months)
- [ ] Interactive charts and graphs
- [ ] Price alerts and notifications
- [ ] Historical price data
- [ ] Additional currency support

### Long Term (3+ months)  
- [ ] User accounts and authentication
- [ ] Cloud synchronization
- [ ] Advanced analytics
- [ ] Social sharing features

## 💰 Asset Support

| Category | Assets | Notes |
|----------|--------|-------|
| **Gold** | 22 Ayar, 24 Ayar, Çeyrek, Tam | Automatic gram conversion |
| **Currencies** | USD, EUR | Major forex pairs |
| **Precious Metals** | Silver (gram-based) | Commodity tracking |

## 🎨 Design System

- **Colors**: Dark theme with gradient accents
- **Typography**: System fonts for optimal readability  
- **Spacing**: 8px grid system
- **Components**: Glassmorphism cards and modals
- **Animations**: 300ms ease-out transitions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
