import { JobRole, ATSResult, Skill } from '@/types'

export class ATSEngine {
  private resumeText: string
  private role: JobRole

  constructor(resumeText: string, role: JobRole) {
    this.resumeText = resumeText.toLowerCase()
    this.role = role
  }

  analyze(): ATSResult {
    const matchedSkills = this.matchSkills()
    const missingSkills = this.getMissingSkills(matchedSkills)
    const { foundSections, missingSections } = this.analyzeSections()
    const hasActionVerbs = this.detectActionVerbs()
    const hasQuantifiedAchievements = this.detectQuantifiedAchievements()
    
    const score = this.calculateScore(
      matchedSkills,
      foundSections,
      hasActionVerbs,
      hasQuantifiedAchievements
    )
    
    const suggestions = this.generateSuggestions(
      missingSkills,
      missingSections,
      hasActionVerbs,
      hasQuantifiedAchievements
    )

    return {
      score,
      matchedSkills,
      missingSkills,
      foundSections,
      missingSections,
      hasActionVerbs,
      hasQuantifiedAchievements,
      suggestions,
    }
  }

  private matchSkills(): Skill[] {
    const matched: Skill[] = []
    
    for (const skill of this.role.requiredSkills) {
      const skillNames = [skill.name.toLowerCase(), ...(skill.variations || []).map(v => v.toLowerCase())]
      
      if (skillNames.some(name => this.resumeText.includes(name))) {
        matched.push(skill)
      }
    }
    
    return matched
  }

  private getMissingSkills(matchedSkills: Skill[]): Skill[] {
    const matchedNames = new Set(matchedSkills.map(s => s.name))
    return this.role.requiredSkills.filter(s => !matchedNames.has(s.name))
  }

  private analyzeSections(): { foundSections: string[]; missingSections: string[] } {
    const foundSections: string[] = []
    const missingSections: string[] = []
    
    for (const section of this.role.expectedSections) {
      if (this.resumeText.includes(section.toLowerCase())) {
        foundSections.push(section)
      } else {
        missingSections.push(section)
      }
    }
    
    return { foundSections, missingSections }
  }

  private detectActionVerbs(): boolean {
    return this.role.actionVerbs.some(verb => 
      this.resumeText.includes(verb.toLowerCase())
    )
  }

  private detectQuantifiedAchievements(): boolean {
    const patterns = [
      /\d+%/,
      /\d+x/,
      /\$\d+/,
      /\d+\s*(users|customers|clients)/,
      /increased.*\d+/,
      /reduced.*\d+/,
      /improved.*\d+/,
    ]
    
    return patterns.some(pattern => pattern.test(this.resumeText))
  }

  private calculateScore(
    matchedSkills: Skill[],
    foundSections: string[],
    hasActionVerbs: boolean,
    hasQuantifiedAchievements: boolean
  ): number {
    const skillScore = (matchedSkills.length / this.role.requiredSkills.length) * 80
    const sectionScore = (foundSections.length / this.role.expectedSections.length) * 10
    const verbBonus = hasActionVerbs ? 5 : 0
    const metricsBonus = hasQuantifiedAchievements ? 5 : 0
    
    return Math.round(skillScore + sectionScore + verbBonus + metricsBonus)
  }

  private generateSuggestions(
    missingSkills: Skill[],
    missingSections: string[],
    hasActionVerbs: boolean,
    hasQuantifiedAchievements: boolean
  ): string[] {
    const suggestions: string[] = []
    
    if (missingSkills.length > 0) {
      const skillNames = missingSkills.map(s => s.name).join(', ')
      suggestions.push(`Add these missing skills to your resume: ${skillNames}`)
    }
    
    if (!hasActionVerbs) {
      suggestions.push(`Use more action verbs like: ${this.role.actionVerbs.slice(0, 5).join(', ')}`)
    }
    
    if (missingSections.length > 0) {
      suggestions.push(`Add missing sections: ${missingSections.join(', ')}`)
    }
    
    if (!hasQuantifiedAchievements) {
      suggestions.push('Add quantified achievements (e.g., "Increased performance by 40%", "Reduced load time by 2 seconds")')
    }
    
    // Add role-specific suggestion
    suggestions.push(`Consider tailoring your resume specifically for this ${this.role.title} role`)
    
    return suggestions
  }
}
