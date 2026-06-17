import Link from 'next/link'
import { SignupForm } from './signup-form'

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Create your account</h1>
      <p className="mb-6 text-sm text-muted-foreground">Start tracking your renewals in minutes.</p>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
