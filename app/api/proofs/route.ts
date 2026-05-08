import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/neon'
import { Proof } from '@/lib/types'

// Session-based ownership — clerk_user_id column stores a browser-generated UUID.
// When Clerk is added later, replace sessionId with auth().userId and run a migration.

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session')
  if (!sessionId) return NextResponse.json({ proofs: [] })

  const rows = await getDb()`
    SELECT * FROM proofs
    WHERE clerk_user_id = ${sessionId}
    ORDER BY registered_at DESC
  `
  return NextResponse.json({ proofs: rows as Proof[] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { session_id, file_name, file_size, file_type, sha256_hash, title, description, tags, is_public } = body

  if (!session_id || !file_name || !file_size || !file_type || !sha256_hash) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const rows = await getDb()`
      INSERT INTO proofs (clerk_user_id, file_name, file_size, file_type, sha256_hash, title, description, tags, is_public)
      VALUES (
        ${session_id},
        ${file_name},
        ${file_size},
        ${file_type},
        ${sha256_hash},
        ${title ?? null},
        ${description ?? null},
        ${tags ?? []},
        ${is_public ?? true}
      )
      RETURNING *
    `
    return NextResponse.json({ proof: rows[0] as Proof }, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('unique')) {
      return NextResponse.json({ error: 'This file has already been registered' }, { status: 409 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Failed to register proof' }, { status: 500 })
  }
}
