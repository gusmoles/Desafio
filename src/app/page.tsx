"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Estados para cadastro
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerEmailError, setRegisterEmailError] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    console.log("URL error param:", errorParam);
    if (errorParam === "CredentialsSignin") {
      setTab('login');
      setLoginError("Credenciais inválidas, por favor tente novamente.");
      // Clear the error parameter from URL to prevent reload loops
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [searchParams]);

  function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    if (!validateEmail(registerEmail)) {
      setRegisterEmailError("E-mail inválido");
      return;
    }
    setRegisterEmailError("");
    if (registerPassword.length < 8) {
      setRegisterError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("As senhas não coincidem.");
      return;
    }
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao cadastrar usuário.");
        setRegisterSuccess("Cadastro realizado com sucesso! Faça login.");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
        setRegisterName("");
        setTab('login'); // Troca para aba de login automaticamente
      })
      .catch((err) => {
        setRegisterError(err.message);
      });
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    console.log("=== Login Submit Started ===");
    setLoginError("");
    setLoginLoading(true);
    if (!validateEmail(loginEmail)) {
      setLoginEmailError("E-mail inválido");
      setLoginLoading(false);
      return;
    }
    console.log("LoginEmail:", loginEmail);
    console.log("LoginPassword:", loginPassword);
    setLoginEmailError("");

    console.log("About to call signIn...");
    signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    }).then((res) => {
      console.log("=== SignIn Response ===", res);
      setLoginLoading(false);
      console.log("Resultado do signIn:", res); // DEBUG
      if (res?.ok === true && !res?.error) {
        console.log("Login successful, navigating to /parabens");
        router.push("/parabens");
      } else {
        console.log("Login failed:", res?.error);
        setLoginError("Credenciais inválidas, por favor tente novamente.");
      }
    }).catch((error) => {
      console.error("SignIn error:", error);
      setLoginLoading(false);
      setLoginError("Erro inesperado. Tente novamente.");
    });
  }

  return (
    <div
      className="min-h-screen w-full flex md:flex-row flex-col"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Lado esquerdo: box centralizada (mobile: ocupa toda a tela, desktop: metade esquerda) */}
      <div
        className="flex-1 flex items-center justify-center md:bg-white md:w-1/2 w-full min-h-screen md:min-h-0"
      >
        <div className="w-full max-w-sm md:max-w-md bg-white rounded-2xl shadow-md p-6 relative overflow-hidden min-h-[480px] md:my-0 my-8 flex flex-col items-center md:items-start">
          {/* Logo */}
          <div className="flex justify-center md:justify-start mb-6 md:ml-2 w-full">
            <img src="/logo.svg" alt="Logo" className="h-8" />
          </div>
          {/* Abas */}
          <div className="flex justify-center md:justify-start mb-6 bg-blue-50 rounded-full p-1 w-fit mx-auto md:ml-2">
            <button
              className={`px-6 py-2 rounded-full font-medium text-xs focus:outline-none transition-colors duration-200 ${tab === 'login' ? 'bg-white text-gray-900' : 'text-gray-400'}`}
              onClick={() => setTab('login')}
              type="button"
            >
              Entrar
            </button>
            <button
              className={`px-6 py-2 rounded-full font-medium text-xs focus:outline-none transition-colors duration-200 ${tab === 'register' ? 'bg-white text-gray-900' : 'text-gray-400'}`}
              onClick={() => setTab('register')}
              type="button"
            >
              Cadastrar
            </button>
          </div>
          {/* Renderizar apenas o conteúdo da aba ativa */}
          {tab === 'login' ? (
            <>
              <h2 className="text-2xl font-bold mb-1 text-gray-900 text-center md:text-left w-full">Entrar</h2>
              <p className="text-gray-400 text-sm mb-6 text-center md:text-left w-full">Non sit purus tempus malesuada poten</p>
              <form className="space-y-4" onSubmit={handleLoginSubmit} noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="e-mail@website.com"
                    className="w-full md:w-[384px] px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={loginEmail}
                    onChange={e => {
                      setLoginEmail(e.target.value);
                      if (e.target.value === "") setLoginEmailError("");
                    }}
                    onBlur={() => {
                      if (loginEmail === "") setLoginEmailError("");
                      else if (!validateEmail(loginEmail)) setLoginEmailError("E-mail inválido");
                      else setLoginEmailError("");
                    }}
                  />
                  {loginEmailError && (
                    <p className="text-xs text-red-600 mt-1">{loginEmailError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">Senha</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="min. 8 caracteres"
                    className="w-full md:w-[384px] px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                  />
                  {loginError && (
                    <p className="text-xs text-red-600 mt-1">{loginError}</p>
                  )}
                  {loginLoading && (
                    <p className="text-xs text-blue-600 mt-1">Carregando...</p>
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center text-sm text-gray-900">
                    <input type="checkbox" className="accent-blue-600 mr-2" />
                    Lembrar
                  </label>
                  <a href="#" className="text-xs text-blue-700 font-semibold hover:underline">Esqueceu a senha?</a>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-[384px] bg-blue-900 text-white py-3 rounded-lg font-semibold text-base hover:bg-blue-800 transition"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Entrando..." : "Entrar"}
                </button>
                <button
                  type="button"
                  className="w-full md:w-[384px] flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg font-medium text-base bg-white text-gray-900 hover:bg-gray-50 transition mt-2"
                >
                  <img src="/google.svg" alt="Google" className="h-5 w-5" />
                  Entrar com o Google
                </button>
              </form>
              <p className="text-center text-xs text-gray-900 mt-6">
                Ainda não tem conta?{' '}
                <button type="button" className="text-blue-700 font-semibold hover:underline" onClick={() => setTab('register')}>
                  Assine agora
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1 text-gray-900 text-center md:text-left w-full">Cadastrar</h2>
              <p className="text-gray-400 text-sm mb-6 text-center md:text-left w-full">Non sit purus tempus malesuada poten</p>
              <form className="space-y-4" onSubmit={handleRegisterSubmit} noValidate>
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                  <input
                    type="email"
                    id="register-email"
                    name="register-email"
                    placeholder="e-mail@website.com"
                    className="w-full md:w-[384px] px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={registerEmail}
                    onChange={e => {
                      setRegisterEmail(e.target.value);
                      if (e.target.value === "") setRegisterEmailError("");
                    }}
                    onBlur={() => {
                      if (registerEmail === "") setRegisterEmailError("");
                      else if (!validateEmail(registerEmail)) setRegisterEmailError("E-mail inválido");
                      else setRegisterEmailError("");
                    }}
                  />
                  {registerEmailError && (
                    <p className="text-xs text-red-600 mt-1">{registerEmailError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-900 mb-1">Senha</label>
                  <input
                    type="password"
                    id="register-password"
                    name="register-password"
                    placeholder="min. 8 caracteres"
                    className="w-full md:w-[384px] px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-900 mb-1">Confirmar senha</label>
                  <input
                    type="password"
                    id="register-confirm-password"
                    name="register-confirm-password"
                    placeholder="Digite a mesma senha escolhida"
                    className="w-full md:w-[384px] px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={registerConfirmPassword}
                    onChange={e => setRegisterConfirmPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="register-name" className="block text-sm font-medium text-gray-900 mb-1">Nome</label>
                  <input
                    type="text"
                    id="register-name"
                    name="register-name"
                    placeholder="Seu nome completo"
                    className="w-full md:w-[384px] px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={registerName}
                    onChange={e => setRegisterName(e.target.value)}
                  />
                </div>
                <div className="flex items-center mb-2">
                  <input type="checkbox" className="accent-blue-600 mr-2" required />
                  <span className="text-sm text-gray-900">Concordo com os <a href="#" className="text-blue-700 font-semibold hover:underline">Termos e Condições</a></span>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-[384px] bg-blue-900 text-white py-3 rounded-lg font-semibold text-base hover:bg-blue-800 transition"
                >
                  Cadastrar
                </button>
                {registerError && (
                  <p className="text-xs text-red-600 mt-2">{registerError}</p>
                )}
                {registerSuccess && (
                  <p className="text-xs text-green-600 mt-2">{registerSuccess}</p>
                )}
                <button
                  type="button"
                  className="w-full md:w-[384px] flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg font-medium text-base bg-white text-gray-900 hover:bg-gray-50 transition mt-2"
                >
                  <img src="/google.svg" alt="Google" className="h-5 w-5" />
                  Entrar com o Google
                </button>
              </form>
              <p className="text-center text-xs text-gray-900 mt-6">
                Já tem conta?{' '}
                <button type="button" className="text-blue-700 font-semibold hover:underline" onClick={() => setTab('login')}>
                  Entre aqui
                </button>
              </p>
            </>
          )}
        </div>
      </div>
      {/* Lado direito: imagem de fundo e frase (apenas desktop) */}
      <div
        className="hidden md:flex w-1/2 min-h-screen relative items-center justify-center"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-left">
          <h2 className="text-[50px] font-bold text-gray-900 mb-1 leading-tight">
            A Revolução do<br />Marketing por<br />
            <span className="text-cyan-400">Influência</span>
          </h2>
        </div>
      </div>
    </div>
  );
}