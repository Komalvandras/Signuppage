// src/components/SignupForm.tsx
import { createSignal, createEffect, onMount } from "solid-js";
import type { JSX } from "solid-js";
import Brand from "./Brand"; // adjust path if Brand lives elsewhere

export default function SignupForm(): JSX.Element {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [acceptedTerms, setAcceptedTerms] = createSignal(false);

  const [errors, setErrors] = createSignal<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const [isLoading, setIsLoading] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);

  const [successMsg, setSuccessMsg] = createSignal<string | null>(null);

  onMount(() => console.log("SignupForm hydrated"));

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validateForm = () => {
    const next: Record<string, string> = {};

    if (!firstName().trim()) next.firstName = "First name is required";
    if (!lastName().trim()) next.lastName = "Last name is required";

    const e = email().trim();
    if (!e) next.email = "Email is required";
    else if (!validateEmail(e)) next.email = "Please enter a valid email address";

    const p = password();
    if (!p) next.password = "Password is required";
    else if (p.length < 8) next.password = "Password must be at least 8 characters";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(p)) {
      next.password = "Password must contain uppercase, lowercase, and a number";
    }

    if (!confirmPassword()) next.confirmPassword = "Please confirm your password";
    else if (p !== confirmPassword()) next.confirmPassword = "Passwords do not match";

    if (!acceptedTerms()) next.terms = "You must accept the terms";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    console.log("Submitting signup form");
    e.preventDefault();
    setSuccessMsg(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: firstName(),
          lastName: lastName(),
          email: email(),
          password: password(), // 
        }),
      });

      const payload = await res.json();

      if (!res.ok) {
        alert(payload?.error || "Failed to create account");
        return;
      }

      setSuccessMsg("Account created successfully!");
      // reset fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptedTerms(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // clear field-specific errors as user fixes input
  createEffect(() => { if (firstName() && errors().firstName) setErrors(p => ({ ...p, firstName: undefined })); });
  createEffect(() => { if (lastName() && errors().lastName) setErrors(p => ({ ...p, lastName: undefined })); });
  createEffect(() => { if (email() && errors().email) setErrors(p => ({ ...p, email: undefined })); });
  createEffect(() => { if (password() && errors().password) setErrors(p => ({ ...p, password: undefined })); });
  createEffect(() => { if (confirmPassword() && errors().confirmPassword) setErrors(p => ({ ...p, confirmPassword: undefined })); });
  createEffect(() => { if (acceptedTerms() && errors().terms) setErrors(p => ({ ...p, terms: undefined })); });

  return (
    <div class="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 sm:px-6 lg:px-8">
      {/* Logo in top-left */}
      <header class="absolute top-4 left-4">
        <Brand />
      </header>

      <div class="max-w-md w-full space-y-8">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="text-center">
            <h2 class="mt-2 text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p class="mt-2 text-sm text-gray-600">Join us today! Please fill in your details.</p>
          </div>

          {/* Success banner */}
          {successMsg() && (
            <div class="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-sm">
              {successMsg()}
            </div>
          )}

          {/* noValidate so our custom validation runs first */}
          <form class="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div class="space-y-4">
              {/* Names */}
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autocomplete="given-name"
                    value={firstName()}
                    onInput={(e) => setFirstName(e.currentTarget.value)}
                    class={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors ${
                      errors().firstName ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                    }`}
                    placeholder="First name"
                  />
                  {errors().firstName && <p class="mt-1 text-sm text-red-600">{errors().firstName}</p>}
                </div>

                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autocomplete="family-name"
                    value={lastName()}
                    onInput={(e) => setLastName(e.currentTarget.value)}
                    class={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors ${
                      errors().lastName ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                    }`}
                    placeholder="Last name"
                  />
                  {errors().lastName && <p class="mt-1 text-sm text-red-600">{errors().lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  class={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors ${
                    errors().email ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                  }`}
                  placeholder="Enter your email"
                />
                {errors().email && <p class="mt-1 text-sm text-red-600">{errors().email}</p>}
              </div>

              {/* Password */}
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div class="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword() ? "text" : "password"}
                    autocomplete="new-password"
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                    class={`appearance-none relative block w-full px-3 py-3 pr-10 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors ${
                      errors().password ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword())}
                  >
                    <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword() ? (
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors().password && <p class="mt-1 text-sm text-red-600">{errors().password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <div class="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword() ? "text" : "password"}
                    autocomplete="new-password"
                    value={confirmPassword()}
                    onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                    class={`appearance-none relative block w-full px-3 py-3 pr-10 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors ${
                      errors().confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                  >
                    <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword() ? (
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors().confirmPassword && <p class="mt-1 text-sm text-red-600">{errors().confirmPassword}</p>}
              </div>
            </div>

            {/* Terms */}
            <div class="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms()}
                onInput={(e) => setAcceptedTerms(e.currentTarget.checked)}
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                I agree to the{" "}
                <a href="#" class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">Terms and Conditions</a>{" "}
                and{" "}
                <a href="#" class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">Privacy Policy</a>
              </label>
            </div>
            {errors().terms && <p class="text-sm text-red-600 -mt-2">{errors().terms}</p>}

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading()}
                class={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                  isLoading()
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 active:scale-95"
                }`}
              >
                {isLoading() ? (
                  <div class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </div>

            {/* Sign in link */}
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/" class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">Sign in here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}