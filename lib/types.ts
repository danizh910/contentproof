export interface Proof {
  id: string
  clerk_user_id: string
  user_email: string | null
  user_name: string | null
  file_name: string
  file_size: number
  file_type: string
  sha256_hash: string
  title: string | null
  description: string | null
  tags: string[]
  is_public: boolean
  registered_at: string
  expires_at: string | null
  short_id: string
}

export interface Verification {
  id: string
  proof_id: string | null
  submitted_hash: string
  result: 'match' | 'mismatch' | 'not_found'
  verified_at: string
}

export interface HashResult {
  hash: string
  fileName: string
  fileSize: number
  fileType: string
  computedAt: Date
}

export interface VerifyResult {
  status: 'match' | 'mismatch' | 'not_found'
  proof?: Proof
  submittedHash: string
}
