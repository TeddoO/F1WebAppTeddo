import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { f1Calendar, f1Drivers, getRaceStatus, raceResults, getDriverById, getTeamById, pointsSystem } from '@/data/f1Data';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const PredictionsPage = () => {
  const { currentUser, isAuthenticated, updateUser, loading } = useAuth();
  const { toast } = useToast();
  const [predictions, setPredictions] = useState({});
  const [editingRace, setEditingRace] = useState(null);
  const [editingType, setEditingType] = useState(null); // 'main' or 'sprint'
  const [selectedDrivers, setSelectedDrivers] = useState({ first: '', second: '', third: '' });

  useEffect(() => {
    if (currentUser?.predictions) {
      setPredictions(currentUser.predictions);
    }
  }, [currentUser]);

  if (loading) {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Loading predictions...</p>
        </div>
      </div>
    </Layout>
  );
}

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const upcomingRaces = f1Calendar.filter(race => {
    const status = getRaceStatus(race.date);
    return status === 'Em breve' || status === 'Em andamento';
  });

  const completedRaces = f1Calendar.filter(race => getRaceStatus(race.date) === 'Finalizado');

  const handleStartPrediction = (raceId, type) => {
    const racePreds = predictions[raceId] || {};
    const existing = racePreds[type];
    
    if (existing) {
      setSelectedDrivers({
        first: existing.first.toString(),
        second: existing.second.toString(),
        third: existing.third.toString()
      });
    } else {
      setSelectedDrivers({ first: '', second: '', third: '' });
    }
    setEditingRace(raceId);
    setEditingType(type);
  };

  const handleSavePrediction = (raceId) => {
    if (!selectedDrivers.first || !selectedDrivers.second || !selectedDrivers.third) {
      toast({
        title: "Incomplete prediction",
        description: "Please select all three podium positions",
        variant: "destructive"
      });
      return;
    }

    if (selectedDrivers.first === selectedDrivers.second || 
        selectedDrivers.first === selectedDrivers.third || 
        selectedDrivers.second === selectedDrivers.third) {
      toast({
        title: "Invalid prediction",
        description: "Cannot select the same driver twice",
        variant: "destructive"
      });
      return;
    }

    const newPredictions = {
      ...predictions,
      [raceId]: {
        ...predictions[raceId],
        [editingType]: {
          first: parseInt(selectedDrivers.first),
          second: parseInt(selectedDrivers.second),
          third: parseInt(selectedDrivers.third),
          timestamp: new Date().toISOString()
        }
      }
    };

    setPredictions(newPredictions);
    updateUser({ predictions: newPredictions });
    setEditingRace(null);
    setEditingType(null);

    toast({
      title: "Prediction saved!",
      description: `Your ${editingType === 'sprint' ? 'Sprint' : 'Main Race'} prediction has been saved`,
    });
  };

  const calculatePredictionPoints = (raceId, prediction, type) => {
    const result = raceResults[raceId];
    if (!result || !result[type === 'main' ? 'mainRace' : 'sprint']) return null;

    const resultData = type === 'main' ? result.mainRace : result.sprint;
    const actualPodium = resultData.podium.slice(0, 3).map(p => p.driverId);
    
    let correctCount = 0;
    if (prediction.first === actualPodium[0]) correctCount++;
    if (prediction.second === actualPodium[1]) correctCount++;
    if (prediction.third === actualPodium[2]) correctCount++;

    const scoring = type === 'main' 
      ? pointsSystem.predictionScoring.main 
      : pointsSystem.predictionScoring.sprint;

    const pointsMap = {
      0: 0,
      1: scoring.one,
      2: scoring.two,
      3: scoring.three
    };

    return {
      points: pointsMap[correctCount],
      correctCount,
      actualPodium
    };
  };

  const PredictionForm = ({ raceId }) => (
    <div className="space-y-4 mt-4 bg-white/5 p-4 rounded-xl border border-white/10">
      <h4 className="font-semibold text-white flex items-center gap-2">
        {editingType === 'sprint' ? <Zap className="w-4 h-4 text-yellow-400" /> : <Trophy className="w-4 h-4 text-yellow-400" />}
        {editingType === 'sprint' ? 'Sprint' : 'Main Race'} Prediction
      </h4>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          🥇 1st Place
        </label>
        <select
          value={selectedDrivers.first}
          onChange={(e) => setSelectedDrivers({ ...selectedDrivers, first: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="" className="bg-gray-900">Select driver</option>
          {f1Drivers.map(driver => (
            <option key={driver.id} value={driver.id} className="bg-gray-900">
              {driver.name} - {getTeamById(driver.teamId)?.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          🥈 2nd Place
        </label>
        <select
          value={selectedDrivers.second}
          onChange={(e) => setSelectedDrivers({ ...selectedDrivers, second: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="" className="bg-gray-900">Select driver</option>
          {f1Drivers.map(driver => (
            <option key={driver.id} value={driver.id} className="bg-gray-900">
              {driver.name} - {getTeamById(driver.teamId)?.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          🥉 3rd Place
        </label>
        <select
          value={selectedDrivers.third}
          onChange={(e) => setSelectedDrivers({ ...selectedDrivers, third: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="" className="bg-gray-900">Select driver</option>
          {f1Drivers.map(driver => (
            <option key={driver.id} value={driver.id} className="bg-gray-900">
              {driver.name} - {getTeamById(driver.teamId)?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={() => handleSavePrediction(raceId)}
          className="flex-1 bg-green-500 hover:bg-green-600"
        >
          Save
        </Button>
        <Button
          onClick={() => {
            setEditingRace(null);
            setEditingType(null);
          }}
          className="flex-1 bg-gray-500 hover:bg-gray-600"
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  const PredictionDisplay = ({ raceId, type, label }) => {
    const racePreds = predictions[raceId];
    const prediction = racePreds?.[type];

    return (
      <div className={`p-4 rounded-xl border border-white/10 ${type === 'sprint' ? 'bg-yellow-500/5' : 'bg-white/5'}`}>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-white flex items-center gap-2">
            {type === 'sprint' ? <Zap className="w-4 h-4 text-yellow-400" /> : <Trophy className="w-4 h-4 text-white" />}
            {label}
          </h4>
          {!prediction && (
             <Button
                onClick={() => handleStartPrediction(raceId, type)}
                size="sm"
                className={`h-8 ${type === 'sprint' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-500 hover:bg-red-600'}`}
             >
                Predict
             </Button>
          )}
        </div>
        
        {prediction ? (
          <div>
            <div className="space-y-2 mb-4">
               <div className="flex items-center justify-between">
                 <span className="text-gray-400 text-sm">1st</span>
                 <span className="text-white font-medium">{getDriverById(prediction.first)?.name}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-400 text-sm">2nd</span>
                 <span className="text-white font-medium">{getDriverById(prediction.second)?.name}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-400 text-sm">3rd</span>
                 <span className="text-white font-medium">{getDriverById(prediction.third)?.name}</span>
               </div>
            </div>
            <Button
              onClick={() => handleStartPrediction(raceId, type)}
              variant="outline"
              size="sm"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Edit
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No prediction yet</p>
        )}
      </div>
    );
  };

  const UpcomingRaceCard = ({ race }) => {
    const isEditing = editingRace === race.id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-sm text-gray-400 mb-1">Round {race.id}</div>
            <h3 className="text-xl font-bold text-white mb-2">{race.name}</h3>
            <div className="text-gray-300 text-sm">
              {new Date(race.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
             <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold">
               Upcoming
             </div>
             {race.hasSprint && (
               <div className="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                 <Zap className="w-3 h-3" /> SPRINT WEEKEND
               </div>
             )}
          </div>
        </div>

        {isEditing ? (
          <PredictionForm raceId={race.id} />
        ) : (
          <div className="space-y-4">
            {race.hasSprint && (
              <PredictionDisplay raceId={race.id} type="sprint" label="Sprint Race" />
            )}
            <PredictionDisplay raceId={race.id} type="main" label="Main Race" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <Layout>
      <Helmet>
        <title>Race Predictions - F1 Predictions 2026</title>
        <meta name="description" content="Make your race predictions for the F1 2026 season" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Race Predictions</h1>

          {upcomingRaces.length > 0 ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Upcoming Races</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingRaces.map(race => (
                  <UpcomingRaceCard key={race.id} race={race} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 mb-12">
               <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white">No Upcoming Races</h3>
               <p className="text-gray-400">The 2026 season has concluded!</p>
            </div>
          )}
          
          {completedRaces.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Completed Races</h2>
              <div className="text-gray-400 italic">Results processing...</div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default PredictionsPage;