import React, { useState, useCallback, useMemo } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import StoryDetail from './pages/StoryDetail';
import Profile from './pages/Profile';
import WriteStudio from './pages/WriteStudio';
import StarWindow from './components/StarWindow';
import { View } from './types';

const AppContent: React.FC = () => {
    const { theme } = useTheme();
    const [view, setView] = useState<View>({ page: 'home' });
    const [isLoginOpen, setLoginOpen] = useState(false);
    const { currentUser } = useAuth();
    const { getStory } = useData();

    React.useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const navigate = useCallback((newView: View) => {
        if (newView.page === 'write' && !currentUser) {
            setLoginOpen(true);
            return;
        }
        setView(newView);
        window.scrollTo(0, 0);
    }, [currentUser]);

    const renderContent = () => {
        switch (view.page) {
            case 'home':
                return <Home navigate={navigate} />;
            case 'story':
                const story = view.storyId ? getStory(view.storyId) : undefined;
                return story ? <StoryDetail story={story} navigate={navigate} /> : <Home navigate={navigate} />;
            case 'profile':
                 return view.userId ? <Profile userId={view.userId} navigate={navigate} /> : <Home navigate={navigate} />;
            case 'write':
                const storyToWrite = view.storyId ? getStory(view.storyId) : undefined;
                return <WriteStudio navigate={navigate} storyToEdit={storyToWrite} />;
            default:
                return <Home navigate={navigate} />;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-navy min-h-screen text-slate-700 dark:text-light-slate font-sans transition-colors duration-300">
            <Header navigate={navigate} onLoginClick={() => setLoginOpen(true)} />
            <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-150px)]">
                {renderContent()}
            </main>
            <Footer />
            {isLoginOpen && <StarWindow onClose={() => setLoginOpen(false)} />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <DataProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </DataProvider>
        </ThemeProvider>
    );
};

export default App;