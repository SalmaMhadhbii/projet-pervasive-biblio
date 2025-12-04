// src/pages/Statistiques.jsx
import MainLayout from '../layouts/MainLayout';
import StatsOverviewCards from '../components/stats/StatsOverviewCards';
import WeeklyOccupationChart from '../components/stats/WeeklyOccupationChart';
import WeeklyNoiseChart from '../components/stats/WeeklyNoiseChart';
import PeakHoursChart from '../components/stats/PeakHoursChart';
import InsightsBox from '../components/stats/InsightsBox';

export default function Statistiques() {
  return (
    <MainLayout
      title="Statistiques"
      subtitle="Analyse de l'affluence et des niveaux sonores sur la semaine"
      showBack={false}   // ou true si tu veux le bouton retour
    >
      {/* 4 cartes du haut */}
      <StatsOverviewCards />

      {/* Occupation + Bruit hebdo côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <WeeklyOccupationChart />
        <WeeklyNoiseChart />
      </div>

      {/* Distribution des heures de pointe */}
      <PeakHoursChart />

      {/* Bloc insights & recommandations */}
      <InsightsBox />
    </MainLayout>
  );
}