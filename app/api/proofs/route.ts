import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { Proof } from '@/lib/types'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await sql`
    SELECT * FROM proofs
    WHERE clerk_user_id = ${userId}
    ORDER BY registered_at DESC
  `
  return NextResponse.json({ proofs: rows as Proof[] })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await currentUser()
  const body = await req.json()

  const { file_name, file_size, file_type, sha256_hash, title, description, tags, is_public } = body

  if (!file_name || !file_size || !file_type || !sha256_hash) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const rows = await sql`
      INSERT INTO proofs (clerk_user_id, user_email, user_name, file_name, file_size, file_type, sha256_hash, title, description, tags, is_public)
      VALUES (
        ${userId},
        ${user?.emailAddresses[0]?.emailAddress ?? null},
        ${user?.fullName ?? user?.username ?? null},
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
