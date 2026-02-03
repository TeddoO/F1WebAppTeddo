import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Medal, Award } from 'lucide-react';
import { raceResults, pointsSystem } from '@/data/f1Data';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { usersService } from '@/services/usersService';
import { predictionsService } from '@/services/predictionsService';

const LeaderboardPage = () => {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateLeaderboard();
  }, []);

  const calculateLeaderboard = async () => {
  try {
    setLoading(true);
    
    // Get all users from Supabase database
    const users = await usersService.getAllUsers();
    
    // Get all predictions from Supabase database
    const allPredictions = await predictionsService.getAllPredictions();
    
    const userScores = users.map(user => {
      let totalPoints = 0;
      let sprintPoints = 0;
      let mainPoints = 0;
      let racesPredicted = 0;
      let correctPredictions = 0;
      let totalPredictionAttempts = 0;

      // Get this user's predictions from the array
      const userPreds = allPredictions.filter(p => p.user_id === user.id);
      
      // Group predictions by race
      const predsByRace = {};
      userPreds.forEach(p => {
        if (!predsByRace[p.race_id]) {
          predsByRace[p.race_id] = {};
        }
        predsByRace[p.race_id][p.prediction_type] = {
          first: p.first_place,
          second: p.second_place,
          third: p.third_place
        };
      });

      // Calculate scores for each race
      Object.entries(predsByRace).forEach(([raceId, racePreds]) => {
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
            
            const pts = pointsMap[correctCount];
            mainPoints += pts;
            totalPoints += pts;
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
            
            const pts = pointsMap[correctCount];
            sprintPoints += pts;
            totalPoints += pts;
          }
        }
      });

      const accuracy = totalPredictionAttempts > 0 
        ? Math.round((correctPredictions / totalPredictionAttempts) * 100) 
        : 0;

      return {
        username: user.username,
        totalPoints,
        mainPoints,
        sprintPoints,
        racesPredicted,
        accuracy,
      };
    });

    // Sort by total points (highest first)
    userScores.sort((a, b) => b.totalPoints - a.totalPoints);
    setLeaderboard(userScores);
    
  } catch (error) {
    console.error('Error loading leaderboard:', error);
  } finally {
    setLoading(false);
  }
};

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300" />;
      case 2: return <Award className="w-6 h-6 text-orange-400" />;
      default: return null;
    }
  };

  return (
    <Layout>
      {loading ? (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Loading leaderboard...</p>
        </div>
      </div>
    ) : (
      <>
      <Helmet>
        <title>Leaderboard - F1 Predictions 2026</title>
        <meta name="description" content="See how you rank against other F1 prediction players" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <Trophy className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          </div>

          {/* Full Leaderboard */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">RANK</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">PLAYER</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">TOTAL PTS</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400 hidden md:table-cell">MAIN PTS</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400 hidden md:table-cell">SPRINT PTS</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400 hidden sm:table-cell">ACCURACY</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, index) => {
                    const isCurrentUser = currentUser?.username === user.username;
                    return (
                      <motion.tr
                        key={user.username}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-white/5 transition-all ${
                          isCurrentUser 
                            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-white">{index + 1}</span>
                            {getRankIcon(index)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold ${isCurrentUser ? 'text-red-400' : 'text-white'}`}>
                              {user.username}
                            </span>
                            {isCurrentUser && (
                              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">You</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-2xl font-bold text-white">{user.totalPoints}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-400 hidden md:table-cell">
                          {user.mainPoints}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-400 hidden md:table-cell">
                          {user.sprintPoints}
                        </td>
                        <td className="px-6 py-4 text-right hidden sm:table-cell">
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-gray-300">{user.accuracy}%</span>
                            {user.accuracy >= 70 && <TrendingUp className="w-4 h-4 text-green-400" />}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No players yet. Be the first to make predictions!</p>
            </div>
          )}
        </motion.div>
        </div>
      </>
    )}
  </Layout>
);
};

export default LeaderboardPage;