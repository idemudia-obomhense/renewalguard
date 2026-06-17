import { ResetPasswordForm } from './reset-password-form'

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Set a new password</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Choose a new password for your account.
      </p>
      <ResetPasswordForm />
    </>
  )
}
