import Link from 'next/link'
import { ForgotPasswordForm } from './forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Reset your password</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
