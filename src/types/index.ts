export interface User {
  email: string
  name: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Skill {
  name: string
  level: SkillLevel
  variations?: string[]
}

export interface JobRole {
  id: string
  title: string
  category: string
  requiredSkills: Skill[]
  actionVerbs: string[]
  expectedSections: string[]
}

export interface ATSResult {
  score: number
  matchedSkills: Skill[]
  missingSkills: Skill[]
  foundSections: string[]
  missingSections: string[]
  hasActionVerbs: boolean
  hasQuantifiedAchievements: boolean
  suggestions: string[]
}

export interface LearningResource {
  title: string
  url: string
  type: 'course' | 'tutorial' | 'documentation'
  skill: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  provider?: string
  price?: 'Free' | 'Paid'
}
