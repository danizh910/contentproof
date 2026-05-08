import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/neon'
import { Proof } from '@/lib/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const rows = await getDb()`
    SELECT * FROM proofs
    WHERE short_id = ${id} AND is_public = true
    LIMIT 1
  `

  if (!rows[0]) {
    return NextResponse.json({ error: 'Proof not found' }, { status: 404 })
  }

  const verCount = await getDb()`
    SELECT COUNT(*) as count FROM verifications WHERE proof_id = ${(rows[0] as Proof).id}
  `

  return NextResponse.json({
    proof: rows[0] as Proof,
    verification_count: Number(verCount[0]?.count ?? 0),
  })
}
