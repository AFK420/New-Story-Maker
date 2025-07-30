import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Main Dashboard Component
const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [storiesRes, charactersRes, worldsRes] = await Promise.all([
        axios.get(`${API}/stories`),
        axios.get(`${API}/characters`),
        axios.get(`${API}/worlds`)
      ]);
      
      setStories(storiesRes.data);
      setCharacters(charactersRes.data);
      setWorlds(worldsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading your creative universe...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-cyan-400">Story Universe</h1>
            <nav className="flex space-x-6">
              <Link to="/create-story" className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition duration-200">
                Create Story
              </Link>
              <Link to="/create-character" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition duration-200">
                Create Character
              </Link>
              <Link to="/create-world" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition duration-200">
                Create World
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400">{stories.length}</div>
            <div className="text-gray-300">Stories</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">{characters.length}</div>
            <div className="text-gray-300">Characters</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400">{worlds.length}</div>
            <div className="text-gray-300">Worlds</div>
          </div>
        </div>

        {/* Recent Stories */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Your Stories</h2>
          {stories.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">No stories yet. Start your creative journey!</p>
              <Link to="/create-story" className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg inline-block transition duration-200">
                Create Your First Story
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Link key={story.id} to={`/story/${story.id}`} className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition duration-200">
                  <h3 className="text-xl font-bold mb-2 text-white">{story.title}</h3>
                  <p className="text-gray-400 mb-2">by {story.author || 'Unknown Author'}</p>
                  <p className="text-sm text-gray-500 mb-3">Genre: {story.structure?.genre || 'Not specified'}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      story.status === 'planning' ? 'bg-yellow-600' :
                      story.status === 'writing' ? 'bg-blue-600' :
                      story.status === 'draft' ? 'bg-orange-600' : 'bg-green-600'
                    }`}>
                      {story.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {story.character_ids?.length || 0} characters
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/create-story" className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-6 text-center hover:shadow-lg transition duration-200">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bold mb-2">Start a New Story</h3>
              <p className="text-cyan-100">Begin crafting your next masterpiece</p>
            </Link>
            <Link to="/create-character" className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-center hover:shadow-lg transition duration-200">
              <div className="text-4xl mb-3">🎭</div>
              <h3 className="text-xl font-bold mb-2">Design a Character</h3>
              <p className="text-purple-100">Create complex, compelling personalities</p>
            </Link>
            <Link to="/create-world" className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-center hover:shadow-lg transition duration-200">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-xl font-bold mb-2">Build a World</h3>
              <p className="text-emerald-100">Craft immersive, detailed universes</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

// Create Story Component
const CreateStory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    structure: {
      genre: '',
      theme: '',
      tone: '',
      setting_overview: '',
      target_audience: ''
    },
    plot: {
      premise: '',
      inciting_incident: '',
      plot_points: '',
      climax: '',
      resolution: ''
    },
    synopsis: '',
    notes: '',
    status: 'planning'
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/stories`, formData);
      navigate(`/story/${response.data.id}`);
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-cyan-400">← Story Universe</Link>
            <h1 className="text-2xl font-bold">Create New Story</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Basic Information */}
          <section className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 text-cyan-400">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Story Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="Enter your story title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="Your name"
                />
              </div>
            </div>
          </section>

          {/* Story Structure */}
          <section className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 text-cyan-400">Story Structure</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <textarea
                    name="structure.genre"
                    value={formData.structure.genre}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                    placeholder="Describe your genre (e.g., 'Dark fantasy with psychological thriller elements')"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <textarea
                    name="structure.theme"
                    value={formData.structure.theme}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                    placeholder="What's your story really about? (e.g., 'The cost of power', 'Finding identity')"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tone</label>
                  <textarea
                    name="structure.tone"
                    value={formData.structure.tone}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                    placeholder="How should it feel? (e.g., 'Dark and brooding with moments of hope')"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <textarea
                    name="structure.target_audience"
                    value={formData.structure.target_audience}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                    placeholder="Who is this for? (e.g., 'Young adults who love complex characters')"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Setting Overview</label>
                <textarea
                  name="structure.setting_overview"
                  value={formData.structure.setting_overview}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="Where and when does your story take place? Paint the broad picture..."
                />
              </div>
            </div>
          </section>

          {/* Plot Structure */}
          <section className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 text-cyan-400">Plot Development</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Premise</label>
                <textarea
                  name="plot.premise"
                  value={formData.plot.premise}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="What's the basic setup of your story? The 'what if' scenario..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Inciting Incident</label>
                <textarea
                  name="plot.inciting_incident"
                  value={formData.plot.inciting_incident}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="What event kicks off the main story? What disrupts normal life?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Key Plot Points</label>
                <textarea
                  name="plot.plot_points"
                  value={formData.plot.plot_points}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="Major beats, turning points, revelations... Outline the story's spine..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Climax</label>
                  <textarea
                    name="plot.climax"
                    value={formData.plot.climax}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                    placeholder="The big confrontation, revelation, or moment of truth..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Resolution</label>
                  <textarea
                    name="plot.resolution"
                    value={formData.plot.resolution}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                    placeholder="How does it all end? What's the new normal?"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Additional Details */}
          <section className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 text-cyan-400">Additional Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Synopsis</label>
                <textarea
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="Write a compelling summary of your story..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes & Ideas</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="Any additional thoughts, inspiration, or reminders..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                >
                  <option value="planning">Planning</option>
                  <option value="writing">Writing</option>
                  <option value="draft">Draft</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-bold text-lg transition duration-200"
            >
              {loading ? 'Creating Story...' : 'Create Story'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-story" element={<CreateStory />} />
          <Route path="/create-character" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><div className="text-xl">Character Creator - Coming Soon!</div></div>} />
          <Route path="/create-world" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><div className="text-xl">World Builder - Coming Soon!</div></div>} />
          <Route path="/story/:id" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><div className="text-xl">Story View - Coming Soon!</div></div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;