import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ATSResult, JobRole } from '@/types'
import { getResourcesForSkills } from '@/data/learningResources'
import { SkillGapChart } from '@/components/SkillGapChart'
import { ArrowLeft, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

export function Results() {
  const [result, setResult] = useState<ATSResult | null>(null)
  const [role, setRole] = useState<JobRole | null>(null)
  const [activeTab, setActiveTab] = useState<'levels' | 'gaps' | 'learning' | 'suggestions'>('levels')
  const navigate = useNavigate()

  useEffect(() => {
    const storedResult = localStorage.getItem('ats_result')
    const storedRole = localStorage.getItem('selected_role')

    if (!storedResult || !storedRole) {
      navigate('/dashboard')
      return
    }

    setResult(JSON.parse(storedResult))
    setRole(JSON.parse(storedRole))
  }, [navigate])

  if (!result || !role) return null

  const missingSkillNames = result.missingSkills.map(s => s.name)
  const resources = getResourcesForSkills(missingSkillNames)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-orange-500'
  }

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  const groupSkillsByLevel = (skills: typeof result.matchedSkills) => {
    return {
      beginner: skills.filter(s => s.level === 'beginner'),
      intermediate: skills.filter(s => s.level === 'intermediate'),
      advanced: skills.filter(s => s.level === 'advanced'),
    }
  }

  const matchedByLevel = groupSkillsByLevel(result.matchedSkills)
  const missingByLevel = groupSkillsByLevel(result.missingSkills)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Analysis <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Results</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Target Role: <span className="font-semibold text-gray-900 dark:text-gray-100">{role.title}</span>
          </p>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* ATS Score Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ATS Score</p>
                <p className={`text-lg font-semibold ${getScoreColor(result.score)}`}>
                  {getScoreText(result.score)}
                </p>
              </div>
              <div className="relative w-20 h-20">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - result.score / 100)}`}
                    className={result.score >= 80 ? 'text-green-500' : result.score >= 60 ? 'text-yellow-500' : 'text-orange-500'}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {result.matchedSkills.length} of {role.requiredSkills.length} skills matched
            </p>
          </div>

          {/* Matched Skills Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-500" size={20} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Matched</p>
            </div>
            <p className="text-4xl font-bold mb-1">{result.matchedSkills.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">skills found</p>
          </div>

          {/* Missing Skills Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="text-red-500" size={20} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Missing</p>
            </div>
            <p className="text-4xl font-bold mb-1">{result.missingSkills.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">skills to add</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('levels')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'levels'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Skill Levels
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'gaps'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Skill Gaps
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'learning'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Learning Hub
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'suggestions'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Suggestions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'levels' && (
          <div className="grid md:grid-cols-3 gap-4">
            {/* Beginner */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h3 className="text-lg font-semibold">Beginner</h3>
              </div>
              {matchedByLevel.beginner.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedByLevel.beginner.map(skill => (
                    <span
                      key={skill.name}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills at this level</p>
              )}
            </div>

            {/* Intermediate */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h3 className="text-lg font-semibold">Intermediate</h3>
              </div>
              {matchedByLevel.intermediate.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedByLevel.intermediate.map(skill => (
                    <span
                      key={skill.name}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills at this level</p>
              )}
            </div>

            {/* Advanced */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h3 className="text-lg font-semibold">Advanced</h3>
              </div>
              {matchedByLevel.advanced.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedByLevel.advanced.map(skill => (
                    <span
                      key={skill.name}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills at this level</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="space-y-6">
            {/* Skill Gap Analysis Chart */}
            <SkillGapChart
              jobRole={role.title}
              matchedSkills={result.matchedSkills.map(s => s.name)}
              missingSkills={result.missingSkills.map(s => s.name)}
            />

            {/* Matched vs Missing Skills */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-green-500" size={20} />
                  <h3 className="text-lg font-semibold">Matched Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map(skill => (
                    <span
                      key={skill.name}
                      className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm border border-green-200 dark:border-green-800"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="text-red-500" size={20} />
                  <h3 className="text-lg font-semibold">Missing Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map(skill => (
                    <span
                      key={skill.name}
                      className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume Section Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold">Resume Section Analysis</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-3">
                  {result.hasActionVerbs && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle size={18} />
                      <span>Action Verbs ({result.hasActionVerbs ? '1 found' : '0 found'})</span>
                    </div>
                  )}
                  {!result.hasActionVerbs && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle size={18} />
                      <span>Action Verbs (0 found)</span>
                    </div>
                  )}
                  
                  {result.foundSections.includes('projects') && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle size={18} />
                      <span>Projects Section</span>
                    </div>
                  )}
                  {!result.foundSections.includes('projects') && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle size={18} />
                      <span>Projects Section</span>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  {result.hasQuantifiedAchievements && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle size={18} />
                      <span>Quantified Achievements</span>
                    </div>
                  )}
                  {!result.hasQuantifiedAchievements && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle size={18} />
                      <span>Quantified Achievements</span>
                    </div>
                  )}
                  
                  {result.foundSections.includes('experience') && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle size={18} />
                      <span>Experience Section</span>
                    </div>
                  )}
                  {!result.foundSections.includes('experience') && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle size={18} />
                      <span>Experience Section</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Missing Sections Warning */}
              {result.missingSections.length > 0 && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-orange-700 dark:text-orange-300">
                    Missing sections: {result.missingSections.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="space-y-6">
            {/* Show resources for each missing skill */}
            {missingSkillNames.map(skillName => {
              const skillResources = resources.filter(r => {
                const skillLower = skillName.toLowerCase().trim()
                const resourceSkillLower = r.skill.toLowerCase().trim()
                
                // Exact match
                if (skillLower === resourceSkillLower) return true
                
                // Handle variations
                if (skillLower.endsWith('s') && skillLower.slice(0, -1) === resourceSkillLower) return true
                if (resourceSkillLower.endsWith('s') && resourceSkillLower.slice(0, -1) === skillLower) return true
                if (skillLower.replace(/\s+/g, '') === resourceSkillLower.replace(/\s+/g, '')) return true
                if (skillLower.includes(resourceSkillLower) || resourceSkillLower.includes(skillLower)) {
                  if (Math.min(skillLower.length, resourceSkillLower.length) >= 4) return true
                }
                
                return false
              })
              
              const byLevel = {
                beginner: skillResources.filter(r => r.level === 'beginner'),
                intermediate: skillResources.filter(r => r.level === 'intermediate'),
                advanced: skillResources.filter(r => r.level === 'advanced'),
              }

              return (
                <div key={skillName} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-xl font-semibold">{skillName}</h3>
                  </div>

                  {skillResources.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 italic">Resources coming soon for this skill.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Beginner */}
                      {byLevel.beginner.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <h4 className="font-semibold">Beginner</h4>
                          </div>
                          <div className="space-y-3">
                            {byLevel.beginner.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border border-gray-200 dark:border-gray-700 group"
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <ExternalLink size={14} className="text-blue-500 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <p className="text-sm font-medium line-clamp-2">{resource.title}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <span>{resource.provider}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    {resource.type === 'course' && '📚'}
                                    {resource.type === 'tutorial' && '▶️'}
                                    {resource.type === 'documentation' && '📄'}
                                    <span className="capitalize">{resource.type}</span>
                                  </span>
                                  <span>•</span>
                                  <span className={resource.price === 'Free' ? 'text-green-600 dark:text-green-400 font-medium' : 'text-orange-600 dark:text-orange-400 font-medium'}>
                                    {resource.price}
                                  </span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Intermediate */}
                      {byLevel.intermediate.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <h4 className="font-semibold">Intermediate</h4>
                          </div>
                          <div className="space-y-3">
                            {byLevel.intermediate.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border border-gray-200 dark:border-gray-700 group"
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <ExternalLink size={14} className="text-blue-500 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <p className="text-sm font-medium line-clamp-2">{resource.title}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <span>{resource.provider}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    {resource.type === 'course' && '📚'}
                                    {resource.type === 'tutorial' && '▶️'}
                                    {resource.type === 'documentation' && '📄'}
                                    <span className="capitalize">{resource.type}</span>
                                  </span>
                                  <span>•</span>
                                  <span className={resource.price === 'Free' ? 'text-green-600 dark:text-green-400 font-medium' : 'text-orange-600 dark:text-orange-400 font-medium'}>
                                    {resource.price}
                                  </span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Advanced */}
                      {byLevel.advanced.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <h4 className="font-semibold">Advanced</h4>
                          </div>
                          <div className="space-y-3">
                            {byLevel.advanced.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border border-gray-200 dark:border-gray-700 group"
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <ExternalLink size={14} className="text-blue-500 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <p className="text-sm font-medium line-clamp-2">{resource.title}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <span>{resource.provider}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    {resource.type === 'course' && '📚'}
                                    {resource.type === 'tutorial' && '▶️'}
                                    {resource.type === 'documentation' && '📄'}
                                    <span className="capitalize">{resource.type}</span>
                                  </span>
                                  <span>•</span>
                                  <span className={resource.price === 'Free' ? 'text-green-600 dark:text-green-400 font-medium' : 'text-orange-600 dark:text-orange-400 font-medium'}>
                                    {resource.price}
                                  </span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {missingSkillNames.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No missing skills - you're all set!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
              <h3 className="text-xl font-semibold">Improvement Suggestions</h3>
            </div>
            <div className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 pt-1">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
