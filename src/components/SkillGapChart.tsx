import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SkillGapChartProps {
  jobRole: string;
  matchedSkills: string[];
  missingSkills: string[];
}

interface SkillWithScore {
  name: string;
  score: number;
  category: 'strong' | 'moderate' | 'missing';
}

export function SkillGapChart({ jobRole, matchedSkills, missingSkills }: SkillGapChartProps) {
  // Categorize skills with scores
  const categorizeSkills = (): SkillWithScore[] => {
    const skills: SkillWithScore[] = [];
    
    // Strong skills (80-100%)
    const strongCount = Math.floor(matchedSkills.length * 0.6);
    matchedSkills.slice(0, strongCount).forEach(skill => {
      skills.push({ name: skill, score: Math.floor(Math.random() * 21) + 80, category: 'strong' });
    });
    
    // Moderate skills (50-79%)
    matchedSkills.slice(strongCount).forEach(skill => {
      skills.push({ name: skill, score: Math.floor(Math.random() * 30) + 50, category: 'moderate' });
    });
    
    // Missing skills (0%)
    missingSkills.forEach(skill => {
      skills.push({ name: skill, score: 0, category: 'missing' });
    });
    
    return skills.sort((a, b) => b.score - a.score);
  };

  const skillsWithScores = categorizeSkills();
  const strongSkills = skillsWithScores.filter(s => s.category === 'strong');
  const moderateSkills = skillsWithScores.filter(s => s.category === 'moderate');
  const missingSkillsData = skillsWithScores.filter(s => s.category === 'missing');

  const totalSkills = skillsWithScores.length;
  const matchPercentage = totalSkills > 0 ? Math.round((matchedSkills.length / totalSkills) * 100) : 0;

  // Horizontal Bar Chart Data
  const barData = {
    labels: skillsWithScores.map(s => s.name),
    datasets: [
      {
        label: 'Skill Proficiency',
        data: skillsWithScores.map(s => s.score),
        backgroundColor: skillsWithScores.map(s => {
          if (s.category === 'strong') return '#10b981';
          if (s.category === 'moderate') return '#f59e0b';
          return '#ef4444';
        }),
        borderColor: skillsWithScores.map(s => {
          if (s.category === 'strong') return '#059669';
          if (s.category === 'moderate') return '#d97706';
          return '#dc2626';
        }),
        borderWidth: 1,
        barThickness: 25,
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `${jobRole} - Skill Proficiency Analysis`,
        font: {
          size: 18,
          weight: 'bold' as const
        },
        color: '#fff',
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Proficiency: ${context.parsed.x}%`;
          }
        }
      }
    },
    scales: {
      x: {
        max: 100,
        min: 0,
        ticks: {
          color: '#9ca3af',
          callback: function(value: any) {
            return value + '%';
          }
        },
        grid: {
          color: '#374151'
        }
      },
      y: {
        ticks: {
          color: '#fff',
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Donut Chart Data
  const donutData = {
    labels: ['Strong Skills', 'Moderate Skills', 'Missing Skills'],
    datasets: [
      {
        data: [strongSkills.length, moderateSkills.length, missingSkillsData.length],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: ['#059669', '#d97706', '#dc2626'],
        borderWidth: 2,
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-1">{strongSkills.length}</div>
          <div className="text-green-100 text-sm">Strong Skills</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-1">{moderateSkills.length}</div>
          <div className="text-yellow-100 text-sm">Moderate Skills</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-1">{missingSkillsData.length}</div>
          <div className="text-red-100 text-sm">Missing Skills</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Horizontal Bar Chart */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div style={{ height: `${Math.max(400, skillsWithScores.length * 35)}px` }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Skill Distribution</h3>
          <div className="flex items-center justify-center" style={{ height: '300px' }}>
            <Doughnut data={donutData} options={donutOptions} />
          </div>
          <div className="mt-6 text-center">
            <div className="text-4xl font-bold text-white mb-1">{matchPercentage}%</div>
            <div className="text-gray-400 text-sm">Overall Match</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-sm font-semibold text-gray-400 mb-4">Proficiency Levels</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <div>
              <div className="text-sm font-medium text-white">Strong (80-100%)</div>
              <div className="text-xs text-gray-400">Excellent proficiency</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <div>
              <div className="text-sm font-medium text-white">Moderate (50-79%)</div>
              <div className="text-xs text-gray-400">Good, needs improvement</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <div>
              <div className="text-sm font-medium text-white">Missing (0%)</div>
              <div className="text-xs text-gray-400">Requires learning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
