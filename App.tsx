import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { HashRouter, Routes, Route, useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar, StoryCard, StarRating, AuthModal, Button, Footer, ArtworkCard, PublishingWarning, GoogleIcon, FacebookIcon, AutoSaveIndicator, SaveStatus } from './components';
import { mockUsers, mockStories, mockArtworks } from './data';
import type { User, Story, Rating, Artwork } from './types';

// ========= CONTEXTS ========= //

type Theme = 'light' | 'dark';
type SocialProvider = 'google' | 'facebook';

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void; }>({ theme: 'light', toggleTheme: () => {} });
const AuthContext = createContext<{ 
    currentUser: User | null; 
    handleSocialLogin: (provider: SocialProvider) => void; 
    logout: () => void; 
}>({ 
    currentUser: null, 
    handleSocialLogin: () => {}, 
    logout: () => {} 
});

const DataContext = createContext<{ 
    users: User[]; 
    stories: Story[];
    artworks: Artwork[];
    currentUser: User | null;
    findUser: (id: string) => User | undefined;
    findStory: (id: string) => Story | undefined;
    toggleLike: (storyId: string) => void;
    addRating: (storyId: string, score: number) => void;
    toggleFollow: (userId: string) => void;
    updateUser: (updatedUser: User) => void;
    addStory: (story: Omit<Story, 'id' | 'authorId' | 'ratings' | 'likes'>) => void;
    addArtwork: (artwork: Omit<Artwork, 'id' | 'authorId' | 'likes'>) => void;
    toggleArtworkLike: (artworkId: string) => void;
    linkAccount: (provider: SocialProvider) => void;
}>({ 
    users: [], 
    stories: [],
    artworks: [],
    currentUser: null,
    findUser: () => undefined,
    findStory: () => undefined,
    toggleLike: () => {},
    addRating: () => {},
    toggleFollow: () => {},
    updateUser: () => {},
    addStory: () => {},
    addArtwork: () => {},
    toggleArtworkLike: () => {},
    linkAccount: () => {},
});

const useTheme = () => useContext(ThemeContext);
const useAuth = () => useContext(AuthContext);
const useData = () => useContext(DataContext);


// ========= PAGE COMPONENTS ========= //

const HomePage = () => {
    const { stories, findUser } = useData();
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Latest Stories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map(story => (
                    <StoryCard key={story.id} story={story} author={findUser(story.authorId)} />
                ))}
            </div>
        </main>
    );
};

const StoryDetailPage = () => {
    const { storyId } = useParams<{ storyId: string }>();
    const { findStory, findUser, currentUser, toggleLike, addRating } = useData();
    
    const story = findStory(storyId!);
    const author = story ? findUser(story.authorId) : undefined;
    
    if (!story || !author) {
        return <div className="text-center py-20 text-gray-700 dark:text-gray-300">Story not found.</div>;
    }

    const isLiked = currentUser && story.likes.includes(currentUser.id);
    const userRating = currentUser && story.ratings.find(r => r.userId === currentUser.id);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-navy-900 rounded-lg shadow-xl overflow-hidden">
                <img src={story.coverImage} alt={story.title} className="w-full h-64 md:h-96 object-cover" />
                <div className="p-6 md:p-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{story.title}</h1>
                    <Link to={`/profile/${author.id}`} className="flex items-center mb-6 group">
                        <img src={author.profilePicture} alt={author.username} className="w-12 h-12 rounded-full mr-4 border-2 border-transparent group-hover:border-navy-500 transition-all"/>
                        <div>
                            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 group-hover:text-navy-600 dark:group-hover:text-navy-400">{author.username}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                        </div>
                    </Link>
                    <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{story.content}</p>

                    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Button onClick={() => toggleLike(story.id)} disabled={!currentUser} variant={isLiked ? 'primary' : 'secondary'} className="flex items-center gap-2">
                                <span className={`${isLiked ? 'text-red-400' : 'text-gray-500'}`}>{isLiked ? '♥' : '♡'}</span>
                                {isLiked ? 'Liked' : 'Like'} ({story.likes.length})
                            </Button>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{userRating ? 'Your rating:' : 'Rate this story:'}</p>
                            <StarRating totalStars={10} rating={userRating?.score || 0} onRate={(score) => addRating(story.id, score)} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

const ProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const { stories, findUser, currentUser, toggleFollow } = useData();
    const profileUser = findUser(userId!);
    
    if (!profileUser) {
        return <div className="text-center py-20 text-gray-700 dark:text-gray-300">User not found.</div>;
    }

    const userStories = stories.filter(s => s.authorId === profileUser.id);
    const isFollowing = currentUser?.following.includes(profileUser.id);
    const isSelf = currentUser?.id === profileUser.id;

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-navy-900 rounded-lg shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 mb-8">
                    <img src={profileUser.profilePicture} alt={profileUser.username} className="w-32 h-32 rounded-full ring-4 ring-navy-500/50" />
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profileUser.username}</h1>
                        <div className="flex justify-center md:justify-start space-x-6 my-4 text-gray-600 dark:text-gray-400">
                            <span><strong className="dark:text-white">{userStories.length}</strong> Stories</span>
                            <span><strong className="dark:text-white">{profileUser.followers.length}</strong> Followers</span>
                            <span><strong className="dark:text-white">{profileUser.following.length}</strong> Following</span>
                        </div>
                        {isSelf ? (
                           <Link to="/settings"><Button variant="secondary">Edit Profile</Button></Link>
                        ) : (
                           <Button onClick={() => toggleFollow(profileUser.id)} disabled={!currentUser}>
                               {isFollowing ? 'Unfollow' : 'Follow'}
                           </Button>
                        )}
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Stories by {profileUser.username}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userStories.map(story => <StoryCard key={story.id} story={story} />)}
                </div>
            </div>
        </main>
    );
};

const WritePage = () => {
    const { currentUser, addStory } = useData();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const DRAFT_KEY = `hikayat-story-draft-${currentUser?.id}`;
    const initialLoadRef = useRef(true);

    // Load draft from local storage on mount
    useEffect(() => {
        if (!currentUser) return;
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            const { title, content } = JSON.parse(savedDraft);
            setTitle(title);
            setContent(content);
        }
    }, [currentUser, DRAFT_KEY]);

    // Auto-save logic
    useEffect(() => {
        if (initialLoadRef.current) {
            initialLoadRef.current = false;
            return;
        }

        setSaveStatus('unsaved');
        const timeoutId = setTimeout(() => {
            setSaveStatus('saving');
            if (currentUser) {
                localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content }));
            }
            setTimeout(() => setSaveStatus('saved'), 500);
        }, 4000);

        return () => clearTimeout(timeoutId);
    }, [title, content, currentUser, DRAFT_KEY]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && content && coverImage && currentUser) {
            addStory({ title, content, coverImage });
            localStorage.removeItem(DRAFT_KEY);
            navigate(`/profile/${currentUser.id}`);
        } else {
            alert('Please fill all fields and upload a cover image.');
        }
    };

    if (!currentUser) {
        return <div className="text-center py-20 text-gray-700 dark:text-gray-300">Please log in to write a story.</div>;
    }

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-navy-900 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Write a New Story</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm text-gray-900 dark:text-white"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image</label>
                        <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-navy-700 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {coverImage ? <img src={coverImage} alt="Cover preview" className="mx-auto h-32 w-auto object-cover rounded-md" /> : <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="cover-upload" className="relative cursor-pointer bg-white dark:bg-navy-900 rounded-md font-medium text-navy-600 hover:text-navy-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-navy-500">
                                        <span>Upload a file</span>
                                        <input id="cover-upload" name="cover-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Story</label>
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={15} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                           <AutoSaveIndicator status={saveStatus} />
                           <Button type="submit">Publish Story</Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

const SettingsPage = () => {
    const { currentUser, updateUser, linkAccount } = useData();
    const navigate = useNavigate();
    const [username, setUsername] = useState(currentUser?.username || '');
    const [profilePicture, setProfilePicture] = useState(currentUser?.profilePicture || null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(URL.createObjectURL(e.target.files[0]));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUser && username && profilePicture) {
            updateUser({ ...currentUser, username, profilePicture });
            alert('Profile updated!');
            navigate(`/profile/${currentUser.id}`);
        }
    };

    if (!currentUser) return <div className="text-center py-20 text-gray-700 dark:text-gray-300">Not logged in.</div>

    const isGoogleLinked = !!currentUser.socialLinks?.google;
    const isFacebookLinked = !!currentUser.socialLinks?.facebook;

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-navy-900 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                        <div className="mt-2 flex items-center gap-4">
                            {profilePicture && <img src={profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover"/>}
                            <label htmlFor="pfp-upload" className="cursor-pointer bg-white dark:bg-navy-800 py-2 px-3 border border-gray-300 dark:border-navy-700 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-700 focus:outline-none">
                                <span>Change</span>
                                <input id="pfp-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm text-gray-900 dark:text-white"/>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-navy-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Linking</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Connect your social accounts for fast and secure sign-in.</p>
                        <div className="space-y-3">
                           <button type="button" onClick={() => linkAccount('google')} disabled={isGoogleLinked} className="w-full flex items-center justify-center px-4 py-3 rounded-md font-semibold bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
                               <GoogleIcon className="w-5 h-5 mr-3"/>
                               {isGoogleLinked ? 'Linked with Gmail' : 'Link with Gmail'}
                           </button>
                           <button type="button" onClick={() => linkAccount('facebook')} disabled={isFacebookLinked} className="w-full flex items-center justify-center px-4 py-3 rounded-md font-semibold bg-[#1877F2] text-white hover:bg-[#166fe5] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
                               <FacebookIcon className="w-5 h-5 mr-3"/>
                               {isFacebookLinked ? 'Linked with Facebook' : 'Link with Facebook'}
                           </button>
                        </div>
                    </div>
                     <div>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const GalleryPage = () => {
    const { artworks, findUser, currentUser, toggleArtworkLike } = useData();
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Creators' Gallery</h1>
                {currentUser && <Link to="/gallery/upload"><Button>Upload Artwork</Button></Link>}
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
                {artworks.map(art => (
                    <ArtworkCard 
                        key={art.id} 
                        artwork={art} 
                        author={findUser(art.authorId)}
                        currentUser={currentUser}
                        onToggleLike={toggleArtworkLike}
                    />
                ))}
            </div>
        </main>
    );
};

const UploadArtworkPage = () => {
    const { currentUser, addArtwork } = useData();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const DRAFT_KEY = `hikayat-artwork-draft-${currentUser?.id}`;
    const initialLoadRef = useRef(true);

    // Load draft
    useEffect(() => {
        if (!currentUser) return;
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            const { title, description } = JSON.parse(savedDraft);
            setTitle(title);
            setDescription(description);
        }
    }, [currentUser, DRAFT_KEY]);

    // Auto-save logic for text fields
    useEffect(() => {
        if (initialLoadRef.current) {
            initialLoadRef.current = false;
            return;
        }

        setSaveStatus('unsaved');
        const timeoutId = setTimeout(() => {
            setSaveStatus('saving');
            if (currentUser) {
                localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, description }));
            }
            setTimeout(() => setSaveStatus('saved'), 500);
        }, 4000);

        return () => clearTimeout(timeoutId);
    }, [title, description, currentUser, DRAFT_KEY]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && description && imageUrl && currentUser) {
            addArtwork({ title, description, imageUrl });
            localStorage.removeItem(DRAFT_KEY);
            navigate('/gallery');
        } else {
            alert('Please fill all fields and upload your artwork.');
        }
    };

    if (!currentUser) {
        return <div className="text-center py-20 text-gray-700 dark:text-gray-300">Please log in to upload artwork.</div>;
    }

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-navy-900 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Share Your Artwork</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="art-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="art-title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm text-gray-900 dark:text-white"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Artwork</label>
                        <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-navy-700 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imageUrl ? <img src={imageUrl} alt="Artwork preview" className="mx-auto h-40 w-auto object-contain rounded-md" /> : <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="art-upload" className="relative cursor-pointer bg-white dark:bg-navy-900 rounded-md font-medium text-navy-600 hover:text-navy-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-navy-500">
                                        <span>Upload a file</span>
                                        <input id="art-upload" name="art-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Max resolution 2K (2048x1080)</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="art-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea id="art-description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                           <AutoSaveIndicator status={saveStatus} />
                           <Button type="submit">Publish Artwork</Button>
                        </div>
                    </div>
                </form>
                <PublishingWarning />
            </div>
        </main>
    );
};


// ========= APP COMPONENT ========= //

function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [artworks, setArtworks] = useState<Artwork[]>(mockArtworks);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  const handleSocialLogin = (provider: SocialProvider) => {
    const mockSocialId = `mock-${provider}-id-${Date.now()}`;
    
    // 1. Check if a user with this social link already exists
    let user = users.find(u => u.socialLinks?.[provider] === mockSocialId);

    // 2. If not, create a new mock user for this social provider
    if (!user) {
        const newUser: User = {
            id: `user-${Date.now()}`,
            username: provider === 'google' ? 'Google User' : 'Facebook User',
            profilePicture: `https://picsum.photos/seed/${provider}${Date.now()}/200/200`,
            followers: [],
            following: [],
            socialLinks: { [provider]: mockSocialId }
        };
        setUsers(prev => [...prev, newUser]);
        user = newUser;
    }
    
    // 3. Log in as the found/created user
    setCurrentUser(user);
    setAuthModalOpen(false);
  };
  
  const logout = () => setCurrentUser(null);
  
  const findUser = useCallback((id: string) => users.find(u => u.id === id), [users]);
  const findStory = useCallback((id: string) => stories.find(s => s.id === id), [stories]);

  const toggleLike = useCallback((storyId: string) => {
    if (!currentUser) return;
    setStories(prevStories => prevStories.map(s => {
        if (s.id === storyId) {
            const liked = s.likes.includes(currentUser.id);
            const newLikes = liked ? s.likes.filter(id => id !== currentUser.id) : [...s.likes, currentUser.id];
            return { ...s, likes: newLikes };
        }
        return s;
    }));
  }, [currentUser]);

  const addRating = useCallback((storyId: string, score: number) => {
    if (!currentUser) return;
    setStories(prevStories => prevStories.map(s => {
        if (s.id === storyId) {
            const existingRatingIndex = s.ratings.findIndex(r => r.userId === currentUser.id);
            let newRatings: Rating[];
            if (existingRatingIndex > -1) {
                newRatings = [...s.ratings];
                newRatings[existingRatingIndex] = { userId: currentUser.id, score };
            } else {
                newRatings = [...s.ratings, { userId: currentUser.id, score }];
            }
            return { ...s, ratings: newRatings };
        }
        return s;
    }));
  }, [currentUser]);

  const toggleFollow = useCallback((userIdToFollow: string) => {
    if (!currentUser || currentUser.id === userIdToFollow) return;
    setUsers(prevUsers => {
        const isFollowing = currentUser.following.includes(userIdToFollow);
        return prevUsers.map(user => {
            if (user.id === currentUser.id) {
                const newFollowing = isFollowing ? user.following.filter(id => id !== userIdToFollow) : [...user.following, userIdToFollow];
                setCurrentUser({...user, following: newFollowing});
                return {...user, following: newFollowing};
            }
            if (user.id === userIdToFollow) {
                const newFollowers = isFollowing ? user.followers.filter(id => id !== currentUser.id) : [...user.followers, currentUser.id];
                return {...user, followers: newFollowers};
            }
            return user;
        });
    });
  }, [currentUser]);
  
  const updateUser = (updatedUser: User) => {
    if (!currentUser) return;
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  const linkAccount = (provider: SocialProvider) => {
    if (!currentUser || currentUser.socialLinks?.[provider]) return;
    const mockSocialId = `mock-${provider}-id-${Date.now()}`;
    const updatedUser = {
        ...currentUser,
        socialLinks: {
            ...currentUser.socialLinks,
            [provider]: mockSocialId
        }
    };
    updateUser(updatedUser);
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account linked successfully!`);
  }

  const addStory = (story: Omit<Story, 'id' | 'authorId' | 'ratings' | 'likes'>) => {
    if (!currentUser) return;
    const newStory: Story = {
        ...story,
        id: `story-${Date.now()}`,
        authorId: currentUser.id,
        ratings: [],
        likes: []
    };
    setStories(prev => [newStory, ...prev]);
  };

  const addArtwork = (artwork: Omit<Artwork, 'id' | 'authorId' | 'likes'>) => {
    if (!currentUser) return;
    const newArtwork: Artwork = {
      ...artwork,
      id: `art-${Date.now()}`,
      authorId: currentUser.id,
      likes: []
    };
    setArtworks(prev => [newArtwork, ...prev]);
  };
  
  const toggleArtworkLike = useCallback((artworkId: string) => {
    if (!currentUser) return;
    setArtworks(prevArtworks => prevArtworks.map(art => {
      if (art.id === artworkId) {
        const liked = art.likes.includes(currentUser.id);
        const newLikes = liked ? art.likes.filter(id => id !== currentUser.id) : [...art.likes, currentUser.id];
        return { ...art, likes: newLikes };
      }
      return art;
    }));
  }, [currentUser]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ currentUser, handleSocialLogin, logout }}>
          <DataContext.Provider value={{ users, stories, artworks, currentUser, findUser, findStory, toggleLike, addRating, toggleFollow, updateUser, addStory, addArtwork, toggleArtworkLike, linkAccount }}>
              <HashRouter>
                <div className="flex flex-col min-h-screen font-sans text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-navy-950">
                    <Navbar theme={theme} toggleTheme={toggleTheme} currentUser={currentUser} onLoginClick={() => setAuthModalOpen(true)} />
                    <div className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/story/:storyId" element={<StoryDetailPage />} />
                            <Route path="/profile/:userId" element={<ProfilePage />} />
                            <Route path="/write" element={<WritePage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/gallery" element={<GalleryPage />} />
                            <Route path="/gallery/upload" element={<UploadArtworkPage />} />
                        </Routes>
                    </div>
                    <Footer />
                    <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} onSocialLogin={handleSocialLogin} />
                </div>
              </HashRouter>
          </DataContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;