import { describe, it, expect } from 'vitest'
import { transformAnalysisResult } from './analysis'
import type { LegacyAnalysisResult } from './analysis'

describe('transformAnalysisResult', () => {
  it('transforms legacy format correctly', () => {
    const legacy: LegacyAnalysisResult = {
      score: 72,
      score_breakdown: { keywords: 80, semantic: 65, tone: 70 },
      keywords: { missing: ['Docker'], present: ['Python', 'React'] },
      suggestions: [
        { type: 'critical', title: 'Add Docker', description: 'Include Docker experience' },
      ],
      summary: 'Good match overall.',
    }

    const result = transformAnalysisResult(legacy)

    expect(result.score).toBe(72)
    expect(result.breakdown.keywords).toBe(80)
    expect(result.breakdown.semantic).toBe(65)
    expect(result.breakdown.tone).toBe(70)
    expect(result.keywords.missing).toEqual(['Docker'])
    expect(result.keywords.present).toEqual(['Python', 'React'])
    expect(result.suggestions).toHaveLength(1)
    expect(result.summary).toBe('Good match overall.')
  })

  it('transforms v2 format with evaluation', () => {
    // Using plain object since HybridV2Result is not exported
    const v2 = {
      score: 85,
      interpretation: 'STRONG MATCH',
      scoring_method: 'hybrid_v2',
      keyword_analysis: {
        present: [{ keyword: 'Python', tier: 1, match_type: 'EXACT' }],
        missing: [{ keyword: 'Rust', tier: 2, match_type: 'NONE' }],
      },
      dimensions: {
        keyword_presence: { score: 90, label: 'Keyword Presence', description: '', weight: 0.4 },
        job_alignment: { score: 75, label: 'Job Alignment', description: '', weight: 0.25 },
        resume_quality: { score: 80, label: 'Resume Quality', description: '', weight: 0.35 },
      },
      summary: 'Strong candidate.',
      evaluation: {
        hiring: { status: 'READY' as const, summary: 'Ready', reassurance: 'No changes needed' },
        ats: { status: 'PASS' as const, checks: ['Keywords present'], summary: 'Passes ATS' },
        search: { status: 'DISCOVERABLE' as const, matched: 5, total: 6, terms: ['Python'], summary: 'Good visibility' },
        alignment: { score: 85, label: 'Excellent', strengths: ['Python'], refinements: [] },
        readability: { label: 'Strong', notes: [] },
        verdict: { ready_to_submit: true, message: 'Ready', stop_optimizing: true },
      },
    }

    const result = transformAnalysisResult(v2 as Parameters<typeof transformAnalysisResult>[0])

    expect(result.score).toBe(85)
    expect(result.keywords.present).toContain('Python')
    expect(result.keywords.missing).toContain('Rust')
    expect(result.evaluation?.hiring.status).toBe('READY')
  })

  it('handles v2 format without evaluation gracefully', () => {
    const minimal = {
      score: 50,
      interpretation: 'BORDERLINE',
      scoring_method: 'hybrid_v2',
      summary: 'Minimal result.',
    }

    const result = transformAnalysisResult(minimal as Parameters<typeof transformAnalysisResult>[0])

    expect(result.score).toBe(50)
    expect(result.keywords.missing).toEqual([])
    expect(result.keywords.present).toEqual([])
    expect(result.summary).toBe('Minimal result.')
  })
})
