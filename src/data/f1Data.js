// F1 2026 Season Data
export const f1Teams = [
  { id: 1, name: "Ferrari", color: "#DC0000", textColor: "#FFFFFF" },
  { id: 2, name: "McLaren", color: "#FF8700", textColor: "#FFFFFF" },
  { id: 3, name: "Mercedes", color: "#00D2BE", textColor: "#000000" },
  { id: 4, name: "Red Bull Racing", color: "#0600EF", textColor: "#FFFFFF" },
  { id: 5, name: "Aston Martin", color: "#006F62", textColor: "#FFFFFF" },
  { id: 6, name: "Alpine", color: "#0090FF", textColor: "#FFFFFF" },
  { id: 7, name: "Williams", color: "#005AFF", textColor: "#FFFFFF" },
  { id: 8, name: "Haas F1 Team", color: "#B6BABD", textColor: "#000000" },
  { id: 9, name: "RB", color: "#6692FF", textColor: "#FFFFFF" },
  { id: 10, name: "Audi", color: "#C0C0C0", textColor: "#000000" }
];

export const f1Drivers = [
  // Ferrari
  { id: 1, name: "Charles Leclerc", teamId: 1, number: 16 },
  { id: 2, name: "Lewis Hamilton", teamId: 1, number: 44 },
  // McLaren
  { id: 3, name: "Lando Norris", teamId: 2, number: 4 },
  { id: 4, name: "Oscar Piastri", teamId: 2, number: 81 },
  // Mercedes
  { id: 5, name: "George Russell", teamId: 3, number: 63 },
  { id: 6, name: "Andrea Kimi Antonelli", teamId: 3, number: 12 },
  // Red Bull
  { id: 7, name: "Max Verstappen", teamId: 4, number: 1 },
  { id: 8, name: "Liam Lawson", teamId: 4, number: 30 },
  // Aston Martin
  { id: 9, name: "Fernando Alonso", teamId: 5, number: 14 },
  { id: 10, name: "Lance Stroll", teamId: 5, number: 18 },
  // Alpine
  { id: 11, name: "Pierre Gasly", teamId: 6, number: 10 },
  { id: 12, name: "Jack Doohan", teamId: 6, number: 7 },
  // Williams
  { id: 13, name: "Carlos Sainz", teamId: 7, number: 55 },
  { id: 14, name: "Alex Albon", teamId: 7, number: 23 },
  // Haas
  { id: 15, name: "Oliver Bearman", teamId: 8, number: 87 },
  { id: 16, name: "Esteban Ocon", teamId: 8, number: 31 },
  // RB
  { id: 17, name: "Yuki Tsunoda", teamId: 9, number: 22 },
  { id: 18, name: "Isack Hadjar", teamId: 9, number: 6 },
  // Audi
  { id: 19, name: "Nico Hulkenberg", teamId: 10, number: 27 },
  { id: 20, name: "Gabriel Bortoleto", teamId: 10, number: 5 }
];

export const f1Calendar = [
  {
    id: 1,
    name: "Australian Grand Prix",
    location: "Melbourne",
    country: "Australia",
    startDate: "2026-03-06",
    endDate: "2026-03-08",
    circuit: "Albert Park Circuit",
    hasSprint: false
  },
  {
    id: 2,
    name: "Chinese Grand Prix",
    location: "Shanghai",
    country: "China",
    startDate: "2026-03-13",
    endDate: "2026-03-15",
    circuit: "Shanghai International Circuit",
    hasSprint: true
  },
  {
    id: 3,
    name: "Japanese Grand Prix",
    location: "Suzuka",
    country: "Japan",
    startDate: "2026-03-27",
    endDate: "2026-03-29",
    circuit: "Suzuka Circuit",
    hasSprint: false
  },
  {
    id: 4,
    name: "Bahrain Grand Prix",
    location: "Sakhir",
    country: "Bahrain",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    circuit: "Bahrain International Circuit",
    hasSprint: false
  },
  {
    id: 5,
    name: "Saudi Arabian Grand Prix",
    location: "Jeddah",
    country: "Saudi Arabia",
    startDate: "2026-04-17",
    endDate: "2026-04-19",
    circuit: "Jeddah Corniche Circuit",
    hasSprint: false
  },
  {
    id: 6,
    name: "Miami Grand Prix",
    location: "Miami",
    country: "USA",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    circuit: "Miami International Autodrome",
    hasSprint: true
  },
  {
    id: 7,
    name: "Canadian Grand Prix",
    location: "Montreal",
    country: "Canada",
    startDate: "2026-05-22",
    endDate: "2026-05-24",
    circuit: "Circuit Gilles Villeneuve",
    hasSprint: true
  },
  {
    id: 8,
    name: "Monaco Grand Prix",
    location: "Monte Carlo",
    country: "Monaco",
    startDate: "2026-06-05",
    endDate: "2026-06-07",
    circuit: "Circuit de Monaco",
    hasSprint: false
  },
  {
    id: 9,
    name: "Spanish Grand Prix",
    location: "Barcelona",
    country: "Spain",
    startDate: "2026-06-12",
    endDate: "2026-06-14",
    circuit: "Circuit de Barcelona-Catalunya",
    hasSprint: false
  },
  {
    id: 10,
    name: "Austrian Grand Prix",
    location: "Spielberg",
    country: "Austria",
    startDate: "2026-06-26",
    endDate: "2026-06-28",
    circuit: "Red Bull Ring",
    hasSprint: false
  },
  {
    id: 11,
    name: "British Grand Prix",
    location: "Silverstone",
    country: "United Kingdom",
    startDate: "2026-07-03",
    endDate: "2026-07-05",
    circuit: "Silverstone Circuit",
    hasSprint: true
  },
  {
    id: 12,
    name: "Belgian Grand Prix",
    location: "Spa-Francorchamps",
    country: "Belgium",
    startDate: "2026-07-17",
    endDate: "2026-07-19",
    circuit: "Circuit de Spa-Francorchamps",
    hasSprint: false
  },
  {
    id: 13,
    name: "Hungarian Grand Prix",
    location: "Budapest",
    country: "Hungary",
    startDate: "2026-07-24",
    endDate: "2026-07-26",
    circuit: "Hungaroring",
    hasSprint: false
  },
  {
    id: 14,
    name: "Dutch Grand Prix",
    location: "Zandvoort",
    country: "Netherlands",
    startDate: "2026-08-21",
    endDate: "2026-08-23",
    circuit: "Circuit Zandvoort",
    hasSprint: true
  },
  {
    id: 15,
    name: "Italian Grand Prix",
    location: "Monza",
    country: "Italy",
    startDate: "2026-09-04",
    endDate: "2026-09-06",
    circuit: "Autodromo Nazionale di Monza",
    hasSprint: false
  },
  {
    id: 16,
    name: "Spanish Grand Prix", // Note: This is the Madrid race, previous "Spanish GP" is Barcelona
    location: "Madrid",
    country: "Spain",
    startDate: "2026-09-11",
    endDate: "2026-09-13",
    circuit: "IFEMA Madrid Circuit",
    hasSprint: false
  },
  {
    id: 17,
    name: "Azerbaijan Grand Prix",
    location: "Baku",
    country: "Azerbaijan",
    startDate: "2026-09-24",
    endDate: "2026-09-26",
    circuit: "Baku City Circuit",
    hasSprint: false
  },
  {
    id: 18,
    name: "Singapore Grand Prix",
    location: "Singapore",
    country: "Singapore",
    startDate: "2026-10-09",
    endDate: "2026-10-11",
    circuit: "Marina Bay Street Circuit",
    hasSprint: true
  },
  {
    id: 19,
    name: "United States Grand Prix",
    location: "Austin",
    country: "USA",
    startDate: "2026-10-23",
    endDate: "2026-10-25",
    circuit: "Circuit of the Americas",
    hasSprint: false
  },
  {
    id: 20,
    name: "Mexico City Grand Prix",
    location: "Mexico City",
    country: "Mexico",
    startDate: "2026-10-30",
    endDate: "2026-11-01",
    circuit: "Autódromo Hermanos Rodríguez",
    hasSprint: false
  },
  {
    id: 21,
    name: "São Paulo Grand Prix",
    location: "São Paulo",
    country: "Brazil",
    startDate: "2026-11-06",
    endDate: "2026-11-08",
    circuit: "Autódromo José Carlos Pace",
    hasSprint: false
  },
  {
    id: 22,
    name: "Las Vegas Grand Prix",
    location: "Las Vegas",
    country: "USA",
    startDate: "2026-11-19",
    endDate: "2026-11-21",
    circuit: "Las Vegas Street Circuit",
    hasSprint: false
  },
  {
    id: 23,
    name: "Qatar Grand Prix",
    location: "Lusail",
    country: "Qatar",
    startDate: "2026-11-27",
    endDate: "2026-11-29",
    circuit: "Lusail International Circuit",
    hasSprint: false
  },
  {
    id: 24,
    name: "Abu Dhabi Grand Prix",
    location: "Abu Dhabi",
    country: "UAE",
    startDate: "2026-12-04",
    endDate: "2026-12-06",
    circuit: "Yas Marina Circuit",
    hasSprint: false
  }
];

// Empty results for start of season
export const raceResults = {};

export const pointsSystem = {
  positions: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
  predictionScoring: {
    main: { one: 3, two: 7, three: 12 },
    sprint: { one: 1, two: 3, three: 5 },
    championDriver: 70,
    championConstructor: 50
  }
};

// Helper functions
export const getTeamById = (teamId) => f1Teams.find(team => team.id === teamId);
export const getDriverById = (driverId) => f1Drivers.find(driver => driver.id === driverId);
export const getRaceById = (raceId) => f1Calendar.find(race => race.id === raceId);

export const getRaceStatus = (race) => {
  // Validate race object and required properties
  if (!race || typeof race !== 'object' || !race.startDate || !race.endDate) {
    return "Em breve";
  }

  const today = new Date('2026-02-02');
  today.setHours(0, 0, 0, 0);
  const raceStartDate = new Date(race.startDate);
  raceStartDate.setHours(0, 0, 0, 0);
  const raceEndDate = new Date(race.endDate);
  raceEndDate.setHours(0, 0, 0, 0);
  
  if (raceEndDate < today) return "Finalizado";
  if (raceStartDate <= today && raceEndDate >= today) return "Em andamento";
  return "Em breve";
};

export const getCompletedRaces = () => {
  return f1Calendar.filter(race => getRaceStatus(race) === "Finalizado");
};

export const getNextRace = () => {
  const today = new Date('2026-02-02');
  today.setHours(0, 0, 0, 0);
  
  return f1Calendar.find(race => {
    const raceEndDate = new Date(race.endDate);
    raceEndDate.setHours(0, 0, 0, 0);
    return raceEndDate >= today;
  }) || null;
};

export const calculateDriverStandings = () => {
  const standings = f1Drivers.map(driver => ({
    ...driver,
    points: 0,
    team: getTeamById(driver.teamId)
  }));

  Object.values(raceResults).forEach(race => {
    // Main Race Points
    if (race.mainRace) {
      race.mainRace.podium.forEach(result => {
        const driver = standings.find(d => d.id === result.driverId);
        if (driver) driver.points += result.points;
      });
    }
    // Sprint Points
    if (race.sprint) {
       race.sprint.podium.forEach(result => {
        const driver = standings.find(d => d.id === result.driverId);
        if (driver) driver.points += result.points;
      });
    }
  });

  return standings.sort((a, b) => b.points - a.points);
};

export const calculateConstructorStandings = () => {
  const standings = f1Teams.map(team => ({
    ...team,
    points: 0
  }));

  Object.values(raceResults).forEach(race => {
     // Helper to add points
    const addPoints = (podium) => {
      podium.forEach(result => {
        const driver = getDriverById(result.driverId);
        if (driver) {
          const team = standings.find(t => t.id === driver.teamId);
          if (team) team.points += result.points;
        }
      });
    };

    if (race.mainRace) addPoints(race.mainRace.podium);
    if (race.sprint) addPoints(race.sprint.podium);
  });

  return standings.sort((a, b) => b.points - a.points);
};