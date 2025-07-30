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

// Create Character Component
const CreateCharacter = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    genre: '',
    role_in_story: '',
    physical_description: '',
    personal_symbol_object: '',
    psychology: {
      core_belief_self: '',
      core_belief_world: '',
      desire_vs_need: '',
      primary_coping_mechanism: '',
      emotional_blind_spot: '',
      trigger_points: '',
      emotional_armor: ''
    },
    conflicts: {
      internal_conflict: '',
      external_conflict: '',
      moral_dilemma: '',
      unconscious_fear: '',
      biggest_regret: '',
      source_of_shame: '',
      self_sabotaging_behavior: ''
    },
    background: {
      defining_childhood_moment: '',
      first_major_betrayal: '',
      past_love_or_loss: '',
      family_role_dynamic: '',
      education_street_smarts: '',
      criminal_record_secret: ''
    },
    moral_edges: {
      line_never_cross: '',
      worst_thing_done: '',
      justification_wrongdoing: '',
      villain_origin: '',
      self_destruction_path: ''
    },
    social_dynamics: {
      public_vs_private_self: '',
      group_role: '',
      love_language_attachment: '',
      treatment_of_weak: '',
      jealousy_triggers: '',
      loyalty_level: ''
    },
    quirks: {
      weird_habits: '',
      physical_tics: '',
      obsessions_hobbies: '',
      voice_speech_pattern: '',
      what_makes_laugh: '',
      what_makes_cry: ''
    },
    narrative: {
      symbol_color_motif: '',
      character_arc_word: '',
      theme_connection: '',
      peak_collapse_timing: '',
      ending_feeling: ''
    },
    relationships: ''
  });

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

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
      const response = await axios.post(`${API}/characters`, formData);
      navigate('/');
    } catch (error) {
      console.error('Error creating character:', error);
      alert('Failed to create character. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'basic', title: 'Basic Info', icon: '👤' },
    { id: 'psychology', title: 'Psychology', icon: '🧠' },
    { id: 'conflicts', title: 'Conflicts', icon: '⚔️' },
    { id: 'background', title: 'Background', icon: '📚' },
    { id: 'moral', title: 'Moral Edges', icon: '⚖️' },
    { id: 'social', title: 'Social', icon: '👥' },
    { id: 'quirks', title: 'Quirks', icon: '✨' },
    { id: 'narrative', title: 'Narrative', icon: '📖' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-cyan-400">← Story Universe</Link>
            <h1 className="text-2xl font-bold">Create New Character</h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Side Navigation */}
        <div className="w-64 bg-gray-800 min-h-screen p-6">
          <h3 className="text-lg font-bold mb-4 text-purple-400">Character Sections</h3>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-3 ${
                  activeSection === section.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <form onSubmit={handleSubmit} className="max-w-4xl">
            
            {/* Basic Information */}
            {activeSection === 'basic' && (
              <section className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center">
                  <span className="text-3xl mr-3">👤</span>
                  Basic Information
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Character Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="Enter character name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Age</label>
                      <input
                        type="text"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="e.g., '25', 'Early thirties', 'Ageless'"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Genre/Setting</label>
                      <textarea
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="What genre/world does this character belong to?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Role in Story</label>
                      <textarea
                        name="role_in_story"
                        value={formData.role_in_story}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="Protagonist, antagonist, mentor, comic relief, etc..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Physical Description</label>
                    <textarea
                      name="physical_description"
                      value={formData.physical_description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                      placeholder="Describe their appearance, mannerisms, how they carry themselves..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Personal Symbol/Object</label>
                    <textarea
                      name="personal_symbol_object"
                      value={formData.personal_symbol_object}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                      placeholder="A meaningful object, tattoo, piece of jewelry, or symbol that represents them..."
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Psychology Section */}
            {activeSection === 'psychology' && (
              <section className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center">
                  <span className="text-3xl mr-3">🧠</span>
                  Core Psychology
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Core Belief About Self</label>
                      <textarea
                        name="psychology.core_belief_self"
                        value={formData.psychology.core_belief_self}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="What do they believe about themselves? (e.g., 'I'm unworthy of love')"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Core Belief About the World</label>
                      <textarea
                        name="psychology.core_belief_world"
                        value={formData.psychology.core_belief_world}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="What do they believe about the world? (e.g., 'People only care about power')"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Desire vs Need</label>
                    <textarea
                      name="psychology.desire_vs_need"
                      value={formData.psychology.desire_vs_need}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                      placeholder="What do they think they want vs what they actually need to grow? (e.g., Wants revenge but needs to forgive)"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Coping Mechanism</label>
                      <textarea
                        name="psychology.primary_coping_mechanism"
                        value={formData.psychology.primary_coping_mechanism}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="How do they deal with stress? (Humor, isolation, violence, etc.)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Emotional Blind Spot</label>
                      <textarea
                        name="psychology.emotional_blind_spot"
                        value={formData.psychology.emotional_blind_spot}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="What emotional truth do they consistently miss about themselves?"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Emotional Triggers</label>
                      <textarea
                        name="psychology.trigger_points"
                        value={formData.psychology.trigger_points}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="What pushes their buttons? Makes them lose control?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Emotional Armor</label>
                      <textarea
                        name="psychology.emotional_armor"
                        value={formData.psychology.emotional_armor}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="How do they protect themselves emotionally? (Sarcasm, control, etc.)"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Conflicts Section */}
            {activeSection === 'conflicts' && (
              <section className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center">
                  <span className="text-3xl mr-3">⚔️</span>
                  Internal & External Conflicts
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Internal Conflict</label>
                      <textarea
                        name="conflicts.internal_conflict"
                        value={formData.conflicts.internal_conflict}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="What do they struggle with emotionally or morally?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">External Conflict</label>
                      <textarea
                        name="conflicts.external_conflict"
                        value={formData.conflicts.external_conflict}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="Who or what opposes them physically or socially?"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Moral Dilemma</label>
                    <textarea
                      name="conflicts.moral_dilemma"
                      value={formData.conflicts.moral_dilemma}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                      placeholder="What moral choice do they struggle with? (e.g., Kill to save many?)"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Unconscious Fear</label>
                      <textarea
                        name="conflicts.unconscious_fear"
                        value={formData.conflicts.unconscious_fear}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="What are they afraid of that they're not even aware of?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Biggest Regret</label>
                      <textarea
                        name="conflicts.biggest_regret"
                        value={formData.conflicts.biggest_regret}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="One decision they'd reverse in a heartbeat..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Source of Shame</label>
                      <textarea
                        name="conflicts.source_of_shame"
                        value={formData.conflicts.source_of_shame}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="Deep, hidden shame that haunts them..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Self-Sabotaging Behavior</label>
                      <textarea
                        name="conflicts.self_sabotaging_behavior"
                        value={formData.conflicts.self_sabotaging_behavior}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="How do they get in their own way? Push people away?"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Background Section */}
            {activeSection === 'background' && (
              <section className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center">
                  <span className="text-3xl mr-3">📚</span>
                  Life & Past Impact
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Defining Childhood Moment</label>
                    <textarea
                      name="background.defining_childhood_moment"
                      value={formData.background.defining_childhood_moment}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                      placeholder="One thing from childhood that shaped who they are today..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Major Betrayal</label>
                      <textarea
                        name="background.first_major_betrayal"
                        value={formData.background.first_major_betrayal}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="When did they learn not to trust easily?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Past Love or Loss</label>
                      <textarea
                        name="background.past_love_or_loss"
                        value={formData.background.past_love_or_loss}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="Someone they never got over? A loss that changed them?"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Family Role & Dynamics</label>
                      <textarea
                        name="background.family_role_dynamic"
                        value={formData.background.family_role_dynamic}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="Golden child? Scapegoat? Forgotten middle? Family dynamics..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Education & Street Smarts</label>
                      <textarea
                        name="background.education_street_smarts"
                        value={formData.background.education_street_smarts}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                        placeholder="Not just degrees - what 'life lessons' shaped their worldview?"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Secrets & Hidden Past</label>
                    <textarea
                      name="background.criminal_record_secret"
                      value={formData.background.criminal_record_secret}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
                      placeholder="Hidden past, secrets, things they don't want others to know..."
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-bold text-lg transition duration-200"
              >
                {loading ? 'Creating Character...' : 'Create Character'}
              </button>
            </div>
          </form>
        </main>
      </div>
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

          <Route path="/create-world" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><div className="text-xl">World Builder - Coming Soon!</div></div>} />
          <Route path="/story/:id" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><div className="text-xl">Story View - Coming Soon!</div></div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;