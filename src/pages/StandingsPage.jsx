import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { calculateDriverStandings, calculateConstructorStandings } from '@/data/f1Data';
import Layout from '@/components/Layout';

const StandingsPage = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const driverStandings = calculateDriverStandings();
  const constructorStandings = calculateConstructorStandings();

  const DriversStandings = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">POS</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">DRIVER</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">TEAM</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">POINTS</th>
          </tr>
        </thead>
        <tbody>
          {driverStandings.map((driver, index) => (
            <motion.tr
              key={driver.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                  {index === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: driver.team.color }}
                  />
                  <div>
                    <div className="font-semibold text-white">{driver.name}</div>
                    <div className="text-sm text-gray-400">#{driver.number}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span style={{ color: driver.team.color }} className="font-medium">
                  {driver.team.name}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-2xl font-bold text-white">{driver.points}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ConstructorsStandings = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">POS</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">TEAM</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">POINTS</th>
          </tr>
        </thead>
        <tbody>
          {constructorStandings.map((team, index) => (
            <motion.tr
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                  {index === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-16 h-12 rounded-lg flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.name.substring(0, 3).toUpperCase()}
                  </div>
                  <span className="font-semibold text-white text-lg">{team.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-2xl font-bold text-white">{team.points}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Layout>
      <Helmet>
        <title>Standings - F1 Predictions 2026</title>
        <meta name="description" content="View current F1 2026 driver and constructor championship standings" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Championship Standings</h1>

          {/* Tabs */}
          <div className="bg-white/5 rounded-lg p-1 flex space-x-1 mb-8 inline-flex">
            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'drivers'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Drivers Championship
            </button>
            <button
              onClick={() => setActiveTab('constructors')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'constructors'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Constructors Championship
            </button>
          </div>

          {/* Standings Table */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            {activeTab === 'drivers' ? <DriversStandings /> : <ConstructorsStandings />}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default StandingsPage;