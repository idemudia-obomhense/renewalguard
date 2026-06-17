import Link from 'next/link'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Welcome back</h1>
      <p className="mb-6 text-sm text-muted-foreground">Sign in to manage your renewals.</p>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </>
  )
}
