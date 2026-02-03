import React from 'react';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Trophy, Calendar, Target, Award, TrendingUp } from 'lucide-react';
import { getDriverById, getTeamById, raceResults, pointsSystem } from '@/data/f1Data';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

const ProfilePage = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth
if (loading) {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    </Layout>
  );
}

// Redirect if not logged in
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

  const championDriver = getDriverById(currentUser?.championDriver);
  const championTeam = getTeamById(currentUser?.championConstructor);
  const driverTeam = championDriver ? getTeamById(championDriver.teamId) : null;

  // Calculate user statistics
  const calculateStats = () => {
    let totalPoints = 0;
    let racesPredicted = 0;
    let correctPredictions = 0;
    let totalPredictionAttempts = 0;

    if (currentUser?.predictions) {
      Object.entries(currentUser.predictions).forEach(([raceId, racePreds]) => {
        const result = raceResults[parseInt(raceId)];
        if (result) {
          // Main Race Calculation
          if (racePreds.main && result.mainRace) {
            racesPredicted++;
            const actualPodium = result.mainRace.podium.slice(0, 3).map(p => p.driverId);
            
            let correctCount = 0;
            if (racePreds.main.first === actualPodium[0]) { correctCount++; correctPredictions++; }
            if (racePreds.main.second === actualPodium[1]) { correctCount++; correctPredictions++; }
            if (racePreds.main.third === actualPodium[2]) { correctCount++; correctPredictions++; }
            
            totalPredictionAttempts += 3;
            
            const scoring = pointsSystem.predictionScoring.main;
            const pointsMap = { 0: 0, 1: scoring.one, 2: scoring.two, 3: scoring.three };
            totalPoints += pointsMap[correctCount];
          }

          // Sprint Race Calculation  
          if (racePreds.sprint && result.sprint) {
            const actualPodium = result.sprint.podium.slice(0, 3).map(p => p.driverId);
            
            let correctCount = 0;
            if (racePreds.sprint.first === actualPodium[0]) { correctCount++; correctPredictions++; }
            if (racePreds.sprint.second === actualPodium[1]) { correctCount++; correctPredictions++; }
            if (racePreds.sprint.third === actualPodium[2]) { correctCount++; correctPredictions++; }
            
            totalPredictionAttempts += 3;
            
            const scoring = pointsSystem.predictionScoring.sprint;
            const pointsMap = { 0: 0, 1: scoring.one, 2: scoring.two, 3: scoring.three };
            totalPoints += pointsMap[correctCount];
          }
        }
      });
    }

    const accuracy = totalPredictionAttempts > 0 
      ? Math.round((correctPredictions / totalPredictionAttempts) * 100) 
      : 0;

    return {
      totalPoints,
      racesPredicted,
      correctPredictions,
      totalPredictionAttempts,
      accuracy
    };
  };

  const stats = calculateStats();

  return (
    <Layout>
      <Helmet>
        <title>Profile - F1 Predictions 2026</title>
        <meta name="description" content="View your F1 prediction profile and statistics" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{currentUser?.username || 'User'}</h1>
                <p className="text-gray-400">
                  Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Total Points</span>
                </div>
                <div className="text-3xl font-bold text-white">{stats.totalPoints}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">Races Predicted</span>
                </div>
                <div className="text-3xl font-bold text-white">{stats.racesPredicted}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">Accuracy</span>
                </div>
                <div className="text-3xl font-bold text-white">{stats.accuracy}%</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Correct Picks</span>
                </div>
                <div className="text-3xl font-bold text-white">{stats.correctPredictions}/{stats.totalPredictionAttempts}</div>
              </div>
            </div>
          </div>

          {/* Champion Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Champion */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Champion Driver Prediction</h2>
              </div>
              
              {championDriver && driverTeam ? (
                <div 
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: `${driverTeam.color}20` }}
                >
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
                      style={{ 
                        backgroundColor: driverTeam.color,
                        color: driverTeam.textColor
                      }}
                    >
                      #{championDriver.number}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{championDriver.name}</h3>
                    <p style={{ color: driverTeam.color }} className="font-semibold">
                      {driverTeam.name}
                    </p>
                    <div className="mt-4 text-gray-400 text-sm">
                      Potential bonus: <span className="text-yellow-400 font-semibold">+70 points</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No champion driver selected
                </div>
              )}
            </div>

            {/* Constructor Champion */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Champion Constructor Prediction</h2>
              </div>
              
              {championTeam ? (
                <div 
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: `${championTeam.color}20` }}
                >
                  <div className="text-center">
                    <div 
                      className="w-24 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                      style={{ 
                        backgroundColor: championTeam.color,
                        color: championTeam.textColor
                      }}
                    >
                      {championTeam.name.substring(0, 3).toUpperCase()}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{championTeam.name}</h3>
                    <div className="mt-4 text-gray-400 text-sm">
                      Potential bonus: <span className="text-blue-400 font-semibold">+50 points</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No champion constructor selected
                </div>
              )}
            </div>
          </div>

          {/* Performance Insight */}
          {stats.racesPredicted > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6"
            >
              <div className="flex items-start space-x-4">
                <TrendingUp className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Performance Insight</h3>
                  <p className="text-gray-300">
                    {stats.accuracy >= 70 
                      ? "Excellent! You're performing above average. Keep up the great predictions!"
                      : stats.accuracy >= 50
                      ? "Good work! You're making solid predictions. Keep analyzing the races!"
                      : "Keep practicing! Study driver form and team performance to improve your accuracy."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;