import { createSignal, createEffect } from 'solid-js';
import Brand from '../components/Brand'; // adjust path if needed


export default function LoginForm() {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [errors, setErrors] = createSignal<{email?: string, password?: string}>({});
  const [isLoading, setIsLoading] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {};
    
    if (!email()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password()) {
      newErrors.password = 'Password is required';
    } else if (password().length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login attempt:', { email: email(), password: password() });
      alert('Login successful! (This is just a demo)');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear errors when user starts typing
  createEffect(() => {
    if (email() && errors().email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  });

  createEffect(() => {
    if (password() && errors().password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  });

return (
  <div class="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      {/* Logo in top-left */}
      <header class="absolute top-4 left-4">
        <Brand />
      </header>
      <div class="max-w-md w-full space-y-8">

        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="text-center">
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>
          
          <form class="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div class="space-y-4">
              {/* Email Input */}
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div class="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    class={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors ${
                      errors().email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-gray-50 hover:bg-white focus:bg-white'
                    }`}
                    placeholder="Enter your email"
                  />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                {errors().email && (
                  <p class="mt-1 text-sm text-red-600 flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {errors().email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div class="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword() ? 'text' : 'password'}
                    autocomplete="current-password"
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                    class={`appearance-none relative block w-full px-3 py-3 pr-10 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors ${
                      errors().password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-gray-50 hover:bg-white focus:bg-white'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword())}
                  >
                    {showPassword() ? (
                      <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors().password && (
                  <p class="mt-1 text-sm text-red-600 flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {errors().password}
                  </p>
                )}
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading()}
                class={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                  isLoading() 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:transform active:scale-95'
                }`}
              >
                {isLoading() ? (
                  <div class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Sign up link */}
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Sign up for free
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
