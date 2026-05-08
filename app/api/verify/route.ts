import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/neon'
import { Proof, VerifyResult } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { hash } = await req.json()

  if (!hash || typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash)) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 400 })
  }

  const rows = await getDb()`
    SELECT * FROM proofs
    WHERE sha256_hash = ${hash} AND is_public = true
    LIMIT 1
  `

  const proof = rows[0] as Proof | undefined
  const result: VerifyResult['status'] = proof ? 'match' : 'not_found'

  await getDb()`
    INSERT INTO verifications (proof_id, submitted_hash, result)
    VALUES (${proof?.id ?? null}, ${hash}, ${result})
  `

  return NextResponse.json({
    status: result,
    proof: proof ?? null,
    submittedHash: hash,
  } as VerifyResult)
}
