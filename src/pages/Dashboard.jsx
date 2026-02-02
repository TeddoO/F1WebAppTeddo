import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Flag, Users, Calendar, ArrowRight, MapPin, Zap } from 'lucide-react';
import { f1Calendar, f1Drivers, f1Teams, getCompletedRaces, getNextRace, getDriverById, getTeamById } from '@/data/f1Data';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const completedRaces = getCompletedRaces();
  const nextRace = getNextRace();
  
  const accentColor = currentUser?.championDriver 
    ? getTeamById(getDriverById(currentUser.championDriver)?.teamId)?.color 
    : '#DC0000';

  const stats = [
    { 
      label: 'Total Races', 
      value: f1Calendar.length, 
      icon: Flag,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Completed', 
      value: completedRaces.length, 
      icon: Trophy,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Drivers', 
      value: f1Drivers.length, 
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Teams', 
      value: f1Teams.length, 
      icon: Flag,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Dashboard - F1 Predictions 2026</title>
        <meta name="description" content="Track your F1 2026 season predictions and view upcoming races" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1532917848519-5d2160e19638)',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              F1 2026 Season
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              {isAuthenticated 
                ? `Welcome back, ${currentUser.username}! Track your predictions and compete for glory.`
                : 'Make your predictions and compete with fans worldwide'}
            </p>
            {!isAuthenticated && (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-semibold text-white flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Next Race */}
        {nextRace && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-12"
            style={{ borderTopColor: accentColor, borderTopWidth: '4px' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm text-gray-400 mb-2">NEXT RACE</div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold text-white">{nextRace.name}</h2>
                  {nextRace.hasSprint && (
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold border border-yellow-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> SPRINT
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                    <span>{nextRace.location}, {nextRace.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                    <span>{new Date(nextRace.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                </div>
                <p className="text-gray-400 mt-2">{nextRace.circuit}</p>
              </div>
              <div 
                className="px-4 py-2 rounded-full font-semibold"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                Upcoming
              </div>
            </div>
            
            {isAuthenticated && (
              <Link to="/predictions">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-all"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>Make Your Prediction</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}
          </motion.div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/calendar">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
            >
              <Calendar className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Race Calendar</h3>
              <p className="text-gray-400">View all races and results</p>
            </motion.div>
          </Link>

          <Link to="/standings">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
            >
              <Trophy className="w-8 h-8 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Standings</h3>
              <p className="text-gray-400">Driver and team rankings</p>
            </motion.div>
          </Link>

          <Link to="/leaderboard">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
            >
              <Users className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Leaderboard</h3>
              <p className="text-gray-400">See how you rank</p>
            </motion.div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;