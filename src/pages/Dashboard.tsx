import { useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { roleDatabase, roleCategories } from '@/data/roleDatabase'
import { ATSEngine } from '@/services/atsEngine'
import { Upload, Target, TrendingUp, BookOpen, Sparkles } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export function Dashboard() {
  const [resumeText, setResumeText] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const navigate = useNavigate()

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let text = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map((item: any) => item.str).join(' ')
        text += pageText + ' '
      }

      setResumeText(text)
    } catch (error) {
      console.error('Error parsing PDF:', error)
      alert('Failed to parse PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = () => {
    if (!resumeText || !selectedRole) {
      alert('Please upload a resume and select a role')
      return
    }

    const role = roleDatabase.find(r => r.id === selectedRole)
    if (!role) return

    const engine = new ATSEngine(resumeText, role)
    const result = engine.analyze()

    localStorage.setItem('ats_result', JSON.stringify(result))
    localStorage.setItem('selected_role', JSON.stringify(role))
    navigate('/results')
  }

  const groupedRoles = roleCategories.map(category => ({
    category,
    roles: roleDatabase.filter(r => r.category === category),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Resume <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Analyzer</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Upload your resume, select a target role, and get detailed insights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Resume Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Upload Resume</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upload your PDF resume for analysis</p>
                </div>
              </div>

              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-900/50">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-lg font-medium mb-1">
                    {fileName ? fileName : 'Click to upload your PDF resume'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PDF files only, max 10MB
                  </p>
                  {loading && (
                    <p className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Processing...
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Target Role Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-3">Target Role</h3>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value="">Select a job role...</option>
                {groupedRoles.map(({ category, roles }) => (
                  <optgroup key={category} label={category}>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!resumeText || !selectedRole || loading}
              className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Analyze Resume
            </button>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-4">
            {/* ATS Score Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">ATS Score</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get your resume scored against ATS requirements
                  </p>
                </div>
              </div>
            </div>

            {/* Skill Gap Analysis Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Skill Gap Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Find missing skills categorized by level
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Resources Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Learning Resources</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get curated resources for each missing skill
                  </p>
                </div>
              </div>
            </div>

            {/* Supported Roles Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-5">
              <h3 className="font-semibold mb-2">Supported Roles</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                100+ roles across 13 categories including Engineering, Data & AI, Security, Cloud, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
