import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { f1Drivers, f1Teams } from '@/data/f1Data';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Trophy, User, Lock, Flag } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [championDriver, setChampionDriver] = useState('');
  const [championConstructor, setChampionConstructor] = useState('');
  const { register, login, isAuthenticated, isChampionSelectionLocked } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(username, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate('/');
      } else {
        if (!championDriver || !championConstructor) {
          toast({
            title: "Missing selections",
            description: "Please select both champion driver and constructor.",
            variant: "destructive"
          });
          return;
        }

        await register(username, password, parseInt(championDriver), parseInt(championConstructor));
        toast({
          title: "Account created!",
          description: "Your predictions have been saved.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Register'} - F1 Predictions 2026</title>
        <meta name="description" content="Login or register to make your F1 2026 season predictions" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join the Championship'}
              </h1>
              <p className="text-gray-400">
                {isLogin ? 'Login to view your predictions' : 'Create your account and make predictions for the 2026 season'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="Enter your password"
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Trophy className="w-4 h-4 inline mr-2" />
                      Champion Driver (70 pts if correct)
                    </label>
                    <select
                      value={championDriver}
                      onChange={(e) => setChampionDriver(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    >
                      <option value="" className="bg-gray-900">Select a driver</option>
                      {f1Drivers.map(driver => (
                        <option key={driver.id} value={driver.id} className="bg-gray-900">
                          {driver.name} - {f1Teams.find(t => t.id === driver.teamId)?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Flag className="w-4 h-4 inline mr-2" />
                      Champion Constructor (50 pts if correct)
                    </label>
                    <select
                      value={championConstructor}
                      onChange={(e) => setChampionConstructor(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    >
                      <option value="" className="bg-gray-900">Select a team</option>
                      {f1Teams.map(team => (
                        <option key={team.id} value={team.id} className="bg-gray-900">
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isChampionSelectionLocked() && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <p className="text-yellow-400 text-sm">
                        Note: Champion selections are locked after the first race, but you can still register!
                      </p>
                    </div>
                  )}
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition-all"
              >
                {isLogin ? 'Login' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;