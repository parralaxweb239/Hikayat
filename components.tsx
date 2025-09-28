import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Story, User, Artwork } from './types';

// ========= ICONS ========= //

export const SunIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M12 12a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
  </svg>
);

export const MoonIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

export const StarIcon = ({ className, filled }: { className?: string; filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

export const HeartIcon = ({ className, filled }: { className?: string; filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

export const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

export const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" fill="#FFFFFF"/>
    </svg>
);


// ========= THEME TOGGLE ========= //

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => (
  <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-navy-800 transition-colors duration-200">
    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
  </button>
);

// ========= NAVBAR ========= //

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: User | null;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, currentUser, onLoginClick }) => (
  <header className="sticky top-0 z-50 bg-white/80 dark:bg-navy-950/80 backdrop-blur-sm shadow-md dark:shadow-navy-900">
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold text-navy-700 dark:text-white">
          Hikayat <span className="text-navy-500">حكايات</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/gallery" className="text-gray-600 dark:text-gray-300 hover:text-navy-600 dark:hover:text-white transition-colors">Gallery</Link>
          <Link to="/write" className="text-gray-600 dark:text-gray-300 hover:text-navy-600 dark:hover:text-white transition-colors">Write</Link>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          {currentUser ? (
            <Link to={`/profile/${currentUser.id}`}>
              <img src={currentUser.profilePicture} alt={currentUser.username} className="w-10 h-10 rounded-full border-2 border-navy-500" />
            </Link>
          ) : (
            <Button onClick={onLoginClick}>Login</Button>
          )}
        </div>
      </div>
    </nav>
  </header>
);

// ========= BUTTON ========= //

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: "bg-navy-600 text-white hover:bg-navy-700 focus:ring-navy-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};


// ========= STORY CARD ========= //

interface StoryCardProps {
  story: Story;
  author?: User;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, author }) => {
  const avgRating = useMemo(() => {
    if (!story.ratings.length) return 0;
    const sum = story.ratings.reduce((acc, r) => acc + r.score, 0);
    return (sum / story.ratings.length).toFixed(1);
  }, [story.ratings]);

  return (
    <div className="bg-white dark:bg-navy-900 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group">
      <Link to={`/story/${story.id}`}>
        <img className="w-full h-48 object-cover" src={story.coverImage} alt={story.title} />
      </Link>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          <Link to={`/story/${story.id}`} className="hover:text-navy-600 dark:hover:text-navy-400 transition-colors">{story.title}</Link>
        </h3>
        {author && (
          <Link to={`/profile/${author.id}`} className="flex items-center mb-4">
            <img src={author.profilePicture} alt={author.username} className="w-8 h-8 rounded-full mr-3" />
            <span className="text-gray-600 dark:text-gray-400 hover:text-navy-600 dark:hover:text-white transition-colors">{author.username}</span>
          </Link>
        )}
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">{story.content}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <StarIcon className="w-5 h-5 text-yellow-500" filled />
            <span>{avgRating} ({story.ratings.length})</span>
          </div>
          <div className="flex items-center space-x-1">
            <HeartIcon className="w-5 h-5 text-red-500" filled />
            <span>{story.likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========= STAR RATING ========= //

interface StarRatingProps {
  totalStars: number;
  rating: number;
  onRate: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ totalStars, rating, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            onClick={() => onRate(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            className="focus:outline-none"
          >
            <StarIcon 
              className={`w-8 h-8 cursor-pointer transition-colors duration-150 ${starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
              filled={starValue <= (hoverRating || rating)} 
            />
          </button>
        );
      })}
    </div>
  );
};


// ========= AUTH MODAL ("STAR WINDOW") ========= //

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSocialLogin: (provider: 'google' | 'facebook') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSocialLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 ease-in-out scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-navy-600 dark:bg-navy-700 p-5 rounded-full shadow-lg">
          <StarIcon className="w-16 h-16 text-yellow-300" filled />
        </div>
        <div className="pt-20 p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome to Hikayat</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Choose your preferred platform to sign up or log in with a single touch.</p>
          <div className="space-y-4">
            <button onClick={() => onSocialLogin('google')} className="w-full flex items-center justify-center px-4 py-3 rounded-md font-semibold bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700 transition-all duration-200">
                <GoogleIcon className="w-5 h-5 mr-3"/>
                Continue with Gmail
            </button>
            <button onClick={() => onSocialLogin('facebook')} className="w-full flex items-center justify-center px-4 py-3 rounded-md font-semibold bg-[#1877F2] text-white hover:bg-[#166fe5] transition-all duration-200">
                <FacebookIcon className="w-5 h-5 mr-3"/>
                Continue with Facebook
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
            For demonstration purposes, this will create or log in as a sample social user.
          </p>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

// ========= ARTWORK CARD ========= //

interface ArtworkCardProps {
  artwork: Artwork;
  author?: User;
  currentUser: User | null;
  onToggleLike: (artworkId: string) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, author, currentUser, onToggleLike }) => {
  const isLiked = currentUser && artwork.likes.includes(currentUser.id);
  
  return (
    <div className="bg-white dark:bg-navy-900 rounded-lg shadow-lg overflow-hidden group break-inside-avoid">
      <div className="relative">
        <img className="w-full h-auto object-cover bg-gray-100 dark:bg-navy-800" src={artwork.imageUrl} alt={artwork.title} />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <p className="text-white text-center text-sm">{artwork.description}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">{artwork.title}</h3>
        <div className="flex justify-between items-center mt-2">
            {author && (
              <Link to={`/profile/${author.id}`} className="flex items-center group/author">
                <img src={author.profilePicture} alt={author.username} className="w-6 h-6 rounded-full mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover/author:text-navy-600 dark:group-hover/author:text-white transition-colors">{author.username}</span>
              </Link>
            )}
            <button onClick={() => onToggleLike(artwork.id)} disabled={!currentUser} className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <HeartIcon className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`} filled={!!isLiked} />
                <span>{artwork.likes.length}</span>
            </button>
        </div>
      </div>
    </div>
  );
};


// ========= PUBLISHING WARNING ========= //

export const PublishingWarning = () => (
    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 rounded-r-lg" role="alert">
        <h4 className="font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            Warning: Visual Publishing Standards
        </h4>
        <p className="mt-2 text-sm">Please note that this feature is intended to encourage original creation. It is strictly prohibited to upload any images or drawings that fall under the following categories:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>Content that violates public decency or general publishing laws.</li>
            <li>Copyrighted Material uploaded without explicit permission from the owner.</li>
        </ul>
        <p className="mt-2 text-sm">Any infringing content will be deleted, and necessary actions will be taken against the publishing account.</p>
    </div>
);


// ========= AUTO-SAVE INDICATOR ========= //
export type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface AutoSaveIndicatorProps {
    status: SaveStatus;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ status }) => {
    const messages = {
        unsaved: 'Unsaved changes',
        saving: 'Saving...',
        saved: 'All changes saved',
    };
    const colors = {
        unsaved: 'text-yellow-600 dark:text-yellow-400',
        saving: 'text-blue-600 dark:text-blue-400',
        saved: 'text-green-600 dark:text-green-400',
    };

    return (
        <div className={`text-sm transition-colors duration-300 ${colors[status]}`}>
            {messages[status]}
        </div>
    );
};


// ========= FOOTER ========= //
export const Footer = () => (
    <footer className="bg-white dark:bg-navy-900 shadow-inner mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Hikayat. A place for tales and stories.</p>
        </div>
    </footer>
);