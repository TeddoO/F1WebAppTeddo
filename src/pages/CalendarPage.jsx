import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Flag, Zap, MessageSquare, Send } from 'lucide-react';
import { f1Calendar, getRaceStatus, raceResults, getDriverById, getTeamById } from '@/data/f1Data';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const CalendarPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRace, setSelectedRace] = useState(null);
  const [commentText, setCommentText] = useState('');

  const getRaceComments = (raceId) => {
    const stored = localStorage.getItem(`race_comments_${raceId}`);
    return stored ? JSON.parse(stored) : [];
  };

  const addComment = (raceId) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to comment",
        variant: "destructive"
      });
      return;
    }

    if (!commentText.trim()) return;

    const comments = getRaceComments(raceId);
    comments.push({
      username: currentUser.username,
      text: commentText,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(`race_comments_${raceId}`, JSON.stringify(comments));
    setCommentText('');
    
    toast({
      title: "Comment posted!",
      description: "Your comment has been added",
    });
    
    setSelectedRace(null);
    setTimeout(() => setSelectedRace(raceId), 10);
  };

  const getPodium = (raceId) => {
    const result = raceResults[raceId];
    if (!result) return null;
    
    // For simplicity in calendar view, just show Main Race podium if available
    const mainPodium = result.mainRace ? result.mainRace.podium : null;
    if (!mainPodium) return null;

    return mainPodium.slice(0, 3).map(pos => {
      const driver = getDriverById(pos.driverId);
      const team = getTeamById(driver?.teamId);
      return { driver, team, position: pos.position };
    });
  };

  const RaceCard = ({ race }) => {
    // Validate race object and provide defaults
    if (!race || typeof race !== 'object') {
      return null;
    }

    const {
      id = null,
      name = 'Unknown Race',
      location = 'Unknown',
      country = 'Unknown',
      startDate = null,
      endDate = null,
      circuit = 'Unknown Circuit',
      hasSprint = false
    } = race;

    // Validate required date properties
    if (!startDate || !endDate) {
      return null;
    }

    const status = getRaceStatus(race);
    const podium = getPodium(id);
    const comments = getRaceComments(id);
    const isExpanded = selectedRace === id;

    const statusConfig = {
      'Finalizado': { color: 'from-green-500 to-emerald-500', text: 'Completed' },
      'Em andamento': { color: 'from-yellow-500 to-orange-500', text: 'Live Now' },
      'Em breve': { color: 'from-blue-500 to-cyan-500', text: 'Upcoming' }
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Round {id}</div>
              <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
              <div className="flex flex-col space-y-1 text-gray-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>{location}, {country}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>{new Date(startDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flag className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">{circuit}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${statusConfig[status].color} text-white font-semibold text-sm`}>
                {statusConfig[status].text}
                </div>
                {hasSprint && (
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                        <Zap className="w-3 h-3" /> SPRINT
                    </div>
                )}
            </div>
          </div>

          {/* Podium */}
          {status === 'Finalizado' && podium && (
            <div className="mt-6 space-y-2">
              <div className="text-sm font-semibold text-gray-400 mb-3">MAIN RACE PODIUM</div>
              {podium.map((item, index) => (
                <motion.div
                  key={item.position}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg"
                  style={{ backgroundColor: `${item.team.color}20` }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: item.team.color }}
                  >
                    {item.position}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{item.driver.name}</div>
                    <div className="text-sm" style={{ color: item.team.color }}>{item.team.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Comments */}
          {status === 'Finalizado' && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedRace(isExpanded ? null : id)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{comments.length} comments</span>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  {/* Comment input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onKeyPress={(e) => e.key === 'Enter' && addComment(id)}
                    />
                    <Button
                      onClick={() => addComment(id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Comments list */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {comments.map((comment, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white text-sm">{comment.username}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <Layout>
      <Helmet>
        <title>Race Calendar - F1 Predictions 2026</title>
        <meta name="description" content="View the complete F1 2026 race calendar with results and reactions" />
      </Helmet>

      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1669289904056-b597173e2d8b)',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-4"
          >
            2026 Race Calendar
          </motion.h1>
          <p className="text-xl text-gray-300">24 races across the globe</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* View Toggle */}
        <div className="flex justify-end mb-8">
          <div className="bg-white/5 rounded-lg p-1 flex space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Races */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {f1Calendar.map((race, index) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;